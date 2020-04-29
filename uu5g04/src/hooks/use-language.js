/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import UU5 from "uu5g04";
import { useState, useEffect, useMemo, useRef, useContext } from "./react-hooks";
import { createComponent } from "./component";
import { usePreviousValue } from "./internal/use-previous-value";

const LanguageContext = UU5.Common.LsiMixin.Context;
function useLanguageContext() {
  let contextValue = useContext(LanguageContext);
  let nonLegacyValue = useHandleLegacyValues(contextValue);
  return nonLegacyValue;
}

function useInitial(computationFn) {
  let computedRef = useRef();
  let valueRef = useRef();
  if (!computedRef.current) {
    computedRef.current = true;
    valueRef.current = computationFn();
  }
  return valueRef.current;
}

// extra internal hook which handles legacy values (values sent from UU5.Bricks.LsiContext contain
// only registerLsi() / getLanguage() / ... methods which do not ever change; we have to use
// registerLsi() and then we'll get notified when a language changed)
function useHandleLegacyValues(contextValue) {
  let isLegacy = useInitial(() => contextValue && typeof contextValue.getLanguage === "function");
  let wasLegacy = usePreviousValue(isLegacy, isLegacy);
  if (isLegacy !== wasLegacy) {
    UU5.Common.Tools.error(
      "Switching LanguageProvider values format from legacy to current and vice-versa is not properly supported. Re-mount provider or keep the value type same."
    );
  }

  // NOTE This assumes that context value never changes because it should
  // contain only function references.
  let id = useInitial(() => (isLegacy ? UU5.Common.Tools.generateUUID() : undefined));
  let [notifiedValue, setNotifiedValue] = useState(() => (isLegacy ? contextValue.getLanguage() : undefined));
  let setLanguage = useInitial(() => (isLegacy ? contextValue.setLanguage : undefined));
  let unregisterLsi = useInitial(() => {
    if (isLegacy) {
      let { registerLsi, unregisterLsi } = contextValue;
      typeof registerLsi === "function" && registerLsi(id, lang => setNotifiedValue(lang));
      return unregisterLsi;
    }
  });
  useEffect(() => () => typeof unregisterLsi === "function" && unregisterLsi(id), [id, unregisterLsi]);

  return isLegacy ? { language: notifiedValue, setLanguage } : contextValue;
}

const LanguageProvider = createComponent({
  displayName: "UU5.Hooks.LanguageProvider",

  propTypes: {
    language: UU5.PropTypes.string,
    onChange: UU5.PropTypes.func
  },

  defaultProps: {
    language: undefined,
    onChange: undefined
  },

  render({ onChange, language, children }) {
    const [lang, setLang] = useState(() => language || UU5.Utils.Lsi.getLanguage());
    const currentValuesRef = useRef();
    currentValuesRef.current = { onChange };

    let mountedRef = useRef(false);
    useEffect(() => {
      if (mountedRef.current) {
        // onXyz callbacks are passed via ref because typically we don't want to re-run them when they change
        // (we just want to use the new callback once new effect takes place)
        let { onChange } = currentValuesRef.current;
        typeof onChange === "function" && onChange({ language: lang });
      }
    }, [lang]);
    useEffect(() => {
      mountedRef.current = true;
    }, []);

    const value = useMemo(() => ({ language: lang, setLanguage: setLang }), [lang]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
  }
});

function useLanguage() {
  const { language, setLanguage } = useLanguageContext();
  const [lang, setLang] = useState(() => UU5.Utils.Lsi.getLanguage());

  useEffect(() => {
    if (!language) {
      // NOTE Legacy Class components might have called setLanguage() in their componentDidMount() and
      // if they did, it got already processed without us knowing about it => check that the language
      // in our state is still the same and update it if it isn't (same string-value doesn't cause re-render).
      setLang(UU5.Utils.Lsi.getLanguage());
      const changeLanguage = ({ language }) => setLang(language);
      UU5.Utils.Lsi.register(changeLanguage);
      return () => UU5.Utils.Lsi.unregister(changeLanguage);
    }
  }, [language]);

  return { language: language || lang, setLanguage: setLanguage || UU5.Utils.Lsi.setLanguage };
}

export { useLanguage, LanguageProvider };
export default useLanguage;
