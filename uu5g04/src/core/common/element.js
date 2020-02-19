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
import { SYMBOL_COMPONENT, SYMBOL_INIT, SYMBOL_GUARD } from "./component-symbols";

export class Element {
  static create(...args) {
    let type = args[0];
    if (process.env.NODE_ENV === "test" && type == null) {
      throw new Error(
        "Element type is: " +
        type +
        ". You likely forgot to import necessary library, or forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."
      );
    }
    if (type) {
      let redirComponent = type[SYMBOL_COMPONENT];
      if (redirComponent) {
        args[0] = redirComponent;
      } else {
        let redirComponentInit = type[SYMBOL_INIT];
        if (redirComponentInit && type[SYMBOL_GUARD] === type) args[0] = redirComponentInit();
      }
    }
    return React.createElement(...args);
  }

  static clone(...args) {
    return React.cloneElement(...args);
  }

  static isValid(...args) {
    return React.isValidElement(...args);
  }
}

export default Element;
