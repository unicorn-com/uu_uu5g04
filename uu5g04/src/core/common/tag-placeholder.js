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
import PropTypes from "prop-types";
import ns from "./common-ns.js";
import BaseMixin from "./base-mixin.js";
import Tools from "./tools.js";
import NotFoundTag from "./not-found-tag.js";
import VisualComponent from "./visual-component.js";
import {
  getComponentByName,
  _loadComponentByName,
  useDynamicLibraryComponent,
} from "./internal/use-dynamic-library-component.js";
//@@viewOff:imports

useDynamicLibraryComponent._backCompatGetComponent = (componentName, item, Component, error) => {
  if (Component != null) return { Component, error };

  let tagArray = componentName.split(".");
  let calculatedTag = window;
  while (calculatedTag && ["object", "function"].indexOf(typeof calculatedTag) > -1 && tagArray.length > 0) {
    calculatedTag = calculatedTag[tagArray.shift()];
  }
  let result = calculatedTag || null;
  return { Component: result, error: result != null ? undefined : error };
};

export const TagPlaceholder = VisualComponent.create({
  displayName: "TagPlaceholder", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("TagPlaceholder"),
    classNames: {
      main: ns.css("tag-placeholder"),
    },
    errors: {
      serverError: "Unexpected error: %s.",
    },
    defaults: {
      regexpVersion: /\/\d*\.\d*\.\d*(?:-[a-z]+\d+(?:\.\d){0,2})?\//g,
      regexpSlash: /\//g,
      regexpDigit: /^\d/g,
    },
    opt: {
      hoc: true,
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tagName: PropTypes.string, // deprecated
    props: PropTypes.object, // deprecated
    content: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]), // deprecated
    error: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.element]), // deprecated
    _tagName: PropTypes.string,
    _props: PropTypes.object,
    _content: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    _error: PropTypes.oneOfType([PropTypes.func, PropTypes.string, PropTypes.element]),
    _fromFindComponent: PropTypes.bool,
    _onLoad: PropTypes.func,
  },
  //@@viewOff:propTypes
  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      tagName: null,
      props: null,
      content: null,
      error: null,
      _tagName: null,
      _props: null,
      _content: null,
      _error: null,
      _fromFindComponent: false,
      _onLoad: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentDidMount() {
    if (!this.props._fromFindComponent) {
      Tools.warning('Component "TagPlaceholder" is deprecated! Use "UU5.Common.Tools.findComponent()" method instead.');
    }
    this._runEffects();
  },

  componentDidUpdate(prevProps, prevState) {
    this._runEffects(prevProps, prevState);
  },

  _runEffects(prevProps, prevState) {
    let [prevComponentName, prevComponent, prevError] = this._prevCurrent || [];
    let [componentName, Component, error] = this._current;
    if (Component !== prevComponent || componentName !== prevComponentName || error !== prevError) {
      if (Component == null && error == null) {
        _loadComponentByName(componentName, () => {
          if (!this.isRendered()) return;
          if (this.props._fromFindComponent && typeof this.props._onLoad === "function") {
            let { Component, error } = getComponentByName(componentName);
            this.props._onLoad(
              error != null ? null : Component,
              error != null ? this.props.error || new Error(`Component ${componentName} has not been found.`) : null
            );
          }
          this.forceUpdate();
        });
      }
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _get(key, props = this.props) {
    return props._fromFindComponent ? props["_" + key] : props[key];
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const { _tagName, _props, _content, _error, _fromFindComponent, _onLoad, ...restProps } = this.props;
    let mergedProps = { ...restProps, ...this._get("props") };
    let componentName = this._get("tagName");

    // TODO Replace with:
    //   let { Component, /* errorData,*/ state } = useDynamicLibraryComponent(componentName);
    // when uu5g05 gets integrated with g04. Note that calling of this.props._onLoad might need tweaking
    // (optimally it should be called before rendering of the loaded component, i.e. before render phase).
    // Also remove _runEffects & related fns after the integration.
    let { Component, state } = (() => {
      let { Component, error } = getComponentByName(componentName);
      this._prevCurrent = this._current;
      this._current = [componentName, Component, error];
      return {
        Component: Component ?? null,
        errorData: error ? { error } : null,
        state: error != null ? "error" : Component != null ? "ready" : "pending",
      };
    })();

    return state === "error" ? (
      <NotFoundTag {...mergedProps} tagName={componentName} error={this._get("error")} />
    ) : Component ? (
      <Component {...mergedProps}>{_fromFindComponent ? _content : this.props.content}</Component>
    ) : null;
  },
  //@@viewOff:render
});

export default TagPlaceholder;
