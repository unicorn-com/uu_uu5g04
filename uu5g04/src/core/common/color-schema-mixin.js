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

import React from "react";
import Environment from "../environment/environment.js";

// FIXME MODULES Commented out due to dependencies "common => forms".
import "./color-schema.less";
// import './color-schema/default.less';
// import './color-schema/yellow.less';
// import './color-schema/yellow-rich.less';
// import './color-schema/orange.less';
// import './color-schema/orange-rich.less';
// import './color-schema/pink.less';
// import './color-schema/pink-rich.less';
// import './color-schema/red.less';
// import './color-schema/red-rich.less';
// import './color-schema/purple.less';
// import './color-schema/purple-rich.less';
// import './color-schema/cyan.less';
// import './color-schema/cyan-rich.less';
// import './color-schema/blue.less';
// import './color-schema/blue-rich.less';
// import './color-schema/green.less';
// import './color-schema/green-rich.less';
// import './color-schema/brown.less';
// import './color-schema/brown-rich.less';
// import './color-schema/grey.less';
// import './color-schema/grey-rich.less';

export const ColorSchemaMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.ColorSchemaMixin": {
      classNames: {
        main: "getMainClassUU5CommonColorSchemaMixin"
      },
      defaults: {
        mainClassPrefix: "color-schema-"
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    // must be function because of dynamic adding color into colorSchema
    colorSchema: function(props, propName, componentName) {
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
    }
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      colorSchema: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    this.registerMixin("UU5.Common.ColorSchemaMixin");

    // in state, so every component can change color dynamically
    return {};
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonColorSchemaMixin: function() {
    return this.hasMixin("UU5.Common.ColorSchemaMixin");
  },

  getColorSchema() {
    let colorSchema = this.props.colorSchema || (this.getDefault() ? this.getDefault().colorSchema : null);
    return Environment.getColorSchema(colorSchema);
  },

  getUU5CommonColorSchemaMixinProps: function() {
    return {
      colorSchema: this.props.colorSchema
    };
  },

  getUU5CommonColorSchemaMixinPropsToPass: function() {
    return {};
  },

  getMainClassUU5CommonColorSchemaMixin: function() {
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
  }
  //@@viewOff:private
};

export default ColorSchemaMixin;
