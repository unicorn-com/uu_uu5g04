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

import React from "react";
import Environment from "../../environment/environment.js";
import Context from "../context.js";
import { LanguageContext } from "../../uu5g05-integration/use-language.js";

const LsiContext = LanguageContext;

const withLsiContext = (Component) => {
  // disable context for jest tests - enzyme doesn't support React 16.3 Context API
  if (!Context.isSupported() || (process.env.NODE_ENV === "test" && !Environment._allowTestContext)) return Component;

  let forwardRef = React.forwardRef((props, ref) => {
    return (
      <LsiContext.Consumer>
        {({ registerLsi, unregisterLsi, setLanguage, getLanguage, source, language }) => {
          let result;
          // NOTE Plus4U5.App.LanguageSelector currently uses Provider where it sets only setLanguage into the context value...
          let isFromHookProvider = typeof setLanguage === "function" && language !== undefined;
          if (!isFromHookProvider) {
            result = (
              <Component
                {...props}
                ref={ref}
                registerLsi={registerLsi}
                unregisterLsi={unregisterLsi}
                setLanguage={setLanguage}
                getLanguage={getLanguage}
              />
            );
          } else {
            // from hooks (only setLanguage() and language is provided)
            // => emulate registerLsi/unregisterLsi & triggerring of events
            result = (
              <LsiHookAdapter
                componentProps={props}
                componentRef={ref}
                Component={Component}
                setLanguage={setLanguage}
                language={language}
              />
            );
          }
          return result;
        }}
      </LsiContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};
class LsiHookAdapter extends React.Component {
  constructor(props) {
    super(props);
    this._registrationMap = {};
    this._registerLsi = this._registerLsi.bind(this);
    this._unregisterLsi = this._unregisterLsi.bind(this);
    this._getLanguage = this._getLanguage.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.language !== this.props.language) {
      for (let k in this._registrationMap) {
        this._registrationMap[k](this.props.language);
      }
    }
  }
  _registerLsi(id, fn) {
    this._registrationMap[id] = fn;
  }
  _unregisterLsi(id) {
    delete this._registrationMap[id];
  }
  _getLanguage() {
    return this.props.language;
  }
  render() {
    let { componentProps, componentRef, Component, setLanguage } = this.props;
    return (
      <Component
        {...componentProps}
        ref={componentRef}
        setLanguage={setLanguage}
        getLanguage={this._getLanguage}
        registerLsi={this._registerLsi}
        unregisterLsi={this._unregisterLsi}
      />
    );
  }
}

export { LsiContext, withLsiContext };
