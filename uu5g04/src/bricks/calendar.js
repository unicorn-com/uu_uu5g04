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
import ns from "./bricks-ns.js";

import './calendar.less';

export const Calendar = UU5.Common.LsiMixin.withContext(
  createReactClass({
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.SwipeMixin,
      UU5.Common.LsiMixin,
      UU5.Common.ColorSchemaMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Calendar"),
      classNames: {
        main: ns.css("calendar uu5-forms-calendar"),
        mainWrapper: ns.css("calendar-main-wrapper uu5-forms-calendar-main-wrapper"),
        secondaryWrapper: ns.css("calendar-secondary-wrapper uu5-forms-calendar-secondary-wrapper"),
        table: ns.css("calendar-table table-condensed uu5-forms-calendar-table"),
        monthTable: ns.css("calendar-month-table uu5-forms-calendar-month-table"),
        yearTable: ns.css("calendar-year-table uu5-forms-calendar-year-table"),
        decadeTable: ns.css("calendar-decade-table uu5-forms-calendar-decade-table"),
        thead: ns.css("calendar-thead uu5-forms-calendar-thead"),
        headRow: ns.css("calendar-head-row uu5-forms-calendar-head-row"),
        headCellPrev: ns.css("calendar-head-cell-prev uu5-forms-calendar-head-cell-prev"),
        headCellHeader: ns.css("calendar-head-cell-header uu5-forms-calendar-head-cell-header"),
        headCellNext: ns.css("calendar-head-cell-next uu5-forms-calendar-head-cell-next"),
        icon: ns.css("calendar-icon uu5-forms-calendar-icon"),
        dayNames: ns.css("calendar-day-names uu5-forms-calendar-day-names"),
        dayName: ns.css("calendar-day-name uu5-forms-calendar-day-name"),
        week: ns.css("calendar-week uu5-forms-calendar-week"),
        weekNumber: ns.css("calendar-week-number uu5-forms-calendar-week-number"),
        day: ns.css("calendar-day uu5-forms-calendar-day"),
        dayCell: ns.css("calendar-day-cell uu5-forms-calendar-day-cell"),
        selection: ns.css("calendar-day-cell-selection uu5-forms-calendar-day-cell-selection"),
        active: ns.css("calendar-active uu5-forms-calendar-active"),
        activeSelection: ns.css("calendar-active-selection uu5-forms-calendar-active-selection"),
        activeSelectionStart: ns.css("calendar-active-selection-start uu5-forms-calendar-active-selection-start"),
        activeSelectionEnd: ns.css("calendar-active-selection-end uu5-forms-calendar-active-selection-end"),
        activeSection: ns.css("calendar-active-section uu5-forms-calendar-active-section"),
        inactive: ns.css("calendar-inactive"),
        anotherSection: ns.css("calendar-another-section uu5-forms-calendar-another-section"),
        firstInMonth: ns.css("calendar-first-month-day uu5-forms-calendar-first-month-day"),
        lastInMonth: ns.css("calendar-last-month-day uu5-forms-calendar-last-month-day"),
        today: ns.css("calendar-today uu5-forms-calendar-today"),
        month: ns.css("calendar-month uu5-forms-calendar-month"),
        months: ns.css("calendar-months uu5-forms-calendar-months"),
        year: ns.css("calendar-year uu5-forms-calendar-year"),
        years: ns.css("calendar-years uu5-forms-calendar-years"),
        cell: ns.css("calendar-cell uu5-forms-calendar-cell"),
        xsCell: ns.css("calendar-xs-cell col-xs-3 uu5-forms-calendar-xs-cell"),
        specCell: ns.css("calendar-spec-cell uu5-forms-calendar-spec-cell"),
        underline: ns.css("calendar-underline uu5-forms-calendar-underline"),
        disabled: 'uu5-common-disabled',
        hideWeekNumber: ns.css("calendar-hide-week-number uu5-forms-calendar-hide-week-number"),
        range: ns.css("calendar-range uu5-forms-calendar-range"),
        weekColumnHighlight: ns.css("calendar-week-highlight uu5-forms-calendar-week-highlight"),
        todayButton: ns.css("calendar-today-button uu5-forms-calendar-today-button"),
        otherSectionsHidden: ns.css("calendar-hide-other-sections")
      },
      defaults: {
        prevIcon: 'mdi-chevron-left',
        nextIcon: 'mdi-chevron-right',
        format: 'dd.mm.Y'
      },
      errors: {
        rangeNotSupported: "This calendar doesn's support date range selection",
        invalidDate: "Cannot set invalid date %s.",
        dateFromGreaterThanDateTo: "The property dateFrom is greater than the property dateTo.",
        firstGreaterThanSecond: "The first date of range is greater than the second date of range.",
        beforeRangeMessage: "The begining value of the date range (%s) is out of allowed range.",
        afterRangeMessage: "The ending value of the date range (%s) is out of allowed range."
      },
      lsi: () => (UU5.Environment.Lsi.Bricks.calendar)
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.string
          ])
        )
      ]),
      dateFrom: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
      ]),
      dateTo: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
      ]),
      displayDate: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
      ]),
      selectionMode: PropTypes.oneOf(["single", "range"]),
      minSelection: PropTypes.oneOf(["days", "months", "years"]),
      showTodayButton: PropTypes.bool,
      hideWeekNumber: PropTypes.bool,
      hidePrevSelection: PropTypes.bool,
      hideNextSelection: PropTypes.bool,
      hideOtherSections: PropTypes.bool,
      onChange: PropTypes.func,
      onNextSelection: PropTypes.func,
      onPrevSelection: PropTypes.func
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: null,
        dateFrom: null,
        dateTo: null,
        displayDate: null,
        selectionMode: "single",
        onChange: null,
        minSelection: "days",
        showTodayButton: false,
        onNextSelection: null,
        onPrevSelection: null,
        hideWeekNumber: false,
        hidePrevSelection: false,
        hideNextSelection: false,
        hideOtherSections: false
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:standardComponentLifeCycle
    getInitialState() {
      let value = Array.isArray(this.props.value) ? [this._parseDate(this.props.value[0]), this._parseDate(this.props.value[1])] : this._parseDate(this.props.value);
      let dateFrom = this._parseDate(this.props.dateFrom);
      let dateTo = this._parseDate(this.props.dateTo);

      let validateResult = this._validateDates(this.props.value, this.props.dateFrom, this.props.dateTo);
      if (!validateResult.valid) {
        value = null;
        this.showError(validateResult.error, validateResult.errorValue);
      }

      let displayDate = this.props.displayDate || (Array.isArray(value) ? value[0] : value);
      let state = this._getDisplayedDate(displayDate) || {};
      state.value = value;
      state.dateFrom = dateFrom;
      state.dateTo = dateTo;

      return state;
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        let value = Array.isArray(nextProps.value) ? [this._parseDate(nextProps.value[0]), this._parseDate(nextProps.value[1])] : this._parseDate(nextProps.value);
        let dateFrom = this._parseDate(nextProps.dateFrom);
        let dateTo = this._parseDate(nextProps.dateTo);

        let validateResult = this._validateDates(nextProps.value, nextProps.dateFrom, nextProps.dateTo);
        if (!validateResult.valid) {
          value = null;
          this.showError(validateResult.error, validateResult.errorValue);
        }

        let displayDate = nextProps.displayDate || (Array.isArray(value) ? value[0] : value);
        let state = this._getDisplayedDate(displayDate, nextProps) || {};
        state.value = value;
        state.dateFrom = dateFrom;
        state.dateTo = dateTo;
        this.setState({ ...state });
      }
    },
    //@@viewOff:standardComponentLifeCycle

    //@@viewOn:interface
    setPrevious(setStateCallback) {
      this._changeCalendar(-1, setStateCallback);
      return this;
    },

    setNext(setStateCallback) {
      this._changeCalendar(1, setStateCallback);
      return this;
    },

    getValue() {
      return this.state.value;
    },

    setValue(value, setStateCallback) {
      let parsedValue = this._parseDate(value);
      let dateInfo;

      if (Array.isArray(parsedValue)) {
        dateInfo = this._getDisplayedDate(parsedValue[0]);
      } else {
        dateInfo = this._getDisplayedDate(parsedValue);
      }

      let validateResult = this._validateDates(value);
      if (validateResult.valid) {
        this.setState({ value: parsedValue, ...dateInfo }, setStateCallback);
      } else {
        this.showError(validateResult.error, validateResult.errorValue);
      }

      return this;
    },

    onPrevSelectionDefault() {
      this.setPrevious();
    },

    onNextSelectionDefault() {
      this.setNext();
    },

    onChangeDefault(opt) {
      let value = opt.value;

      if (this.props.selectionMode === "range") {
        if (this.state.value && this.state.value.length === 1) {
          if (this._compareDates(value, this.state.value[0], "greater") || this._compareDates(value, this.state.value[0], "equals")) {
            value = [this.state.value[0], value];
          } else {
            value = [value];
          }
        } else {
          value = [value];
        }
      }

      let parsedValue = this._parseDate(value);
      let dateInfo;

      if (Array.isArray(parsedValue)) {
        if (parsedValue.length > 1) {
          dateInfo = this._getDisplayedDate(parsedValue[1]);
        } else {
          dateInfo = this._getDisplayedDate(parsedValue[0]);
        }
      } else {
        dateInfo = this._getDisplayedDate(parsedValue);
      }

      let validateResult = this._validateDates(value);
      if (validateResult.valid) {
        this.setState({ value: parsedValue, ...dateInfo });
      } else {
        this.showError(validateResult.error, validateResult.errorValue);
      }

      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overridingMethods
    //@@viewOff:overridingMethods

    //@@viewOn:componentSpecificHelpers
    _parseDate(dates) {
      let result;

      if (Array.isArray(dates)) {
        result = dates.map(date => UU5.Common.Tools.parseDate(date));
      } else {
        result = UU5.Common.Tools.parseDate(dates);
      }

      return result;
    },

    _getWeek(date) {
      return UU5.Common.Tools.getWeekNumber(date);
    },

    _getMainAttrs() {
      let attrs = this.getMainAttrs();

      if (this.props.selectionMode === "range") {
        attrs.className += " " + this.getClassName("range");
      }

      if (this.props.hideOtherSections) {
        attrs.className += " " + this.getClassName("otherSectionsHidden");
      }

      return attrs;
    },

    _getDisplayedDate(displayDate, props = this.props) {
      if (typeof displayDate === 'string') {
        displayDate = this._parseDate(displayDate);
      } else if (!displayDate) {
        displayDate = new Date(Date.now());
      }

      let result = {
        allowDisplayMonths: (!props.minSelection || props.minSelection != "years") && props.selectionMode === "single",
        allowDisplayDays: !props.minSelection || (props.minSelection != "months" && props.minSelection != "years") || props.selectionMode === "range"
      };

      if (result.allowDisplayDays) {
        result.displayMode = "days";
      } else if (result.allowDisplayMonths) {
        result.displayMode = "months";
      } else {
        result.displayMode = "years";
      }

      let validateResult = this._validateDates(displayDate, props.dateFrom, props.dateTo);
      let hasDisplayDate = !!this._parseDate(props.displayDate);

      if (!validateResult.valid && !hasDisplayDate) {
        if (props.dateFrom) {
          displayDate = this._parseDate(props.dateFrom);
        } else if (props.dateTo) {
          displayDate = this._parseDate(props.dateTo);
        }
      }

      result.month = displayDate.getMonth() + 1;
      result.year = displayDate.getFullYear();
      result.decade = parseInt((result.year % 100) / 10);
      result.century = parseInt(result.year / 100);

      return result;
    },

    _getHeaderText() {
      let result;
      let state = this.state;

      if (state.displayMode == "days") {
        result = this.getLsiValue('monthNames')[state.month - 1] + ' ' + state.year;
      } else if (state.displayMode == "months") {
        result = state.year + '';
      } else if (state.displayMode == "years") {
        let century = state.century * 100;
        result = (century + (state.decade * 10)) + ' - ' + (century + ((state.decade + 1) * 10 - 1));
      }

      return result;
    },

    _headerClick() {
      let state = this.state;

      if (state.displayMode == "days") {
        state.displayMode = "months";
      } else if (state.displayMode == "months") {
        state.displayMode = "years";
      } else if (state.displayMode == "years") {
        return this;
      }

      this.setState(state);
    },

    _validateSingleDate(date, dateFrom = this.state.dateFrom, dateTo = this.state.dateTo) {
      let result = { valid: true, error: null };
      let parsedDate = this._parseDate(date);
      dateFrom = this._parseDate(dateFrom);
      dateTo = this._parseDate(dateTo);

      if ((date && !parsedDate) || (date instanceof Date && isNaN(date.getDate()))) {
        result.valid = false;
        result.error = "invalidDate";
        result.errorValue = date;
      } else if (dateFrom && dateTo && this._compareDates(dateFrom, dateTo, "greater")) {
        result.valid = false;
        result.error = "dateFromGreaterThanDateTo";
      } else if (dateFrom && this._compareDates(parsedDate, dateFrom, "lesser")) {
        result.valid = false;
        result.error = "beforeRangeMessage";
        result.errorValue = date;
      } else if (dateTo && this._compareDates(parsedDate, dateTo, "greater")) {
        result.valid = false;
        result.error = "afterRangeMessage";
        result.errorValue = date;
      }

      return result;
    },

    _validateDates(value, dateFrom = this.state.dateFrom, dateTo = this.state.dateTo) {
      let result = { valid: true, error: null };

      if (Array.isArray(value)) {
        if (this.props.selectionMode === "range") {
          let i = 0;
          while (result.valid && value[i]) {
            result = this._validateSingleDate(value[i], dateFrom, dateTo);
            if (i === 0) {
              if (this._compareDates(this._parseDate(value[0]), value[1], "greater")) {
                result.valid = false;
                result.error = "firstGreaterThanSecond";
              }
            }
            i++;
          }
        } else {
          result.valid = false;
          result.error = "rangeNotSupported";
        }
      } else {
        result = this._validateSingleDate(value, dateFrom, dateTo);
      }

      return result;
    },

    _isValidMonth(date) {
      let dateFromValid = true, dateToValid = true;

      if (this.state.dateFrom) {
        dateFromValid =
          this.state.dateFrom.getFullYear() < date.getFullYear() ||
          (this.state.dateFrom.getMonth() <= date.getMonth() && this.state.dateFrom.getFullYear() === date.getFullYear());
      }

      if (this.state.dateTo) {
        dateToValid =
          this.state.dateTo.getFullYear() > date.getFullYear() ||
          (this.state.dateTo.getMonth() >= date.getMonth() && this.state.dateTo.getFullYear() === date.getFullYear());
      }

      return dateFromValid && dateToValid;
    },

    _isValidYear(date) {
      const dateFromValid = this.state.dateFrom ? this.state.dateFrom.getFullYear() <= date.getFullYear() : true;
      const dateToValid = this.state.dateTo ? this.state.dateTo.getFullYear() >= date.getFullYear() : true;
      return dateFromValid && dateToValid;
    },

    _isValidDecade(date) {
      const dateFromValid = this.state.dateFrom ?
        parseInt(this.state.dateFrom.getFullYear()/10) <= parseInt(date.getFullYear()/10) : true;
      const dateToValid = this.state.dateTo ?
        parseInt(this.state.dateTo.getFullYear()/10) >= parseInt(date.getFullYear()/10) : true;

      return dateFromValid && dateToValid;
    },

    _isChangeable(value) {
      let isChangeable = false;

      if (this.state.displayMode == "days") {
        const newDate = new Date(this.state.year, this.state.month - 1 + value);
        isChangeable = this._isValidMonth(newDate);
      } else if (this.state.displayMode == "months") {
        const newDate = new Date(this.state.year + value, 0);
        isChangeable = this._isValidYear(newDate);
      } else if (this.state.displayMode == "years") {
        const newDecade = this.state.decade + value;
        const newDate = new Date(this.state.century * 100 + newDecade * 10, 0);
        isChangeable = this._isValidDecade(newDate);
      }

      return isChangeable;
    },

    _changeCalendar(value, setStateCallback) {
      const state = UU5.Common.Tools.merge({}, this.state);
      let newDate;

      if (state.displayMode == "days") {
        newDate = new Date(state.year, state.month - 1 + value);

        if (this._isValidMonth(newDate)) {
          state.month = newDate.getMonth() + 1;
          state.year = newDate.getFullYear();
        } else {
          return this;
        }

      } else if (state.displayMode == "months") {
        newDate = new Date(state.year + value, 0);

        if (this._isValidYear(newDate)) {
          state.year = newDate.getFullYear();
        } else {
          return this;
        }

      } else if (state.displayMode == "years") {
        let newDecade = state.decade + value;
        let century = state.century;

        if (newDecade < 0) {
          newDecade = 9;
          century--;
          state.century = century;
        } else if (newDecade > 9) {
          newDecade = 0;
          century++;
          state.century = century;
        }

        newDate = new Date(century * 100 + newDecade * 10, 0);

        if (this._isValidDecade(newDate)) {
          state.decade = newDecade;
        } else {
          return this;
        }
      }

      this.setState(state, setStateCallback);
      return this;
    },

    _prevClick(e) {
      if (typeof this.props.onPrevSelection === "function") {
        this.props.onPrevSelection({ component: this, event: e });
      } else {
        this.onPrevSelectionDefault();
      }
    },

    _nextClick(e) {
      if (typeof this.props.onNextSelection === "function") {
        this.props.onNextSelection({ component: this, event: e });
      } else {
        this.onNextSelectionDefault();
      }
    },

    _isDateInRange(date) {
      return this._compareDates(date, this.state.value[0], "greater") && this._compareDates(date, this.state.value[1], "lesser");
    },

    _getWeeks() {
      let ths = this.getLsiValue('dayNames').map(dayName => {
        return (
          <th className={this.getClassName().dayName} title={dayName} key={dayName}>
            <div className={this.getClassName("dayCell")}>
              {dayName.substr(0, 2)}
            </div>
          </th>
        );
      });

      if (!this.props.hideWeekNumber) {
        ths.unshift(
          <th className={this.getClassName().dayName} key={"weekNumber"}>
            <div className={this.getClassName("dayCell")} />
          </th>
        );
      }

      return <tr className={this.getClassName().dayNames}>{ths}</tr>;
    },

    _setSelectedDate(date, e) {
      let opt = { value: date, event: e, component: this, _data: { type: "click" } };
      this._onChange(opt);
    },

    _setDay(date, e) {
      this._setSelectedDate(date, e);
      return this;
    },

    _setMonth(month, e) {
      e.stopPropagation();
      if (this.state.allowDisplayDays) {
        this.setState({ month: month, displayMode: "days" });
      } else {
        this._setSelectedDate(new Date(this.state.year, month - 1, 1), e);
      }
      return this;
    },

    _setYear(year, e) {
      e.stopPropagation();
      if (this.state.allowDisplayMonths) {
        this.setState({ year: year, displayMode: "months" });
      } else {
        this._setSelectedDate(new Date(year, 0, 1), e);
      }
      return this;
    },

    _compareDates(date1, date2, method) {
      let result = false;
      date1 = this._parseDate(date1);
      date2 = this._parseDate(date2);

      if (date1 && date2) {
        let UTCdate1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
        let UTCdate2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
        if (method === "equals") {
          result = UTCdate1 === UTCdate2;
        } else if (method === "greater") {
          result = UTCdate1 > UTCdate2;
        } else if (method === "lesser") {
          result = UTCdate1 < UTCdate2;
        }
      }

      return result;
    },

    _getDayRows() {
      let activeMonthIndex = this.state.month - 1;
      let firstDate = new Date(this.state.year, activeMonthIndex);
      let firstMondayDate = new Date(this.state.year, activeMonthIndex, 2 - (firstDate.getDay() || 7));

      let lastDate = new Date(this.state.year, activeMonthIndex + 1, 0);
      let lastSundayDate = new Date(this.state.year, this.state.month, 7 - (lastDate.getDay() || 7));

      let activeDate = firstMondayDate;
      let today = new Date(Date.now());

      let trs = [];
      let tds = [];
      while (activeDate <= lastSundayDate) {
        let className = this.getClassName().cell + ' ' + this.getClassName().day;
        let colorSchema = this.getColorSchema();
        if (colorSchema) dayCellClassName += " " + "color-schema-" + colorSchema;
        if (this.isDisabled()) className += " " + this.getClassName("disabled");
        let enabled = (!this.state.dateFrom || this.state.dateFrom <= activeDate) && (!this.state.dateTo || this.state.dateTo >= activeDate);

        !enabled && (className += ' ' + this.getClassName().disabled + ' ' + this.getClassName().anotherSection);

        let isActive = Array.isArray(this.state.value) ? this._compareDates(this.state.value[0], activeDate, "equals") || this._compareDates(this.state.value[1], activeDate, "equals") : this._compareDates(this.state.value, activeDate, "equals");
        let onClick = enabled ? this._setDay.bind(this, activeDate) : null;
        let isInRange = Array.isArray(this.state.value) && (activeDate.getMonth() === activeMonthIndex) ? this._isDateInRange(activeDate) : false;

        if (isInRange) {
          className += " " + this.getClassName().activeSelection;
        }

        let dayCellClassName = this.getClassName("dayCell");
        if (this.isDisabled()) dayCellClassName += " " + this.getClassName("disabled");
        if (colorSchema) dayCellClassName += " " + "color-schema-" + colorSchema;
        let cellWrapperClassName = this.getClassName("selection");
        if (this.isDisabled()) cellWrapperClassName += " " + this.getClassName("disabled");
        if (colorSchema) cellWrapperClassName += " " + "color-schema-" + colorSchema;
        if (isActive && ((this.props.selectionMode === "range" && activeDate.getMonth() === activeMonthIndex) || this.props.selectionMode === "single")) {
          className += ' ' + this.getClassName().active;
          if (this.props.selectionMode === "single") {
            onClick = null;
          }

          let isSelectionStart = Array.isArray(this.state.value) && this._compareDates(this.state.value[0], activeDate, "equals");
          let isSelectionEnd = Array.isArray(this.state.value) && this._compareDates(this.state.value[1], activeDate, "equals");

          if (isSelectionStart) {
            className += " " + this.getClassName().activeSelectionStart;
          } else if (isSelectionEnd) {
            className += " " + this.getClassName().activeSelectionEnd;
          }
        } else if (this._compareDates(today, activeDate, "equals")) {
          className += ' ' + this.getClassName().today;
        } else if (activeDate.getMonth() === activeMonthIndex) {
          className += ' ' + this.getClassName().activeSection;
        }

        if (activeDate.getMonth() !== activeMonthIndex) {
          className += ' ' + this.getClassName().anotherSection;

          if (this.props.hidePrevSelection && activeDate.getMonth() < activeMonthIndex) {
            onClick = null;
            className += " " + this.getClassName("inactive");
          } else if (this.props.hideNextSelection && activeDate.getMonth() > activeMonthIndex) {
            onClick = null;
            className += " " + this.getClassName("inactive");
          }
        }

        let content;
        if (this._compareDates(activeDate, today, "equals") && (activeDate.getMonth() === activeMonthIndex)) {
          content = <span className={this.getClassName("underline")}>{activeDate.getDate()}</span>;
        } else if (activeDate.getMonth() === activeMonthIndex) {
          content = activeDate.getDate();
        } else if (activeDate.getMonth() !== activeMonthIndex && this.props.hideOtherSections) {
          content = null;
          onClick = null;
        } else {
          content = activeDate.getDate();
        }

        tds.push(
          <td key={'day-' + activeDate.toISOString()} className={className} onClick={this.isDisabled() ? null : onClick}>
            <div className={cellWrapperClassName}>
              <div className={dayCellClassName}>{content}</div>
            </div>
          </td>
        );
        if (activeDate.getDay() === 1 && !this.props.hideWeekNumber) {
          let weekNum = this._getWeek(activeDate);
          tds.unshift(
            <th key={'week-' + weekNum} className={this.getClassName("weekNumber")}>
              <div className={this.getClassName("dayCell")}>{weekNum + '.'}</div>
            </th>
          );
        }
        if (activeDate.getDay() === 0) {
          trs.push(
            <tr key={'row-' + activeDate.toISOString()} className={this.getClassName().week}>
              {tds}
            </tr>
          );
          tds = [];
        }
        activeDate = new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate() + 1);
      }

      return trs;
    },

    _getMonthRows() {
      let calendar = this;
      let trs = [];
      let tds = [];
      let today = new Date(Date.now());
      let displayDate = this.getValue();

      /*this.getLsiValue('monthNames')*/
      ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"].forEach((name, i) => {
        let className = calendar.getClassName().cell + ' ' + calendar.getClassName().xsCell + ' ' + calendar.getClassName().month;
        let colorSchema = this.getColorSchema();

        if (this.isDisabled()) {
          className += " " + this.getClassName("disabled");
        }

        if (colorSchema) {
          className += " " + "color-schema-" + colorSchema;
        }

        const enabled = this._isValidMonth(new Date(calendar.state.year, i));

        !enabled && (className += ' ' + calendar.getClassName().disabled + ' ' + this.getClassName().anotherSection);

        let onClick = enabled ? calendar._setMonth.bind(calendar, i + 1) : null;

        if (displayDate && calendar.state.year === displayDate.getFullYear() && i === displayDate.getMonth()) {
          className += ' ' + calendar.getClassName().active;
        } else if (calendar.state.year === today.getFullYear() && i === today.getMonth()) {
          className += ' ' + calendar.getClassName().today;
        }

        tds.push(
          <td className={calendar.getClassName().specCell} key={i} >
            <div className={className} title={name} onClick={this.isDisabled() ? null : onClick}>
              {
                (calendar.state.year === today.getFullYear() && i === today.getMonth()) ?
                  <span className={this.getClassName("underline")}>{name}</span> : name
              }
            </div>
          </td>
        );

        if (!((i + 1) % 4)) {
          trs.push(
            <tr className={calendar.getClassName().months} key={i}>
              {tds}
            </tr>
          );
          tds = [];
        }
      });

      return trs;
    },

    _getYearRows() {
      let trs = [];
      let tds = [];
      let today = new Date(Date.now());
      let displayDate = this.getValue();

      for (let i = 0; i < 13; i++) {
        let className = this.getClassName().cell + ' ' + this.getClassName().xsCell + ' ' + this.getClassName().year;
        let colorSchema = this.getColorSchema();

        if (this.isDisabled()) {
          className += " " + this.getClassName("disabled");
        }

        if (colorSchema) {
          className += " " + "color-schema-" + colorSchema;
        }

        let year = this.state.century * 100 + this.state.decade * 10 + i - 1;

        let enabled = false;
        if ((!this.state.dateFrom || this.state.dateFrom.getFullYear() <= year) && (!this.state.dateTo || this.state.dateTo.getFullYear() >= year)) {
          enabled = true;
        }

        !enabled && (className += ' ' + this.getClassName().disabled + ' ' + this.getClassName().anotherSection);

        let onClick = enabled ? this._setYear.bind(this, year) : null;
        let content = year;

        if (displayDate && year === displayDate.getFullYear()) {
          className += ' ' + this.getClassName().active;
        } else if (year === today.getFullYear()) {
          className += ' ' + this.getClassName().today;
        } else if (i > 0 && i < 11) {
          className += ' ' + this.getClassName().activeSection;
        } else {
          className += ' ' + this.getClassName().anotherSection;
          if (this.props.hideOtherSections) {
            content = null;
            onClick = null;
          } else if (this.props.hidePrevSelection && i < 11) {
            onClick = null;
            className += " " + this.getClassName("inactive");
          } else if (this.props.hideNextSelection && i > 0) {
            onClick = null;
            className += " " + this.getClassName("inactive");
          }
        }

        tds.push(
          <td className={this.getClassName().specCell}key={i} >
            <div className={className} onClick={this.isDisabled() ? null : onClick}>
              {
                (year === today.getFullYear()) ?
                  <span className={this.getClassName("underline")}>{content}</span> : content
              }
            </div>
          </td>
        );

        if (!((i + 1) % 4)) {
          trs.push(
            <tr className={this.getClassName().years} key={i}>
              {tds}
            </tr>
          );
          tds = [];
        }
      }

      return trs;
    },

    _onChange(opt) {
      let dateInfo = this._getDisplayedDate(opt.value);
      let formatedDate = dateInfo ? UU5.Common.Tools.getDateString(opt.value) : null;

      if (formatedDate || opt.value === "") {
        let state = {};
        let value = null;
        if (formatedDate) {
          value = Array.isArray(opt.value) ? [this._parseDate(opt.value[0]), this._parseDate(opt.value[1])] : this._parseDate(opt.value);
          state = { ...dateInfo, ...{ value: value } };
        }
        opt.value = value;
        opt._data.state = state;

        if (typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }
    },

    _getTodayButton() {
      let className = this.getClassName("todayButton");

      if (this.isDisabled()) {
        className += " " + this.getClassName("disabled");
      }

      return (
        <UU5.Bricks.Button
          className={className}
          onClick={() => {
            if (!this.isDisabled()) {
              let dateInfo = this._getDisplayedDate(new Date(Date.now()));
              this.setState({ ...dateInfo });
            }
          }}
          content={this.getLsiValue("today")}
        />
      );
    },

    _getHeader() {
      let prevActive = this._isChangeable(-1) && !this.props.hidePrevSelection;
      let nextActive = this._isChangeable(1) && !this.props.hideNextSelection;
      let prevClassName = this.getClassName().headCellPrev;
      let nextClassName = this.getClassName().headCellNext;
      let colSpan = this.state.displayMode == "days" ? 6 : 2;

      if ((!prevActive && !this.props.hidePrevSelection) || this.isDisabled()) {
        prevClassName += ' ' + this.getClassName().disabled
      }

      if (this.props.hidePrevSelection) {
        prevClassName += " " + this.getClassName("inactive");
      }

      if ((!nextActive && !this.props.hideNextSelection) || this.isDisabled()) {
        nextClassName += ' ' + this.getClassName().disabled
      }

      if (this.props.hideNextSelection) {
        nextClassName += " " + this.getClassName("inactive");
      }

      if (this.props.hideWeekNumber) {
        colSpan--;
      }

      colSpan = colSpan.toString();

      let headCellClassName = this.getClassName("headCellHeader");

      if (this.isDisabled()) {
        headCellClassName += " " + this.getClassName("disabled");
      }

      return (
        <thead className={this.getClassName().thead}>
          <tr className={this.getClassName().headRow}>
            <th className={prevClassName} onClick={prevActive && !this.isDisabled() ? this._prevClick : null}>
              {this.props.hidePrevSelection ? null : <UU5.Bricks.Icon className={this.getClassName().icon} icon={this.getDefault().prevIcon} />}
            </th>
            <th className={headCellClassName} colSpan={colSpan}
                onClick={this.state.displayMode == "years" || this.props.selectionMode === "range" || this.isDisabled() ? null : this._headerClick}>
              {this._getHeaderText()}
            </th>
            <th className={nextClassName} onClick={nextActive && !this.isDisabled() ? this._nextClick : null}>
              {this.props.hideNextSelection ? null : <UU5.Bricks.Icon className={this.getClassName().icon} icon={this.getDefault().nextIcon} />}
            </th>
          </tr>
          {this.state.displayMode == "days" ? this._getWeeks() : null}
        </thead>
      );
    },

    _getBody() {
      let trs;

      if (this.state.displayMode == "days") {
        trs = this._getDayRows();
      } else if (this.state.displayMode == "months") {
        trs = this._getMonthRows();
      } else if (this.state.displayMode == "years") {
        trs = this._getYearRows();
      }

      return <tbody>{trs}</tbody>;
    },

    _getWeekColumnhighlight() {
      let result = null;

      if (!this.props.hideWeekNumber && this.state.displayMode === "days") {
        result = (
          <span className={this.getClassName("weekColumnHighlight")} />
        );
      }

      return result;
    },

    _onSwipeEnd() {
      (this.isSwipedRight() && this.setPrevious()) || (this.isSwipedLeft() && this.setNext());
      return this;
    },

    _getTableProps() {
      let className = this.getClassName().table;

      if (this.state.displayMode == "days") {
        className += ' ' + this.getClassName().monthTable;
      } else if (this.state.displayMode == "months") {
        className += ' ' + this.getClassName().yearTable;
      } else if (this.state.displayMode == "years") {
        className += ' ' + this.getClassName().decadeTable;
      }

      if (this.props.hideWeekNumber) {
        className += " " + this.getClassName().hideWeekNumber;
      }

      return {
        className: className,
        onTouchStart: this.swipeOnTouchStart,
        onTouchMove: this.swipeOnTouchMove,
        onTouchEnd: this.swipeOnTouchEnd.bind(this, this._onSwipeEnd),
        cellPadding: 0
      };
    },

    _getMainWrapper() {
      return (
        <div className={this.getClassName("mainWrapper")}>
          {this._getWeekColumnhighlight()}
          <table {...this._getTableProps()}>
            {this._getHeader()}
            {this._getBody()}
          </table>
        </div>
      );
    },

    _getSecondaryWrapper() {
      let result = null;

      if (this.props.showTodayButton) {
        result = (
          <div className={this.getClassName("secondaryWrapper")}>
            {this.props.showTodayButton ? this._getTodayButton() : null}
          </div>
        );
      }

      return result;
    },
    //@@viewOff:componentSpecificHelpers

    //@@viewOn:render
    render() {
      return (
        <div {...this._getMainAttrs()}>
          {this._getMainWrapper()}
          {this._getSecondaryWrapper()}
        </div>
      );
    }
    //@@viewOff:render
  })
);

export default Calendar;
