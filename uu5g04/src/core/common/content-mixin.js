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
import PropTypes from "prop-types";
import Tools, { REGEXP } from "./tools.js";
import Environment from "../environment/environment.js";
import UU5String from "./uu5string/uu5-string.js";
import { TextCorrectorContextConsumer } from "./text-corrector-context-consumer.js";

const PseudoUU5Component = () => null;
PseudoUU5Component.isUu5PureComponent = true;
PseudoUU5Component.isStateless = true;

function deepFlattenList(list) {
  let result = [];
  for (let value of list) {
    if (Array.isArray(value)) result = result.concat(deepFlattenList(value));
    else result.push(value);
  }
  return result;
}

export const ContentMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.ContentMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      defaults: {
        standardMode: "standard",
        outlineMode: "outline",
        regexpUu5: /^\s*<(uu5json|uu5string|uu5data)\s*\/>/
      },
      errors: {
        unexpectedContentType: 'Type "%s" of content property is unexpected.',
        dynamicOnly: "Method %s can be used just for dynamic content.",
        insertedchildIdNotExists: "Child with ID %s does not exist.",
        childIdNotExists: "Child with ID %s does not exist.",
        indexNotSet: "In this case index has to be specified.",
        addRenderedChildToIdList_IdDuplicity:
          "There is duplicity ID %s in adding rendered child to the list of children by ID.",
        addRenderedChildToNameList_IdDuplicity:
          "There is Name duplicity in adding rendered child to the list children by Name."
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    content: PropTypes.oneOfType([
      // content array:[bodyItem, items, node, number, bool, string]
      PropTypes.array,
      // content bodyItem:{tag:'',props{}}
      PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        props: PropTypes.arrayOf(PropTypes.object)
      }),
      // content items:{tag:'',propsArray:[{},{},{},...]}
      PropTypes.shape({
        tag: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        propsArray: PropTypes.arrayOf(PropTypes.object)
      }),
      // content node
      PropTypes.node,
      // number
      PropTypes.number,
      // bool
      PropTypes.bool
    ]),
    ignoreInnerHTML: PropTypes.bool,
    checkSpaces: PropTypes.bool,
    checkGrammar: PropTypes.bool,
    checkHighlight: PropTypes.bool,
    textCorrector: PropTypes.bool,
    dynamic: PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      content: null,
      ignoreInnerHTML: false,
      checkSpaces: undefined,
      checkGrammar: undefined,
      checkHighlight: undefined,
      textCorrector: undefined,
      dynamic: false
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    // initialize
    this.registerMixin("UU5.Common.ContentMixin");

    this.renderedChildren = []; // [renderedChild,renderedChild,...]
    this.renderedChildrenIdList = {}; // {id:renderedChild,id:renderedChild,...}
    this.renderedChildrenNameList = {}; // {name:renderedChild,name:renderedChild,...}

    // state
    var state = {
      mode: this.props.mode || this.getDefault("standardMode")
    };

    if (this.isDynamic()) {
      state.children = this.buildChildren(this.props);
      state.filter = null;
      state.filteredProps = null;
      state.sorter = null;
      state.sortedIds = null;
    }

    return state;
  },

  componentWillMount() {
    if (this.props.mode) {
      this.showWarning('The property "mode" is deprecated!');
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      nextProps.dynamic && this.setChildren(this.buildChildren(nextProps), nextProps);
      if (nextProps.mode !== this.props.mode) {
        this.showWarning('The property "mode" is deprecated!');
        this.setState({ mode: nextProps.mode });
      }
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonContentMixin() {
    return this.hasMixin("UU5.Common.ContentMixin");
  },

  isDynamic() {
    return this.props.dynamic;
  },

  getContent() {
    return this.props.content;
  },

  getUU5CommonContentMixinProps() {
    return {
      content: this.getContent(),
      dynamic: this.isDynamic(),
      ignoreInnerHTML: this.props.ignoreInnerHTML,
      textCorrector: this.props.textCorrector,
      checkSpaces: this.props.checkSpaces,
      checkGrammar: this.props.checkGrammar,
      checkHighlight: this.props.checkHighlight,
      mode: this.props.mode
    };
  },

  getUU5CommonContentMixinPropsToPass() {
    return this.getUU5CommonContentMixinProps();
  },

  expandChildProps(prevChild, childIndex) {
    let newChildProps = { ...prevChild.props };

    // key is id if id is set, or it is childIndex
    // Key can not be generated because of in each render the child has new key and child is unmounted and mounted again
    let key = newChildProps.id || "uu5-content-" + childIndex;

    let isUU5Child =
      (typeof prevChild.type === "function" && prevChild.type.tagName) ||
      (prevChild.type && prevChild.type.isUu5PureComponent);

    let isStateless = prevChild.type && prevChild.type.isStateless;

    if (isUU5Child) {
      newChildProps.parent = newChildProps.parent || this;
      //newChildProps.parent = this;

      this.isDynamic() && (newChildProps.id = newChildProps.id || Tools.generateUUID());

      if (typeof this.expandChildProps_ === "function") {
        let tempChild = React.cloneElement(prevChild, newChildProps);
        newChildProps = this.expandChildProps_(tempChild, childIndex);
      }
    }

    if (!prevChild.key) newChildProps.key = newChildProps.key || key;

    if (isUU5Child && !isStateless) {
      newChildProps.ref = function(renderedChild) {
        if (renderedChild) {
          let index = childIndex; // childIndex might be "old" if component is dynamic and multiple new children were added via API
          if (newChildProps.id && this.isDynamic() && this.state.children) {
            if (Array.isArray(this.state.children)) {
              index = this.state.children.map(child => child.props.id).indexOf(newChildProps.id);
            } else {
              index = 0;
            }
          }
          this.registerRenderedChild(renderedChild, index);
        }
      }.bind(this);
    }

    return newChildProps;
  },

  buildChild(childTag, childProps, children) {
    if (childProps && childProps.href && childProps.href.match(/^javascript:/i)) {
      childProps = Tools.merge({}, childProps);
      childProps.href = childProps.href.replace(REGEXP.jsCode, "");
    }
    return Tools.findComponent(childTag, childProps, children);
  },

  cloneChild(child, props) {
    let clonedChild;
    if (typeof this.expandChild_ === "function") {
      clonedChild = this.expandChild_(React.cloneElement(child, props), props.key);
    } else {
      clonedChild = this.expandChildDefault(React.cloneElement(child, props), props.key);
    }

    return clonedChild;
  },

  expandChildDefault(child, key) {
    return child;
  },

  buildNodeChildren(children, childPropsExpander) {
    let newChildren = [];

    // NOTE Cannot use React.Children.forEach as it skips items of type "function"
    // which can now be present due to uustring parsing (child tags are FAACs).
    let list = Array.isArray(children) ? children : [children];
    let flatList = deepFlattenList(list);
    flatList.forEach((child, i) => {
      if (child !== undefined && child !== null && typeof child !== "boolean") {
        let propsExpanded = false;
        if (typeof child === "function") {
          let extraProps = childPropsExpander(<PseudoUU5Component />, i);
          child = child(extraProps);
          propsExpanded = true;
        }

        if (this.shouldChildRender(child)) {
          let newChild;

          if (typeof child === "object") {
            if (!propsExpanded) {
              let newChildProps = childPropsExpander(child, i);
              newChild = this.cloneChild(child, newChildProps);
            } else {
              newChild = child;
            }

            // text
          } else {
            // it does not need to cover just spaces by textCorrector
            if (!this.__isTextCorrector(child)) {
              newChild = child;
              if (this.expandChild_) {
                newChild = this.expandChild_(newChild, i);
              }
            } else {
              let props = {
                text: child,
                ...this.__getTextCorrectorProps(),
                key: i
              };
              newChild = this.cloneChild(<TextCorrectorContextConsumer {...props} />, props);

              if (this.expandChild_) {
                newChild = this.expandChild_(newChild, i);
              }
            }
          }
          newChildren.push(newChild);
        }
      }
    });

    return newChildren;
  },

  shouldChildRender: function(child) {
    let childTag = Tools.getChildTag(child);
    let result = Environment.nestingLevelStrict ? childTag && !!childTag["UU5.Common.NestingLevelMixin"] : true;

    if (result && typeof this.shouldChildRender_ === "function") {
      result = this.shouldChildRender_(child);
    }
    return result;
  },

  buildChildren(contentProps, childPropsExpander, childIndex) {
    let children = null;

    if (typeof this.buildChildren_ === "function") {
      children = this.buildChildren_(contentProps, childPropsExpander);
    } else {
      children = this.buildChildrenDefault(contentProps, childPropsExpander, childIndex);
    }

    return children;
  },

  buildChildrenDefault(contentProps, childPropsExpander, childIndex) {
    let children = null;
    contentProps = contentProps || this.props;
    childPropsExpander = childPropsExpander || this.expandChildProps;
    childIndex = childIndex || 0;

    let contentValue = contentProps.content;
    let contentType = this._getContentType(contentValue);

    if (contentType === "uu5json") {
      contentValue = Tools.parseFromUu5JSON(contentValue);
      contentType = this._getContentType(contentValue);
    } else if (contentType === "uu5data") {
      contentValue = Tools.parseFromUu5Data(contentValue);
      contentType = this._getContentType(contentValue);
    }

    switch (contentType) {
      case "bodyItem":
        let bodyItemChild = this.buildChild(contentValue.tag, contentValue.props);
        this.shouldChildRender(bodyItemChild) &&
          (children = [this.cloneChild(bodyItemChild, childPropsExpander(bodyItemChild, childIndex))]);
        break;
      case "array":
        children = contentValue.map((bodyItem, i) => {
          return this.buildChildren({ content: bodyItem }, childPropsExpander, i);
        });
        break;
      case "items":
        let tag = Tools.checkTag(contentValue.tag, true);
        children = [];
        contentValue.propsArray.forEach((props, i) => {
          let child = tag ? this.buildChild(tag, props) : Tools.findComponent(contentValue.tag, props);
          child = this.cloneChild(child, childPropsExpander(child, i));
          this.shouldChildRender(child) && children.push(child);
        });
        break;
      case "string":
        if (!this.__isTextCorrector(contentValue)) {
          this.shouldChildRender(contentValue) && (children = contentValue);
        } else {
          let child = (
            <TextCorrectorContextConsumer
              parent={this}
              text={contentValue}
              {...this.__getTextCorrectorProps()}
              key={childIndex}
            />
          );
          this.shouldChildRender(child) && (children = child);
        }
        break;
      case "number":
        this.shouldChildRender(contentValue) && (children = contentValue);
        break;
      case "element": {
        let child = this.cloneChild(contentValue, childPropsExpander(contentValue, childIndex));
        this.shouldChildRender(child) && (children = child);
        break;
      }
      case "bool": {
        let child = contentValue ? "true" : "false";
        this.shouldChildRender(child) && (children = child);
        break;
      }
      case "uu5string": {
        let stringChildren;
        try {
          // TODO Switch to using children as a function:
          // stringChildren = UU5String.toChildren(contentValue, undefined, undefined, true);
          stringChildren = UU5String.toChildren(contentValue, undefined, undefined, false);
        } catch (e) {
          if (e.code === "uu5StringInvalid") {
            stringChildren = Tools.findComponent(
              "UU5.Common.Error",
              null,
              <div>
                {e.message}
                <br />
                {contentValue}
              </div>
            );
          } else {
            throw e;
          }
        }
        children = this.buildNodeChildren(stringChildren, childPropsExpander);
        break;
      }
      case "function": {
        let propsToPass = childPropsExpander(<PseudoUU5Component />, childIndex);
        children = contentValue(propsToPass);
        break;
      }
      case "children":
      default:
        if (contentProps.children) {
          children = this.buildNodeChildren(contentProps.children, childPropsExpander);
        }
    }

    return children;
  },

  getStandardChildren() {
    return this._getUU5CommonContentMixinStandardChildren(this.state);
  },

  getOutlineChildren() {
    return this._getUU5CommonContentMixinOutlineChildren(this.state);
  },

  getChildren() {
    return this._getUU5CommonContentMixinChildren(this.state);
  },

  getRenderedChildren() {
    let result;
    if (typeof this.getRenderedChildren_ === "function") {
      result = this.getRenderedChildren_();
    } else {
      result = this.getRenderedChildrenDefault();
    }
    return result;
  },

  getRenderedChildrenDefault() {
    return this.renderedChildren;
  },

  setRenderedChildren(childrenIndexList) {
    this.renderedChildren = childrenIndexList;
    return this;
  },

  addRenderedChild(renderedChild, index) {
    if (index === undefined || index === null) {
      this.showError("indexNotSet", null, {
        mixinName: "UU5.Common.ContentMixin",
        context: {
          index: index,
          renderedChild: {
            tagName: renderedChild.getTagName(),
            id: renderedChild.getId(),
            component: renderedChild
          }
        }
      });
    } else {
      this.getRenderedChildren().splice(index, 0, renderedChild);
    }
    return this;
  },

  removeRenderedChild(renderedChild) {
    this.getRenderedChildren().splice(renderedChild.getIndex(), 1);
    return this;
  },

  getRenderedChildrenIdList() {
    let result;
    if (typeof this.getRenderedChildrenIdList_ === "function") {
      result = this.getRenderedChildrenIdList_();
    } else {
      result = this.getRenderedChildrenIdListDefault();
    }
    return result;
  },

  getRenderedChildrenIdListDefault() {
    return this.renderedChildrenIdList;
  },

  setRenderedChildrenIdList(childrenIdList) {
    this.renderedChildrenIdList = childrenIdList;
    return this;
  },

  addRenderedChildToIdList(renderedChild) {
    var id = renderedChild.getId();
    if (!this.getRenderedChildById(id)) {
      this.getRenderedChildrenIdList()[id] = renderedChild;
    } else if (this.getRenderedChildById(id) !== renderedChild) {
      this.showError("addRenderedChildToIdList_IdDuplicity", id, {
        mixinName: "UU5.Common.ContentMixin",
        context: {
          renderedChildrenIdList: this.getRenderedChildrenIdList(),
          renderedChild: {
            tagName: renderedChild.getTagName(),
            id: renderedChild.getId(),
            component: renderedChild
          }
        }
      });
    }
    return this;
  },

  removeRenderedChildFromIdList(renderedChild) {
    delete this.getRenderedChildrenIdList()[renderedChild.getId()];
    return this;
  },

  getRenderedChildrenNameList() {
    let result;
    if (typeof this.getRenderedChildrenNameList_ === "function") {
      result = this.getRenderedChildrenNameList_();
    } else {
      result = this.getRenderedChildrenNameListDefault();
    }
    return result;
  },

  getRenderedChildrenNameListDefault() {
    return this.renderedChildrenNameList;
  },

  setRenderedChildrenNameList(childrenNameList) {
    this.renderedChildrenNameList = childrenNameList;
    return this;
  },

  addRenderedChildToNameList(renderedChild) {
    var name = renderedChild.getName();
    if (name) {
      var nameList = this.getRenderedChildrenNameList();
      if (
        !nameList[name] ||
        nameList[name]
          .map(function(rChild) {
            return rChild.getId();
          })
          .indexOf(renderedChild.getId()) === -1
      ) {
        nameList[name] = nameList[name] || [];
        nameList[name].push(renderedChild);
      }
    }
    return this;
  },

  removeRenderedChildFromNameList(renderedChild) {
    var nameChildren = this.getRenderedChildrenByName(renderedChild.getName());
    if (nameChildren) {
      var childIndex = nameChildren
        .map(function(rChild) {
          return rChild.getId();
        })
        .indexOf(renderedChild.getId());

      childIndex > -1 && nameChildren.splice(childIndex, 1);
    }
    return this;
  },

  getChildIndexById(childId) {
    var childIndex;

    if (typeof this.getChildIndexById_ === "function") {
      childIndex = this.getChildIndexById_(childId);
    } else {
      childIndex = this.getChildIndexByIdDefault(childId);
    }

    return childIndex;
  },

  getChildIndexByIdDefault(childId) {
    var childIndex;
    var children = this.getRenderedChildren();

    var index =
      childId &&
      children
        .map(child => {
          return child.getId() === childId;
        })
        .indexOf(true);

    childIndex = index === -1 ? null : index;

    return childIndex;
  },

  getRenderedChildById(childId) {
    var renderedChild;

    if (typeof this.getRenderedChildById_ === "function") {
      renderedChild = this.getRenderedChildById_(childId);
    } else {
      renderedChild = this.getRenderedChildByIdDefault(childId);
    }

    return renderedChild;
  },

  getRenderedChildByIdDefault(childId) {
    return this.getRenderedChildrenIdList()[childId] || null;
  },

  getRenderedChildrenByName(childName) {
    return this.getRenderedChildrenNameList()[childName] || null;
  },

  getRenderedChildByName(childName) {
    var renderedChild;

    if (typeof this.getRenderedChildByName_ === "function") {
      renderedChild = this.getRenderedChildByName_(childName);
    } else {
      renderedChild = this.getRenderedChildByNameDefault(childName);
    }

    return renderedChild;
  },

  getRenderedChildByNameDefault(childName) {
    var nameChildren = this.getRenderedChildrenByName(childName);
    var renderedChild = nameChildren ? nameChildren[0] : null;

    return renderedChild;
  },

  getRenderedChildByIndex(index) {
    var renderedChild;

    if (typeof this.getRenderedChildByIndex_ === "function") {
      renderedChild = this.getRenderedChildByIndex_(index);
    } else {
      renderedChild = this.getRenderedChildByIndexDefault(index);
    }

    return renderedChild;
  },

  getRenderedChildByIndexDefault(index) {
    return this.getRenderedChildren()[index] || null;
  },

  getRenderedChildByTagName(tagName) {
    var foundChild = null;

    if (typeof this.getRenderedChildByTagName_ === "function") {
      foundChild = this.getRenderedChildByTagName_(tagName);
    } else {
      foundChild = this.getRenderedChildByTagNameDefault(tagName);
    }

    return foundChild;
  },

  getRenderedChildByTagNameDefault(tagName) {
    var foundChild;

    this.eachRenderedChild(renderedChild => {
      var condition = renderedChild.getTagName() === tagName;
      condition && (foundChild = renderedChild);
      return !condition; // false <=> end of cycle
    });

    return foundChild;
  },

  getFirstRenderedChild() {
    var renderedChild = null;

    if (typeof this.getFirstRenderedChild_ === "function") {
      renderedChild = this.getFirstRenderedChild_();
    } else {
      renderedChild = this.getFirstRenderedChildDefault();
    }

    return renderedChild;
  },

  getFirstRenderedChildDefault() {
    return this.getRenderedChildByIndex(0);
  },

  getLastRenderedChild() {
    var renderedChild = null;

    if (typeof this.getLastRenderedChild_ === "function") {
      renderedChild = this.getLastRenderedChild_();
    } else {
      renderedChild = this.getLastRenderedChildDefault();
    }

    return renderedChild;
  },

  getLastRenderedChildDefault() {
    return this.getRenderedChildByIndex(this.getRenderedChildren().length - 1);
  },

  eachRenderedChild(callback) {
    // function callbackFunction( renderedChild, renderedChildIndex );
    if (typeof this.eachRenderedChild_ === "function") {
      this.eachRenderedChild_(callback);
    } else {
      this.eachRenderedChildDefault(callback);
    }
    return this;
  },

  eachRenderedChildDefault(callback) {
    var renderedChildren = this.getRenderedChildren();

    // same as: for(var i = 0; i < renderedChildren.length; i++) {
    //          var renderedChild = renderedChildren[i];
    for (var i = 0, renderedChild; (renderedChild = renderedChildren[i]); ++i) {
      var result = callback(renderedChild, i);
      if (result === false) {
        break;
      }
    }

    return this;
  },

  registerRenderedChild(renderedChild, index) {
    if (renderedChild.hasUU5CommonBaseMixin && !this.getRenderedChildById(renderedChild.getId())) {
      this.addRenderedChild(renderedChild, index);
      this.addRenderedChildToIdList(renderedChild);
      this.addRenderedChildToNameList(renderedChild);
    }
    return this;
  },

  unregisterRenderedChild(renderedChild) {
    this.removeRenderedChild(renderedChild);
    this.removeRenderedChildFromIdList(renderedChild);
    this.removeRenderedChildFromNameList(renderedChild);
    return this;
  },

  // dynamic functions

  setChildren(newChildren, ...args) {
    let setStateCallback = typeof args[args.length - 1] === "function" ? args.pop() : undefined; // always last
    let props = args.shift() || this.props;

    if (props.dynamic) {
      if (typeof this.setChildren_ === "function") {
        this.setChildren_(newChildren, setStateCallback);
      } else {
        this.setChildrenDefault(newChildren, setStateCallback);
      }
    } else {
      this.showError("dynamicOnly", "setChildren", {
        mixinName: "UU5.Common.ContentMixin"
      });
    }
    return this;
  },

  setChildrenDefault(newChildren, setStateCallback) {
    this.setState({ children: newChildren }, setStateCallback);
    return this;
  },

  /**
   * Inserts child into container. If position is set, child will be added to that position.
   * Only for dynamic container.
   * Can be overridden by insertChild_ function.
   *
   * @param {object|element} child - Object with tag of the element and props. E.g. {tag: '...', props: {...}} or Element e.g. < ... />
   * @param {object} opt - Additional parameters.
   * @param {number} opt.position - Position where the child should be placed to. If not set, child is added
   *                                at the end of children list.
   * @param {boolean} opt.shouldUpdate - If false, setState is not called.
   * @param {function} opt.setStateCallback - Callback is called after setState.
   * @returns {object} this
   */
  insertChild(child, opt) {
    /*
     opt:{
     position: number // Position where the child should be placed to.
     // If not set, child is added at the end of children list.
     shouldUpdate: bool // call setState -> render, default value is true
     callbackFunction: function // function callbackFunction(newRenderedChild)
     }
     */
    if (this.isDynamic()) {
      if (typeof this.insertChild_ === "function") {
        this.insertChild_(child, opt);
      } else {
        this.insertChildDefault(child, opt);
      }
    } else {
      this.showError("dynamicOnly", "insertChild", {
        mixinName: "UU5.Common.ContentMixin"
      });
    }

    return this;
  },

  insertChildDefault(child, opt) {
    opt = opt || {};

    if (opt.shouldUpdate === undefined || opt.shouldUpdate) {
      let newChild = child.tag ? this.buildChild(child.tag, child.props) : child;
      if (this.shouldChildRender(newChild)) {
        this._setChildrenInTransaction(
          state => {
            // NOTE This is called during this.setState(thisFn), i.e. the "state" argument contains
            // actual children. This solves issue with multiple successive calls to insertChild which
            // was previously operating on stale "state" and therefore ending up with adding only 1 child.
            let children = this._getUU5CommonContentMixinChildren(state) || [];
            if (Array.isArray(children)) {
              children = children.slice();
            } else {
              const elem = this.cloneChild(children, this.expandChildProps(children, 0));
              children = [elem];
            }

            let doNothing = false;
            let usedPosition;
            let relativeChildId = opt.childBeforeId || opt.childAfterId;
            if (relativeChildId) {
              // NOTE We cannot use rendered children because their "index" might be already bad
              // (e.g. if user called insertChild successively multiple times without re-rendering
              // in-between).
              let relativeChildIndex = children
                .map(child => child && child.props && child.props.id)
                .indexOf(relativeChildId);
              if (relativeChildIndex === -1) {
                this.showError("insertedchildIdNotExists", relativeChildId, {
                  mixinName: "UU5.Common.ContentMixin"
                });
                doNothing = true;
              } else {
                usedPosition = opt.childBeforeId ? relativeChildIndex + 1 : relativeChildIndex;
              }
            }
            let result = null;
            if (!doNothing) {
              if (usedPosition == null) usedPosition = opt.position;
              if (typeof usedPosition !== "number") usedPosition = children.length;
              else usedPosition = Math.max(0, Math.min(usedPosition, children.length));

              newChild = this.cloneChild(newChild, this.expandChildProps(newChild, usedPosition));
              children.splice(usedPosition, 0, newChild);
              result = { children };
            }

            return result;
          },
          typeof opt.setStateCallback === "function"
            ? () => {
                opt.setStateCallback(this.getRenderedChildById(newChild.props.id));
              }
            : null
        );
      }
    }

    return this;
  },

  /**
   * Inserts child into container at position before another child by ID.
   * Only for dynamic container.
   * Can be overridden by insertChildBefore_ function.
   *
   * @param {object} child - Object with tag of the element and props. E.g. {tag: '...', props: {...}} or Element e.g. < ... />
   * @param {object} opt - Additional parameters.
   * @param {string} opt.childAfterId - ID of the child before which the new child will be placed. If not set, the new
   *                                    child will be placed at the beginning.
   * @param {boolean} opt.shouldUpdate - If false, setState is not called.
   * @param {function} opt.setStateCallback - Callback is called after setState.
   * @returns {object} this
   */
  insertChildBefore(child, opt) {
    if (this.isDynamic()) {
      if (typeof this.insertChildBefore_ === "function") {
        this.insertChildBefore_(child, opt);
      } else {
        this.insertChildBeforeDefault(child, opt);
      }
    } else {
      this.showError("dynamicOnly", "insertChildBefore", {
        mixinName: "UU5.Common.ContentMixin"
      });
    }

    return this;
  },

  insertChildBeforeDefault(child, opt) {
    if (typeof this.insertChild_ === "function") {
      // TODO This whole if-branch is for backward compatibility for components having
      // "insertChild_", i.e. we compute position of new child right away (from possibly
      // stale children). Do differently in next major version.
      opt = opt || {};

      var childIndex;
      if (opt.childAfterId) {
        var renderedChild = this.getRenderedChildById(opt.childAfterId);
        childIndex = renderedChild ? renderedChild.getIndex() : null;
      } else {
        childIndex = 0;
      }

      if (childIndex === null) {
        this.showError("insertedchildIdNotExists", opt.childAfterId, {
          mixinName: "UU5.Common.ContentMixin"
        });
      } else {
        this.insertChild(child, Tools.merge({}, opt, { position: childIndex }));
      }
    } else {
      // insert child (let the position be computed from children from resolved state, i.e.
      // pass childAfterId as-is, with fallback position being at index 0)
      opt = Tools.merge({}, opt, { position: 0 });
      delete opt.childBeforeId;
      this.insertChild(child, opt);
    }

    return this;
  },

  /**
   * Inserts child into container at position after another child by ID.
   * Only for dynamic container.
   * Can be overridden by insertChildAfter_ function.
   *
   * @param {object} child - Object with tag of the element and props. E.g. {tag: '...', props: {...}} or Element e.g. < ... />
   * @param {object} opt - Additional parameters.
   * @param {string} opt.childBeforeId - ID of child after which the new child will be placed. If not set, the new
   *                                     child will be placed at the end.
   * @param {boolean} opt.shouldUpdate - If false, setState is not called.
   * @param {function} opt.setStateCallback - Callback is called after setState.
   * @returns {object} this
   */
  insertChildAfter(child, opt) {
    if (this.isDynamic()) {
      if (typeof this.insertChildAfter_ === "function") {
        this.insertChildAfter_(child, opt);
      } else {
        this.insertChildAfterDefault(child, opt);
      }
    } else {
      this.showError("dynamicOnly", "insertChildAfter", {
        mixinName: "UU5.Common.ContentMixin"
      });
    }

    return this;
  },

  insertChildAfterDefault(child, opt) {
    if (typeof this.insertChild_ === "function") {
      // TODO This whole if-branch is for backward compatibility for components having
      // "insertChild_", i.e. we compute position of new child right away (from possibly
      // stale children). Do differently in next major version.

      // reset position value and copy opt
      opt = Tools.merge({}, opt, { position: undefined }) || {};

      if (opt.childBeforeId) {
        var renderedChild = this.getRenderedChildById(opt.childBeforeId);
        var childIndex = renderedChild ? renderedChild.getIndex() : null;
        childIndex !== null && (opt.position = childIndex + 1);
      }

      if (opt.childBeforeId && opt.position === undefined) {
        this.showError("insertedchildIdNotExists", opt.childBeforeId, {
          mixinName: "UU5.Common.ContentMixin"
        });
      } else {
        this.insertChild(child, opt);
      }
    } else {
      // insert child (let the position be computed from children from resolved state, i.e.
      // pass childBeforeId as-is, with fallback position being undefined, i.e. at the end)
      opt = Tools.merge({}, opt, { position: undefined });
      delete opt.childAfterId;
      this.insertChild(child, opt);
    }

    return this;
  },

  /**
   * Update child props. New props will be merged with old props, so it is possible to change just one property or all
   * of them.
   * Only for dynamic container.
   * Can be overridden by updateChild_ function.
   *
   * TODO: maybe function updateProps() should be in baseMixin (only if parent is dynamic container)
   *
   * @param {string} childId - ID of child, which props are being updated.
   * @param {object} newProps - Props which are being changed. It is not necessary to set all of the props.
   * @param {object} opt - Additional parameters.
   * @param {boolean} opt.shouldUpdate - If false, setState is not called.
   * @param {function} opt.setStateCallback - Callback is called after setState.
   * @returns {object} this
   */
  updateChild(childId, newProps, opt) {
    if (this.isDynamic()) {
      if (typeof this.updateChild_ === "function") {
        this.updateChild_(childId, newProps, opt);
      } else {
        this.updateChildDefault(childId, newProps, opt);
      }
    } else {
      this.showError("dynamicOnly", "updateChild", {
        mixinName: "UU5.Common.ContentMixin"
      });
    }

    return this;
  },

  updateChildDefault(childId, newProps, opt) {
    opt = opt || {};

    if (opt.shouldUpdate === undefined || opt.shouldUpdate) {
      this._setChildrenInTransaction(state => {
        let children = this._getUU5CommonContentMixinChildren(state) || [];
        let childIndex = children.map(child => child && child.props && child.props.id).indexOf(childId);

        let result = null;
        if (childIndex === -1) {
          this.showError("childIdNotExists", "updateChild", {
            mixinName: "UU5.Common.ContentMixin"
          });
        } else {
          children = children.slice();
          let newChild = this.cloneChild(children[childIndex], newProps);
          children[childIndex] = this.cloneChild(children[childIndex], this.expandChildProps(newChild, childIndex));
          result = { children };
        }
        return result;
      }, opt.setStateCallback);
    }

    return this;
  },

  /**
   * Replace child by tag and props on the position.
   * Only for dynamic container.
   * Can be overridden by replaceChild_ function.
   *
   * TODO: maybe function replace() should be in baseMixin (only if parent is dynamic container)
   *
   * @param {string} childId - ID of child, which props are being updated.
   * @param {object} child - Object with tag of the element and props. E.g. {tag: '...', props: {...}} or Element e.g. < ... />
   * @param {object} opt - Additional parameters.
   * @param {boolean} opt.shouldUpdate - If false, setState is not called.
   * @param {function} opt.setStateCallback - Callback is called after setState.
   * @returns {object} this
   */
  replaceChild(childId, child, opt) {
    if (this.isDynamic()) {
      if (typeof this.replaceChild_ === "function") {
        this.replaceChild_(childId, child, opt);
      } else {
        this.replaceChildDefault(childId, child, opt);
      }
    } else {
      this.showError("dynamicOnly", "replaceChild", {
        mixinName: "UU5.Common.ContentMixin"
      });
    }

    return this;
  },

  replaceChildDefault(childId, child, opt) {
    opt = opt || {};

    if (opt.shouldUpdate === undefined || opt.shouldUpdate) {
      let newChild = child.tag ? this.buildChild(child.tag, child.props) : child;
      if (this.shouldChildRender(newChild)) {
        this._setChildrenInTransaction(state => {
          let children = this._getUU5CommonContentMixinChildren(state) || [];
          let childIndex = children.map(child => child && child.props && child.props.id).indexOf(childId);

          let result = null;
          if (childIndex === -1) {
            this.showError("childIdNotExists", "replaceChild", {
              mixinName: "UU5.Common.ContentMixin"
            });
          } else {
            children = children.slice();
            children[childIndex] = this.cloneChild(newChild, this.expandChildProps(newChild, childIndex));
            result = { children };
          }
          return result;
        }, opt.setStateCallback);
      }
    }

    return this;
  },

  /**
   * Deletes child from children list.
   * Only for dynamic container.
   * Can be overridden by deleteChild_ function.
   *
   * TODO: maybe function delete() should be in baseMixin (only if parent is dynamic container)
   *
   * @param {string} childId - ID of child, which props are being deleted.
   * @param {object} opt - Additional parameters.
   * @param {boolean} opt.shouldUpdate - If false, setState is not called.
   * @param {function} opt.setStateCallback - Callback is called after setState.
   * @returns {object} this
   */
  deleteChild(childId, opt) {
    if (this.isDynamic()) {
      if (typeof this.deleteChild_ === "function") {
        this.deleteChild_(childId, opt);
      } else {
        this.deleteChildDefault(childId, opt);
      }
    } else {
      this.showError("dynamicOnly", "deleteChild", {
        mixinName: "UU5.Common.ContentMixin"
      });
    }

    return this;
  },

  deleteChildDefault(childId, opt) {
    opt = opt || {};

    if (opt.shouldUpdate === undefined || opt.shouldUpdate) {
      this._setChildrenInTransaction(state => {
        let children = this._getUU5CommonContentMixinChildren(state) || [];
        let childIndex = children.map(child => child && child.props && child.props.id).indexOf(childId);

        let result = null;
        if (childIndex === -1) {
          this.showError("childIdNotExists", "deleteChild", {
            mixinName: "UU5.Common.ContentMixin"
          });
        } else {
          children = children.slice();
          children.splice(childIndex, 1);
          result = { children };
        }
        return result;
      }, opt.setStateCallback);
    }

    return this;
  },

  /**
   * Deletes all children.
   * Only for dynamic container.
   * Can be overridden by clearChildren_ function.
   *
   * @param {object} opt - Additional parameters.
   * @param {boolean} opt.shouldUpdate - If false, setState is not called.
   * @param {function} opt.setStateCallback - Callback is called after setState.
   * @returns {object} this
   */
  clearChildren(opt) {
    if (this.isDynamic()) {
      if (typeof this.clearChildren_ === "function") {
        this.clearChildren_(opt);
      } else {
        this.clearChildrenDefault(opt);
      }
    } else {
      this.showError("dynamicOnly", "clearChildren", {
        mixinName: "UU5.Common.ContentMixin"
      });
    }

    return this;
  },

  clearChildrenDefault(opt) {
    opt = opt || {};
    (opt.shouldUpdate === undefined || opt.shouldUpdate) && this.setChildren([], opt.setStateCallback);
    return this;
  },

  setFilter(filter, setStateCallback) {
    this.setState({ filter: filter, filteredProps: this._getFilteredChildrenProps(filter) }, setStateCallback);
    return this;
  },

  resetFilter(setStateCallback) {
    this.setState({ filter: null, filteredProps: null }, setStateCallback);
    return this;
  },

  setSorter(sorter, setStateCallback) {
    this.setState({ sorter: sorter, sortedIds: this._getSortedChildIds(sorter) }, setStateCallback);
    return this;
  },

  resetSorter(setStateCallback) {
    this.setState({ sorter: null, sortedIds: null }, setStateCallback);
    return this;
  },

  setFilterAndSorter(filter, sorter, setStateCallback) {
    this.setState(
      {
        filter: filter,
        filteredProps: this._getFilteredChildrenProps(filter),
        sorter: sorter,
        sortedIds: this._getSortedChildIds(sorter)
      },
      setStateCallback
    );

    return this;
  },

  resetFilterAndSorter(setStateCallback) {
    this.setState(
      {
        filter: null,
        filteredProps: null,
        sorter: null,
        sortedIds: null
      },
      setStateCallback
    );

    return this;
  },

  getFilteredSorterChildren(children) {
    var container = this;
    var newChildren = [];

    children = children || this.getChildren();

    if (children) {
      children = Array.isArray(children) ? children : [children];
      children.forEach(child => {
        if (child) {
          var childId = child.props && child.props.id;
          var index = container.state.sortedIds && container.state.sortedIds.indexOf(childId);

          if (!container.state.sortedIds || index > -1) {
            var newProps = container.state.filteredProps && container.state.filteredProps[childId];

            if (!container.state.filteredProps || newProps) {
              newProps &&
                Object.keys(newProps).length !== 0 &&
                (child = React.cloneElement(child, Tools.mergeDeep({}, child.props, newProps)));

              if (typeof index === "number") {
                newChildren[index] = child;
              } else {
                newChildren.push(child);
              }
            }
          }
        }
      });
    }

    return newChildren;
  },

  // Mode
  setStandardMode(setStateCallback) {
    this.showWarning('The property "mode" is deprecated!');
    this.setState({ mode: this.getDefault("standardMode", "UU5.Common.ContentMixin") }, setStateCallback);
    return this;
  },

  setOutlineMode(setStateCallback) {
    this.showWarning('The property "mode" is deprecated!');
    this.setState({ mode: this.getDefault("outlineMode", "UU5.Common.ContentMixin") }, setStateCallback);
    return this;
  },

  getMode() {
    return this.state.mode || this.getDefault("standardMode", "UU5.Common.ContentMixin");
  },

  isStandardMode() {
    return this.getMode() === this.getDefault("standardMode", "UU5.Common.ContentMixin");
  },

  isOutlineMode() {
    return this.getMode() === this.getDefault("outlineMode", "UU5.Common.ContentMixin");
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getContentType(content) {
    let type = null; // one of ['children','uu5json','uu5string','uu5data','string','number','array','items','bodyItem','element','bool']

    if (content === undefined || content === null) {
      // children
      type = "children";
    } else if (typeof content === "string") {
      let match = this.getDefault("regexpUu5", "UU5.Common.ContentMixin").exec(content);
      type = match ? match[1] : "string";
    } else if (typeof content === "number") {
      type = "number";
    } else if (typeof content === "boolean") {
      type = "bool";
    } else if (Array.isArray(content)) {
      type = "array";
    } else if (content && typeof content === "object") {
      // fixed content = {} - from now it rendered as null
      if (Object.keys(content).length) {
        // bodyItem, items or node
        type = content.tag ? (content.propsArray ? "items" : "bodyItem") : "element";
      }
    } else if (typeof content === "function") {
      type = "function";
    } else {
      this.showError("unexpectedContentType", typeof content, {
        mixinName: "UU5.Common.ContentMixin",
        context: {
          content: content
        }
      });
    }

    return type;
  },

  _getFilteredChildrenProps(filter) {
    let filteredChildrenProps = {};

    this.eachRenderedChild((renderedChild, i) => {
      let result = filter(renderedChild, i);
      if (result) {
        result === true && (result = {});
      } else {
        result = { hidden: true };
      }
      filteredChildrenProps[renderedChild.getId()] = result;
    });

    return filteredChildrenProps;
  },

  _getSortedChildIds(sorter) {
    let sortedChildren = this.getRenderedChildren().sort(sorter);
    return sortedChildren.map(renderedChild => {
      return renderedChild.getId();
    });
  },

  _setChildrenInTransaction(getNewChildrenStateFn, setStateCallback) {
    if (typeof this.setChildren_ === "function") {
      let newState = getNewChildrenStateFn(this.state);
      if (newState) this.setChildren_(newState.children, setStateCallback);
    } else {
      this.setState(getNewChildrenStateFn, setStateCallback);
    }
  },

  _getUU5CommonContentMixinChildren(state) {
    var children = null;

    switch (this._getUU5CommonContentMixinMode(state)) {
      case this.getDefault("standardMode", "UU5.Common.ContentMixin"):
        children = this._getUU5CommonContentMixinStandardChildren(state);
        break;
      case this.getDefault("outlineMode", "UU5.Common.ContentMixin"):
        children = this._getUU5CommonContentMixinOutlineChildren(state);
        break;
    }

    return children;
  },
  _getUU5CommonContentMixinMode(state) {
    return state.mode || "standard";
  },
  _getUU5CommonContentMixinStandardChildren(state) {
    return this.isDynamic() ? state.children : this.buildChildren();
  },
  _getUU5CommonContentMixinOutlineChildren(state) {
    return Tools.findComponent("UU5.Common.Outline", { element: this, key: 0 });
  },

  __isTextCorrector(value) {
    return typeof value !== "number" && value.trim() !== "";
  },

  __getTextCorrectorPropValue(propName) {
    let propValue = this.props[propName];
    if (propValue === undefined) {
      return this.props.textCorrector;
    } else {
      return propValue;
    }
  },

  __getTextCorrectorProps() {
    return {
      checkSpaces: this.__getTextCorrectorPropValue("checkSpaces"),
      checkGrammar: this.__getTextCorrectorPropValue("checkGrammar"),
      checkHighlight: this.__getTextCorrectorPropValue("checkHighlight"),
      language: this.props.language
    };
  }
  //@@viewOff:private
};

export default ContentMixin;
