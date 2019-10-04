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

import mod from "module";
import regeneratorRuntime from "regenerator-runtime/runtime"; // support for async/await (if changed, search other appearances in the whole project!)

if (typeof global !== "undefined") global.regeneratorRuntime = regeneratorRuntime;
else if (typeof window !== "undefined") window.regeneratorRuntime = regeneratorRuntime;

// we'll load all polyfills but only in case of IE - we want to polyfill basic stuff
// like Array.find, ... so it's not needed for other browsers
if (navigator.userAgent.match(/trident/i)) {
  let uri = (
    (mod
      ? mod.uri
      : (document.currentScript || Array.prototype.slice.call(document.getElementsByTagName("script"), -1)[0] || {})
          .src) || ""
  ).toString();
  let uu5BaseUrl = uri ? uri.replace(/^(.*\/).*/, "$1") : "./";
  let url = uu5BaseUrl + (process.env.NODE_ENV === "production" ? "uu5g04-polyfills.min.js" : "uu5g04-polyfills.js");
  let xhr = new XMLHttpRequest();
  xhr.onload = function() {
    // eval in global scope
    if (this.status === 200) (0, eval)(this.responseText);
    else console.error("Polyfills failed to load from " + url);
  };
  xhr.open("GET", url, false);
  xhr.send();
}
