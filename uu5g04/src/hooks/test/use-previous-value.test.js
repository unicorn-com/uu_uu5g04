import UU5 from "uu5g04";
import { usePreviousValue } from "uu5g04-hooks";

const { renderHook } = UU5.Test.Tools;

describe("[uu5g04-hooks] usePreviousValue behaviour", () => {
  it("should return previous value", () => {
    let { lastResult, rerender } = renderHook(usePreviousValue, 10);
    expect(lastResult()).toBe(undefined);
    rerender(20);
    expect(lastResult()).toBe(10);
    rerender(20);
    expect(lastResult()).toBe(20);
    rerender(20);
    expect(lastResult()).toBe(20);
    rerender(30);
    expect(lastResult()).toBe(20);
    rerender(40);
    expect(lastResult()).toBe(30);
  });

  it("should return previous value (initial value)", () => {
    let { lastResult, rerender } = renderHook(usePreviousValue, 10, -10);
    expect(lastResult()).toBe(-10);
    rerender(20);
    expect(lastResult()).toBe(10);
  });
});
