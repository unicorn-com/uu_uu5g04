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
import * as UU5 from "uu5g04";
import { TAG, css, Font } from "./config.js";
//@@viewOff:imports

export const Row = UU5.Common.VisualComponent.create({
  displayName: "Row", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: TAG + "Row",
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBox"),
    classNames: {
      main: () => css`
        margin: 4px 0;
        width: 100%;
        padding: 3px 0 4px;
      `,
      ellipsis: () => css`
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      `,
      flex: () => css`
        display: flex;
      `,
    },
    opt: {
      pureRender: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    size: UU5.PropTypes.oneOf(["s", "m"]),
    weight: UU5.PropTypes.oneOf(["primary", "normal", "secondary"]),
    ellipsis: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      weight: "normal",
      ellipsis: false,
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
  _containsColumn(children) {
    return (
      !!children &&
      typeof children.find === "function" &&
      children.find((child) => child.type && child.type.tagName === "UU5.BlockLayout.Column")
    );
  },

  _getMainAttrs(flex) {
    let attrs = this.getMainAttrs();

    let classNames = [Font[this.props.weight]()];
    if (this.props.size === "s") classNames.push(Font.sizeS());
    if (this.props.ellipsis) classNames.push(this.getClassName("ellipsis"));
    if (flex) classNames.push(this.getClassName("flex"));

    classNames.forEach((className) => {
      attrs.className += " " + className;
    });

    return attrs;
  },

  _getChild() {
    const children = this.getChildren();
    let flex = this._containsColumn(children);

    return (
      <div {...this._getMainAttrs(flex)}>
        {children}
        {this.getDisabledCover()}
      </div>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? this._getChild() : null;
  },
  //@@viewOff:render
});

export default Row;
