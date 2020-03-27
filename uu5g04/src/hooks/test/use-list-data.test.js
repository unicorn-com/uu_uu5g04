import UU5 from "uu5g04";
import { useListData } from "uu5g04-hooks";

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs }) {
  let result = useListData(...hookArgs);
  // NOTE Using Inner to measure render counts of subtrees (hooks are allowed to change their state during render
  // because it results in re-calling of the Component but not of its subtree - we don't want to measure these
  // shallow re-renders).
  return <Inner result={result}>{children}</Inner>;
}
function Inner({ children, result }) {
  return children(result);
}

const INITIAL_DATA1 = [{ id: "id1", value: "x" }];
const LOAD_DATA1 = [
  { id: "id1", value: "a" },
  { id: "id2", value: "b" },
  { id: "id3", value: "c" },
  { id: "id4", value: "d" }
];
const LOAD_DATA2 = [{ id: "idA", value: "1" }];

function mountHook(...hookArgs) {
  let renderFn = jest.fn(() => <div />);
  let wrapper = mount(<Component hookArgs={hookArgs}>{renderFn}</Component>);
  // expect(renderFn.mock.calls.length).toBe(1);
  return {
    lastResult: () => renderFn.mock.calls[renderFn.mock.calls.length - 1][0],
    renderCount: () => renderFn.mock.calls.length,
    changeArgs: (...newArgs) => wrapper.setProps({ hookArgs: newArgs })
  };
}

function mountHookParallelOps(initialLoadData) {
  let waitable = () => async (...args) => {
    let lastArg = args.pop();
    await lastArg.promise;
    return lastArg.fn(...args);
  };
  let result = mountHook({
    onLoad: async () => initialLoadData,
    onCreate: waitable(),
    onUpdate: waitable(),
    onDelete: waitable()
  });
  result.startOp = (type, ...args) => {
    let pausingPromiseResolve;
    let pausingPromise = new Promise((resolve, reject) => {
      pausingPromiseResolve = resolve;
    });
    let opFinisherFn = args.pop();
    let typeCapitalized = type.replace(/^./, m => m.toUpperCase());
    let hookValue = result.lastResult();
    hookValue["handle" + typeCapitalized](...args, { promise: pausingPromise, fn: opFinisherFn });
    return {
      async finish() {
        pausingPromiseResolve();
        await wait();
      }
    };
  };
  return result;
}

describe("[uu5g04-hooks] useListData behaviour", () => {
  let lastResult, changeArgs, startOp, renderCount;

  it("should return expected result API", () => {
    ({ lastResult } = mountHook());
    expect(lastResult()).toMatchObject({
      syncData: null,
      asyncData: null,
      viewState: "ready",
      errorState: null,
      error: null,
      handleLoad: expect.any(Function),
      handleCreate: expect.any(Function),
      handleUpdate: expect.any(Function),
      handleDelete: expect.any(Function),
      setData: expect.any(Function)
    });
  });

  it("data; should use initial data", () => {
    ({ lastResult } = mountHook({ data: INITIAL_DATA1 }));
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1,
      asyncData: INITIAL_DATA1,
      viewState: "ready",
      errorState: null,
      error: null
    });
  });

  it("data; should use initial data without calling onLoad", async () => {
    let onLoad = jest.fn(async () => LOAD_DATA1);
    ({ lastResult } = mountHook({ onLoad, data: INITIAL_DATA1 }));
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1,
      asyncData: INITIAL_DATA1,
      viewState: "ready",
      errorState: null,
      error: null
    });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(0);
  });

  it("dtoIn; should pass dtoIn to initial load", async () => {
    let dtoIn = { a: "b" };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    ({ lastResult } = mountHook({ onLoad, dtoIn }));
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onLoad).toHaveBeenCalledWith(dtoIn);
  });

  it("dtoIn; should pass dtoIn if onLoad changes", async () => {
    let dtoIn = { a: "b" };
    let onLoad1 = jest.fn(async () => LOAD_DATA1);
    let onLoad2 = jest.fn(async () => LOAD_DATA2);
    ({ lastResult, changeArgs } = mountHook({ onLoad: onLoad1, dtoIn }));
    await wait();
    changeArgs({ onLoad: onLoad2, dtoIn });
    await wait();
    expect(onLoad2).toHaveBeenCalledTimes(1);
    expect(onLoad2).toHaveBeenCalledWith(dtoIn);
  });

  it("dtoIn; should reload if dtoIn changes", async () => {
    let dtoIn1 = { a: "b" };
    let dtoIn2 = { a: "c" };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    ({ lastResult, changeArgs } = mountHook({ onLoad, dtoIn: dtoIn1 }));
    await wait();
    changeArgs({ onLoad, dtoIn: dtoIn2 });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).toHaveBeenLastCalledWith(dtoIn2);
  });

  it("dtoIn; should not pass dtoIn to handleLoad loads", async () => {
    let dtoIn = { a: "b" };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    ({ lastResult } = mountHook({ onLoad, dtoIn }));
    await wait();
    lastResult().handleLoad();
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).toHaveBeenLastCalledWith();
  });

  it("onLoad; should update state after onLoad (success)", async () => {
    ({ lastResult } = mountHook({ onLoad: jest.fn(async () => LOAD_DATA1) }));
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "ready",
      errorState: null,
      error: null
    });
  });

  it("onLoad; should update state after onLoad (error)", async () => {
    let error = 123;
    ({ lastResult, changeArgs } = mountHook({
      onLoad: jest.fn(async () => {
        throw (error = new Error("Test error"));
      })
    }));
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: null,
      asyncData: null,
      viewState: "error",
      errorState: "load",
      error: error
    });
  });

  it("onLoad; should do reload if onLoad changes & should reset error state", async () => {
    let error = 123;
    ({ lastResult, changeArgs } = mountHook({
      onLoad: jest.fn(async () => {
        throw (error = new Error("Test error"));
      })
    }));
    await wait();
    expect(lastResult()).toMatchObject({ error });

    changeArgs({ onLoad: jest.fn(async () => LOAD_DATA2) });
    expect(lastResult()).toMatchObject({ viewState: "load" });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA2,
      asyncData: LOAD_DATA2,
      viewState: "ready",
      errorState: null,
      error: null
    });
  });

  it("handleLoad; should reload (success)", async () => {
    const LOAD_PARAMS = { p: "v" };
    let onLoad = jest.fn();
    onLoad.mockImplementationOnce(async () => LOAD_DATA1);
    onLoad.mockImplementationOnce(async () => LOAD_DATA2);
    ({ lastResult } = mountHook({ onLoad }));
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "ready",
      errorState: null,
      error: null
    });

    let handleLoadResolved;
    lastResult()
      .handleLoad(LOAD_PARAMS)
      .then(() => (handleLoadResolved = true));
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).lastCalledWith(LOAD_PARAMS);
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "load",
      errorState: null,
      error: null
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA2,
      asyncData: LOAD_DATA2,
      viewState: "ready",
      errorState: null,
      error: null
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
    ({ lastResult } = mountHook({ onLoad }));
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "ready",
      errorState: null,
      error: null
    });

    let handleLoadResolved;
    lastResult()
      .handleLoad()
      .catch(e => null)
      .then(() => (handleLoadResolved = true));
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).lastCalledWith();
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "load",
      errorState: null,
      error: null
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "error",
      errorState: "load",
      error
    });
    expect(handleLoadResolved).toBe(true);
  });

  it("handleLoad; should do nothing without onLoad", async () => {
    ({ lastResult, renderCount } = mountHook({ data: INITIAL_DATA1 }));
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
    ({ lastResult, changeArgs } = mountHook({ onCreate, data }));
    await wait();

    let handleCreateResolved;
    lastResult()
      .handleCreate(CREATE1)
      .then(() => (handleCreateResolved = true));
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith(CREATE1);
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1),
      asyncData: data,
      viewState: "create",
      errorState: null,
      error: null
    });

    await wait(); // finish create
    expect(lastResult()).toMatchObject({
      syncData: data.concat({ ...CREATE1, ...CREATE1_FULL }),
      asyncData: data.concat({ ...CREATE1, ...CREATE1_FULL }),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleCreateResolved).toBe(true);
  });

  it("handleCreate; should create data (success, bulk)", async () => {
    const CREATE1 = [{ key: "created1" }, { key: "created2" }];
    const CREATE1_FULL = [{ id: "c" }, { id: "d" }];
    let data = [{ id: "a" }, { id: "b" }];
    let onCreate = jest.fn(async () => CREATE1_FULL);
    ({ lastResult, changeArgs } = mountHook({ onCreate, data }));
    await wait();

    let handleCreateResolved;
    lastResult()
      .handleCreate(CREATE1)
      .then(() => (handleCreateResolved = true));
    expect(onCreate).toHaveBeenCalledTimes(1);
    expect(onCreate).toHaveBeenCalledWith(CREATE1);
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1),
      asyncData: data,
      viewState: "create",
      errorState: null,
      error: null
    });

    await wait(); // finish create
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1_FULL.map((it, i) => ({ ...CREATE1[i], ...it }))),
      asyncData: data.concat(CREATE1_FULL.map((it, i) => ({ ...CREATE1[i], ...it }))),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleCreateResolved).toBe(true);
  });

  it("handleCreate; should create data even without onCreate (success, bulk)", async () => {
    const CREATE1 = [{ key: "created1" }, { key: "created2" }];
    let data = [{ id: "a" }, { id: "b" }];
    ({ lastResult, changeArgs } = mountHook({ data }));
    await wait();

    let handleCreateResolved;
    lastResult()
      .handleCreate(CREATE1)
      .then(() => (handleCreateResolved = true));
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1),
      asyncData: data.concat(CREATE1),
      viewState: "ready",
      errorState: null,
      error: null
    });

    await wait();
    expect(handleCreateResolved).toBe(true);
  });

  it("handleCreate; should pass extra call args to onCreate()", async () => {
    let onCreate = jest.fn(async () => null);
    ({ lastResult, renderCount } = mountHook({ onCreate, data: INITIAL_DATA1 }));
    await wait();
    lastResult().handleCreate("a", "b", 123, false);
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
    ({ lastResult, changeArgs } = mountHook({ onCreate, data }));
    await wait();

    lastResult()
      .handleCreate(CREATE1)
      .catch(e => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      viewState: "error",
      errorState: "create",
      error
    });
  });

  it("handleCreate; failure with an object instance - should create data & should set error state", async () => {
    const CREATE1 = { key: "created1" };
    let data = [{ id: "a" }, { id: "b" }];
    let error = 123;
    let onCreate = jest.fn(async () => {
      return Promise.reject((error = { message: "Failed to create." }));
    });
    ({ lastResult, changeArgs } = mountHook({ onCreate, data }));
    await wait();

    lastResult()
      .handleCreate(CREATE1)
      .catch(e => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.concat([{ ...CREATE1, ...error }]),
      asyncData: data.concat([{ ...CREATE1, ...error }]),
      viewState: "error",
      errorState: "create",
      error
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
    ({ lastResult, changeArgs } = mountHook({ onCreate, data }));
    await wait();

    lastResult()
      .handleCreate(CREATE1)
      .catch(e => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.concat(CREATE1.map((it, i) => ({ ...it, ...CREATE1_FAIL[i] })).slice(1)),
      asyncData: data.concat(CREATE1.map((it, i) => ({ ...it, ...CREATE1_FAIL[i] })).slice(1)),
      viewState: "error",
      errorState: "create",
      error
    });
  });

  it("handleUpdate; should update item by id (success)", async () => {
    const UPDATE1 = { key: "updated1" };
    const UPDATE1_FULL = { a: "b" };
    let data = [{ id: "a" }, { id: "b" }];
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    ({ lastResult, changeArgs } = mountHook({ onUpdate, data }));
    await wait();

    let handleUpdateResolved;
    lastResult()
      .handleUpdate("a", UPDATE1)
      .then(() => (handleUpdateResolved = true));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith("a", UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1 }].concat(data.slice(1)),
      asyncData: data,
      viewState: "update",
      errorState: null,
      error: null
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id-fn (success)", async () => {
    const UPDATE1 = { key: "updated1" };
    const UPDATE1_FULL = { a: "b" };
    let data = [{ id: "a" }, { id: "b" }];
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    ({ lastResult, changeArgs } = mountHook({ onUpdate, data }));
    await wait();

    let handleUpdateResolved;
    let idFn = it => it.id === "a";
    lastResult()
      .handleUpdate(idFn, UPDATE1)
      .then(() => (handleUpdateResolved = true));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(idFn, UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1 }].concat(data.slice(1)),
      asyncData: data,
      viewState: "update",
      errorState: null,
      error: null
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FULL }].concat(data.slice(1)),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id-fn even without onUpdate (success)", async () => {
    const UPDATE1 = { key: "updated1" };
    let data = [{ id: "a" }, { id: "b" }];
    ({ lastResult, changeArgs } = mountHook({ data }));
    await wait();

    let handleUpdateResolved;
    let idFn = it => it.id === "a";
    lastResult()
      .handleUpdate(idFn, UPDATE1)
      .then(() => (handleUpdateResolved = true));
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1 }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE1 }].concat(data.slice(1)),
      viewState: "ready",
      errorState: null,
      error: null
    });

    await wait();
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id (success, bulk)", async () => {
    const UPDATE1 = [{ key: "updated1" }, { key: "updated2" }];
    const UPDATE1_FULL = [{ a: "b" }, { a: "c" }];
    let data = [{ id: "a" }, { id: "b" }];
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    ({ lastResult, changeArgs } = mountHook({ onUpdate, data }));
    await wait();

    let handleUpdateResolved;
    lastResult()
      .handleUpdate(["a", "b"], UPDATE1)
      .then(() => (handleUpdateResolved = true));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(["a", "b"], UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0] },
        { ...data[1], ...UPDATE1[1] }
      ].concat(data.slice(2)),
      asyncData: data,
      viewState: "update",
      errorState: null,
      error: null
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
        { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] }
      ].concat(data.slice(2)),
      asyncData: [
        { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
        { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] }
      ].concat(data.slice(2)),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id-fn (success, bulk)", async () => {
    const UPDATE1 = [{ key: "updated1" }, { key: "updated2" }];
    const UPDATE1_FULL = [{ a: "b" }, { a: "c" }];
    let data = [{ id: "a" }, { id: "b" }];
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    ({ lastResult, changeArgs } = mountHook({ onUpdate, data }));
    await wait();

    let handleUpdateResolved;
    let idFns = [it => it.id === "a", it => it.id === "b"];
    lastResult()
      .handleUpdate(idFns, UPDATE1)
      .then(() => (handleUpdateResolved = true));
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(idFns, UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0] },
        { ...data[1], ...UPDATE1[1] }
      ].concat(data.slice(2)),
      asyncData: data,
      viewState: "update",
      errorState: null,
      error: null
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
        { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] }
      ].concat(data.slice(2)),
      asyncData: [
        { ...data[0], ...UPDATE1[0], ...UPDATE1_FULL[0] },
        { ...data[1], ...UPDATE1[1], ...UPDATE1_FULL[1] }
      ].concat(data.slice(2)),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should update item by id-fn even without onUpdate (success, bulk)", async () => {
    const UPDATE1 = [{ key: "updated1" }, { key: "updated2" }];
    let data = [{ id: "a" }, { id: "b" }];
    ({ lastResult, changeArgs } = mountHook({ data }));
    await wait();

    let handleUpdateResolved;
    let idFns = [it => it.id === "a", it => it.id === "b"];
    lastResult()
      .handleUpdate(idFns, UPDATE1)
      .then(() => (handleUpdateResolved = true));
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[0] },
        { ...data[1], ...UPDATE1[1] }
      ].concat(data.slice(2)),
      asyncData: [
        { ...data[0], ...UPDATE1[0] },
        { ...data[1], ...UPDATE1[1] }
      ].concat(data.slice(2)),
      viewState: "ready",
      errorState: null,
      error: null
    });

    await wait();
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should pass extra call args to onUpdate()", async () => {
    let onUpdate = jest.fn(async () => null);
    ({ lastResult, renderCount } = mountHook({ onUpdate, data: INITIAL_DATA1 }));
    await wait();
    lastResult().handleUpdate("a", "b", 123, false);
    await wait();
    expect(onUpdate).lastCalledWith("a", "b", 123, false);
  });

  it("handleUpdate; failure with Error instance - should not update data & should set error state", async () => {
    const UPDATE1 = { key: "updated1" };
    let data = [{ id: "a" }, { id: "b" }];
    let error = 123;
    let onUpdate = jest.fn(async () => {
      throw (error = new Error("Test error"));
    });
    ({ lastResult, changeArgs } = mountHook({ onUpdate, data }));
    await wait();

    lastResult()
      .handleUpdate("a", UPDATE1)
      .catch(e => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      viewState: "error",
      errorState: "update",
      error
    });
  });

  it("handleUpdate; failure with an object instance - should update data & should set error state", async () => {
    const UPDATE1 = { key: "updated1" };
    const UPDATE1_FAIL = { message: "Failed to update." };
    let data = [{ id: "a" }, { id: "b" }];
    let error = 123;
    let onUpdate = jest.fn(async () => {
      return Promise.reject((error = UPDATE1_FAIL));
    });
    ({ lastResult, changeArgs } = mountHook({ onUpdate, data }));
    await wait();

    lastResult()
      .handleUpdate("a", UPDATE1)
      .catch(e => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FAIL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...UPDATE1, ...UPDATE1_FAIL }].concat(data.slice(1)),
      viewState: "error",
      errorState: "update",
      error
    });
  });

  it("handleUpdate; failure with an array - should update some data & should set error state", async () => {
    const UPDATE1 = [{ key: "updated1" }, { key: "updated2" }, { key: "updated3" }];
    const UPDATE1_FAIL = [null, { key: "ok1" }, { message: "Failed" }]; // 1st item (null) should be rollbacked, others should stay and get updated
    let data = [
      { id: "a", key: "1" },
      { id: "b", key: "2" },
      { id: "c", key: "3" }
    ];
    let error = 123;
    let onUpdate = jest.fn(async () => {
      return Promise.reject((error = UPDATE1_FAIL));
    });
    ({ lastResult, changeArgs } = mountHook({ onUpdate, data }));
    await wait();

    let ids = ["c", "a", "b"];
    lastResult()
      .handleUpdate(ids, UPDATE1)
      .catch(e => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...UPDATE1[1], ...UPDATE1_FAIL[1] },
        { ...data[1], ...UPDATE1[2], ...UPDATE1_FAIL[2] },
        data[2]
      ],
      asyncData: [
        { ...data[0], ...UPDATE1[1], ...UPDATE1_FAIL[1] },
        { ...data[1], ...UPDATE1[2], ...UPDATE1_FAIL[2] },
        data[2]
      ],
      viewState: "error",
      errorState: "update",
      error
    });
  });

  it("handleDelete; should delete item by id (success)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let onDelete = jest.fn(async () => null);
    ({ lastResult, changeArgs } = mountHook({ onDelete, data }));
    await wait();

    let handleDeleteResolved;
    lastResult()
      .handleDelete("a")
      .then(() => (handleDeleteResolved = true));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith("a");
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a"),
      asyncData: data,
      viewState: "delete",
      errorState: null,
      error: null
    });

    await wait(); // finish delete
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a"),
      asyncData: data.filter(it => it.id !== "a"),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id-fn (success)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let onDelete = jest.fn(async () => null);
    ({ lastResult, changeArgs } = mountHook({ onDelete, data }));
    await wait();

    let handleDeleteResolved;
    let idFn = it => it.id === "a";
    lastResult()
      .handleDelete(idFn)
      .then(() => (handleDeleteResolved = true));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(idFn);
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a"),
      asyncData: data,
      viewState: "delete",
      errorState: null,
      error: null
    });

    await wait(); // finish delete
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a"),
      asyncData: data.filter(it => it.id !== "a"),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id-fn even without onDelete (success)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    ({ lastResult, changeArgs } = mountHook({ data }));
    await wait();

    let handleDeleteResolved;
    let idFn = it => it.id === "a";
    lastResult()
      .handleDelete(idFn)
      .then(() => (handleDeleteResolved = true));
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a"),
      asyncData: data.filter(it => it.id !== "a"),
      viewState: "ready",
      errorState: null,
      error: null
    });

    await wait();
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id (success, bulk)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let onDelete = jest.fn(async () => null);
    ({ lastResult, changeArgs } = mountHook({ onDelete, data }));
    await wait();

    let handleDeleteResolved;
    lastResult()
      .handleDelete(["a", "b"])
      .then(() => (handleDeleteResolved = true));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(["a", "b"]);
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a" && it.id !== "b"),
      asyncData: data,
      viewState: "delete",
      errorState: null,
      error: null
    });

    await wait(); // finish delete
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a" && it.id !== "b"),
      asyncData: data.filter(it => it.id !== "a" && it.id !== "b"),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id-fn (success, bulk)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let onDelete = jest.fn(async () => null);
    ({ lastResult, changeArgs } = mountHook({ onDelete, data }));
    await wait();

    let handleDeleteResolved;
    let idFns = [it => it.id === "a", it => it.id === "b"];
    lastResult()
      .handleDelete(idFns)
      .then(() => (handleDeleteResolved = true));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(idFns);
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a" && it.id !== "b"),
      asyncData: data,
      viewState: "delete",
      errorState: null,
      error: null
    });

    await wait(); // finish delete
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a" && it.id !== "b"),
      asyncData: data.filter(it => it.id !== "a" && it.id !== "b"),
      viewState: "ready",
      errorState: null,
      error: null
    });
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should delete item by id-fn even without onDelete (success, bulk)", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    ({ lastResult, changeArgs } = mountHook({ data }));
    await wait();

    let handleDeleteResolved;
    let idFns = [it => it.id === "a", it => it.id === "b"];
    lastResult()
      .handleDelete(idFns)
      .then(() => (handleDeleteResolved = true));
    expect(lastResult()).toMatchObject({
      syncData: data.filter(it => it.id !== "a" && it.id !== "b"),
      asyncData: data.filter(it => it.id !== "a" && it.id !== "b"),
      viewState: "ready",
      errorState: null,
      error: null
    });

    await wait();
    expect(handleDeleteResolved).toBe(true);
  });

  it("handleDelete; should pass extra call args to onDelete()", async () => {
    let onDelete = jest.fn(async () => null);
    ({ lastResult, renderCount } = mountHook({ onDelete, data: INITIAL_DATA1 }));
    await wait();
    lastResult().handleDelete("a", "b", 123, false);
    await wait();
    expect(onDelete).lastCalledWith("a", "b", 123, false);
  });

  it("handleDelete; failure with Error instance - should not delete data & should set error state", async () => {
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let error = 123;
    let onDelete = jest.fn(async () => {
      throw (error = new Error("Test error"));
    });
    ({ lastResult, changeArgs } = mountHook({ onDelete, data }));
    await wait();

    lastResult()
      .handleDelete("a")
      .catch(e => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data,
      asyncData: data,
      viewState: "error",
      errorState: "delete",
      error
    });
  });

  it("handleDelete; failure with an object instance - should not delete data & should set error state", async () => {
    const DELETE1_FAIL = { message: "Failed." };
    let data = [{ id: "a" }, { id: "b" }, { id: "c" }];
    let error = 123;
    let onDelete = jest.fn(async () => {
      return Promise.reject((error = DELETE1_FAIL));
    });
    ({ lastResult, changeArgs } = mountHook({ onDelete, data }));
    await wait();

    lastResult()
      .handleDelete("a")
      .catch(e => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: [{ ...data[0], ...DELETE1_FAIL }].concat(data.slice(1)),
      asyncData: [{ ...data[0], ...DELETE1_FAIL }].concat(data.slice(1)),
      viewState: "error",
      errorState: "delete",
      error
    });
  });

  it("handleDelete; failure with an array - should delete some data & should set error state", async () => {
    const DELETE1_FAIL = [null, { key: "ok" }, { message: "Failed." }];
    let data = [{ id: "a", key: "nok" }, { id: "b" }, { id: "c" }];
    let error = 123;
    let onDelete = jest.fn(async () => {
      return Promise.reject((error = DELETE1_FAIL));
    });
    ({ lastResult, changeArgs } = mountHook({ onDelete, data }));
    await wait();

    lastResult()
      .handleDelete(["c", "a", "b"]) // item with id "c" receives null => should be deleted; "a" receives { key: "ok" }; "b" receives { message: "Failed" }
      .catch(e => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: [
        { ...data[0], ...DELETE1_FAIL[1] },
        { ...data[1], ...DELETE1_FAIL[2] }
      ],
      asyncData: [
        { ...data[0], ...DELETE1_FAIL[1] },
        { ...data[1], ...DELETE1_FAIL[2] }
      ],
      viewState: "error",
      errorState: "delete",
      error
    });
  });

  it("setData; should set new data", async () => {
    ({ lastResult, renderCount, changeArgs } = mountHook({ data: INITIAL_DATA1 }));
    await wait();

    lastResult().setData(LOAD_DATA1);
    expect(lastResult()).toMatchObject({
      syncData: LOAD_DATA1,
      asyncData: LOAD_DATA1,
      viewState: "ready",
      errorState: null,
      error: null
    });
  });

  it("parallel operations; should merge data to proper items even if calls resolve out-of-order", async () => {
    let data = [{ id: "1" }, { id: "2" }, { id: "3" }];
    ({ lastResult, startOp } = mountHookParallelOps(data));
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
      asyncData: data
    });

    let NEW_ITEM_LOCAL = { id: "new1" };
    let NEW_ITEM_EXTRA = { serverField: "abc" };
    let createOp = startOp("create", NEW_ITEM_LOCAL, async () => NEW_ITEM_EXTRA);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdate.concat([NEW_ITEM_LOCAL]),
      asyncData: data
    });

    let deleteOp = startOp("delete", data[0], async () => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdate.slice(1).concat([NEW_ITEM_LOCAL]),
      asyncData: data
    });

    await updateOp.finish(); // let the update finish
    let dataAfterUpdateFinished = [...dataAfterUpdate];
    dataAfterUpdateFinished.splice(1, 1, { ...dataAfterUpdate[1], ...UPDATED_ITEM_EXTRA });
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdateFinished.slice(1).concat([NEW_ITEM_LOCAL]),
      asyncData: dataAfterUpdateFinished
    });

    await deleteOp.finish(); // let the delete finish
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdateFinished.slice(1).concat([NEW_ITEM_LOCAL])
      // asyncData: dataAfterUpdateFinished // TODO OK? asyncData won't be updated yet because they're waiting for the first-launched op
    });

    await createOp.finish(); // let the create finish
    expect(lastResult()).toMatchObject({
      syncData: dataAfterUpdateFinished.slice(1).concat([{ ...NEW_ITEM_LOCAL, ...NEW_ITEM_EXTRA }]),
      asyncData: dataAfterUpdateFinished.slice(1).concat([{ ...NEW_ITEM_LOCAL, ...NEW_ITEM_EXTRA }])
    });
  });

  it.skip("parallel operations; should create items in proper order even if calls resolve out-of-order", async () => {
    let data = [{ id: "1" }, { id: "2" }, { id: "3" }];
    let NEW_ITEM1 = { id: "new1" };
    let NEW_ITEM2 = { id: "new2" };

    ({ lastResult, startOp } = mountHookParallelOps(data));
    await wait();

    // start performing "create#1", "create#2" and let them finish in order: "create#2", "create#1"
    let createOp1 = startOp("create", NEW_ITEM1, async () => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.concat([NEW_ITEM1]),
      asyncData: data
    });

    let createOp2 = startOp("create", NEW_ITEM2, async () => null);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: data.concat([NEW_ITEM1, NEW_ITEM2]),
      asyncData: data
    });

    await createOp2.finish(); // let the create#2 finish
    expect(lastResult()).toMatchObject({
      syncData: data.concat([NEW_ITEM1, NEW_ITEM2]),
      asyncData: data
    });

    await createOp1.finish(); // let the create#1 finish
    expect(lastResult()).toMatchObject({
      syncData: data.concat([NEW_ITEM1, NEW_ITEM2]),
      asyncData: data.concat([NEW_ITEM1, NEW_ITEM2])
    });
  });
});
