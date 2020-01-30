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

import Modal from "./modal";
//@@viewOff:imports

//TODO FOR NOW, this component should be from uu5
const MODALS_ID = "uu5-modals";

export const PortalModal = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("PortalModal"),
    classNames: {
      main: ns.css("portal-modal")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    ...Modal.propTypes
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      shown: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._preventOnCloseCall = false;

    return {
      props: undefined,
      open: this.props.shown
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  open(props = {}, setStateCallback) {
    this.setState({ props, open: true }, setStateCallback);
  },

  close(shouldOnClose, ...args) {
    if (shouldOnClose === false) {
      shouldOnClose = true;
      this._preventOnCloseCall = true;
    }

    this._modal.close(shouldOnClose, ...args);
  },

  isOpen() {
    return this.state.open;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerModal(ref) {
    this._modal = ref;
    ref.open();
  },

  _onClose(opt, props) {
    this._modal.onCloseDefault(opt);
    setTimeout(
      () =>
        this._close(() => {
          if (!this._preventOnCloseCall) {
            if (typeof props.onClose === "function") {
              props.onClose(opt);
            } else if (typeof opt.callback === "function") {
              opt.callback();
            }
          }
          this._preventOnCloseCall = false;
        }),
      500
    );
  },

  _close(setStateCallback) {
    this.setState({ open: false }, () => {
      this._removePortal();
      setStateCallback && setStateCallback();
    });
  },

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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const props = { ...this.props, ...this.state.props };

    return (
      this.state.open &&
      UU5.Common.Portal.create(
        // arrow fn has to be used because props has to be sent to the _onClose fn
        // eslint-disable-next-line react/jsx-no-bind
        <Modal {...props} ref_={this._registerModal} onClose={opt => this._onClose(opt, props)} forceRender />,
        this._getPortalElem(true)
      )
    );
  }
  //@@viewOff:render
});

export default PortalModal;
