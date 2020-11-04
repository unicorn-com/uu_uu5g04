import UU5 from "uu5g04";
import { useRef, useMemo } from "./react-hooks";
import { createComponent } from "./component";
import { createContext } from "./context";
import useSelectionSupport from "./internal/use-selection-support";
import { useFilterList, applyLocalFilters } from "./internal/use-filter-list";
import { useSorterList, applyLocalSorters } from "./internal/use-sorter-list";
import useUpdateEffect from "./internal/use-update-effect";
import { DataFilterProvider } from "./use-data-filter";
import { DataSorterProvider } from "./use-data-sorter";
import { DataSelectionProvider } from "./use-data-selection";

const [DataControllerContext, useDataController] = createContext();

const EMPTY_ARRAY = Object.freeze([]);

const DataControllerProvider = createComponent({
  displayName: "UU5.Hooks.DataControllerProvider",
  propTypes: {
    itemIdentifier: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.arrayOf(UU5.PropTypes.string)]),
    data: UU5.PropTypes.array,

    filterDefinitionList: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        key: UU5.PropTypes.string.isRequired,
        filter: UU5.PropTypes.func,
        initialValue: UU5.PropTypes.oneOfType([
          UU5.PropTypes.string,
          UU5.PropTypes.number,
          UU5.PropTypes.bool,
          UU5.PropTypes.object,
        ]),
      }).isRequired
    ),
    onFilterChange: UU5.PropTypes.func,

    sorterDefinitionList: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        key: UU5.PropTypes.string.isRequired,
        sort: UU5.PropTypes.func,
        initialAscending: UU5.PropTypes.bool,
      }).isRequired
    ),
    onSorterChange: UU5.PropTypes.func,

    selectable: UU5.PropTypes.bool,
    initialIsDisplayedSelected: UU5.PropTypes.bool,
    initialSelectedData: UU5.PropTypes.array,
  },
  defaultProps: {
    itemIdentifier: "id",
    data: EMPTY_ARRAY,
    filterDefinitionList: EMPTY_ARRAY,
    onFilterChange: undefined,
    sorterDefinitionList: EMPTY_ARRAY,
    onSorterChange: undefined,
    selectable: false,
    initialIsDisplayedSelected: false,
    initialSelectedData: EMPTY_ARRAY,
  },
  render(props) {
    let {
      children,
      itemIdentifier,
      data,
      filterDefinitionList,
      onFilterChange,
      sorterDefinitionList,
      onSorterChange,
      selectable,
      initialIsDisplayedSelected,
      initialSelectedData,
    } = props;
    let [filterList, filterApi] = useFilterList(filterDefinitionList);
    let [sorterList, sorterApi] = useSorterList(sorterDefinitionList);

    let displayedData = data;
    displayedData = useMemo(() => applyLocalFilters(displayedData, filterList, filterDefinitionList), [
      displayedData,
      filterDefinitionList,
      filterList,
    ]);
    displayedData = useMemo(() => applyLocalSorters(displayedData, sorterList, sorterDefinitionList), [
      displayedData,
      sorterDefinitionList,
      sorterList,
    ]);

    let selectionApi;
    [displayedData, selectionApi] = useSelectionSupport(
      data,
      displayedData,
      itemIdentifier,
      selectable,
      initialIsDisplayedSelected ?? props.initialDisplaySelected, // initialDisplaySelected for backward compatibility
      initialSelectedData
    );
    let dataApi = useMemo(() => ({ itemIdentifier, data, displayedData }), [data, itemIdentifier, displayedData]);

    // fire onFilterChange/onSorterChange when appropriate
    let currentValuesRef = useRef();
    currentValuesRef.current = { filterList, sorterList, onFilterChange, onSorterChange };
    useUpdateEffect(() => {
      let { sorterList, onFilterChange } = currentValuesRef.current;
      if (typeof onFilterChange === "function") onFilterChange({ filterList, sorterList });
    }, [filterList]);
    useUpdateEffect(() => {
      let { filterList, onSorterChange } = currentValuesRef.current;
      if (typeof onSorterChange === "function") onSorterChange({ filterList, sorterList });
    }, [sorterList]);

    return (
      <DataControllerContext.Provider value={dataApi}>
        <DataFilterProvider value={filterApi}>
          <DataSorterProvider value={sorterApi}>
            <DataSelectionProvider value={selectionApi}>{children}</DataSelectionProvider>
          </DataSorterProvider>
        </DataFilterProvider>
      </DataControllerContext.Provider>
    );
  },
});

export { useDataController, DataControllerProvider };
export default useDataController;
