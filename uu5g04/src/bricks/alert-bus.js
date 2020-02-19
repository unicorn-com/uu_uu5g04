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

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Alert from "./alert.js";
import AlertBusMulti from "./internal/alert-bus-multi.js";
import "./alert-bus.less";
//@@viewOff:imports

//TODO FOR NOW, this component should be from uu5
const MODALS_ID = "uu5-modals";

const COLOR_SCHEMA_PRIORITY = ["danger", "success", "warning", "info"];

const ALERT_TYPES = ["priority", ...COLOR_SCHEMA_PRIORITY, "other", "outOfOrder"];

const getSetAlertState = (newAlertProps, state, order) => {
  let newState = getClearAlertState(state);

  if (Array.isArray(newAlertProps)) {
    newAlertProps.forEach(singleAlertProps => {
      newState = getAddedAlertState(singleAlertProps, newState, order);
    });
  } else {
    newState = getAddedAlertState(newAlertProps, newState, order);
  }

  return newState;
};

const getAddedAlertState = (newAlertProps, state, order) => {
  let newState = { ...state };

  if (newAlertProps.priority) {
    newState.priorityStack = [...newState.priorityStack, newAlertProps];
  } else {
    let foundPriority =
      order && newAlertProps.colorSchema
        ? COLOR_SCHEMA_PRIORITY.find(priorityColorSchema => priorityColorSchema === newAlertProps.colorSchema)
        : "other";

    if (foundPriority) {
      newState[`${foundPriority}Stack`] = [...newState[`${foundPriority}Stack`], newAlertProps];
    } else {
      newState.otherStack = [...newState.otherStack, newAlertProps];
    }
  }

  return newState;
};

const getRemovedAlertState = (removedAlertId, state) => {
  let newState = { ...state };

  ALERT_TYPES.find(alertType => {
    return !!state[`${alertType}Stack`].find((stateObject, index) => {
      if (stateObject.id === removedAlertId) {
        newState[`${alertType}Stack`] = [...newState[`${alertType}Stack`]];
        newState[`${alertType}Stack`].splice(index, 1);
        return true;
      } else return false;
    });
  });

  if (newState.outOfOrderStack.length) {
    newState.outOfOrderStack.forEach(outOfOrderAlert => outOfOrderAlert.positionInStack--);
  }

  let fullStackLength = 0;
  ALERT_TYPES.forEach(alertType => (fullStackLength += newState[`${alertType}Stack`].length));
  newState.showAll = newState.showAll && fullStackLength > 4;

  return newState;
};

const getClearAlertState = state => {
  let newState = { ...state };

  // empty the existing stacks
  ALERT_TYPES.forEach(alertType => {
    newState[`${alertType}Stack`] = [];
  });

  newState.showAll = false;

  return newState;
};

export const AlertBus = UU5.Common.VisualComponent.create({
  displayName: "AlertBus", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.CcrWriterMixin,
    UU5.Common.PureRenderMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("AlertBus"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: () => ns.css("alert-bus")
    },
    warnings: {
      noMessage: 'Alert "%s" is not set.'
    },
    opt: {
      nestingLevelWrapper: true
    },
    lsi: () => UU5.Environment.Lsi.Bricks.alertBus
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    // has not color schema because color schema css class is added automatically to all alerts,
    // but we just need to set color schema of added alert
    colorSchema: UU5.PropTypes.oneOf(UU5.Environment.colorSchema),
    position: UU5.PropTypes.string,
    closeTimer: UU5.PropTypes.number,
    closeDisabled: UU5.PropTypes.bool,
    block: UU5.PropTypes.bool,
    onClose: UU5.PropTypes.func,
    descending: UU5.PropTypes.bool,
    stacked: UU5.PropTypes.bool,
    offsetTop: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string, UU5.PropTypes.oneOf(["auto"])]),
    location: UU5.PropTypes.oneOf(["portal", "local", "page"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      colorSchema: null,
      position: "center",
      closeTimer: 10000,
      closeDisabled: false,
      block: false,
      onClose: null,
      descending: undefined,
      stacked: false,
      offsetTop: 0,
      location: "page"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // prop is deprecated
    // eslint-disable-next-line react/prop-types
    if (this.props.forceRender) {
      UU5.Common.Tools.warning('Property "forceRender" is deprecated! Use "location" property instead.');
    }

    return {
      priorityStack: [],
      dangerStack: [],
      successStack: [],
      warningStack: [],
      infoStack: [],
      otherStack: [],
      outOfOrderStack: [],
      showAll: false
    };
  },

  componentWillUnmount() {
    this._removePortal();
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  addAlert(alertProps, setStateCallback) {
    if (alertProps.content) {
      alertProps = this._getNewAlertProps(alertProps);
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      if (this.props.location === "page" && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
        page.getAlertBus().addAlert(alertProps, setStateCallback);
      } else {
        this.setState(
          state => getAddedAlertState(alertProps, state, this.props.descending === undefined),
          setStateCallback
        );
      }
    } else {
      this.showWarning("noMessage", alertProps.content, { alertProps });
    }
    return this;
  },

  addAlertToPosition(alertIndex, alertProps, setStateCallback) {
    if (alertProps.content) {
      alertProps = this._getNewAlertProps(alertProps);
      alertProps.positionInStack = alertIndex;
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      if (this.props.location === "page" && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
        page.getAlertBus().addAlertToPosition(alertIndex, alertProps, setStateCallback);
      } else {
        this.setState(state => {
          let outOfOrderStack = [...state.outOfOrderStack, alertProps];
          return { outOfOrderStack };
        }, setStateCallback);
      }
    } else {
      this.showWarning("noMessage", alertProps.content, { alertProps: alertProps });
    }

    return this;
  },

  setAlert(alertProps, setStateCallback) {
    if (alertProps.content) {
      alertProps = this._getNewAlertProps(alertProps);
      let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
      if (this.props.location === "page" && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
        page.getAlertBus().setAlert(alertProps, setStateCallback);
      } else {
        this.setState(
          state => getSetAlertState(alertProps, state, this.props.descending === undefined),
          setStateCallback
        );
      }
    } else {
      this.showWarning("noMessage", alertProps.content, { alertProps: alertProps });
    }
    return this;
  },

  setAlerts(alertStack, setStateCallback) {
    let stateAlertStack = alertStack.slice();
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    if (this.props.location === "page" && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
      page.getAlertBus().setAlerts(stateAlertStack, setStateCallback);
    } else {
      stateAlertStack = stateAlertStack.map(singleAlertProps => this._getNewAlertProps(singleAlertProps));
      this.setState(
        state => getSetAlertState(stateAlertStack, state, this.props.descending === undefined),
        setStateCallback
      );
    }
    return this;
  },

  removeAlert(alertId, setStateCallback) {
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    if (this.props.location === "page" && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
      page.getAlertBus().removeAlert(alertId, setStateCallback);
    } else {
      this.setState(state => {
        return { ...getRemovedAlertState(alertId, state) };
      }, setStateCallback);
    }

    return this;
  },

  clearAlerts(setStateCallback) {
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    if (this.props.location === "page" && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
      page.getAlertBus().clearAlerts(setStateCallback);
    } else {
      let props = this._getNextAlertProps();
      if (props) {
        props.hidden = true;

        this.setState(
          state => ({ ...getClearAlertState(state), ...{ priorityStack: [props] } }),
          () => {
            setTimeout(() => {
              this.setAsyncState(state => getClearAlertState(state), setStateCallback);
            }, Alert.defaults.transitionDuration);
          }
        );
      } else {
        typeof setStateCallback === "function" && setStateCallback();
      }
    }
    return this;
  },

  getAlerts() {
    let result = [];
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);

    if (this.props.location === "page" && page && page.getAlertBus() && page.getAlertBus().getId() !== this.getId()) {
      result = page.getAlertBus().getAlerts();
    } else {
      ALERT_TYPES.forEach(alertType => (result = [...result, ...this.state[`${alertType}Stack`]]));
    }

    return result;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getPortalElem(allowCreateElement) {
    // create portal in DOM
    let result = document.getElementById(MODALS_ID);
    if (!result && allowCreateElement) {
      result = document.createElement("div");
      result.setAttribute("id", MODALS_ID);
      document.body.appendChild(result);
    }

    return result;
  },

  _removePortal() {
    // try to remove portal from DOM if does not exists
    if (!this.state.open) {
      const portal = this._getPortalElem();
      if (portal && portal.childNodes.length === 0) {
        portal.parentNode.removeChild(portal);
      }
    }
  },

  _isPageAlertBus() {
    let page = this.getCcrComponentByKey(UU5.Environment.CCRKEY_PAGE);
    return this.props.location === "page" && page && page.getAlertBus() && page.getAlertBus().getId() === this.getId();
  },

  _getNewAlertProps(alertProps) {
    alertProps = alertProps || {};
    let messageId = alertProps.id || UU5.Common.Tools.generateUUID();

    return {
      id: messageId,
      hidden: false,

      content: alertProps.content,
      header: alertProps.header,
      colorSchema: typeof alertProps.colorSchema === "string" ? alertProps.colorSchema : this.props.colorSchema,
      closeTimer: typeof alertProps.closeTimer === "number" ? alertProps.closeTimer : this.props.closeTimer,
      closeDisabled: alertProps.closeDisabled === undefined ? this.props.closeDisabled : alertProps.closeDisabled,
      key: messageId,
      onClose: alert => {
        let onClose;

        if (typeof alertProps.onClose === "function") {
          onClose = () => {
            alertProps.onClose(alert);
          };
        } else if (typeof this.props.onClose === "function") {
          onClose = () => {
            this.props.onClose(alert);
          };
        }

        this.removeAlert(messageId, onClose);
      }
    };
  },

  _showAll() {
    this.setState({ showAll: true });
  },

  _clearAll() {
    this.clearAlerts();
  },

  _getFullAlertStack() {
    let stack = [];

    if (this.props.descending === true) {
      stack = [...this.state.priorityStack, ...[...this.state.otherStack].reverse()];
    } else {
      ALERT_TYPES.forEach(alertType => {
        if (alertType !== "outOfOrder") {
          // outOfOrderStack is done separately at the end of this fn
          let stateKey = this.state[`${alertType}Stack`];
          if (stateKey.length) {
            stack = [...stack, ...stateKey];
          }
        }
      });
    }

    if (this.state.outOfOrderStack.length) {
      this.state.outOfOrderStack.forEach(outOfOrderAlert =>
        stack.splice(outOfOrderAlert.positionInStack, 0, outOfOrderAlert)
      );
    }

    return stack;
  },

  _getNextAlertProps() {
    let alertProps;

    if (this.state.outOfOrderStack.length) {
      this.state.outOfOrderStack.find(outOfOrderAlert => {
        if (outOfOrderAlert.positionInStack === 0) {
          alertProps = outOfOrderAlert;
          return true;
        } else {
          return false;
        }
      });
    }

    if (!alertProps) {
      ALERT_TYPES.find(alertType => {
        if (alertType !== "outOfOrder") {
          // outOfOrderStack is done separately above
          let stateKey = this.state[`${alertType}Stack`];
          if (stateKey.length) {
            alertProps = stateKey[0];
            return true;
          } else {
            return false;
          }
        }
      });
    }

    if (!alertProps) {
      alertProps = { hidden: true };
    }

    alertProps = UU5.Common.Tools.merge(this.getMainPropsToPass(), alertProps);
    alertProps.key && (alertProps.id = this.getId() + "-alert-" + alertProps.key);
    alertProps.position = this.props.position;
    alertProps.block = this.props.block;
    alertProps.offsetTop = this.props.offsetTop;

    return alertProps;
  },

  _getAlert() {
    let result;

    if (this.props.stacked) {
      result = (
        <AlertBusMulti
          {...this.getMainPropsToPass()}
          id={this.getId() + "-alert"}
          stack={this._getFullAlertStack()}
          position={this.props.position}
          block={this.props.block}
          offsetTop={this.props.offsetTop}
          showAll={this.state.showAll}
          onShowAll={this._showAll}
          onClearAll={this._clearAll}
          location={this._isPageAlertBus ? "page" : "local"}
        />
      );
    } else {
      result = <Alert {...this._getNextAlertProps()} />;
    }

    return this.props.location === "portal" ? UU5.Common.Portal.create(result, this._getPortalElem(true)) : result;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    if (!this.getNestingLevel()) {
      return null;
    } else {
      return this._getAlert();
    }
  }
  //@@viewOff:render
});

export default AlertBus;
