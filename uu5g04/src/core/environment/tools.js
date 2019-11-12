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

import Environment from "./environment.js";

const REGEXP_XY = /[xy]/g;

export const Tools = {
  generateId(length = 32) {
    length = Math.max(length, 8);
    let uuidCore = "x4xxxyxx";
    const additionalCharLength = length - uuidCore.length;
    for (let i = 0; i < additionalCharLength; ++i) {
      if (i % 2 === 0) uuidCore = uuidCore + "x";
      else uuidCore = "x" + uuidCore;
    }

    let timeNum = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      timeNum += performance.now(); //use high-precision timer if available
    }
    return uuidCore.replace(REGEXP_XY, char => {
      let r = (timeNum + Math.random() * 16) % 16 | 0;
      timeNum = Math.floor(timeNum / 16);
      return (char === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
  },

  getLanguage() {
    return Environment.languages[0]
      ? Environment.languages[0].location || Environment.languages[0].language
      : navigator.language;
  }
};

export default Tools;
