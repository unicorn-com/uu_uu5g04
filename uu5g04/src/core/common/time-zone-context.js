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

//@@viewOn:revision
//  coded: Martin Mach, 18.09.2020
//  reviewed: Filip Janovský, 07.10.2020 - approved
//@@viewOff:revision

import Environment from "../environment/environment.js";
import Tools from "./tools.js";
import Context from "./context";

function _warnNoOp() {
  if (process.env.NODE_ENV === "development") {
    Tools.warn(
      "Changing timeZone via useTimeZone hook return value is supported only with TimeZoneProvider being in the hierarchy of parent components."
    );
  }
}

export const TimeZoneContext = Context.create({ timeZone: Environment.timeZone, setTimeZone: _warnNoOp });

export default Context;
