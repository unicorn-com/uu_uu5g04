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

import TextInputMixin from './mixins/text-input-mixin.js'

import ItemList from './internal/item-list.js';

import Context from "./form-context.js";

import './text-area.less';

export const TextArea = Context.withContext(
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
      tagName: ns.name("TextArea"),
      classNames: {
        main: ns.css("text-area"),
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
      rows: PropTypes.number,
      autoResize: PropTypes.bool,
      maxRows: PropTypes.number,
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps: function () {
      return {
        value: '',
        rows: 3,
        autoResize: false,
        maxRows: null
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:standardComponentLifeCycle
    componentWillMount() {
      if (this.props.onValidate && typeof this.props.onValidate === 'function') {
        this._validateOnChange({ value: this.state.value, event: null, component: this })
      } else {
        // this.setInitial(null, this.state.value)
      }

      return this;
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.controlled) {
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
    //@@viewOff:overridingMethods

    //@@viewOn:componentSpecificHelpers
    _validateOnChange(opt, checkValue) {
      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = typeof this.props.onValidate === 'function' ? this.props.onValidate(opt) : null;
        if (result) {
          if (typeof result === 'object') {
            if (result.feedback) {
              this.setFeedback(result.feedback, result.message, result.value);
            } else {
              this.setState({ value: opt.value });
            }
          } else {
            this.showError('validateError', null, { context: { event: e, func: this.props.onValidate, result: result } });
          }
        }
      }

      return this;
    },

    /* _getFeedbackIcon(){
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
    //@@viewOff:componentSpecificHelpers

    //@@viewOn:render
    render: function () {
      let inputId = this.getId() + '-input';
      let inputAttrs = this.props.inputAttrs || {};

      inputAttrs.className = (inputAttrs.className ? inputAttrs.className += " "  : "" ) + (this.getColorSchema() ? "color-schema-" + this.getColorSchema() : "");
      inputAttrs.className === "" ? delete inputAttrs.className : null;
      return (
        <div {...this._getInputAttrs()}>
          {this.getLabel(inputId)}
          {this.
          getInputWrapper([
            <TextInput
              id={inputId}
              name={this.props.name || inputId}
              value={this.state.value}
              placeholder={this.props.placeholder}
              type={'textarea'}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onFocus={this.onFocus}
              onKeyDown={this.onKeyDown}
              mainAttrs={inputAttrs}
              disabled={this.isComputedDisabled()}
              readonly={this.isReadOnly()}
              loading={this.isLoading()}
              rows={this.props.rows}
              autoResize={this.props.autoResize}
              maxRows={this.props.maxRows}
              ref_={(item) => this._textInput = item}
              feedback={this.getFeedback()}
              borderRadius={this.props.borderRadius}
              elevation={this.props.elevation}
              bgStyle={this.props.bgStyle}
              inputWidth={this._getInputWidth()}
            />
          ])}
        </div>
      );
    }
    //@@viewOff:render
  })
);

export default TextArea;
