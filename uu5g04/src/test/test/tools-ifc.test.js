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
    this.setState(state => ({ counter: state ? state.counter + 1 : 1 }));
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
    await UU5.Test.Tools.wait(25);
    expect(wrapper.text()).toBe("loading");
    await UU5.Test.Tools.wait(50);
    expect(wrapper.text()).toBe("loaded");

    wrapper = UU5.Test.Tools.mount(<AsyncComponent timeout={50} />);
    expect(wrapper.text()).toBe("loading");
    await UU5.Test.Tools.wait({ timeout: 25, updateWrapper: false });
    expect(wrapper.text()).toBe("loading");
    wrapper.update();
    expect(wrapper.text()).toBe("loading");
    await UU5.Test.Tools.wait({ timeout: 50, updateWrapper: false });
    expect(wrapper.text()).toBe("loading");
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
    setTimeout(() => wrapper.instance().call(), 10);
    setTimeout(() => wrapper.instance().call(), 25);
    setTimeout(() => wrapper.instance().call(), 50);
    setTimeout(() => wrapper.instance().call(), 15);
    await UU5.Test.Tools.waitUntilCalledTimes(mockFn, 3);
    expect(wrapper.text()).toBe("3");

    // test with updateWrapper
    mockFn.mockClear();
    await UU5.Test.Tools.waitUntilCalledTimes(mockFn, 1, { updateWrapper: false });
    expect(wrapper.text()).toBe("3");
    wrapper.update();
    expect(wrapper.text()).toBe("4");

    // test timing out
    let ok;
    try {
      await UU5.Test.Tools.waitUntilCalledTimes(mockFn, 2, { timeout: 10 });
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
          ref={ref => (input = ref)}
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
