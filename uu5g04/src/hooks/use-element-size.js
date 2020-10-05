import UU5 from "uu5g04";
import { useState, useRef } from "./react-hooks";

// TODO Remove polyfill when browsers are ready.
if (!window.ResizeObserver) {
  window.ResizeObserver = require("resize-observer-polyfill");
  if (typeof window.ResizeObserver !== "function") window.ResizeObserver = window.ResizeObserver.default;
}

function useElementSize({ width, height, interval = UU5.Environment.resizeInterval } = {}) {
  const [rect, setRect] = useState({ width, height });

  let observerRef = useRef();
  if (observerRef.current == null) {
    const callback = UU5.Common.Tools.debounce(
      (entries) => {
        let { contentRect } = entries[entries.length - 1] || {};
        if (contentRect && (contentRect.width !== rect.width || contentRect.height !== rect.height)) {
          setRect(contentRect);
        }
      },
      interval,
      { leading: true }
    );

    observerRef.current = new ResizeObserver(callback);
  }

  const refRef = useRef();
  if (refRef.current == null) {
    refRef.current = function (ref) {
      if (ref) {
        let rect = typeof ref.getBoundingClientRect === "function" ? ref.getBoundingClientRect() : null;
        if (rect) {
          setRect((wh) =>
            wh.width !== rect.width || wh.height !== rect.height ? { width: rect.width, height: rect.height } : wh
          );
        }
      }

      if (observerRef.current) {
        observerRef.current.disconnect();
        if (ref) {
          if (process.env.NODE_ENV !== "production" && !(ref instanceof HTMLElement)) {
            console.warn(
              "Hook useElementSize returns 'ref' which must be passed to a DOM element, not to a component. " +
                "The hook won't work correctly."
            );
          }
          observerRef.current.observe(ref);
        }
      }
    };
  }

  return { ref: refRef.current, width: rect.width, height: rect.height };
}

export { useElementSize };
export default useElementSize;
