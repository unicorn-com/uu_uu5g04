import UU5, { createHoc } from "uu5g04";
import Link from "./link";

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
      title: UU5.PropTypes.any // lsi or string
    })
  },

  defaultProps: {
    componentName: undefined,
    componentProps: {},

    // ...Link.defaultProps,
    target: "_blank",
    uveProps: {}
  },

  component: Link,

  getProps(props) {
    const { uveProps, componentName, componentProps, content, ...linkProps } = props;
    const { parent, ...compProps } = componentProps;

    let href = linkProps.href || UU5.Environment.COMPONENT_RENDER_UVE;
    const params = {};

    if (componentName) params["_component"] = componentName;

    if (uveProps.top === undefined && typeof linkProps.children === "string") {
      uveProps.top = linkProps.children;
    }

    for (let prop in uveProps) {
      if (uveProps[prop]) params["_" + prop] = uveProps[prop];
    }

    for (let prop in compProps) {
      if (compProps[prop]) params[prop] = compProps[prop];
    }

    if (Object.keys(params).length) href += UU5.Common.Tools.encodeQuery(params);

    return {
      ...linkProps,
      href
    };
  }
});

export default LinkUve;
