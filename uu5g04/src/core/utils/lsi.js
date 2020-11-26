import { Utils } from "uu5g05";

const g05Language = Utils.Language;

const Lsi = {
  register(listener) {
    return g05Language._register(listener);
  },

  unregister(listener) {
    return g05Language._unregister(listener);
  },

  setLanguage(language) {
    return g05Language.setLanguage(language);
  },

  getLanguage() {
    return g05Language.getLanguage();
  },

  parseLanguage(languagesString) {
    return g05Language._parseLanguage(languagesString);
  },

  getItem(lsi, language) {
    return g05Language.getItem(lsi, language);
  },
};

export { Lsi };
export default Lsi;
