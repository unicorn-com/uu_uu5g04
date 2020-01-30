import { useRef } from "./react-hooks";
import { useElementSize } from "./use-element-size";

export function useParentElementSize(initialWidth, initialHeight) {
  let [elemRef, width, height] = useElementSize(initialWidth, initialHeight);

  let componentRef = useRef();
  if (componentRef.current == null) {
    let spanRefFn = ref => {
      elemRef(ref ? ref.parentNode : ref);
    };
    componentRef.current = function Observer(props) {
      return <span ref={spanRefFn} style={{ display: "none" }}></span>;
    };
  }

  return [componentRef.current, width, height];
}
export default useParentElementSize;
