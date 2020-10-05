import UU5 from "uu5g04";
import { useLsiValues, LanguageProvider } from "uu5g04-hooks";

const { mount, renderHook, initHookRenderer } = UU5.Test.Tools;

const LSI_VALUES1 = {
  key1: { en: "key1-en", cs: "key1-cs" },
  key2: { en: "key2-en", cs: "key2-en" },
};
const LSI_VALUES2 = {
  key1: { en: "v2-key1-en", cs: "v2-key1-cs" },
  key2: { en: "v2-key2-en", cs: "v2-key2-en" },
};

describe("[uu5g04-hooks] useLsiValues", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHook(useLsiValues);
    expect(lastResult()).toEqual({});
  });

  it("should return values based on default language", async () => {
    let { lastResult } = renderHook(useLsiValues, LSI_VALUES1);
    expect(lastResult()).toMatchObject({ key1: LSI_VALUES1.key1.en, key2: LSI_VALUES1.key2.en });
  });

  it("should return values based on context language", async () => {
    let { lastResult, HookComponent } = initHookRenderer(useLsiValues, LSI_VALUES1);
    mount(
      <LanguageProvider initialLanguage="cs">
        <HookComponent />
      </LanguageProvider>
    );
    expect(lastResult()).toMatchObject({ key1: LSI_VALUES1.key1.cs, key2: LSI_VALUES1.key2.cs });
  });

  it("should react to hook parameters change", async () => {
    let { lastResult, rerender } = renderHook(useLsiValues, LSI_VALUES1);
    expect(lastResult()).toMatchObject({ key1: LSI_VALUES1.key1.en, key2: LSI_VALUES1.key2.en });
    rerender(LSI_VALUES2);
    expect(lastResult()).toMatchObject({ key1: LSI_VALUES2.key1.en, key2: LSI_VALUES2.key2.en });
  });
});
