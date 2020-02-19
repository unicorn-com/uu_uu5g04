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
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "../forms-ns.js";
import Css from "./css.js";
import ItemList from "./item-list.js";
import ItemsInput from "./items-input.js";

import "../select.less";
//@@viewOff:imports

const shouldOpenToContent = (openToContent, screenSize) => {
  let result = false;

  if (typeof openToContent === "string") {
    openToContent
      .trim()
      .split(" ")
      .some(size => {
        if (screenSize == size) {
          result = true;
          return true;
        } else {
          return false;
        }
      });
  } else if (typeof openToContent === "boolean") {
    result = openToContent;
  }

  return result;
};

const findScrollElement = element => {
  let result = null;

  while (element && element.tagName) {
    if (element.classList.contains("uu5-bricks-modal-body") || element === document.documentElement) {
      result = element;
      element = null;
    } else {
      element = element.parentNode;
    }
  }

  return result;
};

const FONT_SIZE = {
  s: "12px",
  m: "14px",
  l: "16px",
  xl: "18px"
};

const classes = {
  main: (props, state) => {
    let classNames = [ns.css("select-body")];
    let styles = `
      min-height: 32px;
      font-size: ${FONT_SIZE[props.size]};
      line-height: 19px;
    `;

    if (state.open && shouldOpenToContent(props.openToContent, state.screenSize)) {
      styles += `
        && {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
      `;
    }

    classNames.push(Css.css(styles));
    return classNames.join(" ");
  },
  itemList: (props, state) => {
    let styles = "";

    if (state.open && shouldOpenToContent(props.openToContent, state.screenSize)) {
      styles += `
        && {
          position: relative;
          margin-top: 0px;
          box-shadow: unset;
          border-radius: 0px;
          width: 100%;
        }
      `;
    }

    return styles ? Css.css(styles) : "";
  }
};

export const SelectBody = createReactClass({
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ScreenSizeMixin,
    UU5.Common.ColorSchemaMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("SelectBody"),
    classNames: {
      main: classes.main,
      itemList: classes.itemList,
      link: ns.css("select-link"),
      open: ns.css("select-open") + " " + ns.css("items-input-open"),
      multiple: ns.css("select-multiple"),
      selectAllEnabled: ns.css("select-all"),
      hasValue: ns.css("select-has-value"),
      screenSizeBehaviour: ns.css("screen-size-behaviour")
    },
    defaults: {
      childTagName: "UU5.Forms.Select.Option"
    },
    lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Forms.select, UU5.Environment.Lsi.Forms.message)
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    multiple: PropTypes.bool,
    selectAllEnabled: PropTypes.bool,
    allowTags: PropTypes.array,
    disableBackdrop: PropTypes.bool,
    borderRadius: PropTypes.string,
    bgStyle: PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    elevation: PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    openToContent: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    placeholder: PropTypes.string,
    iconOpen: PropTypes.string,
    iconClosed: PropTypes.string,
    forceRender: PropTypes.bool,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    feedback: PropTypes.string,
    inputWidth: PropTypes.string,
    mainAttrs: UU5.Common.BaseMixin.propTypes.mainAttrs,
    name: UU5.Common.BaseMixin.propTypes.name,
    id: UU5.Common.BaseMixin.propTypes.id
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      value: null,
      multiple: false,
      allowTags: [],
      selectAllEnabled: false,
      disableBackdrop: false,
      borderRadius: null,
      bgStyle: null,
      elevation: null,
      openToContent: "xs",
      onOpen: undefined,
      onClose: undefined,
      onChange: undefined,
      onRemove: undefined,
      placeholder: undefined,
      iconOpen: "mdi-menu-up",
      iconClosed: "mdi-menu-down",
      forceRender: false,
      readOnly: false,
      loading: false,
      feedback: "initial",
      inputWidth: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillUnmount() {
    this._removeEvent();
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.isOpen()) {
      if (
        (this.state.screenSize === "xs" && prevState.screenSize !== "xs") ||
        (this.state.screenSize !== "xs" && prevState.screenSize === "xs")
      ) {
        this._reopen();
      }
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isSelect() {
    return true;
  },

  isOpen() {
    return this.state.open;
  },

  open(setStateCallback) {
    let callback;
    this.setState(
      state => {
        let result = !state.open ? { open: true } : undefined;
        if (result) {
          this._addEvent();
          callback = () => this._onOpen(setStateCallback);
        } else {
          callback = setStateCallback;
        }
        return result;
      },
      () => typeof callback === "function" && callback()
    );
    return this;
  },

  close(setStateCallback) {
    let callback;
    this.setState(
      state => {
        let result = state.open ? { open: false } : undefined;
        if (result) callback = () => this._onClose(setStateCallback);
        else callback = setStateCallback;
        return result;
      },
      () => typeof callback === "function" && callback()
    );
    return this;
  },

  toggle(setStateCallback) {
    this.setState(
      state => {
        if (!state.open) {
          this._addEvent();
        }

        return { open: !state.open };
      },
      () => (this.isOpen() ? this._onOpen(setStateCallback) : this._onClose(setStateCallback))
    );
    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagName = this.getDefault().childTagName;
    let childTagNames = this.props.allowTags.concat(defaultChildTagName);
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagName], {
          mixinName: "UU5.Common.BaseMixin"
        });
      else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _registerInput(ref) {
    this._textInput = ref;
  },

  _getEventPath(e) {
    let path = [];
    let node = e.target;
    while (node != document.body && node != document.documentElement && node) {
      path.push(node);
      node = node.parentNode;
    }
    return path;
  },

  _findTarget(e) {
    let labelMatch = "[id='" + this.getId() + "'] label";
    let inputMatch = "[id='" + this.getId() + "-input'].uu5-forms-items-input";
    let pickerMatch = "[id='" + this.getId() + "-item-list-inner'].uu5-forms-item-list";
    let itemMatch = "[id='" + this.getId() + "-item-list'] .items-input-item";
    let result = {
      component: false,
      input: false,
      item: false,
      label: false,
      picker: false
    };
    let eventPath = this._getEventPath(e);
    eventPath.every(item => {
      let functionType = item.matches ? "matches" : "msMatchesSelector";
      if (item[functionType]) {
        if (item[functionType](labelMatch)) {
          result.label = true;
        } else if (item[functionType](inputMatch)) {
          result.input = true;
          return false;
        } else if (item[functionType](pickerMatch)) {
          result.picker = true;
          return false;
        } else if (item[functionType](itemMatch)) {
          result.item = true;
        }
        return true;
      } else {
        return false;
      }
    });

    return result;
  },

  _handleClick(e) {
    // This function can be called twice if clicking inside the component but it doesnt do anything in that case
    let clickData = this._findTarget(e);
    if (!this.props.disableBackdrop) {
      if (!clickData.input && !clickData.picker) {
        this._removeEvent();
        if (this.isOpen()) {
          this.close(this.props.onClose);
        }
      } else {
        document.getElementById(this.getId() + "-input").blur();
      }
    }

    return this;
  },

  _addEvent() {
    window.addEventListener("click", this._handleClick, true);
  },

  _removeEvent(notKeys) {
    if (!notKeys) {
      UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId());
      UU5.Environment.EventListener.removeWindowEvent("keyup", this.getId());
    }

    window.removeEventListener("click", this._handleClick, true);
  },

  _addKeyEvents() {
    let current = 0;
    let itemList = this._itemList;
    let items = itemList.getRenderedChildren();

    let handleKeyDown = e => {
      if (e.which === 13) {
        e.preventDefault();
      } else if (e.which === 38 || e.which === 40) {
        e.preventDefault();
      } else if (e.which === 27) {
        this.close(this.props.onClose);
        e.preventDefault();
      } else if (e.which === 9) {
        this._removeEvent();
        this.close(this.props.onClose);
      }
    };

    let handleKeyUp = e => {
      switch (e.which) {
        case 13: // enter
          if (!this.isOpen()) {
            this.open(() => items[current].focus());
          } else {
            this._onItem({ value: items[current].props.value });
          }
          break;
        case 38: // top
          e.preventDefault();
          current = current - 1 < 0 ? 0 : current - 1;
          if (this.isOpen()) {
            items[current].focus();
          }
          break;
        case 40: // bottom
          e.preventDefault();
          if (this.isOpen()) {
            current = current + 1 >= items.length ? items.length - 1 : current + 1;
            items[current].focus();
          } else {
            this.open(() => items[current].focus());
          }
          break;
        default:
          break;
      }
    };

    UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), e => handleKeyDown(e));
    UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), e => handleKeyUp(e));
  },

  _valuesToValuesArray(newValue, newChildren) {
    let value = [];
    let children = newChildren || this.getChildren();

    if (children) {
      if (!Array.isArray(children)) children = [children];

      for (let i = 0; i < children.length; i++) {
        let childValue = children[i].props.value;
        if (typeof newValue === "string") {
          if (newValue === childValue) {
            value.push(newValue);
          }
        } else if (newValue && newValue.length > 0) {
          if (newValue.indexOf(childValue) > -1) {
            value.push(childValue);
          } else if (typeof newValue[i] === "number") {
            value.push(children[newValue[i]].props.value);
          }
        }
      }
    }

    return value;
  },

  _onItem(opt) {
    let multiple = this.props.multiple;

    if (this.isOpen() && opt && opt.value != null) {
      let value = [];
      if (opt.value !== null) {
        if (multiple) {
          if (this.props.value && this.props.value.length > 0) {
            for (let i = 0; i < this.props.value.length; i++) {
              value.push(this.props.value[i]);
            }
          }
          if (opt.value !== this.props.value || this.props.value.length === 0) {
            let itemPosition = value.indexOf(opt.value);
            if (itemPosition < 0) {
              value.push(opt.value);
            } else {
              value.splice(itemPosition, 1);
            }
          } else {
            value = [];
          }
        } else {
          value = [opt.value];
        }
      }

      opt._data = { type: "changeValue", value: opt.value, multiple, result: value };

      if (typeof this.props.onChange === "function") {
        multiple ? this.props.onChange(opt) : this.toggle(() => this.props.onChange(opt));
      }
    }
  },

  _onFocus() {
    this._addKeyEvents();
  },

  _getItemValues(children) {
    let result = [];
    if (this.props.placeholder && children === null) {
      result.push(<UU5.Bricks.Span className={this.getClassName("placeholder")} content={this.props.placeholder} />);
    }

    if (children && this.props.value) {
      if (Array.isArray(this.props.value)) {
        for (let i = 0; i < this.props.value.length; i++) {
          let child = children.find(child => child.props.value === this.props.value[i]);
          let childContent = child
            ? child.props.selectedContent || child.props.content || child.props.children || child.props.value
            : null;
          result.push(childContent);
        }
      } else {
        result = [this.props.value];
      }
    }

    return result;
  },

  _getHeader() {
    let result;

    if (this.props.selectAllEnabled && this.props.multiple) {
      let label = this._isSelectedAll() ? this.getLsiComponent("unselectAll") : this.getLsiComponent("selectAll");
      result = (
        <UU5.Bricks.Link
          content={label}
          onClick={this._selectAll}
          className={this.getClassName("link")}
          colorSchema="grey"
        />
      );
    }

    return result;
  },

  _getChildren() {
    let children = [];

    if (this.props.children) {
      let childTagNames = this.props.allowTags.concat(this.getDefault().childTagName);
      React.Children.toArray(this.props.children).forEach(child => {
        let childTagName = UU5.Common.Tools.getChildTagName(child);
        const newProps = UU5.Common.Tools.merge({}, child.props);
        newProps.mainAttrs = newProps.mainAttrs || {};
        newProps.mainAttrs.tabIndex = "-1";
        child = this.cloneChild(child, newProps);
        if (childTagNames.indexOf(childTagName) > -1) {
          children.push(child);
        }
      });
    }

    return children;
  },

  _selectAll() {
    let result = [];

    if (!this._isSelectedAll()) {
      this._getChildren().forEach((item, i) => {
        result.push(item.props.value);
      });
    }

    let opt = { value: result, component: this, _data: { type: "selectAll", value: result } };

    if (typeof this.props.onChange === "function") {
      this.props.onChange(opt);
    }
  },

  _isSelectedAll() {
    let result = false;
    if (this.props.children && this.props.value) {
      if (this._getChildren().length === this.props.value.length) {
        result = true;
      }
    }
    return result;
  },

  _onOpen(setStateCallback) {
    let callback =
      typeof this.props.onOpen === "function" ? () => this.props.onOpen(setStateCallback) : setStateCallback;

    if (this._itemList) {
      this._itemList.open(
        {
          onClose: this._onClose,
          aroundElement: UU5.Common.DOM.findNode(this._textInput),
          position: "bottom",
          offset: shouldOpenToContent(this.props.openToContent, this.state.screenSize) ? 0 : 4,
          preventPositioning: shouldOpenToContent(this.props.openToContent, this.state.screenSize)
        },
        callback
      );
    } else if (typeof callback === "function") {
      callback();
    }
  },

  _onClose(setStateCallback) {
    let callback =
      typeof this.props.onClose === "function" ? () => this.props.onClose(setStateCallback) : setStateCallback;

    if (this._itemList) {
      this._itemList.close(callback);
    } else if (typeof callback === "function") {
      callback();
    }
  },

  _reopen() {
    if (this._itemList) {
      this._itemList.open({
        onClose: this._onClose,
        aroundElement: UU5.Common.DOM.findNode(this._textInput),
        position: "bottom",
        offset: shouldOpenToContent(this.props.openToContent, this.state.screenSize) ? 0 : 4,
        preventPositioning: shouldOpenToContent(this.props.openToContent, this.state.screenSize)
      });
    }
  },

  _getIcon() {
    let icon = null;

    if (
      (!this.props.multiple || !this.state.value || !this.state.value.length) &&
      !this.props.disabled &&
      !this.props.readOnly
    ) {
      if (this.isOpen()) {
        return this.props.iconOpen;
      } else {
        return this.props.iconClosed;
      }
    }

    return icon;
  },

  _getItemListProps() {
    let props = {};

    props.id = `${this.getId()}-item-list`;
    props.className = this.getClassName("itemList");
    props.hidden = !this.isOpen();
    props.ref_ = itemList => (this._itemList = itemList);
    props.onChange = opt => this._onItem(opt);
    props.value = this.props.value;
    props.multiple = this.props.multiple;
    props.allowTags = this.props.allowTags;
    props.forceRender = this.props.forceRender;
    props.header = this._getHeader();
    props.parent = this;

    return props;
  },

  _getMainPropsToPass() {
    let props = this.getMainPropsToPass();

    if (this.isOpen()) {
      props.className += " " + this.getClassName("open");
    }

    if (this.props.multiple) {
      props.className += " " + this.getClassName("multiple");
    }

    if (this.props.selectAllEnabled) {
      props.className += " " + this.getClassName("selectAllEnabled");
    }

    if (this.props.value && this.props.value.length) {
      props.className += " " + this.getClassName("hasValue");
    }

    if (shouldOpenToContent(this.props.openToContent, this.state.screenSize)) {
      props.className += " " + this.getClassName("screenSizeBehaviour");
    }

    return props;
  },

  _getMainAttrs() {
    let attrs = this.props.mainAttrs || {};

    if (!this.props.readOnly && !this.props.disabled) {
      attrs = UU5.Common.Tools.merge(
        {
          tabIndex: !this.props.readOnly && !this.props.disabled ? "0" : undefined,
          onFocus: !this.props.readOnly && !this.props.disabled ? () => this._onFocus() : null
        },
        attrs
      );
    }

    let handleClick = e => {
      let clickData = this._findTarget(e.nativeEvent);
      if (clickData.input && ((this.isOpen() && !clickData.item) || !this.isOpen())) {
        document.activeElement.blur();
        e.preventDefault();
        this.toggle(() =>
          this.isOpen() && shouldOpenToContent(this.props.openToContent, this.state.screenSize)
            ? UU5.Common.Tools.scrollToTarget(
                this.getId() + "-input",
                false,
                UU5.Environment._fixedOffset + 20,
                findScrollElement(this._textInput)
              )
            : null
        );
      }
    };

    if (!this.props.readOnly && !this.props.disabled) {
      let originalOnClick = attrs.onClick;
      attrs.onClick = e => {
        if (typeof originalOnClick === "function") {
          originalOnClick(e);
        }

        handleClick(e);
      };
    }

    return attrs;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let children = this._getChildren();

    return (
      <>
        <ItemsInput
          {...this._getMainPropsToPass()}
          key="input"
          id={this.getId() + "-input"}
          name={this.props.name || this.props.id}
          value={this._getItemValues(children)}
          placeholder={this.props.placeholder}
          multiple={this.props.multiple}
          mainAttrs={this._getMainAttrs()}
          disabled={this.props.disabled || this.props.loading}
          readonly={this.props.readOnly}
          loading={this.props.loading}
          onItemClick={!this.props.readOnly && !this.props.disabled ? this.props.onRemove : null}
          icon={this._getIcon()}
          feedback={this.props.feedback}
          ref_={this._registerInput}
          borderRadius={this.props.borderRadius}
          elevation={this.props.elevation}
          bgStyle={this.props.bgStyle}
          inputWidth={this.props.inputWidth}
        />
        <ItemList key="itemList" {...this._getItemListProps()}>
          {this.isOpen() && children}
        </ItemList>
      </>
    );
  }
  //@@viewOff:render
});

export default SelectBody;
