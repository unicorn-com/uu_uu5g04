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

import UU5 from "uu5g04";
import { forwardRef } from "react";

function createComponent(component, isRef = false) {
  const { render, ...statics } = component;

  const Comp = isRef ? forwardRef(render) : render;
  for (let [key, value] of Object.entries(statics)) Comp[key] = value;

  // FIXME backward compatibility - delete after death of mixins
  Comp.isUu5PureComponent = true;
  if (!isRef) Comp.isStateless = true;

  return Comp;
}

function createComponentWithRef(component) {
  return createComponent(component, true);
}

const VISUAL_PROP_TYPES = UU5.Common.VisualComponent.propTypes;
const VISUAL_DEFAULT_PROPS = UU5.Common.VisualComponent.defaultProps;

function createVisualComponent(component, isRef = false) {
  const componentCfg = {
    ...component,
    propTypes: { ...VISUAL_PROP_TYPES, ...component.propTypes },
    defaultProps: { ...VISUAL_DEFAULT_PROPS, ...component.defaultProps }
  };

  const Comp = isRef ? createComponentWithRef(componentCfg) : createComponent(componentCfg);

  if (process.env.NODE_ENV === "development") {
    if (!Comp.nestingLevel) {
      console.warn(`Visual Component ${Comp.displayName} has not defined nestingLevel.`, component);
    }
  }

  return Comp;
}

function createVisualComponentWithRef(component) {
  return createVisualComponent(component, true);
}

export { createComponent, createComponentWithRef, createVisualComponent, createVisualComponentWithRef };
