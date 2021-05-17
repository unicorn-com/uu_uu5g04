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
 *
 */

/* eslint-disable uu5/import-order */

import React from "react";
import "react-dom"; // optimization for better boot speed (otherwise loader would wait until "hidden" uu5g05 gets loaded and only then it would start downloading react-dom)
import "prop-types"; // optimization for better boot speed (otherwise loader would wait until "hidden" uu5g05 gets loaded and only then it would start downloading prop-types)

import "./environment/environment-startup.js";
import "./common/common-startup.js";

// run also all uu5g05-integration JS files that modify behaviour of uu5g05
import "./uu5g05-integration/nesting-level.js";
import "./uu5g05-integration/use-dynamic-library-component.js";
import "./uu5g05-integration/use-language.js";
import "./uu5g05-integration/use-level.js";

import Environment from "./environment/environment.js";

if (process.env.NODE_ENV !== "test") console.log(Environment.licence);

if (!React.lazy || !React.Suspense) {
  console.warn(
    `For full functionality of ${process.env.NAME} use React version >= 16.6.0. In-page React version: ${React.version}`
  );
}
