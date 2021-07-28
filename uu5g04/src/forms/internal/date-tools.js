import * as UU5 from "uu5g04";

const TIME_FORMAT_12 = "12";

export const REGEXP = {
  timeFormat12: /^\d{1,2}:?\d{0,2} ?[PpAa]?\.?[Mm]?\.?$/,
  timeFormat12seconds: /^\d{1,2}:?\d{0,2}:?\d{0,2} ?[PpAa]?\.?[Mm]?\.?$/,
  timeFormat24: /^\d{1,2}:?\d{0,2}$/,
  timeFormat24seconds: /^\d{1,2}:?\d{0,2}:?\d{0,2}$/,
};

const DATE_FORMATTER_OPTS = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
};

const DATE_PARTS = ["year", "month", "day", "hour", "minute"];

function createDateFromDateParts(dateParts) {
  let utcParts = [];
  for (let i = 0; i < DATE_PARTS.length; i++) {
    utcParts.push(parseInt(dateParts.find((part) => part.type === DATE_PARTS[i]).value));
  }
  return Date.UTC(utcParts[0], utcParts[1] - 1, utcParts[2], utcParts[3], utcParts[4]);
}

export const UNSPECIFIED_FROM = new Date("1900-01-01T00:00:00");
export const UNSPECIFIED_TO = new Date("2099-12-31T00:00:00");
export const UNSPECIFIED_CHAR = "∞";

export const DateTools = {
  setupLimits: (props) => {
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
      show24,
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

    if (dateFrom.getTime?.() === UNSPECIFIED_FROM.getTime()) dateFrom = new Date(Date.now());

    if (view === "days" || !view) {
      dateTo = DateTools.increaseDate(dateFrom, undefined, 1);
    } else if (view === "months") {
      dateTo = DateTools.increaseDate(dateFrom, undefined, undefined, 1);
    } else if (view === "years") {
      dateTo = DateTools.increaseDate(dateFrom, undefined, undefined, 10);
    }

    return {
      dateFrom,
      dateTo,
    };
  },
  getISO(dateValue, ignoreTime) {
    if (!dateValue) return dateValue;
    let result;

    if (ignoreTime) {
      result = DateTools.getISOLocal(dateValue);
      result = result.replace(/T.*$/, "");
    } else {
      result = dateValue.toISOString();
    }

    return result;
  },
  getISOLocal(dateValue, timeZone) {
    if (!dateValue) return dateValue;
    let utcDiff = -dateValue.getTimezoneOffset() / 60;

    if (typeof timeZone === "number") {
      dateValue = UU5.Common.Tools.adjustForTimezone(dateValue, utcDiff, timeZone - utcDiff);
    } else {
      dateValue = UU5.Common.Tools.adjustForTimezone(dateValue, 1, 0);
    }

    let iso = DateTools.getISO(dateValue);
    iso = iso.replace(UU5.Common.REGEXP.isoTimeZone, "").replace(/\.\d\d\d$/, "");
    return iso;
  },

  toISODateOnlyString(inexactDateInstance) {
    return inexactDateInstance
      ? `${inexactDateInstance.getFullYear()}-${UU5.Common.Tools.rjust(
          inexactDateInstance.getMonth() + 1,
          2,
          "0"
        )}-${UU5.Common.Tools.rjust(inexactDateInstance.getDate(), 2, "0")}`
      : null;
  },
  getWeekDay(date, weekDay) {
    date = new Date(date);
    let day = date.getDay() || 7;
    let dayDiff = weekDay > day ? weekDay - day : weekDay - day;
    if (dayDiff) {
      date = DateTools.increaseDate(date, dayDiff);
    }
    return date;
  },
  getWeekDayRange(date, startDay, endDay) {
    let resultRange;
    if (startDay && endDay) {
      startDay = DateTools.getWeekDay(date, startDay);
      endDay = DateTools.getWeekDay(date, endDay);

      if (endDay < startDay) {
        endDay = DateTools.increaseDate(endDay, 7);
      }

      resultRange = [startDay, endDay];
    }
    return resultRange;
  },
  getWeek(date, weekStartDay = 1) {
    date = new Date(date);
    let currDay = date.getDay();
    let currDate = date.getDate();
    let currWeekStartDate = currDate - currDay + weekStartDay;
    if (currWeekStartDate > currDate) {
      currWeekStartDate -= 7;
    }
    let start = new Date(DateTools.setDate(date, currWeekStartDate));
    let end = DateTools.increaseDate(start, 6);
    return [start, end];
  },
  getAutoRange(initialValue, selectionType = "week", weekStartDay = 1) {
    let startValue;

    if (Array.isArray(initialValue)) {
      startValue = initialValue[0];
    } else {
      startValue = initialValue;
    }

    if (!startValue) return undefined;

    let resultRange = [startValue];

    if (selectionType === "week") {
      resultRange = DateTools.getWeek(startValue, weekStartDay);
    } else if (typeof selectionType === "number") {
      resultRange.push(DateTools.increaseDate(startValue, selectionType - 1));
    } else if (typeof selectionType === "string" && /^\d-\d$/.test(selectionType)) {
      let [start, end] = selectionType.split("-");
      resultRange = DateTools.getWeekDayRange(startValue, parseInt(start), parseInt(end));
    }

    return DateTools.correctDateRange(resultRange);
  },
  correctDateRange(dateRange, isTo = false) {
    if (Array.isArray(dateRange)) {
      if (dateRange[0] instanceof Date) {
        dateRange[0].setHours(0);
        dateRange[0].setMinutes(0);
        dateRange[0].setSeconds(0);
        dateRange[0].setMilliseconds(0);
      }
      if (dateRange[1] instanceof Date) {
        dateRange[1].setHours(23);
        dateRange[1].setMinutes(59);
        dateRange[1].setSeconds(59);
        dateRange[1].setMilliseconds(999);
      }
    } else if (dateRange instanceof Date) {
      if (isTo) {
        dateRange.setHours(23);
        dateRange.setMinutes(59);
        dateRange.setSeconds(59);
        dateRange.setMilliseconds(999);
      } else {
        dateRange.setHours(0);
        dateRange.setMinutes(0);
        dateRange.setSeconds(0);
        dateRange.setMilliseconds(0);
      }
    }

    return dateRange;
  },
  isAllowedFromUnspecifiedRange(props) {
    let { allowUnspecifiedRange, dateFrom, strictSelection, step } = props;
    return (
      (allowUnspecifiedRange === true || allowUnspecifiedRange === "from") &&
      !dateFrom &&
      !strictSelection &&
      step !== "years" &&
      step !== "months"
    );
  },
  isAllowedToUnspecifiedRange(props) {
    let { allowUnspecifiedRange, dateTo, strictSelection, step } = props;
    return (
      (allowUnspecifiedRange === true || allowUnspecifiedRange === "to") &&
      !dateTo &&
      !strictSelection &&
      step !== "years" &&
      step !== "months"
    );
  },
  unspecifiedRangeValueToDate(value, allowFrom, allowTo) {
    let singleValueFn = (singleValue, index) => {
      if (allowFrom && index === 0 && singleValue === null) return UNSPECIFIED_FROM;
      else if (allowTo && index === 1 && singleValue === null) return UNSPECIFIED_TO;
      return singleValue;
    };
    return Array.isArray(value) ? value.map(singleValueFn) : singleValueFn(value);
  },
};

export default DateTools;
