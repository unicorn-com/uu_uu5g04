export { useElementSize } from "uu5g05";

// TODO Remove polyfill when browsers are ready.
if (!window.ResizeObserver) {
  window.ResizeObserver = require("resize-observer-polyfill");
  if (typeof window.ResizeObserver !== "function") window.ResizeObserver = window.ResizeObserver.default;
}
