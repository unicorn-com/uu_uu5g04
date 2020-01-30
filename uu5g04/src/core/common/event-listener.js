/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import Tools from "./tools.js";
import Lsi from "../utils/lsi.js";
import ScreenSize from "../utils/screen-size.js";
import { Environment } from "../environment/environment.js";

// main visibility API function
// use visibility API to check if current tab is active or not
const visibility = (() => {
  let stateKey,
    eventKey,
    keys = {
      hidden: "visibilitychange",
      webkitHidden: "webkitvisibilitychange",
      mozHidden: "mozvisibilitychange",
      msHidden: "msvisibilitychange"
    };

  for (stateKey in keys) {
    if (stateKey in document) {
      eventKey = keys[stateKey];
      break;
    }
  }

  return c => {
    if (c) document.addEventListener(eventKey, c);
    return !document[stateKey];
  };
})();

export class EventListener {
  constructor() {
    this._events = new Map();

    this._listeners = {
      screenSize: {},
      lsi: {},
      highlight: {},
      dateTime: {},
      number: {},
      loadLibs: {}
    };

    visibility(() =>
      this.triggerEvent("pageVisibility", {
        visible: visibility(),
        focus: Environment.isPageFocused()
      })
    );
    this.addWindowEvent("focus", "windowFocus", () =>
      this.triggerEvent("pageVisibility", {
        visible: Environment.isPageVisible(),
        focus: true
      })
    );
    this.addWindowEvent("blur", "windowBlur", () =>
      this.triggerEvent("pageVisibility", {
        visible: Environment.isPageVisible(),
        focus: false
      })
    );
  }

  registerEvent(key, id, fce) {
    if (typeof fce === "function") {
      let usedFce = fce;
      if (key === "lsi") {
        // TODO because of backward compatibility
        usedFce = function(lang) {
          return fce(lang && typeof lang === "object" ? lang.language : lang); // new API (UU5.Utils.Lsi.setLanguage) sends object { language: "..." }, EventListener's listeners expect string
        };
        if (this._listeners[key] && this._listeners[key][id]) Lsi.unregister(this._listeners[key][id]);
        Lsi.register(usedFce);
      }
      this._listeners[key] = this._listeners[key] || {};
      this._listeners[key][id] = usedFce;
    } else {
      this._writeError(key, id, fce);
    }
    return this;
  }

  triggerEvent() {
    // i.e. arguments = ['lsi', 'cs-cz']
    let [key, ...params] = arguments;
    if (key === "screenSize") ScreenSize.setSize(...params);
    else {
      for (let id in this._listeners[key]) {
        this._listeners[key][id].apply(null, params);
      }
    }
    return this;
  }

  unregisterEvent(key, id) {
    if (this._listeners[key]) {
      // TODO because of backward compatibility
      if (key === "lsi") Lsi.unregister(this._listeners[key][id]);
      delete this._listeners[key][id];
    }
    return this;
  }

  addEvent(object, key, id, fce) {
    if (typeof fce === "function") {
      let targetMap = this._events.get(object);
      if (!targetMap) {
        this._events.set(object, {});
        targetMap = this._events.get(object);
      }

      if (!targetMap[key]) {
        targetMap[key] = targetMap[key] || {};
        object.addEventListener(key, e => {
          for (let id in targetMap[key]) {
            targetMap[key][id](e);
          }
        });
      }

      targetMap[key][id] = fce;
    } else {
      this._writeError(key, id, fce);
    }
    return this;
  }

  removeEvent(object, key, id) {
    let targetMap = this._events.get(object);
    if (targetMap && targetMap[key] && targetMap[key][id]) {
      object.removeEventListener(key, targetMap[key][id]);
      delete targetMap[key][id];
    }
    return this;
  }

  createEvent(object, key, id, fce) {
    UU5.Common.Tools.warning(
      "UU5.Environment.EventListener.createEvent is deprecated! Use UU5.Environment.EventListener.addEvent instead."
    );
    this.addEvent(object, key, id, fce);
  }

  deleteEvent(object, key, id) {
    UU5.Common.Tools.warning(
      "UU5.Environment.EventListener.deleteEvent is deprecated! Use UU5.Environment.EventListener.removeEvent instead."
    );
    this.removeEvent(object, key, id);
  }

  registerBeforeUnload() {
    window.addEventListener("beforeunload", this._onBeforeUnload);
  }

  unregisterBeforeUnload() {
    window.removeEventListener("beforeunload", this._onBeforeUnload);
  }

  registerPageVisibility(id, fce) {
    this.registerEvent("pageVisibility", id, fce);
  }

  unregisterPageVisibility(id) {
    this.unregisterEvent("pageVisibility", id);
  }

  _onBeforeUnload(event) {
    // for FireFox
    event.preventDefault();

    event.returnValue = "";
    return event.returnValue;
  }

  addIdentityChangeListener(session, id, fce) {
    this._addSessionEvent(session, "identityChange", id, fce);
  }

  removeIdentityChangeListener(session, id) {
    this._removeSessionEvent(session, "identityChange", id);
  }

  addSessionExpiringListener(session, id, fce) {
    this._addSessionEvent(session, "sessionExpiring", id, fce);
  }

  removeSessionExpiringListener(session, id) {
    this._removeSessionEvent(session, "sessionExpiring", id);
  }

  addSessionExtendedListener(session, id, fce) {
    this._addSessionEvent(session, "sessionExtended", id, fce);
  }

  removeSessionExtendedListener(session, id) {
    this._removeSessionEvent(session, "sessionExtended", id);
  }

  addWindowEvent(key, id, fce) {
    this.addEvent(window, key, id, fce);
    return this;
  }

  removeWindowEvent(key, id) {
    this.removeEvent(window, key, id);
    return this;
  }

  registerLsi(id, fce) {
    this.registerEvent("lsi", id, fce);
  }

  triggerLsi(lang) {
    this.triggerEvent("lsi", lang);
  }

  unregisterLsi(id) {
    this.unregisterEvent("lsi", id);
  }

  registerScreenSize(id, fce) {
    if ((this._listeners["screenSize"] || {})[id]) ScreenSize.unregister(this._listeners["screenSize"][id]);
    this.registerEvent("screenSize", id, fce);
    ScreenSize.register(fce);
  }

  triggerScreenSize(e, screenSize) {
    this.triggerEvent("screenSize", e, screenSize);
  }

  unregisterScreenSize(id) {
    if ((this._listeners["screenSize"] || {})[id]) ScreenSize.unregister(this._listeners["screenSize"][id]);
    this.unregisterEvent("screenSize", id);
  }

  registerHighlight(id, fce) {
    this.registerEvent("highlight", id, fce);
  }

  triggerHighlight(searchedTexts) {
    this.triggerEvent("highlight", searchedTexts);
  }

  unregisterHighlight(id) {
    this.unregisterEvent("highlight", id);
  }

  registerDateTime(id, fce) {
    this.registerEvent("dateTime", id, fce);
  }

  triggerDateTime(opt) {
    this.triggerEvent("dateTime", opt);
  }

  unregisterDateTime(id) {
    this.unregisterEvent("dateTime", id);
  }

  registerNumber(id, fce) {
    this.registerEvent("number", id, fce);
  }

  triggerNumber(opt) {
    this.triggerEvent("number", opt);
  }

  unregisterNumber(id) {
    this.unregisterEvent("number", id);
  }

  registerLoadLibs(id, fce) {
    this.registerEvent("loadLibs", id, fce);
  }

  triggerLoadLibs(markers) {
    this.triggerEvent("loadLibs", markers);
  }

  unregisterLoadLibs(id) {
    this.unregisterEvent("loadLibs", id);
  }

  _addSessionEvent(session, key, id, fce) {
    if (typeof fce === "function") {
      let targetMap = this._events.get(session);
      if (!targetMap) {
        this._events.set(session, {});
        targetMap = this._events.get(session);
      }

      if (!targetMap[key]) {
        targetMap[key] = targetMap[key] || {};
        session.addListener(key, e => {
          for (let id in targetMap[key]) {
            targetMap[key][id](e);
          }
        });
      }

      targetMap[key][id] = fce;
    } else {
      this._writeError(key, id, fce);
    }
  }

  _removeSessionEvent(session, key, id) {
    let targetMap = this._events.get(session);
    if (targetMap && targetMap[key] && targetMap[key][id]) {
      session.removeListener(key, targetMap[key][id]);
      delete targetMap[key][id];
    }
  }

  _writeError(key, id, fce) {
    Tools.error(`In event "${key}" parameter is not function.`, {
      component: "EventListener",
      id: id,
      function: fce,
      key: key
    });
  }
}

export default EventListener;
