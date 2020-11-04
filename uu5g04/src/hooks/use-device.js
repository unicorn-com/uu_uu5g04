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

import UU5 from "uu5g04";
import { useState, useLayoutEffect, useRef, useMemo } from "./react-hooks";
import { createComponent } from "./component";
import { createContext } from "./context";
import { usePreviousValue } from "./use-previous-value";

const [DeviceContext, useDeviceContext] = createContext(null);

let constantValues;
function getConstantValues() {
  if (!constantValues) {
    let { userAgent, maxTouchPoints, webdriver } = navigator;

    let platform;
    if (/android/i.test(userAgent)) platform = "android";
    else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) platform = "ios";
    else if (/Mac/.test(navigator.platform)) platform = "mac";
    else if (/win/i.test(navigator.platform)) platform = "windows";
    else if (/linux/i.test(navigator.platform)) platform = "linux";
    else platform = "";

    let browserName;
    if (userAgent.match(/MSIE|Trident/)) browserName = "ie";
    else if (userAgent.match(/Edge/)) browserName = "edge";
    else if (userAgent.match(/Chrome/)) browserName = "chrome";
    else if (userAgent.match(/Safari/)) browserName = "safari";
    else if (userAgent.match(/Mozilla/)) browserName = "firefox";
    else browserName = "";

    let result = {
      browserName,
      platform,
      hasTouch: maxTouchPoints > 0 || "ontouchstart" in window,
      hasPointer: typeof matchMedia !== "undefined" ? matchMedia("(pointer: fine)").matches : true, // touch is considered "(pointer: coarse)"
      // isWebView: false, // TODO Add when uuMobile apps start giving us the info.
      isHeadless: !!webdriver,
    };
    if (process.env.NODE_ENV === "test") return result; // don't store locally
    constantValues = result;
  }
  return constantValues;
}

const DeviceProvider = createComponent({
  //@@viewOn:statics
  displayName: "UU5.Hooks.DeviceProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    browserName: UU5.PropTypes.string,
    platform: UU5.PropTypes.string,
    hasTouch: UU5.PropTypes.bool,
    hasPointer: UU5.PropTypes.bool,
    orientation: UU5.PropTypes.oneOf([
      "portrait-primary",
      "portrait-secondary",
      "landscape-primary",
      "landscape-secondary",
    ]),
    isWebView: UU5.PropTypes.bool,
    isHeadless: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    browserName: undefined,
    platform: undefined,
    hasTouch: undefined,
    hasPointer: undefined,
    orientation: undefined,
    isWebView: undefined,
    isHeadless: undefined,
  },
  //@@viewOff:defaultProps

  render({ browserName, platform, hasTouch, hasPointer, orientation, isWebView, isHeadless, children }) {
    //@@viewOn:hooks
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    const value = useMemo(() => {
      let constantValues = getConstantValues();
      let result = { browserName, platform, hasTouch, hasPointer, orientation, isWebView, isHeadless };
      for (let k in result) {
        if (result[k] === undefined) result[k] = constantValues[k];
      }
      return result;
    }, [browserName, hasPointer, hasTouch, isHeadless, isWebView, orientation, platform]);
    //@@viewOff:private

    //@@viewOn:render
    return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
    //@@viewOff:render
  },
});

const INITIAL = {};
function useLazyProperty(obj, propName, accessor) {
  let firstAccessorRef = useRef(accessor);
  if (firstAccessorRef.current !== accessor) {
    throw new Error("Invalid usage of useLazyProperty hook - 'accessor' cannot be changed.");
  }
  let firstPropNameRef = useRef(propName);
  if (firstPropNameRef.current !== propName) {
    throw new Error("Invalid usage of useLazyProperty hook - 'propName' cannot be changed.");
  }

  let directValue = obj[propName];
  let [storedValue, setStoredValue] = useState(INITIAL);

  let accessedRef = useRef(false);
  let accessed = accessedRef.current;
  let prevAccessed = usePreviousValue(accessed);
  if (accessed) {
    if (storedValue === INITIAL && (!prevAccessed || directValue === undefined)) {
      setStoredValue(accessor.getImmediateValue());
    }
  }
  useLayoutEffect(() => {
    if (accessedRef.current) {
      let stopTrackingFn = accessor.startTracking((newValue) => setStoredValue(newValue));
      if (!stopTrackingFn) {
        throw new Error("Invalid usage of useLazyProperty hook. 'startTracking' function must return stopTracking fn.");
      }
      return stopTrackingFn;
    }
  });

  let immediateValueRef = useRef();
  let result = useMemo(() => {
    let directValue = obj[propName];

    let result;
    // NOTE If has directValue && !accessed then we still need to defineProperty so that we start tracking
    // the value if it gets accessed (and later directValue might disappear).
    if (accessed && directValue !== undefined) {
      result = obj;
    } else if (accessed) {
      result = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
      result[propName] = storedValue;
    } else {
      result = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
      delete result[propName];
      Object.defineProperty(result, propName, {
        get() {
          if (!accessedRef.current) {
            immediateValueRef.current = directValue !== undefined ? directValue : accessor.getImmediateValue();
          }
          accessedRef.current = true;
          return immediateValueRef.current;
        },
      });
    }
    return result;
  }, [accessed, accessor, obj, propName, storedValue]);
  return result;
}

const orientationAccessor = {
  getImmediateValue() {
    let type = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
    if (typeof type !== "string") type = undefined;
    if (!type && window.matchMedia) {
      type = matchMedia("(orientation: portrait)").matches ? "portrait-primary" : "landscape-primary";
    } else if (!type) {
      type = screen.availHeight < screen.availWidth ? "landscape-primary" : "portrait-primary";
    }
    return type;
  },
  startTracking(onChange) {
    let listenerFn = (value) => onChange(value || orientationAccessor.getImmediateValue());
    UU5.Utils.EventManager.register("orientation", listenerFn);
    return () => UU5.Utils.EventManager.unregister("orientation", listenerFn);
  },
};
if ("onorientationchange" in window) {
  window.addEventListener("orientationchange", () => UU5.Utils.EventManager.trigger("orientation"));
} else if (window.matchMedia) {
  matchMedia("(orientation: portrait)").addListener((e) =>
    UU5.Utils.EventManager.trigger("orientation", e && e.matches ? "portrait-primary" : "landscape-primary")
  );
} else {
  window.addEventListener("resize", (e) => UU5.Utils.EventManager.trigger("orientation"));
}

function useDevice() {
  let contextValue = useDeviceContext();
  let value = contextValue || getConstantValues();
  let result = useLazyProperty(value, "orientation", orientationAccessor);
  return result;
}

export { useDevice, DeviceProvider };
export default useDevice;
