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
          // TODO remove condition, it is only for backward compatibility until all libs will use only uu5g05 > 1.0.0
          const userPreferences = context?.userPreferences || context;
          let usedContextValues = {};
          if (mapping) {
            for (let key in mapping) {
              usedContextValues[key] = userPreferences[mapping[key]];
            }
          } else {
            usedContextValues = userPreferences;
          }
          return <Component {...usedContextValues} {...props} ref={ref} />;
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
