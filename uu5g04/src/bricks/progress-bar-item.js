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

import "./progress-bar-item.less";
//@@viewOff:imports

const ProgressBarItem = UU5.Common.VisualComponent.create({
  displayName: "ProgressBarItem", // for backward compatibility (test snapshots)
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
    tagName: ns.name("ProgressBar.Item"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("progress-bar-item"),
      striped: ns.css("progress-bar-item-striped"),
      active: ns.css("progress-bar-item-active")
    },
    errors: {
      invalidParent: "Parent of this component is not ProgressBar."
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    progress: UU5.PropTypes.number,
    striped: UU5.PropTypes.bool,
    animated: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      progress: 0,
      striped: false,
      animated: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    return {
      progress: this.props.progress,
      content: this.getContent(),
      striped: this.props.striped,
      animated: this.props.animated
    };
  },

  componentWillMount: function() {
    let parent = this.getParent();

    if (parent) {
      while (parent.getOpt("parentWrapper")) {
        parent = parent.getParent();
      }
    }

    if (!(parent && parent.isProgressBar)) {
      this.showError("invalidParent");
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({
        progress: nextProps.progress,
        content: nextProps.content,
        striped: nextProps.striped,
        animated: nextProps.animated
      });
    }
    return this;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getProgress: function() {
    return this.state.progress;
  },

  getProgressContent: function() {
    return this.state.content;
  },

  isStriped: function() {
    return this.state.striped;
  },

  isAnimated: function() {
    return this.state.animated;
  },

  setProgress: function(params, setStateCallback) {
    var newProgress = this._checkProgress(params.value);

    var newState = {
      progress: newProgress
    };

    params.content !== undefined && (newState.content = params.content);
    params.striped !== undefined && (newState.striped = params.striped);
    params.animated !== undefined && (newState.animated = params.animated);
    params.colorSchema !== undefined && (newState.colorSchema = params.colorSchema);

    this.setState(newState, setStateCallback);
    return this;
  },

  increase: function(params, setStateCallback) {
    if (typeof params === "number") params = { value: params };
    var progressItem = this;
    this.setState(function(state) {
      var newProgress = progressItem._checkProgress(state.progress + params.value);

      var newState = {
        progress: newProgress
      };

      params.content !== undefined && (newState.content = params.content);
      params.striped !== undefined && (newState.striped = params.striped);
      params.animated !== undefined && (newState.animated = params.animated);
      params.colorSchema !== undefined && (newState.colorSchema = params.colorSchema);

      return newState;
    }, setStateCallback);
    return this;
  },

  decrease: function(params, setStateCallback) {
    if (typeof params === "number") {
      params = -params;
    } else {
      params.value = -params.value;
    }

    this.increase(params, setStateCallback);
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _checkProgress: function(newProgress) {
    var result = newProgress;
    if (newProgress > 100) {
      result = 100;
    } else if (newProgress < 0) {
      result = 0;
    }
    return result;
  },

  _getMainAttrs: function() {
    var mainAttrs = this.getMainAttrs();

    if (this.isAnimated()) {
      mainAttrs.className += " " + this.getClassName().striped + " " + this.getClassName().active;
    } else if (this.isStriped()) {
      mainAttrs.className += " " + this.getClassName().striped;
    }

    mainAttrs.style = { width: this.getProgress() + "%" };

    return mainAttrs;
  },

  _getChildren: function() {
    var children;

    if (this.getProgress() > 0 && this.getProgressContent() !== "") {
      children = this.getProgressContent() || this.getProgress() + " %";
    }

    return children;
  },
  //@@viewOff:private

  //@@viewOn:render
  render: function() {
    return this.getNestingLevel() ? <div {...this._getMainAttrs()}>{this._getChildren()}</div> : null;
  }
  //@@viewOff:render
});

export default ProgressBarItem;
