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

import Backdrop from "./backdrop.js";
import "./slider.less";
import SliderItem from "./slider-item.js";
//@@viewOff:imports

export const Slider = UU5.Common.VisualComponent.create({
  displayName: "Slider", // for backward compatibility (test snapshots)
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
    tagName: ns.name("Slider"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "box"),
    classNames: {
      main: ns.css("slider"),
      vertical: ns.css("slider-vertical"),
      track: ns.css("slider-track"),
      selection: ns.css("slider-selection"),
      pointer: ns.css("slider-pointer"),
      active: ns.css("slider-active"),
      size: ns.css("slider-size-")
    },
    defaults: {
      childTagName: "UU5.Bricks.Slider.Item"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    vertical: UU5.PropTypes.bool,
    min: UU5.PropTypes.number,
    max: UU5.PropTypes.number,
    step: UU5.PropTypes.number,
    value: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.arrayOf(UU5.PropTypes.number)]),
    onChange: UU5.PropTypes.func,
    onChanged: UU5.PropTypes.func,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    allowTags: UU5.PropTypes.array
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      vertical: false,
      min: 0,
      max: 10,
      step: 1,
      onChange: null,
      onChanged: null,
      size: "m",
      allowTags: [],
      value: null // default: min
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._pointers = [];

    return {
      active: false,
      activePointer: null
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setValue(nextProps.value);
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPointers() {
    return this._pointers;
  },

  getValue() {
    let values = this._pointers.map(item => item.getValue());
    if (values.length === 0) values = this.props.min;
    else if (values.length === 1) values = values[0];

    return values;
  },

  setValue(value, setStateCallback) {
    let values = this._getValueArray(value);

    values.forEach((item, i) => {
      this._pointers[i] && this._pointers[i].setValue(item, setStateCallback);
    });

    return this;
  },

  increase(value, setStateCallback) {
    let values = this._getValueArray(value);

    values.forEach((item, i) => {
      this._pointers[i] && this._pointers[i].increase(item, setStateCallback);
    });

    return this;
  },

  decrease(value, setStateCallback) {
    let values = this._getValueArray(value);

    values.forEach((item, i) => {
      this._pointers[i] && this._pointers[i].decrease(item, setStateCallback);
    });

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  expandChildProps_(child, childIndex) {
    const newChildProps = { ...child.props };
    newChildProps.name = newChildProps.name || (this.props.name ? this.props.name + "-" + childIndex : null);
    // not state initialized due to first render (ifc isDisabled fails because of no state exists)
    newChildProps.disabled = this.state ? newChildProps.disabled || this.isDisabled() : newChildProps.disabled;
    newChildProps._min = this.props.min;
    newChildProps._max = this.props.max;
    newChildProps._step = this.props.step;
    newChildProps._checkValue = this._checkValue;
    newChildProps._getStyle = this._getStyle;

    if (newChildProps.value === null) {
      const value = this._getValueArray();
      newChildProps.value = value[childIndex];
    }

    let ref = newChildProps.ref_;
    newChildProps.ref_ = item => {
      this._pointers.push(item);
      typeof ref === "function" && ref(item);
    };

    return newChildProps;
  },

  shouldChildRender_(child) {
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
  _getValueArray(value) {
    value === undefined && (value = this.props.value);
    return Array.isArray(value) ? value.slice(0, 2) : [value];
  },

  _checkValue(value) {
    if (typeof value == "string" && value !== "" && value !== "-") {
      value = parseFloat(value);
    }
    if (isNaN(value)) {
      value = null;
    }
    if (this.props.step > 1) {
      value = Math.round((value - this.props.min) / this.props.step) * this.props.step + this.props.min;
    }

    return value > this.props.max
      ? this.props.max
      : value < this.props.min
      ? this.props.min
      : value === "" || value == null
      ? 0
      : value;
  },

  _prepareIfcValue(value, nearestPointer) {
    const values = this._pointers.map(item => (item === nearestPointer ? value : item.getValue()));

    return values.length === 1 ? values[0] : values;
  },

  onChangeDefault(opt) {
    let type = opt._data && opt._data.type;

    if (type == "change") {
      let onChanged = opt._data.onChanged;
      let value = opt.value;

      this.state.nearestPointer.setValue(value, onChanged);
    }
  },

  _changeValue(value, e) {
    if (this.state.nearestPointer.getValue() !== value) {
      const values = this._prepareIfcValue(value, this.state.nearestPointer);
      let onChangedOpt = { value: value, component: this, event: e, _data: { type: "change", onChanged: null } };
      let onChangeOpt = { value: value, component: this, event: e };
      onChangeOpt._data = {
        type: "change",
        onChanged: typeof this.props.onChanged === "function" ? () => this.props.onChanged(onChangedOpt) : null
      };

      if (typeof this.props.onChange === "function") {
        this.props.onChange(onChangeOpt);
      } else {
        this.onChangeDefault(onChangeOpt);
      }
    }

    return this;
  },

  _activate(e) {
    let value = this._countValue(e),
      onChange,
      onChanged;
    const nearestPointer = this._getNearestPointer(value);
    let values;

    if (this.getValue() !== value) {
      values = this._prepareIfcValue(value, nearestPointer);
      onChange = this._getOnChange(values, e);
      !onChange && (onChanged = this._getOnChanged(values, e));
    }

    nearestPointer.setValue(value);

    this.setState(
      {
        active: true,
        nearestPointer: nearestPointer
      },
      onChange || onChanged ? () => (onChange ? onChange() : onChanged()) : null
    );
    return this;
  },

  _deactivate(e) {
    this.setState({ active: false, nearestPointer: null });
    return this;
  },

  _isActive() {
    return this.state.active;
  },

  _move(e) {
    if (this._isActive()) {
      this._changeValue(this._countValue(e), e);
    }
    return this;
  },

  _getOnChange(values, e) {
    let onChange;
    if (typeof this.props.onChange === "function") {
      onChange = () => {
        this.props.onChange({ value: values, component: this, event: e, _data: {} });
      };
    }
    return onChange;
  },

  _getOnChanged(values, e) {
    let onChanged;
    if (typeof this.props.onChanged === "function") {
      onChanged = () => {
        this.props.onChanged({ value: values, component: this, event: e, _data: {} });
      };
    }
    return onChanged;
  },

  _getStartPositions() {
    let el = this._track;
    let xPos = 0;
    let yPos = -1 * window.pageYOffset;

    while (el) {
      xPos += el.offsetLeft - el.scrollLeft + el.clientLeft;
      yPos += el.offsetTop;
      el = el.offsetParent;
    }

    return { x: xPos, y: yPos };
  },

  _countValue(e) {
    const sliderStart = this.props.vertical ? this._getStartPositions().y : this._getStartPositions().x;
    let actualPosition = this.props.vertical ? e.clientY : e.clientX;
    if (e.touches) {
      actualPosition = this.props.vertical ? e.touches.item(0).clientY : e.touches.item(0).clientX;
    }

    const absolutePosition = actualPosition - sliderStart;
    const end = this.props.vertical ? this._track.offsetHeight : this._track.offsetWidth;

    const min = this.props.min;
    const max = this.props.max;
    const step = this.props.step;

    const absoluteMax = max - min;

    const realValue = absolutePosition / (end / absoluteMax);
    let value = min + Math.round(realValue / step) * step;

    this.props.vertical && (value = this.props.max + this.props.min - value);
    value > this.props.max && (value = this.props.max);
    value < this.props.min && (value = this.props.min);

    return value;
  },

  _getMainAttrs() {
    const attrs = this.getMainAttrs();

    attrs.className += " " + this.getClassName("size") + this.props.size;
    this.props.vertical && (attrs.className += " " + this.getClassName("vertical"));

    if (!this.isDisabled()) {
      this._isActive() && (attrs.className += " " + this.getClassName().active);

      attrs.onMouseDown = this._activate;
      attrs.onMouseMove = this._move;
      attrs.onMouseUp = this._deactivate;
      attrs.onTouchStart = this._activate;
      attrs.onTouchMove = e => {
        e.preventDefault();
        this._move(e);
      };
      attrs.onTouchEnd = this._deactivate;
      attrs.onMouseLeave = this._deactivate;
    }

    return attrs;
  },

  _getBackdropProps() {
    let backdropId = this.getId() + "-backdrop";

    return {
      hidden: !this._isActive(),
      id: backdropId,
      onClick: (backdrop, event) => event.target.id === backdropId && this._deactivate(),
      mainAttrs: {
        onMouseUp: this._deactivate,
        onTouchEnd: this._deactivate
      }
    };
  },

  _getStyle(value) {
    const size = ((this._checkValue(value) - this.props.min) / (this.props.max - this.props.min)) * 100 + "%";
    return this.props.vertical ? { height: size } : { width: size };
  },

  _getNearestPointer(newValue) {
    let min = Infinity,
      nearestPointer;
    this._pointers.forEach(item => {
      const value = Math.abs(newValue - item.getValue());

      if (min > value) {
        min = value;
        nearestPointer = item;
      }
    });

    return nearestPointer;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let pointers = this.getChildren();

    if (!pointers || pointers.length === 0) {
      const values = this._getValueArray();
      pointers = this.buildChildren({
        children: values.map((value, i) => <SliderItem id={this.getId() + "-" + i} value={value} />)
      });
    } else if (pointers && pointers.length > 2) {
      pointers = pointers.slice(0, 2);
    }

    return this.getNestingLevel() ? (
      <div {...this._getMainAttrs()}>
        <Backdrop {...this._getBackdropProps()} />
        <div className={this.getClassName("track")} ref={item => (this._track = item)}>
          {pointers}
        </div>
      </div>
    ) : null;
  }
  //@@viewOff:render
});

Slider.Item = SliderItem;

export default Slider;
