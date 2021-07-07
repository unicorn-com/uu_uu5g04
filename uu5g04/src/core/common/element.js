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

import { Utils } from "uu5g05";
// import { SYMBOL_COMPONENT, SYMBOL_INIT, SYMBOL_GUARD } from "./component-symbols";

export class Element {
  static create(...args) {
    // TODO Optimization is temporarily disabled (see visual-component.js).
    // let type = args[0];
    // if (type) {
    //   let redirComponent = type[SYMBOL_COMPONENT];
    //   if (redirComponent) {
    //     args[0] = redirComponent;
    //   } else {
    //     let redirComponentInit = type[SYMBOL_INIT];
    //     if (redirComponentInit && type[SYMBOL_GUARD] === type) args[0] = redirComponentInit();
    //   }
    // }
    return Utils.Element.create(...args);
  }

  static clone(...args) {
    return Utils.Element.clone(...args);
  }

  static isValid(...args) {
    return Utils.Element.isValid(...args);
  }
}

export default Element;
