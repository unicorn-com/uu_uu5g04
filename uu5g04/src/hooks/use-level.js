import UU5 from "uu5g04";
import { useContext, useMemo } from "./react-hooks";
import { createComponent } from "./component";

const LevelContext = UU5.Common.Level.Context;

function useLevel() {
  let contextValue = useContext(LevelContext);
  let result = UU5.Common.Level.computeComponentLevel(contextValue);
  return result;
}

const LevelProvider = createComponent({
  displayName: "UU5.Hooks.LevelProvider",

  propTypes: {
    level: UU5.PropTypes.number
  },

  defaultProps: {
    level: undefined
  },

  render({ level, children }) {
    let value = useMemo(() => ({ level }), [level]);

    return <LevelContext.Provider value={value}>{children}</LevelContext.Provider>;
  }
});

export { LevelProvider, LevelContext };
export default useLevel;
