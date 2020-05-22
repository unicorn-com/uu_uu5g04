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
import { getPortalElement } from "./internal/portal.js";
//@@viewOff:imports

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

  componentDidMount() {
    UU5.Common.Tools.warning(
      `Component ${this.getTagName()} is deprecated! Use UU5.Bricks.Modal with "location" property instead.`
    );
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
    setTimeout(() => {
      if (this.isRendered()) {
        this._close(() => {
          if (!this._preventOnCloseCall) {
            if (typeof props.onClose === "function") {
              props.onClose(opt);
            } else if (typeof opt.callback === "function") {
              opt.callback();
            }
          }
          this._preventOnCloseCall = false;
        });
      }
    }, 500);
  },

  _close(setStateCallback) {
    this.setState({ open: false }, () => {
      this._removePortal();
      setStateCallback && setStateCallback();
    });
  },

  _removePortal() {
    // try to remove portal from DOM if does not exists
    if (!this.state.open) {
      const portal = getPortalElement();
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
        getPortalElement(true)
      )
    );
  }
  //@@viewOff:render
});

export default PortalModal;
