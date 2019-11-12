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

import browserUpdate from "browser-update";

function doCheck() {
  let envConfig;
  if (window.UU5 && window.UU5.Environment) envConfig = window.UU5.Environment.browserUpdate;

  // https://github.com/browser-update/browser-update/wiki/Details-on-configuration
  let opts = {
    required: {
      // defaults: "{"i":11,"e":-3,"c":-3,"f":-3,"o":-3,"o_a":-3,"s":-1,"a":535,"y":18.4,"v":1.12,"uc":12.1,"ios":9,"samsung":6.1}"
      i: 12, // IE (always show warning)
      e: -1, // Edge, latest 2 versions
      c: -1, // Chrome
      f: -1, // Firefox
      o: -1, // Opera
      o_a: -1, // Opera on Android
      s: -1 // Safari
      // y: 100000, // Yandex Browser
      // v: 100000, // Vivaldi
      // uc: 100000, // UC Browser
      // ios: -1, // iOS Browser; falls back to "s"
      // samsung: 100000 // Samsung Internet (Android)
    }
    // style: "top", // "top","bottom","corner"
    // reminder: 24, // reappear after how many hours (applies if the user refreshes page without closing the message)
    // reminderClosed: 24*7, // if the user explicitly closes message it reappears after x hours

    // text_cs: (default) "Váš webový prohlížeč (Internet Explorer 10) je zastaralý . Pro větší bezpečnost, pohodlí a optimální zobrazení této stránky si prosím svůj prohlížeč aktualizujte. Aktualizovat prohlížeč Ignorovat"
  };

  // finalize opts
  let usedOpts = { ...opts, ...envConfig };
  if (!usedOpts.container) {
    // use custom element, otherwise it would insert as first-child which collides with Plus4U5 styling
    let container = document.createElement("div");
    container.className = "uu5-common-browser-update-container";
    document.body.appendChild(container);
    usedOpts.container = container;
  }

  // debug
  // if (true) {
  //   usedOpts.required = { i: 1e5, e: 1e5, c: 1e5, f: 1e5, o: 1e5, o_a: 1e5, s: 1e5 };
  //   usedOpts.reminder = 0;
  //   usedOpts.reminderClosed = 0;
  //   // usedOpts.test = true; // show debug info
  // }

  // detect
  browserUpdate(usedOpts);
}

// postpone execution until document.body becomes available
try {
  document.addEventListener("DOMContentLoaded", doCheck, false);
} catch (e) {
  window.attachEvent("onload", doCheck);
}
