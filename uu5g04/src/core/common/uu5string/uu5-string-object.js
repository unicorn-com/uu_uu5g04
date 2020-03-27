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
import UU5StringTools, { defaultPlainTextFilterFn } from "./tools.js";
import UU5StringProps from "./uu5-string-props.js";
import Environment from "../../environment/environment.js";

export const UU5StringObject = class UU5StringObject {
  /* constructor */
  constructor(tag, propsString, children = [], isPairedTag = true, initFn = null, parent = null) {
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
      // let children = this.children;
      let children = [...this.children];
      let propsChildren = [];
      let filteredProps = [];

      for (let pi = 0; pi < this.props.props.length; pi++) {
        let prop = this.props.props[pi];
        if (prop.childrenProperty) {
          propsChildren.push(prop);
        } else {
          filteredProps.push(prop);
        }
      }

      // sort props children by index from lowest
      propsChildren.sort((child1, child2) => child2.index - child1.index);

      for (let pi = 0; pi < propsChildren.length; pi++) {
        let prop = propsChildren[pi];
        let uu5stringObject = new UU5StringObject();
        uu5stringObject.tag = prop.valueType === "string" ? "uu5string" : prop.valueType;
        uu5stringObject.children =
          prop.valueType === "uu5json"
            ? [UU5StringTools.printTemplateToString(JSON.stringify(prop.value, undefined, 2), data)]
            : UU5StringTools.contentToString(prop.value, data, filterFn);
        uu5stringObject.props.props.push({ name: "propName", value: prop.name, type: "string" });

        // add item back into its original place - if index is larger then count of children, then we push it at the end of array
        if (prop.index < children.length) {
          //insert back formating spaces
          if (prop.spacesBefore) {
            children.splice(prop.index, 0, prop.spacesBefore, uu5stringObject);
          } else {
            children.splice(prop.index, 0, uu5stringObject);
          }
        } else {
          //insert back formating spaces
          if (prop.spacesBefore) {
            children.push(prop.spacesBefore);
          }
          children.push(uu5stringObject);
        }
      }

      // use filteredProps for rest of the algorithm and then return back original props
      let originalProps = this.props.props;
      this.props.props = filteredProps;

      let tag = this.tag;
      let result;
      if (filterFn) {
        let obj = { tag: this.tag, props: this.props.toObject() };
        obj.props.children = children.slice();
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
          if (item.name === "children") {
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

      // return original props
      this.props.props = originalProps;

      return result;
    };

    /*
    Returns UU5StringObject as a plain text

    @param data - object with data for templates
    @param filterFn({tag, props}) - returns changed tag and props, if it returns false skip print of this component and its children - this method cannot change data of this component only change them for print
    @returns UU5StringObject as a string
    */
    this.toPlainText = (data, filterFn) => {
      if (this.tag === "uu5string.pre") {
        return `${this.children.join("")}`;
      }
      let children = this.children;

      // there is no need to special handling of props parsed from children

      let propsArray = [...this.props.props];
      let originalProps = this.props.props;

      // add children into props
      if (children) {
        propsArray.push({
          name: "children",
          value: children.slice(),
          valueType: "uu5string"
        });
      }
      let result;

      // update filter function - use default if is not set other wise add default filter function as an another parameter into filterFn
      let modifiedFilterFn = defaultPlainTextFilterFn;
      if (filterFn) {
        modifiedFilterFn = (...params) => filterFn(...params, defaultPlainTextFilterFn);
      }

      // handle props with children
      this.props.props = propsArray;

      let obj = { tag: this.tag, props: this.props.toObject() };
      // filter result by obj
      let _result = this._filterProps(obj, modifiedFilterFn, true);
      // check if filter returns false => do not render component
      if (_result === false) {
        return "";
      }

      this.props.props = _result.resultProps;
      // print filtered props
      result = `${this.props.toPlainText(data, filterFn)}`;
      // return original props
      this.props.props = originalProps;

      return result;
    };

    /*
    Returns UU5StringObject as a hierarchy of react component

    @param data - object with data for templates
    @param filterFn({tag, props}) - returns changed tag and props, if it returns false skip print of this component and its children - this method cannot change data of this component only change them for print
    @returns UU5StringObject as a React component
    */
    this.toChildren = (data, filterFn, preferChildrenAsFunction) => {
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
          if (item.name === "children") {
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
        result = { tag: this.tag, props: this.props.toChildren(data) };
      }

      let returnValue;
      let usedChildren = UU5StringTools.contentToChildren(children, data, filterFn, preferChildrenAsFunction);
      if (preferChildrenAsFunction) {
        returnValue = extraProps =>
          Tools.findComponent(result.tag, extraProps ? { ...extraProps, ...result.props } : result.props, usedChildren);
      } else {
        returnValue = Tools.findComponent(result.tag, result.props, usedChildren);
      }
      return returnValue;
    };

    /*
    Deep clone of this component.

    @returns new instance of UU5StringObject
    */
    this.clone = (initFn = this.initFn) => {
      // filter props by filter function
      let result = { tag: this.tag, props: this.props.clone(initFn) };
      // clone children at first
      result.children = this.children.map(item => (typeof item === "string" ? item : item.clone(initFn)));
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
        let content = this.props.props.find(item => item.name === "content");
        if (content && Array.isArray(content.value)) {
          content.value.forEach(item => {
            if (item && typeof item === "object") item.parent = this;
          });
        }
      }
    };

    this._filterProps = (propsObj, filterFn, preserveObjectOrder) => {
      let filterObj = filterFn(propsObj);
      if (filterObj === false) return false;
      if (filterObj) {
        propsObj = filterObj;
      }
      // some props values may be false or undefined - for filtering we need to have some value evaluated as a true
      let filteredProps = {};
      let counter = 1;
      for (let propName in propsObj.props) {
        filteredProps[propName] = counter++;
      }
      // filter result by obj
      let propsArray = this.props.props.filter(prop => filteredProps[prop.name]);

      if (preserveObjectOrder) {
        propsArray.sort((prop1, prop2) => filteredProps[prop1.name] - filteredProps[prop2.name]);
      }
      // update values
      for (let propName in propsObj.props) {
        let prop = propsArray.find(item => item.name === propName);
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

      return { resultTag: propsObj.tag, resultProps: propsArray };
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
    // filter props set inside children from children and add them into children
    let childProps = {};
    this.children = [];
    if (typeof children === "string") {
      this.children.push(children);
    } else {
      children.forEach((child, index) => {
        if (child.tag === "uu5string" || child.tag === "uu5json") {
          // find property propName
          let propName = child.props.props.find(prop => prop.name === "propName");
          if (propName) {
            childProps[propName.value] = { child, index: index };
            if (index > 0 && typeof children[index - 1] === "string" && children[index - 1].match(/^\s+$/)) {
              // remove spaces from array oof children
              childProps[propName.value].spacesBefore = this.children.pop();
              // lower index of component
              childProps[propName.value].index--;
            }
            if (child.tag === "uu5json") {
              child.children = JSON.parse(child.children);
            } else if (child.children.length === 1 && typeof child.children[0] === "string") {
              child.children = child.children[0];
              child.tag = "string";
            }
          } else {
            this.children.push(child);
          }
        } else {
          this.children.push(child);
        }
      });
    }

    // iterate over all props and update already existing props by the ones from children
    for (let pi = 0; pi < this.props.props.length; pi++) {
      let prop = this.props.props[pi];
      if (childProps[prop.name] !== undefined) {
        prop.value = childProps[prop.name].child.children;
        prop.type = childProps[prop.name].child.tag;
        prop.childrenProperty = true;
        prop.index = childProps[prop.name].index;
        prop.spacesBefore = childProps[prop.name].spacesBefore;
        delete childProps[prop.name];
      }
    }

    // add new props for rest of props children
    for (let propName in childProps) {
      this.props.props.push({
        name: propName,
        value: childProps[propName].child.children,
        valueType: childProps[propName].child.tag,
        childrenProperty: true,
        index: childProps[propName].index,
        spacesBefore: childProps[propName].spacesBefore
      });
    }

    // this.children = (typeof children === "string" ? [children] : children) || [];
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
