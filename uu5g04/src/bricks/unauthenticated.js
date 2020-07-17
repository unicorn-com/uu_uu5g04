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
import Lsi from "./bricks-lsi";
import Css from "./internal/css.js";
//@@viewOff:imports

export const Unauthenticated = UU5.Common.VisualComponent.create({
  displayName: "Unauthenticated", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Unauthenticated"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("unauthenticated"),
      blockRoot: ({ width, height }) => Css.css`
        display: ${width ? "inline-flex" : "flex"};
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: ${UU5.Environment.colors.grey.c500};
        padding: 8px;
        ${width ? `width: ${UU5.Common.Tools.fillUnit(width)};` : ""}
        ${height ? `height: ${UU5.Common.Tools.fillUnit(height)};` : ""}
      `,
      inlineRoot: ({ width, height }) => Css.css`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: ${UU5.Environment.colors.grey.c500};
        padding: 0 4px;
        ${width ? `width: ${UU5.Common.Tools.fillUnit(width)};` : ""}
        ${height ? `height: ${UU5.Common.Tools.fillUnit(height)};` : ""}
      `,
      textWrapper: (props, { nestingLevel }) => Css.css`
        ${nestingLevel ? "margin-top: 16px;" : "margin-left: 4px;"}
      `,
      icon: (props, { nestingLevel }) => Css.css`
        ${nestingLevel ? "font-size: 32px" : ""}
      `,
      loginLink: (props, { nestingLevel }) => Css.css`
        ${nestingLevel ? "margin-top: 16px;" : "margin-left: 4px;"}
        color: inherit;
        text-decoration: underline;
      `
    },
    lsi: () => Lsi.unauthenticated
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    width: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    height: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    content: UU5.PropTypes.any
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      width: undefined,
      height: undefined,
      content: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getContent() {
    return this.props.content || this.props.children
      ? UU5.Utils.Content.getChildren(this.props.content || this.props.children, this.props, this.constructor)
      : this.getLsiComponent("text");
  },

  _getLoginLink() {
    return (
      <UU5.Common.Identity>
        {({ identity, login }) => {
          return !identity ? (
            <UU5.Bricks.Link
              onClick={() => login()}
              content={this.getLsiComponent("login")}
              className={this.getClassName("loginLink")}
            />
          ) : null;
        }}
      </UU5.Common.Identity>
    );
  },

  _getMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    if (this.getNestingLevel()) {
      mainAttrs.className += " " + this.getClassName("blockRoot");
    } else {
      mainAttrs.className += " " + this.getClassName("inlineRoot");
    }

    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    if (this.getNestingLevel()) {
      return (
        <div {...this._getMainAttrs()}>
          <UU5.Bricks.Icon icon="mdi-account-key" className={this.getClassName("icon")} />
          <div className={this.getClassName("textWrapper")}>{this._getContent()}</div>
          {this._getLoginLink()}
        </div>
      );
    } else {
      return (
        <span {...this._getMainAttrs()}>
          <UU5.Bricks.Icon icon="mdi-account-key" className={this.getClassName("icon")} />
          <div className={this.getClassName("textWrapper")}>{this._getContent()}</div>
          {this._getLoginLink()}
        </span>
      )
    }
  }
  //@@viewOff:render
});

export default Unauthenticated;
