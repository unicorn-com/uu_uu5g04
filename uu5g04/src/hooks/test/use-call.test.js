import UU5 from "uu5g04";
import { useCall } from "uu5g04-hooks";

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs }) {
  let result = useCall(...hookArgs);
  // NOTE Using Inner to measure render counts of subtrees (hooks are allowed to change their state during render
  // because it results in re-calling of the Component but not of its subtree - we don't want to measure these
  // shallow re-renders).
  return <Inner result={result}>{children}</Inner>;
}
function Inner({ children, result }) {
  return children(result);
}

function mountHook(...hookArgs) {
  let renderFn = jest.fn(() => <div />);
  let wrapper = mount(<Component hookArgs={hookArgs}>{renderFn}</Component>);
  return {
    lastResult: () => renderFn.mock.calls[renderFn.mock.calls.length - 1][0],
    renderCount: () => renderFn.mock.calls.length,
    changeArgs: (...newArgs) => wrapper.setProps({ hookArgs: newArgs }),
    allResults: () => renderFn.mock.calls.map(cl => cl[0])
  };
}

describe("[uu5g04-hooks] useCall behaviour", () => {
  let lastResult;

  it("should return expected result API", () => {
    ({ lastResult } = mountHook());
    expect(lastResult()).toMatchObject({
      viewState: "ready",
      data: undefined,
      error: undefined,
      call: expect.any(Function)
    });
  });

  it("call; should perform call and update state (success)", async () => {
    ({ lastResult } = mountHook(async () => 123));
    let call = lastResult().call();
    expect(lastResult()).toMatchObject({ viewState: "call", data: undefined, error: undefined });
    await call;
    expect(lastResult()).toMatchObject({ viewState: "ready", data: 123, error: null });
  });

  it("call; should perform call and update state (error)", async () => {
    let error;
    ({ lastResult } = mountHook(async () => {
      throw (error = new Error("Test error"));
    }));
    let call = lastResult().call();
    expect(lastResult()).toMatchObject({ viewState: "call", data: undefined, error: undefined });
    await call.catch(e => null);
    expect(lastResult()).toMatchObject({ viewState: "error", data: null, error });
  });

  it("call; should preserve previous result while new call is running", async () => {
    let error, call;
    ({ lastResult } = mountHook(async value => value));
    await lastResult().call(123);
    expect(lastResult()).toMatchObject({ viewState: "ready", data: 123, error: null });

    call = lastResult().call(Promise.reject((error = new Error("Test error"))));
    expect(lastResult()).toMatchObject({ viewState: "call", data: 123, error: null });
    await call.catch(e => null);
    expect(lastResult()).toMatchObject({ viewState: "error", data: null, error });

    call = lastResult().call(234);
    expect(lastResult()).toMatchObject({ viewState: "call", data: null, error });
    await call;
    expect(lastResult()).toMatchObject({ viewState: "ready", data: 234, error: null });
  });

  it("call; should pass args to call function", async () => {
    let callFn = jest.fn(async () => null);
    ({ lastResult } = mountHook(callFn));
    lastResult().call("a", 123);
    expect(callFn).toHaveBeenLastCalledWith("a", 123);
  });
});
