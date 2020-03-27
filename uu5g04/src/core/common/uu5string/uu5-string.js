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

import UU5StringTools from "./tools.js";

import UU5StringObject from "./uu5-string-object.js";
import UU5StringProps from "./uu5-string-props.js";

export const UU5String = class UU5String {
  constructor(uu5string, data = {}, initFn = null) {
    this.data = data;
    this.initFn = initFn;

    /*
      Transform content of UU5String into React components. If parameter data is undefined, data passed into constructor will be used instead.

      @param data - map with data for UU5String templates
      @param filterFn({tag, props}) - function to change tag and props used for rendering into components. Function is called for each descendant UU5StringObject before creation of React component. This function cannot change data of UU5StringObjects.
      @returns array of React components
      */
    this.toChildren = (data = this.data, filterFn, preferChildrenAsFunction = false) => {
      return UU5StringTools.contentToChildren(this.content, data, filterFn, preferChildrenAsFunction);
    };

    /*
      Transform content into string. If parameter data is undefined, data passed into constructor will be used instead.

      @param data - map with data for UU5String templates
      @param filterFn({tag, props}) - function to change tag and props used for printing into string. Function is called for each descendant UU5StringObject before print into string. This function cannot change data of UU5StringObjects.
      @returns string
    */
    this.toString = (data = this.data, filterFn) => {
      return UU5StringTools.contentToString(this.content, data, filterFn);
    };

    /*
      Transform content into plain text. Returned string will not contain tags, but only text from their props. If parameter data is undefined, data passed into constructor will be used instead.

      @param data - map with data for UU5String templates
      @param filterFn({tag, props}) - function to change props used for printing into plain text. Function is called for each descendant UU5StringObject before print props into plain text.
      @returns string
    */
    this.toPlainText = (data = this.data, filterFn) => {
      return UU5StringTools.contentToPlainText(this.content, data, filterFn);
    };

    /*
      Returns new instance of UU5String. If parameter data is undefined, data passed into constructor will be used instead.

      @param data - data for UU5StringTemplates
      @returns UU5String instance.
    */
    this.clone = (data = this.data, initFn = this.initFn) => {
      let result = new UU5String(null, data);
      if (!this.content) return result;
      result.content = this.content.map(item => (typeof item === "string" ? item : item.clone(initFn)));
      return result;
    };

    // constructor logic
    this.content = UU5String.parse(uu5string, (...args) => UU5StringObject.create(...args, initFn));
  }

  /* static functions */
  static parse(uu5string, buildItem = UU5StringObject.create) {
    return UU5StringTools.parseUu5String(uu5string, buildItem);
  }

  static isValid(uu5string) {
    return UU5StringTools.isValidUU5String(uu5string);
  }

  static toChildren(uu5string, data, filterFn, preferChildrenAsFunction = false) {
    return new UU5String(uu5string).toChildren(data, filterFn, preferChildrenAsFunction);
  }

  static toString(uu5string, data, filterFn) {
    return new UU5String(uu5string).toString(data, filterFn);
  }

  static toPlainText(uu5string, data, filterFn) {
    return new UU5String(uu5string).toPlainText(data, filterFn);
  }

  static contentToChildren(content, data, filterFn, preferChildrenAsFunction = false) {
    return UU5StringTools.contentToChildren(content, data, filterFn, preferChildrenAsFunction);
  }

  static contentToString(content, data, filterFn) {
    return UU5StringTools.contentToString(content, data, filterFn);
  }

  static contentToPlainText(content, data, filterFn) {
    return UU5StringTools.contentToPlainText(content, data, filterFn);
  }
};

UU5String.Props = UU5StringProps;
UU5String.Object = UU5StringObject;

export default UU5String;
