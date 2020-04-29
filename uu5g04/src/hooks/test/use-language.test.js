import UU5 from "uu5g04";
import { useLanguage, LanguageProvider } from "uu5g04-hooks";
import "uu5g04-bricks"; // for legacy integration test

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs = [] }) {
  let result = useLanguage(...hookArgs);
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

let origLanguage;
beforeEach(() => {
  origLanguage = UU5.Common.Tools.getLanguage();
});
afterEach(() => {
  UU5.Common.Tools.setLanguage(origLanguage);
});

describe("[uu5g04-hooks] useLanguage", () => {
  let lastResult;

  it("should return expected result API", () => {
    ({ lastResult } = mountHook());
    expect(lastResult()).toMatchObject({
      language: expect.any(String),
      setLanguage: expect.any(Function)
    });
  });

  it("prop language; should return default language", async () => {
    ({ lastResult } = mountHook());
    expect(lastResult()).toMatchObject({ language: "en" });
  });

  it("prop language; should return context language", async () => {
    ({ lastResult } = mountHookWithWrapper(props => (
      <LanguageProvider language="es">{props.children}</LanguageProvider>
    )));
    expect(lastResult()).toMatchObject({ language: "es" });
  });

  it("setLanguage; should re-render with new language", async () => {
    let onChangeFn = jest.fn();
    ({ lastResult } = mountHookWithWrapper(props => (
      <LanguageProvider language="es" onChange={onChangeFn}>
        {props.children}
      </LanguageProvider>
    )));
    lastResult().setLanguage("ru");
    await wait(); // so that effects run
    expect(lastResult()).toMatchObject({ language: "ru" });
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(onChangeFn).toHaveBeenCalledWith({ language: "ru" });
  });
});

describe("[uu5g04-hooks] useLanguage; legacy integration", () => {
  let lastResult;

  // NOTE Components using LsiMixin not wrapped by LsiMixin.withContext
  // always use global language (not tested here).

  UU5.Environment._allowTestContext = true;
  const WithLsiContextHoc = UU5.Common.LsiMixin.withContext(
    UU5.Common.Component.create({
      mixins: [UU5.Common.BaseMixin, UU5.Common.LsiMixin],
      onChangeLanguage_(...args) {
        this.onChangeLanguageDefault(...args);
        this.props.onChangeLanguageCheck(...args);
      },
      render() {
        return this.props.children(this.props);
      }
    })
  );
  UU5.Environment._allowTestContext = false;

  it("should receive changes from legacy (UU5.Bricks.LsiContext)", async () => {
    let ctx;
    let onChangeLanguageCheck = jest.fn();
    ({ lastResult } = mountHookWithWrapper(props => (
      <UU5.Bricks.LsiContext>
        <WithLsiContextHoc onChangeLanguageCheck={onChangeLanguageCheck}>
          {value => ((ctx = value), null)}
        </WithLsiContextHoc>
        {props.children}
      </UU5.Bricks.LsiContext>
    )));
    expect(lastResult()).toMatchObject({ language: ctx.getLanguage() });

    ctx.setLanguage("ru");
    expect(lastResult()).toMatchObject({ language: "ru" });
    expect(ctx.getLanguage()).toBe("ru");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("ru"); // onChangeLanguage_ method in component should have been called after changing the language
  });

  it("should propagate changes to legacy", async () => {
    let onReceiveContext = jest.fn(() => null);
    let onChangeLanguageCheck = jest.fn();
    ({ lastResult } = mountHookWithWrapper(props => (
      <LanguageProvider>
        <WithLsiContextHoc onChangeLanguageCheck={onChangeLanguageCheck}>{onReceiveContext}</WithLsiContextHoc>
        {props.children}
      </LanguageProvider>
    )));
    expect(onReceiveContext).toHaveBeenCalledWith(
      expect.objectContaining({
        getLanguage: expect.any(Function),
        setLanguage: expect.any(Function),
        registerLsi: expect.any(Function),
        unregisterLsi: expect.any(Function)
      })
    );
    let mixinComponentProps = () => onReceiveContext.mock.calls.slice(-1)[0][0];
    expect(mixinComponentProps().getLanguage()).toBe("en");
    expect(lastResult()).toMatchObject({ language: "en" });

    mixinComponentProps().setLanguage("ru");
    expect(mixinComponentProps().getLanguage()).toBe("ru");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("ru"); // onChangeLanguage_ method in component should have been called after changing the language
    expect(lastResult()).toMatchObject({ language: "ru" });

    lastResult().setLanguage("es");
    expect(mixinComponentProps().getLanguage()).toBe("es");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("es"); // onChangeLanguage_ method in component should have been called after changing the language
    expect(lastResult()).toMatchObject({ language: "es" });
  });

  it("should propagate global language if no providers are used", async () => {
    let onChangeLanguageCheck = jest.fn();
    let lsiHocComp;
    ({ lastResult } = mountHookWithWrapper(props => (
      <div>
        <WithLsiContextHoc ref_={ref => (lsiHocComp = ref)} onChangeLanguageCheck={onChangeLanguageCheck}>
          {v => null}
        </WithLsiContextHoc>
        {props.children}
      </div>
    )));
    expect(lsiHocComp.getLanguage()).toBe("en");
    expect(lastResult()).toMatchObject({ language: "en" });

    UU5.Common.Tools.setLanguage("ru");
    expect(lsiHocComp.getLanguage()).toBe("ru");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("ru"); // onChangeLanguage_ method in component should have been called after changing the language
    expect(lastResult()).toMatchObject({ language: "ru" });

    lastResult().setLanguage("es");
    expect(lsiHocComp.getLanguage()).toBe("es");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("es"); // onChangeLanguage_ method in component should have been called after changing the language
    expect(lastResult()).toMatchObject({ language: "es" });
  });
});
