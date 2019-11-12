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

import Tools from "../tools.js";

const UU5_JSON_REGEXP = /^\s*<uu5json\s*\/>/;

export class UU5Json {
  static parse(uu5Json) {
    uu5Json = UU5Json.toJson(uu5Json);
    let value = null;

    try {
      value = JSON.parse(uu5Json);
    } catch (err) {
      Tools.error("Error uu5JSON parse.", {
        uu5Json: uu5Json,
        cause: err
      });

      err.code = "uu5JsonInvalid";
      err.context = { json: uu5Json };

      throw err;
    }

    return value;
  }

  static toJson(uu5Json) {
    return uu5Json.replace(UU5_JSON_REGEXP, "");
  }

  constructor(json) {
    this._uu5json = json;
    this._object = UU5Json.parse(json);
  }

  toUU5Json() {
    return this._uu5json;
  }

  toJson() {
    return this._uu5json;
  }

  toObject() {
    return this._object;
  }

  clone() {
    return new UU5Json(this._uu5json);
  }
}

export default UU5Json;
