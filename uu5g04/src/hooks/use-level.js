import { useLevel as useLevelG05, LevelProvider as LevelProviderG05, createComponent } from "uu5g05";

const EMPTY_FN = () => {};

function useLevel(...hookArgs) {
  let result = useLevelG05(...hookArgs);
  return Array.isArray(result) ? result[0] : result;
}

// g04 Provider is always fully controlled via props.level (even without onChange);
// it also does not have to handle setLevel
//   => provide onChange to g05 to make it fully controlled but don't do anything
const LevelProvider = createComponent({
  uu5Tag: "UU5.Hooks.LevelProvider",
  propTypes: {
    level: LevelProviderG05.propTypes.level,
  },
  render(props) {
    return <LevelProviderG05 {...props} onChange={EMPTY_FN} />;
  },
});

export { useLevel, LevelProvider };
export default useLevel;
