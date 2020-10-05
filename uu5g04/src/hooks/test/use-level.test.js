import UU5 from "uu5g04";
import { useLevel, LevelProvider } from "uu5g04-hooks";
import "uu5g04-bricks"; // for legacy integration test

const { mount, initHookRenderer, renderHook } = UU5.Test.Tools;

function renderHookInProvider(providerLevel, ...initialHookParams) {
  let { HookComponent, ...result } = initHookRenderer(useLevel, ...initialHookParams);
  mount(
    <LevelProvider level={providerLevel}>
      <HookComponent />
    </LevelProvider>
  );
  return result;
}

describe("[uu5g04-hooks] useLevel", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHookInProvider(1);
    expect(lastResult()).toEqual(expect.any(Number));
  });

  it("should return default level", async () => {
    let { lastResult } = renderHook(useLevel);
    expect(lastResult()).toBe(null);
  });

  it("should return context level", async () => {
    let { lastResult } = renderHookInProvider(2);
    expect(lastResult()).toBe(2);
  });
});

describe("[uu5g04-hooks] useLevel; legacy integration", () => {
  UU5.Environment._allowTestContext = true;
  const LevelMixinComponent = UU5.Common.Component.create({
    mixins: [UU5.Common.BaseMixin, UU5.Common.LevelMixin],
    render() {
      return this.props.children(this.getLevel());
    },
  });
  UU5.Environment._allowTestContext = false;

  it("should make LevelMixin component use level from LevelProvider", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLevel);
    let mixinResult = jest.fn();
    mount(
      <LevelProvider level={2}>
        <LevelMixinComponent increaseLevel>
          {(mixinLevel) => (mixinResult(mixinLevel), (<HookComponent />))}
        </LevelMixinComponent>
      </LevelProvider>
    );
    expect(mixinResult).toHaveBeenLastCalledWith(3);
    expect(lastResult()).toBe(3);
  });

  it("should use level from LevelMixin component", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLevel);
    let mixinResult = jest.fn();
    mount(
      <LevelProvider level={2}>
        <LevelMixinComponent level={4}>
          {(mixinLevel) => (mixinResult(mixinLevel), (<HookComponent />))}
        </LevelMixinComponent>
      </LevelProvider>
    );
    expect(mixinResult).toHaveBeenLastCalledWith(4);
    expect(lastResult()).toBe(4);
  });
});
