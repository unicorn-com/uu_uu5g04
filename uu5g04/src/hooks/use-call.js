import { useCall as useCallG05, useRef } from "uu5g05";

// g05: { state="pending|pendingNoData|ready|...", data, errorData={error}, call }   + data can be non-null even if state="error"
// g04: { viewState="call|ready|error", data, error, call }   + data is null if state="error"
function useCall(...hookArgs) {
  let g05Result = useCallG05(...hookArgs);
  let dataRef = useRef();
  if (g05Result.state === "error" || g05Result.state === "errorNoData") dataRef.current = null;
  else if (g05Result.state === "ready" || g05Result.state === "readyNoData") dataRef.current = g05Result.data;
  let result =
    "viewState" in g05Result
      ? g05Result
      : {
          viewState: g05Result.state.replace(/NoData$/, "").replace(/^pending$/, "call"),
          data: dataRef.current,
          error: g05Result.errorData === undefined ? undefined : g05Result.errorData?.error ?? null,
          call: g05Result.call,
        };
  return result;
}

export { useCall };
export default useCall;
