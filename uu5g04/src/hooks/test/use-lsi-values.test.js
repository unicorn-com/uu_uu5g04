import UU5 from "uu5g04";
import { useLsiValues, LanguageProvider } from "uu5g04-hooks";

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs = [] }) {
  let result = useLsiValues(...hookArgs);
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

const LSI_VALUES1 = {
  key1: { en: "key1-en", cs: "key1-cs" },
  key2: { en: "key2-en", cs: "key2-en" }
};

describe("[uu5g04-hooks] useLsiValues", () => {
  let lastResult;

  it("should return expected result API", () => {
    ({ lastResult } = mountHook());
    expect(lastResult()).toEqual({});
  });

  it("should return values based on default language", async () => {
    ({ lastResult } = mountHook(LSI_VALUES1));
    expect(lastResult()).toMatchObject({ key1: LSI_VALUES1.key1.en, key2: LSI_VALUES1.key2.en });
  });

  it("should return values based on context language", async () => {
    ({ lastResult } = mountHookWithWrapper(
      props => <LanguageProvider language="cs">{props.children}</LanguageProvider>,
      LSI_VALUES1
    ));
    expect(lastResult()).toMatchObject({ key1: LSI_VALUES1.key1.cs, key2: LSI_VALUES1.key2.cs });
  });
});
