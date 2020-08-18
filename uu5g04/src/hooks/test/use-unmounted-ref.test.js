import UU5 from "uu5g04";
import { useUnmountedRef } from "uu5g04-hooks";

const { initHookRenderer, mount } = UU5.Test.Tools;

describe("[uu5g04-hooks] useUnmountedRef behaviour", () => {
  it("should return value based on mount state", () => {
    let { lastResult, HookComponent } = initHookRenderer(useUnmountedRef);
    let wrapper = mount(<HookComponent />);
    expect(lastResult()).toMatchObject({ current: false });
    wrapper.unmount();
    expect(lastResult()).toMatchObject({ current: true });
  });
});
