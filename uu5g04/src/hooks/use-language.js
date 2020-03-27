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
import { useState, useEffect, useMemo } from "./react-hooks";
import { createComponent } from "./component";
import { createContext } from "./context";

const [LanguageContext, useLanguageContext] = createContext([]);

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
    const [lang, setLang] = useState(language || UU5.Utils.Lsi.getLanguage());

    useEffect(() => {
      typeof onChange === "function" && onChange({ language: lang });
    }, [lang]);

    const value = useMemo(() => ({ language: lang, setLanguage: setLang }), [lang]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
  }
});

function useLanguage(initLanguage) {
  const { language, setLanguage } = useLanguageContext();
  const [lang, setLang] = useState(initLanguage || UU5.Utils.Lsi.getLanguage());

  useEffect(() => {
    if (!language) {
      const changeLanguage = ({ language }) => setLang(language);
      UU5.Utils.Lsi.register(changeLanguage);
      return () => UU5.Utils.Lsi.unregister(changeLanguage);
    }
  }, []);

  return { language: language || lang, setLanguage: setLanguage || UU5.Utils.Lsi.setLanguage };
}

export { useLanguage, LanguageProvider, LanguageContext };
export default useLanguage;
