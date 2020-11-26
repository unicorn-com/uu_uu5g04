import { useUnmountedRef } from "uu5g04-hooks";
import { initHookRenderer, mount } from "uu5g05-test";

describe("[uu5g04-hooks] useUnmountedRef", () => {
  it("should return value based on mount state", () => {
    let { lastResult, HookComponent } = initHookRenderer(useUnmountedRef);
    let wrapper = mount(<HookComponent />);
    expect(lastResult()).toMatchObject({ current: false });
    wrapper.unmount();
    expect(lastResult()).toMatchObject({ current: true });
  });
});
