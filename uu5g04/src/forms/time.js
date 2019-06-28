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

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "./forms-ns.js";

import './time.less';

const FORMAT_AM = 'AM';
const FORMAT_PM = 'PM';
const FORMAT_12 = '12';
const FORMAT_24 = '24';
export const Time = createReactClass({

  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ScreenSizeMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.LsiMixin
  ],

  statics: {
    tagName: ns.name("Time"),
    classNames: {
      main: ns.css("time"),
      button: ns.css("time-button"),
      hours: ns.css("time-hours"),
      minutes: ns.css("time-minutes"),
      seconds: ns.css("time-seconds"),
      hoursWrapper: ns.css("time-hours-wrapper"),
      minutesWrapper: ns.css("time-minutes-wrapper"),
      secondsWrapper: ns.css("time-seconds-wrapper"),
      pickerWrapper: ns.css("time-picker-wrapper"),
      hoursPickerWrapper: ns.css("time-hours-picker-wrapper"),
      minutesPickerWrapper: ns.css("time-minutes-picker-wrapper"),
      secondsPickerWrapper: ns.css("time-seconds-picker-wrapper"),
      timeHeader: ns.css("time-header"),
      timeSeparator: ns.css("time-separator"),
      timeBody: ns.css("time-body"),
      timePart: ns.css("time-part"),
      timePartSwitch: ns.css("time-part-switch"),
      am: ns.css("time-am"),
      amSelected: ns.css("time-am-selected uu5-common-text"),
      pm: ns.css("time-pm"),
      pmSelected: ns.css("time-pm-selected uu5-common-text"),
      iconAm: ns.css("time-icon-am"),
      iconPm: ns.css("time-icon-pm"),
      nav: ns.css("time-nav"),
      navMax: ns.css("time-nav-max"),
      singleColumnView: ns.css("time-single-column-view"),
      singleColumnViewButton: ns.css("time-single-column-view-button")
    },
    defaults: {
      upIcon: 'mdi-menu-up',
      downIcon: 'mdi-menu-down'
    },
    lsi: () => (UU5.Environment.Lsi.Forms.time)
  },

  propTypes: {
    value: PropTypes.shape({
      hours: PropTypes.number,
      minutes: PropTypes.number,
      seconds: PropTypes.number,
      dayPart: PropTypes.oneOf([FORMAT_AM, FORMAT_PM])
    }),
    format: PropTypes.oneOf([FORMAT_12, FORMAT_24, 12, 24]),
    onChange: PropTypes.func,
    seconds: PropTypes.bool,
    step: PropTypes.number,
    type: PropTypes.oneOf(['single-column','multi-column'])
  },

  // Setting defaults
  getDefaultProps() {
    return {
      value: null,
      format: null,
      onChange: null,
      seconds: null,
      step: 1,
      type: "multi-column"
    };
  },

  //@@viewOn:standardComponentLifeCycle
  getInitialState() {
    return this._parseTime();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      if (!this.state.hours || !this.state.minutes || !this.state.seconds || !this.state.dayPart || (nextProps.value && (this.state.minutes !== nextProps.value.minutes || this.state.hours !== nextProps.value.hours || this.state.seconds !== nextProps.value.seconds || this.state.dayPart !== nextProps.value.dayPart))) {
        let state = this._parseTime(nextProps);
        this.setState(state);
      }
    }
    return this;
  },

  componentDidMount() {
    this._updateArrowButton(this._hoursPickerWrapper, "hours");
    this._updateArrowButton(this._minutesPickerWrapper, "minutes");
    this._updateArrowButton(this._secondsPickerWrapper, "seconds");
    this._setInitialPickerScroll(this._hoursPickerWrapper);
    this._setInitialPickerScroll(this._minutesPickerWrapper);
    this._setInitialPickerScroll(this._secondsPickerWrapper);
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hidden && !this.state.hidden) {
      this._setInitialPickerScroll(this._hoursPickerWrapper);
      this._setInitialPickerScroll(this._minutesPickerWrapper);
      this._setInitialPickerScroll(this._secondsPickerWrapper);
    }
  },
  //@@viewOff:standardComponentLifeCycle

  // Interface
  onChangeDefault(opt) {
    let type = opt._data.type,
        value = opt._data.value;

    if (type == 'secondsUp') {
      is12 && (value.pm = pm);
      this.setState(value);
    } else if (type == 'secondsDown') {
      is12 && (value.pm = pm);
      this.setState(value);
    } else if (type == 'switchDayPart') {
      this.setState((state) => ({ pm: !state.pm }));
    } else if (type == 'setTime') {
      this.setState(value);
    }

    return this;
  },


  // Overriding Functions

  // Component Specific Helpers
  _setInitialPickerScroll(picker) {
    if (picker) {
      let selectedButton = picker.getElementsByClassName("uu5-forms-time-button uu5-bricks-button-filled")[0];
      if (selectedButton) {
        let buttonPosTop = Math.round(selectedButton.getBoundingClientRect().top);
        let pickerPosTop = Math.round(picker.getBoundingClientRect().top);
        let pickerHeight = Math.round(picker.getBoundingClientRect().height);
        let pickerScrollTop = picker.scrollTop;
        let buttonHeight = selectedButton.clientHeight;
        let targetPos = pickerPosTop + (pickerHeight / 2) - (buttonHeight / 2);
        let posDiff = buttonPosTop - targetPos;
        let newScrollTop = pickerScrollTop + posDiff;

        picker.scrollTop = newScrollTop < 0 ? 0 : newScrollTop;
      }
    }
  },

  _updateArrowButton(scrollElement, prefix) {
    if (scrollElement) {
      if (scrollElement.scrollTop <= 0 && !this.state[prefix + "TopMax"]) {
        this.setState({[prefix + "TopMax"]: true});
      } else if ((scrollElement.scrollTop + scrollElement.clientHeight) - scrollElement.scrollHeight >= -1 && !this.state[prefix + "BottomMax"]) {
        this.setState({[prefix + "BottomMax"]: true});
      }

      if (scrollElement.scrollTop > 0 && this.state[prefix + "TopMax"]) {
        this.setState({[prefix + "TopMax"]: false});
      } else if ((scrollElement.scrollTop + scrollElement.clientHeight) - scrollElement.scrollHeight <= 1 && this.state[prefix + "BottomMax"]) {
        this.setState({[prefix + "BottomMax"]: false});
      }
    }
  },

  _parseTime(props) {
    props = props || this.props;

    let result = {
      hours: this._isFormat12() ? 1 : 0,
      minutes: 0,
      seconds: 0
    };

    if (props.value !== null) {
      result.hours = props.value.hours || result.hours;
      result.minutes = props.value.minutes || result.minutes;
      result.seconds = props.value.seconds || result.seconds;

      if (this._isFormat12()) {
        result.pm = props.value && props.value.dayPart === FORMAT_PM;
        result.hours > 12 && (result.hours -= 12);
      }
    } else {
      result = {
        hours: null,
        minutes: null,
        seconds: null
      };
    }

    return result;
  },

  _getDayPart(pm) {
    return pm ? FORMAT_PM : FORMAT_AM;
  },

  _addDayPart(value, pm) {
    value.dayPart = this._getDayPart(pm);
    return this;
  },

  _isFormat12() {
    return this.props.format == FORMAT_12;
  },

  _setTime(time, type, e) {
    let is12 = this._isFormat12();
    let pm = this.state.pm;
    let value;
    if (type === "single-column") {
      value = {
        hours: parseInt(time.split(":")[0]),
        minutes: parseInt(time.split(":")[1]),
        seconds: 0
      }
    } else {
      value = {
        hours: type == "hours" ? time : this.state.hours || 0,
        minutes: type == "minutes" ? time : this.state.minutes || 0,
        seconds: type == "seconds" ? time : this.state.seconds || 0
      };
    }

    let opt = { value: value, event: e, component: this, _data: { type: 'picker', changeType: type, value: UU5.Common.Tools.merge({pm: pm}, value) } };
    is12 && this._addDayPart(value, pm);

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(opt);
    } else {
      this.onChangeDefault(opt)
    }

    return this;
  },

  _getButtons(from, to, step, selected, type) {
    let result = [];
    for (let i = from; i <= to; i++) {
      if (i % step === 0) {
        result.push(
          <UU5.Bricks.Button
            colorSchema={selected === i ? this.getColorSchema() : 'default'}
            className={this.getClassName("button")}
            bgStyle={selected === i ? 'filled' : 'transparent'}
            content={UU5.Common.Tools.rjust(i, 2, '0')}
            key={i}
            onClick={(component, e) => this._setTime(i, type, e)}
          />
        );
      }
    }
    return result;
  },

  _getHours() {
    return this._isFormat12() ? this._getButtons(1, 12, Math.floor(this.props.step / 60) || 1, this.state.hours, "hours") : this._getButtons(0, 23, Math.floor(this.props.step / 60) || 1, this.state.hours, "hours");
  },

  _getMinutes() {
    return this._getButtons(0, 59, this.props.step, this.state.minutes, "minutes");
  },

  _getSeconds() {
    return this._getButtons(0, 59, 1, this.state.seconds, "seconds");
  },

  _getSelectItems() {
    let result = [];
    for (let i = 0; i <= (24 * 60 / this.props.step); i++) {
      let minutes = 0;
      let hours = 0;
      let format;
      if (i * this.props.step < 60) {
        minutes = i * this.props.step;
      } else {
        hours = Math.floor((i * this.props.step) / 60);
        minutes = (i * this.props.step) % (hours * 60);
      }

      if (hours >= 24) {
        break;
      }

      if (this.props.format == FORMAT_12) {
        if (hours >= 12) {
          format = FORMAT_PM;
        } else {
          format = FORMAT_AM;
        }

        if (hours === 0) {
          hours = 12;
        }
      }

      let value = UU5.Common.Tools.rjust(hours, 2, '0') + ":" + UU5.Common.Tools.rjust(minutes, 2, '0');
      if (format) {
        value += " " + format;
      }

      let selected = hours === this.state.hours && minutes === this.state.minutes;

      result.push(
        <UU5.Bricks.Button
          className={this.getClassName("singleColumnViewButton")}
          colorSchema={selected ? this.getColorSchema() : 'default'}
          bgStyle={selected ? 'filled' : 'transparent'}
          content={value}
          key={i}
          onClick={(component, e) => this._setTime(value, "single-column", e)}
        />
      );
    }
    return result;
  },

  _scrollUp(id) {
    let element = document.getElementById(id);
    let scrollTop = element.scrollTop;
    element.scrollTop = scrollTop - 32;
    return this;
  },

  _scrollDown(id) {
    let element = document.getElementById(id);
    let scrollTop = element.scrollTop;
    element.scrollTop = scrollTop + 32;
    return this;
  },

  _increaseStart(id) {
    this._increaseTimeout = setTimeout(() => {
      this._increaseTimer = UU5.Environment.TimeManager.setInterval(() => this._scrollUp(id), 100);
    }, 300);
  },

  _increaseEnd() {
    this._increaseTimeout && clearTimeout(this._increaseTimeout);
    this._increaseTimer && UU5.Environment.TimeManager.clearInterval(this._increaseTimer);
  },

  _decreaseStart(id) {
    this._decreaseTimeout = setTimeout(() => {
      this._decreaseTimer = UU5.Environment.TimeManager.setInterval(() => this._scrollDown(id), 100);
    }, 300);
  },

  _decreaseEnd() {
    this._decreaseTimeout && clearTimeout(this._decreaseTimeout);
    this._decreaseTimer && UU5.Environment.TimeManager.clearInterval(this._decreaseTimer);
  },

  _switchDayPart(e) {
    this._buttonSwitch.toggle(() => {
      this.setState((state) => {
        let pm = !state.pm;
        let value = {
          hours: state.hours,
          minutes: state.minutes,
          seconds: state.seconds
        };
        let opt = { value: value, event: e, component: this, _data: { type: 'switchDayPart', value: UU5.Common.Tools.merge({pm: pm}, value) } };
        this._addDayPart(value, pm);

        if (typeof this.props.onChange === 'function') {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt)
        }

      })
    });
    return this;
  },

  _getHeader(unit) {
    return (
      <div className={this.getClassName("timeHeader")}>
        {this.isXs() ? this.getLsiValue(unit) : this.getLsiValue(unit)[0]}
      </div>
    );
  },

  _getBody(unit) {
    let wrapperId;
    let topMax;
    let bottomMax;
    let content;

    if (unit == 'seconds') {
      wrapperId = this.getId() + '-secondsPickerWrapper';
      topMax = this.getClassName("nav") + (this.state.secondsTopMax ? " " + this.getClassName("navMax") : "");
      bottomMax = this.getClassName("nav") + (this.state.secondsBottomMax ? " " + this.getClassName("navMax") : "");
      content = this._getSeconds();
    } else if (unit == 'minutes') {
      wrapperId = this.getId() + '-minutesPickerWrapper';
      topMax = this.getClassName("nav") + (this.state.minutesTopMax ? " " + this.getClassName("navMax") : "");
      bottomMax = this.getClassName("nav") + (this.state.minutesBottomMax ? " " + this.getClassName("navMax") : "");
      content = this._getMinutes();
    } else if (unit == 'hours') {
      wrapperId = this.getId() + '-hoursPickerWrapper';
      topMax = this.getClassName("nav") + (this.state.hoursTopMax ? " " + this.getClassName("navMax") : "");
      bottomMax = this.getClassName("nav") + (this.state.hoursBottomMax ? " " + this.getClassName("navMax") : "");
      content = this._getHours();
    }

    return (
      <div className={this.getClassName("timeBody")}>
        <UU5.Bricks.Button
          colorSchema="custom"
          className={topMax}
          onClick={() => this._scrollUp(wrapperId)}
          mainAttrs={{
            onMouseDown: () => this._increaseStart(wrapperId),
            onMouseUp: () => this._increaseEnd(wrapperId),
            onMouseOut: () => this._increaseEnd(wrapperId)
          }}
        >
          <UU5.Bricks.Icon icon={this.getDefault("upIcon")} />
        </UU5.Bricks.Button>
        <div
          className={this.getClassName("hoursPickerWrapper")}
          id={wrapperId}
          ref={(picker) => {
            if (unit === "hours") {
              this._hoursPickerWrapper = picker;
            } else if (unit === "minutes") {
              this._minutesPickerWrapper = picker;
            } else if (unit === "seconds") {
              this._secondsPickerWrapper = picker;
            }
          }}
          onScroll={(e) => {this._updateArrowButton(e.nativeEvent.target, unit)}}
        >
          <div className={this.getClassName(unit)}>
            {content}
          </div>
        </div>
        <UU5.Bricks.Button
          colorSchema="custom"
          className={bottomMax}
          onClick={() => this._scrollDown(wrapperId)}
          mainAttrs={{
            onMouseDown: () => this._decreaseStart(wrapperId),
            onMouseUp: () => this._decreaseEnd(wrapperId),
            onMouseOut: () => this._decreaseEnd(wrapperId)
          }}
        >
          <UU5.Bricks.Icon icon={this.getDefault("downIcon")} />
        </UU5.Bricks.Button>
      </div>
    );
  },

  _getType() {
    let result;

    if (this.props.type === "multi-column") {
      result = (
        <div {...this._getMainAttrs()}>
          <div className={this.getClassName("pickerWrapper")}>
            <div className={this.getClassName("hoursWrapper")}>
              {this._getHeader('hours')}
              {this._getBody('hours')}
            </div>
            <div className={this.getClassName("timeSeparator")}></div>
            <div className={this.getClassName("minutesWrapper")}>
              {this._getHeader('minutes')}
              {this._getBody('minutes')}
            </div>

            {this.props.seconds && (this.props.step <= 1 || !this.props.step) ? [
              <div className={this.getClassName("timeSeparator")} key={"separator"}></div>,
              <div className={this.getClassName("secondsWrapper")} key={"wrapper"}>
                {this._getHeader('seconds')}
                {this._getBody('seconds')}
              </div>
            ] : null}
          </div>
          {this._isFormat12() && (
            <div className={this.getClassName("timePart")}>
              <span className={this.getClassName("am") + (!this.state.pm ? " " + this.getClassName("amSelected") : "")}>AM</span>
              <UU5.Bricks.Switch
                size="m"
                onIcon="mdi-chevron-right"
                offIcon="mdi-chevron-left"
                className={this.getClassName("timePartSwitch")}
                ref_={(buttonSwitch) => this._buttonSwitch = buttonSwitch}
                onChange={() => this._switchDayPart()}
                switchedOn={!!this.state.pm}
              />
              <span className={this.getClassName("pm") + (this.state.pm ? " " + this.getClassName("pmSelected") : "")}>PM</span>
            </div>
          )}
        </div>
      );
    } else {
      result = (
        <div {...this._getMainAttrs()}>
          {this._getSelectItems()}
        </div>
      )
    }

    return result;
  },

  _getMainAttrs() {
    let attrs = this.getMainAttrs();
    if (this.props.type === "single-column") {
      attrs.className += " " + this.getClassName("singleColumnView");
    }
    return attrs;
  },

  render() {
    return this._getType();
  }
});

export default Time;
