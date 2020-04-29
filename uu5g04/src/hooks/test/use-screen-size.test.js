import UU5 from "uu5g04";
import { useScreenSize, ScreenSizeProvider } from "uu5g04-hooks";

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs = [] }) {
  let result = useScreenSize(...hookArgs);
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

function mountHookWithProvider(width) {
  let renderFn = jest.fn(() => <div />);
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
        <Component>{renderFn}</Component>
      </ScreenSizeProvider>
    )
  });
  return {
    lastResult: () => renderFn.mock.calls[renderFn.mock.calls.length - 1][0],
    renderCount: () => renderFn.mock.calls.length
  };
}

async function setWindowWidth(newWidth) {
  window.innerWidth = newWidth;
  let event = new UIEvent("resize", {});
  window.dispatchEvent(event);
}

describe("[uu5g04-hooks] useScreenSize with window", () => {
  let lastResult;

  it("should return expected result API", () => {
    ({ lastResult } = mountHook());
    expect(lastResult()).toMatchObject({
      screenSize: expect.any(String)
    });
  });

  it("should report size based on window size", async () => {
    await setWindowWidth(UU5.Utils.ScreenSize.XS);
    ({ lastResult } = mountHook());

    expect(lastResult()).toMatchObject({ screenSize: "xs" });
    await setWindowWidth(UU5.Utils.ScreenSize.S);
    expect(lastResult()).toMatchObject({ screenSize: "s" });
    await setWindowWidth(UU5.Utils.ScreenSize.M);
    expect(lastResult()).toMatchObject({ screenSize: "m" });
    await setWindowWidth(UU5.Utils.ScreenSize.L);
    expect(lastResult()).toMatchObject({ screenSize: "l" });
    await setWindowWidth(UU5.Utils.ScreenSize.L + 1);
    expect(lastResult()).toMatchObject({ screenSize: "xl" });
  });
});

describe("[uu5g04-hooks] useScreenSize with ScreenSizeProvider", () => {
  let lastResult;

  it("should return expected result API", () => {
    ({ lastResult } = mountHookWithProvider(200));
    expect(lastResult()).toMatchObject({
      screenSize: expect.any(String)
    });
  });

  it("should report size based on provider value", async () => {
    await setWindowWidth(1024);

    // NOTE ResizeObserver doesn't work in Jest so we'll re-mount everytime
    // with different width on wrapping <div>.
    ({ lastResult } = mountHookWithProvider(UU5.Utils.ScreenSize.XS));
    expect(lastResult()).toMatchObject({ screenSize: "xs" });

    ({ lastResult } = mountHookWithProvider(UU5.Utils.ScreenSize.S));
    expect(lastResult()).toMatchObject({ screenSize: "s" });

    ({ lastResult } = mountHookWithProvider(UU5.Utils.ScreenSize.M));
    expect(lastResult()).toMatchObject({ screenSize: "m" });

    ({ lastResult } = mountHookWithProvider(UU5.Utils.ScreenSize.L));
    expect(lastResult()).toMatchObject({ screenSize: "l" });

    ({ lastResult } = mountHookWithProvider(UU5.Utils.ScreenSize.L + 1));
    expect(lastResult()).toMatchObject({ screenSize: "xl" });
  });
});
