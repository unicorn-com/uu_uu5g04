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

import { Utils } from "uu5g05";

const { Css: g05Css } = Utils;

const Css = {
  ...g05Css.createCssModule("uu"),
  ...g05Css,
  createCssModule(key, owner = null) {
    this[key] = g05Css.createCssModule(key, owner);
    return this[key];
  },
};

export { Css };
export default Css;
