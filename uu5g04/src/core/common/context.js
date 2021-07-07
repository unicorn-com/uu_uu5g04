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

import React from "react";
import Environment from "../environment/environment.js";
import { Utils } from "uu5g05";

let g05Context = Utils.Context;

const REACT_MAJOR_VERSION = parseInt(React.version.match(/\d+/)[0]);
const REACT_MINOR_VERSION = parseInt(React.version.match(/\.(\d+)/)[1]);
const allowContext = REACT_MAJOR_VERSION > 16 || (REACT_MAJOR_VERSION === 16 && REACT_MINOR_VERSION >= 4);

export class Context {
  static create(defaultValue = {}) {
    let context;

    if (Context.isSupported()) {
      [context] = g05Context.create(defaultValue);
    } else {
      process.env.NODE_ENV === "development" && console.error("For Context implementation use React 16.4+");
      context = {
        Consumer: ({ children }) => children(),
        Provider: ({ children }) => children,
      };
    }

    return context;
  }

  static isSupported() {
    return React.createContext && allowContext;
  }
}

export const TextCorrectorContext = Context.create();

const _getContextValue = (propValue, textCorrectorPropValue, contextValue, environmentValue) => {
  if (propValue !== undefined) {
    return propValue;
  }
  if (textCorrectorPropValue !== undefined) {
    return textCorrectorPropValue;
  }
  if (contextValue !== undefined) {
    return contextValue;
  }
  if (environmentValue) {
    return true;
  }
  return undefined;
};

export const withTextCorrectorContext = (Component) => {
  // disable context for jest tests - enzyme doesn't support React 16.3 Context API
  if (!Context.isSupported() || (process.env.NODE_ENV === "test" && !Environment._allowTestContext)) return Component;
  let forwardRef = React.forwardRef((props, ref) => {
    return (
      <TextCorrectorContext.Consumer>
        {({ checkSpaces, checkGrammar, checkHighlight, language }) => (
          <Component
            {...props}
            ref={ref}
            checkSpaces={_getContextValue(
              props.checkSpaces,
              props.textCorrector,
              checkSpaces,
              Environment.textCorrector
            )}
            checkGrammar={_getContextValue(
              props.checkGrammar,
              props.textCorrector,
              checkGrammar,
              Environment.textCorrector
            )}
            checkHighlight={_getContextValue(
              props.checkHighlight,
              props.textCorrector,
              checkHighlight,
              Environment.textCorrector
            )}
            language={props.language || language}
          />
        )}
      </TextCorrectorContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

export default Context;
