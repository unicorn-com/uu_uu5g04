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
