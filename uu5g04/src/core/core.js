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

import "./polyfills.js";
import regeneratorRuntime from "regenerator-runtime/runtime"; // support for async/await
import React from "react";

// startup environment (merge)
import "./startup-environment.js";

if (typeof global !== "undefined") global.regeneratorRuntime = regeneratorRuntime;
else if (typeof window !== "undefined") window.regeneratorRuntime = regeneratorRuntime;

if (!React.lazy || !React.Suspense) {
  console.warn(
    `For full functionality of ${process.env.NAME} use React version >= 16.6.0. In-page React version: ${React.version}`
  );
}

const UU5 = window.UU5 || {};

import Environment from './environment/environment.js';

let environment = Environment;

import * as Common from './common/common.js';

export {Common};
UU5.Common = Common;

import EventListener from './common/event-listener.js';

environment.EventListener = new EventListener();

import CommonLsi from './common/common-lsi.js';

environment.Lsi.Common = CommonLsi;

export {environment as Environment};
UU5.Environment = environment;

import * as Icons from './environment/icons.js';

export {Icons};
UU5.Icons = Icons;

import * as PropTypes from './prop-types/prop-types.js';
export { PropTypes };
UU5.PropTypes = PropTypes;

import * as Utils from './utils/utils.js';
export { Utils };
UU5.Utils = Utils;

// workaround so that on-demand loaded UU5 modules can insert their own components
// into UU5 exports; i.e. if an application uses following:
//  import * as UU5 from "uu5g04";  // UU5 is a local variable containing new (separate) instance of exports
//  import "uu5g04-forms";
// then uu5g04-forms (UU5 module) wants to add "Forms" key into "root" of uu5g04 exports which
// isn't possible (exports are frozen by SystemJS), so instead uu5g04-forms will inject its components into
// pre-existing "Forms" key within uu5g04 exports
const Bricks = UU5.Bricks = {};
export {Bricks};

const BricksEditable = UU5.BricksEditable = {};
export {BricksEditable};

const Forms = UU5.Forms = {};
export {Forms};

const CodeKit = UU5.CodeKit = {};
export {CodeKit};

const Calendar = UU5.Calendar = {};
export {Calendar};

const Imaging = UU5.Imaging = {};
export {Imaging};

const ParamQuery = UU5.ParamQuery = {};
export {ParamQuery};

const Math = UU5.Math = {};
export {Math};

const Tree = UU5.Tree = {};
export {Tree};

const DataTable = UU5.DataTable = {};
export {DataTable};

const Chart = UU5.Chart = {};
export {Chart};

const SimpleChart = UU5.SimpleChart = {};
export {SimpleChart};

const LibraryRegistry = UU5.LibraryRegistry = {};
export {LibraryRegistry};

const ComponentCatalogue = UU5.ComponentCatalogue = {};
export {ComponentCatalogue};

const Tiles = UU5.Tiles = {};
export {Tiles};

const RichText = UU5.RichText = {};
export {RichText};

const BlockLayout = UU5.BlockLayout = {};
export {BlockLayout};

window.UU5 = UU5;
export default UU5;
