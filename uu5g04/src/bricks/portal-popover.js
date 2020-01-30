/**
 * Copyright (C) import UU5 from "uu5g04";
2019 Unicorn a.s.
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
import ns from "./bricks-ns.js";

import Popover from "./popover.js";
//@@viewOff:imports

//TODO FOR NOW, this component should be from uu5
const MODALS_ID = "uu5-modals";

export const PortalPopover = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("PortalPopover"),
    classNames: {
      main: ns.css("portal-popover")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    ...Popover.propTypes
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
    return {
      open: this.props.shown
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  open(opt, setStateCallback) {
    this.setState({ open: true }, () => this._onOpen(opt, setStateCallback));
  },

  close(...args) {
    this._popover.close(...args);
  },

  isOpen() {
    return this.state.open;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerPopover(popover) {
    this._popover = popover;
  },

  _onOpen(opt, setStateCallback) {
    this._popover.open(opt, setStateCallback);
  },

  _onClose(opt) {
    this._close(() => {
      if (typeof this.props.onClose === "function") {
        this.props.onClose(opt);
      } else if (typeof opt.callback === "function") {
        opt.callback();
      }
    });
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
    return (
      this.state.open &&
      UU5.Common.Portal.create(
        <Popover {...this.props} ref_={this._registerPopover} onClose={this._onClose} forceRender />,
        this._getPortalElem(true)
      )
    );
  }
  //@@viewOff:render
});

export default PortalPopover;
