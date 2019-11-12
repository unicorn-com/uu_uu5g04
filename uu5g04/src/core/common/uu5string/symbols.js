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

import Tools from "../tools";
import Environment from "../../environment/environment";

const SYMBOLS = {
  now: () => {
    let date = new Date();
    return Tools.toLocaleString(date, Tools.getLanguage());
  },
  userName: () => {
    let session = Environment.getSession();
    return session && session.getIdentity() ? session.getIdentity().name : "";
  },
  userEmail: () => {
    let session = Environment.getSession();
    return session && session.getIdentity() ? session.getIdentity().email : "";
  },
  idHex32: () => Tools.generateUUID(32),
  idHex64: () => Tools.generateUUID(64)
};

export default SYMBOLS;
