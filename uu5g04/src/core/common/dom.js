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

const g05DOM = Utils.DOM;

export class DOM {
  static render(...args) {
    return g05DOM.render(...args); // eslint-disable-line react/no-render-return-value
  }
  static findNode(...args) {
    return g05DOM.findNode(...args); // eslint-disable-line react/no-find-dom-node
  }
  static hydrate(...args) {
    return g05DOM.hydrate(...args);
  }
  static unmount(...args) {
    return g05DOM.unmount(...args);
  }
}
export default DOM;
