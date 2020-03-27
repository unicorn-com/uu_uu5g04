/**
 * Registers/unregisters listeners. Solves issues with listener unregistration while
 * listeners are running.
 */
export class ListenerRegistry {
  LISTENER_LIST = [];
  RUNNING_LISTENERS = [];

  register(listener) {
    if (typeof listener === "function") {
      this.LISTENER_LIST.push(listener);
    }
  }

  unregister(listener) {
    const index = this.LISTENER_LIST.indexOf(listener);
    if (index > -1) {
      this.LISTENER_LIST.splice(index, 1);
      this.RUNNING_LISTENERS.forEach(list => {
        let runningIndex = list.indexOf(listener);
        if (runningIndex > -1) {
          list.splice(runningIndex, 1);
        }
      });
    }
  }

  run(...args) {
    // NOTE This handles cases:
    // 1. Making a list copy - so that iteration does not skip something if a listener unregisters itself during its execution.
    // 2. Listener can perform unmount (e.g. window onresize for useScreenSize) which causes unregistration of multiple other
    //    listeners which we want then not to execute => this is handled in unregister(listener) code above which unregisters
    //    also running listeners.
    // 3. (reentrancy; should not happen) If listener is running and it calls ScreenSize.setSize with different value then
    //    we have two (potentially not entirely same) lists of listeners and unregistration must remove listener
    //    from all of them. That's why RUNING_LISTENERS is a list of listener lists.
    let listCopy = [...this.LISTENER_LIST];
    this.RUNNING_LISTENERS.push(listCopy);
    while (listCopy.length > 0) listCopy.shift()(...args);
    this.RUNNING_LISTENERS.pop();
  }
}
export default ListenerRegistry;
