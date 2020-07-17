import UU5 from "uu5g04";
import { useLsi, LanguageProvider } from "uu5g04-hooks";

const { mount, renderHook, initHookRenderer } = UU5.Test.Tools;

const LSI1 = { en: "key1-en", cs: "key1-cs" };
const LSI2 = { en: "key2-en", cs: "key2-cs" };

describe("[uu5g04-hooks] useLsi", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useLsi, LSI1);
    expect(lastResult()).toEqual(expect.any(String));
  });

  it("should return value based on default language", async () => {
    let { lastResult } = renderHook(useLsi, LSI1);
    expect(lastResult()).toBe(LSI1.en);
  });

  it("should return value based on context language", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLsi, LSI1);
    mount(
      <LanguageProvider initialLanguage="cs">
        <HookComponent />
      </LanguageProvider>
    );
    expect(lastResult()).toBe(LSI1.cs);
  });

  it("should react to hook parameters change", async () => {
    let { lastResult, rerender } = renderHook(useLsi, LSI1);
    expect(lastResult()).toBe(LSI1.en);
    rerender(LSI2);
    expect(lastResult()).toBe(LSI2.en);
  });
});
