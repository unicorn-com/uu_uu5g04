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

const [LsiContext, useLsiContext] = createContext([]);

const LsiProvider = createComponent({

  displayName: "UU5.Hooks.LsiProvider",

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
      typeof onChange === "function" && onChange({ language });
    }, [lang]);

    const value = useMemo(() => [lang, language => setLang(language)], [lang]);

    return <LsiContext.Provider value={value}>{children}</LsiContext.Provider>;
  }
});

function useLsi(initLanguage) {
  const [contextLang, setContextLang] = useLsiContext();
  const [lang, setLang] = useState(initLanguage || UU5.Utils.Lsi.getLanguage());

  useEffect(() => {
    if (!contextLang) {
      const changeLanguage = ({ language }) => setLang(language);
      UU5.Utils.Lsi.register(changeLanguage);
      return () => UU5.Utils.Lsi.unregister(changeLanguage);
    }
  }, []);

  return [contextLang || lang, setContextLang || UU5.Utils.Lsi.setLanguage];
}

export { LsiProvider, LsiContext };
export default useLsi;
