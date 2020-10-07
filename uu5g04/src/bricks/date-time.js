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

//@@viewOn:revision
//  coded: Martin Mach, 18.09.2020
//  reviewed: Filip Janovský, 07.10.2020 - approved
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import "./date-time.less";
//@@viewOff:imports

function withTimeZoneContext(Component) {
  // disable context for jest tests - enzyme doesn't support React 16.3 Context API
  if (!UU5.Common.Context.create || process.env.NODE_ENV === "test") return Component;
  let forwardRef = UU5.Common.Reference.forward((props, ref) => {
    return (
      <UU5.Common.TimeZoneContext.Consumer>
        {({ timeZone }) => {
          return <Component {...props} _contextTimeZone={timeZone} ref={ref} />;
        }}
      </UU5.Common.TimeZoneContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
}

export const DateTime = withTimeZoneContext(
  UU5.Common.VisualComponent.create({
    displayName: "DateTime", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.NestingLevelMixin,
      UU5.Common.PureRenderMixin,
    ],
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
      onChange: UU5.PropTypes.func,
      dateOnly: UU5.PropTypes.bool,
      timeOnly: UU5.PropTypes.bool,
      secondsDisabled: UU5.PropTypes.bool,
      _contextTimeZone: UU5.PropTypes.string, // prop for internal usage (not documented)
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: null,
        format: null,
        country: null,
        timeZone: null,
        onChange: null,
        dateOnly: false,
        timeOnly: false,
        secondsDisabled: false,
        _contextTimeZone: undefined,
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
        let timeZone = this.state.timeZone;
        if (typeof nextProps.timeZone === "number") {
          timeZone = nextProps.timeZone;
        }

        this.setState({
          format: nextProps.format,
          country: nextProps.country,
          timeZone: this._validateTimeZone(timeZone),
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

    _formatDateByIntl(date, country) {
      let opt = { timeZone: this.props._contextTimeZone };

      if (!this.props.timeOnly) {
        opt.year = "numeric";
        opt.month = "numeric";
        opt.day = "numeric";
      }

      if (!this.props.dateOnly) {
        opt.hour = "numeric";
        opt.minute = "numeric";
        if (!this.props.secondsDisabled) opt.second = "numeric";
      }

      return new Intl.DateTimeFormat(country, opt).format(date);
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
        result = this._formatDateByIntl(date, country);
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
  })
);

export default DateTime;
