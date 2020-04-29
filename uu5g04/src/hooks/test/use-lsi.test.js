import UU5 from "uu5g04";
import { useLsi, LanguageProvider } from "uu5g04-hooks";

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs = [] }) {
  let result = useLsi(...hookArgs);
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

const LSI1 = { en: "key1-en", cs: "key1-cs" };

describe("[uu5g04-hooks] useLsi", () => {
  let lastResult;

  it("should return expected result API", () => {
    ({ lastResult } = mountHook());
    expect(lastResult()).toMatchObject({
      value: undefined,
      language: expect.any(String),
      setLanguage: expect.any(Function)
    });
  });

  it("should return value based on default language", async () => {
    ({ lastResult } = mountHook(LSI1));
    expect(lastResult()).toMatchObject({
      value: LSI1.en,
      language: "en"
    });
  });

  it("should return value based on context language", async () => {
    ({ lastResult } = mountHookWithWrapper(
      props => <LanguageProvider language="cs">{props.children}</LanguageProvider>,
      LSI1
    ));
    expect(lastResult()).toMatchObject({
      value: LSI1.cs,
      language: "cs"
    });
  });
});
