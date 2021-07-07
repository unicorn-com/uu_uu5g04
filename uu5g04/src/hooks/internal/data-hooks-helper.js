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
import UU5 from "uu5g04";

// each reducer that is combined will receive parameters "state, action, nextReducer"
// where calling nextReducer(state, action) will call the next reducer based on the order
// how the reducers were combined
export function combineReducers(...reducers) {
  let allReducersNonFlat = reducers.filter(Boolean).map((it) => it.reducers || [it]);
  let allReducersFlat = [].concat(...allReducersNonFlat);
  let result = allReducersFlat.reduceRight(
    (next, reducer) =>
      function (state, action) {
        return reducer(state, action, next);
      },
    (v) => v
  );
  result.reducers = allReducersFlat;
  return result;
}

export function performOperation(call, callArgs, applyOpToDataFn, type, dispatchAction) {
  return new Promise((resolve, reject) => {
    const id = UU5.Common.Tools.generateUUID();
    if (typeof call === "function") {
      dispatchAction(type + "Start", {
        id,
        callArgs,
        applyOpToDataFn,
        execFn: () =>
          call(...callArgs).then(
            (data) => {
              dispatchAction(type + "Done", { data, id });
              resolve(data);
            },
            (error) => {
              dispatchAction(type + "Fail", { error, id });
              reject(error);
            }
          ),
      });
    } else {
      // perform the operation locally
      // TODO Optimize - use single update (maybe call dispatchAction with an array).
      dispatchAction(type + "Start", { id, callArgs, applyOpToDataFn });
      dispatchAction(type + "Done", { data: null, id });
      resolve(null);
    }
  });
}

/**
 * Reducer enqueues/dequeues operations onto/from processBus list. Also computes viewState, errorState, error
 * based on first pending operation in processBus (or based on last finished operation if processBus is empty).
 */
export function processBusReducer(state, action, nextReducer) {
  let { type, payload } = action;

  let result;
  if (type === "clearOperations") {
    let updatedState;
    let { ids } = payload || {};
    let cleanupIdsSet = new Set(ids);
    let newProcessBus = state.processBus.filter((op) => !cleanupIdsSet.has(op.id));
    if (newProcessBus.length !== state.processBus.length) {
      updatedState = {
        ...state,
        processBus: newProcessBus,
      };
    }
    result = nextReducer(updatedState || state, action);
  } else if (!type.match(/(Start|Done|Fail)$/)) {
    result = nextReducer(state, action);
  } else {
    if (type.endsWith("Start")) {
      // starting an operation puts it into the process bus
      let eventType = type.replace(/(Start|Done|Fail)$/, "");
      let { id, applyOpToDataFn, callArgs, execFn } = payload;
      let newOpItem = {
        id,
        type: eventType,
        applyOpToDataFn,
        execFn,
        callArgs,
        result: undefined,
        error: undefined,
        extraInfo: {},
      };
      result = {
        ...state,
        processBus: [...state.processBus, newOpItem],
      };
    } else {
      // type ends with "Done" or "Fail" - finishing an operation updates its result/error
      // in the process bus, but it still remains there
      let { id, data, error } = payload;
      let opIndex = state.processBus.findIndex((it) => it.id === id);
      if (opIndex === -1) {
        throw new Error(
          `Unexpected '${type}' operation in useData hook - such operation was not started, or it has been already processed.`
        );
      }
      let processBus = [...state.processBus];
      processBus[opIndex] = {
        ...processBus[opIndex],
        result: type.endsWith("Done") ? (data === undefined ? null : data) : undefined, // undefined <=> not applicable
        error: type.endsWith("Fail") ? (error === undefined ? null : error) : undefined, // undefined <=> not applicable
      };
      result = {
        ...state,
        processBus,
      };
    }

    // update asyncData & lastFinishedOp info - process all finished (but not-yet-processed) operations upto 1st non-finished
    let i;
    for (i = 0; i < result.processBus.length; i++) {
      let op = result.processBus[i];
      let { error: opError, result: opResult, applyOpToDataFn, callArgs } = op;
      if (opResult === undefined && opError === undefined) break; // still in progress
      if (op.asyncData !== undefined) continue; // finished but already processed

      if (result === state) result = { ...state };
      if (result.processBus === state.processBus) result.processBus = [...state.processBus];
      let extraInfo = {}; // extra information, typically the applyOpToDataFn can fill in "items" (final items that the operation was related to)
      result.asyncData = applyOpToDataFn(result.asyncData, callArgs, opResult, opError, extraInfo);
      result.processBus[i] = { ...op, asyncData: result.asyncData, extraInfo };
      result.lastFinishedOp = result.processBus[i];
    }

    // compute viewState based on last finished operation or first pending operation
    let lastFinishedOp = result.lastFinishedOp;
    let pendingOp = result.processBus[i];
    if (lastFinishedOp || pendingOp) {
      if (result === state) result = { ...state };
      Object.assign(result, {
        viewState: pendingOp ? pendingOp.type : lastFinishedOp.error === undefined ? "ready" : "error",
        error: pendingOp ? null : lastFinishedOp.error === undefined ? null : lastFinishedOp.error,
        errorState: pendingOp ? null : lastFinishedOp.error === undefined ? null : lastFinishedOp.type,
      });
    }
  }

  return result;
}

export function initReducer(state, action, nextReducer) {
  let { type, payload } = action;
  return type === "init" ? payload : nextReducer(state, action);
}
