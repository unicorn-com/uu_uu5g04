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
import ns from "./forms-ns.js";

import TextInput from "./internal/text-input.js";
import Time from "./time.js";

import InputMixin from "./mixins/input-mixin.js";
import TextInputMixin from "./mixins/text-input-mixin.js";

import Context from "./form-context.js";
import DateTools, { REGEXP } from "./internal/date-tools.js";

import "./time-picker.less";
//@@viewOff:imports

const TIME_FORMAT_12 = "12";
const TIME_FORMAT_24 = "24";

export const TimePicker = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "TimePicker", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ScreenSizeMixin,
      TextInputMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("TimePicker"),
      classNames: {
        main: ns.css("timepicker"),
        open: ns.css("timepicker-open"),
        menu: ns.css("input-menu"),
        seconds: ns.css("timepicker-seconds"),
        screenSizeBehaviour: ns.css("screen-size-behaviour")
      },
      defaults: {
        regexpFormat1: /^\d{1,2}:?\d{0,2} ?[PpAa]?\.?[Mm]?\.?$/,
        regexpFormat2: /^\d{1,2}:?\d{0,2}$/,
        regexpPm: /(PM|pm|Pm)/,
        regexpAm: /(AM|am|Am)/,
        inputColWidth: "xs12 s4 m4 l3 xl3"
      },
      lsi: () => UU5.Environment.Lsi.Forms.message
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.string,
      iconOpen: UU5.PropTypes.string,
      iconClosed: UU5.PropTypes.string,
      format: UU5.PropTypes.oneOf([TIME_FORMAT_24, TIME_FORMAT_12]),
      nanMessage: UU5.PropTypes.any,
      seconds: UU5.PropTypes.bool,
      valueType: UU5.PropTypes.oneOf(["string", "date"]),
      openToContent: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string]),
      step: UU5.PropTypes.number,
      strictStep: UU5.PropTypes.bool,
      pickerType: UU5.PropTypes.oneOf(["single-column", "multi-column"]),
      suffix: UU5.PropTypes.string,
      timeFrom: UU5.PropTypes.string,
      timeTo: UU5.PropTypes.string,
      show24: UU5.PropTypes.bool
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: "",
        iconOpen: "mdi-clock-outline",
        iconClosed: "mdi-clock-outline",
        format: TIME_FORMAT_24,
        nanMessage: "Please insert a valid time.",
        seconds: false,
        valueType: null,
        openToContent: "xs",
        step: 1,
        strictStep: false,
        pickerType: "multi-column",
        suffix: undefined,
        timeFrom: undefined,
        timeTo: undefined,
        show24: false
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    componentWillMount() {
      this._valueOverMidnight = false;
      this._hasFocus = false;
      this._allowBlur = false;

      this._setUpLimits(this.props);

      let value = this._formatTime(this.props.value, false) || this.props.value;
      let validationResult = this._validateOnChange({ value, event: null, component: this });

      if (validationResult) {
        this._updateState(validationResult);
      } else {
        validationResult = this._validateTime({ value });
        if (validationResult.feedback === "initial") {
          validationResult.feedback = this.props.feedback || validationResult.feedback;
          validationResult.message = this.props.message || validationResult.message;
        }

        this._updateState(validationResult);
      }

      return this;
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        this._setUpLimits(nextProps);

        let value =
          this._hasInputFocus() && !(nextProps.value instanceof Date)
            ? nextProps.value
            : this._formatTime(nextProps.value, false) || nextProps.value;
        let validationResult = this._validateOnChange({ value, event: null, component: this }, true);

        if (validationResult) {
          this._updateState(validationResult);
        } else {
          validationResult = this._validateTime({ value });
          if (validationResult.feedback === "initial") {
            validationResult.feedback = nextProps.feedback || validationResult.feedback;
            validationResult.message = nextProps.message || validationResult.message;
          }

          this._updateState(validationResult);
        }
      }

      return this;
    },

    componentWillUnmount() {
      this._removeEvent();
    },

    componentDidUpdate(prevProps, prevState) {
      if (this.isOpen()) {
        if (
          (this.state.screenSize === "xs" && prevState.screenSize !== "xs") ||
          (this.state.screenSize !== "xs" && prevState.screenSize === "xs")
        ) {
          this._open();
        }
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    toggle(setStateCallback) {
      this.setState(state => {
        if (state.open) {
          this._removeEvent();
        } else {
          this._addEvent();
        }
        return { open: !state.open };
      }, setStateCallback);
      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    setFeedback_(feedback, message, value, setStateCallback) {
      value = this._hasInputFocus() && !(value instanceof Date) ? value : this._formatTime(value, false) || value;
      this.setFeedbackDefault(feedback, message, value, setStateCallback);
    },

    setValue_(value, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";
      value = this._hasInputFocus() && !(value instanceof Date) ? value : this._formatTime(value, false) || value;
      if (!this._validateOnChange({ value }, false)) {
        if (this._checkRequired({ value })) {
          _callCallback = false;
          this._updateState(this._validateTime({ value }), setStateCallback);
        }
      }

      if (_callCallback) {
        // function _validateOnChange always calls a provided callback, therefore
        // this is a workaround to secure that we call it only once and a setState callback
        this.setState({}, setStateCallback);
      }

      return this;
    },

    getValue_(timeObject) {
      let time = timeObject || this.state.value;

      if (time && this.props.valueType == "date") {
        let date = new Date(Date.now());
        let hours =
          (timeObject && typeof timeObject.hours == "number" && UU5.Common.Tools.rjust(timeObject.hours, 2, "0")) ||
          this.state.value.split(/:| +/)[0] ||
          "00";
        let minutes =
          (timeObject && typeof timeObject.minutes == "number" && UU5.Common.Tools.rjust(timeObject.minutes, 2, "0")) ||
          this.state.value.split(/:| +/)[1] ||
          "00";
        let seconds =
          (timeObject && typeof timeObject.seconds == "number" && UU5.Common.Tools.rjust(timeObject.seconds, 2, "0")) ||
          this.state.value.split(/:| +/)[2] ||
          "00";
        if (hours) {
          if (this.props.format == "12") {
            let dayPart = (timeObject && timeObject.dayPart) || this.state.value.split(/:| +/)[3];
            if (dayPart == "AM" && hours == 12) {
              hours = 0;
            } else {
              hours = (hours % 12) + (dayPart == "PM" ? 12 : 0);
            }
          }
          date = new Date(date.setHours(hours));
        }
        if (minutes) {
          date = new Date(date.setMinutes(minutes));
        }
        if (seconds) {
          date = new Date(date.setSeconds(seconds));
        }
        time = date;
      }

      return time;
    },

    onChangeDefault_(opt, setStateCallback) {
      let type = opt._data.type;
      opt.value = opt._data.value;

      if (type == "input") {
        this._onChangeInputDefault(opt, setStateCallback);
      } else if (type == "picker" || type == "switchDayPart") {
        this._onChangePickerDefault(opt, setStateCallback);
      }
    },

    onFocusDefault_(opt) {
      let result = this.getFocusFeedback(opt);

      result && this._updateState(result);
    },

    onBlurDefault_(opt) {
      let value = opt._data ? opt._data.value : opt.value;
      let formatedValue = this._formatTime(value);
      if (this._checkRequired({ value: formatedValue || value }) && !this.props.validateOnChange) {
        opt.value = formatedValue || value;
        opt.required = this.props.required;
        let blurResult = this.getBlurFeedback(opt);
        let result = this._validateTime(blurResult);

        this._updateState(result);
      } else {
        this.setState({ value: formatedValue || value });
      }
    },

    open_(setStateCallback) {
      this._addEvent();
      this.openDefault(() => this._open(setStateCallback));
    },

    close_(setStateCallback) {
      this._removeEvent();
      this.closeDefault(() => this._close(setStateCallback));
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _registerInput(ref) {
      this._textInput = ref;
    },

    _setUpLimits(props) {
      let { timeFrom, timeTo, show24 } = DateTools.setupLimits(props);
      this._timeFrom = timeFrom;
      this._timeTo = timeTo;
      this._show24 = show24;
    },

    _getEventPath(e) {
      let path = [];
      let node = e.target;
      while (node != document.body && node != document.documentElement && node) {
        path.push(node);
        node = node.parentNode;
      }
      return path;
    },

    _findTarget(e) {
      let labelMatch = "[id='" + this.getId() + "'] label";
      let inputMatch = "[id='" + this.getId() + "'] input";
      let pickerMatch = "[id='" + this.getId() + "'] .uu5-forms-input-menu";
      let result = {
        component: false,
        input: false,
        label: false,
        picker: false
      };
      let eventPath = this._getEventPath(e);
      eventPath.every(item => {
        let functionType = item.matches ? "matches" : "msMatchesSelector";
        if (item[functionType]) {
          if (item[functionType](labelMatch)) {
            result.label = true;
            result.component = true;
          } else if (item[functionType](inputMatch)) {
            result.input = true;
            result.component = true;
          } else if (item[functionType](pickerMatch)) {
            result.picker = true;
            result.component = true;
          } else if (item === this._root) {
            result.component = true;
            return false;
          }
          return true;
        } else {
          return false;
        }
      });

      return result;
    },

    _addKeyEvents() {
      let handleKeyDown = e => {
        if (e.which === 13) {
          // enter
          e.preventDefault();
        } else if (e.which === 40) {
          // bottom
          e.preventDefault();
        } else if (e.which === 27) {
          // esc
          e.preventDefault();
        }
      };

      let handleKeyUp = e => {
        let focusResult = this._findTarget(e);
        let doBlur = !focusResult.component;
        let opt = { value: this.state.value, event: e, component: this };
        if (e.which === 13) {
          // enter
          if (!this.isOpen()) {
            this.open();
          } else {
            this.close();
          }
        } else if (e.which === 40) {
          // bottom
          e.preventDefault();
          if (!this.isOpen()) {
            this.open();
          }
        } else if (e.which === 9) {
          // tab
          if (doBlur) {
            this._allowBlur = true;
            if (this.isOpen()) {
              this.close(() => this._onBlur(opt));
            } else {
              this._onBlur(opt);
            }
          }
        } else if (e.which === 27) {
          // esc
          if (this.isOpen()) {
            this.close();
          }
        }
      };

      UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), e => handleKeyDown(e));
      UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), e => handleKeyUp(e));
    },

    _removeKeyEvents() {
      UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("keyup", this.getId());
    },

    _handleClick(e) {
      // This function can be called twice if clicking inside the component but it doesnt do anything in that case
      let clickData = this._findTarget(e);
      let opt = { value: this.state.value, event: e, component: this };

      if (!(clickData.input || clickData.picker)) {
        if (this.isOpen()) {
          this._allowBlur = true;
          this.close(() => this._onBlur(opt));
        }
      }
    },

    _addEvent() {
      window.addEventListener("click", this._handleClick, true);
    },

    _removeEvent() {
      window.removeEventListener("click", this._handleClick, true);
    },

    _open(setStateCallback) {
      if (this._popover) {
        this._popover.open(
          {
            onClose: this._close,
            aroundElement: UU5.Common.DOM.findNode(this._textInput),
            position: "bottom",
            offset: this._shouldOpenToContent() ? 0 : 4,
            preventPositioning: this._shouldOpenToContent()
          },
          setStateCallback
        );
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _close(setStateCallback) {
      if (this._popover) {
        this._popover.close(setStateCallback);
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _shouldOpenToContent() {
      let result = false;

      if (typeof this.props.openToContent === "string") {
        let screenSize = this.getScreenSize();
        this.props.openToContent
          .trim()
          .split(" ")
          .some(size => {
            if (screenSize == size) {
              result = true;
              return true;
            } else {
              return false;
            }
          });
      } else if (typeof this.props.openToContent === "boolean") {
        result = this.props.openToContent;
      }

      return result;
    },

    _onChange(e, opt) {
      this._valueOverMidnight = false;
      opt = opt || { value: e.target.value, event: e, component: this };

      if (opt.value === "" || this._parseTime(opt.value)) {
        if (!this.isComputedDisabled() && !this.isReadOnly()) {
          opt.required = this.props.required;
          let result = this.getChangeFeedback(opt);
          opt._data = { type: "input", required: this.props.required, result: result };
          if (typeof this.props.onChange === "function") {
            this.props.onChange(opt);
          } else {
            this.onChangeDefault(opt);
          }
        }
      } else {
        this.setState({ value: opt.value });
      }

      return this;
    },

    _onChangeInputDefault(opt, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (this.props.validateOnChange) {
        _callCallback = false;
        this._validateOnChange(opt._data.result, false, setStateCallback);
      } else {
        if (opt._data.result.value === "") {
          _callCallback = false;
          this.setState({ value: opt.value }, setStateCallback);
        } else if (this._checkRequired({ value: opt._data.result.value })) {
          opt.required = this.props.required;
          let result = opt._data.result || this.getChangeFeedback(opt);

          if (
            !result.value ||
            (this.props.format === TIME_FORMAT_12 && result.value.match(REGEXP.timeFormat12)) ||
            (this.props.seconds &&
              this.props.step === 1 &&
              this.props.format === TIME_FORMAT_12 &&
              result.value.match(REGEXP.timeFormat12seconds)) ||
            (this.props.format === TIME_FORMAT_24 && result.value.match(REGEXP.timeFormat24)) ||
            (this.props.seconds &&
              this.props.step === 1 &&
              this.props.format === TIME_FORMAT_24 &&
              result.value.match(REGEXP.timeFormat24seconds))
          ) {
            _callCallback = false;
            this._updateState(result, setStateCallback);
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _onChangePickerDefault(opt, setStateCallback) {
      this.setValue_(
        this._formatTime(opt.value),
        this.props.pickerType === "single-column"
          ? () => this.close(setStateCallback)
          : typeof setStateCallback === "function"
          ? setStateCallback()
          : null
      );

      return this;
    },

    _onFocus(opt) {
      if (!this._hasFocus) {
        this._addKeyEvents();
        this._hasFocus = true;
        if (!this.isReadOnly() && !this.isComputedDisabled()) {
          if (typeof this.props.onFocus === "function") {
            this.props.onFocus(opt);
          } else {
            this.onFocusDefault(opt);
          }
        }
      }
    },

    _trueOnBlur(e) {
      this._onBlur({ component: this, event: e, value: this.state.value });
    },

    _onBlur(opt) {
      if (this._hasFocus && this._allowBlur) {
        this._allowBlur = false;
        this._removeKeyEvents();
        this._hasFocus = false;
        if (typeof this.props.onBlur === "function") {
          this.props.onBlur(opt);
        } else {
          this.onBlurDefault(opt);
        }
      }
    },

    _hasInputFocus() {
      let result = false;

      if (this._textInput) {
        result = this._textInput.hasFocus();
      }

      return result;
    },

    _validateLimits(time) {
      return DateTools.validateLimits(time, this._timeFrom, this._timeTo);
    },

    _validateTime(opt) {
      let result = { ...opt };
      let parsedTime = opt.value ? this._parseTime(opt.value, false) : null;

      if (opt.value && !parsedTime) {
        result.feedback = "error";
        result.message = this.props.nanMessage;
      } else if (parsedTime && this.props.strictStep && parsedTime.minutes % this.props.step > 0) {
        result.feedback = "error";
        result.message = this.props.nanMessage;
      } else {
        if (!this._validateLimits(parsedTime)) {
          result.feedback = "error";
          result.message = this.props.nanMessage;
        } else {
          result.feedback = result.feedback || "initial";
          result.message = result.message || null;
        }
      }

      return result;
    },

    _validateOnChange(opt, checkValue, setStateCallback) {
      let result;
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        opt.component = this;
        opt.required = this.props.required;

        if (this.props.valueType == "date" && opt.value) {
          opt.value = this.getValue_(this._parseTime(opt.value));
        }

        result = typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;
        if (result && typeof result === "object" && result.feedback) {
          _callCallback = false;
          this._updateState(result, setStateCallback);
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return result;
    },

    _getFeedbackIcon() {
      return this.isOpen() ? this.props.iconOpen : this.props.iconClosed;
    },

    _onTimeChange(opt) {
      opt.component = this;
      opt._data = { type: "picker", value: UU5.Common.Tools.merge({}, opt.value) };

      if (opt.value && opt.value.hours > 24) {
        this._valueOverMidnight = true;
        opt.value.hours = opt.value.hours % 24;
        opt._data.value.hours = opt._data.value.hours % 24;
      } else {
        this._valueOverMidnight = false;
      }

      if (!this.isComputedDisabled() && !this.isReadOnly()) {
        if (this.props.valueType == "date") {
          opt.value = this.getValue_(opt.value);
        } else {
          if (opt.value.hours === null) {
            opt.value = null;
          } else {
            opt.value = this._formatTime(opt.value);
          }
        }

        if (typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }
      return this;
    },

    _getTimeProps(value) {
      if (!this.state.value || this.state.value.trim() === "") {
        value = null;
      }

      if (this._valueOverMidnight && value) {
        value.hours = value.hours + 24;
      }

      return {
        className: this.getClassName().menu,
        value,
        hidden: !this.isOpen(),
        onChange: this._onTimeChange,
        format: this.props.format,
        controlled: true,
        seconds: this.props.seconds && this.props.step === 1,
        step: this.props.step,
        type: this.props.pickerType,
        colorSchema: this.getColorSchema(),
        mobileDisplay: this.isXs(),
        timeFrom: this._timeFrom,
        timeTo: this._timeTo,
        show24: this.props.show24
      };
    },

    _updateState(newState, setStateCallback) {
      if (newState.value !== undefined) {
        if (newState.value === null) {
          newState.value = "";
        } else if (newState.value instanceof Date) {
          newState.value = UU5.Common.Tools.getTimeString(newState.value);
        }
      } else {
        newState.value = this.state.value;
      }

      if (newState.message === undefined) {
        newState.message = this.state.message || null;
      }

      this.setState(newState, setStateCallback);
    },

    _formatTime(value, autofill) {
      if (value && !UU5.Common.Tools.isPlainObject(value)) {
        value = this._parseTime(value, autofill);
      }

      return UU5.Common.Tools.formatTime(value, this.props.seconds, this.props.format, true, this.props.step, true);
    },

    _parseTime(timeString, autofill = true) {
      return UU5.Common.Tools.parseTime(timeString, this.props.format, autofill, this.props.show24);
    },

    _getMainAttrs() {
      let attrs = this._getInputAttrs();
      attrs.id = this.getId();

      if (this.isOpen()) {
        attrs.className += " " + this.getClassName().open;
      }

      if (this.props.seconds) {
        attrs.className += " " + this.getClassName().seconds;
      }

      if (this._shouldOpenToContent()) {
        attrs.className += " " + this.getClassName().screenSizeBehaviour;
      }

      if (!this.isReadOnly() && !this.isComputedDisabled()) {
        let handleMobileClick = e => {
          if (this.isOpen()) {
            e.target.focus();
            this.close();
          } else {
            document.activeElement.blur();
            e.target.blur();
          }

          UU5.Common.Tools.scrollToTarget(
            this.getId() + "-input",
            false,
            UU5.Environment._fixedOffset + 20,
            this._findScrollElement(this._root)
          );
        };

        let handleClick = e => {
          let clickData = this._findTarget(e.nativeEvent);
          let opt = { value: this.state.value, event: e, component: this };

          if (this._shouldOpenToContent() && clickData.input) {
            handleMobileClick(e);
          }

          if (clickData.input) {
            this._allowBlur = false;
            e.preventDefault();
            if (!this.isOpen()) {
              this.open(() => this._onFocus(opt));
            } else if (!this.isOpen()) {
              this._onFocus(opt);
            }
          }
        };

        attrs.onClick = e => {
          handleClick(e);
        };

        attrs.onFocus = () => {
          this._allowBlur = true;
        };
      }

      return attrs;
    },

    _getPopoverProps() {
      let props = {};

      props.ref_ = ref => (this._popover = ref);
      props.forceRender = true;
      props.disableBackdrop = true;
      props.shown = this.isOpen();
      props.fitHeightToViewport = this.props.pickerType === "single-column";

      return props;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";

      let inputAttrs = this.props.inputAttrs;
      inputAttrs = UU5.Common.Tools.merge({ autoComplete: "off" }, inputAttrs);

      inputAttrs.className === "" ? delete inputAttrs.className : null;
      return (
        <div {...this._getMainAttrs()} ref={comp => (this._root = comp)}>
          {this.getLabel(inputId)}
          {this.getInputWrapper([
            <TextInput
              id={inputId}
              name={this.props.name || inputId}
              value={this.state.value || ""}
              placeholder={this.props.placeholder}
              type="text"
              onChange={this._onChange}
              onFocus={!this.isReadOnly() && !this.isComputedDisabled() ? this._onFocus : null}
              onBlur={!this.isReadOnly() && !this.isComputedDisabled() ? this._trueOnBlur : null}
              onKeyDown={this.onKeyDown}
              mainAttrs={inputAttrs}
              disabled={this.isComputedDisabled()}
              readonly={this.isReadOnly()}
              icon={this._getFeedbackIcon()}
              iconClickable={false}
              loading={this.isLoading()}
              ref_={this._registerInput}
              feedback={this.getFeedback()}
              borderRadius={this.props.borderRadius}
              elevation={this.props.elevation}
              bgStyle={this.props.bgStyle}
              inputWidth={this._getInputWidth()}
              colorSchema={this.props.colorSchema}
              suffix={this.props.suffix}
              size={this.props.size}
              key="input"
            />,
            <UU5.Bricks.Popover {...this._getPopoverProps()} key="popover">
              {this.isOpen() ? <Time {...this._getTimeProps(this._parseTime(this.state.value))} /> : null}
            </UU5.Bricks.Popover>
          ])}
        </div>
      );
    }
    //@@viewOff:render
  })
);

export const Timepicker = TimePicker;

export default TimePicker;
