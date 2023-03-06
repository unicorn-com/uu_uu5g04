/* eslint-disable react/prop-types */
import React from "react";
import UU5 from "uu5g04";
import { mount, shallow } from "enzyme";

class AsyncComponent extends React.Component {
  constructor(props) {
    super(props);
    this._unmounted = false;
    this.state = {};
  }
  componentDidMount() {
    if (!this.props.timeout) {
      Promise.resolve().then(() => !this._unmounted && this.setState({ content: "loaded" }));
    } else {
      this._timeoutId = setTimeout(() => !this._unmounted && this.setState({ content: "loaded" }), this.props.timeout);
    }
  }
  componentWillUnmount() {
    this._unmounted = true;
    clearTimeout(this._timeoutId);
  }
  isUnmounted() {
    return !!this._unmounted;
  }
  render() {
    return this.state.content || "loading";
  }
}

class CallComponent extends React.Component {
  call() {
    this.setState((state) => ({ counter: state ? state.counter + 1 : 1 }));
    if (typeof this.props.onCall === "function") this.props.onCall();
  }
  render() {
    return this.state ? this.state.counter + "" : "0";
  }
}

describe("UU5.Test.Tools", () => {
  let wrapper;

  it("mount", async () => {
    wrapper = UU5.Test.Tools.mount(<AsyncComponent />);
    expect(wrapper).toBeDefined();
    expect(wrapper.length).toBe(1);
    expect(typeof wrapper.instance).toBe("function");
    let instance = wrapper.instance();
    expect(instance instanceof AsyncComponent).toBeTruthy();

    // component should be in document's DOM
    wrapper = UU5.Test.Tools.mount(<div id="test-id" />);
    expect(document.getElementById("test-id")).toBeTruthy();

    // initial wrapper should have been automatically unmounted
    expect(instance.isUnmounted()).toBe(true);
  });

  it("shallow", async () => {
    wrapper = UU5.Test.Tools.shallow(<AsyncComponent />);
    expect(wrapper).toBeDefined();
    expect(wrapper.length).toBe(1);
    expect(typeof wrapper.instance).toBe("function");
    let instance = wrapper.instance();
    expect(instance instanceof AsyncComponent).toBeTruthy();

    wrapper = UU5.Test.Tools.shallow(<div id="test-id" />);

    // initial wrapper should have been automatically unmounted
    expect(instance.isUnmounted()).toBe(true);
  });

  it("act", async () => {
    let HookComponent = React.forwardRef((props, ref) => {
      let [count, setCount] = React.useState(0);
      let [fromEffect, setFromEffect] = React.useState(count); // changed in useEffect
      React.useImperativeHandle(ref, () => ({ setCount }), []);
      React.useEffect(() => setFromEffect(count), [count]);
      return <span>{fromEffect}</span>;
    });
    let componentRef = React.createRef();
    let wrapper = mount(<HookComponent ref={componentRef} />); // mount does "act()" automatically

    // without act() the component would render without calling useEffect yet (i.e. we'll see old value)
    let origConsoleError = console.error;
    console.error = () => {}; // prevent react warning regarding not using act()
    try {
      componentRef.current.setCount(10);
      wrapper.update();
      expect(wrapper.text()).toBe("0");
    } finally {
      console.error = origConsoleError;
    }

    // with act() the component would render including useEffect-s
    UU5.Test.Tools.act(() => {
      componentRef.current.setCount(30);
    });
    wrapper.update();
    expect(wrapper.text()).toBe("30");
  });

  it("renderHook", async () => {
    let useSomething = function (initialValue = 10, changeableValue = 0) {
      let [initialParam1] = React.useState(initialValue);
      return [initialParam1, changeableValue];
    };

    let result;
    result = UU5.Test.Tools.renderHook(useSomething);
    expect(result).toMatchObject({
      lastResult: expect.any(Function),
      rerender: expect.any(Function),
      allResults: expect.any(Function),
      renderCount: expect.any(Function),
      wrapper: expect.any(Object),
    });
    expect(result.lastResult()).toMatchObject([10, 0]); // default values
    expect(result.allResults()).toMatchObject([[10, 0]]);
    expect(result.renderCount()).toBe(1);

    result.rerender(20, 7);
    expect(result.lastResult()).toMatchObject([10, 7]);
    expect(result.allResults()).toMatchObject([
      [10, 0],
      [10, 7],
    ]);
    expect(result.renderCount()).toBe(2);

    result = UU5.Test.Tools.renderHook(useSomething, 1, 2);
    expect(result.lastResult()).toMatchObject([1, 2]);
  });

  it("initHookRenderer", async () => {
    let useSomething = function (initialValue = 10, changeableValue = 0) {
      let [initialParam1] = React.useState(initialValue);
      return [initialParam1, changeableValue];
    };

    let result;
    result = UU5.Test.Tools.initHookRenderer(useSomething);
    expect(result).toMatchObject({
      lastResult: expect.any(Function),
      rerender: expect.any(Function),
      allResults: expect.any(Function),
      renderCount: expect.any(Function),
      HookComponent: expect.any(Function),
    });
    let childFn = jest.fn(() => null);
    mount(<result.HookComponent>{childFn}</result.HookComponent>);
    expect(result.lastResult()).toMatchObject([10, 0]); // default values
    expect(result.allResults()).toMatchObject([[10, 0]]);
    expect(result.renderCount()).toBe(1);
    expect(childFn).toHaveBeenLastCalledWith(result.lastResult());

    result.rerender(20, 7);
    expect(result.lastResult()).toMatchObject([10, 7]);
    expect(result.allResults()).toMatchObject([
      [10, 0],
      [10, 7],
    ]);
    expect(result.renderCount()).toBe(2);
    expect(childFn).toHaveBeenLastCalledWith(result.lastResult());

    result = UU5.Test.Tools.initHookRenderer(useSomething, 1, 2);
    mount(<result.HookComponent />);
    expect(result.lastResult()).toMatchObject([1, 2]);
  });

  it("wait", async () => {
    // test basic functionality with Enzyme's mount
    wrapper = mount(<AsyncComponent />);
    expect(wrapper.text()).toBe("loading");
    await UU5.Test.Tools.wait();
    wrapper.update();
    expect(wrapper.text()).toBe("loaded");

    // test that wrapper gets auto-updated when using UU5.Test.Tools.mount
    wrapper = UU5.Test.Tools.mount(<AsyncComponent />);
    expect(wrapper.text()).toBe("loading");
    await UU5.Test.Tools.wait();
    expect(wrapper.text()).toBe("loaded");

    // test options
    wrapper = UU5.Test.Tools.mount(<AsyncComponent timeout={50} />);
    expect(wrapper.text()).toBe("loading");
    let start = Date.now();
    let isLoaded = false;
    while (!isLoaded && Date.now() - start < 500) {
      await UU5.Test.Tools.wait(9);
      if (Math.abs(Date.now() - start - 50) <= 10) continue; // if we're ~10ms around timeout boundary (50) then don't expect anything
      isLoaded = Date.now() - start >= 50;
      expect(wrapper.text()).toBe(isLoaded ? "loaded" : "loading");
    }
    expect(isLoaded).toBe(true);

    wrapper = UU5.Test.Tools.mount(<AsyncComponent timeout={50} />);
    expect(wrapper.text()).toBe("loading");
    start = Date.now();
    isLoaded = false;
    while (!isLoaded && Date.now() - start < 500) {
      await UU5.Test.Tools.wait({ timeout: 9, updateWrapper: false });
      isLoaded = Date.now() - start >= 50;
      expect(wrapper.text()).toBe("loading"); // will be reported as loading because we didn't update wrapper
    }
    expect(isLoaded).toBe(true);
    wrapper.update();
    expect(wrapper.text()).toBe("loaded");
  });

  it("waitWhile", async () => {
    // test basic functionality with Enzyme's mount
    wrapper = mount(<AsyncComponent />);
    expect(wrapper.text()).toBe("loading");
    await UU5.Test.Tools.waitWhile(() => {
      wrapper.update();
      return wrapper.text() === "loading";
    });
    expect(wrapper.text()).toBe("loaded");

    // test that wrapper gets auto-updated when using UU5.Test.Tools.mount
    wrapper = UU5.Test.Tools.mount(<AsyncComponent />);
    expect(wrapper.text()).toBe("loading");
    await UU5.Test.Tools.waitWhile(() => wrapper.text() === "loading");
    expect(wrapper.text()).toBe("loaded");

    // test timed wait
    wrapper = UU5.Test.Tools.mount(<AsyncComponent timeout={10} />);
    expect(wrapper.text()).toBe("loading");
    await UU5.Test.Tools.waitWhile(() => wrapper.text() === "loading");
    expect(wrapper.text()).toBe("loaded");

    // test timing out
    let ok;
    wrapper = UU5.Test.Tools.mount(<AsyncComponent timeout={100} />);
    expect(wrapper.text()).toBe("loading");
    try {
      await UU5.Test.Tools.waitWhile(() => wrapper.text() === "loading", { timeout: 10 });
    } catch (e) {
      if (e.code !== "TIMED_OUT") throw e;
      ok = true;
    }
    if (!ok) throw new Error("Test was supposed to time out.");
  });

  it("waitUntilCalled", async () => {
    let mockFn = jest.fn();

    // test basic functionality with Enzyme's mount
    wrapper = mount(<CallComponent onCall={mockFn} />);
    expect(wrapper.text()).toBe("0");
    setTimeout(() => wrapper.instance().call(), 10);
    await UU5.Test.Tools.waitUntilCalled(mockFn);
    wrapper.update();
    expect(wrapper.text()).toBe("1");

    // test that wrapper gets auto-updated when using UU5.Test.Tools.mount
    mockFn.mockClear();
    wrapper = UU5.Test.Tools.mount(<CallComponent onCall={mockFn} />);
    expect(wrapper.text()).toBe("0");
    setTimeout(() => wrapper.instance().call(), 10);
    await UU5.Test.Tools.waitUntilCalled(mockFn);
    expect(wrapper.text()).toBe("1");

    // test with updateWrapper
    mockFn.mockClear();
    setTimeout(() => wrapper.instance().call(), 10);
    await UU5.Test.Tools.waitUntilCalled(mockFn, { updateWrapper: false });
    expect(wrapper.text()).toBe("1");
    wrapper.update();
    expect(wrapper.text()).toBe("2");

    // test timing out
    mockFn.mockClear();
    let ok;
    try {
      await UU5.Test.Tools.waitUntilCalled(mockFn, { timeout: 10 });
    } catch (e) {
      if (e.code !== "CALL_COUNT_TOO_LOW") throw e;
      ok = true;
    }
    if (!ok) throw new Error("Test was supposed to time out.");
  });

  it("waitUntilCalledTimes", async () => {
    let mockFn = jest.fn();

    // test basic functionality with Enzyme's mount
    wrapper = mount(<CallComponent onCall={mockFn} />);
    expect(wrapper.text()).toBe("0");
    setTimeout(() => wrapper.instance().call(), 10);
    await UU5.Test.Tools.waitUntilCalledTimes(mockFn, 1);
    wrapper.update();
    expect(wrapper.text()).toBe("1");

    // test that wrapper gets auto-updated when using UU5.Test.Tools.mount
    mockFn.mockClear();
    wrapper = UU5.Test.Tools.mount(<CallComponent onCall={mockFn} />);
    expect(wrapper.text()).toBe("0");
    setTimeout(() => wrapper.instance().call(), 10);
    await UU5.Test.Tools.waitUntilCalledTimes(mockFn, 1);
    expect(wrapper.text()).toBe("1");

    // test more than 1 call
    mockFn.mockClear();
    wrapper = UU5.Test.Tools.mount(<CallComponent onCall={mockFn} />);
    expect(wrapper.text()).toBe("0");
    let lastTimeout;
    setTimeout(() => {
      wrapper.instance().call();
      setTimeout(() => {
        wrapper.instance().call();
        setTimeout(() => {
          wrapper.instance().call();
          lastTimeout = setTimeout(() => wrapper.instance().call(), 50); // shouldn't get executed
        }, 10);
      }, 10);
    }, 10);
    await UU5.Test.Tools.waitUntilCalledTimes(mockFn, 3);
    expect(wrapper.text()).toBe("3");
    expect(lastTimeout).toBeDefined();
    clearTimeout(lastTimeout);

    // test with updateWrapper
    mockFn.mockClear();
    wrapper = UU5.Test.Tools.mount(<CallComponent onCall={mockFn} />);
    expect(wrapper.text()).toBe("0");
    setTimeout(() => wrapper.instance().call(), 10);
    await UU5.Test.Tools.waitUntilCalledTimes(mockFn, 1, { updateWrapper: false });
    expect(wrapper.text()).toBe("0");
    wrapper.update();
    expect(wrapper.text()).toBe("1");

    // test timing out
    mockFn.mockClear();
    let ok;
    try {
      await UU5.Test.Tools.waitUntilCalledTimes(mockFn, 1, { timeout: 10 });
    } catch (e) {
      if (e.code !== "CALL_COUNT_TOO_LOW") throw e;
      ok = true;
    }
    if (!ok) throw new Error("Test was supposed to time out.");
  });

  it("setInputValue", async () => {
    let onFocusFn = jest.fn();
    let onBlurFn = jest.fn();
    let onChangeFn = jest.fn();
    let input;

    // test basic functionality with Enzyme's mount
    wrapper = mount(
      <div>
        <input
          ref={(ref) => (input = ref)}
          defaultValue="abc"
          onFocus={onFocusFn}
          onBlur={onBlurFn}
          onChange={onChangeFn}
        />
        <input />
      </div>
    );
    expect(input.value).toBe("abc");
    UU5.Test.Tools.setInputValue(wrapper, "cde");
    expect(input.value).toBe("cde");
    expect(onFocusFn).toHaveBeenCalledTimes(1);
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(onBlurFn).toHaveBeenCalledTimes(1);

    UU5.Test.Tools.setInputValue(wrapper, "efg", false, false);
    expect(input.value).toBe("efg");
    expect(onFocusFn).toHaveBeenCalledTimes(1);
    expect(onChangeFn).toHaveBeenCalledTimes(2);
    expect(onBlurFn).toHaveBeenCalledTimes(1);

    // test invalid arguments
    wrapper = mount(<div>content</div>);
    let ok;
    try {
      UU5.Test.Tools.setInputValue(wrapper, "ghi");
    } catch (e) {
      if (e.code !== "INPUT_NOT_FOUND") throw e;
      ok = true;
    }
    if (!ok) throw new Error("Test was supposed to fail due to invalid arguments.");
  });
});
