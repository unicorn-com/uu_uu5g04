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

import Tools from "../tools.js";
import UU5StringTools from "./tools.js";
import UU5StringProps from "./uu5-string-props.js";
import Environment from "../../environment/environment.js";

export const UU5StringObject = class UU5StringObject {
  /* constructor */
  constructor(tag, propsString, children, isPairedTag = true, initFn = null, parent = null) {

    /* public methods */

    /*
    Returns UU5StringObject as a string

    @param data - object with data for templates
    @param filterFn({tag, props}) - returns changed tag and props, if it returns false skip print of this component and its children - this method cannot change data of this component only change them for print
    @returns UU5StringObject as a string
    */
    this.toString = (data, filterFn) => {
      if (this.tag === "uu5string.pre") {
        return `<uu5string.pre>${this.children.join("")}</uu5string.pre>`;
      }
      let children = this.children;
      let tag = this.tag;
      let result;
      if (filterFn) {
        let obj = { tag: this.tag, props: this.props.toObject() };
        obj.props.children = this.children.slice();
        // filter result by obj
        let _result = this._filterProps(obj, filterFn);
        // check if filter returns false => do not render component
        if (_result === false) {
          return "";
        }
        let { resultTag, resultProps } = _result;
        tag = resultTag;
        // remove children from props
        resultProps = resultProps.filter(item => {
          if (item.name === "children"){
            children = item.value;
            return false;
          }
          return true;
        });
        let propsArray = this.props.props;
        this.props.props = resultProps;
        // print filtered props
        result = `<${tag}${this.props.toString(data, filterFn)}`;
        // return original props
        this.props.props = propsArray;
      } else {
        result = `<${tag}${this.props.toString(data)}`;
      }
      // render children - children from props content was rendered with props
      if (this._isPairTag()) {
        result += `>${UU5StringTools.contentToString(children, data, filterFn)}</${tag}>`;
      } else {
        result += "/>";
      }
      return result;
    };

    /*
    Returns UU5StringObject as a hierarchy of react component

    @param data - object with data for templates
    @param filterFn({tag, props}) - returns changed tag and props, if it returns false skip print of this component and its children - this method cannot change data of this component only change them for print
    @returns UU5StringObject as a React component
    */
    this.toChildren = (data, filterFn) => {
      if (this.tag === "uu5string.pre") {
        return this.children.map(it => {
          if (typeof it === "string") return Environment.textEntityMap.replaceHtmlEntity(it);
          return it;
        });
      }
      let result;
      let children = this.children;
      if (filterFn) {
        // create shallow copy of component
        let obj = { tag: this.tag, props: this.props.toObject() };
        obj.props.children = this.children.slice();
        // filter result by obj
        let _result = this._filterProps(obj, filterFn);
        // check if filter returns false => do not render component
        if (_result === false) {
          return null;
        }
        let { resultTag, resultProps } = _result;
        // remove children from props
        resultProps = resultProps.filter(item => {
          if (item.name === "children"){
            children = item.value;
            return false;
          }
          return true;
        });
        let propsArray = this.props.props;
        this.props.props = resultProps;
        // process filtered props
        result = { tag: resultTag, props: this.props.toChildren(data, filterFn) };
        // return original props
        this.props.props = propsArray;
      } else {
        result = { tag: this.tag, props: this.props.toChildren(data) }
      }
      return Tools.findComponent(result.tag, result.props, UU5StringTools.contentToChildren(children, data, filterFn));
    };

    /*
    Deep clone of this component.

    @returns new instance of UU5StringObject
    */
    this.clone = (initFn = this.initFn) => {
      // filter props by filter function
      let result = { tag: this.tag, props: this.props.clone(initFn) };
      // clone children at first
      result.children = this.children.map((item) => typeof item === "string" ? item : item.clone(initFn));
      // create new object - props are already cloned so do not send them into constructor
      let newUu5stringObject = new UU5StringObject(result.tag, null, result.children, this._isPairTag(), initFn);
      newUu5stringObject.props = result.props;
      return newUu5stringObject;
    };

    /*
    Returns index of this component in the parent. If component does not have parent returns -1.

    @returns number
    */
    this.getIndex = () => {
      return this.parent ? this.parent.children.indexOf(this) : -1;
    };

    /* private methods */
    this._initContent = () => {
      // set parent to children
      if (this.children && Array.isArray(this.children)) {
        this.children.forEach(item => {
          if (item && typeof item === "object") item.parent = this;
        });
      }
      if (this.props && this.props.props) {
        let content = this.props.props.find((item) => item.name === "content");
        if (content && Array.isArray(content.value)) {
          content.value.forEach(item => {
            if (item && typeof item === "object") item.parent = this;
          });
        }
      }
    };

    this._filterProps = (propsObj, filterFn) => {
      let filterObj = filterFn(propsObj);
      if (filterObj === false) return false;
      if (filterObj) {
        propsObj = filterObj;
      }
      // some props values may be false or undefined - for filtering we need to have some value evaluated as a true
      let filteredProps = {};
      for (let propName in propsObj.props) {
        filteredProps[propName] = true;
      }
      // filter result by obj
      let propsArray = this.props.props.filter((prop) => filteredProps[prop.name]);
      // update values
      for (let propName in propsObj.props) {
        let prop = propsArray.find((item) => item.name === propName);
        if (prop) {
          // update value
          prop.value = propsObj.props[propName];
        } else {
          // add new props
          propsArray.push({
            name: propName,
            value: propsObj.props[propName]
          });
        }
      }

      return {resultTag: propsObj.tag, resultProps: propsArray};
    };

    this._isPairTag = () => {
      let isPairTag = this.children.length > 0 || this._pairTag;
      this._pairTag = isPairTag;
      return this._pairTag;
    };

    // constructor logic
    this.tag = tag;
    this.props = new UU5StringProps(propsString, (...args) => UU5StringObject.create(...args, initFn));
    this.parent = parent;
    this.children = (typeof children === "string" ? [children] : children) || [];
    this.initFn = initFn;
    this._pairTag = isPairedTag;
    this._initContent();

    // use filter function to let user update component tag and props
    if (typeof initFn === "function") {
      initFn(this);
    }
  }

  /* static methods */
  static create(tag, propsString, children, isPairedTag, initFn, parent) {
    if (!tag) return children;
    return new UU5StringObject(tag, propsString, children, isPairedTag, initFn, parent);
  }
};

export default UU5StringObject;
