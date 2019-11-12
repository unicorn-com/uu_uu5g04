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

import { REGEXP } from "../tools.js";

export const UU5STRING_REGEXP = REGEXP.uu5string;
export const UU5JSON_REGEXP = REGEXP.uu5json;
export const UU5DATA_REGEXP = REGEXP.uu5data;
export const JSCODE_REGEXP = REGEXP.jsCode;

export const COMPONENT_NAME = String.raw`[-\w.]+`;
export const ATTR = String.raw`(\s+)([-\w]+)(?:(\s*=\s*)("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|([^"'>\s/][^>\s/]*)))?`; // groups: attr separator, attr name, value separator, attr value, indication whether without quotes
export const TAG = String.raw`<(${COMPONENT_NAME})((?:${ATTR})*)\s*(/)?>|</(${COMPONENT_NAME})>`; // groups: comp name, attrs, -, -, -, self-closing, closing tag
export const ATTR_REGEXP = new RegExp(ATTR); // groups: see ATTR
export const ATTR_VALUE_TYPE_REGEXP = new RegExp(
  String.raw`(${REGEXP.uu5json.source})|(${REGEXP.uu5string.source})|(${REGEXP.uu5data.source})|`
); // groups: uu5json, uu5string, uu5data

export const TEMPLATE_REG_EXP = new RegExp(REGEXP.uu5stringTemplate.source, "g");
export const CHECK_IS_TEMPLATE = new RegExp(`^${REGEXP.uu5stringTemplate.source}$`);
