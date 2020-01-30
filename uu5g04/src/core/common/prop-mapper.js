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

//@@viewOn:imports
import React from "react";
import PropTypes from "prop-types";
import BaseMixin from "./base-mixin.js";
import ns from "./common-ns.js";
import Component from "./component.js";
//@@viewOff:imports

export const PropMapper = Component.create({
  displayName: "PropMapper", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("PropMapper"),
    classNames: {
      main: ns.css("prop-mapper")
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: PropTypes.object,
    mapping: PropTypes.object
  },
  //@@viewOn:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      data: undefined,
      mapping: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getProps() {
    let props = {};

    if (this.props.data && this.props.mapping) {
      for (let key in this.props.mapping) {
        let calculated = this.props.data;
        let sArray = key.split(".");

        while (calculated && sArray.length > 0) {
          calculated = calculated[sArray.shift()];
        }

        if (calculated !== undefined) {
          let propKey = this.props.mapping[key];
          if (Array.isArray(propKey)) {
            propKey.forEach(propName => {
              props[propName] = calculated;
            });
          } else {
            props[this.props.mapping[key]] = calculated;
          }
        }
      }
    } else {
      props = this.props.data;
    }

    return props;
  },

  _renderChildren() {
    return React.Children.map(this.props.children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, this._getProps());
      } else {
        return child;
      }
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return this._renderChildren();
  }
  //@@viewOff:render
});

export default PropMapper;
