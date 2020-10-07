import UU5 from "uu5g04";
import { useState, useMemo, useCallback } from "../react-hooks";

const EMPTY_ARRAY = Object.freeze([]);

function useFilterList(filterDefinitionList) {
  let [storedFilterList, setStoredFilterList] = useState(() => {
    return filterDefinitionList
      .filter((filter) => filter?.initialValue != null)
      .map((filter) => {
        let { initialValue, key } = filter;
        return { key, value: initialValue };
      });
  });

  // normalize to { key, value } items and preserve only those that exist in filterDefinitionList
  let normalizedFilterList = useMemo(() => {
    return storedFilterList
      .map((item) => (item?.key != null && item?.value != null ? { key: item.key, value: item.value } : undefined))
      .filter(Boolean);
  }, [storedFilterList]);
  let filterList = useMemo(() => {
    let validList = normalizedFilterList.filter((item) => {
      let definitionItem = filterDefinitionList.find((it) => it.key === item.key);
      if (process.env.NODE_ENV === "development" && !definitionItem) {
        UU5.Common.Tools.warning(
          `A filter with the key "${item.key}" is active in DataControllerProvider but it is missing in the property filterDefinitionList and therefore is ignored.`,
          { item }
        );
      }
      return !!definitionItem;
    });
    return validList.length === normalizedFilterList ? normalizedFilterList : validList;
  }, [filterDefinitionList, normalizedFilterList]);

  // if the computed filterList differs from the stored one then there must
  // be some invalid values in stored list => we can safely splice it as it isn't anywhere on API
  // and next filter operations (add/remove/...) will operate on smaller list thanks to that
  if (storedFilterList.length !== filterList.length) storedFilterList.splice(0, storedFilterList.length, ...filterList);

  const addFilter = useCallback((list) => {
    let addList = !Array.isArray(list) ? [list] : list;
    if (addList.length) {
      let isInAddList = (key) => addList.some((addItem) => addItem?.key === key);
      setStoredFilterList((curList) => curList.filter((it) => it && !isInAddList(it.key)).concat(addList));
    }
  }, []);

  const removeFilter = useCallback((list) => {
    let removeList = !Array.isArray(list) ? [list] : list;
    if (removeList.length) {
      let isInRemoveList = (key) => removeList.some((removeItem) => removeItem === key);
      setStoredFilterList((curList) => curList.filter((it) => it && !isInRemoveList(it.key)));
    }
  }, []);

  const clearFilterList = useCallback(() => {
    setStoredFilterList(EMPTY_ARRAY);
  }, []);

  const setFilterList = useCallback((list) => {
    if (Array.isArray(list)) setStoredFilterList([...list]); // NOTE Copying as we're splicing the value later (as an optimization).
  }, []);

  let api = useMemo(
    () => ({
      filterDefinitionList,
      filterList,
      addFilter,
      removeFilter,
      clearFilterList,
      setFilterList,
    }),
    [addFilter, clearFilterList, filterDefinitionList, filterList, removeFilter, setFilterList]
  );
  return [filterList, api];
}

function applyLocalFilters(data, filterList, filterDefinitionList) {
  let filteredData = data;
  if (Array.isArray(data) && filterList?.length > 0) {
    let filterItems = filterList
      .map((it) => {
        let { filter } = filterDefinitionList.find((defIt) => defIt.key === it.key);
        return typeof filter === "function" ? { filter, value: it.value } : undefined;
      })
      .filter(Boolean);
    if (filterItems.length > 0) {
      filteredData = [];
      for (let item of data) {
        let matched = true;
        for (let { filter, value } of filterItems) {
          if (!filter(item, value)) {
            matched = false;
            break;
          }
        }
        if (matched) filteredData.push(item);
      }
      if (filteredData.length === data.length) filteredData = data;
    }
  }
  return filteredData;
}

export { useFilterList, applyLocalFilters };
