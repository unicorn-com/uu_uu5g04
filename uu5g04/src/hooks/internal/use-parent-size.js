import { useRef, useElementSize } from "uu5g05";

function useParentSize(params) {
  const { ref, width, height, contentWidth, contentHeight } = useElementSize(params);

  const componentRef = useRef();
  if (componentRef.current == null) {
    const spanRefFn = (spanRef) => ref(spanRef ? spanRef.parentNode : spanRef);
    componentRef.current = function Observer(props) {
      return <span ref={spanRefFn} hidden />;
    };
  }

  return { Resizer: componentRef.current, width, height, contentWidth, contentHeight };
}

export { useParentSize };
export default useParentSize;
