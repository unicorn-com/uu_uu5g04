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
import UU5 from "uu5g04";

export const FormContext = UU5.Common.Context.create();

export class Context {
  static withContext(Component) {
    // disable context for jest tests - enzyme doesn't support React 16.3 Context API
    if (!React.createContext || process.env.NODE_ENV === "test") return Component;
    let forwardRef = React.forwardRef((props, ref) => {
      return (
        <FormContext.Consumer _hasFormContext={true}>
          {({ readOnly, values }) => {
            let value = props.value;
            if (values && value === undefined) {
              value = values[props.name || props.id];
            }

            if (props.readOnly !== undefined) {
              readOnly = props.readOnly;
            }

            return <Component
              {...props}
              ref={ref}
              readOnly={readOnly}
              value={value}
              _hasFormContext={true}
            />
        }}
        </FormContext.Consumer>
      );
    });

    forwardRef.isUu5PureComponent = true;
    forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
    forwardRef.tagName = Component.tagName;

    return forwardRef;
  }
}

export default Context;
