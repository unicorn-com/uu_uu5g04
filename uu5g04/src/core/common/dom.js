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

import { Utils } from "uu5g05";

// TODO Remove Utils.DOM after uu5g05 >= 0.15.0 release.
const g05DOM = Utils.Dom || Utils.DOM;

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
