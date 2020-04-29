import UU5 from "uu5g04";
import { usePagingListData } from "uu5g04-hooks";

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs }) {
  let result = usePagingListData(...hookArgs);
  // NOTE Using Inner to measure render counts of subtrees (hooks are allowed to change their state during render
  // because it results in re-calling of the Component but not of its subtree - we don't want to measure these
  // shallow re-renders).
  return <Inner result={result}>{children}</Inner>;
}
function Inner({ children, result }) {
  return children(result);
}

const INITIAL_DATA1 = {
  itemList: [{ id: "id1", value: "init1" }],
  pageInfo: {
    pageIndex: 0,
    pageSize: 1,
    total: 3
  }
};
const LOAD_DATA1 = {
  itemList: [{ id: "id1", value: "a" }, { id: "id2", value: "b" }, { id: "id3", value: "c" }],
  pageInfo: {
    pageIndex: 0,
    pageSize: 3,
    total: 7
  }
};
const LOAD_DATA2 = {
  itemList: [{ id: "idA", value: "1" }, { id: "idB", value: "2" }],
  pageInfo: {
    pageIndex: 2,
    pageSize: 3,
    total: 8
  }
};
const PAGE_SIZE1 = 7;

function mountHook(...hookArgs) {
  let renderFn = jest.fn(() => <div />);
  let wrapper = mount(<Component hookArgs={hookArgs}>{renderFn}</Component>);
  return {
    lastResult: () => renderFn.mock.calls[renderFn.mock.calls.length - 1][0],
    renderCount: () => renderFn.mock.calls.length,
    changeArgs: (...newArgs) => wrapper.setProps({ hookArgs: newArgs })
  };
}

async function mountHookAndLoad2Pages(hookParams) {
  let onLoad = jest.fn(async params => {
    let { pageIndex } = (params && params.pageInfo) || {};
    if (pageIndex === 2) return LOAD_DATA2;
    return LOAD_DATA1;
  });
  let result = mountHook({ onLoad, pageSize: LOAD_DATA1.pageInfo.pageSize, ...hookParams });
  await wait();
  result.lastResult().handleLoad({ pageInfo: { pageIndex: 2 } }, true);
  await wait();
  result.expectedData = LOAD_DATA1.itemList.concat([undefined, undefined, undefined], LOAD_DATA2.itemList);
  return result;
}

describe("[uu5g04-hooks] usePagingListDataManager behaviour", () => {
  let lastResult, renderCount, changeArgs;

  it("should return expected result API", () => {
    ({ lastResult } = mountHook());
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
      handleDelete: expect.any(Function)
    });
  });

  it("data; should accept initial data (using { itemList, pageInfo })", () => {
    ({ lastResult } = mountHook({ data: INITIAL_DATA1 }));
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1.itemList,
      asyncData: INITIAL_DATA1.itemList,
      pageInfo: INITIAL_DATA1.pageInfo,
      viewState: "ready",
      errorState: null,
      error: null
    });
  });

  it("data; should accept initial data (using array)", () => {
    let data = [{ id: "a" }, { id: "b" }];
    ({ lastResult } = mountHook({ data }));
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      pageInfo: null,
      viewState: "ready",
      errorState: null,
      error: null
    });
  });

  it("data; should use initial data without calling onLoad", async () => {
    let onLoad = jest.fn(async () => LOAD_DATA1);
    ({ lastResult } = mountHook({ onLoad, data: INITIAL_DATA1 }));
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1.itemList,
      asyncData: INITIAL_DATA1.itemList,
      pageInfo: INITIAL_DATA1.pageInfo,
      viewState: "ready",
      errorState: null,
      error: null
    });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(0);
  });

  it("pageSize; should pass pageSize into onLoad call automatically", async () => {
    let onLoad = jest.fn(async () => LOAD_DATA1);
    ({ lastResult } = mountHook({ onLoad, pageSize: PAGE_SIZE1 }));
    await wait();
    expect(onLoad).lastCalledWith({ pageInfo: { pageSize: PAGE_SIZE1 } });
  });

  it("handleLoad; should provide data having 'total' length with some items being 'undefined'", async () => {
    ({ lastResult } = mountHook({ onLoad: async () => LOAD_DATA1, pageSize: LOAD_DATA1.pageInfo.pageSize }));
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1.itemList.concat([undefined, undefined, undefined, undefined]),
      asyncData: LOAD_DATA1.itemList.concat([undefined, undefined, undefined, undefined])
    });
  });

  it("handleLoad(params, true); should merge new pages into existing data & should update total length", async () => {
    let onLoad = jest.fn(async params => {
      let { pageIndex } = (params && params.pageInfo) || {};
      if (pageIndex === 2) return LOAD_DATA2;
      return LOAD_DATA1;
    });
    ({ lastResult } = mountHook({ onLoad, pageSize: LOAD_DATA1.pageInfo.pageSize }));
    await wait();
    lastResult().handleLoad({ pageInfo: { pageIndex: 2 } }, true);
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1.itemList.concat([undefined, undefined, undefined], LOAD_DATA2.itemList),
      asyncData: LOAD_DATA1.itemList.concat([undefined, undefined, undefined], LOAD_DATA2.itemList)
    });
  });

  it("handleLoad(params, false); should overwrite existing data & should update total length", async () => {
    let onLoad = jest.fn(async params => {
      let { pageIndex } = (params && params.pageInfo) || {};
      if (pageIndex === 2) return LOAD_DATA2;
      return LOAD_DATA1;
    });
    ({ lastResult } = mountHook({ onLoad, pageSize: LOAD_DATA1.pageInfo.pageSize }));
    await wait();
    lastResult().handleLoad({ pageInfo: { pageIndex: 2 } }, false);
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(lastResult()).toMatchObject({
      syncData: new Array(LOAD_DATA1.pageInfo.pageSize * 2).fill(undefined).concat(LOAD_DATA2.itemList),
      asyncData: new Array(LOAD_DATA1.pageInfo.pageSize * 2).fill(undefined).concat(LOAD_DATA2.itemList)
    });
  });

  it("handleLoad; should pass extra call args to onLoad()", async () => {
    let onLoad = jest.fn(async () => null);
    let pageSize = 30;
    ({ lastResult, renderCount } = mountHook({ onLoad, pageSize }));
    await wait();
    lastResult().handleLoad({ pageInfo: {} }, false, "b", 123, false);
    await wait();
    expect(onLoad).lastCalledWith({ pageInfo: { pageSize } }, false, "b", 123, false);
  });

  it("handleCreate; should not choke on undefined items in data", async () => {
    const CREATE1 = { key: "created1" };
    let onCreate = jest.fn(async () => null);

    let expectedData;
    ({ lastResult, expectedData } = await mountHookAndLoad2Pages({ onCreate }));
    lastResult().handleCreate(CREATE1);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: expectedData.concat([CREATE1]),
      asyncData: expectedData.concat([CREATE1])
    });
  });

  it("handleUpdate; should not choke on undefined items in data", async () => {
    const UPDATE1 = { key: "updated1" };
    let onUpdate = jest.fn(async () => null);

    let expectedData;
    ({ lastResult, expectedData } = await mountHookAndLoad2Pages({ onUpdate }));
    lastResult().handleUpdate("idA", UPDATE1);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: expectedData.map(it => (it && it.id === "idA" ? { ...it, ...UPDATE1 } : it)),
      asyncData: expectedData.map(it => (it && it.id === "idA" ? { ...it, ...UPDATE1 } : it))
    });
  });

  it("handleDelete; should not choke on undefined items in data", async () => {
    let onDelete = jest.fn(async () => null);

    let expectedData;
    ({ lastResult, expectedData } = await mountHookAndLoad2Pages({ onDelete }));
    lastResult().handleDelete("idA");
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: expectedData.filter(it => !it || it.id !== "idA"),
      asyncData: expectedData.filter(it => !it || it.id !== "idA")
    });
  });

  it("setData; should set new data", async () => {
    ({ lastResult, renderCount, changeArgs } = mountHook({ data: INITIAL_DATA1 }));
    await wait();

    lastResult().setData(LOAD_DATA1.itemList);
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1.itemList,
      asyncData: LOAD_DATA1.itemList,
      viewState: "ready",
      errorState: null,
      error: null
    });
  });
});
