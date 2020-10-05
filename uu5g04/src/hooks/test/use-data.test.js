import UU5 from "uu5g04";
import { useData } from "uu5g04-hooks";

const { wait, renderHook, act } = UU5.Test.Tools;

function renderHookParallelOps(initialDataFromOnLoad, ...hookArgs) {
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

  let result = renderHook(useData, { ...hookArgs[0], onLoad, onUpdate }, ...hookArgs.slice(1));
  result.onLoad = onLoad;
  result.onUpdate = onUpdate;
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
  result.forceRender = () => result.wrapper.setProps({ foo: Math.random() });
  return result;
}

const INITIAL_DATA1 = {
  key: "initial1",
};
const LOAD_DATA1 = {
  key: "load1",
};
const LOAD_DATA2 = {
  key: "load2",
};

describe("[uu5g04-hooks] useData behaviour", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useData);
    expect(lastResult()).toMatchObject({
      syncData: null,
      asyncData: null,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [],
      handleLoad: expect.any(Function),
      handleUpdate: expect.any(Function),
      setData: expect.any(Function),
      clearOperations: expect.any(Function),
    });
  });

  it("prop data; should use initial data", () => {
    let { lastResult } = renderHook(useData, { data: INITIAL_DATA1 });
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1,
      asyncData: INITIAL_DATA1,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [],
    });
  });

  it("prop data; should use initial data without calling onLoad", async () => {
    let onLoad = jest.fn(async () => LOAD_DATA1);
    let { lastResult } = renderHook(useData, { onLoad, data: INITIAL_DATA1 });
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

  it("prop dtoIn; should pass dtoIn to initial load", async () => {
    let dtoIn = { a: "b" };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    renderHook(useData, { onLoad, dtoIn });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onLoad).toHaveBeenCalledWith(dtoIn);
  });

  it("prop dtoIn; should pass dtoIn if onLoad changes", async () => {
    let dtoIn = { a: "b" };
    let onLoad1 = jest.fn(async () => LOAD_DATA1);
    let onLoad2 = jest.fn(async () => LOAD_DATA2);
    let { rerender } = renderHook(useData, { onLoad: onLoad1, dtoIn });
    await wait();
    rerender({ onLoad: onLoad2, dtoIn });
    await wait();
    expect(onLoad2).toHaveBeenCalledTimes(1);
    expect(onLoad2).toHaveBeenCalledWith(dtoIn);
  });

  it("prop dtoIn; should reload if dtoIn changes", async () => {
    let dtoIn1 = { a: "b" };
    let dtoIn2 = { a: "c" };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    let { rerender } = renderHook(useData, { onLoad, dtoIn: dtoIn1 });
    await wait();
    rerender({ onLoad, dtoIn: dtoIn2 });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).toHaveBeenLastCalledWith(dtoIn2);
  });

  it("prop dtoIn; should not reload if dtoIn is deeply same as before", async () => {
    let dtoIn1 = { a: "b" };
    let dtoIn1Copy = { ...dtoIn1 };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    let { rerender } = renderHook(useData, { onLoad, dtoIn: dtoIn1 });
    await wait();
    rerender({ onLoad, dtoIn: dtoIn1Copy });
    await wait();
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onLoad).toHaveBeenLastCalledWith(dtoIn1Copy);
  });

  it("prop dtoIn; should not pass dtoIn to handleLoad loads", async () => {
    let dtoIn = { a: "b" };
    let onLoad = jest.fn(async () => LOAD_DATA1);
    let { lastResult } = renderHook(useData, { onLoad, dtoIn });
    await wait();
    await act(() => lastResult().handleLoad());
    expect(onLoad).toHaveBeenCalledTimes(2);
    expect(onLoad).toHaveBeenLastCalledWith();
  });

  it("prop onLoad; should update state after onLoad (success)", async () => {
    let { lastResult } = renderHook(useData, { onLoad: jest.fn(async () => LOAD_DATA1) });
    expect(lastResult()).toMatchObject({
      viewState: "load",
      operations: [{ type: "load", state: "pending", result: undefined }],
    });
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

  it("prop onLoad; should update state after onLoad (error)", async () => {
    let error = 123;
    let { lastResult } = renderHook(useData, {
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

  it("prop onLoad; should do reload if onLoad changes && should reset error state", async () => {
    let error = 123;
    let { lastResult, rerender } = renderHook(useData, {
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
    let { lastResult } = renderHook(useData, { onLoad });
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

  it("handleLoad; should pass extra call args to onLoad()", async () => {
    let onLoad = jest.fn(async () => null);
    let { lastResult } = renderHook(useData, { onLoad });
    await wait();
    act(() => {
      lastResult().handleLoad("a", "b", 123, false);
    });
    await wait();
    expect(onLoad).lastCalledWith("a", "b", 123, false);
  });

  it("handleUpdate; should replace data (success)", async () => {
    const UPDATE1 = { key: "updated1" };
    const UPDATE1_FULL = { a: "b" };
    let onUpdate = jest.fn(async () => UPDATE1_FULL);
    let { lastResult } = renderHook(useData, { onUpdate, data: INITIAL_DATA1 });
    await wait();

    let handleUpdateResolved;
    act(() => {
      lastResult()
        .handleUpdate(UPDATE1)
        .then(() => (handleUpdateResolved = true));
    });
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: UPDATE1,
      asyncData: INITIAL_DATA1,
      viewState: "update",
      errorState: null,
      error: null,
      operations: [{ type: "update", state: "pending", result: undefined }],
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: UPDATE1_FULL,
      asyncData: UPDATE1_FULL,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "update", state: "success", result: UPDATE1_FULL }],
    });
    expect(handleUpdateResolved).toBe(true);
  });

  it("handleUpdate; should not replace data & should set error state (failure)", async () => {
    const UPDATE1 = { key: "updated1" };
    let error = 123;
    let onUpdate = jest.fn(async () => {
      throw (error = new Error("Test error"));
    });
    let { lastResult } = renderHook(useData, { onUpdate, data: INITIAL_DATA1 });
    await wait();

    act(() => {
      lastResult()
        .handleUpdate(UPDATE1)
        .catch((e) => null);
    });
    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledWith(UPDATE1);
    expect(lastResult()).toMatchObject({
      syncData: UPDATE1,
      asyncData: INITIAL_DATA1,
      operations: [{ type: "update", state: "pending", result: undefined }],
    });

    await wait(); // finish update
    expect(lastResult()).toMatchObject({
      syncData: INITIAL_DATA1,
      asyncData: INITIAL_DATA1,
      viewState: "error",
      errorState: "update",
      error,
      operations: [{ type: "update", state: "error", result: error }],
    });
  });

  it("handleUpdate; should reset error state on success", async () => {
    let error = 123;
    let { lastResult } = renderHook(useData, {
      onLoad: jest.fn(async () => {
        throw (error = new Error("Test error"));
      }),
      onUpdate: jest.fn(async (value) => value),
    });
    await wait();
    expect(lastResult()).toMatchObject({ viewState: "error", errorState: "load", error });

    act(() => {
      lastResult()
        .handleUpdate(123)
        .catch((e) => null);
    });
    expect(lastResult()).toMatchObject({ viewState: "update" });
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: 123,
      asyncData: 123,
      viewState: "ready",
      errorState: null,
      error: null,
      operations: [{ type: "update", state: "success", result: 123 }],
    });
  });

  it("handleUpdate; should pass extra call args to onUpdate()", async () => {
    let onUpdate = jest.fn(async () => null);
    let { lastResult } = renderHook(useData, { onUpdate, data: INITIAL_DATA1 });
    await wait();
    act(() => {
      lastResult().handleUpdate("a", "b", 123, false);
    });
    await wait();
    expect(onUpdate).lastCalledWith("a", "b", 123, false);
  });

  it("setData; should set new data", async () => {
    let { lastResult } = renderHook(useData, { data: INITIAL_DATA1 });
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

  it("operations; should update continuously based on handle* calls", async () => {
    let { startOp, allResults } = renderHookParallelOps(INITIAL_DATA1);
    await wait();

    let updateOp1 = startOp("update", 123, async () => 123);
    let updateOp2 = startOp("update", 234, async () => 234);
    await updateOp1.unblock();
    let updateOp3 = startOp("update", 345, async () => 345);
    await updateOp2.unblock();
    await updateOp3.unblock();

    expect(allResults()).toMatchObject([
      { viewState: "load", operations: [] },
      {
        viewState: "load",
        operations: [{ type: "load", state: "pending" }],
      },
      {
        viewState: "ready",
        operations: [{ type: "load", state: "success", result: INITIAL_DATA1 }],
      },
      {
        viewState: "update",
        operations: [{ type: "update", state: "pending" }],
      },
      {
        viewState: "update",
        operations: [
          { type: "update", state: "pending" },
          { type: "update", state: "pending" },
        ],
      },
      {
        viewState: "update",
        operations: [
          { type: "update", state: "success", result: 123 },
          { type: "update", state: "pending" },
        ],
      },
      {
        viewState: "update",
        operations: [
          { type: "update", state: "pending" },
          { type: "update", state: "pending" },
        ],
      },
      {
        viewState: "update",
        operations: [
          { type: "update", state: "success", result: 234 },
          { type: "update", state: "pending" },
        ],
      },
      {
        viewState: "ready",
        operations: [{ type: "update", state: "success", result: 345 }],
      },
    ]);
  });

  it("prop preserveOperations; should preserve all performed operations", async () => {
    let { startOp, allResults } = renderHookParallelOps(INITIAL_DATA1, { preserveOperations: true });
    await wait();

    let updateOp1 = startOp("update", 123, async () => 123);
    let updateOp2 = startOp("update", 234, async () => 234);
    await updateOp1.unblock();
    let updateOp3 = startOp("update", 345, async () => 345);
    await updateOp2.unblock();
    await updateOp3.unblock();

    expect(allResults()).toMatchObject([
      { viewState: "load", operations: [] },
      {
        viewState: "load",
        operations: [{ type: "load", state: "pending" }],
      },
      {
        viewState: "ready",
        operations: [{ type: "load", state: "success", result: INITIAL_DATA1 }],
      },
      {
        viewState: "update",
        operations: [
          { type: "load", state: "success", result: INITIAL_DATA1 },
          { type: "update", state: "pending" },
        ],
      },
      {
        viewState: "update",
        operations: [
          { type: "load", state: "success", result: INITIAL_DATA1 },
          { type: "update", state: "pending" },
          { type: "update", state: "pending" },
        ],
      },
      {
        viewState: "update",
        operations: [
          { type: "load", state: "success", result: INITIAL_DATA1 },
          { type: "update", state: "success", result: 123 },
          { type: "update", state: "pending" },
        ],
      },
      {
        viewState: "update",
        operations: [
          { type: "load", state: "success", result: INITIAL_DATA1 },
          { type: "update", state: "success", result: 123 },
          { type: "update", state: "pending" },
          { type: "update", state: "pending" },
        ],
      },
      {
        viewState: "update",
        operations: [
          { type: "load", state: "success", result: INITIAL_DATA1 },
          { type: "update", state: "success", result: 123 },
          { type: "update", state: "success", result: 234 },
          { type: "update", state: "pending" },
        ],
      },
      {
        viewState: "ready",
        operations: [
          { type: "load", state: "success", result: INITIAL_DATA1 },
          { type: "update", state: "success", result: 123 },
          { type: "update", state: "success", result: 234 },
          { type: "update", state: "success", result: 345 },
        ],
      },
    ]);
  });

  it("clearOperations; should clean all finished operations", async () => {
    let { lastResult, startOp, forceRender } = renderHookParallelOps(INITIAL_DATA1, {
      preserveOperations: true,
    });
    await wait();
    await startOp("update", 123, async () => 123).unblock();
    await startOp("update", 234, async () => 234).unblock();
    startOp("update", 345, async () => 345);
    expect(lastResult().operations.length).toBe(4); // finished "load" + 2 finished updates + 1 unfinished update
    let opIds = lastResult().operations.map((op) => op.id);

    lastResult().clearOperations();
    forceRender();
    expect(lastResult().operations.length).toBe(1);
    expect(lastResult().operations[0]).toMatchObject({ id: opIds[3] });
  });

  it("clearOperations; should clean by id", async () => {
    let { lastResult, startOp, forceRender } = renderHookParallelOps(INITIAL_DATA1, {
      preserveOperations: true,
    });
    await wait();
    await startOp("update", 123, async () => 123).unblock();
    await startOp("update", 234, async () => 234).unblock();
    startOp("update", 345, async () => 345);
    expect(lastResult().operations.length).toBe(4); // finished "load" + 2 finished updates + 1 unfinished update
    let opIds = lastResult().operations.map((op) => op.id);

    lastResult().clearOperations(opIds[1]);
    forceRender();
    expect(lastResult().operations.length).toBe(3);
    expect(lastResult().operations).toMatchObject(opIds.filter((id, i) => i !== 1).map((id) => ({ id })));
  });

  it("clearOperations; should clean by item", async () => {
    let { lastResult, startOp, forceRender } = renderHookParallelOps(INITIAL_DATA1, {
      preserveOperations: true,
    });
    await wait();
    await startOp("update", 123, async () => 123).unblock();
    await startOp("update", 234, async () => 234).unblock();
    startOp("update", 345, async () => 345);
    expect(lastResult().operations.length).toBe(4); // finished "load" + 2 finished updates + 1 unfinished update
    let opIds = lastResult().operations.map((op) => op.id);

    lastResult().clearOperations(lastResult().operations[1]);
    forceRender();
    expect(lastResult().operations.length).toBe(3);
    expect(lastResult().operations).toMatchObject(opIds.filter((id, i) => i !== 1).map((id) => ({ id })));
  });

  it("clearOperations; should clean by item (array)", async () => {
    let { lastResult, startOp, forceRender } = renderHookParallelOps(INITIAL_DATA1, {
      preserveOperations: true,
    });
    await wait();
    await startOp("update", 123, async () => 123).unblock();
    await startOp("update", 234, async () => 234).unblock();
    startOp("update", 345, async () => 345);
    expect(lastResult().operations.length).toBe(4); // finished "load" + 2 finished updates + 1 unfinished update
    let opIds = lastResult().operations.map((op) => op.id);

    lastResult().clearOperations(lastResult().operations.slice(0, 2));
    forceRender();
    expect(lastResult().operations.length).toBe(2);
    expect(lastResult().operations).toMatchObject(opIds.filter((id, i) => i >= 2).map((id) => ({ id })));
  });

  it("clearOperations; should clean by ids but only finished ops", async () => {
    let { lastResult, startOp, forceRender } = renderHookParallelOps(INITIAL_DATA1, {
      preserveOperations: true,
    });
    await wait();
    await startOp("update", 123, async () => 123).unblock();
    await startOp("update", 234, async () => 234).unblock();
    startOp("update", 345, async () => 345);
    expect(lastResult().operations.length).toBe(4); // finished "load" + 2 finished updates + 1 unfinished update
    let opIds = lastResult().operations.map((op) => op.id);

    lastResult().clearOperations([opIds[2], opIds[3]]);
    forceRender();
    expect(lastResult().operations.length).toBe(3);
    expect(lastResult().operations).toMatchObject(opIds.filter((id, i) => i !== 2).map((id) => ({ id }))); // last op is still running => should be present
  });

  it.skip("parallel operations; should replace data in proper order even if calls resolve out-of-order", async () => {
    let { lastResult, startOp, onUpdate } = renderHookParallelOps(INITIAL_DATA1);
    await wait();
    expect(lastResult()).toMatchObject({ syncData: INITIAL_DATA1, asyncData: INITIAL_DATA1 });

    // start performing "update#1", "update#2" and let them finish in order: "update#2", "update#1"
    let updateOp1 = startOp("update", 123, async () => 123);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: 123,
      asyncData: INITIAL_DATA1,
    });

    // FIXME It is better to
    // a) (optimal) keep it in the order it was supposed to end up, i.e. onUpdate#2 must not be called
    //    until onUpdate#1 finishes to ensure that server/call does processing in the proper order too
    // b) (suboptimal) keep it in the order as it was "processed by server", i.e. if onUpdate#1 finishes after
    //    onUpdate#2 then the end result should be onUpdate#1. This keeps display in sync with server but
    //    the user will have to repeat update#2 as it got overwritten by slower update#1.
    // c) (risky) keep it displayed in the order it was supposed to end up, but without ensuring that
    //    the calls finished in that particular order. This keeps display as it was supposed to be
    //    but can be out of sync with server (i.e. we're displaying that update#2 is what wins but
    //    if update#1 was slower and got processed later then the server will actually have data from update#1 as the latest).
    let updateOp2 = startOp("update", 234, async () => 234);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: 234,
      asyncData: INITIAL_DATA1,
    });

    await updateOp2.unblock();
    await updateOp1.unblock();
    expect(lastResult()).toMatchObject({
      syncData: 234,
      asyncData: 234,
    });
  });

  it.skip("parallel operations; should wait with update-s until currently running update finishes", async () => {
    let { lastResult, startOp, onUpdate } = renderHookParallelOps(INITIAL_DATA1);
    await wait();

    // start performing "update#1", "update#2", "update#3"
    let updateOp1 = startOp("update", 123, async () => 123);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: 123,
      asyncData: INITIAL_DATA1,
    });

    let updateOp2 = startOp("update", 234, async () => 234);
    await wait();
    expect(onUpdate).toHaveBeenCalledTimes(1); // update#2 should not have started executing yet
    expect(lastResult()).toMatchObject({
      syncData: 234,
      asyncData: INITIAL_DATA1,
    });

    let updateOp3 = startOp("update", 345, async () => 345);
    expect(onUpdate).toHaveBeenCalledTimes(1); // update#3 should not have started executing yet
    await wait();
    expect(lastResult()).toMatchObject({
      syncData: 345,
      asyncData: INITIAL_DATA1,
    });

    await updateOp1.unblock();
    expect(lastResult()).toMatchObject({
      syncData: 345,
      asyncData: 123,
    });
    await updateOp2.unblock();
    await updateOp3.unblock();
    expect(onUpdate).toHaveBeenCalledTimes(3); // TODO If we allow skipping of updates (update#2 could have been skipped altogether), this can be 2.
    expect(lastResult()).toMatchObject({
      syncData: 345,
      asyncData: 345,
    });
  });
});
