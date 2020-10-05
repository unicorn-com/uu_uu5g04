import UU5 from "uu5g04";
import { usePagingListData } from "uu5g04-hooks";

const { renderHook, wait, act } = UU5.Test.Tools;

async function renderHookAndLoad2Pages(...initialHookParams) {
  let onLoad = jest.fn(async (params) => {
    let { pageIndex } = (params && params.pageInfo) || {};
    if (pageIndex === 2) return LOAD_DATA2;
    return LOAD_DATA1;
  });
  let result = renderHook(
    usePagingListData,
    { onLoad, pageSize: LOAD_DATA1.pageInfo.pageSize, ...initialHookParams[0] },
    ...initialHookParams.slice(1)
  );
  await wait();
  act(() => {
    result.lastResult().handleLoad({ pageInfo: { pageIndex: 2 } }, true);
  });
  await wait();
  result.expectedData = LOAD_DATA1.itemList.concat([undefined, undefined, undefined], LOAD_DATA2.itemList);
  return result;
}

const INITIAL_DATA1 = {
  itemList: [{ id: "id1", value: "init1" }],
  pageInfo: {
    pageIndex: 0,
    pageSize: 1,
    total: 3,
  },
};
const LOAD_DATA1 = {
  itemList: [
    { id: "id1", value: "a" },
    { id: "id2", value: "b" },
    { id: "id3", value: "c" },
  ],
  pageInfo: {
    pageIndex: 0,
    pageSize: 3,
    total: 7,
  },
};
const LOAD_DATA2 = {
  itemList: [
    { id: "idA", value: "1" },
    { id: "idB", value: "2" },
  ],
  pageInfo: {
    pageIndex: 2,
    pageSize: 3,
    total: 8,
  },
};
const PAGE_SIZE1 = 7;

describe("[uu5g04-hooks] usePagingListDataManager behaviour", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(usePagingListData);
    expect(lastResult()).toMatchObject({
      syncData: null,
      asyncData: null,
      pageInfo: null,
      viewState: "ready",
      errorState: null,
      error: null,
      handleLoad: expect.any(Function),
      handleCreate: expect.any(Function),
      handleUpdate: expect.any(Function),
      handleDelete: expect.any(Function),
    });
  });

  it("data; should accept initial data (using { itemList, pageInfo })", () => {
    let { lastResult } = renderHook(usePagingListData, { data: INITIAL_DATA1 });
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1.itemList,
      asyncData: INITIAL_DATA1.itemList,
      pageInfo: INITIAL_DATA1.pageInfo,
      viewState: "ready",
      errorState: null,
      error: null,
    });
  });

  it("data; should accept initial data (using array)", () => {
    let data = [{ id: "a" }, { id: "b" }];
    let { lastResult } = renderHook(usePagingListData, { data });
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      pageInfo: null,
      viewState: "ready",
      errorState: null,
      error: null,
    });
  });

  it("data; should use initial data without calling onLoad", async () => {
    let onLoad = jest.fn(async () => LOAD_DATA1);
    let { lastResult } = renderHook(usePagingListData, { onLoad, data: INITIAL_DATA1 });
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1.itemList,
      asyncData: INITIAL_DATA1.itemList,
      pageInfo: INITIAL_DATA1.pageInfo,
      viewState: "ready",
      errorState: null,
      error: null,
    });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(0);
  });

  it("pageSize; should pass pageSize into onLoad call automatically", async () => {
    let onLoad = jest.fn(async () => LOAD_DATA1);
    renderHook(usePagingListData, { onLoad, pageSize: PAGE_SIZE1 });
    await wait();
    expect(onLoad).lastCalledWith({ pageInfo: { pageSize: PAGE_SIZE1 } });
  });

  it("handleLoad; should provide data having 'total' length with some items being 'undefined'", async () => {
    let { lastResult } = renderHook(usePagingListData, {
      onLoad: async () => LOAD_DATA1,
      pageSize: LOAD_DATA1.pageInfo.pageSize,
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1.itemList.concat([undefined, undefined, undefined, undefined]),
      asyncData: LOAD_DATA1.itemList.concat([undefined, undefined, undefined, undefined]),
    });
  });

  it("handleLoad(params, true); should merge new pages into existing data & should update total length", async () => {
    let onLoad = jest.fn(async (params) => {
      let { pageIndex } = (params && params.pageInfo) || {};
      if (pageIndex === 2) return LOAD_DATA2;
      return LOAD_DATA1;
    });
    let { lastResult } = renderHook(usePagingListData, { onLoad, pageSize: LOAD_DATA1.pageInfo.pageSize });
    await wait();
    act(() => {
      lastResult().handleLoad({ pageInfo: { pageIndex: 2 } }, true);
    });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1.itemList.concat([undefined, undefined, undefined], LOAD_DATA2.itemList),
      asyncData: LOAD_DATA1.itemList.concat([undefined, undefined, undefined], LOAD_DATA2.itemList),
    });
  });

  it("handleLoad(params, false); should overwrite existing data & should update total length", async () => {
    let onLoad = jest.fn(async (params) => {
      let { pageIndex } = (params && params.pageInfo) || {};
      if (pageIndex === 2) return LOAD_DATA2;
      return LOAD_DATA1;
    });
    let { lastResult } = renderHook(usePagingListData, { onLoad, pageSize: LOAD_DATA1.pageInfo.pageSize });
    await wait();
    act(() => {
      lastResult().handleLoad({ pageInfo: { pageIndex: 2 } }, false);
    });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(lastResult()).toMatchObject({
      syncData: new Array(LOAD_DATA1.pageInfo.pageSize * 2).fill(undefined).concat(LOAD_DATA2.itemList),
      asyncData: new Array(LOAD_DATA1.pageInfo.pageSize * 2).fill(undefined).concat(LOAD_DATA2.itemList),
    });
  });

  it("handleLoad; should pass extra call args to onLoad()", async () => {
    let onLoad = jest.fn(async () => null);
    let pageSize = 30;
    let { lastResult } = renderHook(usePagingListData, { onLoad, pageSize });
    await wait();
    act(() => {
      lastResult().handleLoad({ pageInfo: {} }, false, "b", 123, false);
    });
    await wait();
    expect(onLoad).lastCalledWith({ pageInfo: { pageSize } }, false, "b", 123, false);
  });

  it("handleCreate; should not choke on undefined items in data", async () => {
    const CREATE1 = { key: "created1" };
    let onCreate = jest.fn(async () => null);

    let { lastResult, expectedData } = await renderHookAndLoad2Pages({ onCreate });
    act(() => {
      lastResult().handleCreate(CREATE1);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: expectedData.concat([CREATE1]),
      asyncData: expectedData.concat([CREATE1]),
    });
  });

  it("handleUpdate; should not choke on undefined items in data", async () => {
    const UPDATE1 = { key: "updated1" };
    let onUpdate = jest.fn(async () => null);

    let { lastResult, expectedData } = await renderHookAndLoad2Pages({ onUpdate });
    act(() => {
      lastResult().handleUpdate("idA", UPDATE1);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: expectedData.map((it) => (it && it.id === "idA" ? { ...it, ...UPDATE1 } : it)),
      asyncData: expectedData.map((it) => (it && it.id === "idA" ? { ...it, ...UPDATE1 } : it)),
    });
  });

  it("handleDelete; should not choke on undefined items in data", async () => {
    let onDelete = jest.fn(async () => null);

    let { lastResult, expectedData } = await renderHookAndLoad2Pages({ onDelete });
    act(() => {
      lastResult().handleDelete("idA");
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: expectedData.filter((it) => !it || it.id !== "idA"),
      asyncData: expectedData.filter((it) => !it || it.id !== "idA"),
    });
  });

  it("setData; should set new data", async () => {
    let { lastResult } = renderHook(usePagingListData, { data: INITIAL_DATA1 });
    await wait();

    act(() => {
      lastResult().setData(LOAD_DATA1.itemList);
    });
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1.itemList,
      asyncData: LOAD_DATA1.itemList,
      viewState: "ready",
      errorState: null,
      error: null,
    });
  });
});
