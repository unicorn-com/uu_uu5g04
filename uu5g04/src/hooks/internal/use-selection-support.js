import { useState, useMemo, useCallback } from "../react-hooks";
import { constructItemKey } from "./list-helpers";

const EMPTY_ARRAY = Object.freeze([]);

export function useSelectionSupport(
  data,
  displayedData,
  itemIdentifier,
  selectable = false,
  initialDisplaySelected = false,
  initialSelectedData = EMPTY_ARRAY
) {
  let itemKey = useMemo(() => constructItemKey(itemIdentifier), [itemIdentifier]);
  let [isDisplayedSelected, setIsDisplayedSelected] = useState(initialDisplaySelected);

  let [storedSelectedData, setStoredSelectedData] = useState(initialSelectedData);
  if (!selectable && storedSelectedData.length > 0) {
    setStoredSelectedData(EMPTY_ARRAY);
    setIsDisplayedSelected(false);
  }

  // normalize "storedSelectedData" and propagate item changes from "data" to items in "selectedData"
  // (including item order)
  let selectedData = useMemo(() => {
    let allItemMap = {};
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        let key = itemKey(item);
        if (key != null) allItemMap[key] = { index: i, key, item };
      }
    }
    let displayedItemMap = {};
    if (Array.isArray(displayedData)) {
      for (let i = 0; i < displayedData.length; i++) {
        let item = displayedData[i];
        let key = itemKey(item);
        if (key != null) displayedItemMap[key] = { index: i, key, item };
      }
    }

    let selectedItemsZip = [];
    let selectedSet = new Set();
    for (let i = 0; i < storedSelectedData.length; i++) {
      let item = storedSelectedData[i];
      let key = itemKey(item);
      if (key == null || selectedSet.has(key)) continue;
      selectedSet.add(key);
      if (key in allItemMap) item = allItemMap[key].item; // use item from "data" if available (to have up-to-date data item)
      selectedItemsZip.push({ index: i, key, item, dataIndex: displayedItemMap[key]?.index });
    }

    // order selected items so that:
    // 1. relative order of items that are currently present in "displayedData" remains like it is in "displayedData"
    // 2. items not in "displayedData" remain on their current positions
    // e.g. selection has 5 items: [b,Z,a,X,Y] => [b,X,a,Y,Z]   (a,b are not in "displayedData"; X,Y,Z are in "displayedData" ordered as X <= Y <= Z)
    selectedItemsZip.sort((a, b) => {
      let result = a.dataIndex != null && b.dataIndex != null ? a.dataIndex - b.dataIndex : 0;
      return result || a.index - b.index;
    });

    let result = [];
    for (let { item } of selectedItemsZip) result.push(item);

    // optimize next render - mutate "storedSelectedData" with normalized result
    // (we can do that as it is internal field not present on API)
    if (storedSelectedData.length) storedSelectedData.splice(0, storedSelectedData.length, ...result);
    return result;
  }, [data, displayedData, itemKey, storedSelectedData]);

  const addSelected = useCallback(
    (list) => {
      let addList = !Array.isArray(list) ? [list] : list;
      if (addList.length) {
        let isInAddList = (key) => addList.some((addItem) => addItem && itemKey(addItem) === key);
        setStoredSelectedData((curList) => curList.filter((it) => it && !isInAddList(itemKey(it))).concat(addList));
      }
    },
    [itemKey]
  );

  const removeSelected = useCallback(
    (list) => {
      let removeList = !Array.isArray(list) ? [list] : list;
      if (removeList.length) {
        let isInRemoveList = (key) => removeList.some((removeItem) => removeItem && itemKey(removeItem) === key);
        setStoredSelectedData((curList) => curList.filter((it) => it && !isInRemoveList(itemKey(it))));
      }
    },
    [itemKey]
  );

  const clearSelected = useCallback(() => {
    setStoredSelectedData(EMPTY_ARRAY);
  }, []);

  const setSelected = useCallback((list) => {
    if (Array.isArray(list)) setStoredSelectedData([...list]); // NOTE Copying as we're splicing the value later (as an optimization).
  }, []);

  const isSelected = useCallback(
    (item) => {
      let key = itemKey(item);
      return key != null && selectedData.some((selectedItem) => itemKey(selectedItem) === key);
    },
    [itemKey, selectedData]
  );

  const toggleIsDisplayedSelected = useCallback((selected = null) => {
    setIsDisplayedSelected((curValue) => (typeof selected === "boolean" ? selected : !curValue));
  }, []);

  let usedDisplayedData = isDisplayedSelected ? selectedData : displayedData;
  let selectionApi = useMemo(() => {
    return {
      selectable,
      selectedData,
      isSelected,
      addSelected,
      removeSelected,
      setSelected,
      clearSelected,
      isDisplayedSelected,
      toggleIsDisplayedSelected,
    };
  }, [
    selectable,
    selectedData,
    isSelected,
    addSelected,
    removeSelected,
    setSelected,
    clearSelected,
    isDisplayedSelected,
    toggleIsDisplayedSelected,
  ]);

  return [usedDisplayedData, selectionApi];
}
export default useSelectionSupport;
