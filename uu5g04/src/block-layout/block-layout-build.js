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
import "./block-layout-startup.js";

import * as Exports from "./block-layout.js";
export * from "./block-layout.js";
export default Exports;

// merge into UU5
// NOTE "uu5g04" must ensure that the key already exists there, otherwise following usage wouldn't work:
//   import * as UU5 from "uu5g04";
//   import "uu5g04-forms";
//   console.log(UU5.Forms.TextArea);
Object.defineProperties(UU5.BlockLayout, Object.getOwnPropertyDescriptors(Exports));
