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

export class DocumentManager {
  static addCss(cssUrl) {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = cssUrl;
    document.head.appendChild(link);
  }

  static isCssAdded(path) {
    let ss = document.styleSheets;
    for (let i = 0; i < ss.length; i++) {
      if (ss[i].href === path) {
        return true;
      }
    }
    return false;
  }

  static addUniqueCss(cssUrl) {
    if (!this.isCssAdded(cssUrl)) {
      this.addCss(cssUrl);
      return true;
    }
    return false;
  }
}

export default DocumentManager;
