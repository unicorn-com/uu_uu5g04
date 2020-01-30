import { useState, useRef } from "./react-hooks";

// TODO Remove polyfill when browsers are ready.
if (!window.ResizeObserver) window.ResizeObserver = require("resize-observer-polyfill").default;

export function useElementSize(initialWidth, initialHeight) {
  let [rect, setRect] = useState({ width: initialWidth, height: initialHeight });

  let observerRef = useRef();
  if (observerRef.current == null) {
    observerRef.current = new ResizeObserver(entries => {
      let entry = entries[entries.length - 1];
      if (entry) setRect(entry.contentRect);
    });
  }

  let refRef = useRef();
  if (refRef.current == null) {
    refRef.current = function(ref) {
      observerRef.current.disconnect();
      if (ref) {
        if (process.env.NODE_ENV !== "production" && !(ref instanceof HTMLElement)) {
          console.warn(
            "Hook useElementSize returns 'ref' which must be passed to a DOM element, not to a component. The hook won't work correctly."
          );
        }
        observerRef.current.observe(ref);
      }
    };
  }

  return [refRef.current, rect.width, rect.height];
}
export default useElementSize;
