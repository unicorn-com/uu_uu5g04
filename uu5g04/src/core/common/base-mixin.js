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
import ReactDOM from "react-dom";
import Tools from "./tools.js";
import Environment from "../environment/environment.js";
import Style from "../utils/style.js";
import RefUsageTelemetry from "./internal/ref-usage-telemetry.js";

export const BaseMixin = {
  //@@viewOn:statics
  statics: {
    "UU5.Common.BaseMixin": {
      warnings: {
        colWidthNotUsed: "Property colWidth was not used. Component was not covered itself by column.",
        overflowNotUsed: "Property overflow was not used. Component was not covered itself by flc.",
      },
      errors: {
        idMissing: "Id %s was not set.",
        parentMissing: "Parent was not found in props.",
        childrenAreNotIndexedByParent: "Children are not indexed by parent %s.",
        tagIsWrong: "Wrong tag %s - element was not found.",
        notRequiredMixin: "Registered mixin %s needs to require mixin %s in component %s!",
        invalidParentTagName: "Parent %s is not %s.",
        invalidParentType: "Parent %s has not function %s.",
        childTagNotAllowed:
          'Child tag %s is by default not allowed here. Use <%s allowTags={["%s"]} ...> if you really want to allow it, or wrap it into %s.',
        childNotAllowed: 'Child "%s" is by default not allowed here. Wrap it into %s.',
      },
      defaults: {
        regexpChars: /([ '"{}])/g,
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    id: PropTypes.string,
    name: PropTypes.string,
    tooltip: PropTypes.oneOfType([PropTypes.object, PropTypes.string]), // can't be content because html attribute title supports only string
    className: PropTypes.string,
    style: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    mainAttrs: PropTypes.object,
    parent: PropTypes.object,
    ref_: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
    noIndex: PropTypes.bool,
    editable: PropTypes.bool,
    contentEditable: PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function () {
    return {
      id: null,
      name: null,
      tooltip: null,
      className: null,
      style: null,
      mainAttrs: null,
      parent: null,
      ref_: null,
      noIndex: false,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function () {
    // initialize
    this._isMounted = true;
    this.registerMixin("UU5.Common.BaseMixin");
    this.id = this.props.id === null ? Tools.generateUUID() : this.props.id;
    // state
    return null;
  },

  componentDidMount: function () {
    if (
      (typeof this.props.ref_ === "function" || (typeof this.props.ref_ === "object" && this.props.ref_ !== null)) &&
      (!this.constructor.opt || !this.constructor.opt.hoc)
    ) {
      RefUsageTelemetry.process(this.getTagName());
      if ("current" in this.props.ref_) {
        this.props.ref_.current = this;
      } else {
        this.props.ref_(this);
      }
    }
  },

  UNSAFE_componentWillReceiveProps: function (nextProps) {
    // set id only if it was set in nextProps
    if (nextProps.id !== undefined && nextProps.id !== null && nextProps.id !== this.getId()) {
      var parent = this.getParent();
      // if parent support rendered children register - methods unregisterRenderedChild, registerRenderedChild
      if (parent && parent.unregisterRenderedChild) {
        var index = this.getIndex();
        parent.unregisterRenderedChild(this);
        this.id = nextProps.id;
        if (index != null && parent.registerRenderedChild) parent.registerRenderedChild(this, index);
      } else {
        this.id = nextProps.id;
      }
    }
  },

  componentWillUnmount: function () {
    // if parent support rendered children register - unregisterRenderedChild
    var parent = this.getParent();
    parent && parent.unregisterRenderedChild && parent.unregisterRenderedChild(this);
    this._isMounted = false;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonBaseMixin: function () {
    return this.hasMixin("UU5.Common.BaseMixin");
  },

  getTagName: function () {
    return this.constructor.tagName || "unknownTagName";
  },

  getMixinRegister: function () {
    return (this.mixinRegister = this.mixinRegister || []);
  },

  registerMixin: function (mixinName) {
    this.getMixinRegister().push(mixinName);

    var component = this;
    var requiredMixins = this.constructor[mixinName].requiredMixins;
    if (requiredMixins && requiredMixins.length) {
      requiredMixins.forEach(function (mixin) {
        if (!component.hasMixin(mixin)) {
          component.showError("notRequiredMixin", [mixinName, mixin, component.getTagName()], {
            mixinName: "UU5.Common.BaseMixin",
            context: { requiredMixins: requiredMixins },
          });
        }
      });
    }

    return this;
  },

  hasMixin: function (mixinName) {
    return this.getMixinRegister().indexOf(mixinName) !== -1;
  },

  getClassName: function (item, mixinName) {
    var classNames = mixinName
      ? this.constructor[mixinName]
        ? this.constructor[mixinName].classNames
        : null
      : this.constructor.classNames;
    // var resultValue = classNames && item ? classNames[item] || (classNames['main'] && classNames['main'] + '-' + Tools.getDashCase(item)) : null;
    var resultValue = classNames && item ? classNames[item] : null;
    if (typeof this[resultValue] === "function") {
      resultValue = this[resultValue](this.props, this.state);
    } else if (typeof resultValue === "function") {
      resultValue = resultValue(this.props, this.state);
    }
    return classNames && item ? resultValue : classNames;
  },

  getDefault: function (item, mixinName) {
    var defaults = mixinName
      ? this.constructor[mixinName]
        ? this.constructor[mixinName].defaults
        : null
      : this.constructor.defaults;
    return defaults && item ? defaults[item] : defaults;
  },

  getOpt: function (item, mixinName) {
    var opt = mixinName ? (this.constructor[mixinName] ? this.constructor[mixinName].opt : null) : this.constructor.opt;
    return opt && item ? opt[item] : opt;
  },

  getLsi(item, mixinName) {
    let lsi;
    if (mixinName) {
      lsi = this.constructor[mixinName] ? this.constructor[mixinName].lsi : null;
      typeof lsi === "function" && (lsi = lsi());
    } else {
      lsi = typeof this.constructor.lsi === "function" ? this.constructor.lsi() : this.constructor.lsi;
    }
    return lsi && item ? lsi[item] : lsi;
  },

  // TODO: deprecated
  getLSI(item, mixinName) {
    Tools.warning("Method this.getLSI is deprecated. Use this.getLsi instead.");
    return this.getLsi(item, mixinName);
  },

  getLsiComponent(item, mixin, params) {
    return Tools.findComponent("UU5.Bricks.Lsi", { lsi: this.getLsi(item, mixin), params: params });
  },

  // TODO: deprecated
  getLSIComponent(item, mixin, params) {
    Tools.warning("Method this.getLSIComponent is deprecated. Use this.getLsiComponent instead.");
    return this.getLsiComponent(item, mixin, params);
  },

  getLsiValue(item, mixin, params) {
    return Tools.getLsiItemByLanguage(this.getLsi(item, mixin), params, this.__getContextLanguages());
  },

  // TODO: deprecated
  getLSIValue(item, mixin, params) {
    Tools.warning("Method this.getLSIValue is deprecated. Use this.getLsiValue instead.");
    return this.getLsiValue(item, mixin, params);
  },

  getLsiItem(value, params) {
    return typeof value === "object" ? Tools.getLsiItemByLanguage(value, params, this.__getContextLanguages()) : value;
  },

  // TODO: deprecated
  getLSIItem(value, params) {
    Tools.warning("Method this.getLSIItem is deprecated. Use this.getLsiItem instead.");
    return this.getLsiItem(value, params);
  },

  isRendered: function () {
    return this._isMounted;
  },

  setAsyncState(newState, setStateCallback) {
    if (this.isRendered()) {
      this.setState(newState, setStateCallback);
    }
    return this;
  },

  getLimit: function (item, mixinName) {
    var limits = mixinName
      ? Environment.limits[mixinName]
      : this.constructor[mixinName]
      ? this.constructor[mixinName].limits
      : this.constructor.limits;
    return limits && item ? limits[item] : limits;
  },

  getError: function (item, mixinName) {
    var errors = mixinName
      ? this.constructor[mixinName]
        ? this.constructor[mixinName].errors || {}
        : {}
      : this.constructor.errors || {};
    return item ? errors[item] || item : errors;
  },

  getWarning: function (item, mixinName) {
    var warnings = mixinName
      ? this.constructor[mixinName]
        ? this.constructor[mixinName].warnings || {}
        : {}
      : this.constructor.warnings || {};
    return item ? warnings[item] || item : warnings;
  },

  getCallName: function (item, mixinName) {
    var calls = mixinName
      ? this.constructor[mixinName]
        ? this.constructor[mixinName].calls || {}
        : {}
      : this.constructor.calls || {};
    return item ? calls[item] || null : calls;
  },

  getId: function () {
    var id = this.id;
    !id &&
      this.showError("idMissing", id, {
        mixinName: "UU5.Common.BaseMixin",
      });
    return id;
  },

  getName: function () {
    return this.props.name;
  },

  getTooltip: function () {
    let tooltip;

    if (typeof this.props.tooltip === "string") {
      tooltip = this.props.tooltip;
    } else if (typeof this.props.tooltip === "object") {
      tooltip = this.getLsiItem(this.props.tooltip);
    }

    return tooltip;
  },

  getProps: function (prop) {
    UU5.Common.Tools.warning('Interface "getProps" is deprecated!');
    return this.props ? (prop ? this.props[prop] : this.props) : null;
  },

  getUU5CommonBaseMixinProps: function () {
    return {
      id: this.getId(),
      name: this.getName(),
      tooltip: this.getTooltip(),
      className: this.props.className,
      style: this.props.style,
      mainAttrs: this.props.mainAttrs,
      parent: this.getParent(),
    };
  },

  getUU5CommonBaseMixinPropsToPass: function (suffix) {
    suffix = suffix || "inner";
    let style = typeof this.props.style === "string" ? this.__styleStringToObject(this.props.style) : this.props.style;

    var props = {
      id: this.getId() + "-" + suffix,
      name: this.getName() ? this.getName() + "-" + suffix : null,
      tooltip: this.getTooltip(),
      className: this.getFullClassName(),
      style:
        style && this.props.mainAttrs && this.props.mainAttrs.style
          ? Tools.mergeDeep(this.props.mainAttrs.style, style)
          : style,
      parent: this,
    };

    var mainAttrs = this.props.mainAttrs || {};
    var extend = true;
    if (mainAttrs && mainAttrs.className) {
      extend && (mainAttrs = Tools.mergeDeep({}, mainAttrs)) && (extend = false);
      delete mainAttrs.className;
    }
    if (mainAttrs && mainAttrs.style) {
      extend && (mainAttrs = Tools.mergeDeep({}, mainAttrs)) && (extend = false);
      delete mainAttrs.style;
    }
    if (this.getTooltip()) {
      extend && (mainAttrs = Tools.mergeDeep({}, mainAttrs));
      mainAttrs.title = this.getTooltip() || mainAttrs.title;
    }

    props.mainAttrs = mainAttrs;

    return props;
  },

  // mixinNames = mixins to choose from
  getMainPropsToPass: function (mixinNames) {
    var params = [{}];

    var component = this;
    mixinNames = mixinNames || this.getMixinRegister();
    mixinNames.forEach(function (mixinName) {
      var propsToPassFunction = component["get" + mixinName.replace(/\./g, "") + "PropsToPass"];
      typeof propsToPassFunction === "function" && params.push(propsToPassFunction());
    });

    return Tools.mergeDeep.apply(null, params);
  },

  getMainAttrs: function () {
    var newMainAttrs = Tools.mergeDeep({}, this.getUU5CommonBaseMixinProps().mainAttrs, {
      className: this.getFullClassName(),
    });

    if (this.getTooltip()) newMainAttrs.title = this.getTooltip();
    if (this.props.style) {
      let style =
        typeof this.props.style === "string" ? this.__styleStringToObject(this.props.style) : this.props.style;

      newMainAttrs.style = Tools.mergeDeep({}, newMainAttrs.style, style);
    }
    if (this.props.id) newMainAttrs.id = this.props.id;
    if (this.getName()) newMainAttrs.name = this.getName();

    if (this.buildMainAttrs) newMainAttrs = this.buildMainAttrs(newMainAttrs);
    return newMainAttrs;
  },

  getParent: function () {
    return this.props.parent;
  },

  getParentByType: function (typeFunction) {
    var parent = this.getParent && this.getParent();
    while (parent && (typeof parent[typeFunction] !== "function" || !parent[typeFunction]())) {
      parent = parent.getParent && parent.getParent();
    }
    return parent;
  },

  checkParentTagName: function (parentTagNames) {
    parentTagNames = Array.isArray(parentTagNames) ? parentTagNames : [parentTagNames];
    var parent = this.getParent();
    var currentParentTagName = parent && parent.getTagName();
    var result = !currentParentTagName || parentTagNames.indexOf(currentParentTagName) == -1;
    if (result) {
      this.showError("invalidParentTagName", [currentParentTagName, parentTagNames.join(" or ")], {
        mixinName: "UU5.Common.BaseMixin",
      });
    }
    return result;
  },

  checkParentType: function (typeFunction) {
    var parent = this.getParent();
    var parentTypeFunction = parent && parent[typeFunction];
    var result = parentTypeFunction !== "function" || !parentTypeFunction();
    if (result) {
      this.showError("invalidParentType", [parent ? parent.getTagName() : null, typeFunction], {
        mixinName: "UU5.Common.BaseMixin",
      });
    }
    return result;
  },

  getIndex: function () {
    var parent = this.getParent();
    var index = null;
    // parent should support children index - method getChildIndexById
    if (parent && parent.getChildIndexById) {
      index = parent.getChildIndexById(this.getId());
    } else {
      this.showError("childrenAreNotIndexedByParent", parent ? parent.getTagName() : null, {
        mixinName: "UU5.Common.BaseMixin",
        context: { parent: parent },
      });
    }
    return index;
  },

  // Component helpers for React
  getFullClassName: function (className) {
    var component = this;
    var myClassName = className || "main";
    var classArray = [];
    var classes = {
      main: this.getClassName(myClassName),
      props: this.props.className,
      mainAttrs: this.props.mainAttrs && this.props.mainAttrs.className,
    };

    if (this.props.noIndex && !this.getOpt("hoc")) {
      classes.main += " uu5-noindex";
    }

    this.getMixinRegister().forEach(function (v) {
      var mixinClassName = v + "_" + myClassName;
      classes[mixinClassName] = component.getClassName(myClassName, v);
      classArray.push(mixinClassName);
    });
    classArray.push(myClassName);
    classArray.push("props");
    classArray.push("mainAttrs");

    return Tools.buildClasses(classes, classArray);
  },

  stringToObjectType: function (string, type, prefix) {
    var calculated = prefix || window;
    if (typeof string === "string") {
      var sArray = string.split(".");
      while (calculated && sArray.length > 0) {
        calculated = calculated[sArray.shift()];
      }
    }
    if (typeof calculated !== type) {
      this.showError("tagIsWrong", string, {
        mixinName: "UU5.Common.BaseMixin",
        context: {
          notFoundObject: calculated,
          notFoundObjectType: typeof calculated,
          checkedType: type,
          prefix: prefix,
        },
      });
      calculated = null;
    }
    return calculated;
  },

  switchChildrenToBody: function (props) {
    var newProps = Tools.mergeDeep({}, props || this.props);
    var children = newProps.children;
    newProps.children = null;
    newProps.body = React.Children.map(children, Tools.childToBodyItem());
    return newProps;
  },

  findDOMNode:
    process.env.NODE_ENV === "test"
      ? function () {
          try {
            return ReactDOM.findDOMNode(this);
          } catch (error) {
            return null;
          }
        }
      : function () {
          return ReactDOM.findDOMNode(this);
        },

  exportToObject: function () {
    return {
      tag: this.getTagName(),
      props: Tools.mergeDeep({}, this.props),
      state: Tools.mergeDeep({}, this.state),
    };
  },

  // msgParams could be array of params or just one param
  showError: function (msgKey, msgParams, opt) {
    opt = opt || {};
    var msg = this.getError(msgKey, opt.mixinName);
    Tools.error.apply(null, this.__getLogParams(msg, msgParams, opt.context));
    return this;
  },

  // msgParams could be array of params or just one param
  showWarning: function (msgKey, msgParams, opt) {
    opt = opt || {};
    var msg = this.getWarning(msgKey, opt.mixinName);
    Tools.warning.apply(null, this.__getLogParams(msg, msgParams, opt.context));
    return this;
  },

  replaceByHardSpace: function (text, language) {
    var replacer = language ? Environment.hardSpace.lsiReplacer[language] : null;
    replacer = replacer || Tools.getLsiItemByLanguage(Environment.hardSpace.lsiReplacer);
    return replacer ? replacer(text) : text;
  },

  shouldRender(nextProps, nextState, thisProps, thisState) {
    let props = thisProps || this.props;
    let state = thisState || this.state;
    let oldProps = Tools.merge({}, props);
    let newProps = Tools.merge({}, nextProps);
    return !Tools.deepEqual(oldProps, newProps) || !Tools.deepEqual(state, nextState);
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  __getLogParams: function (msg, msgParams, context) {
    let title = this.getTagName() + " [" + this.getId() + "]: ";
    let msgWithParams = msg ? Tools.formatString(msg, msgParams) : msgParams || null;

    context = context || {};
    context.thisTagName = this.getTagName();
    context.this = this;
    context.thisProps = this.props;
    context.thisState = this.state;

    return [title + msgWithParams, context];
  },

  __styleStringToObject(style) {
    if (typeof style !== "string") return;

    return Style.parse(style);
  },

  __getContextLanguages() {
    if (this.state && this.state.language) {
      let langParts = this.state.language.split("-");
      let language = [
        {
          language: langParts[0],
          location: langParts[1] ? this.state.language : null,
          q: 1,
        },
      ];
      return language;
    }
  },
  //@@viewOff:private
};

export default BaseMixin;
