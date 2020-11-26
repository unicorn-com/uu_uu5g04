import { useDataObject } from "uu5g04-hooks";
import { wait, renderHook, act } from "uu5g05-test";

function expectedHandlerMap(handlerMap) {
  let r = {};
  for (let k in handlerMap) r[k] = handlerMap[k] ? expect.any(Function) : null;
  return r;
}

function expectedResult({
  data = expect.any(Object),
  state = expect.any(String),
  pendingData = expect.any(Object),
  errorData = expect.any(Object),
  handlerMap = expect.any(Object),
} = {}) {
  return { data, state, pendingData, errorData, handlerMap };
}

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
    let { lastResult } = renderHook(useDataObject);
    expect(lastResult()).toEqual({
      data: null,
      state: "readyNoData",
      pendingData: null,
      errorData: null,
      handlerMap: expectedHandlerMap({ setData: true }),
    });
  });

  it("prop initialData; should use initial data", () => {
    let { lastResult } = renderHook(useDataObject, { initialData: INITIAL_DATA1 });
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1,
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
  });

  it("prop initialData; should use initial data without calling onLoad", async () => {
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataObject, { initialData: INITIAL_DATA1, handlerMap });
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1,
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
    await wait();
    expect(handlerMap.load).toHaveBeenCalledTimes(0);
  });

  it("prop initialDtoIn; should pass initialDtoIn to initial load", async () => {
    let initialDtoIn = { a: "b" };
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    renderHook(useDataObject, { initialDtoIn, handlerMap });
    await wait();
    expect(handlerMap.load).toHaveBeenCalledTimes(1);
    expect(handlerMap.load.mock.calls[0][0]).toBe(initialDtoIn);
  });

  it("prop handlerMap.load; should be used for initial load & update state (success)", async () => {
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataObject, { handlerMap });
    expect(lastResult()).toEqual(
      expectedResult({
        data: null,
        state: "pendingNoData",
        errorData: null,
        pendingData: { operation: "load", dtoIn: undefined },
      })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1,
        state: "ready",
        errorData: null,
        pendingData: null,
      })
    );
    expect(handlerMap.load).toHaveBeenCalledTimes(1);
  });

  it("prop handlerMap.load; should be used for initial load & update state (error)", async () => {
    let error = 123;
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
        let { lastResult } = renderHook(useDataObject, { handlerMap });
        await wait();
        expect(lastResult()).toEqual(
          expectedResult({
            data: null,
            state: "errorNoData",
            pendingData: null,
            errorData: { operation: "load", dtoIn: undefined, error },
          })
        );
        expect(handlerMap.load).toHaveBeenCalledTimes(1);
      }
    );
  });

  it("prop handlerMap.*; should have all handlers in hook result", async () => {
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
      custom: jest.fn(async () => LOAD_DATA2),
    };
    let { lastResult } = renderHook(useDataObject, { handlerMap, initialData: INITIAL_DATA1 });
    expect(lastResult()).toEqual(
      expectedResult({
        handlerMap: expectedHandlerMap({ load: true, custom: true, setData: true }),
      })
    );
  });

  it("handlerMap.load(); should update data & state (success)", async () => {
    let CALL_PARAMS = { key: "value" };
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataObject, { handlerMap, initialData: INITIAL_DATA1 });
    let callResult, callResultResolved;
    act(() => {
      callResult = lastResult().handlerMap.load(CALL_PARAMS);
    });
    expect(callResult instanceof Promise).toBe(true);
    callResult.then((v) => (callResultResolved = v));
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1,
        state: "pending",
        errorData: null,
        pendingData: { operation: "load", dtoIn: CALL_PARAMS },
      })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1,
        state: "ready",
        errorData: null,
        pendingData: null,
      })
    );
    expect(handlerMap.load).toHaveBeenCalledTimes(1);
    expect(handlerMap.load.mock.calls[0][0]).toBe(CALL_PARAMS);
    expect(callResultResolved).toBe(LOAD_DATA1);
  });

  it("handlerMap.load(); should update data & state (error)", async () => {
    const CALL_PARAMS = { key: "value" };
    let error = 123;
    let handlerMap = {
      load: jest.fn(async () => {
        throw (error = new Error("Test error"));
      }),
    };
    let { lastResult } = renderHook(useDataObject, { handlerMap, initialData: INITIAL_DATA1 });
    let caughtError;
    act(() => {
      lastResult()
        .handlerMap.load(CALL_PARAMS)
        .catch((e) => (caughtError = e));
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1,
        state: "error",
        errorData: { operation: "load", dtoIn: CALL_PARAMS, error },
        pendingData: null,
      })
    );
    expect(caughtError).toBe(error);
  });

  it("handlerMap.<custom>(); should update data & state (success)", async () => {
    let CALL_PARAMS = { key: "value" };
    let handlerMap = {
      custom: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataObject, { handlerMap, initialData: INITIAL_DATA1 });
    let callResult, callResultResolved;
    act(() => {
      callResult = lastResult().handlerMap.custom(CALL_PARAMS);
    });
    expect(callResult instanceof Promise).toBe(true);
    callResult.then((v) => (callResultResolved = v));
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1,
        state: "pending",
        errorData: null,
        pendingData: { operation: "custom", dtoIn: CALL_PARAMS },
      })
    );
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1,
        state: "ready",
        errorData: null,
        pendingData: null,
      })
    );
    expect(handlerMap.custom).toHaveBeenCalledTimes(1);
    expect(handlerMap.custom.mock.calls[0][0]).toBe(CALL_PARAMS);
    expect(callResultResolved).toBe(LOAD_DATA1);
  });

  it("handlerMap.<custom>(); should update data & state (error)", async () => {
    const CALL_PARAMS = { key: "value" };
    let error = 123;
    let handlerMap = {
      custom: jest.fn(async () => {
        throw (error = new Error("Test error"));
      }),
    };
    let { lastResult } = renderHook(useDataObject, { handlerMap, initialData: INITIAL_DATA1 });
    let caughtError;
    act(() => {
      lastResult()
        .handlerMap.custom(CALL_PARAMS)
        .catch((e) => (caughtError = e));
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1,
        state: "error",
        errorData: { operation: "custom", dtoIn: CALL_PARAMS, error },
        pendingData: null,
      })
    );
    expect(caughtError).toBe(error);
  });

  it("handlerMap.setData(); should set new data", async () => {
    let { lastResult } = renderHook(useDataObject, { initialData: INITIAL_DATA1 });
    act(() => {
      lastResult().handlerMap.setData(LOAD_DATA1);
    });
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1,
        state: "ready",
        pendingData: null,
        errorData: null,
      })
    );
  });

  it("handlerMap.*(); should pass extra call args to handlers", async () => {
    let CALL_ARGS = [{ key: "value" }, 123, null, true];
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
      custom: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataObject, { handlerMap, initialData: INITIAL_DATA1 });
    for (let op in handlerMap) {
      act(() => {
        lastResult().handlerMap[op](...CALL_ARGS);
      });
      await wait();
      expect(handlerMap[op]).lastCalledWith(...CALL_ARGS);
    }
  });

  it("handlerMap.*(); should not be available if load/custom operation is in progress", async () => {
    let handlerMap = {
      load: jest.fn(async () => LOAD_DATA1),
      custom: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataObject, { handlerMap });

    // initial load
    expect(lastResult()).toEqual(expectedResult({ handlerMap: expectedHandlerMap({}) }));
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({ handlerMap: expectedHandlerMap({ setData: true, load: true, custom: true }) })
    );

    // load
    act(() => {
      lastResult().handlerMap.load();
    });
    expect(lastResult()).toEqual(expectedResult({ handlerMap: expectedHandlerMap({}) }));
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({ handlerMap: expectedHandlerMap({ setData: true, load: true, custom: true }) })
    );

    // custom operation
    act(() => {
      lastResult().handlerMap.custom();
    });
    expect(lastResult()).toEqual(expectedResult({ handlerMap: expectedHandlerMap({}) }));
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({ handlerMap: expectedHandlerMap({ setData: true, load: true, custom: true }) })
    );
  });

  it("handlerMap.*(); should reset error state on success", async () => {
    let handlerMap = {
      load: jest.fn(async () => {
        throw new Error("Test error");
      }),
      custom: jest.fn(async () => LOAD_DATA1),
    };
    let { lastResult } = renderHook(useDataObject, { handlerMap, initialData: INITIAL_DATA1 });
    act(() => {
      lastResult()
        .handlerMap.load()
        .catch((e) => null);
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: INITIAL_DATA1,
        state: "error",
        errorData: expect.objectContaining({ operation: "load" }),
      })
    );
    act(() => {
      lastResult().handlerMap.custom();
    });
    await wait();
    expect(lastResult()).toEqual(
      expectedResult({
        data: LOAD_DATA1,
        state: "ready",
        errorData: null,
        pendingData: null,
      })
    );
  });
});
