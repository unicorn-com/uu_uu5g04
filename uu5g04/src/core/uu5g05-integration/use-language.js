/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

import {
  useLanguage,
  useContext,
  useEffect,
  useRef,
  useState,
  usePreviousValue,
  Utils,
  LanguageProvider,
} from "uu5g05";
import Tools from "../common/tools";

const Language = Utils.Language;
const LanguageContext = useLanguage._context;

LanguageProvider._uu5g04Integrate = (ctxValue) => {
  let parentCtxValue = useContext(LanguageContext);
  let isRoot = !parentCtxValue || Object.keys(parentCtxValue).length === 0;
  if (isRoot) Tools._languageProviderValue = ctxValue;
  useEffect(() => {
    return () => Tools._languageProviderValue = null;
  }, []);
};

useLanguage._override = function (g05Hook, ...hookArgs) {
  const { language, setLanguage } = useLanguageContext();
  const [lang, setLang] = useState(() => Language.getLanguage());

  useEffect(() => {
    if (!language) {
      // NOTE Legacy Class components might have called setLanguage() in their componentDidMount() and
      // if they did, it got already processed without us knowing about it => check that the language
      // in our state is still the same and update it if it isn't (same string-value doesn't cause re-render).
      setLang(Language.getLanguage());
      const changeLanguage = ({ language }) => setLang(language);
      Language._register(changeLanguage);
      return () => Language._unregister(changeLanguage);
    }
  }, [language]);

  return [language || lang, setLanguage || Language.setLanguage];
};

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
    Tools.error(
      "Switching LanguageProvider values format from legacy to current and vice-versa is not properly supported. Re-mount provider or keep the value type same."
    );
  }

  // NOTE This assumes that context value never changes because it should
  // contain only function references.
  let id = useInitial(() => (isLegacy ? Tools.generateUUID() : undefined));
  let [notifiedValue, setNotifiedValue] = useState(() => (isLegacy ? contextValue.getLanguage() : undefined));
  let setLanguage = useInitial(() => (isLegacy ? contextValue.setLanguage : undefined));
  let unregisterLsi = useInitial(() => {
    if (isLegacy) {
      let { registerLsi, unregisterLsi } = contextValue;
      typeof registerLsi === "function" && registerLsi(id, (lang) => setNotifiedValue(lang));
      return unregisterLsi;
    }
  });
  useEffect(() => () => typeof unregisterLsi === "function" && unregisterLsi(id), [id, unregisterLsi]);

  return isLegacy ? { language: notifiedValue, setLanguage } : contextValue;
}

export { LanguageContext, useLanguage };
