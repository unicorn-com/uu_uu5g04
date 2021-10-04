import {
  useLanguage,
  LanguageProvider as LanguageProviderG05,
  createComponent,
  useState,
  useUpdateEffect,
  useRef,
  PropTypes,
} from "uu5g05";

// g04 Provider uses different props than g05 (initialLanguage + onChange with no possibility to force
// different value from parent afterwards)
const LanguageProvider = createComponent({
  uu5Tag: "UU5.Hooks.LanguageProvider",
  propTypes: {
    initialLanguage: PropTypes.string,
    onChange: PropTypes.func,
  },
  defaultProps: {
    initialLanguage: undefined,
    onChange: undefined,
  },
  render(props) {
    const { initialLanguage, onChange } = props;
    const [languageState, setLanguageState] = useState({ language: initialLanguage });

    const currentValuesRef = useRef();
    currentValuesRef.current = { onChange };
    useUpdateEffect(() => {
      const { onChange } = currentValuesRef.current;
      if (typeof onChange === "function") onChange({ language: languageState.language });
    }, [languageState.language]);

    return (
      <LanguageProviderG05 {...languageState} onChange={setLanguageState}>
        {props.children}
      </LanguageProviderG05>
    );
  },
});

export { useLanguage, LanguageProvider };
export default useLanguage;
