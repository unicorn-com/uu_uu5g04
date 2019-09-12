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

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "./forms-ns.js";

import TextInput from './internal/text-input.js';

import TextInputMixin from './mixins/text-input-mixin.js';

import ItemList from './internal/item-list.js';

import Context from "./form-context.js";

import './text.less';

export const Text = Context.withContext(
  createReactClass({
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      TextInputMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Text"),
      classNames: {
        main: ns.css("text"),
      },
      errors: {
        validateError: 'Validated result is not object.'
      },
      lsi: () => (UU5.Environment.Lsi.Forms.message)
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: PropTypes.string,
      password: PropTypes.bool,
      pattern: PropTypes.string,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps: function () {
      return {
        value: '',
        password: false,
        pattern: null
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:standardComponentLifeCycle
    componentWillMount() {
      this._hasFocus = false;
      if (this.props.onValidate && typeof this.props.onValidate === 'function') {
        this._validateOnChange({ value: this.state.value, event: null, component: this });
      }
      return this;
    },

    componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        if (this.props.onValidate && typeof this.props.onValidate === 'function') {
          this._validateOnChange({ value: nextProps.value, event: null, component: this }, true);
        } else {
          this.setFeedback(nextProps.feedback, nextProps.message, nextProps.value);
        }
      }

      return this;
    },

    componentWillUnmount() {
      this._removeEvent();
    },
    //@@viewOff:standardComponentLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overridingMethods
    // TODO: tohle je ještě otázka - je potřeba nastavit hodnotu z jiné komponenty (musí být validace) a z onChange (neměla by být validace)
    setValue_(value, setStateCallback) {
      if (this._checkRequired({ value: value })) {
        if (typeof this.props.onValidate === 'function') {
          this._validateOnChange({ value: value, event: null, component: this })
        } else {
          this.setInitial(null, value, setStateCallback);
        }
      }

      return this;
    },

    open_(setStateCallback) {
      this.openDefault(() => this._open(setStateCallback));
    },

    close_(setStateCallback) {
      this.closeDefault(() => this._close(setStateCallback));
    },

    onBlurDefault_(opt) {
      if (this._checkRequired({ value: opt.value }) && !this.props.validateOnChange) {
        opt.required = this.props.required;
        let blurResult = this.getBlurFeedback(opt);
        this._setFeedback(blurResult.feedback, blurResult.message, blurResult.value);
      }
      return this;
    },
    //@@viewOff:overridingMethods

    //@@viewOn:componentSpecificHelpers
    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = this.onValidate(opt);
        if (result) {
          if (typeof result === 'object') {
            if (result.feedback) {
              _callCallback = false;
              this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
            } else {
              _callCallback = false;
              this.setState({ value: opt.value }, setStateCallback);
            }
          } else {
            this.showError('validateError', null, {
              context: {
                event: e,
                func: this.props.onValidate,
                result: result
              }
            });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

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
      let labelMatch = "[id='" + this.getId() + "'] label";
      let inputMatch = "[id='" + this.getId() + "'] input";
      let pickerMatch = "[id='" + this.getId() + "'] .uu5-forms-item-list";
      let result = {
        component: false,
        input: false,
        label: false,
        picker: false
      }
      let eventPath = this._getEventPath(e);
      eventPath.every((item) => {
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
      let itemList = this._itemList;
      let items = itemList && itemList.getRenderedChildren();

      UU5.Environment.EventListener.addWindowEvent('keydown', this.getId(), e => {
        if (items && e.which === 13) {
          // enter
          if (this.isOpen()) {
            e.preventDefault();
          } else {
            setTimeout(() => {
              this._onFocus();
            })
          }
        } else if (items && (e.which === 38 || e.which === 40)) {
          // top / bottom
          e.preventDefault();
        } else if (this._hasFocus && e.which === 9) {
          // tab
          let opt = { value: this.state.value, event: e, component: this };
          if (this.isOpen()) {
            this.close(() => this._onBlur(opt));
          } else {
            this._onBlur(opt);
          }
        } else if (items && e.which === 27 && this.isOpen()) {
          // esc
          e.preventDefault();
          this.focus();
          this.close();
        }
      });

      UU5.Environment.EventListener.addWindowEvent('keypress', this.getId(), e => {
        if (items) {
          if (this.isOpen()) {
            this.focus();
            this.close();
          }
        }
      });

      UU5.Environment.EventListener.addWindowEvent('keyup', this.getId(), e => {

        switch (e.which) {
          case 13: // enter
            if (items) {
              if (this.isOpen() && items[current]) {
                let opt = { value: e.target.value, event: e, component: this };
                itemList.changeValue(items[current].props.value, e, () => this._onBlur(opt));
              }
            }
            break;
          case 38: // top
            if (items) {
              e.preventDefault();
              current = current - 1 < -1 ? -1 : current - 1;
              if (this.isOpen()) {
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
              if (this.isOpen()) {
                current = current + 1 >= items.length ? items.length - 1 : current + 1;
                items && items.length && items[current].focus();
              } else {
                current = 0;
                this.open(() => {
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

      let opt = { value: this.state.value, event: e, component: this };
      if (!(clickData.input || clickData.picker)) {
        if (this.isOpen()) {
          this.close(() => this._onBlur(opt));
        } else {
          this._onBlur(opt);
        }
        this._removeEvent();
      }
    },

    _addEvent() {
      !this.props.disableBackdrop && window.addEventListener('mousedown', this._onMouseDown, true);
      return this;
    },

    _removeEvent() {
      if (!this.props.disableBackdrop) {
        window.removeEventListener("mousedown", this._onMouseDown, true);
      }

      UU5.Environment.EventListener.removeWindowEvent('keydown', this.getId());
      UU5.Environment.EventListener.removeWindowEvent('keyup', this.getId());
      return this;
    },

    _open(setStateCallback) {
      if (this._itemList) {
        this._itemList.open({
          onClose: this._close,
          aroundElement: this._textInput.findDOMNode(),
          position: "bottom",
          offset: 4
        }, setStateCallback);
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _close(setStateCallback) {
      if (this._itemList) {
        this._itemList.close(setStateCallback);
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _onBlur(opt) {
      if (this._hasFocus) {
        this._hasFocus = false;
        this._removeEvent();
        if (typeof this.props.onBlur === 'function') {
          this.props.onBlur(opt);
        } else {
          this.onBlurDefault(opt);
        }
      }

      return this;
    },

    _onFocus(e) {
      if (!this._hasFocus) {
        this._addKeyboardEvent();

        this._hasFocus = true;
        this._addEvent();
        let opt = { value: e.target.value || this.state.value, event: e, component: this };

        if (typeof this.props.onFocus === 'function') {
          this.props.onFocus(opt);
        } else {
          this.onFocusDefault(opt);
        }
      }

      return this;
    },

    _handleFocus(e) {
      this._onFocus(e);
      return this;
    },

    _getMainAttrs() {
      let attrs = this._getInputAttrs();
      attrs.id = this.getId();
      return attrs;
    },
    //@@viewOff:componentSpecificHelpers

    //@@viewOn:render
    render() {
      let inputId = this.getId() + '-input';
      let inputAttrs = this.props.inputAttrs || {};
      if (this.state.autocompleteItems){
        inputAttrs = UU5.Common.Tools.merge({ autoComplete: "off" }, inputAttrs);
      }
      inputAttrs.className === "" ? delete inputAttrs.className : null;
      return (
        <div {...this._getMainAttrs()} ref={(comp) => this._root = comp}>
          {this.getLabel(inputId)}
          {this.getInputWrapper([
            <TextInput
              id={inputId}
              name={this.props.name || inputId}
              value={this.state.value}
              placeholder={this.props.placeholder}
              type={this.props.password ? 'password' : this.props.type || 'text'}
              onChange={(!this.isReadOnly() && !this.isComputedDisabled()) ? this.onChange : null}
              onFocus={(!this.isReadOnly() && !this.isComputedDisabled()) ? this._handleFocus : null}
              onKeyDown={this.onKeyDown}
              mainAttrs={inputAttrs}
              disabled={this.isComputedDisabled()}
              readonly={this.isReadOnly()}
              loading={this.isLoading()}
              ref_={(item) => this._textInput = item}
              feedback={this.getFeedback()}
              borderRadius={this.props.borderRadius}
              elevation={this.props.elevation}
              bgStyle={this.props.bgStyle}
              inputWidth={this._getInputWidth()}
              colorSchema={this.props.colorSchema}
            />,
            this.state.autocompleteItems && <ItemList {...this._getItemListProps()}>
              {this._getChildren()}
            </ItemList>
          ])}
        </div>
      );
    }
    //@@viewOn:render
  })
);

export default Text;
