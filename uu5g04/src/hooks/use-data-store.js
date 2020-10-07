import UU5 from "uu5g04";
import { useMemo, useState, useRef } from "./react-hooks";
import { createComponent } from "./component";
import { DataControllerProvider } from "./use-data-controller";
import { useDataList } from "./use-data-list";
import { createContext } from "./context";

const [DataStoreContext, useDataStore] = createContext();

const EMPTY_ARRAY = Object.freeze([]);

const DataStoreProvider = createComponent({
  displayName: "UU5.Hooks.DataStoreProvider",
  propTypes: {
    initialData: UU5.PropTypes.array,
    initialDtoIn: UU5.PropTypes.any,
    pageSize: UU5.PropTypes.number,
    handlerMap: UU5.PropTypes.object,
    itemHandlerMap: UU5.PropTypes.object,
    ...DataControllerProvider.propTypes,
  },
  defaultProps: {
    initialData: undefined,
    initialDtoIn: undefined,
    pageSize: undefined,
    handlerMap: undefined,
    itemHandlerMap: undefined,
    ...DataControllerProvider.defaultProps,
  },
  render({
    children,

    initialData: propInitialData,
    initialDtoIn: propInitialDtoIn,
    pageSize: propPageSize,
    itemIdentifier,
    handlerMap: propHandlerMap,
    itemHandlerMap: propItemHandlerMap,

    filterDefinitionList,
    sorterDefinitionList,
    onFilterChange,
    onSorterChange,
    ...restProps
  }) {
    //@@viewOn:private
    const activeFilterSorterDtoInRef = useRef();
    if (!activeFilterSorterDtoInRef.current) {
      activeFilterSorterDtoInRef.current = constructDtoIn(filterDefinitionList, sorterDefinitionList, true);
    }

    const [initialData] = useState(propInitialData);
    const dataListResult = useDataList({
      initialData,
      initialDtoIn: propInitialDtoIn,
      pageSize: propPageSize,
      itemIdentifier,
      handlerMap: {
        ...propHandlerMap,
        load: propHandlerMap?.load
          ? (dtoIn, ...args) => propHandlerMap.load({ ...activeFilterSorterDtoInRef.current, ...dtoIn }, ...args)
          : undefined,
        loadNext: propHandlerMap?.loadNext
          ? (dtoIn, ...args) => propHandlerMap.loadNext({ ...activeFilterSorterDtoInRef.current, ...dtoIn }, ...args)
          : undefined,
      },
      itemHandlerMap: propItemHandlerMap,
    });

    // useDataList returns new object every time (+ new handlerMap object) so we'll have to use more advanced form of memo
    const { handlerMap, ...rest } = dataListResult;
    const usedHandlerMap = useShallowMemo(handlerMap);
    const usedRest = useShallowMemo(rest);
    const providerValue = useMemo(() => ({ ...usedRest, handlerMap: usedHandlerMap }), [usedHandlerMap, usedRest]);

    const usedOnFilterChange = (opt) => {
      if (typeof onFilterChange === "function") onFilterChange(opt);
      activeFilterSorterDtoInRef.current = constructDtoIn(opt.filterList, opt.sorterList);
      if (handlerMap.load) handlerMap.load();
    };

    const usedOnSorterChange = (opt) => {
      if (typeof onSorterChange === "function") onSorterChange(opt);
      activeFilterSorterDtoInRef.current = constructDtoIn(opt.filterList, opt.sorterList);
      if (handlerMap.load) handlerMap.load();
    };
    //@@viewOn:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <DataStoreContext.Provider value={providerValue}>
        <DataControllerProvider
          {...restProps}
          data={dataListResult.data || EMPTY_ARRAY}
          filterDefinitionList={filterDefinitionList}
          sorterDefinitionList={sorterDefinitionList}
          onFilterChange={usedOnFilterChange}
          onSorterChange={usedOnSorterChange}
          itemIdentifier={itemIdentifier}
        >
          {children}
        </DataControllerProvider>
      </DataStoreContext.Provider>
    );
  },
  //@@viewOff:render
});

//@viewOn:helpers
function constructDtoIn(filters, sorters, initialOnly = false) {
  let filterMap = {};
  if (Array.isArray(filters)) {
    for (let it of filters) {
      let { key } = it;
      let value = it[initialOnly ? "initialValue" : "value"];
      if (value != null) filterMap[key] = value;
    }
  }

  let sorterList = [];
  if (Array.isArray(sorters)) {
    for (let it of sorters) {
      let { key } = it;
      let ascending = it[initialOnly ? "initialAscending" : "ascending"];
      if (ascending != null) sorterList.push({ key, ascending });
    }
  }

  return { filterMap, sorterList };
}

function useShallowMemo(value) {
  let prevReturnedRef = useRef(value);
  let prevReturnedValue = prevReturnedRef.current;
  let result;
  if (prevReturnedValue === value) result = value;
  else if (typeof prevReturnedValue !== typeof value || value == null || typeof value !== "object") result = value;
  else if (Object.keys(value).length !== Object.keys(prevReturnedValue).length) result = value;
  else {
    // both values are defined objects with same count of keys => do shallow compare
    result = prevReturnedValue;
    for (let k in value) {
      if (value[k] !== prevReturnedValue[k]) {
        result = value;
        break;
      }
    }
  }
  prevReturnedRef.current = result;
  return result;
}
//@viewOff:helpers

export { useDataStore, DataStoreProvider };

export default DataStoreProvider;
