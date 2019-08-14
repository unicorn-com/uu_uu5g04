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
import ns from "../forms-ns.js";
import ClassNames from "../../core/common/class-names.js";

import Loading from './loading.js';

import './text-input.less';

const INPUT_TYPE_TEXT = 'text';
const INPUT_TYPE_PASSWORD = 'password';
const INPUT_TYPE_TEXTAREA = 'textarea';

export default UU5.Common.LsiMixin.withContext(
  createReactClass({
    displayName: "text-input",
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.LsiMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("TextInput"),
      classNames: {
        main: ns.css("text-input"),
        loading: ns.css("input-loading-icon"),
        item: ns.css("input-form-item"),
        text: ns.css("input-form-item-text"),
        textarea: ns.css("input-form-item-textarea"),
        hiddenDiv: ns.css("input-hidden-div"),
        hiddenTextarea: ns.css("input-hidden-textarea"),
        autoResizeTextarea: ns.css("input-auto-resize-textarea"),
        iconLink: ns.css("text-icon-link"),
        iconLinkReadOnly: ns.css("text-icon-link-read-only"),
        inputError: ns.css("input-error")
      }
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: PropTypes.string,
      placeholder: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
      ]),
      type: PropTypes.oneOf([INPUT_TYPE_TEXT, INPUT_TYPE_PASSWORD, INPUT_TYPE_TEXTAREA]),
      onChange: PropTypes.func,
      onBlur: PropTypes.func,
      onFocus: PropTypes.func,
      onKeyDown: PropTypes.func,
      icon: PropTypes.string,
      loading: PropTypes.bool,
      rows: PropTypes.number,
      iconOnClick: PropTypes.func,
      autoResize: PropTypes.bool,
      maxRows: PropTypes.number,
      feedback: PropTypes.string,
      borderRadius: PropTypes.string,
      bgStyle: PropTypes.oneOf(['filled', 'outline', 'transparent', 'underline']),
      elevation: PropTypes.oneOf(['-1', '0', '1', '2', '3', '4', '5', -1, 0, 1, 2, 3, 4, 5]),
      inputWidth: PropTypes.string,
      colorSchema: PropTypes.string
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: '',
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
        colorSchema: null
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:standardComponentLifeCycle
    componentDidMount() {
      if (this.props.autoResize || this.props.maxRows) {
        this._setHeight()
      }

      if (this.props.type === "password") {
        // disabled bfcache in FF so that it doesnt remember password value when navigating back
        UU5.Environment.EventListener.addWindowEvent("unload", this.getId(), () => {});
      }
    },

    componentWillUnmount() {
      if (this.props.type === "password") {
        UU5.Environment.EventListener.removeWindowEvent("unload", this.getId());
      }
    },

    componentDidUpdate(prevProps, prevState) {
      if ((this.props.autoResize || this.props.maxRows) && prevProps.value !== this.props.value) {
        this._setHeight(() => {
          let textArea = document.getElementById(this.getId());
          textArea && (textArea.scrollTop = textArea.scrollHeight);
        })
      }
    },
    //@@viewOff:standardComponentLifeCycle

    //@@viewOn:interface
    focus() {
      this._textInput && this._textInput.focus();
    },

    hasFocus() {
      return document.activeElement === this._textInput;
    },
    //@@viewOff:interface

    //@@viewOn:overridingMethods
    //@@viewOff:overridingMethods

    //@@viewOn:componentSpecificHelpers
    _getPlaceholder() {
      let placeholder;
      if (this.props.placeholder) {
        if (typeof this.props.placeholder === 'string') {
          placeholder = this.props.placeholder;
        } else if (typeof this.props.placeholder === 'object') {
          placeholder = this.getLsiItem(this.props.placeholder);
        }
      }

      return placeholder;
    },

    _hasFeedback() {
      let result = false;

      switch (this.props.feedback) {
        case "success":
          result = true;
          break;
        case "warning":
          result = true;
          break;
        case "error":
          result = true;
          break;
      }

      return result;
    },

    _getTextInput() {
      let input;
      let className = this.getClassName().item;
      if (this.props.type === INPUT_TYPE_TEXT || this.props.type === INPUT_TYPE_PASSWORD) {
        className += ' ' + this.getClassName().text;
      } else if (this.props.type === INPUT_TYPE_TEXTAREA) {
        className += ' ' + this.getClassName().textarea;
      }

      if (this.props.bgStyle) {
        className += " " + ClassNames[this.props.bgStyle];

        if (this.props.bgStyle === "filled" || this.props.bgStyle === "transparent") {
          className += " " + ClassNames.focus;
        }
      } else if (["success", "warning", "error"].indexOf(this.props.feedback) > -1) {
        className += " " + ClassNames["outline"];
        className += " " + UU5.Common.Css.css(`
          && {
            background-color: #FFFFFF;
          }
        `);
      }

      if (this.props.elevation) {
        className += " " + ClassNames.elevation + this.props.elevation;
      }

      let mainAttrs = this.props.mainAttrs ? UU5.Common.Tools.merge({}, this.props.mainAttrs) : null;
      let onKeyDown = this.props.onKeyDown;

      if (mainAttrs && typeof mainAttrs.onKeyDown === 'function') {
        let mainAttrsKeyDown = mainAttrs.onKeyDown;
        onKeyDown = (e) => {
          this.props.onKeyDown(e);
          mainAttrsKeyDown(e);
        };
        delete mainAttrs.onKeyDown;
      }
      if (mainAttrs && mainAttrs.className) {
        className += " " + mainAttrs.className;
        delete mainAttrs.className;
      }

      if (!this.props.disabled && !this.props.readonly && this._hasFeedback()) {
        className = className.replace(/ ?color-schema-[a-z-]+ ?/, ""); // this might be unnecessary, but just in case ...

        switch (this.props.feedback) {
          case "success":
            className += " color-schema-" + UU5.Environment.getColorSchema("success");
            break;
          case "warning":
            className += " color-schema-" + UU5.Environment.getColorSchema("warning");
            break;
          case "error":
            className += " color-schema-" + UU5.Environment.getColorSchema("danger");
            className += " " + this.getClassName("inputError");
            break;
        }
      } else if (this.props.colorSchema) {
        className += " color-schema-" + UU5.Environment.getColorSchema(this.props.colorSchema);
      }

      let inputProps = {
        id: this.getId(),
        autoComplete: this.props.autoComplete,
        name: this.props.name,
        placeholder: this._getPlaceholder(),
        value: this.props.type === "password" ? undefined : this.props.value,
        type: this.props.type,
        onChange: this.props.onChange,
        onBlur: this.props.readonly ? null : this.props.onBlur,
        onFocus: this.props.onFocus,
        readOnly: this.props.readonly,
        disabled: this.props.disabled,
        className: className,
        onKeyDown: onKeyDown,
        tabIndex: this.props.readonly ? '-1' : undefined,
        ref: item => this._textInput = item,
        style: { ...(mainAttrs || {}).style, ...{ borderRadius: this.props.borderRadius } }
      };

      mainAttrs && (inputProps = UU5.Common.Tools.merge(inputProps, mainAttrs));

      if (this.props.type === INPUT_TYPE_TEXT || this.props.type === INPUT_TYPE_PASSWORD) {
        input = <input {...inputProps} />;
      } else if (this.props.type === INPUT_TYPE_TEXTAREA) {
        if (this.props.autoResize || this.props.maxRows) {
          let style = {
            ...{ borderRadius: this.props.borderRadius },
            ...{
              maxHeight: this._getMaxHeight(),
              height: this.state.height,
              overflow: this.state.autoResizeOverflow ? this.state.autoResizeOverflow : 'hidden'
            }
          };

          input = [
            <textarea key="textarea" {...inputProps} rows={this.props.rows}
                      style={style} />,
            this._createHiddenTextarea(inputProps.className, this.props.value)
          ]
        } else {
          input = <textarea {...inputProps} rows={this.props.rows} />
        }
      }
      return input;
    },

    _getFeedbackIcon() {
      let result;
      if (this.props.loading) {
        result = <Loading className={this.getClassName("loading")} id={this.getId()} />;
      } else if (this.props.clickable) {
        let className = this.getClassName('iconLink');
        this.props.readonly && (className += ' ' + this.getClassName('iconLinkReadOnly'));
        result = (
          <UU5.Bricks.Link
            className={className}
            onClick={(link, e) => {
              e.stopPropagation();
              this.props.iconOnClick();
            }}
            mainAttrs={{
              tabIndex: this.props.clickable ? 0 : null,
              onKeyDown: (e) => {
                if ((e.keyCode || e.which) === 13) {
                  e.stopPropagation();
                  this.props.iconOnClick();
                }
              }
            }}
            disabled={this.props.disabled || this.props.readonly}
          >
            <UU5.Bricks.Icon icon={this.props.icon} clickable={true} />
          </UU5.Bricks.Link>
        );
      } else if (this.props.type !== INPUT_TYPE_TEXTAREA && this.props.icon) {
        result = <UU5.Bricks.Icon icon={this.props.icon} clickable={this.props.clickable} />;
      }

      return result;
    },

    _createHiddenTextarea(style, value) {
      return (
        <div key="textarea-hidden" className={this.getClassName().hiddenDiv}>
          <textarea
            className={`${this.getClassName().hiddenTextarea} ${style}`}
            value={value}
            readOnly
            ref={(item) => this._hiddenTextarea = item}
            rows={this.props.rows}
          />
        </div>
      )
    },

    _getNewHeightOfTextarea() {
      let calculatedHeight = this._hiddenTextarea.scrollHeight;

      let textareaStyle = window.getComputedStyle(this._textInput);
      let minHeight = (parseFloat(textareaStyle.lineHeight) * this.props.rows) +
        parseFloat(textareaStyle.paddingTop) + parseFloat(textareaStyle.paddingBottom) +
        parseFloat(textareaStyle.borderTopWidth) + parseFloat(textareaStyle.borderBottomWidth);

      return Math.max(minHeight, calculatedHeight);
    },

    _getStyleOverflow(calculatedHeight) {
      let textareaStyle = window.getComputedStyle(this._textInput);
      let maxHeight = parseFloat(textareaStyle.maxHeight);
      isNaN(maxHeight) && (maxHeight = this._getMaxHeight());

      return (calculatedHeight > maxHeight) ? 'auto' : 'hidden';
    },

    _setHeight(setStateCallback) {
      let height = this._getNewHeightOfTextarea();
      if (height !== this.state.height) {
        this.setState({ height, autoResizeOverflow: this._getStyleOverflow(height) }, setStateCallback);
      }
    },

    _getMaxHeight() {
      let maxHeight;
      if (this.props.maxRows && this._textInput) {
        let textareaStyle = window.getComputedStyle(this._textInput);
        maxHeight = (parseFloat(textareaStyle.lineHeight) * this.props.maxRows) +
          parseFloat(textareaStyle.paddingTop) + parseFloat(textareaStyle.paddingBottom) +
          parseFloat(textareaStyle.borderTopWidth) + parseFloat(textareaStyle.borderBottomWidth);
      }

      return maxHeight;
    },

    _getFullClassName() {
      let className = this.getFullClassName();

      switch (!this.props.disabled && !this.props.readonly && this.props.feedback) {
        case 'success':
          className = className.replace(/ ?color-schema-[a-z-]+ ?/, "");
          className += ' color-schema-' + UU5.Environment.getColorSchema('success');
          break;
        case 'warning':
          className = className.replace(/ ?color-schema-[a-z-]+ ?/, "");
          className += ' color-schema-' + UU5.Environment.getColorSchema('warning');
          break;
        case 'error':
          className = className.replace(/ ?color-schema-[a-z-]+ ?/, "");
          className += ' color-schema-' + UU5.Environment.getColorSchema('danger');
          break;
      }

      return className;
    },

    _getInputWidth() {
      return this.props.inputWidth === "auto" ? null : this.props.inputWidth;
    },

    _getWrapperAttrs() {
      let attrs = {};

      attrs.className = this._getFullClassName();
      attrs.style = { width: this._getInputWidth() };

      return attrs;
    },
    //@@viewOff:componentSpecificHelpers

    //@@viewOn:render
    render() {
      return (
        <div {...this._getWrapperAttrs()}>
          {this._getTextInput()}
          {this._getFeedbackIcon()}
        </div>
      );
    }
    //@@viewOn:render
  })
);
