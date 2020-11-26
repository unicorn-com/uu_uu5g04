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

import Environment from "./environment/environment.js";
import initialEnvironment from "./uu5g05-integration/environment.js";
import Tools from "./common/tools.js";

// merge environment settings from global variable into our defaults
if (initialEnvironment) {
  Tools.extend(Environment, initialEnvironment);

  // copy property descriptors (which ensure that changing g04 Environment gets propagated to g05 and vice versa)
  for (let k of Object.getOwnPropertyNames(initialEnvironment)) {
    let desc = Object.getOwnPropertyDescriptor(initialEnvironment, k);
    Object.defineProperty(Environment, k, desc);
  }
}
