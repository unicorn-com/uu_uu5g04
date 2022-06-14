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

//@@viewOn:imports
import UU5 from "uu5g04";
//@@viewOff:imports

function convertToG04DateFormat(i18nFormat) {
  return i18nFormat
    .replace(/[DMYdWE]+|\[^]*\]/g, (m) => {
      switch (m[0]) {
        case "D":
        case "M":
          // MMM, MMMM not supported => use number-based month (MM) in such case
          return m.toLowerCase().slice(0, 2);
        case "Y":
          return m.length === 2 ? "y" : "Y";
        case "d":
        case "W":
        case "E":
          // week numbers / day of week in date string not supported => remove those
          return "";
        case "[":
          // extra text not supported
          return "";
      }
    })
    .trim();
}

const withUserPreferencesDateAdapter = (Component) => {
  if (!UU5.Common.Context.isSupported() || process.env.NODE_ENV === "test") return Component;
  let forwardRef = UU5.Common.Reference.forward((props, ref) => {
    let { _dateFormat, format, ...propsToPass } = props;
    let { valueType, parseDate, step } = props;
    if (
      _dateFormat &&
      format == null &&
      (valueType === "iso" || valueType === "date") &&
      typeof parseDate !== "function" &&
      (!step || step === "days")
    ) {
      format = convertToG04DateFormat(_dateFormat) || format;
    }
    return <Component {...propsToPass} format={format} ref={ref} />;
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

export { withUserPreferencesDateAdapter };
export default withUserPreferencesDateAdapter;
