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

export class DocumentManager {
  static addCss(cssUrl) {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = cssUrl;
    document.head.appendChild(link);
  }

  static isCssAdded(uri) {
    let absoluteUri = _toAbsoluteUri(uri);
    let links = document.querySelectorAll("link");
    for (let i = 0; i < links.length; i++) {
      if (links[i].href === absoluteUri) return true;
    }
    return false;
  }

  static addUniqueCss = Utils.DOM.addCss;
}

function _toAbsoluteUri(uri) {
  let a = document.createElement("a");
  a.href = uri; // browser will do normalization (resolve relative paths, add missing protocol/domain, ...)
  return a.href;
}

export default DocumentManager;
