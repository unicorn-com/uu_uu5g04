/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import { Utils, PropTypes } from "uu5g05";
import Environment from "../environment/environment.js";
import { createComponent } from "./component.js";
import { preprocessors } from "./component-processors.js";
// import { SYMBOL_COMPONENT, SYMBOL_INIT, SYMBOL_GUARD } from "./component-symbols";
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
    nestingLevel: PropTypes.oneOf(Environment.nestingLevelList),
  });

  static defaultProps = Object.freeze({
    id: undefined,
    className: undefined,
    style: undefined,
    disabled: undefined,
    hidden: undefined,
    mainAttrs: undefined,
    noIndex: undefined,
    nestingLevel: undefined,
  });

  static create(componentDescriptor) {
    return createComponent(componentDescriptor, true);

    // TODO Optimization is temporarily disabled, until it gets fully tested.
    // // NOTE Assuming that we perform postponing of createReactClass() calls also in "test" environment,
    // // there'll be the following issue: UU5.Bricks.Button would be a forwardRef component, <UU5.Bricks.Button />
    // // would be an element but its "type" wouldn't be UU5.Bricks.Button (because UU5.Common.Element.create in element.js
    // // is used and it replaces it with lazy-initialized original Button class, not forwardRef),
    // // therefore `wrapper.find(UU5.Bricks.Button)` wouldn't work.
    // //   => skip the optimization in "test" environments
    // if (process.env.NODE_ENV === "test") return createComponent(componentDescriptor, true);

    // // skip the optimization for simple components (not worth introducing forwardRef)
    // if (!componentDescriptor.mixins) return createComponent(componentDescriptor, true);

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
    //     Component = createComponent(componentDescriptor, true);
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
    return Utils.VisualComponent.getAttrs(props, nextClassName);
  }
}

function addBasicVisualPropsPreprocessor(componentDescriptor) {
  let { mixins, propTypes } = componentDescriptor;

  // add standard visual props if no mixin is used
  if (!mixins || mixins.length === 0) {
    if (typeof propTypes !== "function") {
      componentDescriptor.propTypes = {
        ...VisualComponent.propTypes,
        ...propTypes,
      };

      if (componentDescriptor.defaultProps) {
        componentDescriptor.defaultProps = {
          ...VisualComponent.defaultProps,
          ...componentDescriptor.defaultProps,
        };
      } else if (typeof componentDescriptor.getDefaultProps === "function") {
        let origGDP = componentDescriptor.getDefaultProps;
        componentDescriptor.getDefaultProps = function () {
          let result = origGDP.apply(this);
          return {
            ...VisualComponent.defaultProps,
            ...result,
          };
        };
      } else {
        componentDescriptor.defaultProps = VisualComponent.defaultProps;
      }
    }
  }
  return componentDescriptor;
}
addBasicVisualPropsPreprocessor.isVisual = true;

export default VisualComponent;
