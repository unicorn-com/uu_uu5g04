import UU5 from "uu5g04";
import { useScreenSize, ScreenSizeProvider } from "uu5g04-hooks";

const { mount, renderHook, initHookRenderer, act } = UU5.Test.Tools;

function renderHookWithProvider(width) {
  let { HookComponent, ...result } = initHookRenderer(useScreenSize);
  let wrapper = mount(<div />);
  Object.defineProperties(wrapper.getDOMNode(), {
    clientWidth: { get: () => width, configurable: true },
    getBoundingClientRect: {
      get: () => () => ({ width, height: 1, left: 0, top: 0, right: width, bottom: 1 }),
      configurable: true
    }
  });
  wrapper.setProps({
    children: (
      <ScreenSizeProvider>
        <HookComponent />
      </ScreenSizeProvider>
    )
  });
  return result;
}

async function setWindowWidth(newWidth) {
  act(() => {
    window.innerWidth = newWidth;
    let event = new UIEvent("resize", {});
    window.dispatchEvent(event);
  });
}

describe("[uu5g04-hooks] useScreenSize with window", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useScreenSize);
    expect(lastResult()).toEqual(expect.any(String));
  });

  it("should report size based on window size", async () => {
    await setWindowWidth(UU5.Utils.ScreenSize.XS);
    let { lastResult } = renderHook(useScreenSize);

    expect(lastResult()).toBe("xs");
    await setWindowWidth(UU5.Utils.ScreenSize.S);
    expect(lastResult()).toBe("s");
    await setWindowWidth(UU5.Utils.ScreenSize.M);
    expect(lastResult()).toBe("m");
    await setWindowWidth(UU5.Utils.ScreenSize.L);
    expect(lastResult()).toBe("l");
    await setWindowWidth(UU5.Utils.ScreenSize.L + 1);
    expect(lastResult()).toBe("xl");
  });
});

describe("[uu5g04-hooks] useScreenSize with ScreenSizeProvider", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHookWithProvider(200);
    expect(lastResult()).toEqual(expect.any(String));
  });

  it("should report size based on provider value", async () => {
    let lastResult;
    await setWindowWidth(1024);

    // NOTE ResizeObserver doesn't work in Jest so we'll re-mount everytime
    // with different width on wrapping <div>.
    ({ lastResult } = renderHookWithProvider(UU5.Utils.ScreenSize.XS));
    expect(lastResult()).toBe("xs");

    ({ lastResult } = renderHookWithProvider(UU5.Utils.ScreenSize.S));
    expect(lastResult()).toBe("s");

    ({ lastResult } = renderHookWithProvider(UU5.Utils.ScreenSize.M));
    expect(lastResult()).toBe("m");

    ({ lastResult } = renderHookWithProvider(UU5.Utils.ScreenSize.L));
    expect(lastResult()).toBe("l");

    ({ lastResult } = renderHookWithProvider(UU5.Utils.ScreenSize.L + 1));
    expect(lastResult()).toBe("xl");
  });
});
