/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:revision
//  coded: Martin Mach, 18.09.2020
//  reviewed: Filip Janovský, 07.10.2020 - approved
//@@viewOff:revision

//@@viewOn:imports
import UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import { withUserPreferencesAndTimeZone } from "../common/user-preferences";

import "./date-time.less";
//@@viewOff:imports

const FORMAT_MAP = { D: "day", M: "month", Y: "year", H: "hour", m: "minute", s: "second" };

function formatDateByIntl(date, { country, format, timeZone, timeOnly, dateOnly, secondsDisabled } = {}) {
  let opt = {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  if (timeOnly) {
    opt.year = undefined;
    opt.month = undefined;
    opt.day = undefined;
  }

  if (secondsDisabled) {
    opt.second = undefined;
  }

  if (dateOnly) {
    opt.hour = undefined;
    opt.minute = undefined;
    opt.second = undefined;
  }

  if (format) {
    // add time chars as prop format has effect only on date part
    if (!dateOnly) {
      format += " HH:mm";
      if (!secondsDisabled) format += ":ss";
    }

    format.replace(/[DMYHms]+/g, (m) => {
      let key = FORMAT_MAP[m[0]];
      opt[key] = m.length === 1 || (key === "year" && m.length > 2) ? "numeric" : m.length === 2 ? "2-digit" : "long";
    });
    let parts = new Intl.DateTimeFormat(country, opt).formatToParts(date);
    return format.replace(/[DMYHms]+/g, (m) => {
      let key = FORMAT_MAP[m[0]];
      let part = parts.find((it) => it.type === key);
      return part ? part.value : m;
    });
  } else {
    return new Intl.DateTimeFormat(country, opt).format(date);
  }
}

let DateTime = UU5.Common.VisualComponent.create({
  displayName: "DateTime", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.NestingLevelMixin, UU5.Common.PureRenderMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("DateTime"),
    nestingLevel: "inline",
    classNames: {
      main: ns.css("date-time"),
      timeOnly: ns.css("date-time-timeonly"),
      dateOnly: ns.css("date-time-dateonly"),
    },
    defaults: {
      event: UU5.Common.Tools.events.dateTime,
      regexpSeconds: /:[S]+/,
      regexpSeconds2: /[S]+/,
    },
    warnings: {
      rangeTimeZone: "Time zone must be in range from -12 to +12. Your time zone was %s.",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    value: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.instanceOf(Date)]),
    format: UU5.PropTypes.string,
    country: UU5.PropTypes.string,
    timeZone: UU5.PropTypes.number,
    dateOnly: UU5.PropTypes.bool,
    timeOnly: UU5.PropTypes.bool,
    secondsDisabled: UU5.PropTypes.bool,
    _contextTimeZone: UU5.PropTypes.string, // prop for internal usage (not documented)
    _contextFormat: UU5.PropTypes.string, // prop for internal usage (not documented)
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      value: null,
      format: null,
      country: null,
      timeZone: null,
      dateOnly: false,
      timeOnly: false,
      secondsDisabled: false,
      _contextTimeZone: undefined,
      _contextFormat: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let timeZone;

    if (typeof this.props.timeZone === "number") {
      timeZone = this.props.timeZone;
    }

    return {
      format: this.props.format,
      country: this.props.country,
      systemCountry: UU5.Common.Tools.getLanguage(),
      timeZone: this._validateTimeZone(timeZone),
    };
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({
        format: nextProps.format,
        country: nextProps.country,
        timeZone: this._validateTimeZone(nextProps.timeZone),
      });
    }
  },

  componentDidMount() {
    UU5.Environment.EventListener.registerDateTime(this.getId(), this._change);
  },

  componentWillUnmount() {
    UU5.Environment.EventListener.unregisterDateTime(this.getId(), this._change);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getFormat() {
    return this.state.format;
  },

  setFormat(format, setStateCallback) {
    this.setOptions({ format: format }, setStateCallback);
    return this;
  },

  getCountry() {
    return this.state.country || this.state.systemCountry;
  },

  setCountry(country, setStateCallback) {
    this.setOptions({ country: country ? country.toLowerCase() : country }, setStateCallback);
    return this;
  },

  getTimeZone() {
    return this._getTimeZoneInfo().timeZone;
  },

  setTimeZone(timeZone, setStateCallback) {
    this.setOptions(
      {
        timeZone,
      },
      setStateCallback
    );
    return this;
  },

  setOptions(opt, setStateCallback) {
    this._setOptions(opt, false, setStateCallback);
    return this;
  },

  onChangeDefault(opt) {
    this.setOptions(opt);

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _change(opt) {
    this._setOptions(opt, true);
    return this;
  },

  _setOptions(opt, system, setStateCallback) {
    let timeZone;

    if (typeof opt.timeZone === "number") {
      timeZone = opt.timeZone;
    } else {
      timeZone = this.state.timeZone;
    }

    this.setState((state) => {
      let newState = {
        format: opt.format === undefined ? state.format : opt.format,
        timeZone: this._validateTimeZone(timeZone),
      };

      if (system) {
        newState.systemCountry =
          opt.country === undefined ? state.systemCountry : opt.country ? opt.country.toLowerCase() : opt.country;
      } else {
        newState.country =
          opt.country === undefined ? state.country : opt.country ? opt.country.toLowerCase() : opt.country;
      }

      return newState;
    }, setStateCallback);
  },

  _getTimeZoneInfo() {
    let timeZone = this.state.timeZone;
    let getTimeZoneFromValue = false;
    if (typeof timeZone !== "number") {
      timeZone = UU5.Common.Tools.getISOTimeZone(this.props.value);

      if (typeof timeZone !== "number") {
        timeZone = UU5.Environment.dateTimeZone;
      } else {
        getTimeZoneFromValue = true;
      }
    }
    return { timeZone, getTimeZoneFromValue };
  },

  _formatDateByCountry(date, country, timeZone) {
    let result;
    if (UU5.Environment.dateTimeFormat[country]) {
      result = this._formatDateTime(date, UU5.Environment.dateTimeFormat[country], timeZone);
    } else {
      result = this._getLocalDateTime(date, country);
    }
    return result;
  },

  _formatDateTime(date, format, timeZone) {
    if (this.props.secondsDisabled && format) {
      format = format.replace(this.getDefault().regexpSeconds, "").replace(this.getDefault().regexpSeconds2, "");
    }

    return UU5.Common.Tools.formatDate(date, format, timeZone);
  },

  _getLocalDateTime(date, country) {
    country = country || [];
    let result, opt;

    if (this.props.secondsDisabled) {
      opt = { hour: "numeric", minute: "numeric" };

      if (!this.props.timeOnly) {
        opt = UU5.Common.Tools.merge({ year: "numeric", month: "numeric", day: "numeric" }, opt);
      }
    }

    if (this.props.dateOnly) {
      result = UU5.Common.Tools.toLocaleDateString(date, country, opt);
    } else if (this.props.timeOnly) {
      result = UU5.Common.Tools.toLocaleTimeString(date, country, opt);
    } else {
      result = UU5.Common.Tools.toLocaleString(date, country, opt);
    }

    return result;
  },

  _getFullDate(date, timeZone) {
    let dateObject, timeString, timeObject;
    if (UU5.Common.Tools.isISODateString(date)) {
      dateObject = UU5.Common.Tools.parseDate(date) || new Date(Date.parse(date));
      timeString = UU5.Common.Tools.getTimeString(date, !this.props.secondsDisabled);
      timeObject = UU5.Common.Tools.parseTime(timeString);
      dateObject.setHours(timeObject.hours);
      dateObject.setMinutes(timeObject.minutes);
      dateObject.setSeconds(timeObject.seconds);
    } else {
      dateObject = typeof date === "string" ? new Date(Date.parse(date)) : date || new Date(Date.now());
    }

    if (typeof timeZone === "number") {
      let utc = new Date(dateObject.getTime() + dateObject.getTimezoneOffset() * 60000);
      dateObject = new Date(utc.getTime() + timeZone * 60 * 60000);
    }

    return dateObject;
  },

  _formatDate(date) {
    let result = null;
    let country = this.getCountry();

    if (
      typeof this.state.timeZone !== "number" &&
      UU5.Environment.dateTimeZone == null &&
      !this.state.format &&
      (!(date instanceof Date) || !isNaN(date.getDate()))
    ) {
      date = this._getFullDate(date);
      result = formatDateByIntl(date, {
        country,
        format: this.props._contextFormat,
        timeZone: this.props._contextTimeZone,
        timeOnly: this.props.timeOnly,
        dateOnly: this.props.dateOnly,
        secondsDisabled: this.props.secondsDisabled,
      });
    } else {
      let { timeZone, getTimeZoneFromValue } = this._getTimeZoneInfo();
      date = this._getFullDate(date, getTimeZoneFromValue ? undefined : timeZone);

      if (this.state.format) {
        result = this._formatDateTime(date, this.state.format, timeZone);
      } else if (country) {
        result = this._formatDateByCountry(date, country, timeZone);
      } else {
        result = this._getLocalDateTime(date);
      }
    }

    return result;
  },

  _validateTimeZone(timeZone) {
    if (timeZone < -12) {
      this.showWarning("rangeTimeZone", timeZone);
      timeZone = -12;
    } else if (timeZone > 12) {
      this.showWarning("rangeTimeZone", timeZone);
      timeZone = 12;
    }
    return timeZone;
  },

  _buildMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    if (this.props.timeOnly) {
      mainAttrs.className += " " + this.getClassName().timeOnly;
    } else if (this.props.dateOnly) {
      mainAttrs.className += " " + this.getClassName().dateOnly;
    }

    return mainAttrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let result;

    if (this.getNestingLevel()) {
      result = (
        <span {...this._buildMainAttrs()}>
          {this._formatDate(this.props.value || new Date(Date.now()))}
          {this.getDisabledCover()}
        </span>
      );
    }

    return result;
  },
  //@@viewOff:render
});

DateTime = withUserPreferencesAndTimeZone(DateTime, {
  _contextFormat: "shortDateFormat",
  _contextTimeZone: "timeZone",
});

export { DateTime };
export default DateTime;
