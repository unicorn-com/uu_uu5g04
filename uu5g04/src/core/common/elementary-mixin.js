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

import React from "react";
import PropTypes from "prop-types";
import ns from "./common-ns.js";
import Tools from "./tools.js";

export const ElementaryMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.ElementaryMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      classNames: {
        hidden: ns.css("hidden"),
        selected: ns.css("selected"),
        disabled: ns.css("disabled"),
        disabledCover: ns.css("disabled-cover"),
        disabledCoverTransparent: ns.css("disabled-cover-transparent")
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    controlled: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      hidden: false,
      disabled: false,
      selected: false,
      controlled: true
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.ElementaryMixin");
    // state
    return {
      hidden: this.props.hidden,
      disabled: this.props.disabled,
      selected: this.props.selected
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({
        hidden: nextProps.hidden,
        disabled: nextProps.disabled,
        selected: nextProps.selected
      });
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonElementaryMixin() {
    return this.hasMixin("UU5.Common.ElementaryMixin");
  },

  getUU5CommonElementaryMixinProps() {
    return {
      hidden: this.isHidden(),
      disabled: this.isDisabled(),
      selected: this.isSelected()
    };
  },

  getUU5CommonElementaryMixinPropsToPass() {
    return {
      hidden: this.isHidden(),
      disabled: this.isDisabled(),
      selected: this.isSelected(),
      controlled: true
    };
  },

  setHiddenValue(value, setStateCallback) {
    if (typeof this.setHiddenValue_ === "function") {
      this.setHiddenValue_(value, setStateCallback);
    } else {
      this.setHiddenValueDefault(value, setStateCallback);
    }

    return this;
  },

  setHiddenValueDefault(value, setStateCallback) {
    this.setState({ hidden: value }, setStateCallback);
  },

  hide(setStateCallback) {
    if (typeof this.hide_ === "function") {
      this.hide_(setStateCallback);
    } else {
      this.hideDefault(setStateCallback);
    }
    return this;
  },

  hideDefault(setStateCallback) {
    this.setHiddenValue(true, setStateCallback);
  },

  show(setStateCallback) {
    if (typeof this.show_ === "function") {
      this.show_(setStateCallback);
    } else {
      this.showDefault(setStateCallback);
    }
    return this;
  },

  showDefault(setStateCallback) {
    this.setHiddenValue(false, setStateCallback);
    return this;
  },

  isHidden() {
    return this.state.hidden;
  },

  toggleHidden(setStateCallback) {
    if (typeof this.toggleHidden_ === "function") {
      this.toggleHidden_(setStateCallback);
    } else {
      this.toggleHiddenDefault(setStateCallback);
    }
    return this;
  },

  toggleHiddenDefault(setStateCallback) {
    this.setState(state => {
      return { hidden: !state.hidden };
    }, setStateCallback);
  },

  setDisabledValue(value, setStateCallback) {
    if (typeof this.setDisabledValue_ === "function") {
      this.setDisabledValue_(value, setStateCallback);
    } else {
      this.setDisabledValueDefault(value, setStateCallback);
    }

    return this;
  },

  setDisabledValueDefault(value, setStateCallback) {
    this.setState({ disabled: value }, setStateCallback);
  },

  disable(setStateCallback) {
    if (typeof this.disable_ === "function") {
      this.disable_(setStateCallback);
    } else {
      this.disableDefault(setStateCallback);
    }
    return this;
  },

  disableDefault(setStateCallback) {
    this.setDisabledValue(true, setStateCallback);
    return this;
  },

  enable(setStateCallback) {
    if (typeof this.enable_ === "function") {
      this.enable_(setStateCallback);
    } else {
      this.enableDefault(setStateCallback);
    }
    return this;
  },

  enableDefault(setStateCallback) {
    this.setDisabledValue(false, setStateCallback);
    return this;
  },

  isDisabled() {
    return this.state.disabled;
  },

  toggleDisabled(setStateCallback) {
    if (typeof this.toggleDisabled_ === "function") {
      this.toggleDisabled_(setStateCallback);
    } else {
      this.toggleDisabledDefault(setStateCallback);
    }
    return this;
  },

  toggleDisabledDefault(setStateCallback) {
    this.setState(state => {
      return { disabled: !state.disabled };
    }, setStateCallback);
    return this;
  },

  setSelectedValue(value, setStateCallback) {
    this.setState({ selected: value }, setStateCallback);
    return this;
  },

  select(setStateCallback) {
    if (typeof this.select_ === "function") {
      this.select_(setStateCallback);
    } else {
      this.selectDefault(setStateCallback);
    }
    return this;
  },

  selectDefault(setStateCallback) {
    this.setSelectedValue(true, setStateCallback);
    return this;
  },

  deselect(setStateCallback) {
    if (typeof this.deselect_ === "function") {
      this.deselect_(setStateCallback);
    } else {
      this.deselectDefault(setStateCallback);
    }
    return this;
  },

  deselectDefault(setStateCallback) {
    this.setSelectedValue(false, setStateCallback);
    return this;
  },

  isSelected() {
    return this.state.selected;
  },

  toggleSelected(setStateCallback) {
    if (typeof this.toggleSelected_ === "function") {
      this.toggleSelected_(setStateCallback);
    } else {
      this.toggleSelectedDefault(setStateCallback);
    }
    return this;
  },

  toggleSelectedDefault(setStateCallback) {
    this.setState(state => {
      return { selected: !state.selected };
    }, setStateCallback);
    return this;
  },

  buildMainAttrs(mainAttrs) {
    var newMainAttrs = Tools.mergeDeep(
      {},
      mainAttrs || (this.getUU5CommonBaseMixinProps && this.getUU5CommonBaseMixinProps().mainAttrs),
      {
        title: this.getTooltip(),
        className: this.getFullClassName()
      }
    );
    newMainAttrs.className = this.getHiddenClassName(newMainAttrs.className);
    newMainAttrs.className = this.getDisabledClassName(newMainAttrs.className);
    newMainAttrs.className = this.getSelectedClassName(newMainAttrs.className);

    let style = typeof this.props.style === "string" ? this.__styleStringToObject(this.props.style) : this.props.style;

    newMainAttrs.style = Tools.mergeDeep({}, newMainAttrs.style, style);
    return newMainAttrs;
  },

  getHiddenClassName(className) {
    var hiddenClassName = "";
    if (this.isHidden()) {
      hiddenClassName = this.getClassName("hidden") || this.getClassName(null, "UU5.Common.ElementaryMixin").hidden;
    }
    return className ? (className + " " + hiddenClassName).trim() : hiddenClassName;
  },

  getDisabledClassName(className) {
    var disabledClassName = "";
    if (this.isDisabled()) {
      disabledClassName =
        this.getClassName("disabled") || this.getClassName(null, "UU5.Common.ElementaryMixin").disabled;
    }
    return className ? (className + " " + disabledClassName).trim() : disabledClassName;
  },

  getSelectedClassName(className) {
    var selectedClassName = "";
    if (this.isSelected()) {
      selectedClassName =
        this.getClassName("selected") || this.getClassName(null, "UU5.Common.ElementaryMixin").selected;
    }
    return className ? (className + " " + selectedClassName).trim() : selectedClassName;
  },

  getDisabledCover() {
    var className =
      this.getClassName("disabledCover") || this.getClassName(null, "UU5.Common.ElementaryMixin").disabledCover;
    return this.isDisabled() ? React.createElement("span", { className: className, key: "disabledCover" }) : null;
  },

  getDisabledCoverTransparent() {
    var className =
      this.getClassName("disabledCoverTransparent") ||
      this.getClassName(null, "UU5.Common.ElementaryMixin").disabledCoverTransparent;
    return this.isDisabled()
      ? React.createElement("span", { className: className, key: "disabledCoverTransparent" })
      : null;
  }
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  //@@viewOff:private
};

export default ElementaryMixin;
