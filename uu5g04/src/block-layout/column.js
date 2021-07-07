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

export const Column = UU5.Common.VisualComponent.create({
  displayName: "Column", // for backward compatibility (test snapshots)
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
    tagName: TAG + "Column",
    classNames: {
      main: (props) => {
        let styles;

        if (props.width) {
          styles = `width: ${UU5.Common.Tools.fillUnit(props.width)};`;
        } else {
          styles = `flex-grow: 1;`;
        }

        if (props.textAlign) styles += `text-align: ${props.textAlign};`;

        return css(styles);
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    textAlign: UU5.PropTypes.oneOf(["left", "center", "right"]),
    width: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      textAlign: "left",
      width: undefined,
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

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this.getNestingLevel() ? (
      <div {...this._getMainAttrs()}>
        {this.getChildren()}
        {this.getDisabledCover()}
      </div>
    ) : null;
  },
  //@@viewOff:render
});

export default Column;
