import ListenerRegistry from "./internal/listener-registry";

const eventStorageMap = new Map();
const CUSTOM_KEY = "custom";

function listenerBubbling(e) {
  eventStorageMap.get(e.currentTarget)?.[e.type]?.bubbling?.run(e);
}
function listenerCapturing(e) {
  eventStorageMap.get(e.currentTarget)?.[e.type]?.capturing?.run(e);
}

export const EventManager = {
  // opts e.g. { capture: true, passive: true }, but only if element is given
  register(event, fn, element = null, opts) {
    if (typeof fn === "function") {
      if (element != null && typeof element.addEventListener !== "function") {
        let error = new Error(`Invalid element for registering '${event}' event listener: ${element}`);
        error.detail = { element };
        throw error;
      }

      let elementKey = element || CUSTOM_KEY;
      let elementEvents = eventStorageMap.get(elementKey);
      if (!elementEvents) eventStorageMap.set(elementKey, (elementEvents = {}));

      if (!element) {
        let registry = elementEvents[event];
        if (!registry) elementEvents[event] = registry = new ListenerRegistry();
        registry.register(fn);
      } else {
        let key = opts?.capture ? "capturing" : "bubbling";
        if (!elementEvents[event]) elementEvents[event] = {};
        let registry = elementEvents[event][key];
        if (!registry) elementEvents[event][key] = registry = new ListenerRegistry();
        registry.register(fn);

        if (registry.size() === 1) {
          element.addEventListener(event, opts?.capture ? listenerCapturing : listenerBubbling, opts);
        }
      }
    } else {
      throw new Error(`Invalid listener function for '${event}' event listener (it is not a function).`);
    }
  },

  unregister(event, fn, element = null, opts) {
    if (typeof fn === "function") {
      if (element != null && typeof element.addEventListener !== "function") {
        let error = new Error(`Invalid element for unregistering '${event}' event listener: ${element}`);
        error.detail = { element };
        throw error;
      }

      let elementEvents = eventStorageMap.get(element || CUSTOM_KEY);
      if (elementEvents) {
        let eventLists = elementEvents[event];
        if (eventLists) {
          if (!element) {
            let registry = eventLists;
            registry.unregister(fn);
            if (registry.size() === 0) {
              delete elementEvents[event];
              if (Object.keys(elementEvents).length === 0) {
                eventStorageMap.delete(element);
              }
            }
          } else {
            let key = opts?.capture ? "capturing" : "bubbling";
            let registry = eventLists[key];
            if (registry) {
              registry.unregister(fn);
              if (registry.size() === 0) {
                if (element) {
                  element.removeEventListener(event, opts?.capture ? listenerCapturing : listenerBubbling, opts);
                }
                delete eventLists[key];
                if (Object.keys(eventLists).length === 0) {
                  delete elementEvents[event];
                  if (Object.keys(elementEvents).length === 0) {
                    eventStorageMap.delete(element);
                  }
                }
              }
            }
          }
        }
      }
    } else {
      throw new Error(`Invalid listener function for '${event}' event listener (it is not a function).`);
    }
  },

  trigger(key, ...args) {
    // e.g. arguments = ["lsi", "cs-cz"]
    let registry = eventStorageMap.get(CUSTOM_KEY)?.[key];
    if (registry) {
      registry.run(...args);
    }
  },
};

export default EventManager;
