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

import Link from "./link.js";
import Header from "./header.js";
import Icon from "./icon.js";

import "./modal-header.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "modal-header", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.PureRenderMixin, UU5.Common.ElementaryMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Modal.Header"),
    classNames: {
      main: ns.css("modal-header"),
      close: ns.css("modal-header-close"),
      title: ns.css("modal-header-title")
    },
    defaults: {
      parentTagName: "UU5.Bricks.Modal",
      closeIcon: "mdi-close"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    _sticky: UU5.PropTypes.bool,
    _onClose: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      _sticky: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillMount: function() {
    this.checkParentTagName(this.getDefault().parentTagName);
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _onCloseHandler: function(e) {
    typeof this.props._onClose === "function" && this.props._onClose(e);
  },

  _getCloseButton: function() {
    var button;
    if (!this.props._sticky) {
      button = (
        <Link className={this.getClassName().close} onClick={this._onCloseHandler} colorSchema="custom">
          <Icon icon={this.getDefault("closeIcon")} />
        </Link>
      );
    }
    return button;
  },

  _buildChildren: function() {
    let content = this.getContent();
    if (typeof content === "string") {
      return <Header level={4} content={content} />;
    } else {
      return <UU5.Common.Div content={this.props.content}>{this.props.children}</UU5.Common.Div>;
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    var mainAttrs = this.getMainAttrs();

    return (
      <div {...mainAttrs}>
        <div className={this.getClassName("title")}>{this.getChildren()}</div>
        {this._getCloseButton()}
        {this.getDisabledCover()}
      </div>
    );
  }
  //@@viewOff:render
});
