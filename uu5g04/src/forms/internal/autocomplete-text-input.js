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
import "uu5g04-bricks";

import ItemList from "./item-list.js";
import TextInput from "./text-input.js";
import ns from "../forms-ns.js";
//@@viewOff:imports

const INPUT_TYPE_TEXT = "text";
const INPUT_TYPE_PASSWORD = "password";
const INPUT_TYPE_TEXTAREA = "textarea";

export const AutocompleteTextInput = UU5.Common.VisualComponent.create({
  displayName: "autocomplete-text-input",
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.LsiMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("AutocompleteTextInput")
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    value: UU5.PropTypes.string,
    placeholder: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
    type: UU5.PropTypes.oneOf([INPUT_TYPE_TEXT, INPUT_TYPE_PASSWORD, INPUT_TYPE_TEXTAREA]),
    onChange: UU5.PropTypes.func,
    onBlur: UU5.PropTypes.func,
    onFocus: UU5.PropTypes.func,
    onKeyDown: UU5.PropTypes.func,
    icon: UU5.PropTypes.string,
    loading: UU5.PropTypes.bool,
    rows: UU5.PropTypes.number,
    iconOnClick: UU5.PropTypes.func,
    autoResize: UU5.PropTypes.bool,
    maxRows: UU5.PropTypes.number,
    feedback: UU5.PropTypes.string,
    borderRadius: UU5.PropTypes.string,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
    inputWidth: UU5.PropTypes.string,
    colorSchema: UU5.PropTypes.string,

    open: UU5.PropTypes.bool,
    itemsListItems: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        value: UU5.PropTypes.string,
        params: UU5.PropTypes.object,
        content: UU5.PropTypes.any
      })
    ),
    foundItemListItems: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        value: UU5.PropTypes.string,
        params: UU5.PropTypes.object,
        content: UU5.PropTypes.any
      })
    ),
    itemListProps: UU5.PropTypes.object,
    onClose: UU5.PropTypes.func,
    onOpen: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      value: "",
      placeholder: null,
      type: INPUT_TYPE_TEXT,
      onChange: null,
      onBlur: null,
      onFocus: null,
      onKeyDown: null,
      icon: null,
      loading: false,
      rows: null,
      iconOnClick: null,
      autoResize: false,
      maxRows: null,
      feedback: null,
      borderRadius: null,
      bgStyle: null,
      elevation: null,
      inputWidth: null,
      colorSchema: null,

      open: false,
      itemsListItems: undefined,
      foundItemListItems: undefined,
      itemListProps: undefined,
      onClose: undefined,
      onOpen: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  componentWillMount() {
    this._hasFocus = false;
  },

  componentWillUnmount() {
    this._removeEvent();
  },

  componentDidUpdate(prevProps) {
    if (prevProps.open === false && this.props.open === true) {
      this._open();
    } else if (prevProps.open === true && this.props.open === false) {
      this._close();
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  focus() {
    this._textInput.focus();
  },

  hasFocus() {
    return document.activeElement === this._textInput;
  },

  getInput() {
    return this._textInput ? this._textInput.getInput() : null;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getEventPath(e) {
    let path = [];
    let node = e.target;

    while (node && node !== document.body && node != document.documentElement) {
      path.push(node);
      node = node.parentNode;
    }

    return path;
  },

  _findTarget(e) {
    let labelMatch = "label[id='" + this.getId() + "']";
    let inputMatch = "input[id='" + this.getId() + "']";
    let pickerMatch = "[id='" + this.getId() + "-item-list-inner']";
    let result = {
      component: false,
      input: false,
      label: false,
      picker: false
    };
    let eventPath = this._getEventPath(e);
    eventPath.every(item => {
      let functionType = item.matches ? "matches" : "msMatchesSelector";
      if (item[functionType]) {
        if (item[functionType](labelMatch)) {
          result.label = true;
          result.component = true;
        } else if (item[functionType](inputMatch)) {
          result.input = true;
          result.component = true;
        } else if (item[functionType](pickerMatch)) {
          result.picker = true;
          result.component = true;
        } else if (item === this._root) {
          result.component = true;
          return false;
        }
        return true;
      } else {
        return false;
      }
    });

    return result;
  },

  _addKeyboardEvent() {
    let current = -1;
    let itemList;
    let items;

    UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), e => {
      itemList = this._itemList;
      items = itemList && itemList.getRenderedChildren();

      if (items && e.which === 13) {
        // enter
        if (this.props.open) {
          e.preventDefault();
        } else {
          setTimeout(() => {
            this._onFocus();
          });
        }
      } else if (items && (e.which === 38 || e.which === 40)) {
        // top / bottom
        e.preventDefault();
      } else if (this._hasFocus && e.which === 9) {
        // tab
        let opt = { value: this.props.value, event: e, component: this };
        if (this.props.open) {
          this._close(() => this._onBlur(opt));
        } else {
          this._onBlur(opt);
        }
      } else if (items && e.which === 27 && this.props.open) {
        // esc
        e.preventDefault();
        this.focus();
        this._close();
      }
    });

    UU5.Environment.EventListener.addWindowEvent("keypress", this.getId(), e => {
      if (items) {
        if (this.props.open) {
          this.focus();
          this._close();
        }
      }
    });

    UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), e => {
      switch (e.which) {
        case 13: // enter
          if (items) {
            if (this.props.open && items[current]) {
              let opt = { value: e.target.value, event: e, component: this };
              itemList.changeValue(items[current].props.value, e, () => this._onBlur(opt));
            }
          }
          break;
        case 38: // top
          if (items) {
            e.preventDefault();
            current = current - 1 < -1 ? -1 : current - 1;
            if (this.props.open) {
              if (current > -1) {
                items && items.length && items[current].focus();
              } else {
                this.focus();
              }
            }
          }
          break;
        case 40: // bottom
          if (items) {
            e.preventDefault();
            if (this.props.open) {
              current = current + 1 >= items.length ? items.length - 1 : current + 1;
              items && items.length && items[current].focus();
            } else {
              current = 0;
              this.props.onOpen(() => {
                itemList = this._itemList;
                items = itemList.getRenderedChildren();
                items && items.length && items[current].focus();
              });
            }
          }
          break;
        default:
          break;
      }
    });
  },

  _onMouseDown(e) {
    let clickData = this._findTarget(e);

    let opt = { value: this.props.value, event: e, component: this };
    if (!(clickData.input || clickData.picker)) {
      this._close(() => this._onBlur(opt));
      this._removeEvent();
    }
  },

  _addEvent() {
    !this.props.disableBackdrop && window.addEventListener("mousedown", this._onMouseDown, true);
  },

  _removeEvent() {
    if (!this.props.disableBackdrop) {
      window.removeEventListener("mousedown", this._onMouseDown, true);
    }

    UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId());
    UU5.Environment.EventListener.removeWindowEvent("keyup", this.getId());
  },

  _open(setStateCallback) {
    if (this._itemList) {
      this._itemList.open(
        {
          onClose: this._close,
          aroundElement: this._textInput.findDOMNode(),
          position: "bottom",
          offset: 4
        },
        setStateCallback
      );
    } else if (typeof setStateCallback === "function") {
      setStateCallback();
    }
  },

  _close(setStateCallback) {
    if (this._itemList) {
      this._itemList.close(
        typeof this.props.onClose === "function" ? () => this.props.onClose(setStateCallback) : setStateCallback
      );
    } else if (typeof setStateCallback === "function") {
      setStateCallback();
    }
  },

  _onBlur(opt) {
    if (this._hasFocus) {
      this._hasFocus = false;
      this._removeEvent();
      if (typeof this.props.onBlur === "function") {
        this.props.onBlur(opt);
      }
    }
  },

  _onFocus(e) {
    if (!this._hasFocus) {
      this._hasFocus = true;
      this._addKeyboardEvent();
      this._addEvent();
      let opt = { value: e.target.value || this.props.value, event: e, component: this };

      if (typeof this.props.onFocus === "function") {
        this.props.onFocus(opt);
      }
    }
  },

  _registerItemList(ref) {
    this._itemList = ref;
  },

  _registerInput(ref) {
    this._textInput = ref;
  },

  _getInputProps() {
    return {
      className: this.props.className,
      id: this.props.id,
      name: this.props.name || this.props.id,
      value: this.props.value || "",
      placeholder: this.props.placeholder,
      type: this.props.type,
      onChange: this.props.onChange,
      onFocus: this._onFocus,
      onKeyDown: this.props.onKeyDown,
      mainAttrs: this.props.mainAttrs,
      disabled: this.props.disabled,
      readonly: this.props.readonly,
      loading: this.props.loading,
      ref_: this._registerInput,
      feedback: this.props.feedback,
      borderRadius: this.props.borderRadius,
      elevation: this.props.elevation,
      bgStyle: this.props.bgStyle,
      inputWidth: this.props.inputWidth,
      colorSchema: this.props.colorSchema,
      icon: this.props.icon,
      iconOnClick: this.props.iconOnClick,
      clickable: this.props.clickable
    };
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Fragment>
        <TextInput {...this._getInputProps()} />
        {this.props.itemsListItems && (
          <ItemList {...this.props.itemListProps} ref={this._registerItemList} id={`${this.getId()}-item-list`}>
            {this.props.foundItemListItems}
          </ItemList>
        )}
      </UU5.Common.Fragment>
    );
  }
  //@@viewOn:render
});

export default AutocompleteTextInput;
