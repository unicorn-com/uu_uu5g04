import UU5 from "uu5g04";
import { useLevel, LevelProvider } from "uu5g04-hooks";
import "uu5g04-bricks"; // for legacy integration test

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs = [] }) {
  let result = useLevel(...hookArgs);
  // NOTE Using Inner to measure render counts of subtrees (hooks are allowed to change their state during render
  // because it results in re-calling of the Component but not of its subtree - we don't want to measure these
  // shallow re-renders).
  return <Inner result={result}>{children}</Inner>;
}
function Inner({ children, result }) {
  return children(result);
}

function mountHook(...hookArgs) {
  return mountHookWithWrapper(props => props.children, ...hookArgs);
}

function mountHookInProvider(providerLevel, ...hookArgs) {
  return mountHookWithWrapper(props => <LevelProvider level={providerLevel}>{props.children}</LevelProvider>);
}

function mountHookWithWrapper(Wrapper, ...hookArgs) {
  let renderFn = jest.fn(() => <div />);
  let wrapper = mount(
    <Wrapper>
      <Component hookArgs={hookArgs}>{renderFn}</Component>
    </Wrapper>
  );
  return {
    lastResult: () => renderFn.mock.calls[renderFn.mock.calls.length - 1][0],
    renderCount: () => renderFn.mock.calls.length,
    changeArgs: (...newArgs) => wrapper.setProps({ children: <Component hookArgs={newArgs}>{renderFn}</Component> })
  };
}

describe("[uu5g04-hooks] useLevel", () => {
  let lastResult;

  it("should return expected result API", () => {
    ({ lastResult } = mountHookInProvider(1));
    expect(lastResult()).toEqual(expect.any(Number));
  });

  it("should return default level", async () => {
    ({ lastResult } = mountHook());
    expect(lastResult()).toBe(null);
  });

  it("should return context level", async () => {
    ({ lastResult } = mountHookInProvider(2));
    expect(lastResult()).toBe(2);
  });
});

describe("[uu5g04-hooks] useLevel; legacy integration", () => {
  let lastResult;

  UU5.Environment._allowTestContext = true;
  const LevelMixinComponent = UU5.Common.Component.create({
    mixins: [UU5.Common.BaseMixin, UU5.Common.LevelMixin],
    render() {
      return this.props.children(this.getLevel());
    }
  });
  UU5.Environment._allowTestContext = false;

  it("should make LevelMixin component use level from LevelProvider", async () => {
    let mixinResult = jest.fn();
    ({ lastResult } = mountHookWithWrapper(props => (
      <LevelProvider level={2}>
        <LevelMixinComponent increaseLevel>
          {mixinLevel => (mixinResult(mixinLevel), props.children)}
        </LevelMixinComponent>
      </LevelProvider>
    )));
    expect(mixinResult).toHaveBeenLastCalledWith(3);
    expect(lastResult()).toBe(3);
  });

  it("should use level from LevelMixin component", async () => {
    let mixinResult = jest.fn();
    ({ lastResult } = mountHookWithWrapper(props => (
      <LevelProvider level={2}>
        <LevelMixinComponent level={4}>{mixinLevel => (mixinResult(mixinLevel), props.children)}</LevelMixinComponent>
      </LevelProvider>
    )));
    expect(mixinResult).toHaveBeenLastCalledWith(4);
    expect(lastResult()).toBe(4);
  });
});
