import UU5 from "uu5g04";
import { useListData } from "uu5g04-hooks";

const { renderHook, wait, act } = UU5.Test.Tools;

const INITIAL_DATA1 = [{ id: "id1", value: "x" }];
const LOAD_DATA1 = [
  { id: "id1", value: "a" },
  { id: "id2", value: "b" },
  { id: "id3", value: "c" },
  { id: "id4", value: "d" },
];
const LOAD_DATA2 = [{ id: "idA", value: "1" }];

function renderHookParallelOps(initialDataFromOnLoad) {
  let waitable = (defaultFn) => {
    return jest.fn(async (...args) => {
      let lastArg = args.pop();
      if (!lastArg || !lastArg.fn) return defaultFn(...args, lastArg); // this happens for onLoad which is called automatically (without our "startOp().unblock()" stuff)
      await lastArg.promise;
      return lastArg.fn(...args);
    });
  };
  let onLoad = waitable(async () => initialDataFromOnLoad);
  let onUpdate = waitable();
  let onCreate = waitable();
  let onDelete = waitable();

  let result = renderHook(useListData, { onLoad, onUpdate, onCreate, onDelete });
  result.onLoad = onLoad;
  result.onUpdate = onUpdate;
  result.onCreate = onCreate;
  result.onDelete = onDelete;
  result.startOp = (type, ...args) => {
    let pausingPromiseResolve;
    let pausingPromise = new Promise((resolve, reject) => {
      pausingPromiseResolve = resolve;
    });
    let opFinisherFn = typeof args[args.length - 1] === "function" ? args.pop() : null;
    let typeCapitalized = type.replace(/^./, (m) => m.toUpperCase());
    let hookValue = result.lastResult();
    act(() => {
      hookValue["handle" + typeCapitalized](...args, { promise: pausingPromise, fn: opFinisherFn });
    });
    return {
      async unblock() {
        pausingPromiseResolve();
        await wait();
      },
    };
  };
  return result;
}

describe("[uu5g04-hooks] useListData behaviour", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useListData);
    expect(lastResult()).toMatchObject({
      syncData: null,
      asyncData: null,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [],
      handleLoad: expect.any(Function),
      handleCreate: expect.any(Function),
      handleUpdate: expect.any(Function),
      handleDelete: expect.any(Function),
      setData: expect.any(Function),
    });
  });

  it("data; should use initial data", () => {
    let { lastResult } = renderHook(useListData, { data: INITIAL_DATA1 });
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1,
      asyncData: INITIAL_DATA1,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [],
    });
  });

  it("data; should use initial data without calling onLoad", async () => {
    let onLoad = jest.fn(async () => LOAD_DATA1);
    let { lastResult } = renderHook(useListData, { onLoad, data: INITIAL_DATA1 });
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1,
      asyncData: INITIAL_DATA1,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [],
    });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(0);
  });

  it("dtoIn; should pass dtoIn to initial load", async () => {
    let dtoIn = { a: "b" };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    renderHook(useListData, { onLoad, dtoIn });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onLoad).toHaveBeenCalledWith(dtoIn);
  });

  it("dtoIn; should pass dtoIn if onLoad changes", async () => {
    let dtoIn = { a: "b" };
    let onLoad1 = jest.fn(async () => LOAD_DATA1);
    let onLoad2 = jest.fn(async () => LOAD_DATA2);
    let { rerender } = renderHook(useListData, { onLoad: onLoad1, dtoIn });
    await wait();
    rerender({ onLoad: onLoad2, dtoIn });
    await wait();
    expect(onLoad2).toHaveBeenCalledTimes(1);
    expect(onLoad2).toHaveBeenCalledWith(dtoIn);
  });

  it("dtoIn; should reload if dtoIn changes", async () => {
    let dtoIn1 = { a: "b" };
    let dtoIn2 = { a: "c" };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    let { rerender } = renderHook(useListData, { onLoad, dtoIn: dtoIn1 });
    await wait();
    rerender({ onLoad, dtoIn: dtoIn2 });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).toHaveBeenLastCalledWith(dtoIn2);
  });

  it("dtoIn; should not pass dtoIn to handleLoad loads", async () => {
    let dtoIn = { a: "b" };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    let { lastResult } = renderHook(useListData, { onLoad, dtoIn });
    await wait();
    act(() => {
      lastResult().handleLoad();
    });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).toHaveBeenLastCalledWith();
  });

  it("onLoad; should update state after onLoad (success)", async () => {
    let { lastResult } = renderHook(useListData, { onLoad: jest.fn(async () => LOAD_DATA1) });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "load", state: "success", result: LOAD_DATA1 }],
    });
  });

  it("onLoad; should update state after onLoad (error)", async () => {
    let error = 123;
    let { lastResult } = renderHook(useListData, {
      onLoad: jest.fn(async () => {
        throw (error = new Error("Test error"));
      }),
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: null,
      asyncData: null,
      viewState: "error",
      errorState: "load",
      error: error,
      operations: [{ type: "load", state: "error", result: error }],
    });
  });

  it("onLoad; should do reload if onLoad changes & should reset error state", async () => {
    let error = 123;
    let { lastResult, rerender } = renderHook(useListData, {
      onLoad: jest.fn(async () => {
        throw (error = new Error("Test error"));
      }),
    });
    await wait();
    expect(lastResult()).toMatchObject({ error });

    rerender({ onLoad: jest.fn(async () => LOAD_DATA2) });
    expect(lastResult()).toMatchObject({
      viewState: "load",
      operations: [{ type: "load", state: "pending", result: undefined }],
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA2,
      asyncData: LOAD_DATA2,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "load", state: "success", result: LOAD_DATA2 }],
    });
  });

  it("handleLoad; should reload (success)", async () => {
    const LOAD_PARAMS = { p: "v" };
    let onLoad = jest.fn();
    onLoad.mockImplementationOnce(async () => LOAD_DATA1);
    onLoad.mockImplementationOnce(async () => LOAD_DATA2);
    let { lastResult } = renderHook(useListData, { onLoad });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "load", state: "success", result: LOAD_DATA1 }],
    });

    let handleLoadResolved;
    act(() => {
      lastResult()
        .handleLoad(LOAD_PARAMS)
        .then(() => (handleLoadResolved = true));
    });
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).lastCalledWith(LOAD_PARAMS);
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "load",
      errorState: null,
      error: null,
      operations: [{ type: "load", state: "pending", result: undefined }],
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA2,
      asyncData: LOAD_DATA2,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "load", state: "success", result: LOAD_DATA2 }],
    });
    expect(handleLoadResolved).toBe(true);
  });

  it("handleLoad; should keep previous data on error", async () => {
    let error = 123;
    let onLoad = jest.fn();
    onLoad.mockImplementationOnce(async () => LOAD_DATA1);
    onLoad.mockImplementationOnce(async () => {
      throw (error = new Error("Test error"));
    });
    let { lastResult } = renderHook(useListData, { onLoad });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "load", state: "success", result: LOAD_DATA1 }],
    });

    let handleLoadResolved;
    act(() => {
      lastResult()
        .handleLoad()
        .catch((e) => null)
        .then(() => (handleLoadResolved = true));
    });
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).lastCalledWith();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "load",
      errorState: null,
      error: null,
      operations: [{ type: "load", state: "pending", result: undefined }],
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "error",
      errorState: "load",
      error,
      operations: [{ type: "load", state: "error", result: error }],
    });
    expect(handleLoadResolved).toBe(true);
  });

  it("handleLoad; should do nothing without onLoad", async () => {
    let { lastResult, renderCount } = renderHook(useListData, { data: INITIAL_DATA1 });
    await wait();
    let expectedRenderCount = renderCount();
    lastResult().handleLoad();
    await wait();
    expect(renderCount()).toBe(expectedRenderCount);
  });

  it("handleCreate; should create data (success)", async () => {
    const CREATE1 = { key: "created1" };
    const CREATE1_FULL = { a: "b" };
    let data = [{ id: "a" }, { id: "b" }];
    let onCreate = jest.fn(async () => CREATE1_FULL);
    let { lastResult } = renderHook(useListData, { onCreate, data });
    await wait();

    let handleCreateResolved;
    act(() => {
      lastResult()
        .handleCreate(CREATE1)
        .then(() => (handleCreateResolved = true));
    });
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith(CREATE1);
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1),
      asyncData: data,
      viewState: "create",
      errorState: null,
      error: null,
      operations: [{ type: "create", state: "pending", result: undefined, items: [CREATE1] }],
    });

    await wait(); // finish create
    expect(lastResult()).toMatchObject({
      syncData: data.concat({ ...CREATE1, ...CREATE1_FULL }),
      asyncData: data.concat({ ...CREATE1, ...CREATE1_FULL }),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        { type: "create", state: "success", result: CREATE1_FULL, items: [{ ...CREATE1, ...CREATE1_FULL }] },
      ],
    });
    expect(handleCreateResolved).toBe(true);
  });

  it("handleCreate; should create data (success, bulk)", async () => {
    const CREATE1 = [{ key: "created1" }, { key: "created2" }];
    const CREATE1_FULL = [{ id: "c" }, { id: "d" }];
    const CREATE1_MERGED = CREATE1_FULL.map((it, i) => ({ ...CREATE1[i], ...it }));
    let data = [{ id: "a" }, { id: "b" }];
    let onCreate = jest.fn(async () => CREATE1_FULL);
    let { lastResult } = renderHook(useListData, { onCreate, data });
    await wait();

    let handleCreateResolved;
    act(() => {
      lastResult()
        .handleCreate(CREATE1)
        .then(() => (handleCreateResolved = true));
    });
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith(CREATE1);
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1),
      asyncData: data,
      viewState: "create",
      errorState: null,
      error: null,
      operations: [{ type: "create", state: "pending", result: undefined, items: CREATE1 }],
    });

    await wait(); // finish create
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1_MERGED),
      asyncData: data.concat(CREATE1_MERGED),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "create", state: "success", result: CREATE1_FULL, items: CREATE1_MERGED }],
    });
    expect(handleCreateResolved).toBe(true);
  });

  it("handleCreate; should create data even without onCreate (success, bulk)", async () => {
    const CREATE1 = [{ key: "created1" }, { key: "created2" }];
    let data = [{ id: "a" }, { id: "b" }];
    let { lastResult } = renderHook(useListData, { data });
    await wait();

    let handleCreateResolved;
    act(() => {
      lastResult()
        .handleCreate(CREATE1)
        .then(() => (handleCreateResolved = true));
    });
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1),
      asyncData: data.concat(CREATE1),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "create", state: "success", result: null, items: CREATE1 }],
    });

    await wait();
    expect(handleCreateResolved).toBe(true);
  });

  it("handleCreate; should pass extra call args to onCreate()", async () => {
    let onCreate = jest.fn(async () => null);
    let { lastResult } = renderHook(useListData, { onCreate, data: INITIAL_DATA1 });
    await wait();
    act(() => {
      lastResult().handleCreate("a", "b", 123, false);
    });
    await wait();
    expect(onCreate).lastCalledWith("a", "b", 123, false);
  });

  it("handleCreate; failure with Error instance - should not create data & should set error state", async () => {
    const CREATE1 = { key: "created1" };
    let data = [{ id: "a" }, { id: "b" }];
    let error = 123;
    let onCreate = jest.fn(async () => {
      throw (error = new Error("Test error"));
    });
    let { lastResult } = renderHook(useListData, { onCreate, data });
    await wait();

    act(() => {
      lastResult()
        .handleCreate(CREATE1)
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      viewState: "error",
      errorState: "create",
      error,
      operations: [{ type: "create", state: "error", result: error, items: [CREATE1] }],
    });
  });

  it("handleCreate; failure with an object instance - should create data & should set error state", async () => {
    const CREATE1 = { key: "created1" };
    let data = [{ id: "a" }, { id: "b" }];
    let error = 123;
    let onCreate = jest.fn(async () => {
      return Promise.reject((error = { message: "Failed to create." }));
    });
    let { lastResult } = renderHook(useListData, { onCreate, data });
    await wait();

    act(() => {
      lastResult()
        .handleCreate(CREATE1)
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.concat([{ ...CREATE1, ...error }]),
      asyncData: data.concat([{ ...CREATE1, ...error }]),
      viewState: "error",
      errorState: "create",
      error,
      operations: [{ type: "create", state: "error", result: error, items: [CREATE1] }],
    });
  });

  it("handleCreate; failure with a uuApp response object - should notcreate data & should set error state", async () => {
    const CREATE1 = { key: "created1" };
    const CREATE1_FAIL = {
      status: 0,
      headers() {},
      data: { message: "Failed." },
      error: new Error("Test error."),
    };
    let data = [{ id: "a" }, { id: "b" }];
    let error = 123;
    let onCreate = jest.fn(async () => {
      return Promise.reject((error = CREATE1_FAIL));
    });
    let { lastResult } = renderHook(useListData, { onCreate, data });
    await wait();

    act(() => {
      lastResult()
        .handleCreate(CREATE1)
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      viewState: "error",
      errorState: "create",
      error,
      operations: [{ type: "create", state: "error", result: error, items: [CREATE1] }],
    });
  });

  it("handleCreate; failure with an array - should create some data & should set error state", async () => {
    const CREATE1 = [{ key: "created1" }, { key: "created2" }, { key: "created3" }];
    const CREATE1_FAIL = [null, { id: "ok1" }, { message: "Failed" }]; // 1st item (null) should be rollbacked, others should stay and get updated
    let data = [{ id: "a" }, { id: "b" }];
    let error = 123;
    let onCreate = jest.fn(async () => {
      return Promise.reject((error = CREATE1_FAIL));
    });
    let { lastResult } = renderHook(useListData, { onCreate, data });
    await wait();

    act(() => {
      lastResult()
        .handleCreate(CREATE1)
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1.map((it, i) => ({ ...it, ...CREATE1_FAIL[i] })).slice(1)),
      asyncData: data.concat(CREATE1.map((it, i) => ({ ...it, ...CREATE1_FAIL[i] })).slice(1)),
      viewState: "error",
      errorState: "create",
      error,
      operations: [
        {
          type: "create",
          state: "error",
          result: error,
          items: CREATE1.map((it, i) => ({ ...it, ...CREATE1_FAIL[i] })),
        },
      ],
    });
  });

  it("handleUpdate; should update item by id (success)", async () => {
    const UPDATE1 = { key: "updated1" };
    const UPDATE1_FULL = { a: "b" };
    let data = [
      { id: "a", key: "orig-a", a: "orig-a" },
      { id: "b", key: "orig-b", a: "orig-b" },
    ];
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    let { lastResult } = renderHook(useListData, { onUpdate, data });
    await wait();

    let handleUpdateResolved;
    act(() => {
      lastResult()
        .handleUpdate("a", UPDATE1)
        .then(() => (handleUpdateResolved = true));
    });
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith("a", UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1 }].concat(data.slice(1)),
      asyncData: data,
      viewState: "update",
      errorState: null,
      error: null,
      operations: [{ type: "update", state: "pending", result: undefined, items: [UPDATE1] }],
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        {
          type: "update",
          state: "success",
          result: UPDATE1_FULL,
          items: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }],
        },
      ],
    });
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id-fn (success)", async () => {
    const UPDATE1 = { key: "updated1" };
    const UPDATE1_FULL = { a: "b" };
    let data = [
      { id: "a", key: "orig-a", a: "orig-a" },
      { id: "b", key: "orig-b", a: "orig-b" },
    ];
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    let { lastResult } = renderHook(useListData, { onUpdate, data });
    await wait();

    let handleUpdateResolved;
    let idFn = (it) => it.id === "a";
    act(() => {
      lastResult()
        .handleUpdate(idFn, UPDATE1)
        .then(() => (handleUpdateResolved = true));
    });
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(idFn, UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1 }].concat(data.slice(1)),
      asyncData: data,
      viewState: "update",
      errorState: null,
      error: null,
      operations: [{ type: "update", state: "pending", result: undefined, items: [UPDATE1] }],
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        {
          type: "update",
          state: "success",
          result: UPDATE1_FULL,
          items: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }],
        },
      ],
    });
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id-fn even without onUpdate (success)", async () => {
    const UPDATE1 = { key: "updated1" };
    let data = [
      { id: "a", key: "orig-a" },
      { id: "b", key: "orig-b" },
    ];
    let { lastResult } = renderHook(useListData, { data });
    await wait();

    let handleUpdateResolved;
    let idFn = (it) => it.id === "a";
    act(() => {
      lastResult()
        .handleUpdate(idFn, UPDATE1)
        .then(() => (handleUpdateResolved = true));
    });
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1 }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE1 }].concat(data.slice(1)),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "update", state: "success", result: null, items: [{ ...data[0], ...UPDATE1 }] }],
    });

    await wait();
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id (success, bulk)", async () => {
    const UPDATE1 = [{ key: "updated1" }, { key: "updated2" }];
    const UPDATE1_FULL = [{ a: "b" }, { a: "c" }];
    let data = [
      { id: "a", key: "orig-a", a: "orig-a" },
      { id: "b", key: "orig-b", a: "orig-b" },
    ];
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    let { lastResult } = renderHook(useListData, { onUpdate, data });
    await wait();

    let handleUpdateResolved;
    act(() => {
      lastResult()
        .handleUpdate(["a", "b"], UPDATE1)
        .then(() => (handleUpdateResolved = true));
    });
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(["a", "b"], UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0] },
        { ...data[1], ...UPDATE1[1] },
      ].concat(data.slice(2)),
      asyncData: data,
      viewState: "update",
      errorState: null,
      error: null,
      operations: [{ type: "update", state: "pending", result: undefined, items: UPDATE1 }],
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
        { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] },
      ].concat(data.slice(2)),
      asyncData: [
        { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
        { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] },
      ].concat(data.slice(2)),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        {
          type: "update",
          state: "success",
          result: UPDATE1_FULL,
          items: [
            { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
            { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] },
          ],
        },
      ],
    });
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id-fn (success, bulk)", async () => {
    const UPDATE1 = [{ key: "updated1" }, { key: "updated2" }];
    const UPDATE1_FULL = [{ a: "b" }, { a: "c" }];
    let data = [
      { id: "a", key: "orig-a", a: "orig-a" },
      { id: "b", key: "orig-b", a: "orig-b" },
    ];
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    let { lastResult } = renderHook(useListData, { onUpdate, data });
    await wait();

    let handleUpdateResolved;
    let idFns = [(it) => it.id === "a", (it) => it.id === "b"];
    act(() => {
      lastResult()
        .handleUpdate(idFns, UPDATE1)
        .then(() => (handleUpdateResolved = true));
    });
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(idFns, UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0] },
        { ...data[1], ...UPDATE1[1] },
      ].concat(data.slice(2)),
      asyncData: data,
      viewState: "update",
      errorState: null,
      error: null,
      operations: [
        {
          type: "update",
          state: "pending",
          result: undefined,
          items: [
            { ...data[0], ...UPDATE1[0] },
            { ...data[1], ...UPDATE1[1] },
          ],
        },
      ],
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
        { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] },
      ].concat(data.slice(2)),
      asyncData: [
        { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
        { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] },
      ].concat(data.slice(2)),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        {
          type: "update",
          state: "success",
          result: UPDATE1_FULL,
          items: [
            { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
            { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] },
          ],
        },
      ],
    });
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id-fn even without onUpdate (success, bulk)", async () => {
    const UPDATE1 = [{ key: "updated1" }, { key: "updated2" }];
    let data = [
      { id: "a", key: "orig-a" },
      { id: "b", key: "orig-b" },
    ];
    let { lastResult } = renderHook(useListData, { data });
    await wait();

    let handleUpdateResolved;
    let idFns = [(it) => it.id === "a", (it) => it.id === "b"];
    act(() => {
      lastResult()
        .handleUpdate(idFns, UPDATE1)
        .then(() => (handleUpdateResolved = true));
    });
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0] },
        { ...data[1], ...UPDATE1[1] },
      ].concat(data.slice(2)),
      asyncData: [
        { ...data[0], ...UPDATE1[0] },
        { ...data[1], ...UPDATE1[1] },
      ].concat(data.slice(2)),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        {
          type: "update",
          state: "success",
          result: null,
          items: [
            { ...data[0], ...UPDATE1[0] },
            { ...data[1], ...UPDATE1[1] },
          ],
        },
      ],
    });

    await wait();
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id if using single parameter", async () => {
    const UPDATE1 = { id: "a", key: "updated1" };
    const UPDATE1_FULL = { a: "b" };
    const UPDATE2 = { id: "a", key: "updated2" };
    const UPDATE2_FULL = { a: "b2" };
    let data = [
      { id: "a", key: "orig-a", a: "orig-a" },
      { id: "b", key: "orig-b", a: "orig-b" },
    ];
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    let { lastResult } = renderHook(useListData, { onUpdate, data });
    await wait();

    act(() => {
      lastResult().handleUpdate(UPDATE1);
    });
    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        {
          type: "update",
          state: "success",
          result: UPDATE1_FULL,
          items: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }],
        },
      ],
    });

    onUpdate.mockImplementation(async () => UPDATE2_FULL);
    act(() => {
      lastResult().handleUpdate([UPDATE2]);
    });
    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE2, ...UPDATE2_FULL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE2, ...UPDATE2_FULL }].concat(data.slice(1)),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        {
          type: "update",
          state: "success",
          result: UPDATE2_FULL,
          items: [{ ...data[0], ...UPDATE2, ...UPDATE2_FULL }],
        },
      ],
    });
  });

  it("handleUpdate; should pass extra call args to onUpdate()", async () => {
    let onUpdate = jest.fn(async () => null);
    let { lastResult } = renderHook(useListData, { onUpdate, data: INITIAL_DATA1 });
    await wait();
    act(() => {
      lastResult().handleUpdate("a", "b", 123, false);
    });
    await wait();
    expect(onUpdate).lastCalledWith("a", "b", 123, false);
  });

  it("handleUpdate; failure with Error instance - should not update data & should set error state", async () => {
    const UPDATE1 = { key: "updated1" };
    let data = [
      { id: "a", key: "orig-a" },
      { id: "b", key: "orig-b" },
    ];
    let error = 123;
    let onUpdate = jest.fn(async () => {
      throw (error = new Error("Test error"));
    });
    let { lastResult } = renderHook(useListData, { onUpdate, data });
    await wait();

    act(() => {
      lastResult()
        .handleUpdate("a", UPDATE1)
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      viewState: "error",
      errorState: "update",
      error,
      operations: [{ type: "update", state: "error", result: error, items: [{ ...data[0], ...UPDATE1 }] }],
    });
  });

  it("handleUpdate; failure with an object instance - should update data & should set error state", async () => {
    const UPDATE1 = { key: "updated1" };
    const UPDATE1_FAIL = { message: "Failed to update." };
    let data = [
      { id: "a", key: "orig-a", message: "orig-a" },
      { id: "b", key: "orig-b", message: "orig-b" },
    ];
    let error = 123;
    let onUpdate = jest.fn(async () => {
      return Promise.reject((error = UPDATE1_FAIL));
    });
    let { lastResult } = renderHook(useListData, { onUpdate, data });
    await wait();

    act(() => {
      lastResult()
        .handleUpdate("a", UPDATE1)
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FAIL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FAIL }].concat(data.slice(1)),
      viewState: "error",
      errorState: "update",
      error,
      operations: [
        { type: "update", state: "error", result: error, items: [{ ...data[0], ...UPDATE1, ...UPDATE1_FAIL }] },
      ],
    });
  });

  it("handleUpdate; failure with a uuApp response object - should not update data & should set error state", async () => {
    const UPDATE1 = { key: "updated1" };
    const UPDATE1_FAIL = {
      status: 0,
      headers() {},
      data: { message: "Failed." },
      error: new Error("Test error."),
    };
    let data = [
      { id: "a", key: "orig-a", message: "orig-a" },
      { id: "b", key: "orig-b", message: "orig-b" },
    ];
    let error = 123;
    let onUpdate = jest.fn(async () => {
      return Promise.reject((error = UPDATE1_FAIL));
    });
    let { lastResult } = renderHook(useListData, { onUpdate, data });
    await wait();

    act(() => {
      lastResult()
        .handleUpdate("a", UPDATE1)
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      viewState: "error",
      errorState: "update",
      error,
      operations: [{ type: "update", state: "error", result: error, items: [{ ...data[0], ...UPDATE1 }] }],
    });
  });

  it("handleUpdate; failure with an array - should update some data & should set error state", async () => {
    const UPDATE1 = [{ key: "updated1" }, { key: "updated2" }, { key: "updated3" }];
    const UPDATE1_FAIL = [null, { key: "ok1" }, { message: "Failed" }]; // 1st item (null) should be rollbacked, others should stay and get updated
    let data = [
      { id: "a", key: "1" },
      { id: "b", key: "2" },
      { id: "c", key: "3" },
    ];
    let error = 123;
    let onUpdate = jest.fn(async () => {
      return Promise.reject((error = UPDATE1_FAIL));
    });
    let { lastResult } = renderHook(useListData, { onUpdate, data });
    await wait();

    let ids = ["c", "a", "b"];
    act(() => {
      lastResult()
        .handleUpdate(ids, UPDATE1)
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[1], ...UPDATE1_FAIL[1] },
        { ...data[1], ...UPDATE1[2], ...UPDATE1_FAIL[2] },
        data[2],
      ],
      asyncData: [
        { ...data[0], ...UPDATE1[1], ...UPDATE1_FAIL[1] },
        { ...data[1], ...UPDATE1[2], ...UPDATE1_FAIL[2] },
        data[2],
      ],
      viewState: "error",
      errorState: "update",
      error,
      operations: [
        {
          type: "update",
          state: "error",
          result: UPDATE1_FAIL,
          items: [
            { ...data[2], ...UPDATE1[0], ...UPDATE1_FAIL[0] },
            { ...data[0], ...UPDATE1[1], ...UPDATE1_FAIL[1] },
            { ...data[1], ...UPDATE1[2], ...UPDATE1_FAIL[2] },
          ],
        },
      ],
    });
  });

  it("handleDelete; should delete item by id (success)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let onDelete = jest.fn(async () => null);
    let { lastResult } = renderHook(useListData, { onDelete, data });
    await wait();

    let handleDeleteResolved;
    act(() => {
      lastResult()
        .handleDelete("a")
        .then(() => (handleDeleteResolved = true));
    });
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("a");
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a"),
      asyncData: data,
      viewState: "delete",
      errorState: null,
      error: null,
      operations: [{ type: "delete", state: "pending", result: undefined, items: data.filter((it) => it.id === "a") }],
    });

    await wait(); // finish delete
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a"),
      asyncData: data.filter((it) => it.id !== "a"),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "delete", state: "success", result: null, items: data.filter((it) => it.id === "a") }],
    });
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id-fn (success)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let onDelete = jest.fn(async () => null);
    let { lastResult } = renderHook(useListData, { onDelete, data });
    await wait();

    let handleDeleteResolved;
    let idFn = (it) => it.id === "a";
    act(() => {
      lastResult()
        .handleDelete(idFn)
        .then(() => (handleDeleteResolved = true));
    });
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(idFn);
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a"),
      asyncData: data,
      viewState: "delete",
      errorState: null,
      error: null,
      operations: [{ type: "delete", state: "pending", result: undefined, items: data.filter((it) => it.id === "a") }],
    });

    await wait(); // finish delete
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a"),
      asyncData: data.filter((it) => it.id !== "a"),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "delete", state: "success", result: null, items: data.filter((it) => it.id === "a") }],
    });
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id-fn even without onDelete (success)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let { lastResult } = renderHook(useListData, { data });
    await wait();

    let handleDeleteResolved;
    let idFn = (it) => it.id === "a";
    act(() => {
      lastResult()
        .handleDelete(idFn)
        .then(() => (handleDeleteResolved = true));
    });
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a"),
      asyncData: data.filter((it) => it.id !== "a"),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "delete", state: "success", result: null, items: data.filter((it) => it.id === "a") }],
    });

    await wait();
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id (success, bulk)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let onDelete = jest.fn(async () => null);
    let { lastResult } = renderHook(useListData, { onDelete, data });
    await wait();

    let handleDeleteResolved;
    act(() => {
      lastResult()
        .handleDelete(["a", "b"])
        .then(() => (handleDeleteResolved = true));
    });
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(["a", "b"]);
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a" && it.id !== "b"),
      asyncData: data,
      viewState: "delete",
      errorState: null,
      error: null,
      operations: [
        {
          type: "delete",
          state: "pending",
          result: undefined,
          items: data.filter((it) => it.id === "a" || it.id === "b"),
        },
      ],
    });

    await wait(); // finish delete
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a" && it.id !== "b"),
      asyncData: data.filter((it) => it.id !== "a" && it.id !== "b"),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        { type: "delete", state: "success", result: null, items: data.filter((it) => it.id === "a" || it.id === "b") },
      ],
    });
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id-fn (success, bulk)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let onDelete = jest.fn(async () => null);
    let { lastResult } = renderHook(useListData, { onDelete, data });
    await wait();

    let handleDeleteResolved;
    let idFns = [(it) => it.id === "a", (it) => it.id === "b"];
    act(() => {
      lastResult()
        .handleDelete(idFns)
        .then(() => (handleDeleteResolved = true));
    });
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(idFns);
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a" && it.id !== "b"),
      asyncData: data,
      viewState: "delete",
      errorState: null,
      error: null,
      operations: [
        {
          type: "delete",
          state: "pending",
          result: undefined,
          items: data.filter((it) => it.id === "a" || it.id === "b"),
        },
      ],
    });

    await wait(); // finish delete
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a" && it.id !== "b"),
      asyncData: data.filter((it) => it.id !== "a" && it.id !== "b"),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        { type: "delete", state: "success", result: null, items: data.filter((it) => it.id === "a" || it.id === "b") },
      ],
    });
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id-fn even without onDelete (success, bulk)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let { lastResult } = renderHook(useListData, { data });
    await wait();

    let handleDeleteResolved;
    let idFns = [(it) => it.id === "a", (it) => it.id === "b"];
    act(() => {
      lastResult()
        .handleDelete(idFns)
        .then(() => (handleDeleteResolved = true));
    });
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a" && it.id !== "b"),
      asyncData: data.filter((it) => it.id !== "a" && it.id !== "b"),
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [
        { type: "delete", state: "success", result: null, items: data.filter((it) => it.id === "a" || it.id === "b") },
      ],
    });

    await wait();
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should pass extra call args to onDelete()", async () => {
    let onDelete = jest.fn(async () => null);
    let { lastResult } = renderHook(useListData, { onDelete, data: INITIAL_DATA1 });
    await wait();
    act(() => {
      lastResult().handleDelete("a", "b", 123, false);
    });
    await wait();
    expect(onDelete).lastCalledWith("a", "b", 123, false);
  });

  it("handleDelete; should delete if response has '{ uuAppErrorMap: {} }' (uuAppErrorMp empty or warnings only)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let onDelete = jest.fn(async () => ({ uuAppErrorMap: {} }));
    let { lastResult } = renderHook(useListData, { onDelete, data });
    await wait();
    act(() => {
      lastResult().handleDelete("a");
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a"),
      asyncData: data.filter((it) => it.id !== "a"),
    });

    onDelete.mockImplementation(async () => ({ uuAppErrorMap: { "uu-app-error-xyz": { type: "warning" } } }));
    act(() => {
      lastResult().handleDelete("c");
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.filter((it) => it.id !== "a" && it.id !== "c"),
      asyncData: data.filter((it) => it.id !== "a" && it.id !== "c"),
    });

    // uuAppErrorMap with error should merge it to the item
    onDelete.mockImplementation(async () => ({ uuAppErrorMap: { "uu-app-error-xyz": { type: "error" } } }));
    act(() => {
      lastResult().handleDelete("b");
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: [{ id: "b", uuAppErrorMap: { "uu-app-error-xyz": { type: "error" } } }],
      asyncData: [{ id: "b", uuAppErrorMap: { "uu-app-error-xyz": { type: "error" } } }],
    });
  });

  it("handleDelete; failure with Error instance - should not delete data & should set error state", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let error = 123;
    let onDelete = jest.fn(async () => {
      throw (error = new Error("Test error"));
    });
    let { lastResult } = renderHook(useListData, { onDelete, data });
    await wait();

    act(() => {
      lastResult()
        .handleDelete("a")
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      viewState: "error",
      errorState: "delete",
      error,
      operations: [{ type: "delete", state: "error", result: error, items: data.filter((it) => it.id === "a") }],
    });
  });

  it("handleDelete; failure with an object instance - should not delete data & should set error state", async () => {
    const DELETE1_FAIL = { message: "Failed." };
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let error = 123;
    let onDelete = jest.fn(async () => {
      return Promise.reject((error = DELETE1_FAIL));
    });
    let { lastResult } = renderHook(useListData, { onDelete, data });
    await wait();

    act(() => {
      lastResult()
        .handleDelete("a")
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...DELETE1_FAIL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...DELETE1_FAIL }].concat(data.slice(1)),
      viewState: "error",
      errorState: "delete",
      error,
      operations: [{ type: "delete", state: "error", result: error, items: [{ ...data[0], ...DELETE1_FAIL }] }],
    });
  });

  it("handleDelete; failure with a uuApp response object - should not delete data & should set error state", async () => {
    const DELETE1_FAIL = {
      status: 0,
      headers() {},
      data: { message: "Failed." },
      error: new Error("Test error."),
    };
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let error = 123;
    let onDelete = jest.fn(async () => {
      return Promise.reject((error = DELETE1_FAIL));
    });
    let { lastResult } = renderHook(useListData, { onDelete, data });
    await wait();

    act(() => {
      lastResult()
        .handleDelete("a")
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      viewState: "error",
      errorState: "delete",
      error,
      operations: [{ type: "delete", state: "error", result: error, items: [data[0]] }],
    });
  });

  it("handleDelete; failure with an array - should delete some data & should set error state", async () => {
    const DELETE1_FAIL = [null, { key: "ok" }, { message: "Failed." }];
    let data = [{ id: "a", key: "nok" }, { id: "b" }, { id: "c" }];
    let error = 123;
    let onDelete = jest.fn(async () => {
      return Promise.reject((error = DELETE1_FAIL));
    });
    let { lastResult } = renderHook(useListData, { onDelete, data });
    await wait();

    act(() => {
      lastResult()
        .handleDelete(["c", "a", "b"]) // item with id "c" receives null => should be deleted; "a" receives { key: "ok" }; "b" receives { message: "Failed" }
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...DELETE1_FAIL[1] },
        { ...data[1], ...DELETE1_FAIL[2] },
      ],
      asyncData: [
        { ...data[0], ...DELETE1_FAIL[1] },
        { ...data[1], ...DELETE1_FAIL[2] },
      ],
      viewState: "error",
      errorState: "delete",
      error,
      operations: [
        {
          type: "delete",
          state: "error",
          result: error,
          items: [data[2], { ...data[0], ...DELETE1_FAIL[1] }, { ...data[1], ...DELETE1_FAIL[2] }],
        },
      ],
    });
  });

  it("setData; should set new data", async () => {
    let { lastResult } = renderHook(useListData, { data: INITIAL_DATA1 });
    await wait();

    act(() => {
      lastResult().setData(LOAD_DATA1);
    });
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "set", state: "success", result: null }], // "set" operation does no call so its result is always null
    });
  });

  it("parallel operations; should merge data to proper items even if calls resolve out-of-order", async () => {
    let data = [{ id: "1" }, { id: "2" }, { id: "3" }];
    let { lastResult, startOp } = renderHookParallelOps(data);
    await wait();

    // start performing "update", "create" and "delete", and let them finish in order: "update", "delete", "create"
    let UPDATED_ITEM_LOCAL = { local: "a" };
    let UPDATED_ITEM_EXTRA = { extra: "b" };
    let updateOp = startOp("update", "2", UPDATED_ITEM_LOCAL, async () => UPDATED_ITEM_EXTRA);
    await wait();
    let dataAfterUpdate = [...data];
    dataAfterUpdate.splice(1, 1, { ...data[1], ...UPDATED_ITEM_LOCAL });
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdate,
      asyncData: data,
    });

    let NEW_ITEM_LOCAL = { id: "new1" };
    let NEW_ITEM_EXTRA = { serverField: "abc" };
    let createOp = startOp("create", NEW_ITEM_LOCAL, async () => NEW_ITEM_EXTRA);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdate.concat([NEW_ITEM_LOCAL]),
      asyncData: data,
    });

    let deleteOp = startOp("delete", data[0], async () => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdate.slice(1).concat([NEW_ITEM_LOCAL]),
      asyncData: data,
    });

    await updateOp.unblock(); // let the update finish
    let dataAfterUpdateFinished = [...dataAfterUpdate];
    dataAfterUpdateFinished.splice(1, 1, { ...dataAfterUpdate[1], ...UPDATED_ITEM_EXTRA });
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdateFinished.slice(1).concat([NEW_ITEM_LOCAL]),
      asyncData: dataAfterUpdateFinished,
    });

    await deleteOp.unblock(); // let the delete finish
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdateFinished.slice(1).concat([NEW_ITEM_LOCAL]),
      // asyncData: dataAfterUpdateFinished // TODO OK? asyncData won't be updated yet because they're waiting for the first-launched op
    });

    await createOp.unblock(); // let the create finish
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdateFinished.slice(1).concat([{ ...NEW_ITEM_LOCAL, ...NEW_ITEM_EXTRA }]),
      asyncData: dataAfterUpdateFinished.slice(1).concat([{ ...NEW_ITEM_LOCAL, ...NEW_ITEM_EXTRA }]),
    });
  });

  it("operations; should update continuously based on handle* calls", async () => {
    let { startOp, allResults } = renderHookParallelOps(LOAD_DATA1);
    await wait();

    const UPDATE1_FULL = { extra: 0 };
    const CREATE1_FULL = { id: "newId1", extra: 1 };
    const DELETE1_FULL = null;
    let updateOp1 = startOp("update", "id1", {}, async () => UPDATE1_FULL);
    let createOp1 = startOp("create", {}, async () => CREATE1_FULL);
    await updateOp1.unblock();
    let deleteOp1 = startOp("delete", "id3", async () => DELETE1_FULL);
    await createOp1.unblock();
    await deleteOp1.unblock();

    expect(allResults()).toMatchObject([
      { viewState: "load", operations: [] },
      {
        viewState: "load",
        operations: [{ type: "load", state: "pending" }],
      },
      {
        viewState: "ready",
        operations: [{ type: "load", state: "success", result: LOAD_DATA1 }],
      },
      {
        viewState: "update",
        operations: [{ type: "update", state: "pending" }],
      },
      {
        viewState: "update",
        operations: [
          { type: "update", state: "pending" },
          { type: "create", state: "pending" },
        ],
      },
      {
        viewState: "create",
        operations: [
          { type: "update", state: "success", result: UPDATE1_FULL },
          { type: "create", state: "pending" },
        ],
      },
      {
        viewState: "create",
        operations: [
          { type: "create", state: "pending" },
          { type: "delete", state: "pending" },
        ],
      },
      {
        viewState: "delete",
        operations: [
          { type: "create", state: "success", result: CREATE1_FULL },
          { type: "delete", state: "pending" },
        ],
      },
      {
        viewState: "ready",
        operations: [{ type: "delete", state: "success", result: DELETE1_FULL }],
      },
    ]);
  });

  it.skip("parallel operations; should create items in proper order even if calls resolve out-of-order", async () => {
    let data = [{ id: "1" }, { id: "2" }, { id: "3" }];
    let NEW_ITEM1 = { id: "new1" };
    let NEW_ITEM2 = { id: "new2" };

    let { lastResult, startOp } = renderHookParallelOps(data);
    await wait();

    // start performing "create#1", "create#2" and let them finish in order: "create#2", "create#1"
    let createOp1 = startOp("create", NEW_ITEM1, async () => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.concat([NEW_ITEM1]),
      asyncData: data,
    });

    let createOp2 = startOp("create", NEW_ITEM2, async () => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.concat([NEW_ITEM1, NEW_ITEM2]),
      asyncData: data,
    });

    await createOp2.unblock(); // let the create#2 finish
    expect(lastResult()).toMatchObject({
      syncData: data.concat([NEW_ITEM1, NEW_ITEM2]),
      asyncData: data,
    });

    await createOp1.unblock(); // let the create#1 finish
    expect(lastResult()).toMatchObject({
      syncData: data.concat([NEW_ITEM1, NEW_ITEM2]),
      asyncData: data.concat([NEW_ITEM1, NEW_ITEM2]),
    });
  });
});
