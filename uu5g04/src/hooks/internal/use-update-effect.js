import { useEffect, useRef } from "../react-hooks";

// call effect on updates (not on mount)
function useUpdateEffect(fn, deps) {
  let mountedRef = useRef(false);
  return useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    return fn();
    // eslint-disable-next-line uu5/hooks-exhaustive-deps
  }, deps);
}

export default useUpdateEffect;
