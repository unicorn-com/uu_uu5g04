import UU5, { createHoc } from "uu5g04";
import Link from "./link";

const getHref = (href, uveProps) => {
  const { componentName, componentProps } = uveProps;
  const { parent, ...compProps } = componentProps;

  const params = {};

  if (componentName) params["_component"] = componentName;

  for (let prop in uveProps) {
    if (uveProps[prop] !== undefined) params["_" + prop] = uveProps[prop];
  }

  for (let prop in compProps) {
    if (compProps[prop] !== undefined) params[prop] = compProps[prop];
  }

  if (Object.keys(params).length) href += UU5.Common.Tools.encodeQuery(params);
  return href;
};

export const LinkUve = createHoc({
  displayName: "UU5.Bricks.LinkUve",

  propTypes: {
    componentName: UU5.PropTypes.string,
    componentProps: UU5.PropTypes.object,

    // ...Link.propTypes

    href: UU5.PropTypes.string,
    uveProps: UU5.PropTypes.shape({
      top: UU5.PropTypes.any, // lsi or string
      languages: UU5.PropTypes.array,
      title: UU5.PropTypes.any, // lsi or string
      publicContent: UU5.PropTypes.bool,
    }),
  },

  defaultProps: {
    componentName: undefined,
    componentProps: {},

    // ...Link.defaultProps,
    target: "_blank",
    uveProps: {},
  },

  component: Link,

  getProps(props) {
    const { uveProps, componentName, componentProps, content, ...linkProps } = props;

    const href = getHref(linkProps.href || UU5.Environment.COMPONENT_RENDER_UVE, {
      ...uveProps,
      componentName,
      componentProps,
      top: uveProps.top || (typeof linkProps.children === "string" ? linkProps.children : undefined),
    });

    return {
      ...linkProps,
      href,
    };
  },
});

export { getHref };
export default LinkUve;
