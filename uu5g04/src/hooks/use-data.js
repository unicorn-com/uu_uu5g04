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
import { useEffect, useReducer, useMemo, useRef, useCallback, useLayoutEffect } from "./react-hooks";
import { initReducer, processBusReducer, combineReducers, performOperation } from "./internal/data-hooks-helper";

function applyLoad(data, callArgs, callResult, callError) {
  if (callError !== undefined) return data;
  return callResult !== undefined ? callResult : data;
}

function applyUpdate(data, callArgs, callResult, callError) {
  if (callError !== undefined) return data;
  return callResult !== undefined ? callResult : callArgs[0];
}

function applySetData(data, callArgs, callResult, callError) {
  return callArgs[0];
}

function dataHookReducer(state, action, nextReducer) {
  // this reducer doesn't really need to do anything => forward it to the next (processBusReducer)
  // which will enqueue/dequeue stuff onto processBus
  return nextReducer(state, action);
}

function useOperationsCleanup(dispatchAction, processBus, preserveOperations) {
  let explicitPendingCleanupRef = useRef([]);
  let clearOperations = useRef((...args) => {
    explicitPendingCleanupRef.current.push(args);
  }).current;

  let prevProcessBusRef = useRef();
  useEffect(() => {
    prevProcessBusRef.current = processBus;
  });

  // cleanup finished operations from processBus (this is done in nearest render somewhere after committing current render);
  // note that current processBus can have newly finished operations that we don't want to remove so we have to pass
  // ID of the operation upto which to do the cleanup
  if (prevProcessBusRef.current && (!preserveOperations || explicitPendingCleanupRef.current.length > 0)) {
    let prevProcessBus = prevProcessBusRef.current;
    prevProcessBusRef.current = undefined;
    let finishedOpIds = prevProcessBus.filter((op) => op.asyncData !== undefined).map((op) => op.id);
    let cleanupIds;
    if (preserveOperations) {
      cleanupIds = new Set();
      let finishedOpIdsSet = new Set(finishedOpIds);
      for (let cleanupArgs of explicitPendingCleanupRef.current) {
        if (cleanupArgs.length === 0 || cleanupArgs[0] == null) {
          cleanupIds = finishedOpIds;
          break;
        } else {
          let cleanupItems = Array.isArray(cleanupArgs[0]) ? cleanupArgs[0] : [cleanupArgs[0]];
          for (let item of cleanupItems) {
            let id = item ? item.id || item : null;
            if (id && finishedOpIdsSet.has(id)) cleanupIds.add(id);
          }
        }
      }
      if (!Array.isArray(cleanupIds)) cleanupIds = [...cleanupIds];
    } else {
      cleanupIds = finishedOpIds;
    }
    explicitPendingCleanupRef.current = [];
    if (cleanupIds.length > 0) {
      dispatchAction("clearOperations", { ids: cleanupIds });
    }
  }

  return clearOperations;
}

export function useDataInternal({ onLoad, onUpdate, dtoIn, data, preserveOperations }, customReducer) {
  // initialize state with processBus and state reducer(s)
  let reducer = useMemo(() => combineReducers(customReducer, dataHookReducer, initReducer, processBusReducer), [
    customReducer,
  ]);
  let needsInitialLoad = data === undefined && typeof onLoad === "function";
  let [state, dispatch] = useReducer(reducer, undefined, () =>
    reducer(undefined, {
      type: "init",
      payload: {
        asyncData: data === undefined ? null : data,
        viewState: needsInitialLoad ? "load" : "ready",
        errorState: null,
        error: null,
        processBus: [],
      },
    })
  );
  let dispatchAction = useCallback((type, payload) => dispatch({ type, payload }), [dispatch]);
  useLayoutEffect(() => {
    // run enqueued operations
    state.processBus.forEach((it) => {
      let { execFn } = it;
      if (execFn) {
        delete it.execFn;
        execFn();
      }
    });
  }, [state.processBus]);

  let syncData = useMemo(
    () =>
      state.processBus.reduce(
        (resultData, op) =>
          op.asyncData !== undefined
            ? op.asyncData
            : op.applyOpToDataFn(resultData, op.callArgs, op.result, op.error, op.extraInfo),
        state.asyncData
      ),
    [state.asyncData, state.processBus]
  );
  let operations = useMemo(
    () =>
      state.processBus.map((it) => ({
        ...it.extraInfo,
        id: it.id,
        type: it.type,
        args: it.callArgs,
        state: it.error !== undefined ? "error" : it.result !== undefined ? "success" : "pending",
        result: it.error !== undefined ? it.error : it.result !== undefined ? it.result : undefined,
      })),
    [state.processBus]
  );
  let clearOperations = useOperationsCleanup(dispatchAction, state.processBus, preserveOperations);

  let handleLoad = useCallback(
    (...callArgs) =>
      typeof onLoad === "function"
        ? performOperation(onLoad, callArgs, applyLoad, "load", dispatchAction)
        : Promise.resolve(null),
    [onLoad, dispatchAction]
  );
  let handleUpdate = useCallback(
    (...callArgs) => performOperation(onUpdate, callArgs, applyUpdate, "update", dispatchAction),
    [onUpdate, dispatchAction]
  );
  let setData = useCallback((...callArgs) => performOperation(null, callArgs, applySetData, "set", dispatchAction), [
    dispatchAction,
  ]);

  // didMount, didUpdate, willUnmount
  let dtoInHash;
  try {
    dtoInHash = JSON.stringify(dtoIn);
  } catch (e) {
    UU5.Common.Tools.error(
      "Invalid dtoIn used for use*Data hook. The value must be JSON-serializable (no functions, no cyclic values, ...).",
      e
    );
  }
  let mountRef = useRef(false);
  useEffect(() => {
    let skip = !mountRef.current && !needsInitialLoad; // skip if mounting and onLoad isn't function (we don't want to reset initialData)
    if (!skip) {
      handleLoad(dtoIn).catch((e) => {
        if (process.env.NODE_ENV !== "test") UU5.Common.Tools.error("Loading data failed:", e);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleLoad, dtoInHash, onLoad, needsInitialLoad]);
  useEffect(() => {
    mountRef.current = true;
  }, []);

  let api = useMemo(() => {
    let { processBus, lastFinishedOp, ...restState } = state;
    return { ...restState, syncData, operations, handleLoad, handleUpdate, setData, clearOperations };
  }, [state, syncData, operations, handleLoad, handleUpdate, setData, clearOperations]);

  return { api, dispatchAction };
}

export function useData({ onLoad, onUpdate, dtoIn, data, preserveOperations } = {}) {
  let { api } = useDataInternal({ onLoad, onUpdate, dtoIn, data, preserveOperations }, null);
  return api;
}

export default useData;
