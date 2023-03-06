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

const TIMEOUT = 60 * 1000; // one minute
const BASE_URI_COOKIE_NAME = "uu.app.cbu";
const PRODUCT_AWID_REGEXP = /^https?:\/\/[^/]+\/([^/]+)\/([^/?#;]+)/;

export function Statistics(cmd, isStatistics) {
  let baseUriCookie = document.cookie
    .split(";")
    .map((it) => it.trim())
    .find((v) => v.startsWith(BASE_URI_COOKIE_NAME + "="));
  let href =
    (baseUriCookie
      ? baseUriCookie
          .slice(BASE_URI_COOKIE_NAME.length + 1)
          .split(",")[0]
          .trim()
      : null) || location.href;
  if (href === "about:srcdoc") href = parent.location.href;
  let match = href.match(PRODUCT_AWID_REGEXP);
  let uuProduct = match ? match[1] : null;
  let uuAwid = match ? match[2].split("-").pop() : null;
  if (uuProduct === "ues" && uuAwid === "sesm") {
    uuAwid = "00000000000000000000000000000000";
  } else {
    if (uuAwid && !uuAwid.match(/^[0-9a-f]{32}$/i)) uuAwid = null;
  }
  let processedLibraries = new Set();
  let prevLibraries = [];

  const logLibraries = () => {
    if (window.UU5.Environment.isStatistics() && uuProduct && uuAwid) {
      let curLibraries = Utils.LibraryRegistry.listLibraries();
      if (curLibraries.length > prevLibraries.length) {
        let origPrevLibraries = prevLibraries;
        let uuLibraryList = [...new Set(curLibraries.map((it) => it.name).filter((it) => !processedLibraries.has(it)))];
        for (let name of uuLibraryList) processedLibraries.add(name);
        prevLibraries = curLibraries;
        if (uuLibraryList.length > 0) {
          let request = new XMLHttpRequest();
          request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status !== 200 && request.status !== 203) {
              prevLibraries = origPrevLibraries;
              for (let name of uuLibraryList) processedLibraries.delete(name);
            }
          };
          request.open("POST", cmd, true);
          request.setRequestHeader("Content-Type", "application/json");
          request.send(JSON.stringify({ product: uuProduct, subAppAwid: uuAwid, libraryList: uuLibraryList }));
        }
      }
    }
  };

  function getLibraries() {
    let map = {};
    for (let item of Utils.LibraryRegistry.listLibraries()) {
      map[item.name] = item;
    }
    return map;
  }

  if (process.env.NODE_ENV === "production" && location.hostname !== "localhost") {
    setInterval(logLibraries, TIMEOUT);

    window.addEventListener("beforeunload", function () {
      logLibraries();
    });
  }

  return {
    getLibraries,
  };
}

export default Statistics;
