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
import { useMemo, useRef } from "uu5g05";
import { useDataInternal } from "./use-data";
import { combineReducers, performOperation } from "./internal/data-hooks-helper";

function applyCreate(data, callArgs, callResult, callError, opExtraInfo) {
  let touchedItems; // items that were somehow processed during the operation
  let newItems = callArgs[0];
  if (!Array.isArray(newItems)) newItems = newItems ? [newItems] : [];

  let result;
  if (callError !== undefined && _isRollbackError(callError)) {
    result = data;
    touchedItems = newItems;
  } else {
    if (callError !== undefined) {
      let callErrorItems = Array.isArray(callError) ? callError : callError != null ? [callError] : [];
      touchedItems = newItems.map((it, i) => (callErrorItems[i] != null ? { ...it, ...callErrorItems[i] } : it));
      newItems = touchedItems.map((it, i) => (callErrorItems[i] != null ? it : null)).filter(Boolean);
    } else if (callResult !== undefined) {
      let callResultItems = Array.isArray(callResult) ? callResult : callResult != null ? [callResult] : [];
      touchedItems = newItems.map((it, i) => (callResultItems[i] != null ? { ...it, ...callResultItems[i] } : it));
      newItems = touchedItems;
    } else {
      touchedItems = newItems;
    }
    result = [...data, ...newItems];
  }
  opExtraInfo.items = touchedItems;

  return result;
}

function applyUpdate(data, callArgs, callResult, callError, opExtraInfo) {
  let touchedItems;
  let hasIdMatchers =
    (!Array.isArray(callArgs[0]) && typeof callArgs[0] === "object") ||
    (Array.isArray(callArgs[0]) && typeof callArgs[0][0] === "object")
      ? false
      : true;
  let updatedItems = hasIdMatchers ? callArgs[1] : callArgs[0];
  if (!Array.isArray(updatedItems)) updatedItems = updatedItems ? [updatedItems] : [];
  let idMatchers = hasIdMatchers ? callArgs[0] : updatedItems.map((it) => it && it.id);

  let result;
  if (callError !== undefined && _isRollbackError(callError)) {
    result = data;
    touchedItems = _mergeItems(data, updatedItems, idMatchers).touchedItems; // report
  } else {
    let toMerge;
    if (callError !== undefined) {
      let callErrorItems = Array.isArray(callError) ? callError : callError != null ? [callError] : [];
      toMerge = updatedItems.map((it, i) => (callErrorItems[i] != null ? { ...it, ...callErrorItems[i] } : null));
    } else if (callResult !== undefined) {
      let callResultItems = Array.isArray(callResult) ? callResult : callResult != null ? [callResult] : [];
      toMerge = updatedItems.map((it, i) => (callResultItems[i] != null ? { ...it, ...callResultItems[i] } : it));
    } else {
      toMerge = updatedItems;
    }
    let mergeResult = _mergeItems(data, toMerge, idMatchers);
    result = mergeResult.data;
    touchedItems = mergeResult.touchedItems.map((it, i) => (toMerge[i] == null ? { ...it, ...updatedItems[i] } : it));
  }
  opExtraInfo.items = touchedItems;

  return result;
}

function applyDelete(data, callArgs, callResult, callError, opExtraInfo) {
  let touchedItems;
  let deleteItems = callArgs[0];
  if (!Array.isArray(deleteItems)) deleteItems = deleteItems ? [deleteItems] : [];

  let result;
  if (callError !== undefined && _isRollbackError(callError)) {
    result = data;
    touchedItems = deleteItems.map((it) => {
      let index = _findItemIndex(it, result);
      return index !== -1 ? result[index] : null;
    });
  } else {
    // recognize callResult containing { uuAppErrorMap: {} } as if it was null (i.e. delete was successful)
    if (callResult && typeof callResult === "object" && Object.keys(callResult).length === 1) {
      let { uuAppErrorMap } = callResult;
      if (
        uuAppErrorMap &&
        typeof uuAppErrorMap === "object" &&
        Object.keys(uuAppErrorMap).every((k) => (uuAppErrorMap[k] || {}).type !== "error")
      ) {
        callResult = null;
      }
    }

    let callErrorItems = Array.isArray(callError) ? callError : callError != null ? [callError] : [];
    let callResultItems = Array.isArray(callResult) ? callResult : callResult != null ? [callResult] : [];
    result = [...data];
    touchedItems = [];
    for (let i = 0; i < deleteItems.length; i++) {
      let item = deleteItems[i];
      let index = _findItemIndex(item, result);
      if (index !== -1) {
        if (callError !== undefined) {
          if (callErrorItems[i] != null) {
            result[index] = { ...result[index], ...callErrorItems[i] };
            touchedItems.push(result[index]);
          } else {
            let removed = result.splice(index, 1);
            touchedItems.push(removed[0]);
          }
        } else if (callResult !== undefined) {
          if (callResultItems[i] != null) {
            result[index] = { ...result[index], ...callResultItems[i] };
            touchedItems.push(result[index]);
          } else {
            let removed = result.splice(index, 1);
            touchedItems.push(removed[0]);
          }
        } else {
          let removed = result.splice(index, 1);
          touchedItems.push(removed[0]);
        }
      } else {
        touchedItems.push(null); // unmatchable item, report as null in operations[].items[] array
      }
    }
  }
  opExtraInfo.items = touchedItems;

  return result;
}

function _findItemIndex(item, data) {
  const findItem =
    typeof item === "function"
      ? item
      : typeof item === "object"
      ? (it) => it && it.id != null && it.id === item.id
      : (it) => it && it.id != null && it.id === item;
  return item != null ? data.findIndex(findItem) : -1;
}

function _mergeItems(targetList, sourceList, itemMatchers = null) {
  let touchedItems = [];
  let result = Array.isArray(targetList) ? [...targetList] : targetList ? [targetList] : [];
  let list = Array.isArray(sourceList) ? sourceList : sourceList ? [sourceList] : [];
  let itemMatchersList = Array.isArray(itemMatchers) ? itemMatchers : itemMatchers ? [itemMatchers] : [];
  for (let i = 0; i < list.length; i++) {
    let index = _findItemIndex(itemMatchersList[i] || list[i], result);
    if (index !== -1) result[index] = list[i] != null ? { ...result[index], ...list[i] } : result[index];
    touchedItems.push(index !== -1 ? result[index] : list[i]);
  }
  return { data: result, touchedItems };
}

function _isRollbackError(error) {
  return error instanceof Error || (error && "status" in error && typeof error.headers === "function");
}

function listDataHookReducer(state, action, nextReducer) {
  let result;
  let { type, payload } = action;
  switch (type) {
    case "updateStart": {
      // override "applyOpToDataFn" to do item merging instead of replacing whole data
      action.payload.applyOpToDataFn = applyUpdate;
      result = nextReducer(state, action);
      break;
    }
    case "loadDone": {
      result = nextReducer(state, action);
      if (
        process.env.NODE_ENV === "development" &&
        payload.data &&
        Array.isArray(payload.data.itemList) &&
        result &&
        !Array.isArray(result.asyncData)
      ) {
        UU5.Common.Tools.warning(
          "useListData hook received object (with 'itemList' field) as the result of onLoad call which isn't supported. The result must be an array or you can use usePagingListData hook instead."
        );
      }
      break;
    }
    default:
      result = nextReducer(state, action);
      if (result === state) return state; // no re-render needed
  }

  return result;
}

export function useListDataInternal({ onLoad, onCreate, onUpdate, onDelete, dtoIn, data } = {}, customReducer) {
  let reducer = useMemo(() => combineReducers(customReducer, listDataHookReducer), [customReducer]);
  let { api: dataHookApi, dispatchAction } = useDataInternal({ onLoad, onUpdate, dtoIn, data }, reducer);

  let currentValuesRef = useRef();
  currentValuesRef.current = { onCreate, onDelete };

  let api = useMemo(() => {
    // changing onCreate/onDelete should not do any re-renders (they will be used next time
    // handleCreate/handleDelete is called, but not sooner) => pass them around using ref
    let { onCreate, onDelete } = currentValuesRef.current;
    return {
      ...dataHookApi,
      handleCreate: (...callArgs) => performOperation(onCreate, callArgs, applyCreate, "create", dispatchAction),
      handleDelete: (...callArgs) => performOperation(onDelete, callArgs, applyDelete, "delete", dispatchAction),
    };
  }, [dataHookApi, dispatchAction]);

  return { api, dispatchAction };
}

export function useListData({ onLoad, onCreate, onUpdate, onDelete, dtoIn, data } = {}) {
  let { api } = useListDataInternal({ onLoad, onCreate, onUpdate, onDelete, dtoIn, data }, null);
  return api;
}
