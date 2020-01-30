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

import Span from "./span.js";
import { Div } from "./factory.js";

import "./loading.less";
//@@viewOff:imports

export const Loading = UU5.Common.VisualComponent.create({
  displayName: "Loading", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Loading"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "inline"),
    classNames: {
      main: ns.css("loading uu5-common-padding-xs"),
      animated: ns.css("loading-animated"),
      inline: "uu5-common-inline",
      dot: ns.css("loading-dot")
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    inline: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      inline: false
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
  _getMainProps: function() {
    let attrs = this.getMainAttrs();
    !this.getChildren() && !this.props.text && (attrs.className += " " + this.getClassName().animated);
    (this.props.inline || this.getNestingLevel() == "inline") && (attrs.className += " " + this.getClassName().inline);
    attrs.nestingLevel = this.getNestingLevel();
    if (this.isDisabled()) {
      attrs.disabled = true;
    }
    return attrs;
  },

  _getDefaultContent: function() {
    return UU5.Common.Children.toArray([1, 2, 3].map(() => <span className={this.getClassName().dot} />));
  },

  _getInlineContent() {
    return UU5.Common.Children.toArray([1, 2, 3].map(() => <span className={this.getClassName().dot}>.</span>));
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    let isInline = this.props.inline || this.getNestingLevel() == "inline";
    let Comp = isInline ? Span : Div;
    return (
      <Comp {...this._getMainProps()}>
        {this.getChildren() || (isInline ? this._getInlineContent() : this._getDefaultContent())}
      </Comp>
    );
  }
  //@@viewOff:render
});

export default Loading;
