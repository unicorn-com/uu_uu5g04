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
import * as Forms from "./forms.js";

export * from "./forms.js";
export default Forms;

import FormsLsi from "./forms-lsi.js";
UU5.Environment.Lsi.Forms = FormsLsi;

// merge into UU5
// NOTE "uu5g04" must ensure that the key already exists there, otherwise following usage wouldn't work:
//   import * as UU5 from "uu5g04";
//   import "uu5g04-forms";
//   console.log(UU5.Forms.TextArea);
for (var k in Forms) UU5.Forms[k] = Forms[k];
