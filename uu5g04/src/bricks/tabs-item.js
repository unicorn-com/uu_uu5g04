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

import "./tabs-item.less";
//@@viewOff:imports

export default UU5.Common.VisualComponent.create({
  displayName: "tabs-item", // for backward compatibility (test snapshots)

  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.SectionMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Tabs.Item"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("tabs-item", "tabs-item-pane"),
      visible: ns.css("tabs-item-visible"),
      fade: ns.css("tabs-item-fade ")
    },
    opt: {
      nestingLevelWrapper: true
    },
    errors: {
      invalidParent: "Parent of this component is not Tabs."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    _fade: UU5.PropTypes.bool,
    _active: UU5.PropTypes.bool,
    _onDisable: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      _fade: false,
      _active: false,
      _onDisable: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillMount: function() {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isTabs)) {
      this.showError("invalidParent");
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  setDisabledValue_(value, setStateCallback) {
    if (typeof this.props.getButton === "function") {
      let button = this.props.getButton();

      if (button) {
        button.setDisabledValue(value);
      }
    }

    this.setDisabledValueDefault(value, setStateCallback);
  },

  toggleDisabled_(setStateCallback) {
    if (typeof this.props.getButton === "function") {
      let button = this.props.getButton();

      if (button) {
        button.toggleDisabled();
      }
    }

    this.toggleDisabledDefault(setStateCallback);
  },

  setHiddenValue_(value, setStateCallback) {
    if (typeof this.props.getButton === "function") {
      let button = this.props.getButton();

      if (button) {
        button.setHiddenValue(value);
      }
    }

    this.setHiddenValueDefault(value, setStateCallback);
  },

  toggleHidden_(setStateCallback) {
    if (typeof this.props.getButton === "function") {
      let button = this.props.getButton();

      if (button) {
        button.toggleHidden();
      }
    }

    this.toggleHiddenDefault(setStateCallback);
  },
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let mainAttrs = this.getMainAttrs();

    if (this.props._active) {
      mainAttrs.className += " " + this.getClassName("visible");
    }

    if (this.props._fade) {
      mainAttrs.className += " " + this.getClassName("fade");
    }

    return this.getNestingLevel() ? (
      <div {...mainAttrs}>
        {this.getChildren()}
        {this.getDisabledCover()}
      </div>
    ) : null;
  }

  //@@viewOff:render
});
