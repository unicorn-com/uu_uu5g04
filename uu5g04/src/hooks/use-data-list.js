import UU5 from "uu5g04";
import memoizeOne from "memoize-one";
import { useState, useMemo, useReducer, useEffect, useLayoutEffect, useRef } from "./react-hooks";
import { usePreviousValue } from "./internal/use-previous-value";

// handlerMap key => data transformation function
const OP_TYPE_LIST = "LIST";
const OP_TYPE_ITEM = "ITEM";
const OP_TYPE_PREFIX = { [OP_TYPE_LIST]: "list.", [OP_TYPE_ITEM]: "item." };
const TRANSFORM_MAP = {
  "list.load": transformListLoad,
  "list.loadNext": transformListLoadNext,
  "list.createItem": transformListCreateItem,
  "list.setData": transformListSetData,
  "item.load": transformItemLoad,
  "item.update": transformItemUpdate,
  "item.delete": transformItemDelete,
};
const FIRST_LOAD_FLAG = {};

function useEffectOnMount(effectFn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => effectFn(), []);
}

function initHandler(operation, operationType, dispatchAction, currentValuesRef, onBeforeCall = null) {
  // !!! Do not read anything in this scope (besides "operation"), otherwise paramHandlerMap values
  // will have stale values. Read anything in handlerFn.
  let handlerFn = (...callArgs) => {
    let { paramHandlerMap, paramItemHandlerMap, itemKey } = currentValuesRef.current;

    let isFirstLoad = callArgs[0] === FIRST_LOAD_FLAG;
    if (isFirstLoad) callArgs = callArgs.slice(1);

    let usedHandlerMap = operationType === OP_TYPE_LIST ? paramHandlerMap : paramItemHandlerMap;
    let onCall = usedHandlerMap[operation];
    if (onCall == null && operation === "loadNext" && operationType === OP_TYPE_LIST) {
      onCall = usedHandlerMap["load"];
    }

    let context = {}; // context (arbitrary values) shared between Start and End action
    let actionPrefix = OP_TYPE_PREFIX[operationType] + operation;
    return new Promise((resolve, reject) => {
      let execFn = () =>
        (async () => {
          let data;
          let error;
          try {
            if (onBeforeCall) {
              let onCall0 = onCall;
              onCall = (...args) => onBeforeCall(onCall0, ...args);
            }
            let dataPromise = typeof onCall === "function" ? onCall(...callArgs) : undefined;
            if (dataPromise instanceof Promise) data = await dataPromise;
            else data = dataPromise; // don't await if data got returned synchronously (so that operation end gets processed in the same React batch as operation start)
          } catch (e) {
            error = e;
          }
          if (currentValuesRef.current.rendered) {
            let transformDataFn = TRANSFORM_MAP[actionPrefix];
            if (!transformDataFn) {
              // custom operations (handlers) on list behave like item/multi-item create/update/delete, on item like "item.update()"
              transformDataFn = operationType === OP_TYPE_LIST ? transformListCustomOp : transformItemUpdate;
            }
            dispatchAction([
              actionPrefix + "End",
              { operation, callArgs, data, error, transformDataFn, itemKey, context },
            ]);
          }
          if (error) throw error;
          return data;
        })().then(resolve, reject);
      execFn.resolve = resolve;
      execFn.reject = reject;

      if (isFirstLoad) {
        // first load is optimized to not do extra re-render, i.e. the state is already as if the load started and is pending
        // and therefore we just really need to do the call
        execFn();
      } else {
        // start the operation (the check whether it is allowed to run is performed when starting as it requires
        // the most up-to-date state; e.g. calling list.load() and right away item.update() must prevent the item.update()
        // + remember that dispatching action might get batched by React)
        // =>
        // 1. The check requires current state, i.e. it must be performed inside of state reducer (we'll do it in *Start action).
        // 2. The operation (call) can continue only if the check succeeded - this is handled by adding "execFn"
        //    to the state.runnableList (in *Start actions) and then running it in useDataList effect hook.
        dispatchAction([
          actionPrefix + "Start",
          { operation, callArgs, itemKey, context, execFn: isFirstLoad ? null : execFn },
        ]);
      }
    });
  };
  return handlerFn;
}

function transformListSetData(curDataList, callResult, callArgs) {
  return _normalizeDataToList(callResult === undefined ? callArgs[0] : callResult, false, true);
}
function transformListLoad(curDataList, callResult, callArgs) {
  // overwrite existing data list
  return _normalizeDataToList(callResult);
}
function transformListLoadNext(curDataList, callResult, callArgs) {
  // merge received data into existing list
  let newPartialList = _normalizeDataToList(callResult, true);
  let pageInfo = callResult?.pageInfo || callArgs[0].pageInfo;
  return _mergeData(curDataList, newPartialList, pageInfo);
}
function transformListCustomOp(curDataList, callResult, callArgs, itemKey, relatedItemId) {
  // depending on callResult create/update/delete the item
  let result;
  let index = curDataList.findIndex(it => it && itemKey(it.data) === relatedItemId);
  if (callResult == null) {
    if (index > -1) {
      result = curDataList.slice(0, index);
      result = result.concat(curDataList.slice(index + 1));
    }
  } else {
    if (index > -1) {
      result = curDataList.slice(0, index);
      result.push(_createItem(callResult));
      result = result.concat(curDataList.slice(index + 1));
    } else {
      result = [...curDataList, _createItem(callResult)];
    }
  }
  return result || curDataList;
}
function transformListCreateItem(curDataList, callResult, callArgs, itemKey, relatedItemId) {
  return [...curDataList, _createItem(callResult)];
}

function transformItemUpdate(curDataList, callResult, callArgs, itemKey, relatedItemId) {
  let result = curDataList;
  let index = curDataList.findIndex(it => it && itemKey(it.data) === relatedItemId);
  if (index > -1) {
    result = curDataList.slice(0, index);
    // NOTE If changed (e.g. merging gets added) then fix transformItemLoad as it
    // assumes that no merging is done here.
    result.push(_createItem(callResult));
    result = result.concat(curDataList.slice(index + 1));
  }
  return result;
}
function transformItemDelete(curDataList, callResult, callArgs, itemKey, relatedItemId) {
  let result = curDataList;
  let index = curDataList.findIndex(it => it && itemKey(it.data) === relatedItemId);
  if (index > -1) {
    result = curDataList.slice(0, index);
    result = result.concat(curDataList.slice(index + 1));
  }
  return result;
}
function transformItemLoad(curDataList, callResult, callArgs, itemKey, relatedItemId) {
  return transformItemUpdate(curDataList, callResult, callArgs, itemKey, relatedItemId);
}

function stateReducer(state, [action, payload]) {
  let newState;
  let isCustomOpAction = action.match(/(Start|End)$/) && !TRANSFORM_MAP[action.replace(/(Start|End)$/, "")];
  let generalizedAction = action;
  if (isCustomOpAction) {
    // rename actions such as "list.myCustomLoadStart" to "list.<custom>Start"
    // (but preserve known ones such as "list.loadStart")
    generalizedAction = generalizedAction.replace(
      /^(.*\.)(.*?)(Start|End)$/,
      (m, prefix, op, suffix) => prefix + "<custom>" + suffix
    );
  }
  switch (generalizedAction) {
    case "init": {
      let { initialData, initialDtoIn, paramHandlerMap, skipInitialLoad } = payload;
      initialData = _normalizeDataToList(initialData);
      newState = {
        data: initialData !== undefined ? initialData : null,
        errorData: null,
        pendingData:
          initialData !== undefined || skipInitialLoad
            ? null
            : typeof paramHandlerMap.load === "function"
            ? { operation: "load", dtoIn: initialDtoIn }
            : null,
        runnableList: [],
        runningOperations:
          initialData !== undefined || skipInitialLoad
            ? []
            : typeof paramHandlerMap.load === "function"
            ? [{ operation: "load", callArgs: [initialDtoIn], initialLoad: true }]
            : [],
      };
      break;
    }

    case "list.loadStart":
    case "list.loadNextStart":
    case "list.setDataStart": {
      // there might be several "loadNext" operations running at the same time => remember all of them
      // so that we can properly update state from "pending" to "ready"/"error"
      let { operation, callArgs, execFn, context } = payload;
      let operationAllowed = !state.state.match(/^pending(NoData)?$/) || state.pendingData.operation !== "load";
      if (!operationAllowed) {
        let error = new Error(
          `Cannot perform '${operation}' - the list does not allow it (state '${state.state}'${
            state.pendingData ? `, pending operation '${state.pendingData.operation}'` : ""
          })`
        );
        newState = {
          ...state,
          pendingData: { ...state.pendingData, error },
          runnableList: state.runnableList.concat([{ execFn: () => execFn.reject(error) }]),
        };
      } else {
        // NOTE "state" and "pendingData" fields are computed at the end of the reducer from other fields
        // (because they need to have proper value even if handleXyzItem ends during loadNext).
        context.operationId = UU5.Common.Tools.generateUUID();
        newState = {
          ...state,
          runnableList: state.runnableList.concat([{ execFn }]),
          runningOperations: [...state.runningOperations, { id: context.operationId, operation, callArgs }],
        };
      }
      break;
    }

    case "list.loadEnd":
    case "list.loadNextEnd":
    case "list.setDataEnd": {
      let { error, data, callArgs, transformDataFn, context } = payload;
      // NOTE "state" and "pendingData" fields are computed at the end of the reducer from other fields
      // (because they need to have proper value even if handleXyzItem ends during loadNext).
      let { operationId } = context;
      newState = {
        ...state,
        errorData: error !== undefined ? { ...state.pendingData, error } : null,
        data: error !== undefined ? state.data : transformDataFn(state.data, data, callArgs),
        runningOperations: state.runningOperations.filter((op) => op.id !== operationId && !op.initialLoad), // 1st load doesn't have matching callArgs
      };
      break;
    }

    case "list.createItemStart":
    case "item.loadStart":
    case "item.updateStart":
    case "item.deleteStart":
    case "item.setDataStart":
    case "item.<custom>Start":
    case "list.<custom>Start": {
      let { operation, callArgs, itemKey, context, execFn } = payload;
      let dtoInItems = Array.isArray(callArgs[0]) ? callArgs[0] : callArgs[0] != null ? [callArgs[0]] : [];
      let itemsWithId = dtoInItems.map((data) => ({
        id: itemKey(data) ?? UU5.Common.Tools.generateUUID(),
        item: data,
      }));
      context.itemsWithId = itemsWithId;
      let newData = state.data;
      let itemOperation = operation === "createItem" ? "create" : operation;
      let operationAllowed = true;
      let operationAllowedCheckError;
      for (let { id, item } of itemsWithId) {
        if (!item) continue;
        let itemId = id;
        let dataItemIndex = newData ? newData.findIndex(it => it && itemKey(it.data) === itemId) : -1;
        let dataItem = dataItemIndex !== -1 ? newData[dataItemIndex] : undefined;
        let existingState = dataItem?.state;
        if (
          existingState === "pending" ||
          (state.state.match(/^pending(NoData)?$/) && state.pendingData.operation === "load")
        ) {
          let error = new Error(
            `Item with id '${itemId}' cannot perform '${itemOperation}' - either because its current state ('${existingState}') or the state of the whole list ('${
              state.state
            }'${
              state.pendingData ? `pending operation '${state.pendingData.operation}'` : ""
            }) does not allow it.\nExisting item: ${_looseStringify(dataItem)}`
          );
          if (newData === state.data) newData = state.data ? [...state.data] : [];
          newData[dataItemIndex] = {
            ...dataItem,
            pendingData: { ...dataItem.pendingData, error }
          };
          operationAllowed = false;
          operationAllowedCheckError = error;
        } else {
          if (dataItem == null) continue; // item doesn't exist in the data list => don't update any state (even if it is "create" operation)

          if (newData === state.data) newData = state.data ? [...state.data] : [];
          newData[dataItemIndex] = {
            ...newData[dataItemIndex],
            state: "pending",
            pendingData: { operation: itemOperation, dtoIn: item }
          };
        }
      }
      context.operationId = UU5.Common.Tools.generateUUID();
      newState = {
        ...state,
        data: newData,
        runnableList: state.runnableList.concat([
          { execFn: operationAllowed ? execFn : () => execFn.reject(operationAllowedCheckError) },
        ]),
        runningOperations: operationAllowed
          ? [...state.runningOperations, { id: context.operationId, operation, callArgs }]
          : state.runningOperations,
      };
      break;
    }

    case "list.createItemEnd":
    case "item.loadEnd":
    case "item.updateEnd":
    case "item.deleteEnd":
    case "item.setDataEnd":
    case "item.<custom>End":
    case "list.<custom>End": {
      let { operation, callArgs, error, data, transformDataFn, itemKey, context } = payload;
      let itemsWithId = context.itemsWithId;
      let newData = state.data;
      let callResultItems;
      if (error !== undefined) {
        let errorDtoOut = error instanceof Error ? error.dtoOut : error;
        callResultItems = Array.isArray(errorDtoOut)
          ? errorDtoOut
          : Array.isArray(errorDtoOut?.itemList)
          ? errorDtoOut.itemList
          : null;
      } else {
        callResultItems = Array.isArray(data) ? data : [data];
      }
      if (process.env.NODE_ENV === "development" && callResultItems && callResultItems.length !== itemsWithId.length) {
        UU5.Common.Tools.warning(
          `Item operation '${operation}' ended with different item count (${callResultItems.length}) than it was called with (${itemsWithId.length}).`,
          { callResultItems, callItems: itemsWithId.map(it => it.item) }
        );
      }
      let i = 0;
      for (let { id, item } of itemsWithId) {
        let callResultItem = callResultItems?.[i++];
        if (!item) continue;
        let itemId = id;
        // treat results containing { uuAppErrorMap: {} } or {} as if it was null (e.g. delete was successful)
        if (callResultItem && typeof callResultItem === "object" && Object.keys(callResultItem).length <= 1) {
          if (callResultItem.uuAppErrorMap && Object.keys(callResultItem.uuAppErrorMap).length === 0) {
            callResultItem = null;
          } else if (Object.keys(callResultItem).length === 0) {
            callResultItem = null;
          }
        }
        let isItemSuccess =
          error === undefined ||
          (callResultItems &&
            ((operation.match(/delete/) && callResultItem == null) ||
              (!operation.match(/delete/) && callResultItem != null && !(callResultItem instanceof Error))));
        if (isItemSuccess) {
          newData = transformDataFn(newData, callResultItem, [item].concat(callArgs.slice(1)), itemKey, itemId);
        }
        let existingItemIndex = newData.findIndex((it) => it && itemKey(it.data) === itemId);
        if (existingItemIndex !== -1) {
          let existingItem = newData[existingItemIndex];
          if (newData === state.data) newData = [...state.data];
          newData[existingItemIndex] = {
            data: existingItem.data,
            state: isItemSuccess ? "ready" : "error",
            pendingData: null,
            errorData: isItemSuccess ? null : { ...existingItem.pendingData, error }
          };
        }
      }
      let { operationId } = context;
      newState = {
        ...state,
        data: newData,
        runningOperations: state.runningOperations.filter((op) => op.id !== operationId),
      };
      break;
    }

    default: {
      throw new Error(`Action '${action}' not supported for useData* hook.`);
    }
  }

  // compute fields "state", "pendingData", ... based on others
  if (newState && newState !== state) {
    let isLoadOperation = (it) => it.operation === "load" || it.operation === "loadNext" || it.operation === "setData";
    let loadOperations = newState.runningOperations.filter(isLoadOperation);
    newState.state =
      loadOperations.length > 0
        ? "pending"
        : newState.data?.some?.((it) => it?.state === "pending") ||
          loadOperations.length < newState.runningOperations.length
        ? "itemPending"
        : newState.errorData
        ? "error"
        : "ready";
    let lastLoadOperation = loadOperations[loadOperations.length - 1];
    newState.pendingData =
      newState.state === "pending"
        ? state?.runningOperations?.filter(isLoadOperation).pop() === lastLoadOperation
          ? state.pendingData // prefer same instance as before
          : { operation: lastLoadOperation.operation, dtoIn: lastLoadOperation.callArgs[0] }
        : null;
    if (!newState.data) newState.state += "NoData";
    newState.runnableList = newState.runnableList.filter(it => it.execFn);
  }
  return newState || state;
}

function _addPageSize(dtoIn, pageSize) {
  if (!dtoIn) dtoIn = {};
  if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
  if (typeof dtoIn.pageInfo.pageSize !== "number" || dtoIn.pageInfo.pageSize <= 0) dtoIn.pageInfo.pageSize = pageSize;
  return dtoIn;
}

function _normalizeDataToList(data, partialOnly = false, itemsAlreadyWrapped = false) {
  let result;
  if (data != null) {
    if (Array.isArray(data)) {
      let wrappedItemList = data.map(item => _createItem(item, itemsAlreadyWrapped));
      result = wrappedItemList;
    } else if (Array.isArray(data.itemList)) {
      let wrappedItemList = data.itemList.map(item => _createItem(item, itemsAlreadyWrapped));
      if (!partialOnly) result = _mergeData(null, wrappedItemList, data.pageInfo);
      else result = wrappedItemList;
    } else {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Invalid 'data' provided to useData* hook (either as initial data or from onXyz handler). Only array or { itemList: [], pageInfo: { pageIndex, pageSize, total } } object can be used.",
          data
        );
      }
      result = [];
    }
  }
  return result;
}

function _mergeData(curDataList, newPartialList, pageInfo) {
  let result = newPartialList || [];
  if (pageInfo) {
    let from = pageInfo.pageIndex * pageInfo.pageSize || 0;
    let to = from + (newPartialList ? newPartialList.length : 0);
    result = new Array(
      typeof pageInfo.total === "number" && pageInfo.total >= 0 ? pageInfo.total : Math.max(to, curDataList.length)
    ).fill(undefined);
    if (curDataList && curDataList.length > 0) for (let i = 0; i < from; i++) result[i] = curDataList[i];
    if (newPartialList) for (let i = 0, len = newPartialList.length; i < len; i++) result[from + i] = newPartialList[i];
    if (curDataList) for (let i = to, len = curDataList.length; i < len; i++) result[i] = curDataList[i];
  }
  return result;
}

function _looseStringify(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return obj && typeof obj.toString === "function" ? obj.toString() : obj + "";
  }
}

function _shallowEquals(a, b) {
  if (a == null || b == null || typeof a !== "object" || typeof b !== "object") return a === b;
  if (Object.keys(a).length !== Object.keys(b).length) return false;
  for (let k in a) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

function _createItem(data, dataAlreadyWrapped = false) {
  let result;
  let newItem = { data, state: "ready", errorData: null, pendingData: null };
  if (dataAlreadyWrapped) {
    if (data && Object.keys(newItem).every(k => k in data)) result = data;
    else result = Object.assign(newItem, data);
  } else {
    result = newItem;
  }
  return result;
}

function _getIdInObject(itemData, itemIdentifier) {
  let result = {};
  if (Array.isArray(itemIdentifier)) {
    itemIdentifier.forEach((idKey) => (result[idKey] = itemData?.[idKey]));
  } else {
    result[itemIdentifier] = itemData?.[itemIdentifier];
  }
  return result;
}

// per-item memoized fn for adding handlerMap to each item
function _computeItemWithHandlerMap(itemWithoutHandlerMap, itemIdentifier, itemHandlerMap) {
  let handlerMap = {};
  for (let k in itemHandlerMap) {
    handlerMap[k] = (arg0, ...restArgs) =>
      itemHandlerMap[k]({ ...arg0, ..._getIdInObject(itemWithoutHandlerMap.data, itemIdentifier) }, ...restArgs);
  }

  return { ...itemWithoutHandlerMap, handlerMap };
}

export function useDataList({
  initialData,
  initialDtoIn,
  pageSize,
  itemIdentifier = "id",
  handlerMap: paramHandlerMap = {},
  itemHandlerMap: paramItemHandlerMap = {},
  skipInitialLoad
} = {}) {
  let currentValuesRef = useRef({ rendered: true });
  currentValuesRef.current = {
    ...currentValuesRef.current,
    pageSize,
    paramHandlerMap,
    paramItemHandlerMap,
    itemIdentifier,
    itemKey: Array.isArray(itemIdentifier)
      ? item =>
          itemIdentifier.some(idKey => item?.[idKey] == null)
            ? null
            : JSON.stringify(itemIdentifier.map(idKey => item[idKey]))
      : item => item?.[itemIdentifier]
  };
  useEffect(() => () => (currentValuesRef.current.rendered = false), []);

  [initialDtoIn] = useState(() => _addPageSize(initialDtoIn, pageSize)); // update initialDtoIn with pageSize
  let [fullState, dispatchAction] = useReducer(stateReducer, null, () =>
    stateReducer(null, ["init", { initialData, initialDtoIn, paramHandlerMap, skipInitialLoad }])
  );
  useLayoutEffect(() => {
    // run enqueued operations
    fullState.runnableList.forEach(it => {
      let { execFn } = it;
      if (execFn) {
        delete it.execFn;
        execFn();
      }
    });
  }, [fullState.runnableList]);

  // NOTE The requirement is to change values in handlerMap as infrequently as possible. Therefore
  // initHandler(name, ...) is called only if there was no handler in "paramHandlerMap[name]" before
  // and the resulting fn will take paramHandlerMap[name] at the time of its execution, not during initHandler() call.
  // Thanks to that we can reuse the same resulting fn even if paramHandlerMap[name] changes between re-renders.
  let handlerMap = {};
  let prevHandlerMap = usePreviousValue(handlerMap, {});
  let remainingKeys = new Set(["setData"].concat(Object.keys(paramHandlerMap)));
  for (let k of remainingKeys) handlerMap[k] = prevHandlerMap[k];
  if ("load" in paramHandlerMap && !handlerMap["load"]) {
    handlerMap["load"] = initHandler(
      "load",
      OP_TYPE_LIST,
      dispatchAction,
      currentValuesRef,
      (onCall, dtoIn, ...restArgs) => {
        let { pageSize } = currentValuesRef.current;
        dtoIn = _addPageSize(dtoIn, pageSize);
        return typeof onCall === "function" ? onCall(dtoIn, ...restArgs) : undefined;
      }
    );
    remainingKeys.delete("load");
  }
  currentValuesRef.current.data = fullState.data;
  if (("load" in paramHandlerMap || "loadNext" in paramHandlerMap) && !handlerMap["loadNext"]) {
    handlerMap["loadNext"] = initHandler(
      "loadNext",
      OP_TYPE_LIST,
      dispatchAction,
      currentValuesRef,
      (onCall, dtoIn, ...restArgs) => {
        let { pageSize, data, paramHandlerMap } = currentValuesRef.current;
        dtoIn = _addPageSize(dtoIn, pageSize);
        // add pageIndex based on 1st not-yet-loaded item
        if (typeof dtoIn.pageInfo.pageIndex !== "number") {
          let notYetLoadedItemIndex = data ? data.find((it) => it == null) : -1;
          if (notYetLoadedItemIndex !== -1) {
            dtoIn.pageInfo.pageIndex = Math.floor(notYetLoadedItemIndex / pageSize);
          }
        }
        if (!onCall) onCall = paramHandlerMap["load"];
        return typeof onCall === "function" ? onCall(dtoIn, ...restArgs) : undefined;
      }
    );
    remainingKeys.delete("loadNext");
  }
  for (let k of remainingKeys) {
    if (!handlerMap[k]) handlerMap[k] = initHandler(k, OP_TYPE_LIST, dispatchAction, currentValuesRef);
  }

  // prepare itemHandlerMap handlers
  let itemHandlerMapRef = useRef({});
  let itemHandlerMap = itemHandlerMapRef.current;
  let newItemHandlerMap = {};
  for (let k in paramItemHandlerMap) {
    newItemHandlerMap[k] = itemHandlerMap[k] || initHandler(k, OP_TYPE_ITEM, dispatchAction, currentValuesRef);
  }
  if (!_shallowEquals(itemHandlerMap, newItemHandlerMap)) {
    itemHandlerMapRef.current = itemHandlerMap = newItemHandlerMap;
  }

  useEffectOnMount(() => {
    if (fullState.state === "pending" || fullState.state === "pendingNoData") {
      handlerMap.load(FIRST_LOAD_FLAG, initialDtoIn).catch(e => UU5.Common.Tools.error("Loading data failed:", e));
    }
  });

  // fullState.data contains items with { data, errorData, pendingData, state } but not with handlerMap
  // => enhance each item with handlerMap (based on global / item state)
  let itemHandlerMapCacheRef = useRef();
  if (!itemHandlerMapCacheRef.current) {
    itemHandlerMapCacheRef.current = typeof WeakMap !== "undefined" ? new WeakMap() : new Map();
  }
  let dataWithItemHandlerMap = useMemo(() => {
    let result;
    let data = fullState.data;
    if (Array.isArray(data)) {
      let cache = itemHandlerMapCacheRef.current;
      result = data.map(item => {
        if (!item) return item;
        let fn = cache.get(item);
        if (!fn) cache.set(item, (fn = memoizeOne(_computeItemWithHandlerMap)));
        return fn(item, itemIdentifier, itemHandlerMap);
      });
    } else {
      result = data;
    }
    return result;
  }, [fullState.data, itemIdentifier, itemHandlerMap]);

  let result = { ...fullState, data: dataWithItemHandlerMap, handlerMap };
  delete result.runnableList;
  delete result.runningOperations;
  return result;
}
export default useDataList;
