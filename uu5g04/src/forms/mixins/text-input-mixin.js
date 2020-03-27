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

import * as UU5 from "uu5g04";
import ns from "../forms-ns.js";

import InputMixin from "./input-mixin.js";

import Option from "./../select-option.js";

export const TextInputMixin = {
  //@@viewOn:mixins
  mixins: [UU5.Common.ColorSchemaMixin, InputMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Forms.TextInputMixin": {
      classNames: {
        main: ns.css("text-input"),
        item: ns.css("auto-complete-item", "group-item")
      }
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    placeholder: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
    required: UU5.PropTypes.bool,
    requiredMessage: UU5.PropTypes.any,
    focusMessage: UU5.PropTypes.any,
    patternMessage: UU5.PropTypes.any,
    autocompleteItems: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        value: UU5.PropTypes.string,
        params: UU5.PropTypes.object,
        content: UU5.PropTypes.any
      })
    ),
    onFocus: UU5.PropTypes.func,
    onBlur: UU5.PropTypes.func,
    onEnter: UU5.PropTypes.func,
    validateOnChange: UU5.PropTypes.bool,
    borderRadius: UU5.PropTypes.string,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
    elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps: function() {
    return {
      placeholder: null,
      required: false,
      requiredMessage: null,
      focusMessage: null,
      patternMessage: null,
      autocompleteItems: null,
      onFocus: null,
      onBlur: null,
      onEnter: null,
      validateOnChange: false,
      borderRadius: null,
      bgStyle: null,
      elevation: null
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      autocompleteItems: this.props.autocompleteItems,
      foundAutocompleteItems: null,
      selectedIndex: null,
      open: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.controlled) {
      this.setState({ autocompleteItems: nextProps.autocompleteItems });
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isTextInput() {
    return true;
  },

  getInput() {
    return this._textInput;
  },

  isValid() {
    var feedback = this.getFeedback();
    var value = this.getValue();
    var result = true;

    if (this.props.required && (value === "" || value === null)) {
      this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessage"));
      result = false;
    } else if (feedback === "error") {
      result = false;
    } else if (typeof this.isValid_ === "function") {
      result = this.isValid_();
    }

    if (result && this.props.onValidate) {
      var validation = this.props.onValidate({ value: value, component: this });
      if (validation && typeof validation === "object") {
        if (validation.feedback === "error") {
          this.setError(validation.message);
          result = false;
        }
      }
    }

    return result;
  },

  open(setStateCallback) {
    if (typeof this.open_ === "function") {
      this.open_(setStateCallback);
    } else {
      this.openDefault(setStateCallback);
    }

    return this;
  },

  openDefault(setStateCallback) {
    let newState = { open: true };
    let opt = { value: this.state.value, component: this };
    let newFoundAutocompleteItems;

    if (!opt.value) {
      newFoundAutocompleteItems = this.state.autocompleteItems;
    } else {
      let result = this.getChangeFeedback(opt);
      newFoundAutocompleteItems = result.foundAutocompleteItems;
    }

    if (this.state.autocompleteItems && !this.state.foundAutocompleteItems) {
      newState.foundAutocompleteItems = newFoundAutocompleteItems;
    }

    this.setState(newState, setStateCallback);
    return this;
  },

  close(setStateCallback) {
    if (typeof this.close_ === "function") {
      this.close_(setStateCallback);
    } else {
      this.closeDefault(setStateCallback);
    }

    return this;
  },

  closeDefault(setStateCallback) {
    let newState = { open: false };

    if (this.state.autocompleteItems && this.state.foundAutocompleteItems !== null) {
      newState.foundAutocompleteItems = null;
    }

    this.setState(newState, setStateCallback);
    return this;
  },

  isOpen() {
    return typeof this.isOpen_ === "function" ? this.isOpen_() : this.isOpenDefault();
  },

  isOpenDefault() {
    return this.state.open;
  },

  getFocusFeedback() {
    let value;
    if (this.isInitial() && this.props.focusMessage) {
      value = {
        message: this.props.focusMessage,
        value: this.state.value,
        feedback: "initial"
      };
    }
    return value;
  },

  getBlurFeedback(opt) {
    let result;
    let validateFeedback = this.onValidate(opt);
    if (validateFeedback) {
      result = validateFeedback;
    } else {
      result = {
        feedback: this.state.feedback,
        message: this.state.message,
        value: opt.value
      };
    }
    return result;
  },

  onValidate(opt) {
    let result;
    if (this.props.pattern) {
      let r = new RegExp(this.props.pattern);
      if (!r.test(opt.value)) {
        result = {
          feedback: "error",
          message: this.props.patternMessage || this.getLsiComponent("patternMessage"),
          value: opt.value
        };
      }
    } else if (typeof this.props.onValidate === "function") {
      result = this.props.onValidate(opt);
    }

    return result;
  },

  setAutoCompleteItems(items, opt, setStateCallback) {
    opt = opt || {};

    opt.autocompleteItems = items;
    opt.value = opt.value || this.state.value;
    let result = this.getChangeFeedback(opt);

    this.setState(state => {
      return {
        autocompleteItems: items,
        feedback: result.feedback,
        message: result.message,
        value: result.value,
        foundAutocompleteItems: state.open ? result.foundAutocompleteItems : null,
        selectedIndex: result.selectedIndex
      };
    }, setStateCallback);

    return this;
  },

  onFocus(e) {
    let opt = { value: e.target.value, event: e, component: this };
    if (typeof this.props.onFocus === "function") {
      this.props.onFocus(opt);
    } else {
      this.onFocusDefault(opt);
    }

    return this;
  },

  onFocusDefault(opt) {
    if (typeof this.onFocusDefault_ === "function") {
      this.onFocusDefault_(opt);
    } else {
      let result = this.getFocusFeedback(opt);
      result && this.setFeedback(result.feedback, result.message, result.value);
    }
    return this;
  },

  onChange(e) {
    let opt = { value: e.target.value, event: e, component: this };

    if (!this.isComputedDisabled() && !this.isReadOnly()) {
      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
    }
    return this;
  },

  onChangeDefault(opt, setStateCallback) {
    if (typeof this.onChangeDefault_ === "function") {
      this.onChangeDefault_(opt, setStateCallback);
    } else if (this.props.validateOnChange) {
      this._validateOnChange(opt, false, setStateCallback);
    } else {
      let result = this.getChangeFeedback(opt);
      let callback = setStateCallback;
      if (
        !(opt._data && opt._data.closeOnCallback) &&
        result.foundAutocompleteItems &&
        result.foundAutocompleteItems.length > 0
      ) {
        callback = () => this.open(setStateCallback);
      } else {
        callback = () => this.close(setStateCallback);
      }
      this.setState(
        {
          feedback: result.feedback,
          message: result.message,
          value: result.value,
          foundAutocompleteItems: result.foundAutocompleteItems,
          selectedIndex: result.selectedIndex
        },
        callback
      );
    }
    return this;
  },

  onBlur(e) {
    let opt = { value: e.target.value, event: e, component: this };

    if (typeof this.props.onBlur === "function") {
      this.props.onBlur(opt);
    } else {
      this.onBlurDefault(opt);
    }
    return this;
  },

  onBlurDefault(opt) {
    if (typeof this.onBlurDefault_ === "function") {
      this.onBlurDefault_(opt);
    } else if (this._checkRequired({ value: opt.value }) && !this.props.validateOnChange) {
      opt.required = this.props.required;
      let blurResult = this.getBlurFeedback(opt);
      this._setFeedback(blurResult.feedback, blurResult.message, blurResult.value);
    }
    return this;
  },

  onKeyDown(e, param) {
    let opt = { value: e.target.value, event: e, component: this };

    // param is user function passed to inputAttrs.onKeyDown
    if (typeof param === "function") {
      param(e, opt);
    }

    if (typeof this.props.onEnter === "function" && (e.keyCode || e.which) === 13 && !e.shiftKey && !e.ctrlKey) {
      this.props.onEnter(opt);
    }

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  focus_() {
    this._textInput && this._textInput.focus();
  },

  getChangeFeedback_(opt) {
    let foundItems = null;
    let selectedIndex = this.state.selectedIndex;

    if (opt.autocompleteItems || this.state.autocompleteItems) {
      foundItems = this._find(opt.autocompleteItems || this.state.autocompleteItems, opt.value);
      selectedIndex = null;
    }

    return {
      feedback: opt.feedback || InputMixin.INITIAL_FEEDBACK,
      message: opt.message || null,
      value: opt.value === undefined ? this.state.value : opt.value,
      foundAutocompleteItems: foundItems,
      selectedIndex: selectedIndex
    };
  },

  setChangeFeedback_(opt, setStateCallback) {
    if (typeof this.setChangeFeedback__ === "function") {
      this.setChangeFeedback__(opt, setStateCallback);
    } else {
      let result = this.getChangeFeedback(opt);
      let open = !!(Array.isArray(result.foundAutocompleteItems) && result.foundAutocompleteItems.length);

      this.setState(
        {
          feedback: result.feedback,
          message: result.message,
          value: result.value,
          foundAutocompleteItems: result.foundAutocompleteItems,
          selectedIndex: result.selectedIndex,
          open
        },
        setStateCallback
      );
    }

    return this;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _checkRequired(opt, setStateCallback) {
    let result = true;
    if (this.props.required && !opt.value && this.shouldValidateRequired()) {
      result = false;
      this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessage"), opt.value, setStateCallback);
    }

    return result;
  },

  _find(items, foundValue) {
    let values = { first: [], last: [] };
    if (foundValue) {
      let foundValueLower = foundValue.toLowerCase();
      items.forEach(function(item) {
        let itemValueLower = item.value.toLowerCase();
        if (itemValueLower.substring(0, foundValueLower.length) === foundValueLower) {
          values.first.push(item);
        } else if (itemValueLower.indexOf(foundValueLower) > -1) {
          values.last.push(item);
        }
      });
    }
    let allValues = values.first.concat(values.last);

    return allValues.length ? allValues : null;
  },

  _getBackdropProps() {
    var backdropId = this.getId() + "-backdrop";

    return {
      hidden: !this.state.foundAutocompleteItems,
      id: backdropId,
      onClick: () => this.setState({ foundAutocompleteItems: null, selectedIndex: null })
    };
  },

  _getItemListProps() {
    let props = {
      parent: this
    };

    props.hidden = !this.state.foundAutocompleteItems;
    props.ref = itemList => (this._itemList = itemList);
    props.onChange = opt => {
      if (opt.value !== null && this.state.foundAutocompleteItems) {
        opt.autocompleteItem = this.state.foundAutocompleteItems.find(it => it.value === opt.value);
      }

      opt.component = this;
      opt.setStateCallback = () => {
        if (typeof this._onBlur === "function") {
          this._onBlur(opt);
        } else {
          if (typeof this.props.onBlur === "function") {
            this.props.onBlur(opt);
          } else {
            this.onBlurDefault(opt);
          }
        }
      };

      opt._data ? (opt._data.closeOnCallback = true) : (opt._data = { closeOnCallback: true });
      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
      this.close();
    };

    props.value = !this.state.value || Array.isArray(this.state.value) ? this.state.value : [this.state.value];

    return props;
  },

  _getChildren() {
    return (
      this.state.foundAutocompleteItems &&
      this.state.foundAutocompleteItems.map((item, i) => {
        let className = this.getClassName().item;
        this.state.selectedIndex === i && (className += " " + this.getClassName().selected);
        return (
          <Option
            className={className}
            key={i}
            value={item.value || item.content}
            content={item.content || item.value}
            mainAttrs={{ id: this.getId() + "-item-" + i, tabIndex: 0 }}
          />
        );
      })
    );
  }
  //@@viewOff:private

  //@@viewOn:render
  //@@viewOff:render
};

export default TextInputMixin;
