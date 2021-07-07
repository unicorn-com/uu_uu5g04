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

import "./core-startup.js";

import * as Exports from "./core-exports.js";
export * from "./core-exports.js";

const UU5 = window.UU5 || {};
Object.defineProperties(UU5, Object.getOwnPropertyDescriptors(Exports));
window.UU5 = UU5;

// for backward compatibility; otherwise we should do just `export default Exports;`
export default UU5;
