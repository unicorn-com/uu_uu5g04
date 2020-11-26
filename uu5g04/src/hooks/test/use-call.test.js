import { useCall } from "uu5g04-hooks";
import { renderHook, act } from "uu5g05-test";

describe("[uu5g04-hooks] useCall", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useCall);
    expect(lastResult()).toMatchObject({
      viewState: "ready",
      data: undefined,
      error: undefined,
      call: expect.any(Function),
    });
  });

  it("call; should perform call and update state (success)", async () => {
    let { lastResult } = renderHook(useCall, async () => 123);
    let callPromise;
    act(() => {
      callPromise = lastResult().call();
    });
    expect(lastResult()).toMatchObject({ viewState: "call", data: undefined, error: undefined });
    await act(() => callPromise);
    expect(lastResult()).toMatchObject({ viewState: "ready", data: 123, error: null });
  });

  it("call; should perform call and update state (error)", async () => {
    let error;
    let { lastResult } = renderHook(useCall, async () => {
      throw (error = new Error("Test error"));
    });
    let callPromise;
    act(() => {
      callPromise = lastResult().call();
    });
    expect(lastResult()).toMatchObject({ viewState: "call", data: undefined, error: undefined });
    await act(() => callPromise.catch((e) => null));
    expect(lastResult()).toMatchObject({ viewState: "error", data: null, error });
  });

  it("call; should preserve previous result while new call is running", async () => {
    let error, callPromise;
    let { lastResult } = renderHook(useCall, async (value) => value);
    await act(() => lastResult().call(123));
    expect(lastResult()).toMatchObject({ viewState: "ready", data: 123, error: null });

    act(() => {
      callPromise = lastResult().call(Promise.reject((error = new Error("Test error"))));
    });
    expect(lastResult()).toMatchObject({ viewState: "call", data: 123, error: null });
    await act(() => callPromise.catch((e) => null));
    expect(lastResult()).toMatchObject({ viewState: "error", data: null, error });

    act(() => {
      callPromise = lastResult().call(234);
    });
    expect(lastResult()).toMatchObject({ viewState: "call", data: null, error });
    await act(() => callPromise);
    expect(lastResult()).toMatchObject({ viewState: "ready", data: 234, error: null });
  });

  it("call; should pass args to call function", async () => {
    let callFn = jest.fn(async () => null);
    let { lastResult } = renderHook(useCall, callFn);
    await act(() => lastResult().call("a", 123));
    expect(callFn).toHaveBeenLastCalledWith("a", 123);
  });
});
