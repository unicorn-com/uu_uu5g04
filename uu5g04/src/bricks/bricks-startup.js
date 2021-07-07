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

import UU5 from "uu5g04";
import Css from "./internal/css.js"; // must be done in startup because it creates <style /> element and we need this to be done during startup, not later
import "./color-schema/default.less";
import BricksLsi from "./bricks-lsi.js";

UU5.Environment.addRuntimeLibrary({
  name: `${UU5.Environment.name}-bricks`,
  version: process.env.VERSION,
  namespace: process.env.NAMESPACE,
});

UU5.Environment.Lsi.Bricks = BricksLsi;

Css.injectGlobal`
  #uu5-modals > * {
    z-index: 1050;
  }

  /* make last .uu5-bricks-container (with footer) be displayed at the bottom edge of the window
     (or below if there's too much content in the page) */
  html, body, body > div:first-child,
  body > div:first-child .uu5-bricks-container {
    box-sizing: border-box;
    height: 100%;
  }
`;
