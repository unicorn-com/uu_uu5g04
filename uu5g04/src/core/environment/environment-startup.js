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

  // some settings are to be taken from g04 instead of g05 - propagate them to g05
  let finalIconLibraries = {
    ...Environment.iconLibraries,
    ...iconLibraries,
    ...window.UU5?.Environment?.iconLibraries,
  };
  for (let k in finalIconLibraries) Environment.iconLibraries[k] = finalIconLibraries[k];
}

Environment.IconManager = new IconManager(Environment.iconLibraries);
Environment.EventListener = new EventListener();
Environment.Speech = new Speech();
Environment.Lsi.Common = CommonLsi;
