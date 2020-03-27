import Environment from "../environment/environment";
import ListenerRegistry from "./internal/listener-registry";

const LISTENER_REGISTRY = new ListenerRegistry();

const Lsi = {
  register(listener) {
    return LISTENER_REGISTRY.register(listener);
  },

  unregister(listener) {
    return LISTENER_REGISTRY.unregister(listener);
  },

  setLanguage(language) {
    globalLanguage = language;
    LISTENER_REGISTRY.run({ language });
  },

  getLanguage() {
    return globalLanguage;
  },

  parseLanguage(languagesString) {
    // languagesString = 'cs-CZ,en;q=0.6,sk;q=0.8' => languagesSplitter = ['cs-CZ', 'en;q=0.6', 'sk;q=0.8']
    const languagesSplitter = languagesString.toLowerCase().split(",");

    let languages = {};
    languagesSplitter.forEach(lang => {
      lang = lang.trim();

      const [langStr, qStr] = lang.split(";");
      let q = 1; // quality factor
      if (qStr) {
        q = +qStr.split("=")[1];
      }

      const languageMap = { q, location: langStr };
      const [language, region] = langStr.split("-");
      languageMap.language = language;
      if (region) {
        languageMap.region = region;
      }

      let selectedLanguage = languages[languageMap.location];
      if (selectedLanguage) {
        selectedLanguage.q < q && (selectedLanguage.q = q);
      } else {
        languages[languageMap.location] = languageMap;
      }
    });

    // [{language: 'cs', location: 'cs-CZ', q: 1.0}, {language: 'sk', q: 0.8}, {language: 'en', q: 0.6}]
    return Object.values(languages).sort((lang1, lang2) => {
      if (lang1.q < lang2.q) {
        return 1;
      } else if (lang1.q > lang2.q) {
        return -1;
      } else {
        return 0;
      }
    });
  },

  // cs
  // cs-cz
  // cs-CZ, sk;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5
  getItem(lsi, language = globalLanguage) {
    const sortedLanguages = Lsi.parseLanguage(language);
    const keys = Object.keys(lsi);
    let resLang = keys[0];

    for (let i = 0; i < sortedLanguages.length; i++) {
      const lang = sortedLanguages[i];
      resLang = lang.location;

      if (lsi[lang.location]) {
        resLang = lang.location;
        break;
      } else if (lsi[lang.language]) {
        resLang = lang.language;
        break;
      } else {
        let lsiKeys = keys.filter(key => new RegExp("^" + lang.language).test(key));

        if (lsiKeys.length) {
          resLang = lsiKeys[0];
          break;
        } else {
          const defaultLanguage = Environment.defaultLanguage;
          if (defaultLanguage) {
            if (lsi[defaultLanguage]) {
              resLang = defaultLanguage;
              break;
            } else if (lsi[defaultLanguage.split("-")[0]]) {
              resLang = defaultLanguage.split("-")[0];
              break;
            }
          }
        }
      }
    }

    let lsiKey = lsi[resLang] ? resLang : lsi[keys[0]] ? keys[0] : null;

    return lsi[lsiKey];
  }
};

let globalLanguage = window.navigator.language.toLowerCase();

export { Lsi };
export default Lsi;
