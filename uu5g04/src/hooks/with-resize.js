import { createComponent, PropTypes, useRef } from "uu5g05";
import { useParentSize } from "./internal/use-parent-size";

export const withResize = (Component, reserveSpace) =>
  createComponent(
    {
      displayName: "withResize(" + Component.displayName + ")",
      propTypes: {
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(["auto"])]),
        height: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(["auto"])]),
      },

      render(props, ref) {
        if (Component.isStateless) ref = undefined;
        let { Resizer, contentWidth, contentHeight } = useParentSize();

        let usedWidth = props.width || contentWidth;
        let usedHeight = props.height || contentHeight;
        let shouldRender = useRef(false);
        if (!shouldRender.current && usedWidth && usedHeight) {
          shouldRender.current = true;
        }

        return (
          <>
            <Resizer />
            {shouldRender.current ? (
              <Component {...props} width={usedWidth} height={usedHeight} ref={ref} />
            ) : reserveSpace && (usedWidth || usedHeight) ? (
              <div style={{ width: usedWidth || undefined, height: usedHeight || undefined }} />
            ) : null}
          </>
        );
      },
    },
    !Component.isStateless
  );

export default withResize;
