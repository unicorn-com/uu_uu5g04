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
const ClassNames = UU5.Common.ClassNames;

import Icon from "./icon.js";
import Link from "./link.js";
import Button from "./button.js";

import "./pagination.less";
//@@viewOff:imports

export const Pagination = UU5.Common.VisualComponent.create({
  displayName: "Pagination", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.NestingLevelMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Pagination"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("pagination"),
      item: ns.css("pagination-item"),
      link: ns.css("pagination-link"),
      nav: ns.css("pagination-nav"),
      size: ns.css("pagination-"),
      active: ns.css("pagination-active"),
      inactiveButton: ns.css("pagination-button-inactive"),
      activeButton: ns.css("pagination-button-active"),
      navButton: ns.css("pagination-button-nav"),
      disabledItem: "disabled",
      background: ns.css("pagination-background"),
      label: ns.css("pagination-label"),
      dots: ns.css("pagination-dots"),
      customDots: ns.css("pagination-custom-dots")
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.array,
    activeIndex: UU5.PropTypes.number,
    range: UU5.PropTypes.number,
    prevIcon: UU5.PropTypes.string,
    prevLabel: UU5.PropTypes.node,
    nextIcon: UU5.PropTypes.string,
    nextLabel: UU5.PropTypes.node,
    firstIcon: UU5.PropTypes.string,
    firstLabel: UU5.PropTypes.node,
    lastIcon: UU5.PropTypes.string,
    lastLabel: UU5.PropTypes.node,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    onChange: UU5.PropTypes.func,
    onChanged: UU5.PropTypes.func,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    colorSchemaInactive: UU5.PropTypes.string,
    borderRadius: UU5.PropTypes.string,
    ellipsisIcon: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      items: [1, 2, 3, 4, 5],
      activeIndex: 0,
      range: 5,
      prevIcon: "mdi-chevron-left",
      prevLabel: null,
      nextIcon: "mdi-chevron-right",
      nextLabel: null,
      firstIcon: null,
      firstLabel: null,
      lastIcon: null,
      lastLabel: null,
      size: "m",
      onChange: null,
      onChanged: null,
      bgStyle: null,
      colorSchemaInactive: "default",
      borderRadius: null,
      ellipsisIcon: "mdi-dots-horizontal"
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      activeIndex: parseInt(this.props.activeIndex)
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({ activeIndex: nextProps.activeIndex });
    }
    return this;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getItemsLength() {
    return this.props.items ? this.props.items.length : 0;
  },

  getActiveIndex() {
    return this.state.activeIndex;
  },

  setActiveIndex(activeIndex, setStateCallback) {
    if (activeIndex > -1 && this.getItemsLength() >= activeIndex) {
      this.setState({ activeIndex: activeIndex }, setStateCallback);
    }
    return this;
  },

  increaseActiveIndex(setStateCallback) {
    var pagination = this;
    this.setState(function(state) {
      var newState = null;
      if (pagination.getItemsLength() - 1 > state.activeIndex) {
        newState = { activeIndex: state.activeIndex + 1 };
      }
      return newState;
    }, setStateCallback);
    return this;
  },

  decreaseActiveIndex(setStateCallback) {
    this.setState(function(state) {
      var newState = null;
      if (0 < state.activeIndex) {
        newState = { activeIndex: state.activeIndex - 1 };
      }
      return newState;
    }, setStateCallback);
    return this;
  },

  onChangeDefault(component, newActive, event) {
    event.preventDefault();
    var onChanged;
    if (typeof this.props.onChanged === "function") {
      var pagination = this;
      onChanged = function() {
        pagination.props.onChanged(this, this.getActiveIndex(), newActive, event);
      };
    }

    if (newActive === "prev") {
      this.decreaseActiveIndex(onChanged);
    } else if (newActive === "next") {
      this.increaseActiveIndex(onChanged);
    } else {
      this.setActiveIndex(newActive, onChanged);
    }

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getMainAttrs() {
    var mainAttrs = this.getMainAttrs();
    mainAttrs.className += " " + this.getClassName().size + this.props.size;
    this.props.background ? (mainAttrs.className += " " + this.getClassName().background) : null;
    return mainAttrs;
  },

  _range(start, end, step) {
    step = step || 1;
    var rangeArray = [start];

    while (start + step <= end) {
      rangeArray.push((start += step));
    }

    return rangeArray;
  },
  _getPropRange() {
    return this.props.range + 2;
  },
  // return [] of index from props.items
  _getRange() {
    var activeIndex = this.getActiveIndex();
    var range = this._getPropRange();
    var step = Math.floor(range / 2.0);

    let countBefore = step;
    let countAfter = step;
    if (range % 2 === 0) {
      countBefore--;
    }

    let minIndex = 0;
    let maxIndex = this.getItemsLength() - 1;

    var start = Math.max(minIndex, activeIndex - countBefore);
    var end = Math.min(activeIndex + countAfter, maxIndex);

    // check if we are in range of items
    if (end - start + 1 < range) {
      let delta = range - (end - start + 1);
      if (start === minIndex) {
        end = Math.min(end + delta, maxIndex);
      } else if (end === maxIndex) {
        start = Math.max(minIndex, start - delta);
      }
    }

    return this._range(start, end);
  },

  _onChange(newActive, link, event) {
    if (typeof this.props.onChange === "function") {
      this.props.onChange(this, newActive, event);
    } else {
      this.onChangeDefault(this, newActive, event);
    }
    return this;
  },

  _getItemValue(value) {
    var newValue = null;
    var label = this.props[value + "Label"];
    var icon = this.props[value + "Icon"];

    if (label) {
      // if array of nodes -> set keys
      newValue = Array.isArray(label) ? UU5.Common.Children.toArray(label) : label;
      // newValue = <span className={this.getClassName().label}>{Array.isArray(label) ? UU5.Common.Children.toArray(label) : label}</span>;
    } else if (icon) {
      newValue = <Icon icon={icon} />;
    }

    return newValue;
  },

  _createItem(i, value) {
    let liAttrs = { key: i, className: this.getClassName().item };
    let linkAttrs = {
      className: this.getClassName().link,
      parent: this,
      style: { borderRadius: this.props.borderRadius },
      nestingLevel: this.getNestingLevel()
    };

    if (this.props.bgStyle) {
      linkAttrs.bgStyle = this.props.bgStyle;
    } else if (this.props.background) {
      linkAttrs.bgStyle = "filled";
    } else {
      linkAttrs.bgStyle = "transparent";
    }

    if (i === this.getActiveIndex()) {
      liAttrs.className += " " + this.getClassName().active;
      linkAttrs.className += " " + this.getClassName().activeButton;
      linkAttrs.bgStyle = this.props.bgStyle || "filled";
    } else {
      linkAttrs.className += " " + this.getClassName().inactiveButton;
      linkAttrs.colorSchema = this.props.colorSchemaInactive;
      linkAttrs.onClick = this._onChange.bind(null, i);
    }

    return (
      <li {...liAttrs}>
        <Button {...linkAttrs}>{value}</Button>
      </li>
    );
  },

  _createNavItem(key, disabled, index) {
    let liAttrs = {
      key: key,
      className: this.getClassName().item + " " + this.getClassName().nav + " " + this.getClassName().nav + "-" + key
    };

    let linkAttrs = {
      className: this.getClassName().link + " " + this.getClassName().navButton,
      parent: this,
      style: { borderRadius: this.props.borderRadius },
      disabled: disabled,
      colorSchema: "default",
      nestingLevel: this.getNestingLevel()
    };

    if (disabled) {
      liAttrs.className += " " + this.getClassName().disabledItem;
      linkAttrs.href = "";
    } else {
      linkAttrs.onClick = this._onChange.bind(null, index === undefined ? key : index);
    }

    if (this.props.bgStyle) {
      linkAttrs.bgStyle = this.props.bgStyle;
    } else if (this.props.background) {
      linkAttrs.bgStyle = "filled";
    } else {
      linkAttrs.bgStyle = "transparent";
    }

    return (
      <li {...liAttrs}>
        <Button {...linkAttrs}>{this._getItemValue(key)}</Button>
      </li>
    );
  },
  _getItems() {
    let pagination = this;

    let range = this._getRange();

    let items =
      this.getItemsLength() > 0
        ? range.map(function(i) {
            return pagination._createItem(i, pagination.props.items[i]);
          })
        : null;

    if (this.getItemsLength() > this._getPropRange()) {
      let dotsRight = false;
      if (Math.ceil((this._getPropRange() - 1) / 2 + this.getActiveIndex()) < this.getItemsLength() - 1) {
        dotsRight = true;
      }
      let dotsLeft = false;
      if ((this._getPropRange() - 1) / 2 < this.getActiveIndex()) {
        dotsLeft = true;
      }

      if (dotsLeft) {
        let dotsClass = this.getClassName("dots") + " " + ClassNames.text;
        if (this.props.ellipsisIcon !== "mdi-dots-horizontal") {
          dotsClass += " " + this.getClassName("customDots");
        }
        items[0] = (
          <li key="dotsLeft" className={this.getClassName().item}>
            <UU5.Bricks.Icon icon={this.props.ellipsisIcon} className={dotsClass} />
          </li>
        );
      }

      if (dotsRight) {
        let dotsClass = this.getClassName("dots") + " " + ClassNames.text;
        if (this.props.ellipsisIcon !== "mdi-dots-horizontal") {
          dotsClass += " " + this.getClassName("customDots");
        }
        items[items.length - 1] = (
          <li key="dotsRight" className={this.getClassName().item}>
            <UU5.Bricks.Icon icon={this.props.ellipsisIcon} className={dotsClass} />
          </li>
        );
      }

      let prevDisabled = this.getActiveIndex() === 0;
      let nextDisabled = this.getActiveIndex() === this.getItemsLength() - 1;

      items.unshift(this._createNavItem("prev", prevDisabled));
      items.push(this._createNavItem("next", nextDisabled));

      (this.props.firstIcon || this.props.firstLabel) && items.unshift(this._createNavItem("first", prevDisabled, 0));
      (this.props.lastIcon || this.props.lastLabel) &&
        items.push(this._createNavItem("last", nextDisabled, this.getItemsLength() - 1));
    }

    return items;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    var mainAttrs = this._getMainAttrs();
    var items = this._getItems();

    return items && this.props.range ? (
      <ul {...mainAttrs}>
        {items}
        {this.getDisabledCover()}
      </ul>
    ) : null;
  }
  //@@viewOff:render
});

export default Pagination;
