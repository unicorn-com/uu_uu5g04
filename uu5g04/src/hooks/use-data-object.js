import UU5 from "uu5g04";
import { useState, useEffect, useRef } from "./react-hooks";
import { usePreviousValue } from "./internal/use-previous-value";

const PENDING = "pending",
  READY = "ready",
  ERROR = "error";
const PENDING_NO_DATA = "pendingNoData",
  READY_NO_DATA = "readyNoData",
  ERROR_NO_DATA = "errorNoData";
const SET_DATA_IDENTITY = data => data;

function useEffectOnMount(effectFn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effectFn, []);
}

function initHandler(operation, setFullState, currentValuesRef) {
  // !!! Do not read anything in this scope (besides "operation"), otherwise handlerMap values (see below)
  // will have stale values. Read anything in handlerFn.
  let handlerFn;
  if (operation === "setData") {
    handlerFn = newData => {
      let onCall = currentValuesRef.current.paramHandlerMap[operation];
      if (typeof onCall !== "function") onCall = SET_DATA_IDENTITY;
      let newTransformedData = onCall(newData);
      setFullState({
        state: newTransformedData != null ? READY : READY_NO_DATA,
        data: newTransformedData,
        errorData: null,
        pendingData: null
      });
    };
  } else {
    handlerFn = async (dtoIn, opts, ...restArgs) => {
      const onCall = currentValuesRef.current.paramHandlerMap[operation];
      let callPreconditionsResolve;
      let callPreconditionsReject;
      let callPreconditionsPromise = new Promise((resolve, reject) => {
        callPreconditionsResolve = resolve;
        callPreconditionsReject = reject;
      });

      setFullState(fullState => {
        let result = fullState;
        let newPartialState = {
          state: fullState.data != null ? PENDING : PENDING_NO_DATA,
          pendingData: { operation, dtoIn }
        };
        // don't re-render if fullState is already same as target (happens for initial load because the state already is set to "pending" with the same parameters)
        if (
          fullState.state !== newPartialState.state ||
          !fullState.pendingData ||
          Object.keys(newPartialState.pendingData).some(
            k => newPartialState.pendingData[k] !== fullState.pendingData[k]
          )
        ) {
          // if re-rendering (is not initial load) then check that the operation is allowed
          if (fullState.state === PENDING || fullState.state === PENDING_NO_DATA) {
            let callPreconditionsError = new Error(
              `Operation '${operation}' is not allowed when in '${PENDING}' or '${PENDING_NO_DATA}' state.`
            );
            callPreconditionsReject(callPreconditionsError);
            result = {
              ...fullState,
              pendingData: {
                ...fullState.pendingData,
                error: callPreconditionsError
              }
            };
          } else {
            callPreconditionsResolve();
            result = { ...fullState, ...newPartialState };
          }
        } else {
          callPreconditionsResolve();
        }
        return result;
      });

      // setFullState() above can be batched by React, i.e. it might not have been performed yet
      // => wait until it gets processed
      await callPreconditionsPromise;

      let data;
      try {
        data = typeof onCall === "function" ? await onCall(dtoIn, opts, ...restArgs) : null;
      } catch (error) {
        if (currentValuesRef.current.rendered) {
          setFullState(fullState => ({
            ...fullState,
            state: fullState.data != null ? ERROR : ERROR_NO_DATA,
            pendingData: null,
            errorData: { operation, dtoIn, error }
          }));
        }
        throw error;
      }
      if (currentValuesRef.current.rendered) {
        // treat data containing { uuAppErrorMap: {} } as if it was null (e.g. delete was successful)
        if (data && typeof data === "object" && Object.keys(data).length === 1) {
          let { uuAppErrorMap } = data;
          if (
            uuAppErrorMap &&
            typeof uuAppErrorMap === "object" &&
            Object.keys(uuAppErrorMap).every(k => (uuAppErrorMap[k] || {}).type !== "error")
          ) {
            data = null;
          }
        }
        setFullState({ state: data != null ? READY : READY_NO_DATA, data, pendingData: null, errorData: null });
      }
      return data;
    };
  }
  return handlerFn;
}

export function useDataObject({ initialData, initialDtoIn, handlerMap: paramHandlerMap = {} } = {}) {
  let [fullState, setFullState] = useState(() => ({
    state:
      initialData !== undefined
        ? initialData != null
          ? READY
          : READY_NO_DATA
        : typeof paramHandlerMap.load === "function"
        ? PENDING_NO_DATA
        : READY_NO_DATA,
    data: initialData !== undefined ? initialData : null,
    errorData: null,
    pendingData:
      initialData !== undefined
        ? null
        : typeof paramHandlerMap.load === "function"
        ? { operation: "load", dtoIn: initialDtoIn }
        : null
  }));

  let currentValuesRef = useRef({ rendered: true });
  currentValuesRef.current = { ...currentValuesRef.current, paramHandlerMap };
  useEffect(() => () => (currentValuesRef.current.rendered = false), []);

  // NOTE The requirement is to change values in handlerMap as infrequently as possible. Therefore
  // initHandler(name, ...) is called only if there was no handler in "paramHandlerMap[name]" before
  // and the resulting fn will take paramHandlerMap[name] at the time of its execution, not during initHandler() call.
  // Thanks to that we can reuse the same resulting fn even if paramHandlerMap[name] changes between re-renders.
  let handlerMap = {};
  let prevHandlerMap = usePreviousValue(handlerMap, {});
  for (let k in paramHandlerMap) {
    handlerMap[k] = prevHandlerMap[k] || initHandler(k, setFullState, currentValuesRef);
  }
  if (!handlerMap.setData) {
    handlerMap.setData = prevHandlerMap["setData"] || initHandler("setData", setFullState, currentValuesRef);
  }

  useEffectOnMount(() => {
    if (initialData === undefined && typeof paramHandlerMap.load === "function") {
      handlerMap.load(initialDtoIn).catch(e => UU5.Common.Tools.error("Loading data failed:", e));
    }
  });

  const result = {
    ...fullState,
    handlerMap
  };
  return result;
}

export default useDataObject;
