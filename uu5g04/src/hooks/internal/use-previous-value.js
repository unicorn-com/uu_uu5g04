import { useRef, useEffect } from "../react-hooks";

export function usePreviousValue(curValue, initialValue = undefined) {
  let curValueRef = useRef(initialValue);
  useEffect(() => {
    curValueRef.current = curValue;
  });
  return curValueRef.current;
}
