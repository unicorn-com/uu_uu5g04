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
import React from "react";
import ns from "./common-ns.js";
import BaseMixin from "./base-mixin.js";
import ElementaryMixin from "./elementary-mixin.js";
import Tools from "./tools.js";
import PureRenderMixin from "./pure-render-mixin";
import VisualComponent from "./visual-component.js";
//@@viewOff:imports

export const OutlineModal = VisualComponent.create({
  displayName: "OutlineModal", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin, ElementaryMixin, PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Outline.Modal"),
    classNames: {
      main: ns.css("outline-modal")
    },
    errors: {
      invalidParent: "Parent of this component is not Outline."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    return {
      tag: null,
      props: null
    };
  },

  componentWillMount() {
    if (!this.getParentByType("isOutline")) {
      this.showError("invalidParent");
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  open: function(tag, props, setStateCallback) {
    this.setState({ shown: true, tag: tag, props: props }, setStateCallback);
    return this;
  },

  close: function(setStateCallback) {
    this.setState({ shown: false, tag: null, props: null }, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    let props = Tools.mergeDeep({}, this.getMainPropsToPass(), {
      shown: this.state.shown,
      header: this.state.tag,
      content: <pre>{this.state.props}</pre>
    });
    return Tools.findComponent("UU5.Bricks.Modal", props);
  }
  //@@viewOff:render
});

export default OutlineModal;
