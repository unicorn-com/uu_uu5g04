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
import ns from "./forms-ns.js";

import "./time.less";
//@@viewOff:imports

const FORMAT_AM = "AM";
const FORMAT_PM = "PM";
const FORMAT_12 = "12";
const FORMAT_24 = "24";
export const Time = UU5.Common.VisualComponent.create({
  displayName: "Time", // for backward compatibility (test snapshots)
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
      singleColumnViewButton: ns.css("time-single-column-view-button"),
      screenSizeBehaviour: ns.css("screen-size-behaviour")
    },
    defaults: {
      upIcon: "mdi-menu-up",
      downIcon: "mdi-menu-down"
    },
    lsi: () => UU5.Environment.Lsi.Forms.time
  },

  propTypes: {
    value: UU5.PropTypes.shape({
      hours: UU5.PropTypes.number,
      minutes: UU5.PropTypes.number,
      seconds: UU5.PropTypes.number,
      dayPart: UU5.PropTypes.oneOf([FORMAT_AM, FORMAT_PM])
    }),
    format: UU5.PropTypes.oneOf([FORMAT_12, FORMAT_24, 12, 24]),
    onChange: UU5.PropTypes.func,
    seconds: UU5.PropTypes.bool,
    step: UU5.PropTypes.number,
    type: UU5.PropTypes.oneOf(["single-column", "multi-column"]),
    mobileDisplay: UU5.PropTypes.bool,
    timeFrom: UU5.PropTypes.object,
    timeTo: UU5.PropTypes.object,
    show24: UU5.PropTypes.bool
  },

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      value: null,
      format: null,
      onChange: null,
      seconds: null,
      step: 1,
      type: "multi-column",
      mobileDisplay: false,
      timeFrom: undefined,
      timeTo: undefined,
      show24: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._setUpLimits(this.props);

    let value = this.props.value ? { ...this.props.value } : null;

    if (this.props.show24 && value && value.hours === 24 && this._overMidnight) {
      value.hours = 0;
    }

    return {
      ...this._parseTime(value),
      valid: this._validateTime(value)
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this._setUpLimits(nextProps);

      if (
        !this.state.hours ||
        !this.state.minutes ||
        !this.state.seconds ||
        !this.state.dayPart ||
        (nextProps.value &&
          (this.state.minutes !== nextProps.value.minutes ||
            this.state.hours !== nextProps.value.hours ||
            this.state.seconds !== nextProps.value.seconds ||
            this.state.dayPart !== nextProps.value.dayPart))
      ) {
        let value = nextProps.value ? { ...nextProps.value } : null;

        if (nextProps.show24 && value && value.hours === 24 && this._overMidnight) {
          value.hours = 0;
        }

        this.setState({ ...this._parseTime(value), valid: this._validateTime(value, nextProps) });
      }
    }
    return this;
  },

  componentDidMount() {
    this._updateScrolls();
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevState.hidden && !this.state.hidden) {
      this._updateScrolls();
    }
  },
  //@@viewOff:reactLifeCycle

  // Interface
  onChangeDefault(opt, setStateCallback) {
    let type = opt._data.type,
      value = opt._data.value;

    if (type == "secondsUp") {
      is12 && (value.pm = pm);
      this.setState(value, setStateCallback);
    } else if (type == "secondsDown") {
      is12 && (value.pm = pm);
      this.setState(value, setStateCallback);
    } else if (type == "switchDayPart") {
      this.setState(state => ({ pm: !state.pm }), setStateCallback);
    } else if (type == "setTime") {
      this.setState(value, setStateCallback);
    }

    return this;
  },

  // Overriding Functions

  //@@viewOn:private
  _validateTime(time, props = this.props) {
    let result = true;

    if (time) {
      let timeFrom = this._timeFrom;
      let timeTo = this._timeTo;
      time = { ...time };
      time = (time.hours + (time.dayPart == FORMAT_PM ? 12 : 0)) * 60 * 60 + time.minutes * 60 + time.seconds;

      if (time < timeFrom || time > timeTo) {
        if (this._overMidnight) {
          time += 86400; // + 24:00

          if (time < timeFrom || time > timeTo) {
            result = false;
          }
        } else {
          result = false;
        }
      }
    }

    return result;
  },

  _registerSinglePickerWrapper(ref) {
    this._singlePickerWrapper = ref;
  },

  _setUpLimits(props) {
    // set defaults
    this._hoursFrom = undefined;
    this._minutesFrom = undefined;
    this._secondsFrom = undefined;
    this._timeFrom = undefined;
    this._hoursTo = undefined;
    this._minutesTo = undefined;
    this._secondsTo = undefined;
    this._timeTo = undefined;
    this._show24 = false;
    this._overMidnight = false;
    let hasSteps = props.step > 1;

    if (props.timeFrom) {
      this._timeFrom =
        props.timeFrom.hours * 60 * 60 + props.timeFrom.minutes * 60 + (hasSteps ? 0 : props.timeFrom.seconds);
    } else {
      this._timeFrom = 24 * 60 * 60;
    }

    this._hoursFrom = Math.floor(this._timeFrom / 3600);
    this._minutesFrom = Math.floor((this._timeFrom % 3600) / 60);
    this._secondsFrom = Math.floor((this._timeFrom % 3600) % 60);

    if (props.timeTo) {
      this._timeTo = props.timeTo.hours * 60 * 60 + props.timeTo.minutes * 60 + (hasSteps ? 0 : props.timeTo.seconds);
    } else {
      this._timeTo = 24 * 60 * 60 + 59 * 60 + 59;
    }

    this._hoursTo = Math.floor(this._timeTo / 3600);
    this._minutesTo = Math.floor((this._timeTo % 3600) / 60);
    this._secondsTo = Math.floor((this._timeTo % 3600) % 60);

    if (this._timeFrom === this._timeTo) {
      this._overMidnight = true;
      this._timeTo = this._timeTo + 86399; // + 23:59:59
    } else if (this._timeFrom > this._timeTo) {
      this._overMidnight = true;
      this._timeTo = this._timeTo + 86400; // + 24:00:00
    }

    if (!this._isFormat12()) {
      if (this._isDefaultLimit() && props.show24) {
        this._show24 = true;
      }
    }
  },

  _isDefaultLimit() {
    // from = 0, to = 24
    if (this._timeFrom === 0 && this._timeTo === 86400) {
      return true;
    } else {
      return false;
    }
  },

  _updateScrolls() {
    if (this.props.type === "single-column") {
      this._setInitialPickerScroll(this._singlePickerWrapper);
    } else {
      this._updateArrowButton(this._hoursPickerWrapper, "hours");
      this._updateArrowButton(this._minutesPickerWrapper, "minutes");
      this._updateArrowButton(this._secondsPickerWrapper, "seconds");
      this._setInitialPickerScroll(this._hoursPickerWrapper);
      this._setInitialPickerScroll(this._minutesPickerWrapper);
      this._setInitialPickerScroll(this._secondsPickerWrapper);
    }
  },

  _setInitialPickerScroll(picker) {
    if (picker) {
      let selectedButton =
        picker.getElementsByClassName("uu5-forms-time-button uu5-bricks-button-filled")[0] ||
        picker.getElementsByClassName("uu5-forms-time-single-column-view-button uu5-bricks-button-filled")[0];
      if (selectedButton) {
        let buttonPosTop = Math.round(selectedButton.getBoundingClientRect().top);
        let pickerPosTop = Math.round(picker.getBoundingClientRect().top);
        let pickerHeight = Math.round(picker.getBoundingClientRect().height);
        let pickerScrollTop = picker.scrollTop;
        let buttonHeight = selectedButton.clientHeight;
        let targetPos = pickerPosTop + pickerHeight / 2 - buttonHeight / 2;
        let posDiff = buttonPosTop - targetPos;
        let newScrollTop = pickerScrollTop + posDiff;

        picker.scrollTop = newScrollTop < 0 ? 0 : newScrollTop;
      }
    }
  },

  _updateArrowButton(scrollElement, prefix) {
    if (scrollElement) {
      if (scrollElement.scrollTop <= 0 && !this.state[prefix + "TopMax"]) {
        this.setState({ [prefix + "TopMax"]: true });
      } else if (
        scrollElement.scrollTop + scrollElement.clientHeight - scrollElement.scrollHeight >= -1 &&
        !this.state[prefix + "BottomMax"]
      ) {
        this.setState({ [prefix + "BottomMax"]: true });
      }

      if (scrollElement.scrollTop > 0 && this.state[prefix + "TopMax"]) {
        this.setState({ [prefix + "TopMax"]: false });
      } else if (
        scrollElement.scrollTop + scrollElement.clientHeight - scrollElement.scrollHeight <= 1 &&
        this.state[prefix + "BottomMax"]
      ) {
        this.setState({ [prefix + "BottomMax"]: false });
      }
    }
  },

  _parseTime(value) {
    let result;

    if (value !== null) {
      result = { ...value };

      if (this._isFormat12()) {
        if (result.hours === 0) {
          result.hours = 1;
        }
        result.pm = value && value.dayPart === FORMAT_PM;
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
    let value;
    if (type === "single-column") {
      value = {
        hours: parseInt(time.split(":")[0]),
        minutes: parseInt(time.split(":")[1]),
        seconds: 0
      };
    } else {
      value = {
        hours: type == "hours" ? time : this.state.hours || 0,
        minutes: type == "minutes" ? time : this.state.minutes || 0,
        seconds: type == "seconds" ? time : this.state.seconds || 0
      };
    }

    if (this._show24 && value.hours === 24) {
      value.minutes = 0;
      value.seconds = 0;
    } else if (
      this.props.show24 &&
      value.hours === 0 &&
      value.minutes === 0 &&
      value.seconds === 0 &&
      this._overMidnight
    ) {
      value.hours = 24;
    } else if (value.hours === this._hoursTo) {
      if (value.minutes > this._minutesTo) {
        value.minutes = this._minutesTo;
      }

      if (value.minutes === this._minutesTo && value.seconds > this._secondsTo) {
        value.seconds = this._secondsTo;
      }
    } else if (value.hours === this._hoursFrom) {
      if (value.minutes < this._minutesFrom) {
        value.minutes = this._minutesFrom;
      }

      if (value.minutes === this._minutesFrom && value.seconds < this._secondsFrom) {
        value.seconds = this._secondsFrom;
      }
    }

    let opt = {
      value,
      event: e,
      component: this,
      _data: {
        overMidnight: value.hours > 24,
        type: "picker",
        changeType: type,
        value: UU5.Common.Tools.merge({ pm: this.state.pm }, value)
      }
    };

    if (is12) this._addDayPart(value, this.state.pm);

    if (typeof this.props.onChange === "function") {
      this.props.onChange(opt);
    } else {
      this.onChangeDefault(opt);
    }

    return this;
  },

  _getHours() {
    let hours = [];
    let hoursFrom = Math.floor(this._timeFrom / 60 / 60);
    let hoursTo = Math.floor(this._timeTo / 60 / 60);

    if (this._isFormat12()) {
      for (let i = hoursFrom; i <= 12 && i <= hoursTo; i++) {
        hours.push(i % 12 || 12);
      }
    } else {
      for (let i = hoursFrom; i - hoursFrom <= 24 && i <= hoursTo; i++) {
        let hour = i % (this._show24 ? 25 : 24);

        if (this.props.step <= 60 || hour % (this.props.step % 60)) {
          hours.push(hour);
        }
      }
    }

    return this._isFormat12()
      ? this._getButtons(hours, Math.floor(this.props.step / 60) || 1, this.state.hours, "hours")
      : this._getButtons(hours, Math.floor(this.props.step / 60) || 1, this.state.hours, "hours");
  },

  _getMinutes() {
    let minutes = [];
    let minutesFrom = Math.floor(this._timeFrom / 60);
    let minutesTo = Math.floor(this._timeTo / 60);

    if (this.state.hours === this._hoursFrom || this.state.hours === this._hoursTo) {
      if (this.state.hours === this._hoursFrom) {
        minutesFrom = this.props.timeFrom.minutes;
        minutesTo = 59;
      }

      if (this.state.hours === this._hoursTo) {
        minutesFrom = 0;
        minutesTo = this._minutesTo;
      }

      for (let i = minutesFrom; minutesFrom - i < 60 && i <= minutesTo; i++) {
        let minute = ((minutesFrom % 60) + (i - minutesFrom)) % 60;

        if (minute % this.props.step === 0) {
          minutes.push(minute);
        }
      }
    } else {
      for (let i = minutesFrom; i - minutesFrom < 60 && i <= minutesTo; i++) {
        let minute = ((minutesFrom % 60) + (i - minutesFrom)) % 60;

        if (minute % this.props.step === 0) {
          minutes.push(minute);
        }
      }
    }

    minutes.sort((a, b) => a - b);

    return this._getButtons(minutes, this.props.step, this.state.minutes, "minutes");
  },

  _getSeconds() {
    let seconds = [];
    let secondsFrom = this._timeFrom;
    let secondsTo = this._timeTo;
    let minutesTo = Math.floor(secondsFrom / 60);

    if (
      (this.state.hours === this._hoursFrom && this.state.minutes === this._minutesFrom) ||
      (this.state.hours === this._hoursTo && this.state.minutes === this._minutesTo)
    ) {
      if (this.state.hours === this._hoursFrom && this.state.minutes === this._minutesFrom) {
        secondsFrom = this.props.timeFrom.seconds;
        secondsTo = 59;
      }

      if (this.state.hours === this._hoursTo && this.state.minutes === this._minutesTo) {
        secondsFrom = 0;
        secondsTo = this._secondsTo;
      }

      for (let i = secondsFrom; secondsFrom - i < 60 && i <= secondsTo; i++) {
        seconds.push(((secondsFrom % 60) + (i - secondsFrom)) % 60);
      }
    } else {
      for (let i = secondsFrom; i - secondsFrom < 60 && i <= secondsTo; i++) {
        seconds.push(((secondsFrom % 60) + (i - minutesTo)) % 60);
      }
    }

    seconds.sort((a, b) => a - b);

    return this._getButtons(seconds, 1, this.state.seconds, "seconds");
  },

  _getButtons(itemList, step, selected, type) {
    selected = this.state.valid ? selected : null;

    return itemList.map((item, index) => {
      return (
        <UU5.Bricks.Button
          colorSchema={selected === item ? this.getColorSchema() : "default"}
          className={this.getClassName("button")}
          bgStyle={selected === item ? "filled" : "transparent"}
          content={UU5.Common.Tools.rjust(item, 2, "0")}
          key={index}
          onClick={(component, e) => this._setTime(item, type, e)}
        />
      );
    });
  },

  _getSingleColumnItems() {
    let result = [];
    let stepInSeconds = this.props.step * 60;
    let timeSpan = this._timeTo - this._timeFrom;
    let time = this._timeFrom;
    for (let i = 0; i <= timeSpan / stepInSeconds; i++) {
      let hours = Math.floor(time / 60 / 60);
      let minutes = Math.floor((time - hours * 60 * 60) / 60);
      let format;

      if (this.props.format == FORMAT_12) {
        hours -= 1;

        if (hours === 24) {
          break;
        }

        if (hours >= 12) {
          format = FORMAT_PM;
          hours -= 12;
        } else {
          format = FORMAT_AM;
        }

        if (hours === 0) {
          hours = 12;
        }
      } else {
        if (hours >= 24) {
          hours = hours % 24;
        }
      }

      let value = UU5.Common.Tools.rjust(hours, 2, "0") + ":" + UU5.Common.Tools.rjust(minutes, 2, "0");
      if (format) {
        value += " " + format;
      }

      let selected = hours === this.state.hours && minutes === this.state.minutes;
      if (format && selected) {
        if (this.state.pm && format === FORMAT_PM) {
          selected = true;
        } else if (!this.state.pm && format === FORMAT_AM) {
          selected = true;
        } else {
          selected = false;
        }
      }

      const onClick = (component, e) => {
        if (format) {
          if (format === FORMAT_AM && this.state.pm) {
            this.setState({ pm: false }, () => this._setTime(value, "single-column", e));
          } else if (format === FORMAT_PM && !this.state.pm) {
            this.setState({ pm: true }, () => this._setTime(value, "single-column", e));
          } else {
            this._setTime(value, "single-column", e);
          }
        } else {
          this._setTime(value, "single-column", e);
        }
      };

      result.push(
        <UU5.Bricks.Button
          className={this.getClassName("singleColumnViewButton")}
          colorSchema={selected ? this.getColorSchema() : "default"}
          bgStyle={selected ? "filled" : "transparent"}
          content={value}
          key={i}
          onClick={onClick}
        />
      );

      time += stepInSeconds;
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
      this.setState(state => {
        let pm = !state.pm;
        let value = {
          hours: state.hours,
          minutes: state.minutes,
          seconds: state.seconds
        };

        let opt = {
          value,
          event: e,
          component: this,
          _data: { type: "switchDayPart", value: UU5.Common.Tools.merge({ pm }, value) }
        };

        this._addDayPart(value, pm);

        if (typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      });
    });
    return this;
  },

  _getHeader(unit) {
    return (
      <div className={this.getClassName("timeHeader")}>
        {this.isXs() ? this.getLsiComponent(unit) : this.getLsiComponent(unit)[0]}
      </div>
    );
  },

  _getBody(unit) {
    let wrapperId;
    let topMax;
    let bottomMax;
    let content;

    if (unit == "seconds") {
      wrapperId = this.getId() + "-secondsPickerWrapper";
      topMax = this.getClassName("nav") + (this.state.secondsTopMax ? " " + this.getClassName("navMax") : "");
      bottomMax = this.getClassName("nav") + (this.state.secondsBottomMax ? " " + this.getClassName("navMax") : "");
      content = this._getSeconds();
    } else if (unit == "minutes") {
      wrapperId = this.getId() + "-minutesPickerWrapper";
      topMax = this.getClassName("nav") + (this.state.minutesTopMax ? " " + this.getClassName("navMax") : "");
      bottomMax = this.getClassName("nav") + (this.state.minutesBottomMax ? " " + this.getClassName("navMax") : "");
      content = this._getMinutes();
    } else if (unit == "hours") {
      wrapperId = this.getId() + "-hoursPickerWrapper";
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
          ref={picker => {
            if (unit === "hours") {
              this._hoursPickerWrapper = picker;
            } else if (unit === "minutes") {
              this._minutesPickerWrapper = picker;
            } else if (unit === "seconds") {
              this._secondsPickerWrapper = picker;
            }
          }}
          onScroll={e => {
            this._updateArrowButton(e.nativeEvent.target, unit);
          }}
        >
          <div className={this.getClassName(unit)}>{content}</div>
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
              {this._getHeader("hours")}
              {this._getBody("hours")}
            </div>
            <div className={this.getClassName("timeSeparator")}></div>
            <div className={this.getClassName("minutesWrapper")}>
              {this._getHeader("minutes")}
              {this._getBody("minutes")}
            </div>

            {this.props.seconds && (this.props.step <= 1 || !this.props.step)
              ? [
                  <div className={this.getClassName("timeSeparator")} key={"separator"}></div>,
                  <div className={this.getClassName("secondsWrapper")} key={"wrapper"}>
                    {this._getHeader("seconds")}
                    {this._getBody("seconds")}
                  </div>
                ]
              : null}
          </div>
          {this._isFormat12() && (
            <div className={this.getClassName("timePart")}>
              <span className={this.getClassName("am") + (!this.state.pm ? " " + this.getClassName("amSelected") : "")}>
                AM
              </span>
              <UU5.Bricks.Switch
                size="m"
                onIcon="mdi-chevron-right"
                offIcon="mdi-chevron-left"
                className={this.getClassName("timePartSwitch")}
                ref_={buttonSwitch => (this._buttonSwitch = buttonSwitch)}
                onChange={() => this._switchDayPart()}
                switchedOn={!!this.state.pm}
              />
              <span className={this.getClassName("pm") + (this.state.pm ? " " + this.getClassName("pmSelected") : "")}>
                PM
              </span>
            </div>
          )}
        </div>
      );
    } else {
      result = <div {...this._getMainAttrs()}>{this._getSingleColumnItems()}</div>;
    }

    return result;
  },

  _getMainAttrs() {
    let attrs = this.getMainAttrs();

    if (this.props.type === "single-column") {
      attrs.className += " " + this.getClassName("singleColumnView");
      attrs.ref = this._registerSinglePickerWrapper;
    }

    if (this.props.mobileDisplay) {
      attrs.className += " " + this.getClassName("screenSizeBehaviour");
    }

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this._getType();
  }
  //@@viewOff:render
});

export default Time;
