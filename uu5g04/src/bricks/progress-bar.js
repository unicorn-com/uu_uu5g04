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

import Cover from "./progress-bar-cover.js";
import Item from "./progress-bar-item.js";

import "./progress-bar.less";
//@@viewOff:imports

export const ProgressBar = UU5.Common.VisualComponent.create({
  displayName: "ProgressBar", // for backward compatibility (test snapshots)
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
    tagName: ns.name("ProgressBar"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("progress-bar"),
      size: ns.css("progress-bar-size-")
    },
    defaults: {
      childTagName: "UU5.Bricks.ProgressBar.Item",
      itemName: "progressBarItem"
    },
    warnings: {
      increaseImpossible: "Progress Bar is full. Cannot increase above %d.",
      decreaseImpossible: "Progress Bar is empty. Cannot decrease below %d."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    progress: UU5.PropTypes.number,
    striped: UU5.PropTypes.bool,
    animated: UU5.PropTypes.bool,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      progress: 0,
      striped: false,
      animated: false,
      allowTags: [],
      size: "m"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isProgressBar() {
    return true;
  },

  isPossibleChangeProgress: function(progress) {
    var count = 0;
    this.eachRenderedChild(function(progressBar) {
      count += progressBar.getProgress();
    });
    return count + progress >= 0 && count + progress <= 100;
  },

  isPossibleIncrease: function(increasedValue) {
    return this.isPossibleChangeProgress(increasedValue);
  },

  isPossibleDecrease: function(decreasedValue) {
    return this.isPossibleChangeProgress(-decreasedValue);
  },

  getProgress: function(name) {
    return this._getProgressBarItem(name).getProgress();
  },

  setProgress: function(params, setStateCallback) {
    typeof params === "number" && (params = { value: params });
    return this._getProgressBarItem(params.name).setProgress(params, setStateCallback);
  },

  // value number or object {value, name,  content, striped, animated}
  increase: function(params, setStateCallback) {
    typeof params === "number" && (params = { value: params });

    if (this.isPossibleIncrease(params.value)) {
      this._getProgressBarItem(params.name).increase(params, setStateCallback);
    } else {
      this.showWarning("increaseImpossible", params.value);
    }
    return this;
  },

  decrease: function(params, setStateCallback) {
    typeof params === "number" && (params = { value: params });

    if (this.isPossibleDecrease(params.value)) {
      this._getProgressBarItem(params.name).decrease(params, setStateCallback);
    } else {
      this.showWarning("decreaseImpossible", params.value);
    }
    return this;
  },

  getItem: function(name) {
    return this.getRenderedChildByName(name);
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_: function(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagName = this.getDefault().childTagName;
    let childTagNames = this.props.allowTags.concat(defaultChildTagName);
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagName], {
          mixinName: "UU5.Common.BaseMixin"
        });
      else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getProgressBarItem: function(name) {
    return this.getItem(name || this.getDefault().itemName);
  },

  _getMainProps: function() {
    let props = this.getMainPropsToPass();

    props.className += " " + this.getClassName("size") + this.props.size;

    return props;
  },

  _getChildProps: function() {
    return {
      name: this.getDefault().itemName,
      progress: this.props.progress,
      content: this.getContent(),
      striped: this.props.striped,
      animated: this.props.animated
    };
  },

  _buildChild: function() {
    var child = <Item {...this._getChildProps()} />;
    return this.cloneChild(child, this.expandChildProps(child, 0));
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? (
      <Cover {...this._getMainProps()}>{this.props.children ? this.getChildren() : this._buildChild()}</Cover>
    ) : null;
  }
  //@@viewOff:render
});

ProgressBar.Item = Item;

export default ProgressBar;
