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
import UU5String from "./uu5string/uu5-string.js";
import ns from "./common-ns.js";

import "./editable-mixin.less";

const EDITABLE_MIXIN_NAME = "UU5.Common.EditableMixin";

const requestFrame = (function() {
  var raf =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function(fn) {
      return window.setTimeout(fn, 20);
    };
  return function(fn) {
    return raf(fn);
  };
})();
const cancelFrame = (function() {
  var cancel =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.clearTimeout;
  return function(id) {
    return cancel(id);
  };
})();

export const EditableMixin = {
  //@@viewOn:mixins
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Common.EditableMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      lsi: {
        header: {
          cs: "Editace komponenty %s",
          en: "%s editation"
        }
      },
      classNames: {
        docLink: ns.css("editable-doc-link")
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    getEditablePropValue: PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      getEditablePropValue: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState: function() {
    this.registerMixin(EDITABLE_MIXIN_NAME);
    this._resizeCallbacks = {};
    return {
      editation: false,
      editableComponentLazyLoaded: false
    };
  },

  componentDidMount() {
    // init dom node
    this._domNode = this.findDOMNode();
  },

  componentWillUnmount() {
    this._endResizeCheck();
  },

  componentDidUpdate() {
    // find possible new dom node
    this._domNode = this.findDOMNode();
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonEditableMixin() {
    return this.hasMixin(EDITABLE_MIXIN_NAME);
  },

  startWatchingResize(key, resizeCallback) {
    if (typeof resizeCallback !== "function") return;
    if (Object.keys(this._resizeCallbacks).length === 0) {
      // make initial size check
      this._componentWidth = this._domNode ? this._domNode.clientWidth : 0;
      this._componentHeight = this._domNode ? this._domNode.clientHeight : 0;
      // start checking size
      this._startResizeCheck();
    }
    this._resizeCallbacks[key] = resizeCallback;
  },

  stopWatchingResize(key) {
    delete this._resizeCallbacks[key];
    if (Object.keys(this._resizeCallbacks).length === 0) {
      this._endResizeCheck();
    }
  },

  /*
    Returns map of set props and theirs values. Prop editable is set to true as a default value.

    @param {array of string} propsArray - array with names of props
    @returns {json} map of props and theirs values
   */
  getEditablePropsValues(propsArray) {
    if (typeof this.getEditablePropsValues_ === "function") {
      return this.getEditablePropsValues_(propsArray);
    }
    return this.getEditablePropsValuesDefault(propsArray);
  },
  getEditablePropsValuesDefault(propsArray) {
    let result = {};
    propsArray.forEach(propName => {
      let propValue; // = this.props.dccEditor.getComponentPropByName(this.getId(), propName);
      // read prop value from data model - on component props should have modified values (dcc itself adds some props like id)
      if (typeof this.props.getEditablePropValue === "function") {
        propValue = this.props.getEditablePropValue(this, propName);
      }
      // read prop value directly from component if is not set
      if (propValue === undefined || propValue === null) {
        let value = this.props[propName];
        // preserve returning react components - like default content, etc.
        if (React.isValidElement(value)) {
          value = undefined;
        }
        propValue = value;
      }

      result[propName] = propValue;
    });

    return result;
  },
  /*
  Starts component editation. Function should be overriden by startDccEditation_ function on component. If overriden function returns JSON object with attribute content, editation will be handled by dcc editor. Otherwise sets dccEditation state to true.

  @param {func} callback
   */
  startEditation(endEditationCallback, saveEditationCallback) {
    this._inEditMode = true;
    this._endEditationCallback = endEditationCallback;
    this._saveEditationCallback = saveEditationCallback;
    let result = null;
    if (this.constructor.editableComponent) {
      let tagNameArr = this.getTagName().split(".");
      let docLink;
      let docBase = window[tagNameArr[0]].bookKitUrl || window[tagNameArr[0]][tagNameArr[1]].bookKitUrl;
      if (docBase) {
        let compName = tagNameArr[0].toLowerCase() + tagNameArr[1] + tagNameArr[2];
        docLink = docBase + "?code=" + compName;
      }
      result = {
        content: this._createContentFromUU5StringTemplate(
          `<uu5string /><${
            this.constructor.editableComponent
          } id="${this.getId()}_editable-brick" component="\${this}" />`,
          { this: this }
        ),
        header: (
          <UU5.Bricks.Div>
            {this.getLsiComponent("header", "UU5.Common.EditableMixin", this.getTagName())}
            {docLink ? (
              <UU5.Bricks.Link
                href={docLink}
                target={"_blank"}
                className={this.getClassName("docLink", "UU5.Common.EditableMixin")}
                key="docLink"
              >
                <UU5.Bricks.Icon icon="mdi-help-circle-outline" />
              </UU5.Bricks.Link>
            ) : null}
          </UU5.Bricks.Div>
        )
      };
    }
    if (!result) {
      // start inline editation
      this.setState({ editation: true });
    }
    return result;
  },

  isInlineEdited() {
    return !!this.state.editation;
  },

  saveEditation(newProps) {
    if (typeof this._saveEditationCallback === "function") {
      this._saveEditationCallback(this, newProps);
    }
  },
  /*
  Ends component editation. Function should be overridden by endDccEditation_ function. If newProps, newContent neither newContraints is not set it only ends editation of component without saving any data.

  @param {object} newProps - new Props to save
  @param {func} callback
   */
  endEditation(newProps) {
    this._inEditMode = false;
    let endEditationCallback = this._endEditationCallback;
    delete this._endEditationCallback;
    // change state only if state was change in startDccEditation method - so only if component does not have this.startDccEditation_ method
    if (this.state.editation) this.setState({ editation: false });
    if (typeof endEditationCallback === "function") {
      endEditationCallback(this, newProps);
    }
  },

  /*
  Force end of editation of the component. This function takes data to save from forceEndDccEditationHandler function. Returned props, content, constraints and callback function are used to call endDccEditation function.

  @param {func} callback
   */
  forceEndEditation() {
    if (!this._inEditMode) return;

    let props = null;

    if (typeof this.onBeforeForceEndEditation_ === "function") {
      props = this.onBeforeForceEndEditation_();
    }
    this.endEditation(props);
  },

  isNotInlineEdited() {
    return !this.state.editation || !this.constructor.editableComponentLazyLoaded;
  },

  getEditingLoading() {
    return <span ref={this._registerLazyLoading} />;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerLazyLoading(inst) {
    // unmount of component means that suspense is loaded and component should be rendered
    if (!inst) {
      this.setState(state => {
        if (state.editableComponentLazyLoaded) return;

        // Edit component is loaded - need to set to static variable because other Edit component does not render fallback component
        // editationLazyLoaded is stored in both state and static variable for cases such as when more edit modes are loaded at the same time
        this.constructor.editableComponentLazyLoaded = true;
        return { editableComponentLazyLoaded: true };
      });
    }
  },

  /*
    Returns react components from uu5string template and data.

    @param {uu5string} uu5string
    @parem {json} data for uu5string template
    @return {react classes}
   */
  _createContentFromUU5StringTemplate(uu5string, data) {
    let content = new UU5String(uu5string).toChildren(data);
    return content;
  },

  _updateComponentSize() {
    let width = this._domNode ? this._domNode.clientWidth : 0;
    let height = this._domNode ? this._domNode.clientHeight : 0;
    let sizeChanged =
      (this._componentWidth !== undefined && this._componentWidth !== width) ||
      (this._componentHeight !== undefined && this._componentHeight !== height);
    this._componentWidth = width;
    this._componentHeight = height;

    if (sizeChanged) {
      this._fireResizeEvent(width, height);
    }
  },

  _fireResizeEvent(width, height) {
    for (let key in this._resizeCallbacks) {
      let callback = this._resizeCallbacks[key];
      callback({ id: this.getId(), width, height });
    }
    // this.props.dccEditor.fireDccEvent(EVENTS.EVENT_COMPONENT_RESIZE, {componentId: this.getId()});
  },

  _startResizeCheck() {
    this._resizeListener = requestFrame(() => {
      this._updateComponentSize();
      this._startResizeCheck();
    });
  },

  _endResizeCheck() {
    cancelFrame(this._resizeListener);
  }
  //@@viewOff:private
};

export default EditableMixin;
