/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import Environment from "../environment/environment.js";
import Component from "./component.js";
import Style from "../utils/style.js";
import { preprocessors, postprocessors } from "./visual-component-processors.js";
import { SYMBOL_COMPONENT, SYMBOL_INIT, SYMBOL_GUARD } from "./component-symbols";
//@@viewOff:imports

preprocessors.push(addBasicVisualPropsPreprocessor);

export class VisualComponent {
  static propTypes = Object.freeze({
    id: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
    mainAttrs: PropTypes.object,
    noIndex: PropTypes.bool,
    nestingLevel: PropTypes.oneOf(Environment.nestingLevelList)
  });

  static defaultProps = Object.freeze({
    id: undefined,
    className: undefined,
    style: undefined,
    disabled: undefined,
    hidden: undefined,
    mainAttrs: undefined,
    noIndex: undefined,
    nestingLevel: undefined
  });

  static create(componentDescriptor) {
    return doCreate(componentDescriptor);

    // TODO Optimization is temporarily disabled, until it gets fully tested.
    // // NOTE Assuming that we perform postponing of createReactClass() calls also in "test" environment,
    // // there'll be the following issue: UU5.Bricks.Button would be a forwardRef component, <UU5.Bricks.Button />
    // // would be an element but its "type" wouldn't be UU5.Bricks.Button (because UU5.Common.Element.create in element.js
    // // is used and it replaces it with lazy-initialized original Button class, not forwardRef),
    // // therefore `wrapper.find(UU5.Bricks.Button)` wouldn't work.
    // //   => skip the optimization in "test" environments
    // if (process.env.NODE_ENV === "test") return doCreate(componentDescriptor);

    // // skip the optimization for simple components (not worth introducing forwardRef)
    // if (!componentDescriptor.mixins) return doCreate(componentDescriptor);

    // // postpone the actual component creation until its 1st render
    // let Component;
    // let Wrapper = React.forwardRef((props, ref) => {
    //   if (Component === undefined) init();
    //   return <Component {...props} ref={ref} />;
    // });

    // let { statics, displayName, propTypes, getDefaultProps, mixins } = componentDescriptor;
    // let tagName = (statics || {}).tagName;
    // if (!displayName) displayName = tagName;
    // if (tagName) Wrapper.tagName = tagName;
    // if (displayName) Wrapper.displayName = displayName;
    // if (propTypes) Wrapper["prop" + "Types"] = propTypes; // NOTE This prevents this line to be removed by babel-plugin-transform-react-remove-prop-types (some libraries use propTypes even in minified versions, e.g. uu_productcatalogueg01@1.12.0).
    // if (getDefaultProps || mixins) {
    //   Wrapper.getDefaultProps = function() {
    //     return (Component || init()).getDefaultProps();
    //   };
    //   if (process.env.NODE_ENV !== "production") Wrapper.getDefaultProps.isReactClassApproved = true;
    // }
    // Wrapper.isUu5PureComponent = true;

    // let init = function() {
    //   if (!Component) {
    //     Component = doCreate(componentDescriptor);
    //     for (let k of Object.getOwnPropertyNames(Wrapper)) {
    //       try {
    //         if (!(k in Component)) Component[k] = Wrapper[k];
    //       } catch (e) {} // needed for IE for special properties like "caller"
    //     }
    //     Wrapper[SYMBOL_COMPONENT] = Component;
    //   }
    //   return Component;
    // };
    // Wrapper[SYMBOL_INIT] = init;
    // Object.defineProperty(Wrapper, SYMBOL_GUARD, {
    //   enumerable: false,
    //   configurable: false,
    //   value: Wrapper
    // });

    // if (statics) {
    //   for (let k in statics) Wrapper[k] = statics[k]; // so that component's own statics (defaults, opt, ...) are available
    // }

    // return Wrapper;
  }

  static getAttrs(props, nextClassName) {
    let attrs = {};
    let { style, mainAttrs, className, id, disabled, hidden, noIndex } = props;

    // className building
    let mainClassName = typeof className === "string" ? className : undefined;
    let newClassName = Style.joinClassName(nextClassName, mainClassName, noIndex ? "uu5-noindex" : undefined);
    if (newClassName) attrs.className = newClassName;

    if (id != null) attrs.id = id + "";

    let reactStyle = style && typeof style === "string" ? Style.parse(style) : style;
    if (reactStyle) attrs.style = reactStyle;

    if (typeof disabled === "boolean") attrs.disabled = disabled;
    if (typeof hidden === "boolean") attrs.hidden = hidden;

    let newMainAttrs;
    if (mainAttrs) {
      newMainAttrs = { ...mainAttrs };
      delete newMainAttrs.className;
      delete newMainAttrs.style;
      attrs = { ...newMainAttrs, ...attrs };
    }

    return attrs;
  }
}

function doCreate(componentDescriptor) {
  let ctx = {};

  for (let processor of preprocessors) processor(componentDescriptor, ctx);
  let result = Component.create(componentDescriptor);
  for (let processor of postprocessors) result = processor(result, componentDescriptor, ctx);

  return result;
}

function addBasicVisualPropsPreprocessor(componentDescriptor) {
  let { mixins, propTypes } = componentDescriptor;

  // add standard visual props if no mixin is used
  if (!mixins || mixins.length === 0) {
    if (typeof propTypes !== "function") {
      componentDescriptor.propTypes = {
        ...VisualComponent.propTypes,
        ...propTypes
      };

      if (componentDescriptor.defaultProps) {
        componentDescriptor.defaultProps = {
          ...VisualComponent.defaultProps,
          ...componentDescriptor.defaultProps
        };
      } else if (typeof componentDescriptor.getDefaultProps === "function") {
        let origGDP = componentDescriptor.getDefaultProps;
        componentDescriptor.getDefaultProps = function() {
          let result = origGDP.apply(this);
          return {
            ...VisualComponent.defaultProps,
            ...result
          };
        };
      } else {
        componentDescriptor.defaultProps = VisualComponent.defaultProps;
      }
    }
  }
  return componentDescriptor;
}

export default VisualComponent;
