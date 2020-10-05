/**
 * Copyright (C) 2020 Unicorn a.s.
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
//  reviewed: -
//@@viewOff:revision

//@@viewOn:imports
import UU5 from "uu5g04";
import { useState, useEffect, useMemo, useRef, useContext } from "./react-hooks";
import { createComponent } from "./component";
//@@viewOff:imports

const TimeZoneContext = UU5.Common.TimeZoneContext;
const useTimeZoneContext = () => useContext(TimeZoneContext);

const TimeZoneProvider = createComponent({
  //@@viewOn:statics
  displayName: "UU5.Hooks.TimeZoneProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    initialTimeZone: UU5.PropTypes.string,
    onChange: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    initialTimeZone: undefined,
    onChange: undefined,
  },
  //@@viewOff:defaultProps

  render({ onChange, initialTimeZone, children }) {
    //@@viewOn:private
    const [timeZone, setTimeZone] = useState(() =>
      initialTimeZone === undefined ? UU5.Environment.timeZone : initialTimeZone
    );
    const value = useMemo(() => ({ timeZone, setTimeZone }), [timeZone]);

    const currentValuesRef = useRef();
    currentValuesRef.current = { onChange };
    let onChangeAllowedRef = useRef(false);
    useEffect(() => {
      // skip onChange for initial mount
      if (onChangeAllowedRef.current) {
        // onXyz callbacks are passed via ref because typically we don't want to re-run them when they change
        // (we just want to use the new callback once new effect takes place)
        let { onChange } = currentValuesRef.current;
        if (typeof onChange === "function") onChange({ timeZone });
      } else {
        onChangeAllowedRef.current = true;
      }
    }, [timeZone]);
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return <TimeZoneContext.Provider value={value}>{children}</TimeZoneContext.Provider>;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function _warnNoOp() {
  if (process.env.NODE_ENV === "development") {
    UU5.Common.Tools.warn(
      "Changing timeZone via useTimeZone hook return value is supported only with TimeZoneProvider being in the hierarchy of parent components."
    );
  }
}
//@@viewOff:helpers

function useTimeZone() {
  const ctxValue = useTimeZoneContext();
  const usedValue = ctxValue ?? { timeZone: UU5.Environment.timeZone, setTimeZone: _warnNoOp };
  return [usedValue.timeZone, usedValue.setTimeZone];
}

export { useTimeZone, TimeZoneProvider };
export default useTimeZone;
