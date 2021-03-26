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
import UU5 from "uu5g04";
//@@viewOff:imports

// These HOCs are shared by multiple modules (Bricks, Forms)
// which is why they are placed on top of them.

export const withUserPreferences = (Component, mapping) => {
  if (!UU5.Common.Context.isSupported() || process.env.NODE_ENV === "test") return Component;
  let forwardRef = UU5.Common.Reference.forward((props, ref) => {
    return (
      <UU5.Common.UserPreferencesContext.Consumer>
        {(context) => {
          let usedContextValues = {};
          if (mapping) {
            for (let key in mapping) {
              usedContextValues[key] = context[mapping[key]];
            }
          } else {
            usedContextValues = context;
          }
          return <Component {...props} {...usedContextValues} ref={ref} />;
        }}
      </UU5.Common.UserPreferencesContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

export const withUserPreferencesAndTimeZone = (Component, mapping) => {
  // disable context for jest tests - enzyme doesn't support React 16.3 Context API
  if (!UU5.Common.Context.create || process.env.NODE_ENV === "test") return Component;
  let forwardRef = UU5.Common.Reference.forward((props, ref) => {
    return (
      <UU5.Common.TimeZoneContext.Consumer>
        {({ timeZone }) => {
          return <Component {...props} _contextTimeZone={timeZone} ref={ref} />;
        }}
      </UU5.Common.TimeZoneContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return withUserPreferences(forwardRef, mapping);
};

export default withUserPreferences;
