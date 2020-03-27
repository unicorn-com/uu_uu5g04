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
import TextInputMixin from "./mixins/text-input-mixin.js";
import ItemsInput from "./internal/items-input.js";
import TextInput from "./internal/text-input.js";
import Label from "./internal/label.js";

import Context from "./form-context.js";

import "./date-range-picker.less";
import DateTools from "./internal/date-tools.js";
//@@viewOff:imports

export const DateRangePicker = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "DateRangePicker", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ScreenSizeMixin,
      UU5.Common.ContentMixin,
      TextInputMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("DateRangePicker"),
      classNames: {
        main: ns.css("daterangepicker"),
        open: ns.css("daterangepicker-open"),
        menu: ns.css("input-menu"),
        leftCalendar: ns.css("daterangepicker-calendar-left"),
        rightCalendar: ns.css("daterangepicker-calendar-right"),
        multiMonth: ns.css("daterangepicker-multi-month-selection"),
        screenSizeBehaviour: ns.css("screen-size-behaviour"),
        mainInput: ns.css("daterangepicker-main-input"),
        inputContentWrapper: ns.css("daterangepicker-input-content-wrapper"),
        inputText: ns.css("daterangepicker-input-text"),
        inputValue: ns.css("daterangepicker-input-value"),
        inputFrom: ns.css("daterangepicker-from-input"),
        inputTo: ns.css("daterangepicker-to-input"),
        inputActive: ns.css("input-active"),
        calendarSeparator: ns.css("daterangepicker-calendar-separator"),
        firstRow: ns.css("daterangepicker-popover-first-row"),
        secondRow: ns.css("daterangepicker-popover-second-row"),
        leftColumn: ns.css("daterangepicker-popover-left-column"),
        rightColumn: ns.css("daterangepicker-popover-right-column"),
        calendarInput: ns.css("daterangepicker-calendar-input"),
        todayButton: ns.css("daterangepicker-today-button"),
        inputOpen: ns.css("items-input-open"),
        calendars: ns.css("daterangepicker-calendars"),
        customContent: ns.css("daterangepicker-custom-content"),
        labelFrom: ns.css("daterangepicker-from-label"),
        labelTo: ns.css("daterangepicker-to-label"),
        mainPlaceholder: ns.css("daterangepicker-main-placeholder"),
        popoverWrapper: ns.css("daterangepicker-popover-wrapper"),
        inputPlaceholder: ns.css("input-placeholder"),
        labelBogus: ns.css("datetimerangepicker-label-bogus")
      },
      defaults: {
        format: "dd.mm.Y",
        columnRegexp: /^((?:offset-)?[a-z]+)(?:-)?(\d+)$/,
        inputColWidth: "xs12 s4 m4 l3 xl3"
      },
      errors: {
        dateFromGreaterThanDateTo: "The property dateFrom is greater than the property dateTo.",
        firstGreaterThanSecond: "The first date of range is greater than the second date of range."
      },
      lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Bricks.calendar, UU5.Environment.Lsi.Forms.message)
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.arrayOf(UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string])),
      dateFrom: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
      dateTo: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
      format: UU5.PropTypes.string,
      country: UU5.PropTypes.string,
      beforeRangeMessage: UU5.PropTypes.any,
      afterRangeMessage: UU5.PropTypes.any,
      parseDate: UU5.PropTypes.func,
      icon: UU5.PropTypes.string,
      iconOpen: UU5.PropTypes.string,
      iconClosed: UU5.PropTypes.string,
      disableBackdrop: UU5.PropTypes.bool,
      openToContent: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string]),
      hideFormatPlaceholder: UU5.PropTypes.bool,
      hideWeekNumber: UU5.PropTypes.bool,
      showTodayButton: UU5.PropTypes.bool,
      labelFrom: UU5.PropTypes.any,
      labelTo: UU5.PropTypes.any,
      pickerLabelFrom: UU5.PropTypes.any,
      pickerLabelTo: UU5.PropTypes.any,
      innerLabel: UU5.PropTypes.bool,
      step: UU5.PropTypes.oneOf(["days", "months", "years"])
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: null,
        dateFrom: null,
        dateTo: null,
        format: null,
        country: null,
        beforeRangeMessage: "Date is out of range.",
        afterRangeMessage: "Date is out of range.",
        parseDate: null,
        icon: "mdi-calendar",
        iconOpen: "mdi-menu-down",
        iconClosed: "mdi-menu-down",
        disableBackdrop: false,
        openToContent: "xs",
        hideFormatPlaceholder: false,
        hideWeekNumber: false,
        showTodayButton: false,
        labelFrom: null,
        labelTo: null,
        pickerLabelFrom: undefined,
        pickerLabelTo: undefined,
        innerLabel: false,
        step: "days"
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      let propValue = Array.isArray(this.props.value) && this.props.value.length > 1 ? this.props.value : null;
      propValue = this.parseDate(propValue);
      let fromInputValue = null;
      let toInputValue = null;
      let calendarView = DateTools.getCalendarStartView(this.props);

      if (propValue) {
        let devValidation = this._validateDevProps(propValue, this.props.dateFrom, this.props.dateTo);
        if (devValidation.valid) {
          let validateResult = this._validateDateRangeResult({ value: propValue });
          if (validateResult.feedback === "error") propValue = null;
          else if (Array.isArray(propValue) && propValue.length === 1) propValue = null;

          if (propValue) {
            fromInputValue = this._getDateString(this._getFromValue(propValue));
            toInputValue = this._getDateString(this._getToValue(propValue));
          }
        } else {
          propValue = null;
          this.showError(devValidation.error);
        }
      }
      let fromDisplayDate, toDisplayDate;
      let displayDates = DateTools.getDisplayDates(propValue, calendarView);
      let today = new Date(Date.now());

      if (propValue) {
        fromDisplayDate = displayDates.dateFrom;
        toDisplayDate = displayDates.dateTo;
      } else if (this.props.dateFrom || this.props.dateTo) {
        if (
          (!this.props.dateFrom ||
            (this.props.dateFrom && this._compareDates(today, this.props.dateFrom, "greater"))) &&
          (!this.props.dateTo || (this.props.dateTo && this._compareDates(today, this.props.dateTo, "lesser")))
        ) {
          displayDates = DateTools.getDisplayDates(today, calendarView);
          fromDisplayDate = displayDates.dateFrom;
          toDisplayDate = displayDates.dateTo;
        } else {
          displayDates = DateTools.getDisplayDates(this.parseDate(this.props.dateFrom || this.props.dateTo), calendarView);
          fromDisplayDate = displayDates.dateFrom;
          toDisplayDate = displayDates.dateTo;
        }
      } else {
        displayDates = DateTools.getDisplayDates(today, calendarView);
        fromDisplayDate = displayDates.dateFrom;
        toDisplayDate = displayDates.dateTo;
      }

      return {
        fromDisplayDate,
        fromInputValue,
        fromFeedback: { feedback: "initial", message: null },
        toDisplayDate,
        toInputValue,
        toFeedback: { feedback: "initial", message: null },
        country: this.props.country,
        format: this.props.format,
        toInputActive: false,
        tempValue: null,
        calendarView
      };
    },

    componentWillMount() {
      this._hasFocus = false;

      let value;
      let devValidation = this._validateDevProps(this.parseDate(this.props.value), this.props.dateFrom, this.props.dateTo);
      if (devValidation.valid) {
        if (this.state.value) {
          // value is probably valid
          value = this.state.value;

          if (this.props.onValidate && typeof this.props.onValidate === "function") {
            this._validateOnChange({ value, event: null, component: this });
          }
        } else if (this.props.value) {
          // value probably isnt valid
          value = this.parseDate(this.props.value);

          if (this.props.onValidate && typeof this.props.onValidate === "function") {
            this._validateOnChange({ value, event: null, component: this });
          } else {
            if (Array.isArray(value) && value.length === 1) {
              this.setValue(null);
            } else {
              let validateResult = this._validateDateRangeResult({ value });
              if (validateResult.feedback === "error") {
                this.setError(validateResult.message, null);
              }
            }
          }
        } else {
          // there is no value
          if (this.props.onValidate && typeof this.props.onValidate === "function") {
            this._validateOnChange({ value, event: null, component: this });
          }
        }
      } else {
        this.showError(devValidation.error);
      }

      return this;
    },

    componentDidMount() {
      UU5.Environment.EventListener.registerDateTime(this.getId(), this._change);
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.controlled) {
        let devValidation = this._validateDevProps(nextProps.value, nextProps.dateFrom, nextProps.dateTo);
        if (devValidation.valid) {
          let result = this._validateDateRangeResult(
            { value: nextProps.value, message: nextProps.message, feedback: nextProps.feedback },
            nextProps
          );
          if (result) {
            if (typeof result === "object") {
              if (this.props.onValidate && typeof this.props.onValidate === "function") {
                this._validateOnChange({ value: result.value, event: null, component: this }, true);
              } else {
                if (result.feedback) {
                  this.setFeedback(result.feedback, result.message, result.feedback === "error" ? null : result.value);
                } else {
                  this.setFeedback(nextProps.feedback, nextProps.message, nextProps.value);
                }
              }
            }
          }
        } else {
          this.showError(devValidation.error);
        }
      }

      return this;
    },

    componentWillUnmount() {
      this._removeEvent();
      this._removeKeyEvents();
      UU5.Environment.EventListener.unregisterDateTime(this.getId(), this._change);
    },

    componentDidUpdate(prevProps, prevState) {
      if (this.isOpen()) {
        if (
          (this.state.screenSize === "xs" && prevState.screenSize !== "xs") ||
          (this.state.screenSize !== "xs" && prevState.screenSize === "xs")
        ) {
          this._onOpen();
        }

        if (prevState.toInputActive !== this.state.toInputActive) {
          this._onOpen(this.state.toInputActive);
        }

        if (prevState.message && !this.state.message) {
          this._open(this.state.toInputActive);
        }
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    toggle(setStateCallback) {
      if (this.isOpen()) {
        this.close(() => this._removeEvent(setStateCallback));
      } else {
        this.open(() => this._addEvent(setStateCallback));
      }

      return this;
    },

    parseDate(dates) {
      let result;

      if (Array.isArray(dates)) {
        result = dates.map(date => this._parseDate(date)).filter(date => !!date);
        if (result.length === 0) result = null;
      } else {
        result = this._parseDate(dates);
      }

      return result;
    },

    parseDateDefault(stringDate) {
      return UU5.Common.Tools.parseDate(stringDate, {
        format: this.state ? this.state.format : this.props.format,
        country: this.state ? this.state.country : this.props.country
      });
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    open_(setStateCallback) {
      this._addEvent();
      this.openDefault(() => this._onOpen(false, setStateCallback));
    },

    close_(setStateCallback) {
      this._removeEvent();
      this.closeDefault(() => this._onClose(setStateCallback));
    },

    setValue_(value, setStateCallback) {
      let devValidation = this._validateDevProps(value, this.props.dateFrom, this.props.dateTo);
      if (devValidation.valid) {
        if (Array.isArray(value) && value.length < 2) {
          // If value is an array with just one item, treat it as if the value is null
          value = null;
        }

        if (this._checkRequired({ value: value })) {
          let initialFeedback = { feedback: "initial", message: null };
          let state = { ...initialFeedback, ...this._getInnerState(value, true) };

          if (typeof this.props.onValidate === "function") {
            this._validateOnChange({ value: value, event: null, component: this });
          } else {
            this.setState({ ...state }, setStateCallback);
          }
        }
      } else {
        this.showError(devValidation.error);
      }
    },

    setFeedback_(feedback, message, value, setStateCallback) {
      if (value === "") {
        value = null;
      }

      let state = { ...this._getInnerState(value), ...{ feedback }, ...{ message } };
      this.setState({ ...state }, setStateCallback);
    },

    getValue_() {
      let date;

      if (!this.state.value) {
        date = null;
      } else {
        date = this.state.value;
      }

      date = this.parseDate(date);
      return this._getOutputValue(date);
    },

    getInputWidth_(opt) {
      let width = null;

      if (this.props.inputWidth) {
        if (opt && opt.dualInput) {
          let unit = this.props.inputWidth.replace(/[0-9]/g, "");
          // take 4px from each input because of a margin
          width = parseInt(this.props.inputWidth) / 2 - 4 + unit;
        } else {
          width = this.props.inputWidth;
        }
      }

      return width;
    },

    onChangeDefault_(opt, setStateCallback) {
      if (opt._data.type === "calendar") {
        this._onCalendarValueChangeDefault(opt, setStateCallback);
      } else if (opt._data.type === "input") {
        this._onInputChangeDefault(opt, setStateCallback);
      }

      return this;
    },

    onFocusDefault_(opt) {
      let result = this.getFocusFeedback(opt);

      if (result || opt._data) {
        result = result || {};
        if (opt._data && this.state.toInputActive !== opt._data.toInputActive) {
          if (opt._data.toInputActive) {
            result.toInputActive = true;
          } else {
            result.toInputActive = false;
          }
        }

        this.setState({ ...result });
      }

      return this;
    },

    setChangeFeedback__(opt, setStateCallback) {
      let value = this.parseDate(opt.value);
      let newState = this._getInnerState(value);
      newState.feedback = opt.feedback;
      newState.message = opt.message;

      this.setState({ ...newState }, setStateCallback);
    },

    getInitialValue_(propValue) {
      let stateValue = !Array.isArray(propValue) || propValue.length < 2 ? null : propValue;

      if (stateValue) {
        stateValue = this.parseDate(stateValue);
        let devValidation = this._validateDevProps(stateValue, this.props.dateFrom, this.props.dateTo);
        if (devValidation.valid) {
          let validateResult = this._validateDateRangeResult({ value: stateValue });
          if (validateResult.feedback === "error") stateValue = null;
        } else {
          stateValue = null;
        }
      }

      return stateValue;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _getOutputValue(value) {
      if (value) {
        let parsedDate = this._parseDate(value);

        if (this.props.step === "years" || this.props.step === "months") {
          if (Array.isArray(parsedDate)) {
            value = parsedDate.map(singleValue =>
              DateTools.getShortenedValueDateString(singleValue, "-", this.props.step === "years")
            );
          } else {
            value = DateTools.getShortenedValueDateString(parsedDate, "-", this.props.step === "years");
          }
        } else {
          value = parsedDate;
        }
      }

      return value;
    },

    _isSorXs() {
      return this.isS() || this.isXs();
    },

    _parseDate(stringDate) {
      let date = null;

      if (typeof stringDate !== "string") {
        date = stringDate;
      } else {
        if (this.props.parseDate && typeof this.props.parseDate === "function") {
          date = this.props.parseDate(stringDate, this);
        } else {
          date = this.parseDateDefault(stringDate);
        }
      }

      return date;
    },

    _getDateString(date, props = this.props) {
      if (props.step === "years") {
        return DateTools.getShortenedInputDateString(date, "/", true);
      } else if (props.step === "months") {
        return DateTools.getShortenedInputDateString(date, "/");
      } else {
        let format = this.state ? this.state.format : props.format;
        let country = this.state ? this.state.country : props.country;

        return UU5.Common.Tools.getDateString(date, { format, country });
      }
    },

    _getDateFrom(date) {
      return this.parseDate(date || this.props.dateFrom);
    },

    _getDateTo(date) {
      return this.parseDate(date || this.props.dateTo);
    },

    _getFromValue(value = this.state.value) {
      let result = null;

      if (Array.isArray(value) && value.length >= 1) {
        result = value[0];
      } else if (!value && this.state && this.state.tempValue) {
        result = this.state.tempValue;
      } else {
        result = value;
      }

      if (result) {
        result = UU5.Common.Tools.cloneDateObject(this.parseDate(result));
      }

      return result;
    },

    _getToValue(value = this.state.value) {
      let result = null;

      if (Array.isArray(value) && value.length >= 2) {
        result = UU5.Common.Tools.cloneDateObject(this.parseDate(value[1]));
      } else {
        result = UU5.Common.Tools.cloneDateObject(this.parseDate(value));
      }

      return result;
    },

    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;
        if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              _callCallback = false;
              this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
            } else {
              _callCallback = false;
              this.setState({ value: opt.value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: { event: null, func: this.props.onValidate, result: result }
            });
          }
        } else if (opt._data.state) {
          _callCallback = false;
          this.setState({ ...opt._data.state }, setStateCallback);
        } else if (opt.value) {
          _callCallback = false;
          this.setInitial(null, opt.value, setStateCallback);
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _validateDateResult(opt, props = this.props) {
      let result = opt;

      if (opt) {
        let date = this.parseDate(opt.value);
        date = this._getOutputValue(date);

        if (!opt.value || date) {
          if (this._compareDates(date, props.dateFrom, "lesser")) {
            result.feedback = "error";
            result.message = props.beforeRangeMessage;
          } else if (this._compareDates(date, props.dateTo, "greater")) {
            result.feedback = "error";
            result.message = props.afterRangeMessage;
          } else {
            result.feedback = opt ? opt.feedback || "initial" : "initial";
            result.message = opt ? opt.message || null : null;
            result.value = date;
          }
        }
      }

      return result;
    },

    _validateDateRangeResult(opt, props = this.props) {
      let result = opt;

      let date = this.parseDate(opt.value);
      if (opt && Array.isArray(opt.value)) {
        if (date) {
          let dateFrom = this._getDateFrom(props.dateFrom);
          let dateTo = this._getDateTo(props.dateTo);
          let valueFrom = this._getFromValue(date);
          let valueTo = this._getToValue(date);
          if (
            (valueFrom instanceof Date && isNaN(valueFrom.getDate())) ||
            (valueTo instanceof Date && isNaN(valueTo.getDate()))
          ) {
            result = false;
          } else if (dateFrom && valueFrom < dateFrom) {
            result.feedback = "error";
            result.message = this.props.beforeRangeMessage;
          } else if (dateTo && valueTo > dateTo) {
            result.feedback = "error";
            result.message = this.props.afterRangeMessage;
          }
        }
      }

      return result;
    },

    _validateDevProps(value, dateFrom = this.props.dateFrom, dateTo = this.props.dateTo) {
      let result = { valid: true, error: null };

      if (Array.isArray(value) && value.length === 2) {
        // Currently only 2 values are relevant
        if (this._compareDates(value[0], value[1], "greater")) {
          result.valid = false;
          result.error = "firstGreaterThanSecond";
        } else if (dateFrom && dateTo && this._compareDates(dateFrom, dateTo, "greater")) {
          result.valid = false;
          result.error = "dateFromGreaterThanDateTo";
        }
      }

      return result;
    },

    _onOpen(right, setStateCallback) {
      let aroundElement = this.isS()
        ? right
          ? this._rightTextInput.findDOMNode()
          : this._leftTextInput.findDOMNode()
        : this._textInput;

      if (this._popover) {
        this._popover.open(
          {
            onClose: this._onClose,
            aroundElement: aroundElement,
            position: "bottom",
            offset: this._shouldOpenToContent() ? 0 : 4,
            horizontalOnly: this._shouldOpenToContent()
          },
          setStateCallback
        );
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _onClose(setStateCallback) {
      let displayDates = DateTools.getDisplayDates(this.state.value || this.state.tempValue, this.state.calendarView);
      this.setState({
        calendarView: DateTools.getCalendarStartView(this.props),
        fromDisplayDate: displayDates.dateFrom,
        toDisplayDate: displayDates.dateTo
      });

      if (this._popover) {
        this._popover.close(setStateCallback);
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _close(persistListeners, setStateCallback) {
      if (!persistListeners) this._removeEvent();
      this.closeDefault(() => this._onClose(setStateCallback));
    },

    _open(right = false, setStateCallback) {
      this._addEvent();
      this.openDefault(this._onOpen(right, setStateCallback));
    },

    _change(opt) {
      this._onChangeFormat(opt);
    },

    _onChangeFormat(opt, setStateCallback) {
      this.setState(
        {
          format: opt.format === undefined ? this.state.format : opt.format,
          country:
            opt.country === undefined ? this.state.country : opt.country ? opt.country.toLowerCase() : opt.country
        },
        setStateCallback
      );
    },

    _getInputValidationResult(fromValue, toValue) {
      fromValue = this.parseDate(fromValue);
      toValue = this.parseDate(toValue);

      let result = {
        fromFeedback: this._validateDateResult({ value: fromValue }),
        toFeedback: this._validateDateResult({ value: toValue })
      };

      delete result.fromFeedback.value;
      delete result.toFeedback.value;

      if (this._compareDates(fromValue, toValue, "greater")) {
        result.toFeedback = { feedback: "error", message: this.getLsiComponent("dateInPast") };
      }

      return result;
    },

    _onResize() {
      if (this.isOpen()) {
        UU5.Common.Tools.debounce(() => {
          this._onOpen(this.state.toInputActive);
        }, 500)();
      }
    },

    _onCalendarViewChange(opt) {
      let fromDisplayDate = this.state.fromDisplayDate;
      let toDisplayDate = this.state.toDisplayDate;
      let displayData = opt._data;

      if (opt.view === "days") {
        fromDisplayDate = DateTools.setDate(fromDisplayDate, displayData.day, displayData.month - 1, displayData.year);
        toDisplayDate = DateTools.increaseDate(fromDisplayDate, undefined, 1);
      } else if (opt.view === "months") {
        if (this.state.calendarView === "days") {
          toDisplayDate = DateTools.increaseDate(fromDisplayDate, undefined, undefined, 1);
        } else if (this.state.calendarView === "years") {
          fromDisplayDate = DateTools.setDate(fromDisplayDate, undefined, displayData.month - 1, displayData.year);
          toDisplayDate = DateTools.increaseDate(fromDisplayDate, undefined, undefined, 1);
        }
      } else if (opt.view === "years") {
        toDisplayDate = DateTools.increaseDate(fromDisplayDate, undefined, undefined, 10);
      }

      this.setState({ calendarView: opt.view, fromDisplayDate, toDisplayDate });
    },

    _onChange(opt) {
      opt.component = this;

      if (opt._data.type === "calendar") {
        this._onCalendarValueChange(opt);
      } else if (opt._data.type === "input") {
        this._onInputChange(opt);
      }
    },

    _onCalendarValueChange(opt) {
      let value = opt.value;
      let executeOnChange = false;

      if (this.state.tempValue) {
        if (
          this._compareDates(value, this.state.tempValue, "greater") ||
          this._compareDates(value, this.state.tempValue, "equals")
        ) {
          value = [this.state.tempValue, value];
          executeOnChange = true;
        } else {
          value = [value];
        }
      } else {
        value = [value];
      }

      opt.value = this._getOutputValue(value);
      opt._data.value = value;
      opt._data.executeOnChange = executeOnChange;
      if (executeOnChange && typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
    },

    _onInputChange(opt) {
      // The code below tries to parse values of both inputs and validate them towards eachother.
      // If the second (right) value (date) isnt greater than the first (left) value (date), then
      // the value isnt valid and thus it basically is null. It means that onChange cannot be executed
      let newValue = this.parseDate(opt.value);
      let formatedDate = newValue ? this._getDateString(newValue) : null;
      let state = {
        fromFeedback: this.state.fromFeedback,
        toFeedback: this.state.toFeedback
      };
      let executeOnChange = false;

      if (opt._data.right) {
        state.toInputValue = opt.value || formatedDate;
      } else {
        state.fromInputValue = opt.value || formatedDate;
      }

      if (newValue) {
        let fromInputValue, toInputValue, validateResult;

        if (opt._data.right) {
          let isSameMonth = this._isSameMonth(newValue, this.state.fromDisplayDate);
          fromInputValue = this.parseDate(this.state.fromInputValue);
          toInputValue = this.parseDate(newValue);
          validateResult = this._getInputValidationResult(fromInputValue, newValue);

          if (!isSameMonth && validateResult.toFeedback.feedback !== "error") {
            let displayData;

            if (this.props.step === "months") {
              displayData = DateTools.getDisplayDates(
                DateTools.decreaseDate(newValue, undefined, undefined, 1),
                this.state.calendarView
              );
            } else if (this.props.step === "years") {
              displayData = DateTools.getDisplayDates(
                DateTools.decreaseDate(newValue, undefined, undefined, 10),
                this.state.calendarView
              );
            } else {
              displayData = DateTools.getDisplayDates(DateTools.decreaseDate(newValue, 0, 1), this.state.calendarView);
            }

            state.fromDisplayDate = displayData.dateFrom;
            state.toDisplayDate = displayData.dateTo;
          }
        } else {
          fromInputValue = this.parseDate(newValue);
          toInputValue = this.parseDate(this.state.toInputValue);
          validateResult = this._getInputValidationResult(newValue, toInputValue);

          if (validateResult.fromFeedback.feedback !== "error") {
            let displayData = DateTools.getDisplayDates(newValue, this.state.calendarView);
            state.fromDisplayDate = displayData.dateFrom;
            state.toDisplayDate = displayData.dateTo;
          }
        }

        let fromValueValid = validateResult.fromFeedback.feedback !== "error";
        let toValueValid = validateResult.toFeedback.feedback !== "error";

        state = { ...state, ...validateResult };

        if (fromInputValue) {
          if (!opt._data.right && (!toValueValid || !toInputValue) && fromValueValid) {
            // The right value appears to be invalid towards the left value. Set this new value as temporary one
            // to allow the user to fix the range with next selection (otherwise next click will reset the range
            // and start a new one)
            state.tempValue = newValue;
          }
          if ((opt._data.right && toValueValid) || (!opt._data.right && fromValueValid)) {
            if (this.state.tempValue) {
              if (opt._data.right) {
                if (toValueValid) {
                  state.value = [this.state.tempValue, newValue];
                  state.tempValue = null;
                } else {
                  state.value = null;
                }
              } else {
                if (toValueValid && toInputValue) {
                  state.value = [newValue, toInputValue];
                  state.tempValue = null;
                } else {
                  state.value = [newValue, newValue];
                  state.tempValue = null;
                }
              }
            } else if (toInputValue) {
              if (opt._data.right) {
                if (toValueValid) {
                  state.value = [fromInputValue, newValue];
                } else {
                  state.value = null;
                  state.tempValue = fromInputValue;
                }
              } else {
                if (toValueValid) {
                  state.value = [newValue, toInputValue];
                } else {
                  state.value = [newValue, newValue];
                }
              }
            }
          }
        } else {
          state.tempValue = opt._data.right ? null : newValue;
        }
      } else if (opt.value === "") {
        if (opt._data.right && !this.state.fromInputValue) {
          state = this._getInnerState(null);
        } else if (!opt._data.right && !this.state.toInputValue) {
          state = this._getInnerState(null);
        }
      }

      if (state.value === null && this.state.value) {
        executeOnChange = true;
      } else if (this.state.value === null && state.value) {
        executeOnChange = true;
      } else if (state.value && this.state.value && state.value.length === 2 && this.state.value.length === 2) {
        if (
          !this._compareDates(state.value[0], this.state.value[0], "equals") ||
          !this._compareDates(state.value[1], this.state.value[1], "equals")
        ) {
          executeOnChange = true;
        }
      }

      if (!this.isComputedDisabled() && !this.isReadOnly()) {
        opt._data.state = state;
        opt._data.executeOnChange = executeOnChange;
        opt.value = this._getOutputValue(state.value);
        if (executeOnChange && typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }
    },

    _onCalendarValueChangeDefault(opt, setStateCallback) {
      let right = (this.isXs() || this.isS()) && opt._data._right;
      let value = right && Array.isArray(opt.value) && opt.value.length === 1 ? [null, opt.value[0]] : opt.value;
      let innerState = this._getInnerState(value);
      let feedback;
      let _callCallback = typeof setStateCallback === "function";

      if (!innerState.value && this.props.required && this.state.value) {
        feedback = {
          feedback: "error",
          message: this.props.requiredMessage || this.getLsiComponent("requiredMessage")
        };
      } else if (innerState.value || (!innerState.value && this.state.value)) {
        feedback = { feedback: "initial", message: null };
      }

      if (innerState.tempValue) {
        innerState.toInputActive = true;
      }

      if (opt._data.executeOnChange) {
        opt.value = innerState.value;
        opt.feedback = feedback && feedback.feedback;
        opt.message = feedback && feedback.message;

        if (this.props.validateOnChange) {
          _callCallback = false;
          this._validateOnChange(opt, setStateCallback);
        } else if (this._checkRequired({ value: opt.value })) {
          opt.required = this.props.required;
          let result = this.getChangeFeedback(opt);
          _callCallback = false;
          this.setState({ ...feedback, ...innerState, ...result }, setStateCallback);
        }
      } else {
        _callCallback = false;
        this.setState({ ...feedback, ...innerState }, setStateCallback);
      }

      if (_callCallback) {
        setStateCallback();
      }
    },

    _onInputChangeDefault(opt, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (opt._data.executeOnChange) {
        if (this.props.validateOnChange) {
          _callCallback = false;
          this._validateOnChange(opt, false, setStateCallback);
        } else if (this.shouldValidateRequired()) {
          let value = opt._data.state ? opt._data.state.value : null;

          if (this.props.required && !value) {
            opt.feedback = "error";
            opt.message = this.props.requiredMessage || this.getLsiComponent("requiredMessage");
          }

          opt.required = this.props.required;
          let result = this.getChangeFeedback({ ...opt, value });
          _callCallback = false;
          this.setState({ ...opt._data.state, ...result }, setStateCallback);
        }
      } else {
        _callCallback = false;
        this.setState({ ...opt._data.state }, setStateCallback);
      }

      if (_callCallback) {
        setStateCallback();
      }
    },

    _getInnerState(value, adjustDisplayDate) {
      let initialFeedback = { feedback: "initial", message: null };
      let state = {};
      let fromValue, toValue, fromInputValidateResult, toInputValidateResult;

      if (value) {
        if (!Array.isArray(value)) {
          // value isnt array
          fromValue = this.parseDate(value);
          toValue = this.parseDate(value);
          fromInputValidateResult =
            fromValue || this.state.fromInputValue
              ? this._validateDateResult({ value: fromValue || this.state.fromInputValue })
              : initialFeedback;
          toInputValidateResult =
            toValue || this.state.toInputValue
              ? this._validateDateResult({ value: toValue || this.state.toInputValue })
              : initialFeedback;
          delete fromInputValidateResult.value;
          delete toInputValidateResult.value;
          state.value = [fromValue, toValue];
          state.fromInputValue = this._getDateString(fromValue);
          state.toInputValue = this._getDateString(toValue);
        } else if (Array.isArray(value)) {
          // value is array
          fromValue = this.parseDate(value[0]);
          toValue = this.parseDate(value[1]);
          fromInputValidateResult =
            fromValue || this.state.fromInputValue
              ? this._validateDateResult({ value: fromValue || this.state.fromInputValue })
              : initialFeedback;
          toInputValidateResult =
            toValue || this.state.toInputValue
              ? this._validateDateResult({ value: toValue || this.state.toInputValue })
              : initialFeedback;
          delete fromInputValidateResult.value;
          delete toInputValidateResult.value;

          if (
            this._compareDates(fromValue, toValue, "greater") ||
            (!fromValue && toValue && this.state.fromInputValue)
          ) {
            fromValue = toValue;
            toValue = null;
          }

          if (!toValue) {
            if (this.state.toInputValue && !this.state.value) {
              toValue = this.parseDate(this.state.toInputValue);

              if (toValue) {
                if (!this._compareDates(toValue, fromValue, "lesser")) {
                  state.value = [fromValue, toValue];
                  state.tempValue = null;
                  state.fromInputValue = this._getDateString(fromValue);
                  state.toInputValue = this._getDateString(toValue);
                } else {
                  state.value = null;
                  state.tempValue = null;
                  state.fromInputValue = this._getDateString(fromValue);
                  state.toInputValue = null;
                }
              } else {
                state.value = null;
                state.tempValue = fromValue;
                state.fromInputValue = this._getDateString(fromValue);
              }
            } else {
              state.value = null;
              state.tempValue = fromValue;
              state.fromInputValue = this._getDateString(fromValue);
              state.toInputValue = null;
            }
          } else if (!fromValue) {
            state.value = null;
            state.tempValue = null;
            state.fromInputValue = this._getDateString(fromValue);
            state.toInputValue = this._getDateString(toValue);
          } else {
            state.value = [fromValue, toValue];
            state.tempValue = null;
            state.fromInputValue = this._getDateString(fromValue);
            state.toInputValue = this._getDateString(toValue);
          }
        }

        state.fromFeedback = this.state.fromInputValue ? fromInputValidateResult : initialFeedback;
        state.toFeedback = this.state.toInputValue ? toInputValidateResult : initialFeedback;
      } else {
        state.tempValue = null;
        state.value = value;
        state.fromInputValue = null;
        state.toInputValue = null;
        state.fromFeedback = initialFeedback;
        state.toFeedback = initialFeedback;
      }

      if (adjustDisplayDate) {
        let displayDates = DateTools.getDisplayDates(state.value || state.tempValue, this.state.calendarView);
        state.fromDisplayDate = displayDates.dateFrom;
        state.toDisplayDate = displayDates.dateTo;
      }

      return state;
    },

    _handleClick(e) {
      let clickData = this._findTarget(e);
      let canClose =
        this.isXs() || this.isS()
          ? !clickData.popover && !clickData.input && this.isOpen()
          : !clickData.popover && this.isOpen();
      let canBlur = !clickData.popover && !clickData.input;
      let opt = { value: this.state.value, event: e, component: this };

      if (canClose) {
        if (!this.props.disableBackdrop) {
          this._close(false, () => this._onBlur(opt));
        } else if (canBlur) {
          this._onBlur(opt);
        }
      } else if (canBlur) {
        this._onBlur(opt);
      }
    },

    _addEvent(callback) {
      window.addEventListener("click", this._handleClick, true);
      UU5.Environment.EventListener.addWindowEvent("resize", this.getId(), this._onResize);
      if (typeof callback === "function") {
        callback();
      }
    },

    _removeEvent(callback) {
      window.removeEventListener("click", this._handleClick, true);
      UU5.Environment.EventListener.removeWindowEvent("resize", this.getId());
      if (typeof callback === "function") {
        callback();
      }
    },

    _compareDates(date1, date2, method) {
      let result = false;
      date1 = this.parseDate(date1);
      date2 = this.parseDate(date2);

      if (date1 && date2) {
        date1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        date2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        if (method === "equals") {
          result = date1 === date2;
        } else if (method === "greater") {
          result = date1 > date2;
        } else if (method === "lesser") {
          result = date1 < date2;
        }
      }

      return result;
    },

    _isSameMonth(date1, date2) {
      let result = false;
      if (date1 instanceof Date && date2 instanceof Date) {
        result = date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
      }
      return result;
    },

    _cloneDate(date) {
      return new Date(date.valueOf());
    },

    _goToToday() {
      let displayDates = DateTools.getDisplayDates(new Date(), this.state.calendarView);
      this.setState({ fromDisplayDate: displayDates.dateFrom, toDisplayDate: displayDates.dateTo });
    },

    _getWeeksInMonth(date) {
      let dateMin = this._cloneDate(date);
      let dateMax = this._cloneDate(date);

      dateMin.setDate(1);
      dateMax.setMonth(dateMax.getMonth() + 1);
      dateMax.setDate(0);

      return UU5.Common.Tools.getWeekNumber(dateMax) - UU5.Common.Tools.getWeekNumber(dateMin) + 1;
    },

    _onNextSelection() {
      let displayDates = DateTools.getDisplayDates(this.state.toDisplayDate, this.state.calendarView);
      this.setState({ fromDisplayDate: displayDates.dateFrom, toDisplayDate: displayDates.dateTo });
    },

    _onPrevSelection() {
      let dateFrom = this.state.fromDisplayDate;

      if (this.state.calendarView === "days") {
        dateFrom = DateTools.decreaseDate(this.state.fromDisplayDate, undefined, 1);
      } else if (this.state.calendarView === "months") {
        dateFrom = DateTools.decreaseDate(this.state.fromDisplayDate, undefined, undefined, 1);
      } else if (this.state.calendarView === "years") {
        dateFrom = DateTools.decreaseDate(this.state.fromDisplayDate, undefined, undefined, 10);
      }
      let displayDates = DateTools.getDisplayDates(dateFrom, this.state.calendarView);
      this.setState({ fromDisplayDate: displayDates.dateFrom, toDisplayDate: displayDates.dateTo });
    },

    _onFocus(opt) {
      let setStateCallback;

      if (!this._hasFocus) {
        this._addKeyEvents();
        this._hasFocus = true;

        if (opt._data) {
          opt._data.value = opt.value;
          opt.value = this._getOutputValue(opt.value);
        } else {
          opt._data = { value: opt.value };
          opt.value = this._getOutputValue(opt.value);
        }

        if (!this.isReadOnly() && !this.isComputedDisabled()) {
          if (typeof this.props.onFocus === "function") {
            setStateCallback = () => this.props.onFocus(opt);
          } else {
            setStateCallback = () => this.onFocusDefault(opt);
          }
        }
      }

      if (opt._data && typeof opt._data.toInputActive === "boolean") {
        let toInputActive = opt._data.toInputActive;
        this.setState({ toInputActive }, setStateCallback);
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _onBlur(opt) {
      if (this._hasFocus) {
        this._hasFocus = false;
        let state = { toInputActive: false };
        let callback;

        if (opt._data) {
          opt._data.value = opt.value;
          opt.value = this._getOutputValue(opt.value);
        } else {
          opt._data = { value: opt.value };
          opt.value = this._getOutputValue(opt.value);
        }

        if (typeof this.props.onBlur === "function") {
          callback = opt => this.props.onBlur(opt);
        } else {
          callback = opt => {
            this._removeKeyEvents();
            this.onBlurDefault(opt);
          };
        }

        let value = null;
        if (this.state.tempValue && !this._getToValue()) {
          value = [this.state.tempValue, this.state.tempValue];
          opt.value = value;
          opt._data.value = value;
          state = { ...state, value, ...this._getInnerState(value) };
          let origCallback = callback;
          callback = opt => {
            if (typeof this.props.onChange === "function") {
              this.props.onChange(opt);
            }

            origCallback(opt);
          };
        } else if (this.state.toInputValue && !this.state.fromInputValue) {
          value = [this.parseDate(this.state.toInputValue), this.parseDate(this.state.toInputValue)];
          if (!value[0] || !value[1]) value = null;
          opt.value = value;
          opt._data.value = value;
          state = { ...state, value, ...this._getInnerState(value) };
          let origCallback = callback;
          callback = opt => {
            if (typeof this.props.onChange === "function") {
              this.props.onChange(opt);
            }

            origCallback(opt);
          };
        }

        this.setState(state, () => callback(opt));
      }
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
      let inputMatch1 = "[id='" + this.getId() + "'] .uu5-forms-items-input";
      let inputMatch2 = "[id='" + this.getId() + "'] .uu5-forms-text-input";
      let fromInputMatch = "[id='" + this.getId() + "'] .uu5-forms-daterangepicker-from-input";
      let toInputMatch = "[id='" + this.getId() + "'] .uu5-forms-daterangepicker-to-input";
      let popoverMatch = "[id='" + this.getId() + "'] .uu5-bricks-popover";
      let customContentMatch = "[id='" + this.getId() + "'] .uu5-forms-daterangepicker-custom-content";
      let result = {
        component: false,
        input: false,
        label: false,
        fromInput: false,
        toInput: false,
        popover: false,
        customContent: false
      };
      let eventPath = this._getEventPath(e);

      eventPath.every(item => {
        let functionType = item.matches ? "matches" : "msMatchesSelector";
        if (item[functionType]) {
          if (item[functionType](labelMatch)) {
            result.label = true;
            result.component = true;
          } else if (item[functionType](inputMatch1)) {
            result.input = true;
            result.component = true;
          } else if (item[functionType](inputMatch2)) {
            result.input = true;
            result.component = true;

            if (item[functionType](fromInputMatch)) {
              result.fromInput = true;
            } else if (item[functionType](toInputMatch)) {
              result.toInput = true;
            }
          } else if (item[functionType](popoverMatch)) {
            result.popover = true;
            result.component = true;
          } else if (item[functionType](customContentMatch)) {
            result.customContent = true;
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
        let isRightInput = focusResult.toInput;
        let isLeftInput = focusResult.fromInput;
        let isMainInput = focusResult.input;
        let isCustomContent = focusResult.customContent;
        let doBlur = !isLeftInput && !isRightInput && !isMainInput && !isCustomContent;
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
            if (this.isOpen()) {
              this._close(false, () => this._onBlur(opt));
            } else {
              this._onBlur(opt);
            }
          } else {
            if (!e.shiftKey && isRightInput) {
              this.setState({ toInputActive: true });
            } else if (e.shiftKey && isLeftInput) {
              this.setState({ toInputActive: false });
            }
          }
        } else if (e.which === 27) {
          // esc
          if (this.isOpen()) {
            this._close();
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

    _getFromInputPlaceholder() {
      let format = this.state.format || UU5.Environment.dateTimeFormat[this.state.country];
      format && (format = format.replace(/Y+/, "YYYY").replace(/y+/, "yy"));
      let placeholder;
      if (format && !this.props.hideFormatPlaceholder) {
        placeholder = format;
      }

      return placeholder;
    },

    _getToInputPlaceholder() {
      let format = this.state.format || UU5.Environment.dateTimeFormat[this.state.country];
      format && (format = format.replace(/Y+/, "YYYY").replace(/y+/, "yy"));
      let placeholder;
      if (format && !this.props.hideFormatPlaceholder) {
        placeholder = format;
      }

      return placeholder;
    },

    _getMainPlaceholder() {
      let format = this.state.format || UU5.Environment.dateTimeFormat[this.state.country];
      format && (format = format.replace(/Y+/, "YYYY").replace(/y+/, "yy"));
      let placeholder;
      if (this.props.placeholder && format && !this.props.hideFormatPlaceholder) {
        placeholder = this.props.placeholder + " " + format + " - " + format;
      } else if (format && !this.props.hideFormatPlaceholder) {
        placeholder = format + " - " + format;
      } else {
        placeholder = this.props.placeholder;
      }
      return placeholder;
    },

    _getPopoverProps() {
      let props = {};

      props.ref_ = ref => (this._popover = ref);
      props.forceRender = true;
      props.disableBackdrop = true;
      props.shown = this.isOpen();

      return props;
    },

    _getCalendarValue(right) {
      let value = this.getValue();
      let firstDate, secondDate;

      if (value && value.length === 2) {
        firstDate = this._cloneDate(value[0]);
        secondDate = this._cloneDate(value[1]);
        value = [firstDate, secondDate];
      } else if (this.state.tempValue) {
        value = this.state.tempValue;
      }

      return value;
    },

    _getCalendarProps(mobile, right) {
      let value = this._getCalendarValue(right);
      let className = this.getClassName().menu;
      let props = {
        className: className,
        value: value,
        dateFrom: this.props.dateFrom,
        dateTo: this.props.dateTo,
        hidden: !this.isOpen(),
        selectionMode: "range",
        onChange: opt =>
          this._onChange({ ...opt, ...{ _data: { right: this.state.toInputActive || right, type: "calendar" } } }),
        onViewChange: this._onCalendarViewChange,
        view: this.state.calendarView,
        hideWeekNumber: this.props.hideWeekNumber,
        hideOtherSections: true,
        colorSchema: this.getColorSchema(),
        step: this.props.step
      };

      if (mobile) {
        props.displayDate = this.state.fromDisplayDate;
        props.onPrevSelection = this._onPrevSelection;
        props.onNextSelection = this._onNextSelection;
      } else {
        if (right) {
          props.className += " " + this.getClassName("rightCalendar");
          props.displayDate = this.state.toDisplayDate;
          props.onNextSelection = this._onNextSelection;
          props.hidePrevSelection = true;
        } else {
          props.className += " " + this.getClassName("leftCalendar");
          props.displayDate = this.state.fromDisplayDate;
          props.onPrevSelection = this._onPrevSelection;
          props.hideNextSelection = true;
        }
      }

      return props;
    },

    _getCalendarInputProps(isSorXs, right, sizeClass) {
      let props = {
        className: this.getClassName("calendarInput"),
        size: this.props.size,
        onChange: e =>
          this._onChange({ event: e, component: this, value: e.target.value, _data: { right: right, type: "input" } }),
        onKeyDown: this.onKeyDown,
        value: right ? this.state.toInputValue || "" : this.state.fromInputValue || "",
        placeholder: right ? this._getToInputPlaceholder() : this._getFromInputPlaceholder(),
        mainAttrs: {},
        colorSchema: this.props.colorSchema
      };

      if (isSorXs) {
        props.mainAttrs = this.props.inputAttrs;
        props.mainAttrs = UU5.Common.Tools.merge({ autoComplete: "off" }, props.mainAttrs);
        props.mainAttrs.className === "" ? delete props.mainAttrs.className : null;
        props.mainAttrs.tabIndex = !this.isReadOnly() && !this.isComputedDisabled() ? "0" : undefined;
        props.mainAttrs.onFocus = !this.isReadOnly() && !this.isComputedDisabled() ? this._onFocus : null;

        let useSeparatedFeedback =
          this.state.fromFeedback.feedback === "error" || this.state.toFeedback.feedback === "error";
        props.inputWidth = this._getInputWidth({ dualInput: true });
        props.className += " " + sizeClass;
        props.icon = this.props.icon;
        props.borderRadius = this.props.borderRadius;
        props.elevation = this.props.elevation;
        props.bgStyle = this.props.bgStyle;
        props.size = this.props.size;

        if (right) {
          if (useSeparatedFeedback) {
            props = { ...props, ...this.state.toFeedback };
            props.mainAttrs.title = this.state.toFeedback.message;
          } else {
            props.feedback = this.getFeedback();
          }

          props.className += " " + this.getClassName("inputTo");
          props.ref_ = item => (this._rightTextInput = item);

          if (this.isOpen() && this.state.toInputActive) {
            props.mainAttrs.className = this.getClassName("inputActive");
          }
        } else {
          if (useSeparatedFeedback) {
            props = { ...props, ...this.state.fromFeedback };
            props.mainAttrs.title = this.state.fromFeedback.message;
          } else {
            props.feedback = this.getFeedback();
          }

          props.className += " " + this.getClassName("inputFrom");
          props.ref_ = item => {
            this._textInput = item;
            this._leftTextInput = item;
          };

          if (this.isOpen() && !this.state.toInputActive) {
            props.mainAttrs.className = this.getClassName("inputActive");
          }
        }
      } else {
        props.size = "m";

        if (right) {
          props.mainAttrs.title = this.state.toFeedback.message;
          props.feedback = this.state.toFeedback.feedback;
          props.prefix = this.props.pickerLabelTo;
          props.ref_ = item => (this._rightTextInput = item);
        } else {
          props.mainAttrs.title = this.state.fromFeedback.message;
          props.feedback = this.state.fromFeedback.feedback;
          props.prefix = this.props.pickerLabelFrom;
          props.ref_ = item => (this._leftTextInput = item);
        }
      }

      return props;
    },

    _getMainAttrs() {
      let attrs = this.getMainAttrs();
      attrs.id = this.getId();
      attrs.ref = comp => (this._root = comp);

      let mainClassRegExp = new RegExp(this.getClassName("main", "UU5.Forms.InputMixin"), "g");
      attrs.className = attrs.className.replace(mainClassRegExp, "").replace(/\s\s/, " ");

      let firstValue = this._getFromValue();
      let secondValue = this._getToValue();

      if (firstValue && secondValue && firstValue.getMonth() !== secondValue.getMonth()) {
        attrs.className += " " + this.getClassName("multiMonth");
      }

      if (this.props.nestingLevel === "inline" || this.props.inputWidth) {
        attrs.className += " " + this.getClassName("inline", "UU5.Forms.InputMixin");
      }

      if (this.isOpen()) {
        attrs.className += " " + this.getClassName("open");
      }

      if (this.isS() || this.isXs() || this._shouldOpenToContent()) {
        attrs.className += " " + this.getClassName("screenSizeBehaviour");
      }

      return attrs;
    },

    _getMainInnerMainAttrs(ommitMainAttrs) {
      let attrs = this._getInputAttrs(ommitMainAttrs);
      attrs.className += " " + this.getClassName("main", "UU5.Forms.InputMixin");

      if (!ommitMainAttrs) {
        attrs.id = this.getId();
        attrs.ref = comp => (this._root = comp);
      }

      if (this.isS() || this.isXs() || this._shouldOpenToContent()) {
        attrs.className += " " + this.getClassName("screenSizeBehaviour");
      }

      if (!this.isReadOnly() && !this.isComputedDisabled()) {
        let handleMobileClick = (e, clickData) => {
          let result = false;

          if (this.isOpen()) {
            if (clickData.toInput && !this.state.toInputActive) {
              document.activeElement.blur();
              e.target.blur();
              result = true;
            } else if (clickData.fromInput && this.state.toInputActive) {
              document.activeElement.blur();
              e.target.blur();
              result = true;
            } else {
              e.target.focus();
              this._close(true);
            }
          } else {
            if (
              (clickData.toInput && this.state.toInputActive) ||
              (clickData.fromInput && !this.state.toInputActive) ||
              (clickData.toInput && !this.state.toInputActive)
            ) {
              document.activeElement.blur();
              e.target.blur();
              result = true;
            } else if (clickData.input && !clickData.fromInput && !clickData.toInput) {
              result = true;
            }
          }

          UU5.Common.Tools.scrollToTarget(
            this.getId() + "-input",
            false,
            UU5.Environment._fixedOffset + 20,
            this._findScrollElement(this._root)
          );

          return result;
        };

        let handleClick = e => {
          let clickData = this._findTarget(e.nativeEvent);
          let shouldOpen = true;
          let shouldClose = false;

          if (this._shouldOpenToContent() && clickData.input) {
            shouldOpen = handleMobileClick(e, clickData);
          }

          let opt = {
            value: this.state.value,
            event: e,
            component: this,
            _data: {}
          };

          if (clickData.input) {
            e.preventDefault();

            if (clickData.fromInput) {
              opt._data.toInputActive = false;

              if (this.props.disableBackdrop && this.isOpen() && !this.state.toInputActive) shouldClose = true;
            } else if (clickData.toInput) {
              opt._data.toInputActive = true;

              if (this.props.disableBackdrop && this.isOpen() && this.state.toInputActive) shouldClose = true;
            } else if (this.isOpen()) {
              shouldClose = true;
            }

            if (shouldClose) {
              this.close(() => this._onFocus(opt));
            } else if (shouldOpen) {
              this._open(clickData.toInput, () => this._onFocus(opt));
            } else {
              this._onFocus(opt);
            }
          }
        };

        attrs.onClick = e => {
          handleClick(e);
        };
      }

      return attrs;
    },

    _getInputValue() {
      let result = null;
      let firstDate = this._getFromValue();
      let secondDate = this._getToValue();

      if (firstDate && secondDate) {
        let stringDate1 = this._getDateString(firstDate);
        let stringDate2 = this._getDateString(secondDate);
        let separator =
          this.state.format && this.props.step === "days"
            ? this.state.format.match(/[^dmy]/i)[0]
            : stringDate1
            ? stringDate1.match(/\W/) && stringDate1.match(/\W/)[0]
            : ".";
        let partialyShortenValue = separator === "." && !UU5.Common.Tools.isDateReversed();
        let regExp;

        if (this._compareDates(firstDate, secondDate, "equals")) {
          stringDate1 = "";
        } else if (partialyShortenValue) {
          if (firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear()) {
            regExp = new RegExp("(^.+?)" + "\\" + separator, "g");
            stringDate1 = stringDate1.match(regExp)[0];
          } else if (firstDate.getFullYear() === secondDate.getFullYear()) {
            regExp = new RegExp(firstDate.getFullYear(), "g");
            stringDate1 = stringDate1.replace(regExp, "");
          }
        }

        result = stringDate1 + (stringDate1 ? " - " : "") + stringDate2;
      } else if (firstDate) {
        let stringDate1 = this._getDateString(firstDate);
        result = stringDate1;
      }

      if (result) {
        result = UU5.Common.Tools.wrapIfExists(
          UU5.Common.Fragment,
          <span className={this.getClassName("inputText")}>
            {this.props.innerLabel && this.props.label ? this.props.label + "\xa0" : null}
          </span>,
          <span className={this.getClassName("inputValue")}>{result}</span>
        );
      } else {
        result = UU5.Common.Tools.wrapIfExists(
          UU5.Common.Fragment,
          <span className={this.getClassName("inputText")}>
            {this.props.innerLabel && this.props.label ? this.props.label + "\xa0" : null}
          </span>,
          <span className={this.getClassName("mainPlaceholder") + " " + this.getClassName("inputPlaceholder")}>
            {this._getMainPlaceholder()}
          </span>
        );
      }

      return (
        <div className={this.getClassName("inputContentWrapper")}>
          <UU5.Bricks.Icon icon={this.props.icon} />
          {result}
          {!this.isComputedDisabled() && !this.isReadOnly() ? (
            <UU5.Bricks.Icon icon={this.isOpen() ? this.props.iconOpen : this.props.iconClosed} />
          ) : null}
        </div>
      );
    },

    _getLabelBogus(colWidth) {
      return <Label colWidth={colWidth} key="labelBogus" className={this.getClassName("labelBogus")} />;
    },

    _getSideLabels(inputId) {
      let result = null;
      let colWidth = UU5.Common.Tools.buildColWidthClassName(this.props.labelColWidth);

      if ((this.props.labelFrom || this.props.labelTo) && this._isSorXs()) {
        result = [];
        if (this.props.labelFrom) {
          let labelProps = this._getLabelProps(inputId);
          labelProps.className += ` ${this.getClassName("labelFrom")}`;
          result.push(<Label {...labelProps} content={this.props.labelFrom} key="fromLabel" />);
        } else {
          result.push(this._getLabelBogus(colWidth));
        }

        if (this.props.labelTo) {
          let labelProps = this._getLabelProps(inputId);
          labelProps.className += ` ${this.getClassName("labelTo")}`;
          result.push(
            <Label
              {...labelProps}
              tooltip={this.props.labelFrom ? null : this.props.tooltip}
              content={this.props.labelTo}
              key="toLabel"
            />
          );
        } else {
          result.push(this._getLabelBogus(colWidth));
        }
      } else {
        result = this.getLabel(inputId);
      }

      return result;
    },

    _getCustomContent() {
      let result = null;
      let content = this.getChildren();

      if (content) {
        result = <div className={this.getClassName("customContent")}>{content}</div>;
      }

      return result;
    },

    _normalRender(inputId, sizeClass) {
      let mainClassName = this.getClassName("mainInput");
      if (this.isOpen()) {
        mainClassName += " " + this.getClassName("inputOpen");
      }

      mainClassName += " " + sizeClass;

      let inputAttrs = this.props.inputAttrs;
      inputAttrs = UU5.Common.Tools.merge({ autoComplete: "off" }, inputAttrs);
      inputAttrs.className === "" ? delete inputAttrs.className : null;
      inputAttrs.tabIndex = !this.isReadOnly() && !this.isComputedDisabled() ? "0" : undefined;
      inputAttrs.onFocus = !this.isReadOnly() && !this.isComputedDisabled() ? this._onFocus : null;

      return (
        <div {...this._getMainAttrs()}>
          <div {...this._getMainInnerMainAttrs(true)}>
            {this._getLabels(inputId, true)}
            {this.getInputWrapper([
              <ItemsInput
                id={inputId}
                name={this.props.name || inputId}
                value={this._getInputValue()}
                placeholder={this._getMainPlaceholder()}
                mainAttrs={inputAttrs}
                disabled={this.isComputedDisabled()}
                readonly={this.isReadOnly()}
                loading={this.isLoading()}
                ref_={item => (this._textInput = item && item.findDOMNode())}
                feedback={this.getFeedback()}
                borderRadius={this.props.borderRadius}
                elevation={this.props.elevation}
                bgStyle={this.props.bgStyle}
                inputWidth={this._getInputWidth({ dualInput: false })}
                key="input"
                size={this.props.size}
                className={mainClassName}
                onKeyDown={this.onKeyDown}
                colorSchema={this.props.colorSchema}
              />
            ])}
          </div>
          <div className={this.getClassName("popoverWrapper")}>
            <UU5.Bricks.Popover {...this._getPopoverProps()} key="popover">
              <div className={this.getClassName("calendars") + " uu5-forms-input-m"}>
                <div className={this.getClassName("firstRow")}>
                  <div className={this.getClassName("leftColumn")}>
                    <TextInput {...this._getCalendarInputProps(false, false)} />
                    {this.isOpen() && <UU5.Bricks.Calendar {...this._getCalendarProps(false, false)} />}
                  </div>
                  <span className={this.getClassName("calendarSeparator")} />
                  <div className={this.getClassName("rightColumn")}>
                    <TextInput {...this._getCalendarInputProps(false, true)} />
                    {this.isOpen() && <UU5.Bricks.Calendar {...this._getCalendarProps(false, true)} />}
                  </div>
                </div>
                {this.props.showTodayButton ? (
                  <div className={this.getClassName("secondRow")}>
                    <UU5.Bricks.Button
                      content={this.getLsiComponent("today")}
                      className={this.getClassName("todayButton")}
                      onClick={this._goToToday}
                    />
                  </div>
                ) : null}
              </div>
              {this._getCustomContent()}
            </UU5.Bricks.Popover>
          </div>
        </div>
      );
    },

    _smallRender(inputId, sizeClass) {
      return (
        <div {...this._getMainInnerMainAttrs()}>
          {this._getLabels(inputId)}
          {this.getInputWrapper([
            <TextInput id={inputId} {...this._getCalendarInputProps(true, false, sizeClass)} key="input1" />,
            <TextInput id={inputId} {...this._getCalendarInputProps(true, true, sizeClass)} key="input2" />,
            <UU5.Bricks.Popover {...this._getPopoverProps()} key="popover">
              <div className={this.getClassName("calendars") + " uu5-forms-input-m"}>
                <div className={this.getClassName("firstRow")}>
                  <div className={this.getClassName("leftColumn")}>
                    {this.isOpen() && <UU5.Bricks.Calendar {...this._getCalendarProps(true, false)} />}
                  </div>
                </div>
                {this.props.showTodayButton ? (
                  <div className={this.getClassName("secondRow")}>
                    <UU5.Bricks.Button
                      content={this.getLsiComponent("today")}
                      className={this.getClassName("todayButton")}
                      onClick={this._goToToday}
                    />
                  </div>
                ) : null}
              </div>
            </UU5.Bricks.Popover>
          ])}
        </div>
      );
    },

    _getLabels(inputId, allowInnerLabel) {
      let numberOfColumns = this._getTotalCols();
      let result;

      if (numberOfColumns > 12) {
        result = this._getSideLabels(inputId);
      } else {
        result = allowInnerLabel && this.props.innerLabel ? null : this.getLabel(inputId);
      }

      return result;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      let sizeClass = this.props.size ? "uu5-forms-input-" + this.props.size : null;
      let result = null;

      if (this.isXs() || this.isS()) {
        result = this._smallRender(inputId, sizeClass);
      } else {
        result = this._normalRender(inputId, sizeClass);
      }

      return result;
    }
    //@@viewOn:render
  })
);

export default DateRangePicker;
