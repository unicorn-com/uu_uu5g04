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
  }

  static getAttrs(props, nextClassName) {
    const attrs = Utils.VisualComponent.getAttrs({ ...props, elementAttrs: props.mainAttrs }, nextClassName);
    delete attrs.ref;
    return attrs;
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
        componentDescriptor.getDefaultProps = function() {
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
