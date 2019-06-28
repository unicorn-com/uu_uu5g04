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

import React from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";

const MAIN_CLASS_NAME = ns.css("editation-panel");

export const EditationPanel = createReactClass({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("EditationPanel"),
    classNames: {
      main: () =>
        MAIN_CLASS_NAME +
        " " +
        UU5.Common.Css.css(`
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #E3E3E3;

          > * {
            min-width: 0px;
          }
        `),
      defaultToolbar: UU5.Common.Css.css(` flex: 0 0 auto; `)
    },
    lsi: Lsi.editablePanel
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onEndEditation: PropTypes.func,
    settingsContent: PropTypes.any,
    settingsInModal: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      onEndEditation: null,
      settingsContent: null,
      settingsInModal: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:standardComponentLifeCycle
  //@@viewOff:standardComponentLifeCycle

  //@@viewOn:interface
  openSettings(...args) {
    if (this.props.settingsInModal) {
      this._modal.open(...args);
    } else {
      this._popover.open(...args);
    }
    this.setState({ openedSettings: true });
  },
  closeSettings(...args) {
    if (this.props.settingsInModal) {
      this._modal.close(...args);
    } else {
      this._popover.close(...args);
    }
    this.setState({ openedSettings: false });
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:componentSpecificHelpers
  _registerModal(modal) {
    this._modal = modal;
  },

  _registerPopover(popover) {
    this._popover = popover;
  },

  _openSettings(component) {
    this.openSettings({
      aroundElement: component.findDOMNode(),
      position: "bottom-left",
      onClose: this.props.settingsInModal ? undefined : this._onClose
    });
  },

  _onClose(opt) {
    if (this.props.settingsInModal) {
      opt.component.close(false);
    }
    this.setState({ openedSettings: false });
  },
  //@@viewOff:componentSpecificHelpers

  //@@viewOn:render
  render() {
    return (
      <div {...this.getMainAttrs()}>
        <div>{this.props.children}</div>
        <div className={this.getClassName("defaultToolbar")}>
          {typeof this.props.onEndEditation === "function" && (
            <UU5.Bricks.Button
              onClick={this.props.onEndEditation}
              bgStyle="transparent"
              colorSchema="green"
              borderRadius="12px"
              size="s"
            >
              {this.getLsiValue("endEditation")}
            </UU5.Bricks.Button>
          )}
          {this.props.settingsContent && [
            <UU5.Bricks.Button
              key="props-button"
              title={this.getLsiValue("propsButtonTitle")}
              className={this.getClassName("leftButton")}
              onClick={this._openSettings}
              bgStyle="transparent"
              size="s"
              borderRadius="12px"
              ref_={this._registerButton}
              colorSchema="default"
              pressed={this.state.openedSettings}
              tooltip={this.getLsiValue("moreSettingsTooltip")}
            >
              <UU5.Bricks.Icon icon="mdi-settings" />
            </UU5.Bricks.Button>,
            this.props.settingsInModal && (
              <UU5.Bricks.Modal key="edit-modal" ref_={this._registerModal} forceRender controlled={false} size="m" onClose={this._onCloseModal}>
                {this.props.settingsContent}
              </UU5.Bricks.Modal>
            ),
            !this.props.settingsInModal && (
              <UU5.Bricks.Popover key="edit-popover" ref_={this._registerPopover} forceRender controlled={false}>
                {this.props.settingsContent}
              </UU5.Bricks.Popover>
            )
          ]}
        </div>
      </div>
    );
  }
  //@@viewOff:render
});

export default EditationPanel;
