import * as UU5 from "uu5g04";

const TIME_FORMAT_12 = "12";

export const REGEXP = {
  timeFormat12: /^\d{1,2}:?\d{0,2} ?[PpAa]?\.?[Mm]?\.?$/,
  timeFormat12seconds: /^\d{1,2}:?\d{0,2}:?\d{0,2} ?[PpAa]?\.?[Mm]?\.?$/,
  timeFormat24: /^\d{1,2}:?\d{0,2}$/,
  timeFormat24seconds: /^\d{1,2}:?\d{0,2}:?\d{0,2}$/
};

export const DateTools = {
  setupLimits: props => {
    let timeFrom = undefined;
    let timeTo = undefined;
    let show24 = false;

    if (props.format == TIME_FORMAT_12) {
      timeFrom = { hours: 1, minutes: 0, seconds: 0 };
      timeTo = { hours: 25, minutes: 0, seconds: 0 };
    } else {
      if (props.timeFrom) {
        let _timeFrom = props.timeFrom;
        // if (props.format == TIME_FORMAT_12) timeFrom = UU5.Common.Tools.changeTimeFormat(timeFrom, 24);
        timeFrom = UU5.Common.Tools.parseTime(_timeFrom, 24);
      } else {
        timeFrom = { hours: 0, minutes: 0, seconds: 0 };
      }

      if (props.timeTo) {
        let _timeTo = props.timeTo;
        // if (props.format == TIME_FORMAT_12) timeTo = UU5.Common.Tools.changeTimeFormat(timeTo, 24);
        timeTo = UU5.Common.Tools.parseTime(_timeTo, 24);
      } else {
        if (props.show24 && props.format != TIME_FORMAT_12) {
          timeTo = { hours: 24, minutes: 0, seconds: 0 };
        } else {
          timeTo = { hours: 23, minutes: 59, seconds: 59 };
        }
      }

      if (DateTools.isDefaultLimit(timeFrom, timeTo) && props.show24) {
        show24 = true;
      }
    }

    return {
      timeFrom,
      timeTo,
      show24
    };
  },
  isDefaultLimit: (timeFrom, timeTo) => {
    // from = 0, to = 24
    if (
      timeFrom.hours === 0 &&
      timeFrom.minutes === 0 &&
      timeFrom.seconds === 0 &&
      timeTo.hours === 24 &&
      timeTo.minutes === 0 &&
      timeTo.seconds === 0
    ) {
      return true;
    } else {
      return false;
    }
  },
  validateLimits: (time, timeFrom, timeTo) => {
    let result = true;

    if (time) {
      time = time.hours * 60 * 60 + time.minutes * 60 + time.seconds;
      let _timeFrom = timeFrom.hours * 60 * 60 + timeFrom.minutes * 60 + timeFrom.seconds;
      let _timeTo = timeTo.hours * 60 * 60 + timeTo.minutes * 60 + timeTo.seconds;

      if (time < _timeFrom || time > _timeTo) {
        if (_timeFrom === _timeTo) {
          result = true;
        } else if (_timeFrom > _timeTo && !(time < _timeFrom && time > _timeTo)) {
          result = true;
        } else {
          result = false;
        }
      }
    }

    return result;
  },
  setDate(date, day, month, year) {
    let days = date.getDate();
    let months = date.getMonth();
    let years = date.getFullYear();

    if (typeof day === "number") {
      days = day;
    }

    if (typeof month === "number") {
      months = month;
    }

    if (typeof year === "number") {
      years = year;
    }

    return new Date(years, months, days);
  },
  increaseDate(date, dayIncrease, monthIncrease, yearIncrease) {
    let days = date.getDate();
    let months = date.getMonth();
    let years = date.getFullYear();

    if (typeof dayIncrease === "number") {
      days += dayIncrease;
    }

    if (typeof monthIncrease === "number") {
      months += monthIncrease;
    }

    if (typeof yearIncrease === "number") {
      years += yearIncrease;
    }

    return new Date(years, months, days);
  },
  decreaseDate(date, dayDecrease, monthDecrease, yearDecrease) {
    let days = date.getDate();
    let months = date.getMonth();
    let years = date.getFullYear();

    if (typeof dayDecrease === "number") {
      days -= dayDecrease;
    }

    if (typeof monthDecrease === "number") {
      months -= monthDecrease;
    }

    if (typeof yearDecrease === "number") {
      years -= yearDecrease;
    }

    return new Date(years, months, days);
  },
  getShortenedInputDateString(date, separator = "/", excludeMonth) {
    if (date instanceof Date) {
      let year = "" + date.getFullYear();
      let month = UU5.Common.Tools.rjust(date.getMonth() + 1, 2, "0");

      if (excludeMonth) {
        return year;
      } else {
        return `${month}${separator}${year}`;
      }
    } else {
      return null;
    }
  },
  getShortenedValueDateString(date, separator = "-", excludeMonth) {
    if (date instanceof Date) {
      let year = "" + date.getFullYear();
      let month = UU5.Common.Tools.rjust(date.getMonth() + 1, 2, "0");

      if (excludeMonth) {
        return year;
      } else {
        return `${year}${separator}${month}`;
      }
    } else {
      return null;
    }
  },
  getCalendarStartView(props) {
    let startView;

    if (props.step === "days" || !props.step) {
      startView = props.calendarStartView || "days";
    } else if (props.step === "months") {
      startView = props.calendarStartView !== "days" ? props.calendarStartView || "months" : "months";
    } else if (props.step === "years") {
      startView = "years";
    }

    return startView;
  },
  getDisplayDates(dateValue, view) {
    let dateFrom;
    let dateTo;

    if (Array.isArray(dateValue)) {
      dateFrom = dateValue[0];
    } else if (dateValue) {
      dateFrom = dateValue;
    } else {
      dateFrom = new Date();
    }

    if (view === "days" || !view) {
      dateTo = DateTools.increaseDate(dateFrom, undefined, 1);
    } else if (view === "months") {
      dateTo = DateTools.increaseDate(dateFrom, undefined, undefined, 1);
    } else if (view === "years") {
      dateTo = DateTools.increaseDate(dateFrom, undefined, undefined, 10);
    }

    return {
      dateFrom,
      dateTo
    };
  }
};

export default DateTools;
