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
import ns from "../forms-ns.js";

import "./message.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "message", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ContentMixin, UU5.Common.ColorSchemaMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Message"),
    classNames: {
      main: ns.css("message")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  shouldComponentUpdate_(newProps, newState) {
    let result = false;
    if (newProps.content !== this.props.content || newProps.colorSchema !== this.props.colorSchema) {
      result = true;
    }
    return result;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainPropsToPass() {
    let props = this.getMainPropsToPass();
    this.props.colorSchema && (props.className += " uu5-common-text");
    props.content = props.content || this.getChildren();
    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    let Component = this.props.inline ? UU5.Bricks.Span : UU5.Bricks.Div;
    return <Component {...this._getMainPropsToPass()} />;
  }
  //@@viewOn:render
});
