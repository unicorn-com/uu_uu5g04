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

import InputWrapper from './internal/input-wrapper.js';
import TextInput from './internal/text-input.js';

import TextInputMixin from './mixins/text-input-mixin.js'

import ItemList from './internal/item-list.js';

import Context from "./form-context.js";

import './text-button.less';

export const TextButton = Context.withContext(
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
      tagName: ns.name("TextButton"),
      classNames: {
        main: ns.css("text-button")
      },
      lsi: () => (UU5.Environment.Lsi.Forms.message)
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: PropTypes.string,
      buttons: PropTypes.arrayOf(PropTypes.shape({
          icon: PropTypes.string,
          onClick: PropTypes.func,
          colorSchema: PropTypes.string,
          bgStyle: PropTypes.string,
          borderRadius: PropTypes.string,
          elevation: PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5])
        })
      ),
      pattern: PropTypes.string,
      actionOnEnter: PropTypes.bool
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: '',
        buttons: null,
        pattern: null,
        actionOnEnter: false
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:standardComponentLifeCycle
    componentWillMount() {
      if (this.props.onValidate && typeof this.props.onValidate === 'function') {
        this._validateOnChange({ value: this.state.value, event: null, component: this })
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

    onFocusDefault_(opt) {
      let result = this.getFocusFeedback(opt);

      result && this.setFeedback(result.feedback, result.message, result.value);

      return this;
    },
    //@@viewOff:overridingMethods

    //@@viewOn:componentSpecificHelpers
    _onFocus(e) {
      let opt = { value: e.target.value, event: e, component: this };

      this._onFocusButton(opt);

      return this;
    },

    _onFocusButton(opt) {
      if (typeof this.props.onFocus === 'function') {
        this.props.onFocus(opt);
      } else {
        this.onFocusDefault(opt);
      }

      return this;
    },

    _onEnter(e) {
      if ((e.keyCode || e.which) === 13 && !e.shiftKey && !e.ctrlKey && this.props.buttons && typeof this.props.buttons[0].onClick === "function") {
        this.props.buttons[0].onClick({ value: this.state.value, component: this });
      }
    },

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
            this.showError('validateError', null, { context: { event: e, func: this.props.onValidate, result: result } });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    /*_getFeedbackIcon(){
      let icon = this.props.required ? this.props.successIcon : null;
      switch (this.getFeedback()) {
        case 'success':
          icon = this.props.successIcon;
          break;
        case 'warning':
          icon = this.props.warningIcon;
          break;
        case 'error':
          icon = this.props.errorIcon;
          break;
      }
      return icon;
    },*/

    _getButtons() {
      let result = [];
      if (!this.isReadOnly()) {
        this.props.buttons && this.props.buttons.map((button, key) => {
          let newButton = UU5.Common.Tools.merge({
            size: this.props.size,
            colorSchema: this.props.colorSchema
          }, button);
          if (typeof button.onClick === 'function') {
            newButton.onClick = () => {
              this._onFocusButton({ value: this.state.value, component: this });
              button.onClick({ value: this.state.value, component: this });
            };
          }
          if (this.isComputedDisabled()) {
            newButton.disabled = true;
          }
          result.push(newButton);
        });
      }
      return result;
    },
    //@@viewOff:componentSpecificHelpers

    //@@viewOn:render
    render() {
      let inputId = this.getId() + '-input';

      let inputAttrs = this.props.inputAttrs || {};
      if (this.props.actionOnEnter) {
        inputAttrs.onKeyPress = this._onEnter;
      }
      inputAttrs.className === "" ? delete inputAttrs.className : null;
      return (
        <div {...this._getInputAttrs()}>
          {this.getLabel(inputId)}
          {this.getInputWrapper([
              <TextInput
                id={inputId}
                name={this.props.name || inputId}
                value={this.state.value}
                placeholder={this.props.placeholder}
                type='text'
                onChange={this.onChange}
                onBlur={this.onBlur}
                onFocus={this._onFocus}
                onKeyDown={this.onKeyDown}
                mainAttrs={inputAttrs}
                disabled={this.isComputedDisabled()}
                readonly={this.isReadOnly()}
                loading={this.isLoading()}
                feedback={this.getFeedback()}
                ref_={(item) => this._textInput = item}
                borderRadius={this.props.borderRadius}
                elevation={this.props.elevation}
                bgStyle={this.props.bgStyle}
                inputWidth={this._getInputWidth()}
                colorSchema={this.props.colorSchema}
              />,

              this.state.autocompleteItems && <ItemList {...this._getItemListProps()}>
                {this._getChildren()}
              </ItemList>,
              this.state.autocompleteItems && <UU5.Bricks.Backdrop {...this._getBackdropProps()} />],
            this._getButtons())}
        </div>
      );
    }
    //@@viewOn:render
  })
);

export default TextButton;
