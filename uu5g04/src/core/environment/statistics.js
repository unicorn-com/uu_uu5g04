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

const CMD = "product/logLibraries";
const TIMEOUT = 60 * 1000; // one minute
const BASE_URI_COOKIE_NAME = "uu.app.cbu";
const PRODUCT_AWID_REGEXP = /^https?:\/\/[^/]+\/([^/]+)\/([^/?#;]+)/;

export function Statistics(url, isStatistics) {
  const cmd = url + CMD;
  let baseUriCookie = document.cookie
    .split(";")
    .map((it) => it.trim())
    .find((v) => v.startsWith(BASE_URI_COOKIE_NAME + "="));
  let href =
    (baseUriCookie
      ? baseUriCookie
          .substr(BASE_URI_COOKIE_NAME.length + 1)
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
  let runtimeLibraryMap = {};
  let librarySet = new Set();

  const logLibraries = () => {
    if (librarySet.size && window.UU5.Environment.isStatistics()) {
      const uuLibraryList = [...librarySet];
      librarySet = new Set();

      if (uuProduct && uuAwid) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
          if (request.readyState === XMLHttpRequest.DONE && request.status !== 200 && request.status !== 203) {
            uuLibraryList.forEach((lib) => librarySet.add(lib));
          }
        };
        request.open("POST", cmd, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify({ product: uuProduct, subAppAwid: uuAwid, libraryList: uuLibraryList }));
      }
    }
  };

  function addLibrary(library) {
    runtimeLibraryMap[library.name] = library;
    if (
      isStatistics() &&
      (!window.UU5 ||
        !window.UU5.Environment ||
        !window.UU5.Environment.isStatistics ||
        window.UU5.Environment.isStatistics())
    ) {
      librarySet.add(library.name);
    }
  }

  function getLibraries() {
    return runtimeLibraryMap;
  }

  if (process.env.NODE_ENV === "production" && location.hostname !== "localhost") {
    setInterval(logLibraries, TIMEOUT);

    window.addEventListener("beforeunload", function () {
      logLibraries();
    });
  }

  return {
    addLibrary,
    getLibraries,
  };
}

export default Statistics;
