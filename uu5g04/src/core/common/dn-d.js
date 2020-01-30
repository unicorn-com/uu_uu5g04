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
import Tools from "./tools.js";
import Context from "./context.js";
import BaseMixin from "./base-mixin.js";
import Component from "./component.js";
//@@viewOff:imports

const DnDContext = Context.create({});

const PassThrough = Component.create({
  displayName: "PassThrough", // for backward compatibility (test snapshots)
  render() {
    return this.props.children || null;
  }
});

/** Initializes react-dnd's DragDropContext and provides it to drag&drop context. */
const Provider = Component.create({
  displayName: "Provider", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    _initedDnD: {},
    _getDragDropContextFromReactDnD() {
      let partialDragDropContext;
      if (typeof SystemJS !== "undefined") {
        let reactDnd = SystemJS.get(SystemJS.normalizeSync("react-dnd"));
        if (reactDnd && reactDnd.DragDropContext) {
          let backend = SystemJS.get(
            SystemJS.normalizeSync(
              UU5.Common.Tools.isMobileOrTablet ? "react-dnd-touch-backend" : "react-dnd-html5-backend"
            )
          );
          if (backend) {
            if (backend.default) backend = backend.default;

            // re-use partialDragDropContext as much as possible to prevent React's error "Cannot have 2 backends at the same time."
            if (this._initedDnD.DragDropContext === reactDnd.DragDropContext && this._initedDnD.backend === backend) {
              partialDragDropContext = this._initedDnD.partialDragDropContext;
            } else {
              partialDragDropContext = reactDnd.DragDropContext(backend);
              this._initedDnD = { DragDropContext: reactDnd.DragDropContext, backend, partialDragDropContext };
            }
          }
        }
      }
      return partialDragDropContext;
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let partialDragDropContext = this.constructor._getDragDropContextFromReactDnD();
    return {
      value: {
        componentWithContext: null,
        checkDnDAvailability: this.checkDnDAvailability
      },
      partialDragDropContext,
      componentClass: partialDragDropContext ? partialDragDropContext(PassThrough) : null,
      needsExtraCheck: !partialDragDropContext
    };
  },

  componentDidMount() {
    // NOTE Detection in SystemJS whether "react-dnd" is loaded sometimes needs to wait for promise processing phase
    // (if using SystemJS.import("xyz").then(callback), then the detection will work in "callback" fn - i.e. it'll work
    // in uu5-app pages, but it won't work in uu5-lib demo pages because they're internally transpiled and run immediately)
    // => wait for promise processing phase if necessary
    if (this.state.needsExtraCheck) {
      Promise.resolve().then(() => {
        if (!this._unmounted) {
          let partialDragDropContext = this.constructor._getDragDropContextFromReactDnD();
          if (!partialDragDropContext) {
            Tools.error(
              "Unable to initialize drag&drop because react-dnd is not loaded in the page. Make sure that the application imports react-dnd, react-dnd-html5-backend and react-dnd-touch-backend."
            );
          }
          this.setState({
            partialDragDropContext,
            componentClass: partialDragDropContext ? partialDragDropContext(PassThrough) : null,
            needsExtraCheck: false
          });
        }
      });
    }
  },

  componentWillUnmount() {
    this._unmounted = true;
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  checkDnDAvailability() {
    let { partialDragDropContext } = this.state;
    if (!partialDragDropContext) {
      partialDragDropContext = this.constructor._getDragDropContextFromReactDnD();
      if (partialDragDropContext) {
        this.setState({
          partialDragDropContext,
          componentClass: partialDragDropContext ? partialDragDropContext(PassThrough) : null
        });
      }
    }
    return !!partialDragDropContext;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _setComponentWithContextRef(componentWithContext) {
    this.setState(state => {
      let result;
      if (state.partialDragDropContext && state.value.componentWithContext !== componentWithContext) {
        result = {
          value: { ...state.value, componentWithContext },
          needsExtraCheck: !state.partialDragDropContext
        };
      }
      return result;
    });
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { needsExtraCheck, value } = this.state;
    let ComponentWithContext = this.state.componentClass || PassThrough;
    return (
      <DnDContext.Provider value={value}>
        <ComponentWithContext key="dnd-wrap" ref={this._setComponentWithContextRef}>
          {needsExtraCheck ? null : this.props.children}
        </ComponentWithContext>
      </DnDContext.Provider>
    );
  }
  //@@viewOff:render
});

/**
 * Receives initialized DragDropContext and passes dragDropManager prop to the Component in prop "component".
 * If there's no DnDProvider in hierarchy above, it'll initialize one.
 */
const DnDConsumerWrapper = Component.create({
  displayName: "DnDConsumerWrapper", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _setCheckerRef(ref) {
    if (ref) {
      let result = this._checkDnDAvailability();
      if (!result) this.forceUpdate(); // DnD not available, i.e. Context value didn't change during _checkDnDAvailability => forceUpdate to re-render ourselves (and render our children)
      // else no-op - DnD is available, i.e. Context value will change (because Provider updated value due to _checkDnDAvailability) => don't do anything as we'll re-render automatically
    }
  },

  _renderConsumerInnerChild({ componentWithContext, checkDnDAvailability }) {
    let result;
    if (
      !componentWithContext &&
      typeof checkDnDAvailability === "function" &&
      this._checkDnDAvailability !== checkDnDAvailability
    ) {
      this._checkDnDAvailability = checkDnDAvailability;
      result = <PassThrough ref={this._setCheckerRef} />;
    } else {
      let Component = this.props.component;
      let { componentProps, componentRef } = this.props;
      result = (
        <Component
          dragDropManager={componentWithContext ? componentWithContext.getManager() : null}
          parent={this}
          {...componentProps}
          ref={componentRef}
        />
      );
    }
    return result;
  },

  _renderConsumerOuterChild({ componentWithContext, checkDnDAvailability }) {
    let result;
    if (typeof checkDnDAvailability !== "function") {
      if (this.props.componentProps.omitDragDropContext) {
        // we don't have DragDropContextProvider above us but we have omitDragDropContext
        // => handle as if Page initialized react-dnd's DragDropContext on its own without using our DnDProvider
        // (i.e. without <Page useDnD={true} .../>) and don't initialize our own
        result = this._renderConsumerInnerChild({});
      } else {
        // we don't have DragDropContextProvider above us => create one
        result = (
          <Provider>
            <DnDContext.Consumer>{this._renderConsumerInnerChild}</DnDContext.Consumer>
          </Provider>
        );
      }
    } else {
      this._hasOuterDnDProvider = true;
      result = this._renderConsumerInnerChild({ componentWithContext, checkDnDAvailability });
    }
    return result;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return <DnDContext.Consumer>{this._renderConsumerOuterChild}</DnDContext.Consumer>;
  }
  //@@viewOff:render
});

const withContext = function(Component) {
  let result = React.forwardRef((props, ref) => {
    return <DnDConsumerWrapper component={Component} componentProps={props} componentRef={ref} />;
  });

  let compName = Component.tagName || Component.displayName || Component.name || "Component";
  result.isUu5PureComponent = !!Component.tagName;
  result.hocFor = Component;
  result.displayName = `withDnDContext(${compName})`;

  return result;
};

export const DnD = {
  Provider,
  withContext
};
