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

import Environment from "../../environment/environment";
import { UU5DATA_REGEXP } from "./constants.js";

export class UU5Data {
  static parse(uu5Data) {
    uu5Data = uu5Data.replace(UU5DATA_REGEXP, "");
    let parts = uu5Data.split(".");
    let data = Environment.uu5DataMap;
    while (data != null && parts.length > 0) data = data[parts.shift()];
    if (typeof data === undefined) {
      console.warn(`There is no component data in Environment.uu5DataMap for uu5Data: ${uu5Data} !`, {
        uu5Data: uu5Data
      });
    }
    return data;
  }
}

export default UU5Data;
