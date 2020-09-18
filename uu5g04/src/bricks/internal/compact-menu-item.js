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

//@@viewOn:revision
// coded: Martin Mach, 09.09.2020
// reviewed: Filip Janovský, 14.09.2020 - approved
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "../bricks-ns.js";
import Css from "./css.js";
//@@viewOff:imports

const classNames = {
  item: (isClickable, removeRightPadding) =>
    ns.css("compact-menu-item") +
    " " +
    Css.css`
    height: 32px;
    padding: 6px 16px 7px;
    display: flex;
    align-items: center;
    white-space: nowrap;

    ${
      isClickable
        ? `
          cursor: pointer;
          &:hover {
            text-decoration: none;
            background-color: #E0E0E0;
          }
          && {
            color: rgba(0, 0, 0, 0.87);
          }
        `
        : ""
    }
    ${
      removeRightPadding
        ? `
          padding-right: 0;
        `
        : ""
    }
  `,
  itemContentWrapper: () => Css.css`
    flex-grow: 1;
  `,
  icon: () => Css.css`
    width: 32px;
    font-size: 1.4em;
  `,
  header: () => {
    return (
      classNames.item() +
      " " +
      Css.css`
      font-size: 0.86em;
      color: rgba(0, 0, 0, 0.54);
      background-color: #F5F5F5;
      line-height: 26px;
      padding: 8px 16px;
      height: auto;
    `
    );
  },
  separator: () => Css.css`
    height: 1px;
    background: #BDBDBD;
    margin: 2px 0;
  `
};

export const propTypes = {
  header: UU5.PropTypes.bool,
  separator: UU5.PropTypes.bool,
  label: UU5.PropTypes.node,
  href: UU5.PropTypes.string,
  onClick: UU5.PropTypes.func,
  onCtrlClick: UU5.PropTypes.func,
  onWheelClick: UU5.PropTypes.func,
  smoothScroll: UU5.PropTypes.number,
  offset: UU5.PropTypes.number,
  target: UU5.PropTypes.string,
  disabled: UU5.PropTypes.bool,
  hidden: UU5.PropTypes.bool,
  icon: UU5.PropTypes.string,
  items: UU5.PropTypes.arrayOf(UU5.PropTypes.object)
};

//@@viewOn:statics
const STATICS = {
  tagName: ns.name("CompactMenu")
};
//@@viewOff:statics

export const CompactMenu = UU5.Common.VisualComponent.create({
  ...STATICS,
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:propTypes
  propTypes,
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      header: false,
      separator: false,
      label: null,
      href: null,
      onClick: null,
      onCtrlClick: null,
      onWheelClick: null,
      smoothScroll: 1000,
      offset: null,
      target: "_self",
      disabled: false,
      hidden: false,
      icon: undefined,
      items: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _isClickable() {
    return !this.props.disabled && !this.props.header && !!(this.props.onClick || this.props.href);
  },

  _hasItems() {
    return Array.isArray(this.props.items);
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    if (this.props.hidden) {
      return null;
    } else if (this.props.separator) {
      return <UU5.Bricks.Div className={classNames.separator()} />;
    } else if (this.props.header) {
      return (
        <UU5.Bricks.Div className={classNames.header()}>
          {UU5.Utils.Content.getChildren(this.props.label, this.props, STATICS)}
        </UU5.Bricks.Div>
      );
    } else {
      let propsToPass = {
        ...this.props,
        className: UU5.Common.Tools.joinClassNames(
          this.props.className,
          classNames.item(this._isClickable(), this._hasItems())
        )
      };
      return (
        <UU5.Bricks.Link {...propsToPass} colorSchema="custom">
          {this.props.icon ? <UU5.Bricks.Icon icon={this.props.icon} className={classNames.icon(false)} /> : null}
          <span className={classNames.itemContentWrapper()}>
            {UU5.Utils.Content.getChildren(this.props.label, this.props, STATICS)}
          </span>
          {this._hasItems() ? <UU5.Bricks.Icon icon="mdi-menu-right" className={classNames.icon(true)} /> : null}
        </UU5.Bricks.Link>
      );
    }
  }
  //@@viewOff:render
});

export default CompactMenu;
