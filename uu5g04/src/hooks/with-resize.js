import UU5 from "uu5g04";
import { useRef } from "./react-hooks";
import { useParentSize } from "./use-parent-size";
import { createComponent } from "./component";

export const withResize = (Component, reserveSpace) =>
  createComponent(
    {
      displayName: "withResize(" + Component.displayName + ")",
      propTypes: {
        width: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.oneOf(["auto"])]),
        height: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.oneOf(["auto"])])
      },

      render(props, ref) {
        let { Resizer, width, height } = useParentSize();

        let usedWidth = props.width || width;
        let usedHeight = props.height || height;
        let shouldRender = useRef(false);
        if (!shouldRender.current && usedWidth && usedHeight) {
          shouldRender.current = true;
        }

        return (
          <UU5.Common.Fragment>
            <Resizer />
            {shouldRender.current ? (
              <Component {...props} width={usedWidth} height={usedHeight} ref={ref} />
            ) : reserveSpace && (usedWidth || usedHeight) ? (
              <div style={{ width: usedWidth || undefined, height: usedHeight || undefined }} />
            ) : null}
          </UU5.Common.Fragment>
        );
      }
    },
    !Component.isStateless
  );

export default withResize;
