import UU5 from "uu5g04";
import { useElementSize } from "uu5g04-hooks";

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs = [] }) {
  let result = useElementSize(...hookArgs);
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
    changeArgs: (...newArgs) => wrapper.setProps({ hookArgs: newArgs })
  };
}

function mountHookInElement(width = 100, height = 200, ...hookArgs) {
  let defineSizes = el => {
    if (el) {
      Object.defineProperties(el, {
        clientWidth: { get: () => width, configurable: true },
        clientHeight: { get: () => height, configurable: true },
        getBoundingClientRect: {
          get: () => () => ({ width, height, left: 0, top: 0, right: width, bottom: height }),
          configurable: true
        }
      });
    }
  };
  let renderFn = jest.fn(hookResult => (
    <div ref={ref => (defineSizes(ref), hookResult ? hookResult.ref(ref) : undefined)} />
  ));
  let wrapper = mount(<Component hookArgs={hookArgs}>{renderFn}</Component>);
  return {
    lastResult: () => renderFn.mock.calls[renderFn.mock.calls.length - 1][0],
    renderCount: () => renderFn.mock.calls.length,
    changeArgs: (...newArgs) => wrapper.setProps({ hookArgs: newArgs }),
    allResults: () => renderFn.mock.calls.map(cl => cl[0])
  };
}

describe("[uu5g04-hooks] useElementSize", () => {
  let lastResult, renderCount, allResults;

  it("should return expected result API", () => {
    ({ lastResult } = mountHookInElement());
    expect(lastResult()).toMatchObject({
      ref: expect.any(Function),
      width: expect.any(Number),
      height: expect.any(Number)
    });
  });

  it("should report initial size followed by real size", async () => {
    ({ lastResult, renderCount, allResults } = mountHookInElement(300, 200));
    expect(renderCount()).toBe(2);
    expect(allResults()[0]).toMatchObject({ width: undefined, height: undefined });
    expect(lastResult()).toMatchObject({ width: 300, height: 200 });

    ({ lastResult, renderCount, allResults } = mountHookInElement(300, 200, { width: 30, height: 20 }));
    expect(renderCount()).toBe(2);
    expect(allResults()[0]).toMatchObject({ width: 30, height: 20 });
    expect(lastResult()).toMatchObject({ width: 300, height: 200 });
  });

  it("should report size based on element size", async () => {
    // NOTE ResizeObserver doesn't work in Jest so we'll re-mount everytime
    // with different width on <div>.
    ({ lastResult } = mountHookInElement(300, 200));
    expect(lastResult()).toMatchObject({ width: 300, height: 200 });

    ({ lastResult } = mountHookInElement(200, null));
    expect(lastResult()).toMatchObject({ width: 200 });

    ({ lastResult } = mountHookInElement(null, 100));
    expect(lastResult()).toMatchObject({ height: 100 });
  });
});
