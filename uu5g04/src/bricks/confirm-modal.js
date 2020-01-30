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

import Modal from "./modal.js";

import "./confirm-modal.less";
//@@viewOff:imports

const PORTAL_ID = "uu5-bricks-confirm-modal-portal";

export const ConfirmModal = UU5.Common.VisualComponent.create({
  displayName: "ConfirmModal", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.SectionMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ConfirmModal"),
    classNames: {
      main: ns.css("confirm-modal"),
      confirmFooter: ns.css("confirm-modal-footer")
    },
    lsi: () => UU5.Environment.Lsi.Bricks.confirmModal
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: UU5.PropTypes.oneOf(["s", "m", "l", "auto"]),
    onRefuse: UU5.PropTypes.func,
    onConfirm: UU5.PropTypes.func,
    confirmButtonProps: UU5.PropTypes.object,
    refuseButtonProps: UU5.PropTypes.object,
    confirmButtonLeft: UU5.PropTypes.bool,
    sticky: UU5.PropTypes.bool,
    stickyBackground: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "s",
      onRefuse: undefined,
      onConfirm: undefined,
      confirmButtonProps: undefined,
      refuseButtonProps: undefined,
      confirmButtonLeft: undefined,
      sticky: true,
      stickyBackground: true
    };
  },

  getInitialState() {
    // initialize object for comopnent Modal
    this._refs = {};

    return {
      props: {},
      isOpened: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  open(props = {}, setStateCallback) {
    this.setState({ props, isOpened: true }, setStateCallback);
  },

  close(setStateCallback) {
    this._refuse(setStateCallback);
  },

  isOpened() {
    return this.state.isOpened;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerModal(modal) {
    this._refs.modal = modal;
    modal.open();
  },

  _closeDialog(setStateCallback) {
    if (this._refs.modal) {
      this._refs.modal.close(false, () => this._close(setStateCallback));
    } else {
      this._close(setStateCallback);
    }
  },

  _close(setStateCallback) {
    delete this._refs.modal;
    this.setState({ isOpened: false }, (...params) => {
      this._tryToRemovePortal();
      setStateCallback && setStateCallback(...params);
    });
  },

  _renderFooter(opts) {
    const ConfirmButton = (
      <UU5.Bricks.Button
        colorSchema="primary"
        {...opts.confirmButtonProps}
        id="confirm-button"
        onClick={opts.onConfirm}
      >
        {this.getLsiValue("confirmButtonText")}
      </UU5.Bricks.Button>
    );
    const RefuseButton = (
      <UU5.Bricks.Button {...opts.refuseButtonProps} id="refuse-button" onClick={opts.onRefuse}>
        {this.getLsiValue("refuseButtonText")}
      </UU5.Bricks.Button>
    );

    return (
      <div className={this.getClassName("confirmFooter")}>
        {opts.confirmButtonLeft && ConfirmButton}
        {RefuseButton}
        {!opts.confirmButtonLeft && ConfirmButton}
      </div>
    );
  },

  _getPortalElem(allowCreateElement) {
    // create portal in DOM
    let result = document.getElementById(PORTAL_ID);
    if (!result && allowCreateElement) {
      result = document.createElement("div");
      result.setAttribute("id", PORTAL_ID);
      document.body.appendChild(result);
    }

    return result;
  },

  _tryToRemovePortal() {
    // try to remove portal from DOM if does not exists
    if (!this.state.isOpened) {
      const portal = this._getPortalElem();
      if (portal && portal.childNodes.length === 0) {
        portal.parentNode.removeChild(portal);
      }
    }
  },

  _confirm(callback) {
    const onConfirm = this.state.props.onConfirm || this.props.onConfirm;
    this._closeDialog(() => {
      typeof onConfirm === "function" && onConfirm();
      typeof callback === "function" && callback();
    });
  },

  _refuse(callback) {
    const onRefuse = this.state.props.onRefuse || this.props.onRefuse;
    this._closeDialog(() => {
      typeof onRefuse === "function" && onRefuse();
      typeof callback === "function" && callback();
    });
  },
  //@@viewOff:private

  // Render

  //@@viewOn:render
  render() {
    // onConfirm and onRefuse is used only to filter this props from propagation to component Modal
    // eslint-disable-next-line no-unused-vars
    let { confirmButtonProps, refuseButtonProps, confirmButtonLeft, onRefuse, onConfirm, ...props } = {
      ...this.props,
      ...this.state.props
    };

    return this.state.isOpened
      ? UU5.Common.Portal.create(
          <Modal
            {...props}
            ref_={this._registerModal}
            onClose={this._refuse}
            forceRender={true}
            footer={this._renderFooter({
              confirmButtonProps,
              refuseButtonProps,
              confirmButtonLeft,
              onRefuse: this._refuse,
              onConfirm: this._confirm
            })}
          />,
          this._getPortalElem(true)
        )
      : null;
  }
  //@@viewOff:render
});

export default ConfirmModal;
