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
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

import ResizeObserver from "./resize-observer.js";
import ResizeItem from "./resize-item.js";

import "./resize.less";
//@@viewOff:imports

export const Resize = UU5.Common.VisualComponent.create({
  displayName: "Resize", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.ContentMixin, UU5.Common.NestingLevelMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Resize"),
    classNames: {
      main: ns.css("resize")
    },
    defaults: {
      childTagName: "UU5.Bricks.Resize.Item",
      childWidth: 0,
      childHeight: 0
    },
    opt: {
      nestingLevelWrapper: true
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    height: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    width: UU5.PropTypes.oneOfType([UU5.PropTypes.number, UU5.PropTypes.string]),
    onResize: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      height: null,
      width: null,
      onResize: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      width: 0,
      height: 0
    };
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.controlled) {
      if (this.state.height !== nextProps.height) {
        this.setState({ height: nextProps.height });
      }

      if (this.props.width !== nextProps.width) {
        this.setState({ width: nextProps.width });
      }
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isResize() {
    return true;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  expandChildProps_(child, index) {
    let childProps = { ...child.props };
    if (child.type && (!child.type.tagName || child.type.tagName !== ResizeItem.tagName)) {
      childProps.width = this.state ? this.state.width : this.getDefault().childWidth;
      childProps.height = this.state ? this.state.height : this.getDefault().childHeight;
    }
    return childProps;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _onResize({ width, height }) {
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({ width, height }, () => {
        if (typeof this.props.onResize === "function") {
          this.props.onResize({ width, height });
        }
      });
    }
  },

  _getItemToRenderData(currentWidth, allItems) {
    let itemToRenderData = {};

    allItems.forEach((item, i) => {
      if (item.props.max === null && Object.keys(itemToRenderData).length === 0) {
        itemToRenderData = { item: item, index: i };
      } else if (currentWidth <= item.props.max) {
        if (
          Object.keys(itemToRenderData).length === 0 ||
          item.props.max < itemToRenderData.item.props.max ||
          itemToRenderData.item.props.max === null
        ) {
          itemToRenderData = { item: item, index: i };
        }
      }
    });

    return itemToRenderData;
  },

  _getChildren() {
    let children = this.getChildren();
    children = Array.isArray(children) ? children.filter(item => typeof item === "object") : children;
    if (children[0] && children[0].type && children[0].type.tagName === ResizeItem.tagName) {
      let child = this._getItemToRenderData(this.state.width, children);
      children = child && child.item;
    }
    return children;
  },

  _renderChild() {
    let result = null;
    if (this.props.children) {
      switch (typeof this.props.children) {
        case "function":
          result = this.props.children({ width: this.state.width, height: this.state.height });
          break;
        case "object":
          result = this._getChildren();
          break;
      }
    }

    return result;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let props = this.getMainPropsToPass();
    props.id = this.getId();
    if (this.props.height) {
      props.style = props.style || {};
      props.style.height = this.props.height;
    }

    if (this.props.width) {
      props.style = props.style || {};
      props.style.width = this.props.width;
    }

    return (
      <UU5.Bricks.Div {...props}>
        {(!this.props.height || this.state.width) && this._renderChild()}
        <ResizeObserver key="ro" onInitialSize={this._onResize} onResize={this._onResize} />
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

Resize.Item = ResizeItem;

Resize.withResize = (Component, ignoreWidthChange = false, ignoreHeightChange = false) => {
  let PureComponent = UU5.Common.Component.memo(
    UU5.Common.Reference.forward((props, ref) => {
      return <Component {...props} ref={ref} />;
    })
  );

  let forwardRef = UU5.Common.Reference.forward((props, ref) => {
    return (
      <Resize height={props.height} width={props.width}>
        {({ width, height }) => (
          <PureComponent
            {...props}
            ref={ref}
            width={ignoreWidthChange ? undefined : width}
            height={ignoreHeightChange ? undefined : height}
          />
        )}
      </Resize>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

export default Resize;
