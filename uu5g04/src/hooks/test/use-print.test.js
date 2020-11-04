import UU5 from "uu5g04";
import { usePrint } from "uu5g04-hooks";

const { renderHook, act } = UU5.Test.Tools;

describe("[uu5g04-hooks] usePrint with window", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(usePrint);
    expect(lastResult()).toEqual(expect.any(Boolean));
  });

  it("should report printing state", async () => {
    let { lastResult } = renderHook(usePrint);
    expect(lastResult()).toBe(false);

    act(() => {
      window.dispatchEvent(new Event("beforeprint"));
    });
    expect(lastResult()).toBe(true);
    act(() => {
      window.dispatchEvent(new Event("afterprint"));
    });
    expect(lastResult()).toBe(false);
  });
});
