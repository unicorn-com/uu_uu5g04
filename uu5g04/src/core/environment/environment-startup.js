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

import initialEnvironment from "../uu5g05-integration/environment.js";
import Environment from "./environment.js";
import Tools from "../common/tools.js";
import IconManager from "./icon-manager.js";
import EventListener from "../common/event-listener.js";
import Speech from "./speech.js";
import CommonLsi from "../common/common-lsi.js";

// merge environment settings from global variable into our defaults
if (initialEnvironment) {
  let { iconLibraries } = Environment;
  Tools.extend(Environment, initialEnvironment);

  // copy property descriptors (which ensure that changing g04 Environment gets propagated to g05 and vice versa)
  for (let k of Object.getOwnPropertyNames(initialEnvironment)) {
    let desc = Object.getOwnPropertyDescriptor(initialEnvironment, k);
    Object.defineProperty(Environment, k, desc);
  }

  // some settings are to be taken from g04 instead of g05 - propagate them to g05 (property descriptor setters will do that)
  Environment.iconLibraries = {
    ...Environment.iconLibraries,
    ...iconLibraries,
    ...window.UU5?.Environment?.iconLibraries,
  };
}

Environment.IconManager = new IconManager(Environment.iconLibraries);
Environment.EventListener = new EventListener();
Environment.Speech = new Speech();
Environment.Lsi.Common = CommonLsi;
