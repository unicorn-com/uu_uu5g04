import { useSession as useSessionG05, useMemo } from "uu5g05";

// uu5g04: { sessionState, ... }
// uu5g05: { state, ... }  (uu5g05 >= 0.15.0)
function useSession(...hookArgs) {
  let g05Result = useSessionG05(...hookArgs);
  let result = useMemo(() => {
    if (!g05Result || "sessionState" in g05Result || Object.keys(g05Result).length === 0) return g05Result;
    let { state, ...result } = g05Result;
    result.sessionState = state;
    return result;
  }, [g05Result]);
  return result;
}

export { useSession };
export default useSession;
