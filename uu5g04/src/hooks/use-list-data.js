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
import { useMemo, useRef } from "./react-hooks";
import { useDataInternal } from "./use-data";
import { combineReducers, performOperation } from "./internal/data-hooks-helper";

function applyCreate(data, callArgs, callResult, callError) {
  if (callError !== undefined && callError instanceof Error) return data;

  let newItems = callArgs[0];
  if (!Array.isArray(newItems)) newItems = newItems ? [newItems] : [];
  if (callError !== undefined) {
    let callErrorItems = Array.isArray(callError) ? callError : callError != null ? [callError] : [];
    newItems = newItems
      .map((it, i) => (callErrorItems[i] != null ? { ...it, ...callErrorItems[i] } : null))
      .filter(Boolean);
  } else if (callResult !== undefined) {
    let callResultItems = Array.isArray(callResult) ? callResult : callResult != null ? [callResult] : [];
    newItems = newItems.map((it, i) => (callResultItems[i] != null ? { ...it, ...callResultItems[i] } : it));
  }
  return [...data, ...newItems];
}

function applyUpdate(data, callArgs, callResult, callError) {
  if (callError !== undefined && callError instanceof Error) return data;

  let updatedItems = callArgs[1];
  if (!Array.isArray(updatedItems)) updatedItems = updatedItems ? [updatedItems] : [];
  if (callError !== undefined) {
    let callErrorItems = Array.isArray(callError) ? callError : callError != null ? [callError] : [];
    updatedItems = updatedItems.map((it, i) => (callErrorItems[i] != null ? { ...it, ...callErrorItems[i] } : null));
  } else if (callResult !== undefined) {
    let callResultItems = Array.isArray(callResult) ? callResult : callResult != null ? [callResult] : [];
    updatedItems = updatedItems.map((it, i) => (callResultItems[i] != null ? { ...it, ...callResultItems[i] } : it));
  }
  return _mergeItems(data, updatedItems, callArgs[0]);
}

function applyDelete(data, callArgs, callResult, callError) {
  if (callError !== undefined && callError instanceof Error) return data;

  let deleteItems = callArgs[0];
  if (!Array.isArray(deleteItems)) deleteItems = deleteItems ? [deleteItems] : [];
  let callErrorItems = Array.isArray(callError) ? callError : callError != null ? [callError] : [];
  let callResultItems = Array.isArray(callResult) ? callResult : callResult != null ? [callResult] : [];
  let result = [...data];
  for (let i = 0; i < deleteItems.length; i++) {
    let item = deleteItems[i];
    let index = _findItemIndex(item, result);
    if (index !== -1) {
      if (callError !== undefined) {
        if (callErrorItems[i] != null) result[index] = { ...result[index], ...callErrorItems[i] };
        else result.splice(index, 1);
      } else if (callResult !== undefined) {
        if (callResultItems[i] != null) result[index] = { ...result[index], ...callResultItems[i] };
        else result.splice(index, 1);
      } else {
        result.splice(index, 1);
      }
    }
  }

  return result;
}

function _findItemIndex(item, data) {
  const findItem =
    typeof item === "function"
      ? item
      : typeof item === "object"
      ? it => it && it.id != null && it.id === item.id
      : it => it && it.id != null && it.id === item;
  return item != null ? data.findIndex(findItem) : -1;
}

function _mergeItems(targetList, sourceList, itemMatchers = null) {
  let result = Array.isArray(targetList) ? [...targetList] : targetList ? [targetList] : [];
  let list = Array.isArray(sourceList) ? sourceList : sourceList ? [sourceList] : [];
  let itemMatchersList = Array.isArray(itemMatchers) ? itemMatchers : itemMatchers ? [itemMatchers] : [];
  for (let i = 0; i < list.length; i++) {
    let index = _findItemIndex(itemMatchersList[i] || list[i], result);
    if (index !== -1) result[index] = list[i] != null ? { ...result[index], ...list[i] } : result[index];
  }
  return result;
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
      handleDelete: (...callArgs) => performOperation(onDelete, callArgs, applyDelete, "delete", dispatchAction)
    };
  }, [dataHookApi, dispatchAction]);

  return { api, dispatchAction };
}

export function useListData({ onLoad, onCreate, onUpdate, onDelete, dtoIn, data } = {}) {
  let { api } = useListDataInternal({ onLoad, onCreate, onUpdate, onDelete, dtoIn, data }, null);
  return api;
}
