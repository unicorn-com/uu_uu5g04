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

import React from "react";
import Environment from "../environment/environment.js";

export const ColorSchemaMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.ColorSchemaMixin": {
      classNames: {
        main: "getMainClassUU5CommonColorSchemaMixin",
      },
      defaults: {
        mainClassPrefix: "color-schema-",
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    // must be function because of dynamic adding color into colorSchema
    colorSchema: function (props, propName, componentName) {
      if (props[propName] && !Environment.colorSchemaMap[props[propName]]) {
        return new Error(
          "Invalid prop `" +
            propName +
            "` with value `" +
            props[propName] +
            "` supplied to" +
            " `" +
            componentName +
            "`. Validation failed."
        );
      }
    },
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      colorSchema: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function () {
    this.registerMixin("UU5.Common.ColorSchemaMixin");

    // in state, so every component can change color dynamically
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonColorSchemaMixin: function () {
    return this.hasMixin("UU5.Common.ColorSchemaMixin");
  },

  getColorSchema() {
    let colorSchema = this.props.colorSchema || (this.getDefault() ? this.getDefault().colorSchema : null);
    return Environment.getColorSchema(colorSchema);
  },

  getUU5CommonColorSchemaMixinProps: function () {
    return {
      colorSchema: this.props.colorSchema,
    };
  },

  getUU5CommonColorSchemaMixinPropsToPass: function () {
    return {};
  },

  getMainClassUU5CommonColorSchemaMixin: function () {
    let colorSchema = this.getColorSchema();
    let result = "";
    if (colorSchema) {
      result = this.getDefault("mainClassPrefix", "UU5.Common.ColorSchemaMixin") + colorSchema;

      if (this.props.colorSchema !== this._getOriginalColorSchema() && this.props.colorSchema) {
        result += " " + this.getDefault("mainClassPrefix", "UU5.Common.ColorSchemaMixin") + this.props.colorSchema;
      }
    }

    return result;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getOriginalColorSchema() {
    let color = null;
    let colorSchema = this.props.colorSchema || (this.getDefault() ? this.getDefault().colorSchema : null);
    const colorSchemaObj = Environment.colorSchemaMap[colorSchema];
    if (colorSchemaObj) {
      color = colorSchemaObj.originalColor || colorSchemaObj.color || null;
    }
    return color;
  },
  //@@viewOff:private
};

export default ColorSchemaMixin;
