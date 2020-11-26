import { useDataList } from "uu5g04-hooks";
import { renderHook, wait, act } from "uu5g05-test";

const INITIAL_DATA1 = [{ id: "id1", value: "x" }];
const LOAD_DATA1 = [
  { id: "id1", value: "a" },
  { id: "id2", value: "b" },
  { id: "id3", value: "c" },
  { id: "id4", value: "d" },
];
const LOAD_DATA2 = [{ id: "idA", value: "1" }];
const SERVER_DATA = [...LOAD_DATA1];

async function renderWithServerData(serverData0, extraHandlers) {
  let serverData = JSON.parse(JSON.stringify(serverData0));
  let handlerMap = {
    load: jest.fn(async ({ pageInfo }) => {
      let { pageIndex = 0 } = pageInfo;
      return { itemList: [serverData[pageIndex]], pageInfo: { pageIndex, pageSize: 1, total: serverData.length } };
    }),
    ...extraHandlers,
  };
  let result = renderHook(useDataList, { handlerMap, pageSize: 1 });
  await wait();
  return { ...result, handlerMap, serverData };
}

function expectedItem({ data, state = "ready", errorData = null, pendingData = null, handlerMap } = {}) {
  return data != null
    ? {
        data,
        state,
        errorData,
        pendingData,
        handlerMap: expectedHandlerMap(handlerMap ?? { setData: true }),
      }
    : data;
}
function expectedHandlerMap(handlerMap = LIST_HANDLER_MAP) {
  let r = {};
  for (let k in handlerMap) r[k] = handlerMap[k] ? expect.any(Function) : null;
  return r;
}
function expectedResult({
  data = expect.any(Object),
  newData = expect.any(Array),
  state = expect.any(String),
  pendingData = expect.any(Object),
  errorData = expect.any(Object),
  handlerMap = expect.any(Object),
  pageSize = expect.any(Number),
} = {}) {
  return { data, newData, state, pendingData, errorData, handlerMap, pageSize };
}
const LIST_HANDLER_MAP = {
  setData: true,
};

async function filterConsoleError(filterFn, execFn) {
  let orig = console.error;
  console.error = function (...args) {
    if (filterFn(...args)) return orig.apply(this, arguments);
  };
  try {
    await execFn();
  } finally {
    console.error = orig;
  }
}

describe("[uu5g04-hooks] useDataList", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1 });
    expect(lastResult()).toEqual({
      data: INITIAL_DATA1.map((data) => expectedItem({ data })),
      newData: [],
      state: "ready",
      errorData: null,
      pendingData: null,
      handlerMap: expectedHandlerMap(),
      pageSize: 50,
    });
  });

  it("prop initialData; should use initial data", () => {
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1 });
    expect(lastResult()).toEqual({
      data: INITIAL_DATA1.map((data) => expectedItem({ data })),
      newData: [],
      state: "ready",
      errorData: null,
      pendingData: null,
      handlerMap: expectedHandlerMap(),
      pageSize: 50,
    });
  });

  it("prop initialData; should use initial data without calling handlerMap.load", async () => {
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1, handlerMap });
    expect(lastResult()).toEqual({
      data: INITIAL_DATA1.map((data) => expectedItem({ data })),
      newData: [],
      state: "ready",
      errorData: null,
      pendingData: null,
      handlerMap: expectedHandlerMap({ load: true, loadNext: true, setData: true }),
      pageSize: 50,
    });
    await wait();
    expect(handlerMap.load).toHaveBeenCalledTimes(0);
  });

  it("prop skipInitialLoad; should skip initial load (no data)", async () => {
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataList, { skipInitialLoad: true, handlerMap });
    expect(lastResult()).toEqual({
      data: null,
      newData: [],
      state: "readyNoData",
      errorData: null,
      pendingData: null,
      handlerMap: expectedHandlerMap({ load: true, setData: true }),
      pageSize: 50,
    });
    await wait();
    expect(handlerMap.load).toHaveBeenCalledTimes(0);
  });

  it("prop skipInitialLoad; should skip initial load (with data)", async () => {
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataList, { skipInitialLoad: true, initialData: INITIAL_DATA1, handlerMap });
    expect(lastResult()).toEqual({
      data: INITIAL_DATA1.map((data) => expectedItem({ data })),
      newData: [],
      state: "ready",
      errorData: null,
      pendingData: null,
      handlerMap: expectedHandlerMap({ setData: true, load: true, loadNext: true }),
      pageSize: 50,
    });
    await wait();
    expect(handlerMap.load).toHaveBeenCalledTimes(0);
  });

  it("prop initialDtoIn; should pass initialDtoIn to initial load", async () => {
    let initialDtoIn = { a: "b" };
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    renderHook(useDataList, { handlerMap, initialDtoIn });
    await wait();
    expect(handlerMap.load).toHaveBeenCalledTimes(1);
    expect(handlerMap.load).toHaveBeenCalledWith(initialDtoIn);
  });

  it("prop pageSize; should add pageSize to initial load", async () => {
    let initialDtoIn = { a: "b" };
    let pageSize = 8;
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    renderHook(useDataList, { handlerMap, initialDtoIn, pageSize });
    await wait();
    expect(handlerMap.load).toHaveBeenCalledTimes(1);
    expect(handlerMap.load).toHaveBeenCalledWith({ ...initialDtoIn, pageInfo: { pageSize } });
  });

  it("prop pageSize; should add pageSize to handlerMap.load* methods", async () => {
    let initialDtoIn = { a: "b" };
    let pageSize = 8;
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
      loadNext: jest.fn(async () => LOAD_DATA1),
    };
    // initial load
    let { lastResult } = renderHook(useDataList, { handlerMap, initialDtoIn, pageSize });
    expect(lastResult()).toEqual(
      expectedResult({
        pendingData: { operation: "load", dtoIn: { ...initialDtoIn, pageInfo: { pageSize } } },
      })
    );
    await wait();
    expect(handlerMap.load).toHaveBeenCalledTimes(1);
    expect(handlerMap.load).toHaveBeenCalledWith({ ...initialDtoIn, pageInfo: { pageSize } });

    // explicit load
    handlerMap.load.mockClear();
    act(() => {
      lastResult().handlerMap.load();
    });
    expect(lastResult()).toEqual(
      expectedResult({
        pendingData: { operation: "load", dtoIn: { pageInfo: { pageSize } } },
      })
    );
    await wait();
    expect(handlerMap.load).toHaveBeenCalledTimes(1);
    expect(handlerMap.load).toHaveBeenCalledWith({ pageInfo: { pageSize } });

    // explicit loadNext
    act(() => {
      lastResult().handlerMap.loadNext({ pageInfo: { pageIndex: 1 } });
    });
    expect(lastResult()).toEqual(
      expectedResult({
        pendingData: { operation: "loadNext", dtoIn: { pageInfo: { pageIndex: 1, pageSize } } },
      })
    );
    await wait();
    expect(handlerMap.loadNext).toHaveBeenCalledTimes(1);
    expect(handlerMap.loadNext).toHaveBeenCalledWith({ pageInfo: { pageIndex: 1, pageSize } });
  });

  it("prop itemIdentifier; should match items using itemIdentifier during operations (default 'id' / custom string / array)", async () => {
    let data = [
      { id: "id1", code: "code1", combo1: "a", combo2: "A", value: 0 },
      undefined,
      { id: "id2", code: "code2", combo1: "a", combo2: "B", value: 0 },
      { id: "id3", code: "code3", combo1: "b", combo2: "A", value: 0 },
      { id: "id4", code: "code4", combo1: "b", combo2: "B", value: 0 },
    ];
    let handlerMap = {
      update: jest.fn(async (newData, extraInfo) => ({ ...data[extraInfo], ...newData })),
    };
    let testWith = async function (itemIdentifier, updateOpts, expectedChangedItemIndex) {
      let { lastResult } = renderHook(useDataList, { initialData: data, handlerMap, itemIdentifier });
      await wait();
      act(() => {
        lastResult().handlerMap.update({ ...updateOpts, value: 10 }, expectedChangedItemIndex);
      });
      await wait();
      let expectedData = data.map((it, i) => (expectedChangedItemIndex === i ? { ...it, value: 10 } : it));
      expect(lastResult()).toEqual(expectedResult({ data: expectedData.map((data) => expectedItem({ data })) }));
    };

    await testWith(undefined, { id: "id2" }, 2);
    await testWith("code", { code: "code3" }, 3);
    await testWith(["combo1", "combo2"], { combo1: "b", combo2: "B" }, 4);
  });

  it("prop handlerMap.load; should apply result of initial onLoad (success)", async () => {
    let pageSize = 10;
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataList, { handlerMap, pageSize });
    expect(lastResult()).toEqual(
      expectedResult({
        data: null,
        state: "pendingNoData",
        errorData: null,
        pendingData: { operation: "load", dtoIn: { pageInfo: { pageSize: 10 } } },
      })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1.map((data) => expectedItem({ data })),
        state: "ready",
        errorData: null,
        pendingData: null,
      })
    );
    expect(handlerMap.load).toHaveBeenCalledTimes(1);
  });

  it("prop handlerMap.load; should apply result of initial onLoad (error)", async () => {
    let error = 123;
    let pageSize = 10;
    let handlerMap = {
      load: jest.fn(async () => {
        throw (error = new Error("Test error"));
      }),
    };
    await filterConsoleError(
      (...args) => {
        return args.every((arg) => (arg + "").indexOf("Test error") === -1);
      },
      async () => {
        let { lastResult } = renderHook(useDataList, { handlerMap, pageSize });
        await wait();
        expect(lastResult()).toEqual(
          expectedResult({
            data: null,
            state: "errorNoData",
            pendingData: null,
            errorData: { operation: "load", dtoIn: { pageInfo: { pageSize } }, error },
          })
        );
        expect(handlerMap.load).toHaveBeenCalledTimes(1);
      }
    );
  });

  it("handlerMap.*; should be present in result depending on current load state", async () => {
    let pageSize = 10;
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
      custom: jest.fn(async () => null),
    };
    // initial with no data
    let { lastResult } = renderHook(useDataList, { handlerMap, pageSize, skipInitialLoad: true });
    expect(lastResult()).toEqual(expectedResult({ handlerMap: expectedHandlerMap({ load: true, setData: true }) }));

    // during "load"
    act(() => {
      lastResult().handlerMap.load();
    });
    expect(lastResult()).toEqual(expectedResult({ handlerMap: expectedHandlerMap({}) }));
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({ handlerMap: expectedHandlerMap({ load: true, loadNext: true, setData: true, custom: true }) })
    );

    // during "loadNext"
    act(() => {
      lastResult().handlerMap.loadNext();
    });
    expect(lastResult()).toEqual(
      expectedResult({ handlerMap: expectedHandlerMap({ load: true, loadNext: true, setData: true, custom: true }) })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({ handlerMap: expectedHandlerMap({ load: true, loadNext: true, setData: true, custom: true }) })
    );

    // during custom operation (<=> bulk operation)
    act(() => {
      lastResult().handlerMap.custom();
    });
    expect(lastResult()).toEqual(
      expectedResult({ handlerMap: expectedHandlerMap({ load: true, loadNext: true, setData: true, custom: true }) })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({ handlerMap: expectedHandlerMap({ load: true, loadNext: true, setData: true, custom: true }) })
    );
  });

  it("handlerMap.load; should do load (success)", async () => {
    let pageSize = 10;
    let handlerMap = {
      load: jest
        .fn()
        .mockImplementationOnce(async () => LOAD_DATA1)
        .mockImplementationOnce(async () => LOAD_DATA2),
    };
    const LOAD_PARAMS = { p: "v" };
    let { lastResult } = renderHook(useDataList, { handlerMap, pageSize });
    await wait();

    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1.map((data) => expectedItem({ data })),
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );

    let handleLoadResolved;
    act(() => {
      lastResult()
        .handlerMap.load(LOAD_PARAMS)
        .then(() => (handleLoadResolved = true));
    });
    expect(handlerMap.load).toHaveBeenCalledTimes(2);
    expect(handlerMap.load).lastCalledWith(LOAD_PARAMS);
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1.map((data) => expectedItem({ data, handlerMap: {} })),
        state: "pending",
        pendingData: { operation: "load", dtoIn: { ...LOAD_PARAMS, pageInfo: { pageSize: 10 } } },
        errorData: null,
      })
    );

    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA2.map((data) => expectedItem({ data })),
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(handleLoadResolved).toBe(true);
  });

  it("handlerMap.load; should do load (error) - should keep previous data", async () => {
    let error = 123;
    let pageSize = 10;
    let handlerMap = {
      load: jest
        .fn()
        .mockImplementationOnce(async () => LOAD_DATA1)
        .mockImplementationOnce(async () => {
          throw (error = new Error("Test error"));
        }),
    };
    let { lastResult } = renderHook(useDataList, { handlerMap, pageSize });
    await wait();

    let handleLoadResolved;
    act(() => {
      lastResult()
        .handlerMap.load()
        .catch((e) => null)
        .then(() => (handleLoadResolved = true));
    });
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1.map((data) => expectedItem({ data, handlerMap: {} })),
        state: "pending",
        pendingData: { operation: "load", dtoIn: { pageInfo: { pageSize: 10 } } },
        errorData: null,
      })
    );

    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1.map((data) => expectedItem({ data })),
        state: "error",
        pendingData: null,
        errorData: { operation: "load", dtoIn: { pageInfo: { pageSize: 10 } }, error },
      })
    );
    expect(handleLoadResolved).toBe(true);
  });

  it("handlerMap.loadNext; should load next page and preserve already loaded ones (success)", async () => {
    const PARAMS_PAGE_1 = { pageInfo: { pageIndex: 1 } };
    let { lastResult, handlerMap, serverData } = await renderWithServerData(SERVER_DATA);

    let handleLoadNextResolved;
    act(() => {
      lastResult()
        .handlerMap.loadNext(PARAMS_PAGE_1)
        .then(() => (handleLoadNextResolved = true));
    });
    expect(handlerMap.load).toHaveBeenCalledTimes(2); // loadNext should fallback to handlerMap.load if loadNext is not specified
    expect(handlerMap.load).lastCalledWith(PARAMS_PAGE_1);
    expect(lastResult()).toEqual(
      expectedResult({
        data: serverData.map((data, i) => (i > 0 ? undefined : data)).map((data) => expectedItem({ data })),
        state: "pending",
        pendingData: {
          operation: "loadNext",
          dtoIn: { ...PARAMS_PAGE_1, pageInfo: { ...PARAMS_PAGE_1.pageInfo, pageSize: 1 } },
        },
        errorData: null,
      })
    );

    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: serverData.map((data, i) => (i > 1 ? undefined : data)).map((data) => expectedItem({ data })),
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(handleLoadNextResolved).toBe(true);
  });

  it("handlerMap.loadNext; should load next page and preserve already loaded ones (error)", async () => {
    const PARAMS_PAGE_1 = { pageInfo: { pageIndex: 1 } };
    let error = 123;
    let { lastResult, handlerMap, serverData } = await renderWithServerData(SERVER_DATA);

    handlerMap.load.mockImplementationOnce(async () => {
      throw (error = new Error("Test error"));
    });
    let handleLoadNextResolved;
    act(() => {
      lastResult()
        .handlerMap.loadNext(PARAMS_PAGE_1)
        .catch((e) => null)
        .then(() => (handleLoadNextResolved = true));
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: serverData.map((data, i) => (i > 0 ? undefined : data)).map((data) => expectedItem({ data })),
        state: "error",
        pendingData: null,
        errorData: {
          operation: "loadNext",
          dtoIn: { ...PARAMS_PAGE_1, pageInfo: { ...PARAMS_PAGE_1.pageInfo, pageSize: 1 } },
          error,
        },
      })
    );
    expect(handleLoadNextResolved).toBe(true);
  });

  it("handlerMap.setData; should set data", async () => {
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1 });
    act(() => {
      lastResult().handlerMap.setData(LOAD_DATA1.map((data) => ({ data })));
    });
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1.map((data) => expectedItem({ data })),
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
  });

  it("handlerMap.<custom>; operates on a new item (success) - should add at the end (list is fully loaded)", async () => {
    const CALL_PARAM = { value: "v" };
    const CALL_RESPONSE = { id: "create1", ...CALL_PARAM };
    let handlerMap = {
      customCall: jest.fn(async () => CALL_RESPONSE),
    };
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1, handlerMap });
    await wait();

    let customCallResolved;
    act(() => {
      lastResult()
        .handlerMap.customCall(CALL_PARAM)
        .then(() => (customCallResolved = true));
    });
    expect(handlerMap.customCall).toHaveBeenCalledTimes(1);
    expect(handlerMap.customCall).toHaveBeenCalledWith(CALL_PARAM);
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1.map((data) => expectedItem({ data })),
        newData: [],
        state: "itemPending",
        pendingData: null,
        errorData: null,
      })
    );

    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1.concat([CALL_RESPONSE]).map((data) => expectedItem({ data })),
        newData: [],
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(customCallResolved).toBe(true);
  });

  it("handlerMap.<custom>; operates on a new item (success) - should add to newData (list is not fully loaded)", async () => {
    const CALL_PARAM = { value: "v" };
    const CALL_RESPONSE = { id: "create1", ...CALL_PARAM };
    let handlerMap = {
      customCall: jest.fn(async () => CALL_RESPONSE),
    };
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1.concat([undefined]), handlerMap });
    await wait();

    act(() => {
      lastResult().handlerMap.customCall(CALL_PARAM);
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1.map((data) => expectedItem({ data })).concat([undefined]),
        newData: [CALL_RESPONSE].map((data) => expectedItem({ data })),
      })
    );
  });

  it("handlerMap.<custom>; operates on a new item (error) - should end with rejection", async () => {
    const CALL_PARAM = { value: "v" };
    let error = 123;
    let handlerMap = {
      customCall: jest.fn(async () => {
        throw (error = new Error("Test error."));
      }),
    };
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1, handlerMap });
    await wait();

    let customCallResolved, rejected;
    act(() => {
      lastResult()
        .handlerMap.customCall(CALL_PARAM)
        .catch((e) => (rejected = e))
        .then(() => (customCallResolved = true));
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1.map((data) => expectedItem({ data })),
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(rejected).toBe(error);
    expect(customCallResolved).toBe(true);
  });

  it("handlerMap.<custom>; operates (update) on an existing item (success) - should update the item", async () => {
    const CALL_PARAM = { id: INITIAL_DATA1[0].id, value: "v" };
    const CALL_RESPONSE = { ...INITIAL_DATA1[0], ...CALL_PARAM };
    let handlerMap = {
      customCall: jest.fn(async () => CALL_RESPONSE),
    };
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1, handlerMap });
    await wait();

    let customCallResolved;
    act(() => {
      lastResult()
        .handlerMap.customCall(CALL_PARAM)
        .then(() => (customCallResolved = true));
    });
    expect(handlerMap.customCall).toHaveBeenCalledTimes(1);
    expect(handlerMap.customCall).toHaveBeenCalledWith(CALL_PARAM);
    expect(lastResult()).toEqual(
      expectedResult({
        data: [
          expectedItem({
            data: INITIAL_DATA1[0],
            state: "pending",
            pendingData: { operation: "customCall", dtoIn: CALL_PARAM },
            errorData: null,
            handlerMap: expectedHandlerMap({}),
          }),
        ].concat(INITIAL_DATA1.slice(1).map((data) => expectedItem({ data }))),
        newData: [],
        state: "itemPending",
        pendingData: null,
        errorData: null,
      })
    );

    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [CALL_RESPONSE].concat(INITIAL_DATA1.slice(1)).map((data) => expectedItem({ data })),
        newData: [],
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(customCallResolved).toBe(true);
  });

  it("handlerMap.<custom>; operates (delete) on an existing item (success) - should delete the item", async () => {
    const CALL_PARAM = { id: INITIAL_DATA1[0].id, value: "v" };
    const CALL_RESPONSE = null;
    let handlerMap = {
      customCall: jest.fn(async () => CALL_RESPONSE),
    };
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1, handlerMap });
    await wait();

    let customCallResolved;
    act(() => {
      lastResult()
        .handlerMap.customCall(CALL_PARAM)
        .then(() => (customCallResolved = true));
    });
    expect(handlerMap.customCall).toHaveBeenCalledTimes(1);
    expect(handlerMap.customCall).toHaveBeenCalledWith(CALL_PARAM);
    expect(lastResult()).toEqual(
      expectedResult({
        data: [
          expectedItem({
            data: INITIAL_DATA1[0],
            state: "pending",
            pendingData: { operation: "customCall", dtoIn: CALL_PARAM },
            errorData: null,
            handlerMap: expectedHandlerMap({}),
          }),
        ].concat(INITIAL_DATA1.slice(1).map((data) => expectedItem({ data }))),
        newData: [],
        state: "itemPending",
        pendingData: null,
        errorData: null,
      })
    );

    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1.slice(1).map((data) => expectedItem({ data })),
        newData: [],
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(customCallResolved).toBe(true);
  });

  it("handlerMap.<custom>; operates on an existing item (error) - should end with rejection", async () => {
    const CALL_PARAM = { id: INITIAL_DATA1[0].id, value: "v" };
    let error = 123;
    let handlerMap = {
      customCall: jest.fn(async () => {
        throw (error = new Error("Test error."));
      }),
    };
    let { lastResult } = renderHook(useDataList, { initialData: INITIAL_DATA1, handlerMap });
    await wait();

    let customCallResolved, rejected;
    act(() => {
      lastResult()
        .handlerMap.customCall(CALL_PARAM)
        .catch((e) => (rejected = e))
        .then(() => (customCallResolved = true));
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [
          expectedItem({
            data: INITIAL_DATA1[0],
            state: "error",
            pendingData: null,
            errorData: { operation: "customCall", dtoIn: CALL_PARAM, error },
            handlerMap: expectedHandlerMap({ setData: true }),
          }),
        ].concat(INITIAL_DATA1.slice(1).map((data) => expectedItem({ data }))),
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(rejected).toBe(error);
    expect(customCallResolved).toBe(true);
  });

  it("handlerMap.<custom>; bulk; operates on multiple items (partial success/error) - should apply some changes & rollback some", async () => {
    const CREATE = [{ value: "c1" }, { value: "c2" }, { value: "c3" }, { value: "c4" }];
    const CREATE1_OK = { id: "id-c1", ...CREATE[0] };
    const CREATE4_OK = { id: "id-c4", ...CREATE[3] };
    let create2Error = 123;
    let create3Error = 123;
    const UPDATE = [
      { id: "id1", value: "u1" },
      { id: "id2", value: "u2" },
      { id: "id3", value: "u3" },
      { id: "id4", value: "u4" },
    ];
    const UPDATE1_OK = { ...UPDATE[0] };
    const UPDATE4_OK = { ...UPDATE[3] };
    let update2Error = 123;
    let update3Error = 123;
    const DELETE = [{ id: "id1" }, { id: "id2" }, { id: "id3" }, { id: "id4" }];
    const DELETE1_OK = null;
    const DELETE4_OK = null;
    let delete2Error = 123;
    let delete3Error = 123;
    let data = [
      { id: "id1", value: "a" },
      { id: "id2", value: "b" },
      { id: "id3", value: "c" },
      { id: "id4", value: "d" },
      { id: "id5", value: "e" },
    ];
    let handlerMap = {
      create: jest.fn(async () =>
        Promise.reject([
          CREATE1_OK,
          (create2Error = new Error("BE")),
          (create3Error = { uuAppErrorMap: { code: {} } }),
          { uuAppErrorMap: {}, ...CREATE4_OK },
        ])
      ),
      update: jest.fn(async () =>
        Promise.reject([
          UPDATE1_OK,
          (update2Error = new Error("BE")),
          (update3Error = { uuAppErrorMap: { code: {} } }),
          { uuAppErrorMap: {}, ...UPDATE4_OK },
        ])
      ),
      delete: jest.fn(async () =>
        Promise.reject([
          DELETE1_OK,
          (delete2Error = new Error("BE")),
          (delete3Error = { uuAppErrorMap: { code: {} } }),
          { uuAppErrorMap: {}, ...DELETE4_OK },
        ])
      ),
    };
    let { lastResult } = renderHook(useDataList, { handlerMap, initialData: data, pageSize: 100 });
    await wait();
    let afterInitData = lastResult().data;

    // bulk create
    let rejected, resolved;
    act(() => {
      lastResult()
        .handlerMap.create(CREATE)
        .then(
          (v) => (resolved = v),
          (e) => (rejected = e)
        );
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [...data, CREATE1_OK, CREATE4_OK].map((data) => expectedItem({ data })),
        state: "ready",
        errorData: null,
        pendingData: null,
      })
    );
    expect(rejected).toBeTruthy();

    // bulk update
    resolved = rejected = undefined;
    act(() => {
      lastResult().handlerMap.setData(afterInitData);
      lastResult()
        .handlerMap.update(UPDATE)
        .then(
          (v) => (resolved = v),
          (e) => (rejected = e)
        );
    });
    expect(lastResult()).toEqual(
      expectedResult({
        data: UPDATE.map((item, i) =>
          expectedItem({
            data: data[i],
            state: "pending",
            pendingData: { operation: "update", dtoIn: UPDATE[i] },
            errorData: null,
            handlerMap: expectedHandlerMap({}),
          })
        ).concat(data.slice(4).map((data) => expectedItem({ data }))),
        state: "itemPending",
        pendingData: null,
        errorData: null,
      })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [
          expectedItem({ data: UPDATE1_OK }),
          expectedItem({
            data: data[1],
            state: "error",
            errorData: { operation: "update", dtoIn: UPDATE[1], error: update2Error },
          }),
          expectedItem({
            data: data[2],
            state: "error",
            errorData: { operation: "update", dtoIn: UPDATE[2], error: update3Error },
          }),
          expectedItem({ data: UPDATE4_OK }),
          ...data.slice(4).map((data) => expectedItem({ data })),
        ],
        state: "ready",
        errorData: null,
        pendingData: null,
      })
    );
    expect(rejected).toBeTruthy();

    // bulk delete
    resolved = rejected = undefined;
    act(() => {
      lastResult().handlerMap.setData(afterInitData);
      lastResult()
        .handlerMap.delete(DELETE)
        .then(
          (v) => (resolved = v),
          (e) => (rejected = e)
        );
    });
    expect(lastResult()).toEqual(
      expectedResult({
        data: DELETE.map((item, i) =>
          expectedItem({
            data: data[i],
            state: "pending",
            pendingData: { operation: "delete", dtoIn: DELETE[i] },
            errorData: null,
            handlerMap: expectedHandlerMap({}),
          })
        ).concat(data.slice(4).map((data) => expectedItem({ data }))),
        state: "itemPending",
        pendingData: null,
        errorData: null,
      })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [
          expectedItem({
            data: data[1],
            state: "error",
            errorData: { operation: "delete", dtoIn: DELETE[1], error: delete2Error },
          }),
          expectedItem({
            data: data[2],
            state: "error",
            errorData: { operation: "delete", dtoIn: DELETE[2], error: delete3Error },
          }),
          ...data.slice(4).map((data) => expectedItem({ data })),
        ],
        state: "ready",
        errorData: null,
        pendingData: null,
      })
    );
    expect(rejected).toBeTruthy();
  });

  it("data[].handlerMap.*; should be present in result depending on current load state", async () => {
    let data = [INITIAL_DATA1[0]];
    let handlerMap = { load: jest.fn(async () => data) };
    let itemHandlerMap = { custom: jest.fn(async () => data[0]) };
    let expectedHMR = (map) =>
      expectedResult({
        data: [
          expectedItem({
            data: data[0],
            handlerMap: expectedHandlerMap(map),
            errorData: expect.any(Object),
            pendingData: expect.any(Object),
            state: expect.any(String),
          }),
        ],
      });

    // initial
    let { lastResult } = renderHook(useDataList, { handlerMap, itemHandlerMap, initialData: data });
    expect(lastResult()).toEqual(expectedHMR({ custom: true, setData: true }));

    // during "load"
    act(() => {
      lastResult().handlerMap.load();
    });
    expect(lastResult()).toEqual(expectedHMR({}));
    await wait();
    expect(lastResult()).toEqual(expectedHMR({ custom: true, setData: true }));

    // during "loadNext"
    act(() => {
      lastResult().handlerMap.loadNext();
    });
    expect(lastResult()).toEqual(expectedHMR({ custom: true, setData: true }));
    await wait();
    expect(lastResult()).toEqual(expectedHMR({ custom: true, setData: true }));

    // during item operation
    act(() => {
      lastResult().data[0].handlerMap.custom();
    });
    expect(lastResult()).toEqual(expectedHMR({}));
    await wait();
    expect(lastResult()).toEqual(expectedHMR({ custom: true, setData: true }));
  });

  it("data[].handlerMap.setData; should set item data", async () => {
    let data = [
      { id: "id1", value: "a" },
      { id: "id2", value: "b" },
      { id: "id3", value: "c" },
    ];
    let itemHandlerMap = { custom: jest.fn(async () => null) };
    let { lastResult } = renderHook(useDataList, { initialData: data, itemHandlerMap });
    act(() => {
      lastResult().data[0].handlerMap.setData({ data: LOAD_DATA1[0] });
      lastResult().data[1].handlerMap.setData(null); // should remove
      lastResult().data[2].handlerMap.setData({ data: LOAD_DATA1[1], state: "custom" });
    });
    expect(lastResult()).toEqual(
      expectedResult({
        data: [
          expectedItem({ data: LOAD_DATA1[0], handlerMap: expectedHandlerMap({ setData: true, custom: true }) }), // should auto-add handlerMap
          expectedItem({
            data: LOAD_DATA1[1],
            state: "custom",
            handlerMap: expectedHandlerMap({ setData: true, custom: true }), // should auto-add handlerMap
          }),
        ],
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
  });

  it("data[].handlerMap.<custom>; operates (update) on an existing item (success) - should update the item", async () => {
    const CALL_PARAM = { value: "v" };
    const CALL_RESPONSE = { ...LOAD_DATA1[1], ...CALL_PARAM };
    let itemHandlerMap = { customCall: jest.fn(async () => CALL_RESPONSE) };
    let { lastResult } = renderHook(useDataList, { initialData: LOAD_DATA1, itemHandlerMap });
    await wait();

    let customCallResolved;
    act(() => {
      lastResult()
        .data[1].handlerMap.customCall(CALL_PARAM)
        .then(() => (customCallResolved = true));
    });
    expect(itemHandlerMap.customCall).toHaveBeenCalledTimes(1);
    expect(itemHandlerMap.customCall).toHaveBeenCalledWith({ id: LOAD_DATA1[1].id, ...CALL_PARAM });
    expect(lastResult()).toEqual(
      expectedResult({
        data: [
          expectedItem({ data: LOAD_DATA1[0], handlerMap: expectedHandlerMap({ setData: true, customCall: true }) }),
          expectedItem({
            data: LOAD_DATA1[1],
            state: "pending",
            pendingData: { operation: "customCall", dtoIn: { id: LOAD_DATA1[1].id, ...CALL_PARAM } },
            errorData: null,
            handlerMap: expectedHandlerMap({}),
          }),
          ...LOAD_DATA1.slice(2).map((data) =>
            expectedItem({ data, handlerMap: expectedHandlerMap({ setData: true, customCall: true }) })
          ),
        ],
        newData: [],
        state: "itemPending",
        pendingData: null,
        errorData: null,
      })
    );

    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [LOAD_DATA1[0], CALL_RESPONSE]
          .concat(LOAD_DATA1.slice(2))
          .map((data) => expectedItem({ data, handlerMap: expectedHandlerMap({ setData: true, customCall: true }) })),
        newData: [],
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(customCallResolved).toBe(true);
  });

  it("data[].handlerMap.<custom>; operates (delete) on an existing item (success) - should delete the item", async () => {
    const CALL_PARAM = { value: "v" };
    const CALL_RESPONSE = null;
    let itemHandlerMap = { customCall: jest.fn(async () => CALL_RESPONSE) };
    let { lastResult } = renderHook(useDataList, { initialData: LOAD_DATA1, itemHandlerMap });
    await wait();

    let customCallResolved;
    act(() => {
      lastResult()
        .data[1].handlerMap.customCall(CALL_PARAM)
        .then(() => (customCallResolved = true));
    });
    expect(itemHandlerMap.customCall).toHaveBeenCalledTimes(1);
    expect(itemHandlerMap.customCall).toHaveBeenCalledWith({ id: LOAD_DATA1[1].id, ...CALL_PARAM });
    expect(lastResult()).toEqual(
      expectedResult({
        data: [
          expectedItem({ data: LOAD_DATA1[0], handlerMap: expectedHandlerMap({ setData: true, customCall: true }) }),
          expectedItem({
            data: LOAD_DATA1[1],
            state: "pending",
            pendingData: { operation: "customCall", dtoIn: { id: LOAD_DATA1[1].id, ...CALL_PARAM } },
            errorData: null,
            handlerMap: expectedHandlerMap({}),
          }),
          ...LOAD_DATA1.slice(2).map((data) =>
            expectedItem({ data, handlerMap: expectedHandlerMap({ setData: true, customCall: true }) })
          ),
        ],
        newData: [],
        state: "itemPending",
        pendingData: null,
        errorData: null,
      })
    );

    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [LOAD_DATA1[0], ...LOAD_DATA1.slice(2)].map((data) =>
          expectedItem({ data, handlerMap: expectedHandlerMap({ setData: true, customCall: true }) })
        ),
        newData: [],
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(customCallResolved).toBe(true);
  });

  it("data[].handlerMap.<custom>; operates on an existing item (error) - should end with rejection", async () => {
    const CALL_PARAM = { value: "v" };
    let error = 123;
    let itemHandlerMap = {
      customCall: jest.fn(async () => {
        throw (error = new Error("Test error."));
      }),
    };
    let { lastResult } = renderHook(useDataList, { initialData: LOAD_DATA1, itemHandlerMap });
    await wait();

    let customCallResolved, rejected;
    act(() => {
      lastResult()
        .data[1].handlerMap.customCall(CALL_PARAM)
        .catch((e) => (rejected = e))
        .then(() => (customCallResolved = true));
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [
          expectedItem({ data: LOAD_DATA1[0], handlerMap: expectedHandlerMap({ setData: true, customCall: true }) }),
          expectedItem({
            data: LOAD_DATA1[1],
            state: "error",
            pendingData: null,
            errorData: { operation: "customCall", dtoIn: { id: LOAD_DATA1[1].id, ...CALL_PARAM }, error },
            handlerMap: expectedHandlerMap({ setData: true, customCall: true }),
          }),
          ...LOAD_DATA1.slice(2).map((data) =>
            expectedItem({ data, handlerMap: expectedHandlerMap({ setData: true, customCall: true }) })
          ),
        ],
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    expect(rejected).toBe(error);
    expect(customCallResolved).toBe(true);
  });

  it("newData; should remove items from 'newData' if they get loaded into 'data'", async () => {
    const CREATE1 = { value: "v" };
    const CREATE1_FULL = { id: "create1", ...CREATE1 };
    let serverData = [
      { id: "id1", value: 1 },
      { id: "id2", value: 2 },
    ];
    let handlerMap = {
      load: jest.fn(async ({ pageInfo }) => {
        let { pageIndex = 0 } = pageInfo;
        return { itemList: [serverData[pageIndex]], pageInfo: { pageIndex, pageSize: 1, total: serverData.length } };
      }),
      createItem: jest.fn(async () => {
        serverData.splice(1, 0, CREATE1_FULL); // add in-between
        return CREATE1_FULL;
      }),
    };
    let { lastResult } = renderHook(useDataList, { handlerMap, pageSize: 1 });
    await wait();
    act(() => {
      lastResult().handlerMap.createItem(CREATE1);
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [serverData[0], undefined].map((data) => expectedItem({ data })),
        newData: [CREATE1_FULL].map((data) => expectedItem({ data })),
      })
    );
    act(() => {
      lastResult().handlerMap.loadNext({ pageInfo: { pageIndex: 1 } });
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: [serverData[0], CREATE1_FULL, undefined].map((data) => expectedItem({ data })),
        newData: [],
      })
    );
  });

  it("newData; item operations should work on items in newData too", async () => {
    let data = [{ id: "id1", value: "a" }, { id: "id2", value: "b" }, undefined];
    const CREATE = [{ value: "c1" }, { value: "c2" }];
    const CREATE_FULL = CREATE.map((it, i) => ({ id: "c" + (i + 1), ...it }));
    let handlerMap = {
      createMulti: jest.fn(async () => CREATE_FULL),
      update1: jest.fn(async (v) => v),
      delete1: jest.fn(async (v) => null),
    };
    let itemHandlerMap = {
      itemUpdate: jest.fn(async (v) => v),
      itemDelete: jest.fn(async (v) => null),
    };
    let expectedReadyItem = (itemData) =>
      expectedItem({
        data: itemData,
        state: "ready",
        errorData: null,
        pendingData: null,
        handlerMap: expectedHandlerMap({ setData: true, itemUpdate: true, itemDelete: true }),
      });
    let { lastResult } = renderHook(useDataList, { initialData: data, handlerMap, itemHandlerMap, pageSize: 2 });
    await wait();
    act(() => {
      lastResult().handlerMap.createMulti(CREATE);
    });
    await wait();

    // update using list handlerMap
    act(() => {
      lastResult().handlerMap.update1({ id: "c1", value: "up1" });
    });
    expect(lastResult()).toEqual(
      expectedResult({
        data: data.map((data) => expectedReadyItem(data)),
        newData: [
          expectedItem({
            data: CREATE_FULL[0],
            state: "pending",
            pendingData: { operation: "update1", dtoIn: { id: "c1", value: "up1" } },
            errorData: null,
            handlerMap: expectedHandlerMap({}),
          }),
          expectedReadyItem(CREATE_FULL[1]),
        ],
      })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: data.map((data) => expectedReadyItem(data)),
        newData: [expectedReadyItem({ ...CREATE_FULL[0], value: "up1" }), expectedReadyItem(CREATE_FULL[1])],
      })
    );

    // update using item handlerMap
    act(() => {
      lastResult().newData[1].handlerMap.itemUpdate({ value: "up2" });
    });
    expect(lastResult()).toEqual(
      expectedResult({
        data: data.map((data) => expectedReadyItem(data)),
        newData: [
          expectedReadyItem({ ...CREATE_FULL[0], value: "up1" }),
          expectedItem({
            data: CREATE_FULL[1],
            state: "pending",
            pendingData: { operation: "itemUpdate", dtoIn: { id: "c2", value: "up2" } },
            errorData: null,
            handlerMap: expectedHandlerMap({}),
          }),
        ],
      })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: data.map((data) => expectedReadyItem(data)),
        newData: [
          expectedReadyItem({ ...CREATE_FULL[0], value: "up1" }),
          expectedReadyItem({ ...CREATE_FULL[1], value: "up2" }),
        ],
      })
    );

    // delete using list handlerMap
    act(() => {
      lastResult().handlerMap.delete1({ id: "c1" });
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: data.map((data) => expectedReadyItem(data)),
        newData: [expectedReadyItem({ ...CREATE_FULL[1], value: "up2" })],
      })
    );

    // delete using item handlerMap
    act(() => {
      lastResult().newData[0].handlerMap.itemDelete();
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: data.map((data) => expectedReadyItem(data)),
        newData: [],
      })
    );
  });
});
