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
import { useEffect, useReducer, useMemo, useRef } from "./react-hooks";

function callReducer(state, [type, payload]) {
  let result = state;
  switch (type) {
    case "callStart": {
      result = { id: payload.id, viewState: "call", data: state.data, error: state.error };
      break;
    }
    case "callEnd": {
      let { id, success, data } = payload;
      if (id === state.id) {
        if (success) result = { id, viewState: "ready", data: data === undefined ? null : data, error: null };
        else result = { id, viewState: "error", data: null, error: data === undefined ? null : data };
      }
      break;
    }
  }
  return result;
}

const INIT_VALUE = { viewState: "ready", error: undefined, data: undefined };

export function useCall(callFn) {
  // initialize state with processBus and state reducer(s)
  let [state, dispatchAction] = useReducer(callReducer, INIT_VALUE);
  let unmountedRef = useRef();
  useEffect(() => () => (unmountedRef.current = true), []);

  let currentValuesRef = useRef();
  currentValuesRef.current = { callFn };
  let call = useRef(async (...callArgs) => {
    let { callFn } = currentValuesRef.current;

    let result = null;
    if (typeof callFn === "function") {
      let id = "c" + useCall._idCounter++;
      dispatchAction(["callStart", { id }]);
      let data, success;
      try {
        data = await callFn(...callArgs);
        success = true;
      } catch (e) {
        data = e;
      }
      if (!unmountedRef.current) dispatchAction(["callEnd", { id, success, data }]);
      result = success ? data : Promise.reject(data);
    }
    return result;
  }).current;

  let { viewState, data, error } = state;
  let api = useMemo(() => ({ call, viewState, data, error }), [call, viewState, data, error]);

  return api;
}
useCall._idCounter = 0;

export default useCall;
