import UU5 from "uu5g04";
import { useState, useMemo, useCallback } from "../react-hooks";

const EMPTY_ARRAY = Object.freeze([]);

function useSorterList(sorterDefinitionList) {
  let [storedSorterList, setStoredSorterList] = useState(() => {
    return sorterDefinitionList
      .filter((sorter) => typeof sorter?.initialAscending === "boolean")
      .map((sorter) => {
        let { initialAscending, key } = sorter;
        return { key, ascending: initialAscending };
      });
  });

  // normalize to { key, ascending } items and preserve only those that exist in sorterDefinitionList
  let normalizedSorterList = useMemo(() => {
    return storedSorterList
      .map((item) => (item?.key != null ? { key: item.key, ascending: item.ascending ?? true } : undefined))
      .filter(Boolean);
  }, [storedSorterList]);
  let sorterList = useMemo(() => {
    let validList = normalizedSorterList.filter((item) => {
      let definitionItem = sorterDefinitionList.find((it) => it.key === item.key);
      if (process.env.NODE_ENV === "development" && !definitionItem) {
        UU5.Common.Tools.warning(
          `A sorter with the key "${item.key}" is active in DataControllerProvider but it is missing in the property sorterDefinitionList and therefore is ignored.`,
          { item }
        );
      }
      return !!definitionItem;
    });
    return validList.length === normalizedSorterList ? normalizedSorterList : validList;
  }, [sorterDefinitionList, normalizedSorterList]);

  // if the computed sorterList differs from the stored one then there must
  // be some invalid values in stored list => we can safely splice it as it isn't anywhere on API
  // and next sorter operations (add/remove/...) will operate on smaller list thanks to that
  if (storedSorterList.length !== sorterList.length) storedSorterList.splice(0, storedSorterList.length, ...sorterList);

  const addSorter = useCallback((list) => {
    let addList = !Array.isArray(list) ? [list] : list;
    if (addList.length) {
      let isInAddList = (key) => addList.some((addItem) => addItem?.key === key);
      setStoredSorterList((curList) => curList.filter((it) => it && !isInAddList(it.key)).concat(addList));
    }
  }, []);

  const removeSorter = useCallback((list) => {
    let removeList = !Array.isArray(list) ? [list] : list;
    if (removeList.length) {
      let isInRemoveList = (key) => removeList.some((removeItem) => removeItem === key);
      setStoredSorterList((curList) => curList.filter((it) => it && !isInRemoveList(it.key)));
    }
  }, []);

  const clearSorterList = useCallback(() => {
    setStoredSorterList(EMPTY_ARRAY);
  }, []);

  const setSorterList = useCallback((list) => {
    if (Array.isArray(list)) setStoredSorterList([...list]); // NOTE Copying as we're splicing the value later (as an optimization).
  }, []);

  let api = useMemo(
    () => ({
      sorterDefinitionList,
      sorterList,
      addSorter,
      removeSorter,
      clearSorterList,
      setSorterList,
    }),
    [addSorter, clearSorterList, removeSorter, setSorterList, sorterDefinitionList, sorterList]
  );
  return [sorterList, api];
}

function applyLocalSorters(data, sorterList, sorterDefinitionList) {
  let sortedResult = data;
  if (Array.isArray(data) && sorterList?.length > 0) {
    let sorterItems = sorterList
      .map((it) => {
        let { sort } = sorterDefinitionList.find((defIt) => defIt.key === it.key);
        return typeof sort === "function" ? { sort, ascending: it.ascending } : undefined;
      })
      .filter(Boolean);
    if (sorterItems.length > 0) {
      sortedResult = sortedResult
        .map((item, index) => ({ item, index }))
        .sort((a, b) => {
          let comparisonResult = 0;
          for (let { ascending, sort } of sorterItems) {
            comparisonResult = sort(a.item, b.item);
            if (comparisonResult) return ascending ? comparisonResult : -comparisonResult;
          }
          let { ascending } = sorterItems[sorterItems.length - 1];
          return (ascending ? 1 : -1) * (a.index - b.index);
        })
        .map(({ item }) => item);
    }
  }
  return sortedResult;
}

export { useSorterList, applyLocalSorters };
