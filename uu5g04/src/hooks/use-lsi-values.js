import UU5 from "uu5g04";
import { useLanguage } from "./use-language";
import { useMemo } from "./react-hooks";

function useLsiValues(lsi) {
  const [language] = useLanguage();
  const result = useMemo(() => {
    let values = {};
    if (lsi && typeof lsi === "object") {
      for (let k in lsi) values[k] = lsi[k] != null ? UU5.Utils.Lsi.getItem(lsi[k], language) : lsi[k];
    }
    return values;
  }, [language, lsi]);
  return result;
}

export { useLsiValues };
export default useLsiValues;
