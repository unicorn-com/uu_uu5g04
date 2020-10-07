import UU5 from "uu5g04";
import {
  DataControllerProvider,
  useDataController,
  useDataFilter,
  useDataSorter,
  useDataSelection,
} from "uu5g04-hooks";
import {
  getData,
  FILTERS,
  SORTERS,
  sortByType,
  sortByFontSize,
  filterByColorSchema,
  filterByType,
  createMockFn,
} from "./internal/mock-data";

const { mount, wait, act, initHookRenderer } = UU5.Test.Tools;

function initTest() {
  const { lastResult, renderCount, HookComponent: ControllerHookComponent } = initHookRenderer(useDataController);
  const {
    lastResult: filterLastResult,
    renderCount: filterRenderCount,
    HookComponent: FilterHookComponent,
  } = initHookRenderer(useDataFilter);
  const {
    lastResult: sorterLastResult,
    renderCount: sorterRenderCount,
    HookComponent: SorterHookComponent,
  } = initHookRenderer(useDataSorter);
  const {
    lastResult: selectionLastResult,
    renderCount: selectionRenderCount,
    HookComponent: SelectionHookComponent,
  } = initHookRenderer(useDataSelection);
  let HookComponent = () => (
    <ControllerHookComponent>
      <FilterHookComponent>
        <SorterHookComponent>
          <SelectionHookComponent />
        </SorterHookComponent>
      </FilterHookComponent>
    </ControllerHookComponent>
  );
  return {
    HookComponent,
    lastResult,
    renderCount,
    filterLastResult,
    filterRenderCount,
    sorterLastResult,
    sorterRenderCount,
    selectionLastResult,
    selectionRenderCount,
  };
}

describe("ControllerProvider", function () {
  let wrapper;

  it("returns expected API", async () => {
    const {
      lastResult,
      renderCount,
      filterLastResult,
      filterRenderCount,
      sorterLastResult,
      sorterRenderCount,
      selectionLastResult,
      selectionRenderCount,
      HookComponent,
    } = initTest();
    wrapper = mount(
      <DataControllerProvider initialData={[]}>
        <HookComponent />
      </DataControllerProvider>
    );
    expect(renderCount()).toBe(1);
    expect(filterRenderCount()).toBe(1);
    expect(sorterRenderCount()).toBe(1);
    expect(selectionRenderCount()).toBe(1);
    expect(lastResult()).toEqual({
      data: expect.any(Array),
      displayedData: expect.any(Array),
      itemIdentifier: expect.any(String),
    });
    expect(filterLastResult()).toEqual({
      addFilter: expect.any(Function),
      clearFilterList: expect.any(Function),
      filterDefinitionList: expect.any(Array),
      filterList: expect.any(Array),
      removeFilter: expect.any(Function),
      setFilterList: expect.any(Function),
    });
    expect(sorterLastResult()).toEqual({
      addSorter: expect.any(Function),
      clearSorterList: expect.any(Function),
      removeSorter: expect.any(Function),
      setSorterList: expect.any(Function),
      sorterDefinitionList: expect.any(Array),
      sorterList: expect.any(Array),
    });
    expect(selectionLastResult()).toEqual({
      addSelected: expect.any(Function),
      clearSelected: expect.any(Function),
      isDisplayedSelected: expect.any(Boolean),
      isSelected: expect.any(Function),
      removeSelected: expect.any(Function),
      selectable: expect.any(Boolean),
      selectedData: expect.any(Array),
      setSelected: expect.any(Function),
      toggleIsDisplayedSelected: expect.any(Function),
    });
  });

  it("mount behaviour", async () => {
    const { lastResult, HookComponent } = initTest();
    const initialData = getData(10);
    wrapper = mount(
      <DataControllerProvider data={initialData}>
        <HookComponent />
      </DataControllerProvider>
    );
    expect(lastResult().data).toEqual(initialData);
    expect(lastResult().displayedData).toEqual(initialData);
  });

  it("itemIdentifier", async () => {
    const { selectionLastResult, HookComponent } = initTest();
    const data = [
      { uid: "id1", code: "codeA", nested: { awid: "1" } },
      { uid: "id2", code: "codeA", nested: { awid: "2" } },
      { uid: "id3", code: "codeB", nested: { awid: "2" } },
      { uid: "id4", code: "codeB", nested: { awid: "3" } },
    ];
    wrapper = mount(
      <DataControllerProvider data={data} itemIdentifier="uid" selectable initialSelectedData={[data[1]]}>
        <HookComponent />
      </DataControllerProvider>
    );
    expect(selectionLastResult().isSelected(data[1])).toBe(true);
    expect(selectionLastResult().isSelected({ uid: "id1" })).toBe(false);
    expect(selectionLastResult().isSelected({ uid: "id2" })).toBe(true);

    wrapper.setProps({ itemIdentifier: ["code", "nested.awid"] });
    expect(selectionLastResult().isSelected(data[1])).toBe(true);
    expect(selectionLastResult().isSelected({ uid: "id2" })).toBe(false); // wrong parameter (does not contain all keys according to itemIdentifier)
    expect(selectionLastResult().isSelected({ code: "codeA" })).toBe(false); // wrong parameter (does not contain all keys according to itemIdentifier)
    expect(selectionLastResult().isSelected({ code: "codeA", nested: { awid: "3" } })).toBe(false);
    expect(selectionLastResult().isSelected({ code: "codeA", nested: { awid: "2" } })).toBe(true);
  });

  it("sorterList", async () => {
    const { lastResult, sorterLastResult, HookComponent } = initTest();
    const onSorterChangeFn = createMockFn();
    const data = getData(10);
    const SORTERS_WITH_VALUES = SORTERS.map((it, i) => ({ key: it.key, ascending: i === 0 }));
    const sorterDefinitionList = SORTERS.map((it, i) => (i === 0 ? { ...it, initialAscending: true } : it));
    wrapper = mount(
      <DataControllerProvider data={data} sorterDefinitionList={sorterDefinitionList} onSorterChange={onSorterChangeFn}>
        <HookComponent />
      </DataControllerProvider>
    );
    expect(sorterLastResult().sorterDefinitionList).toBe(sorterDefinitionList);
    expect(sorterLastResult().sorterList).toEqual([SORTERS_WITH_VALUES[0]]);
    expect(lastResult().displayedData).toEqual([...data].sort(sortByType));
    await wait();
    expect(onSorterChangeFn).toHaveBeenCalledTimes(0);

    // addSorter
    act(() => {
      sorterLastResult().addSorter({ key: SORTERS[1].key, ascending: false });
    });
    expect(sorterLastResult().sorterList).toEqual([SORTERS_WITH_VALUES[0], SORTERS_WITH_VALUES[1]]);
    expect(lastResult().displayedData).toEqual([...data].sort((a, b) => sortByType(a, b) || -sortByFontSize(a, b)));
    await wait();
    expect(onSorterChangeFn).toHaveBeenCalledTimes(1);
    expect(onSorterChangeFn.lastValues.sorterList).toEqual([SORTERS_WITH_VALUES[0], SORTERS_WITH_VALUES[1]]);

    // clearSorterList
    act(() => {
      sorterLastResult().clearSorterList();
    });
    expect(sorterLastResult().sorterList).toEqual([]);
    expect(lastResult().displayedData).toEqual(data);
    await wait();
    expect(onSorterChangeFn).toHaveBeenCalledTimes(2);
    expect(onSorterChangeFn.lastValues.sorterList).toEqual([]);

    // setSorterList
    act(() => {
      sorterLastResult().setSorterList(SORTERS.map(({ key }) => ({ key })));
    });
    expect(sorterLastResult().sorterList).toEqual(SORTERS.map((it) => ({ key: it.key, ascending: true })));
    expect(lastResult().displayedData).toEqual([...data].sort((a, b) => sortByType(a, b) || sortByFontSize(a, b)));
    await wait();
    expect(onSorterChangeFn).toHaveBeenCalledTimes(3);
    expect(onSorterChangeFn.lastValues.sorterList).toEqual(SORTERS.map((it) => ({ key: it.key, ascending: true })));

    // removeSorter
    act(() => {
      sorterLastResult().removeSorter(SORTERS[0].key);
    });
    expect(sorterLastResult().sorterList).toEqual(SORTERS.slice(1).map((it) => ({ key: it.key, ascending: true })));
    expect(lastResult().displayedData).toEqual([...data].sort((a, b) => sortByFontSize(a, b)));
    await wait();
    expect(onSorterChangeFn).toHaveBeenCalledTimes(4);
    expect(onSorterChangeFn.lastValues.sorterList).toEqual(
      SORTERS.slice(1).map((it) => ({ key: it.key, ascending: true }))
    );

    act(() => {
      sorterLastResult().clearSorterList();
    });
    await wait();
    expect(onSorterChangeFn).toHaveBeenCalledTimes(5);

    // addSorter with array
    act(() => {
      sorterLastResult().addSorter(SORTERS.map(({ key }) => ({ key })));
    });
    expect(sorterLastResult().sorterList).toEqual(SORTERS.map((it) => ({ key: it.key, ascending: true })));
    expect(lastResult().displayedData).toEqual([...data].sort((a, b) => sortByType(a, b) || sortByFontSize(a, b)));
    await wait();
    expect(onSorterChangeFn).toHaveBeenCalledTimes(6);
    expect(onSorterChangeFn.lastValues.sorterList).toEqual(SORTERS.map((it) => ({ key: it.key, ascending: true })));

    // multiple React-batched operations
    act(() => {
      sorterLastResult().clearSorterList();
      sorterLastResult().addSorter(SORTERS_WITH_VALUES[0]);
      sorterLastResult().addSorter(SORTERS_WITH_VALUES[1]);
    });
    expect(sorterLastResult().sorterList).toEqual([SORTERS_WITH_VALUES[0], SORTERS_WITH_VALUES[1]]);
    await wait();
  });

  it("filterList", async () => {
    const { lastResult, filterLastResult, HookComponent } = initTest();
    const onFilterChangeFn = createMockFn();
    const data = getData(10);
    const FILTERS_WITH_VALUES = FILTERS.map((it, i) => ({ key: it.key, value: i === 0 ? "red" : "secondary" }));
    const filterDefinitionList = FILTERS.map((it, i) => (i === 0 ? { ...FILTERS[0], initialValue: "red" } : it));
    wrapper = mount(
      <DataControllerProvider data={data} filterDefinitionList={filterDefinitionList} onFilterChange={onFilterChangeFn}>
        <HookComponent />
      </DataControllerProvider>
    );
    expect(filterLastResult().filterDefinitionList).toBe(filterDefinitionList);
    expect(filterLastResult().filterList).toEqual([FILTERS_WITH_VALUES[0]]);
    expect(lastResult().displayedData).toEqual(data.filter(filterByColorSchema));
    await wait();
    expect(onFilterChangeFn).toHaveBeenCalledTimes(0);

    // addFilter
    act(() => {
      filterLastResult().addFilter(FILTERS_WITH_VALUES[1]);
    });
    expect(filterLastResult().filterList).toEqual(FILTERS_WITH_VALUES.slice(0, 2));
    expect(lastResult().displayedData).toEqual(data.filter((item) => filterByColorSchema(item) && filterByType(item)));
    await wait();
    expect(onFilterChangeFn).toHaveBeenCalledTimes(1);
    expect(onFilterChangeFn.lastValues.filterList).toEqual(FILTERS_WITH_VALUES.slice(0, 2));

    // clearFilter
    act(() => {
      filterLastResult().clearFilterList();
    });
    expect(filterLastResult().filterList).toEqual([]);
    expect(lastResult().displayedData).toEqual(data);
    await wait();
    expect(onFilterChangeFn).toHaveBeenCalledTimes(2);
    expect(onFilterChangeFn.lastValues.filterList).toEqual([]);

    // setFilterList
    act(() => {
      filterLastResult().setFilterList(FILTERS_WITH_VALUES.slice(0, 2));
    });
    expect(filterLastResult().filterList).toEqual(FILTERS_WITH_VALUES.slice(0, 2));
    expect(lastResult().displayedData).toEqual(data.filter((item) => filterByColorSchema(item) && filterByType(item)));
    await wait();
    expect(onFilterChangeFn).toHaveBeenCalledTimes(3);
    expect(onFilterChangeFn.lastValues.filterList).toEqual(FILTERS_WITH_VALUES.slice(0, 2));

    // removeFilter
    act(() => {
      filterLastResult().removeFilter(FILTERS_WITH_VALUES[0].key);
    });
    expect(filterLastResult().filterList).toEqual([FILTERS_WITH_VALUES[1]]);
    expect(lastResult().displayedData).toEqual(data.filter(filterByType));
    await wait();
    expect(onFilterChangeFn).toHaveBeenCalledTimes(4);
    expect(onFilterChangeFn.lastValues.filterList).toEqual([FILTERS_WITH_VALUES[1]]);

    act(() => {
      filterLastResult().clearFilterList();
    });
    await wait();
    expect(onFilterChangeFn).toHaveBeenCalledTimes(5);

    // addFilter with array
    act(() => {
      filterLastResult().addFilter(FILTERS_WITH_VALUES.slice(0, 2));
    });
    expect(filterLastResult().filterList).toEqual(FILTERS_WITH_VALUES.slice(0, 2));
    expect(lastResult().displayedData).toEqual(data.filter((item) => filterByColorSchema(item) && filterByType(item)));
    await wait();
    expect(onFilterChangeFn).toHaveBeenCalledTimes(6);
    expect(onFilterChangeFn.lastValues.filterList).toEqual(FILTERS_WITH_VALUES.slice(0, 2));

    // multiple React-batched operations
    act(() => {
      filterLastResult().clearFilterList();
      filterLastResult().addFilter(FILTERS_WITH_VALUES[0]);
      filterLastResult().addFilter(FILTERS_WITH_VALUES[2]);
    });
    expect(filterLastResult().filterList).toEqual([FILTERS_WITH_VALUES[0], FILTERS_WITH_VALUES[2]]);
    await wait();
  });

  it("selectedData", async () => {
    const { selectionLastResult, HookComponent } = initTest();
    const data = getData(10);
    const initialSelectedData = data.slice(5, 10);
    wrapper = mount(
      <DataControllerProvider data={data} selectable initialSelectedData={initialSelectedData}>
        <HookComponent />
      </DataControllerProvider>
    );
    expect(selectionLastResult().selectedData).toEqual(initialSelectedData);

    // addSelected
    act(() => {
      selectionLastResult().addSelected(data[4]);
    });
    expect(selectionLastResult().selectedData).toEqual([data[4], ...initialSelectedData]);

    // clearSelected
    act(() => {
      selectionLastResult().clearSelected();
    });
    expect(selectionLastResult().selectedData).toEqual([]);

    // setSelected
    act(() => {
      selectionLastResult().setSelected(data.slice(0, 2));
    });
    expect(selectionLastResult().selectedData).toEqual(data.slice(0, 2));

    // removeSelected
    act(() => {
      selectionLastResult().removeSelected(data[1]);
    });
    expect(selectionLastResult().selectedData).toEqual([data[0]]);

    act(() => {
      selectionLastResult().clearSelected();
    });

    // addSelected with array
    act(() => {
      selectionLastResult().addSelected(data.slice(0, 2));
    });
    expect(selectionLastResult().selectedData).toEqual(data.slice(0, 2));

    // addSelected with already added items
    act(() => {
      selectionLastResult().addSelected(data.slice(1, 3));
    });
    expect(selectionLastResult().selectedData).toEqual(data.slice(0, 3));

    // multiple React-batched operations
    act(() => {
      selectionLastResult().clearSelected();
      selectionLastResult().addSelected(data[4]);
      selectionLastResult().addSelected(data[1]);
    });
    expect(selectionLastResult().selectedData).toEqual([data[1], data[4]]);
    await wait();
  });

  it("selectedData with data change", async () => {
    const { selectionLastResult, HookComponent } = initTest();
    const data1 = getData(10);
    wrapper = mount(
      <DataControllerProvider data={data1} selectable initialSelectedData={data1.slice(0, 3)}>
        <HookComponent />
      </DataControllerProvider>
    );

    // check item change propagation
    const data2 = [{ ...data1[0], content: "changedItem" }, ...data1.slice(1)];
    wrapper.setProps({ data: data2 });
    expect(selectionLastResult().selectedData).toEqual(data2.slice(0, 3));

    // check item order change propagation
    const data3 = [data2[2], data2[1], data2[0], ...data2.slice(3)];
    wrapper.setProps({ data: data3 });
    expect(selectionLastResult().selectedData).toEqual(data3.slice(0, 3));

    // selection should be preserved even if item is no longer in "data" (e.g. user added filter which matched no item)
    wrapper.setProps({ data: [] });
    expect(selectionLastResult().selectedData).toEqual(data3.slice(0, 3));
  });

  it("isSelected", async () => {
    const { selectionLastResult, HookComponent } = initTest();
    const data = getData(10);
    wrapper = mount(
      <DataControllerProvider data={data} selectable>
        <HookComponent />
      </DataControllerProvider>
    );

    expect(selectionLastResult().isSelected(data[5])).toBe(false);
    act(() => {
      selectionLastResult().setSelected([data[5]]);
    });
    expect(selectionLastResult().isSelected(data[5])).toBe(true);
  });

  it("isDisplayedSelected", async () => {
    const { lastResult, selectionLastResult, HookComponent } = initTest();
    const data = getData(10);
    const initialSelectedData = data.slice(5, 10);
    wrapper = mount(
      <DataControllerProvider data={data} selectable initialSelectedData={initialSelectedData}>
        <HookComponent />
      </DataControllerProvider>
    );

    act(() => {
      selectionLastResult().toggleIsDisplayedSelected();
    });
    expect(lastResult().displayedData).toEqual(initialSelectedData);
  });
});
