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
import { useMemo } from "uu5g05";
import { useListDataInternal } from "./use-list-data";

function applyLoad(data, callArgs, callResult, callError) {
  if (callError !== undefined) return data;
  if (callResult === undefined) return data;

  // don't merge if explicit flag is set
  let overwriteAllData = !callArgs[1];

  let itemList = Array.isArray(callResult) ? callResult : (callResult && callResult.itemList) || null;
  let pageInfo = Array.isArray(callResult) ? null : (callResult && callResult.pageInfo) || null;
  let newData = itemList || [];
  if (pageInfo) {
    // merge response page data (callResult) into the old data (data)
    let oldData = (!overwriteAllData ? data : null) || [];
    let from = pageInfo.pageIndex * pageInfo.pageSize || 0;
    let to = from + (itemList ? itemList.length : 0);
    newData = new Array(typeof pageInfo.total === "number" ? pageInfo.total : Math.max(to, oldData.length));
    for (let i = 0, len = newData.length; i < len; ++i) {
      newData[i] = from <= i && i < to ? itemList[i - from] : oldData[i];
    }
  }
  return newData;
}

function getStateReducer(pageSize) {
  return function stateReducer(state, action, nextReducer) {
    let result;
    let { type, payload } = action;
    switch (type) {
      case "init": {
        // unwrap itemList, pageInfo if that's what is in asyncData (we want to have there only an array)
        let itemList = Array.isArray(payload.asyncData)
          ? payload.asyncData
          : (payload.asyncData && payload.asyncData.itemList) || null;
        let pageInfo = Array.isArray(payload.asyncData)
          ? null
          : (payload.asyncData && payload.asyncData.pageInfo) || null;
        let newState = nextReducer(state, { type, payload: { ...payload, asyncData: itemList } });
        result = { ...newState, pageInfo };
        break;
      }
      case "loadStart": {
        // add pageSize to the load request
        let { callArgs } = payload;
        let dtoInData = callArgs[0];
        if (!dtoInData || !dtoInData.pageInfo || !dtoInData.pageInfo.pageSize) {
          callArgs[0] = {
            ...dtoInData,
            pageInfo: {
              ...(dtoInData || {}).pageInfo,
              pageSize,
            },
          };
        }

        // change "apply" fn to do data merging instead of data replacing
        payload.applyOpToDataFn = applyLoad;
        result = nextReducer(state, action);
        break;
      }
      case "loadDone": {
        let newState = nextReducer(state, action);
        result = { ...newState, pageInfo: (payload && payload.data && payload.data.pageInfo) || null };
        break;
      }
      default: {
        result = nextReducer(state, action);
        if (result === state) return state; // no re-render needed
      }
    }
    return result;
  };
}

export function usePagingListData({ pageSize = 50, ...opts } = {}) {
  let stateReducer = useMemo(() => getStateReducer(pageSize), [pageSize]);
  let { api } = useListDataInternal(opts, stateReducer);

  return api;
}
