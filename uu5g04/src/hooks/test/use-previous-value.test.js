import { usePreviousValue } from "uu5g04-hooks";
import { renderHook } from "uu5g05-test";

describe("[uu5g04-hooks] usePreviousValue", () => {
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
