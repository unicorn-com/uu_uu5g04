import UU5 from "uu5g04";
import { useEvent, useRef } from "uu5g04-hooks";

const { mount, renderHook, initHookRenderer, act } = UU5.Test.Tools;

function testEvent(obj, listenerFn, wrapper, eventName) {
  listenerFn.mockClear();
  let event;
  act(() => {
    obj.dispatchEvent((event = new Event(eventName)));
  });
  expect(listenerFn).toHaveBeenCalledTimes(1);
  expect(listenerFn).lastCalledWith(event);

  listenerFn.mockClear();
  wrapper.unmount();
  act(() => {
    obj.dispatchEvent((event = new Event(eventName)));
  });
  expect(listenerFn).toHaveBeenCalledTimes(0);
}

describe("[uu5g04-hooks] useEvent", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useEvent, "scroll", jest.fn(), window);
    expect(lastResult()).toBe(undefined);

    ({ lastResult } = renderHook(useEvent, "customEvent", jest.fn()));
    expect(lastResult()).toEqual(expect.any(Function));
  });

  it("should call the listener function", async () => {
    let listenerFn = jest.fn();
    let { wrapper } = renderHook(useEvent, "scroll", listenerFn, window);
    testEvent(window, listenerFn, wrapper, "scroll");
  });

  it("should support elements (Element)", async () => {
    let listenerFn = jest.fn();
    let { wrapper } = renderHook(useEvent, "scroll", listenerFn, document.body);
    testEvent(document.body, listenerFn, wrapper, "scroll");
  });

  it("should support elements (ref)", async () => {
    let listenerFn = jest.fn();
    let ref;
    let TestComponent = () => {
      ref = useRef();
      useEvent("scroll", listenerFn, ref);
      return <div ref={ref} />;
    };
    let wrapper = mount(<TestComponent />);
    testEvent(ref.current, listenerFn, wrapper, "scroll");
  });

  it("should call listeners in proper order", async () => {
    let fn = jest.fn();
    let { HookComponent: HC1 } = initHookRenderer(useEvent, "scroll", () => fn("hc1"), window, { capture: false });
    let { HookComponent: HC2 } = initHookRenderer(useEvent, "scroll", () => fn("hc2"), window, { capture: true });
    let { HookComponent: HC3 } = initHookRenderer(useEvent, "scroll", () => fn("hc3"), window, { capture: false });
    let { HookComponent: HC4 } = initHookRenderer(useEvent, "scroll", () => fn("hc4"), window, { capture: true });
    mount(
      <div>
        <HC1 />
        <HC2 />
        <HC3 />
        <HC4 />
      </div>
    );
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(fn).toHaveBeenCalledTimes(4);
    expect(fn).nthCalledWith(1, "hc2"); // capturing listeners first
    expect(fn).nthCalledWith(2, "hc4");
    expect(fn).nthCalledWith(3, "hc1"); // bubbling listeners last
    expect(fn).nthCalledWith(4, "hc3");
  });

  it("should have separated listener lists per event", async () => {
    let listenerFn1 = jest.fn();
    let listenerFn2 = jest.fn();
    let { HookComponent: HC1 } = initHookRenderer(useEvent, "scroll1", listenerFn1, window);
    let { HookComponent: HC2 } = initHookRenderer(useEvent, "scroll2", listenerFn2, window);
    mount(
      <div>
        <HC1 />
        <HC2 />
      </div>
    );
    act(() => {
      window.dispatchEvent(new Event("scroll1"));
    });
    expect(listenerFn1).toHaveBeenCalledTimes(1);
    expect(listenerFn2).toHaveBeenCalledTimes(0);

    listenerFn1.mockClear();
    act(() => {
      window.dispatchEvent(new Event("scroll2"));
    });
    expect(listenerFn1).toHaveBeenCalledTimes(0);
    expect(listenerFn2).toHaveBeenCalledTimes(1);
  });

  it("should react to parameters change", async () => {
    let listenerFn = jest.fn();
    let { rerender } = renderHook(useEvent, "scroll", listenerFn, window);

    // change element
    rerender("scroll", listenerFn, document.body);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(listenerFn).toHaveBeenCalledTimes(0);
    act(() => {
      document.body.dispatchEvent(new Event("scroll"));
    });
    expect(listenerFn).toHaveBeenCalledTimes(1);
    listenerFn.mockClear();

    // change listener
    let listenerFn2 = jest.fn();
    rerender("scroll", listenerFn2, document.body);
    act(() => {
      document.body.dispatchEvent(new Event("scroll"));
    });
    expect(listenerFn2).toHaveBeenCalledTimes(1);
    expect(listenerFn).toHaveBeenCalledTimes(0);
    listenerFn2.mockClear();

    // change event
    rerender("scroll2", listenerFn2, document.body);
    act(() => {
      document.body.dispatchEvent(new Event("scroll"));
    });
    expect(listenerFn2).toHaveBeenCalledTimes(0);
    expect(listenerFn).toHaveBeenCalledTimes(0);
    act(() => {
      document.body.dispatchEvent(new Event("scroll2"));
    });
    expect(listenerFn2).toHaveBeenCalledTimes(1);
    expect(listenerFn).toHaveBeenCalledTimes(0);
  });
});
