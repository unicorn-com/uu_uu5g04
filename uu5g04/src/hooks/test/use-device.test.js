import UU5 from "uu5g04";
import { useDevice, DeviceProvider } from "uu5g04-hooks";

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs }) {
  let result = useDevice(...hookArgs);
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

function mountHookWithProvider(providerProps, ...hookArgs) {
  let renderFn = jest.fn(() => <div />);
  let Comp = props => (
    <DeviceProvider {...props.providerProps}>
      <Component hookArgs={props.hookArgs}>{renderFn}</Component>
    </DeviceProvider>
  );
  let wrapper = mount(<Comp providerProps={providerProps} hookArgs={hookArgs} />);
  return {
    lastResult: () => renderFn.mock.calls[renderFn.mock.calls.length - 1][0],
    renderCount: () => renderFn.mock.calls.length,
    changeArgs: (...newArgs) => wrapper.setProps({ hookArgs: newArgs }),
    allResults: () => renderFn.mock.calls.map(cl => cl[0]),
    changeProviderProps: newProps => wrapper.setProps({ providerProps: newProps })
  };
}

describe("[uu5g04-hooks] useDevice behaviour", () => {
  let lastResult, changeProviderProps;

  it("should return expected result API", () => {
    ({ lastResult } = mountHook());
    expect(lastResult()).toMatchObject({
      browserName: expect.any(String),
      platform: expect.any(String),
      hasTouch: expect.any(Boolean),
      hasPointer: expect.any(Boolean),
      orientation: expect.any(String),
      // isWebView: expect.any(Boolean), // TODO Uncomment
      isHeadless: expect.any(Boolean)
    });
  });

  it("should detect common browsers", async () => {
    let checkUserAgent = (userAgent, expectedValues) => {
      Object.defineProperty(navigator, "userAgent", {
        get() {
          return userAgent;
        },
        configurable: true
      });
      Object.defineProperty(navigator, "platform", {
        get() {
          return userAgent.split(/[()]/)[1];
        },
        configurable: true
      });
      ({ lastResult } = mountHook());
      expect(lastResult()).toMatchObject(expectedValues);
    };
    checkUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36",
      { browserName: "chrome", platform: "windows" }
    );
    checkUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36",
      { browserName: "chrome", platform: "mac" }
    );
    checkUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36",
      { browserName: "chrome", platform: "linux" }
    );
    checkUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 13_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/81.0.4044.124 Mobile/15E148 Safari/604.1",
      { browserName: "safari", platform: "ios" } // everything on iOS is Safari
    );
    checkUserAgent(
      "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.117 Mobile Safari/537.36",
      { browserName: "chrome", platform: "android" }
    );

    checkUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0", {
      browserName: "firefox",
      platform: "windows"
    });
    checkUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9",
      { browserName: "safari", platform: "mac" }
    );
    checkUserAgent("Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko", {
      browserName: "ie",
      platform: "windows"
    });
    checkUserAgent(
      "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136",
      { browserName: "edge", platform: "windows" }
    );
  });

  it("should use DeviceProvider", async () => {
    const PROPS1 = {
      browserName: "a",
      platform: "b",
      hasTouch: true,
      hasPointer: true,
      orientation: "landscape-secondary",
      isWebView: true,
      isHeadless: true
    };
    const PROPS2 = {
      browserName: "aa",
      platform: "bb",
      hasTouch: false,
      hasPointer: false,
      orientation: "portrait-primary",
      isWebView: false,
      isHeadless: false
    };
    ({ lastResult, changeProviderProps } = mountHookWithProvider(PROPS1));
    expect(lastResult()).toMatchObject(PROPS1);

    changeProviderProps(PROPS2);
    expect(lastResult()).toMatchObject(PROPS2);
  });
});
