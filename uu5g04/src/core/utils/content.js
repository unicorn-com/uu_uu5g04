import NestingLevel from "./nesting-level";
import Element from "../common/element";
import Tools, { REGEXP } from "../common/tools";
import UU5String from "../common/uu5string/uu5-string";

export const Content = {
  getChildren(children, props, statics) {
    let nl = NestingLevel.getChildNestingLevel(props, statics);
    let childProps = {
      parent: props.parent,
      nestingLevel: nl
    };

    let result;
    if (Array.isArray(children)) {
      result = children.map((child, i) => getChild(child, childProps, i));
    } else {
      result = getChild(children, childProps);
    }
    return result;
  }
};

function getChild(child, childProps, key = "") {
  let result;
  if (Element.isValid(child)) {
    result = child; // no passing of props
  } else {
    // uu5json / uu5data (with continued evaluation after JSON parsing)
    if (typeof child === "string") {
      if (child.match(REGEXP.uu5json)) {
        try {
          child = Tools.parseFromUu5JSON(child);
        } catch (e) {
          if (e && e.code === "uu5jsonInvalid") return getError(e, child);
          else throw e;
        }
      } else if (child.match(REGEXP.uu5data)) {
        child = Tools.parseFromUu5Data(child);
      }
    }

    if (child && typeof child === "object") {
      // tag + props | tag + propsArray
      if (child.tag) {
        let Component = Tools.checkTag(child.tag, true);
        if (Array.isArray(child.propsArray)) {
          result = child.propsArray.map((props, i) =>
            getTagItem(child.tag, { ...childProps, ...props }, key + "-" + i, Component)
          );
        } else {
          result = getTagItem(child.tag, { ...childProps, ...child.props }, key, Component);
        }
      } else {
        // if (process.env.NODE_ENV === "development") Tools.showError("Unsupported object used as a child:", { child });
        result = child;
      }
    } else if (typeof child === "function") {
      result = child(childProps);
    } else if (typeof child === "string" && child.match(REGEXP.uu5string)) {
      try {
        result = UU5String.toChildren(child);
      } catch (e) {
        if (e.code === "uu5StringInvalid") result = getError(e, child);
        else throw e;
      }
    } else {
      result = child; // no passing of props
    }
  }
  return result;
}

function getTagItem(tagName, props, key, Component = null) {
  if (!Component) Component = Tools.checkTag(tagName, true);
  return Component ? <Component key={key} {...props} /> : Tools.findComponent(tagName, { key, ...props });
}

function getError(e, child) {
  return Tools.findComponent(
    "UU5.Common.Error",
    null,
    <div>
      {e.message}
      <br />
      {child}
    </div>
  );
}

export default Content;
