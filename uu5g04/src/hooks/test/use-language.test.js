import UU5 from "uu5g04";
import { useLanguage, LanguageProvider } from "uu5g04-hooks";
import "uu5g04-bricks"; // for legacy integration test
import { mount, act, initHookRenderer, renderHook } from "uu5g05-test";

let origLanguage;
beforeEach(() => {
  origLanguage = UU5.Common.Tools.getLanguage();
});
afterEach(() => {
  UU5.Common.Tools.setLanguage(origLanguage);
});

describe("[uu5g04-hooks] useLanguage", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useLanguage);
    expect(lastResult()).toMatchObject([expect.any(String), expect.any(Function)]);
  });

  it("prop language; should return default language", async () => {
    let { lastResult } = renderHook(useLanguage);
    expect(lastResult()).toMatchObject(["en-gb", expect.any(Function)]);
  });

  it("prop language; should return context language", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLanguage);
    mount(
      <LanguageProvider initialLanguage="es">
        <HookComponent />
      </LanguageProvider>
    );
    expect(lastResult()).toMatchObject(["es", expect.any(Function)]);
  });

  it("setLanguage; should re-render with new language", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLanguage);
    let onChangeFn = jest.fn();
    mount(
      <LanguageProvider initialLanguage="es" onChange={onChangeFn}>
        <HookComponent />
      </LanguageProvider>
    );

    act(() => {
      lastResult()[1]("ru");
    });
    expect(lastResult()).toMatchObject(["ru", expect.any(Function)]);
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(onChangeFn).toHaveBeenCalledWith({ language: "ru" });
  });
});

describe("[uu5g04-hooks] useLanguage; legacy integration", () => {
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
      },
    })
  );
  UU5.Environment._allowTestContext = false;

  it("should receive changes from legacy (UU5.Bricks.LsiContext)", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLanguage);
    let ctx;
    let onChangeLanguageCheck = jest.fn();
    mount(
      <UU5.Bricks.LsiContext>
        <WithLsiContextHoc onChangeLanguageCheck={onChangeLanguageCheck}>
          {(value) => ((ctx = value), null)}
        </WithLsiContextHoc>
        <HookComponent />
      </UU5.Bricks.LsiContext>
    );
    expect(lastResult()).toMatchObject([ctx.getLanguage(), expect.any(Function)]);

    act(() => {
      ctx.setLanguage("ru");
    });
    expect(lastResult()).toMatchObject(["ru", expect.any(Function)]);
    expect(ctx.getLanguage()).toBe("ru");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("ru"); // onChangeLanguage_ method in component should have been called after changing the language
  });

  it("should propagate changes to legacy", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLanguage);
    let onReceiveContext = jest.fn(() => null);
    let onChangeLanguageCheck = jest.fn();
    mount(
      <LanguageProvider>
        <WithLsiContextHoc onChangeLanguageCheck={onChangeLanguageCheck}>{onReceiveContext}</WithLsiContextHoc>
        <HookComponent />
      </LanguageProvider>
    );
    expect(onReceiveContext).toHaveBeenCalledWith(
      expect.objectContaining({
        getLanguage: expect.any(Function),
        setLanguage: expect.any(Function),
        registerLsi: expect.any(Function),
        unregisterLsi: expect.any(Function),
      })
    );
    let mixinComponentProps = () => onReceiveContext.mock.calls.slice(-1)[0][0];
    expect(mixinComponentProps().getLanguage()).toBe("en-gb");
    expect(lastResult()).toMatchObject(["en-gb", expect.any(Function)]);

    act(() => {
      mixinComponentProps().setLanguage("ru");
    });
    expect(mixinComponentProps().getLanguage()).toBe("ru");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("ru"); // onChangeLanguage_ method in component should have been called after changing the language
    expect(lastResult()).toMatchObject(["ru", expect.any(Function)]);

    act(() => {
      lastResult()[1]("es");
    });
    expect(mixinComponentProps().getLanguage()).toBe("es");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("es"); // onChangeLanguage_ method in component should have been called after changing the language
    expect(lastResult()).toMatchObject(["es", expect.any(Function)]);
  });

  it("should propagate global language if no providers are used", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLanguage);
    let onChangeLanguageCheck = jest.fn();
    let lsiHocComp;
    mount(
      <div>
        <WithLsiContextHoc ref_={(ref) => (lsiHocComp = ref)} onChangeLanguageCheck={onChangeLanguageCheck}>
          {(v) => null}
        </WithLsiContextHoc>
        <HookComponent />
      </div>
    );
    expect(lsiHocComp.getLanguage()).toBe("en-gb");
    expect(lastResult()).toMatchObject(["en-gb", expect.any(Function)]);

    act(() => {
      UU5.Common.Tools.setLanguage("ru");
    });
    expect(lsiHocComp.getLanguage()).toBe("ru");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("ru"); // onChangeLanguage_ method in component should have been called after changing the language
    expect(lastResult()).toMatchObject(["ru", expect.any(Function)]);

    act(() => {
      lastResult()[1]("es");
    });
    expect(lsiHocComp.getLanguage()).toBe("es");
    expect(onChangeLanguageCheck).toHaveBeenLastCalledWith("es"); // onChangeLanguage_ method in component should have been called after changing the language
    expect(lastResult()).toMatchObject(["es", expect.any(Function)]);
  });
});
