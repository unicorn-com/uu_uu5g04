/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import UU5 from "uu5g04";
import { Content } from "uu5g05";
import ns from "./bricks-ns.js";

import Modal from "./modal.js";
import { RenderIntoPortal } from "./internal/portal.js";
import OptionalLibraries from "./internal/optional-libraries.js";

import "./confirm-modal.less";
//@@viewOff:imports

function g04ButtonToG05ButtonProps(g04Props) {
  if (!g04Props) return;
  const {
    colorSchema,
    bgStyle,
    elevation,
    elevationHover,
    borderRadius, // TODO Maybe map to "elementary", "moderate", ...
    smoothScroll,
    baseline,
    displayBlock,
    offset,
    // TODO href, target, onWheelClick, onCtrlClick
    ...result
  } = g04Props;
  result.colorScheme = UU5.Utils.ColorSchema._toGdsColorScheme(colorSchema);
  let significance;
  if (bgStyle === "filled") significance = colorSchema?.endsWith("-rich") ? "highlighted" : "common";
  else if (bgStyle === "outline" || bgStyle === "underline") significance = "distinct";
  else if (bgStyle === "transparent") significance = "subdued";
  if (significance) result.significance = significance;
  return result;
}

export const ConfirmModal = UU5.Common.VisualComponent.create({
  // eslint-disable-next-line uu5/component-comments
  displayName: "ConfirmModal", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.SectionMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ConfirmModal"),
    classNames: {
      main: ns.css("confirm-modal"),
      confirmFooter: ns.css("confirm-modal-footer"),
    },
    lsi: () => UU5.Environment.Lsi.Bricks.confirmModal,
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
    stickyBackground: UU5.PropTypes.bool,
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
      stickyBackground: true,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize object for comopnent Modal
    this._refs = {};

    return {
      props: {},
      isOpened: undefined,
    };
  },
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
    let { confirmButtonProps, refuseButtonProps, confirmButtonLeft, onRefuse, onConfirm, ...modalProps } = {
      ...this.props,
      ...this.state.props,
    };
    let { size, children, content } = modalProps;

    let result;
    let { Uu5Elements } = OptionalLibraries;
    if (Uu5Elements) {
      let actionList = [
        {
          children: this.getLsiValue("refuseButtonText"),
          significance: "distinct",
          ...g04ButtonToG05ButtonProps(refuseButtonProps),
          onClick: this._refuse,
        },
        {
          children: this.getLsiValue("confirmButtonText"),
          significance: "highlighted",
          ...g04ButtonToG05ButtonProps({
            ...confirmButtonProps,
            colorSchema: confirmButtonProps?.colorSchema || "primary",
          }),
          onClick: this._confirm,
        },
      ];
      if (confirmButtonLeft) actionList = [actionList[1], actionList[0]];
      result =
        this.state.isOpened != null ? (
          <Uu5Elements.Dialog
            open={this.state.isOpened}
            onClose={() => this._close()}
            actionList={actionList}
            width={size === "s" ? 300 : size === "m" ? 600 : size === "l" ? 900 : size === "max" ? "full" : null}
            actionDirection="horizontal"
          >
            {content != null ? <Content>{content}</Content> : children}
          </Uu5Elements.Dialog>
        ) : null;
    } else {
      result = this.state.isOpened ? (
        <RenderIntoPortal>
          <Modal
            {...modalProps}
            ref_={this._registerModal}
            onClose={this._refuse}
            forceRender={true}
            footer={this._renderFooter({
              confirmButtonProps,
              refuseButtonProps,
              confirmButtonLeft,
              onRefuse: this._refuse,
              onConfirm: this._confirm,
            })}
          />
        </RenderIntoPortal>
      ) : null;
    }

    return result;
  },
  //@@viewOff:render
});

export default ConfirmModal;
