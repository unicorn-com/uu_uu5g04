import { useRef, useEffect } from "./react-hooks";

export function useUnmountedRef(curValue, initialValue = undefined) {
  const unmountedRef = useRef(false);
  useEffect(() => () => (unmountedRef.current = true), []);
  return unmountedRef;
}
export default useUnmountedRef;
