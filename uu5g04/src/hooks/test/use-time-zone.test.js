import UU5 from "uu5g04";
import { useTimeZone, TimeZoneProvider } from "uu5g04-hooks";

const { mount, act, initHookRenderer, renderHook } = UU5.Test.Tools;

describe("[uu5g04-hooks] useTimeZone", () => {
  it("result, timeZone; should return default timeZone", async () => {
    let { lastResult } = renderHook(useTimeZone);
    expect(lastResult()).toEqual([undefined, expect.any(Function)]);
  });

  it("result, timeZone; should return context timeZone", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useTimeZone);
    mount(
      <TimeZoneProvider initialTimeZone="America/Los_Angeles">
        <HookComponent />
      </TimeZoneProvider>
    );
    expect(lastResult()).toEqual(["America/Los_Angeles", expect.any(Function)]);
  });

  it("result, setTimeZone; should re-render with new timeZone", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useTimeZone);
    let onChangeFn = jest.fn();
    mount(
      <TimeZoneProvider initialTimeZone="America/Los_Angeles" onChange={onChangeFn}>
        <HookComponent />
      </TimeZoneProvider>
    );

    act(() => {
      lastResult()[1]("Asia/Vladivostok");
    });
    expect(lastResult()).toEqual(["Asia/Vladivostok", expect.any(Function)]);
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(onChangeFn).toHaveBeenCalledWith({ timeZone: "Asia/Vladivostok" });
  });
});
