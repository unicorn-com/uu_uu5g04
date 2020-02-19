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

import * as UU5 from "uu5g04";

export * from "./mixins/choice-mixin.js";
export * from "./mixins/form-mixin.js";
export * from "./mixins/controls-mixin.js";
export * from "./mixins/group-mixin.js";
export * from "./mixins/input-mixin.js";
export * from "./mixins/text-input-mixin.js";

export * from "./text.js";
export * from "./text-area.js";
export * from "./text-button.js";
export * from "./text-icon.js";
export * from "./date-picker.js";
export * from "./date-time-picker.js";
export * from "./date-range-picker.js";
export * from "./date-time-range-picker.js";
export * from "./time.js";
export * from "./time-picker.js";
export * from "./file.js";
export * from "./number.js";
export * from "./checkbox.js";
export * from "./checkboxes.js";
export * from "./radios.js";
export * from "./select.js";
export * from "./tag-select.js";
export * from "./slider.js";
export * from "./switch-selector.js";
export * from "./form.js";
export * from "./props-form.js";
export * from "./icon-picker.js";
export * from "./tri-state-checkbox.js";
export * from "./color-picker.js";

//context forms
export * from "./context-forms/context-controls.js";
export * from "./context-forms/context-form.js";
export * from "./context-forms/context-header.js";
export * from "./context-forms/context-modal.js";
export * from "./context-forms/context-section.js";

import { ContextFormConsumer } from "./context-forms/context.js";
export { ContextFormConsumer };

import Context from "./form-context.js";
export { Context };

import Controls from "./controls.js";
export { Controls };

const FormControls = () => {
  UU5.Common.Tools.warning("UU5.Forms.FormControls is deprecated! Use UU5.Forms.Controls instead.");
  return <Controls {...this.props} />;
};
export { FormControls };

UU5.Environment.addRuntimeLibrary({ name: `${UU5.Environment.name}-forms`, version: UU5.Environment.version });
export const bookKitUrl =
  "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page";

import "./color-schema/default.less";
