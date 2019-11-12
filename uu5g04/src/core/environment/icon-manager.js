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

import DocumentManager from "./document-manager.js";

export class IconManager {
  constructor(iconLibraries) {
    this.iconLibraries = iconLibraries;
  }

  addIcons(iconsName) {
    let iconsUrl = this.iconLibraries[iconsName];
    this.loadedIcons = this.loadedIcons || {};

    if (iconsUrl && !this.loadedIcons[iconsName]) {
      this.loadedIcons[iconsName] = true;
      DocumentManager.addUniqueCss(iconsUrl);
    }
  }
}

export default IconManager;
