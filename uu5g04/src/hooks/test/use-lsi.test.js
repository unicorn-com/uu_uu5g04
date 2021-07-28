import UU5 from "uu5g04";
import "uu5g04-bricks";
import { useLsi, LanguageProvider } from "uu5g04-hooks";
import { mount, renderHook, initHookRenderer, act } from "uu5g05-test";

const LSI1 = { en: "key1-en", cs: "key1-cs" };
const LSI2 = { en: "key2-en", cs: "key2-cs" };

afterEach(() => {
  UU5.Common.Tools.setLanguage("en");
});

describe("[uu5g04-hooks] useLsi", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useLsi, LSI1);
    expect(lastResult()).toEqual(expect.any(String));
  });

  it("should return value based on default language", async () => {
    let { lastResult } = renderHook(useLsi, LSI1);
    expect(lastResult()).toBe(LSI1.en);
  });

  it("should return value based on context language (LanguageProvider)", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLsi, LSI1);
    mount(
      <LanguageProvider initialLanguage="cs">
        <HookComponent />
      </LanguageProvider>
    );
    expect(lastResult()).toBe(LSI1.cs);
  });

  it("should return value based on context language (LsiContext)", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLsi, LSI1);
    // LsiContext has initial language from global, i.e. "en", and it shouldn't react to its change
    mount(
      <UU5.Bricks.LsiContext localLsi>
        <HookComponent />
      </UU5.Bricks.LsiContext>
    );
    expect(lastResult()).toBe(LSI1.en);
    act(() => {
      UU5.Common.Tools.setLanguage("cs");
    });
    expect(lastResult()).toBe(LSI1.en);
  });

  it("should react to hook parameters change", async () => {
    let { lastResult, rerender } = renderHook(useLsi, LSI1);
    expect(lastResult()).toBe(LSI1.en);
    rerender(LSI2);
    expect(lastResult()).toBe(LSI2.en);
  });
});
