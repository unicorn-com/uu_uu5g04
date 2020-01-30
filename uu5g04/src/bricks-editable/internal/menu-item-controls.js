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
import "uu5g04-bricks";

import Css from "./css.js";
import ns from "../bricks-editable-ns.js";
//@@viewOff:imports

function isMobileVersion(screenSize) {
  return ["xs", "s", "m"].indexOf(screenSize) > -1 || UU5.Common.Tools.isMobileOrTablet;
}

const MenuItemControls = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ColorSchemaMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("MenuItemControls"),
    classNames: {
      main: (props, state) =>
        ns.css("menu-item-controls") +
        " " +
        Css.css(`
        margin-left: 4px;
        ${!isMobileVersion(props.screenSize) && !props.isActive && !state.open ? `&:not(:hover) { opacity: 0; }` : ""}
        ${
          props.isActive
            ? `
          &&&:not(:hover) {
            background-color: transparent
          }
        `
            : ""
        }
      `),
      dropdownBody: () =>
        Css.css(`
        align-items: stretch;
      `),
      item: () =>
        Css.css(`
        align-items: center;
        display: flex;
        box-sizing: border-box;
        height: 32px;
        padding: 6px 16px 7px;
      `),
      itemIconWrapper: () =>
        Css.css(`

      `),
      itemLabelWrapper: () =>
        Css.css(`

      `)
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.array,
    screenSize: UU5.PropTypes.oneOf(["xs", "s", "m", "l", "xl"]),
    isActive: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      items: undefined,
      screenSize: undefined,
      isActive: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      open: false,
      hover: false
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _registerDropdown(ref) {
    this._dropdown = ref;
  },

  _registerButton(ref) {
    this._button = ref;
  },

  _getControlsDropdown() {
    return (
      <UU5.Bricks.PortalPopover ref_={this._registerDropdown} controlled={false}>
        {this.props.items.map((item, index) => {
          return (
            <UU5.Bricks.Button
              key={index}
              // arrow fn necessary to pass item.onClick
              // eslint-disable-next-line react/jsx-no-bind
              onClick={(component, e) => this._onItemClick(e, item.onClick)}
              className={this.getClassName("item")}
              bgStyle="transparent"
              disabled={item.disabled}
            >
              {item.icon ? (
                <span className={this.getClassName("itemIconWrapper")}>
                  <UU5.Bricks.Icon icon={item.icon} />
                </span>
              ) : null}
              <span className={this.getClassName("itemLabelWrapper")}>{item.label}</span>
            </UU5.Bricks.Button>
          );
        })}
      </UU5.Bricks.PortalPopover>
    );
  },

  _openDropdown() {
    if (this.state.open) {
      this._dropdown.open({
        aroundElement: UU5.Common.DOM.findNode(this._button),
        position: "bottom",
        onClose: this._onDropdownClose,
        bodyClassName: this.getClassName("dropdownBody")
      });
    }
  },

  _onDropdownClose() {
    this.setState({ open: false });
  },

  _onMouseOver() {
    this.setState({ hover: true });
  },

  _onMouseOut() {
    this.setState({ hover: false });
  },

  _onItemClick(e, setStateCallback) {
    e.stopPropagation();
    this.setState({ open: false }, setStateCallback);
  },

  _onButtonClick(component, e) {
    e.stopPropagation();
    this.setState(state => ({ open: !state.open }), this._openDropdown);
  },

  _getButtonBgStyle() {
    if ((this.props.isActive && !this.state.hover) || (this.props.isActive && this.state.hover)) {
      return "filled";
    } else {
      return "transparent";
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <>
        <UU5.Bricks.Button
          {...this.getMainPropsToPass()}
          ref_={this._registerButton}
          onClick={this._onButtonClick}
          mainAttrs={{
            onMouseEnter: this._onMouseOver,
            onMouseLeave: this._onMouseOut
          }}
          content={<UU5.Bricks.Icon icon="mdi-dots-vertical" />}
          bgStyle={this._getButtonBgStyle()}
          size="s"
        />
        {this.state.open ? this._getControlsDropdown() : null}
      </>
    );
  }
  //@@viewOff:render
});

export default MenuItemControls;
