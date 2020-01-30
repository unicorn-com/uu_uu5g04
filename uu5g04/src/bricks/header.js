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

import Jumbotron from "./jumbotron.js";

import "./header.less";
//@@viewOff:imports

export const Header = UU5.Common.VisualComponent.create({
  displayName: "Header", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.LevelMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.EditableMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Header"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("header"),
      text: "uu5-common-text",
      underline: ns.css("header-underline"),
      jumbotronContent: ns.css("header-jumbotron-content")
    },
    editableComponent: "UU5.BricksEditable.Header"
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    underline: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      underline: undefined // default: false
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
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const level = this.getLevel();
    let result;
    let attrs = this.getMainAttrs();
    attrs.className += " " + this.getClassName("text");

    if (level > 0) {
      this.props.underline && (attrs.className += " " + this.getClassName("underline"));

      result = UU5.Common.Element.create("h" + level, attrs, this.getChildren(), this.getDisabledCover());
    } else {
      result = (
        <Jumbotron
          disabled={this.isDisabled()}
          hidden={this.isHidden()}
          selected={this.isSelected()}
          colorSchema={this.props.colorSchema}
          id={this.props.id}
          mainAttrs={attrs}
          tooltip={attrs.title}
        >
          <h1 className={this.getClassName("jumbotronContent") + " " + this.getClassName("text")}>
            {this.getChildren()}
          </h1>
        </Jumbotron>
      );
    }

    return this.getNestingLevel() ? result : null;
  }
  //@@viewOff:render
});

export default Header;
