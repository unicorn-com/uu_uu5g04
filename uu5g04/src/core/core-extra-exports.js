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

import * as Common from "./common/common.js";
import * as Icons from "./environment/icons.js";
import * as Utils from "./utils/utils.js";
import VisualComponent from "./common/visual-component.js";
import Component from "./common/component.js";

export { Common, Icons, Utils };

export const createVisualComponent = VisualComponent.create;
export const createComponent = Component.create;
export const createHoc = Component.createHoc;

// workaround so that on-demand loaded UU5 modules can insert their own components
// into UU5 exports; i.e. if an application uses following:
//  import * as UU5 from "uu5g04";  // UU5 is a local variable containing new (separate) instance of exports
//  import "uu5g04-forms";
// then uu5g04-forms (UU5 module) wants to add "Forms" key into "root" of uu5g04 exports which
// isn't possible (exports are frozen by SystemJS), so instead uu5g04-forms will inject its components into
// pre-existing "Forms" key within uu5g04 exports
export const Animation = {};
export const Bricks = {};
export const BricksEditable = {};
export const Forms = {};
export const CodeKit = {};
export const Calendar = {};
export const Imaging = {};
export const ParamQuery = {};
export const Math = {};
export const Tree = {};
export const DataTable = {};
export const Chart = {};
export const SimpleChart = {};
export const LibraryRegistry = {};
export const ComponentCatalogue = {};
export const Tiles = {};
export const RichText = {};
export const BlockLayout = {};
export const Test = {};
