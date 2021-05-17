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
`;
