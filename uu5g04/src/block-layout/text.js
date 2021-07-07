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

export const Text = UU5.Common.VisualComponent.create({
  displayName: "Text", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ContentMixin,
    UU5.Common.PureRenderMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: TAG + "Text",
    nestingLevel: "inline",
    classNames: {
      main: () => css`
        .uu5-bricks-link & {
          color: inherit;
        }
      `,
      icon: () => css`
        font-size: 1.2em;
        margin-right: 8px;

        .${Font.sizeS()} & {
          margin-right: 4px;
        }
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
    icon: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      size: "m",
      weight: "normal",
      icon: undefined,
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
  _getMainAttrs() {
    let attrs = this.getMainAttrs();

    let classNames = ["uu5-common-text", Font[this.props.weight]()];
    if (this.props.size === "s") classNames.push(Font.sizeS());

    classNames.forEach((className) => {
      attrs.className += " " + className;
    });

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <span {...this._getMainAttrs()}>
        {this.props.icon && <UU5.Bricks.Icon className={this.getClassName("icon")} icon={this.props.icon} />}
        {this.getChildren()}
        {this.getDisabledCover()}
      </span>
    ) : null;
  },
  //@@viewOff:render
});

export default Text;
