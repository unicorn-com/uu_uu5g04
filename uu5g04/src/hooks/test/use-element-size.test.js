import UU5 from "uu5g04";
import { useElementSize } from "uu5g04-hooks";

const { mount, initHookRenderer } = UU5.Test.Tools;

function renderHookInElement(width = 100, height = 200, ...initialHookParams) {
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
  let { HookComponent, ...result } = initHookRenderer(useElementSize, ...initialHookParams);
  mount(
    <HookComponent>
      {hookResult => <div ref={ref => (defineSizes(ref), hookResult ? hookResult.ref(ref) : undefined)} />}
    </HookComponent>
  );
  return result;
}

describe("[uu5g04-hooks] useElementSize", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHookInElement();
    expect(lastResult()).toMatchObject({
      ref: expect.any(Function),
      width: expect.any(Number),
      height: expect.any(Number)
    });
  });

  it("should report initial size followed by real size", async () => {
    let lastResult, renderCount, allResults;
    ({ lastResult, renderCount, allResults } = renderHookInElement(300, 200));
    expect(renderCount()).toBe(2);
    expect(allResults()[0]).toMatchObject({ width: undefined, height: undefined });
    expect(lastResult()).toMatchObject({ width: 300, height: 200 });

    ({ lastResult, renderCount, allResults } = renderHookInElement(300, 200, { width: 30, height: 20 }));
    expect(renderCount()).toBe(2);
    expect(allResults()[0]).toMatchObject({ width: 30, height: 20 });
    expect(lastResult()).toMatchObject({ width: 300, height: 200 });
  });

  it("should report size based on element size", async () => {
    let lastResult;
    // NOTE ResizeObserver doesn't work in Jest so we'll re-mount everytime
    // with different width on <div>.
    ({ lastResult } = renderHookInElement(300, 200));
    expect(lastResult()).toMatchObject({ width: 300, height: 200 });

    ({ lastResult } = renderHookInElement(200, null));
    expect(lastResult()).toMatchObject({ width: 200 });

    ({ lastResult } = renderHookInElement(null, 100));
    expect(lastResult()).toMatchObject({ height: 100 });
  });
});
