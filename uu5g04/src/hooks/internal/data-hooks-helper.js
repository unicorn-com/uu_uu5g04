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

// each reducer that is combined will receive parameters "state, action, nextReducer"
// where calling nextReducer(state, action) will call the next reducer based on the order
// how the reducers were combined
export function combineReducers(...reducers) {
  let allReducersNonFlat = reducers.filter(Boolean).map(it => it.reducers || [it]);
  let allReducersFlat = [].concat(...allReducersNonFlat);
  let result = allReducersFlat.reduceRight(
    (next, reducer) =>
      function(state, action) {
        return reducer(state, action, next);
      },
    v => v
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
            data => {
              dispatchAction(type + "Done", { data, id });
              resolve(data);
            },
            error => {
              dispatchAction(type + "Fail", { error, id });
              reject(error);
            }
          )
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
  if (!type.match(/(Start|Done|Fail)$/)) {
    result = nextReducer(state, action);
  } else {
    if (type.endsWith("Start")) {
      // starting an operation puts it into the process bus
      let eventType = type.replace(/(Start|Done|Fail)$/, "");
      let { id, applyOpToDataFn, callArgs, execFn } = payload;
      let newOpItem = { id, type: eventType, applyOpToDataFn, execFn, callArgs, result: undefined, error: undefined };
      result = {
        ...state,
        processBus: [...state.processBus, newOpItem]
      };
    } else {
      // type ends with "Done" or "Fail" - finishing an operation updates its result/error
      // in the process bus, but it still remains there
      let { id, data, error } = payload;
      let opIndex = state.processBus.findIndex(it => it.id === id);
      if (opIndex === -1) {
        throw new Error(
          `Unexpected '${type}' operation in useData hook - such operation was not started, or it has been already processed.`
        );
      }
      let processBus = [...state.processBus];
      processBus[opIndex] = {
        ...processBus[opIndex],
        result: type.endsWith("Done") ? (data === undefined ? null : data) : undefined, // undefined <=> not applicable
        error: type.endsWith("Fail") ? (error === undefined ? null : error) : undefined // undefined <=> not applicable
      };
      result = {
        ...state,
        processBus
      };
    }

    // remove processed operations from the start of the process list
    while (result.processBus.length > 0) {
      let { error: opError, result: opResult, applyOpToDataFn, callArgs } = result.processBus[0];
      if (opResult === undefined && opError === undefined) break; // still in progress
      if (result === state) result = { ...state };
      result.lastFinishedOp = result.processBus[0];
      result.asyncData = applyOpToDataFn(result.asyncData, callArgs, opResult, opError);
      result.processBus.shift();
    }

    // compute viewState based on last finished operation or first pending operation
    let lastFinishedOp = result.lastFinishedOp;
    let pendingOp = result.processBus[0];
    if (lastFinishedOp || pendingOp) {
      if (result === state) result = { ...state };
      Object.assign(result, {
        viewState: pendingOp ? pendingOp.type : lastFinishedOp.error === undefined ? "ready" : "error",
        error: pendingOp ? null : lastFinishedOp.error === undefined ? null : lastFinishedOp.error,
        errorState: pendingOp ? null : lastFinishedOp.error === undefined ? null : lastFinishedOp.type
      });
    }
  }

  return result;
}

export function initReducer(state, action, nextReducer) {
  let { type, payload } = action;
  return type === "init" ? payload : nextReducer(state, action);
}
