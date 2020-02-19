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
import ns from "./forms-ns.js";

import ItemList from "./internal/item-list.js";
import ItemsInput from "./internal/items-input.js";
import ChoiceMixin from "./mixins/choice-mixin.js";
import InputMixin from "./mixins/input-mixin.js";

import SelectOption from "./select-option.js";

import Context from "./form-context.js";

import "./select.less";
//@@viewOff:imports

export const Select = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "Select", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ContentMixin,
      UU5.Common.ScreenSizeMixin,
      UU5.Common.ColorSchemaMixin,
      InputMixin,
      ChoiceMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("Select"),
      classNames: {
        main: ns.css("select"),
        stateHolder: ns.css("select-state-holder"),
        link: ns.css("select-link"),
        open: ns.css("select-open"),
        multiple: ns.css("select-multiple"),
        selectAllEnabled: ns.css("select-all"),
        hasValue: ns.css("select-has-value"),
        screenSizeBehaviour: ns.css("screen-size-behaviour"),
        inputOpen: ns.css("items-input-open")
      },
      defaults: {
        childTagName: "UU5.Forms.Select.Option"
      },
      lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Forms.select, UU5.Environment.Lsi.Forms.message)
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.arrayOf(UU5.PropTypes.string)]),
      multiple: UU5.PropTypes.bool,
      selectAllEnabled: UU5.PropTypes.bool,
      allowTags: UU5.PropTypes.array,
      disableBackdrop: UU5.PropTypes.bool,
      borderRadius: UU5.PropTypes.string,
      bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
      openToContent: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string])
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
        openToContent: "xs"
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      return {
        open: false
      };
    },

    componentWillMount() {
      let value = [];
      if (this.props.value) {
        value = this._valuesToValuesArray(this.props.value);
      }
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value, event: null, component: this });
      } else {
        this._onChangeFeedback(this.props.feedback, this.props.message, value);
      }

      return this;
    },

    componentWillReceiveProps(nextProps) {
      let value = this._valuesToValuesArray(nextProps.value, this.buildChildren(nextProps));
      if (nextProps.controlled) {
        if (nextProps.required && this.state.value.length > 0 && (value.length < 1 || value === null)) {
          this.setError(nextProps.requiredMessage || this.getLsiComponent("requiredMessageChoice"));
        } else if (this.props.onValidate && typeof this.props.onValidate === "function") {
          this._validateOnChange({ value, event: null, component: this }, true);
        } else {
          this._onChangeFeedback(nextProps.feedback, nextProps.message, value);
        }
      } else {
        let currentValue = this.getValue();
        if (currentValue) {
          let itemValues = UU5.Common.Children.map(nextProps.children, child => child.props.value);

          if (Array.isArray(currentValue)) {
            let newValue = [];
            let valueChanged = false;
            currentValue.forEach(value => {
              if (!itemValues.find(itemValue => itemValue === value)) {
                valueChanged = true;
              } else {
                newValue.push(value);
              }

              if (valueChanged) {
                this.setValue(newValue);
              }
            });
          } else {
            let selectedItem = itemValues.find(itemValue => itemValue === currentValue);

            if (!selectedItem) {
              this.setValue(null);
            }
          }
        }
      }

      return this;
    },

    componentWillUnmount() {
      this._removeEvent();
    },

    componentDidUpdate(prevProps, prevState) {
      if (this.isOpen()) {
        if (
          (this.state.screenSize === "xs" && prevState.screenSize !== "xs") ||
          (this.state.screenSize !== "xs" && prevState.screenSize === "xs")
        ) {
          this._onOpen();
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
      this._addEvent();
      this.setState({ open: true }, () => this._onOpen(setStateCallback));
      return this;
    },

    close(setStateCallback) {
      this.setState({ open: false }, () => this._onClose(setStateCallback));
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

    addValue(value, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (this.props.multiple) {
        let currentValue = this.getValue() || [];

        if (typeof value === "number") {
          let values = this.props.children.map(child => child.props.value);
          value = values[value];
        }

        if (typeof value === "string" && currentValue.indexOf(value) === -1) {
          currentValue.push(value);
          _callCallback = false;
          this.setValue(currentValue, setStateCallback);
        }

        if (_callCallback) {
          setStateCallback();
        }
      } else {
        this.showWarning("notMultiple", "addValue");
      }
      return this;
    },

    removeValue(opt, setStateCallback) {
      if (this.props.required && this.state.value.length === 1) {
        this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"), null);
      }
      opt.component = this;
      opt._data = { type: "remove", callback: setStateCallback, value: opt.value };
      this._getChildren().forEach(child => {
        let value = child
          ? child.props.selectedContent || child.props.content || child.props.children || child.props.value
          : null;
        if (value === opt.value) {
          opt.value = child.props.value;
        }
      });

      // For returning a full item list to onChange
      // let removedValue = opt.value;
      // opt.value = [];

      // this.state.value.forEach((childIndex) => {
      //   let child = this._itemList.getRenderedChildren()[childIndex];
      //   let value = child ? child.props.selectedContent || child.props.content || child.props.children || child.props.value : null;
      //   if (value !== removedValue) {
      //     opt.value.push(child.props.value);
      //   }
      // });

      if (typeof this.props.onChange === "function") {
        this.props.multiple ? this.props.onChange(opt) : this.close(() => this.props.onChange(opt));
      } else {
        this.onChangeDefault(opt);
      }
    },

    onChangeDefault(opt, setStateCallback) {
      opt = { ...opt };
      let type = opt._data.type;
      opt.value = opt._data.value;

      if (type == "changeValue") {
        this._onSelectDefault(opt, setStateCallback);
      } else if (type == "selectAll") {
        this._onSelectAllDefault(opt, setStateCallback);
      } else if (type == "remove") {
        this._onRemoveDefault(opt, setStateCallback);
      }

      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    setValue_(value, setStateCallback) {
      value = this._valuesToValuesArray(value);

      if (this._checkRequired(value)) {
        if (typeof this.props.onValidate === "function") {
          this._validateOnChange({ value, event: null, component: this });
        } else {
          this._setCustomFeedback("initial", null, value, setStateCallback);
        }
      }
    },

    setFeedback_(feedback, message, value, setStateCallback) {
      this.setState({ feedback, message, value: this._valuesToValuesArray(value) || [] }, setStateCallback);

      return this;
    },

    getValue_(value) {
      value = value || this.state.value;
      value = this.props.multiple ? value || [] : Array.isArray(value) ? value[0] : value;

      if (Array.isArray(value)) {
        value = [...value];
      }

      return value;
    },

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

    onChangeFeedbackDefault_(opt) {
      let result = opt;
      let multiple = this.props.multiple;
      result.value = this._valuesToValuesArray(result.value);

      if (multiple || !this.isOpen()) {
        this._onChangeFeedback(result.feedback, result.message, result.value, result.callback);
      } else {
        this.close(() => this._onChangeFeedback(result.feedback, result.message, result.value, result.callback));
      }
    },

    reset_(setStateCallback) {
      this.setState(
        {
          message: this.props.message,
          feedback: this.props.feedback,
          value: this._valuesToValuesArray(this.props.value),
          readOnly: this.props.readOnly
        },
        setStateCallback
      );
    },
    //@@viewOff:overriding

    //@@viewOn:private
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
      let inputMatch = "[id='" + this.getId() + "'] .uu5-forms-items-input";
      let pickerMatch = "[id='" + this.getId() + "'] .uu5-forms-item-list";
      let itemMatch = "[id='" + this.getId() + "'] .items-input-item";
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
            result.component = true;
          } else if (item[functionType](inputMatch)) {
            result.input = true;
            result.component = true;
          } else if (item[functionType](pickerMatch)) {
            result.picker = true;
            result.component = true;
          } else if (item[functionType](itemMatch)) {
            result.item = true;
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

    _handleClick(e) {
      // This function can be called twice if clicking inside the component but it doesnt do anything in that case
      let clickData = this._findTarget(e);
      if (!this.props.disableBackdrop) {
        if (!clickData.input && !clickData.picker) {
          this._removeEvent();
          if (this.isOpen()) {
            this.close(this._validateRequired);
          }
        } else {
          document.getElementById(this.getId() + "-input").blur();
        }
      }

      return this;
    },

    _addEvent() {
      window.addEventListener("click", this._handleClick, true);
      return this;
    },

    _removeEvent(notKeys) {
      if (!notKeys) {
        UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId());
        UU5.Environment.EventListener.removeWindowEvent("keyup", this.getId());
      }

      window.removeEventListener("click", this._handleClick, true);
      return this;
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
          this.close(this._validateRequired);
          e.preventDefault();
        } else if (e.which === 9) {
          this._removeEvent();
          this.close(this._validateRequired);
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

    _onChangeFeedback(feedback, message, value, setStateCallback) {
      // This function needs to replace the function below (_setCustomFeedback) when used in
      // onChangeFeedbackDefault_ because otherwise the calling of props.onChangeFeedback can
      // be cycled.
      this.setState({ feedback, message, value: value || [] }, setStateCallback);
    },

    _setCustomFeedback(feedback, message, value, setStateCallback) {
      // This function needs to exist because calling a regular setFeedback, which eventually calls the setFeedback_
      // calls a function valuesToValuesArray, which basically validates the value towards the current component's item list.
      // This list is taken from current props or can be a custom one (which is needed in willReceiveProps because of nextProps),
      // but it has no way to receive this set of items, because of setFeedback fn not having any suitable parameter.
      // This causes it to not function properly and invalidate (reset) the value.
      // This function only requires to call the valuesToValuesArray fn separately and then send the result value to it.
      if (typeof this.props.onChangeFeedback === "function") {
        let opt = {
          feedback,
          message,
          value: value[0] || null,
          callback: setStateCallback,
          component: this
        };
        this.props.onChangeFeedback(opt);
      } else {
        this.setState({ feedback, message, value: value || [] }, setStateCallback);
      }
    },

    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;
        if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              _callCallback = false;
              this._onChangeFeedback(result.feedback, result.message, result.value, setStateCallback);
            } else {
              let value = opt.value.slice();
              _callCallback = false;
              this.setState({ value: value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: { event: e, func: this.props.onValidate, result: result }
            });
          }
        } else {
          _callCallback = false;
          this._setCustomFeedback("initial", null, opt.value, setStateCallback);
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _getTextInputAttrs() {
      var props = {};

      if (!this.state.isReadOnly && !this.isComputedDisabled()) {
        props.onClick = () => {
          this.open();
        };
      }

      return props;
    },

    _getItemListProps() {
      let props = {};

      props.hidden = !this.isOpen();
      props.ref_ = itemList => (this._itemList = itemList);
      props.onChange = opt => this._onItem(opt);
      props.value = this.state.value;
      props.multiple = this.props.multiple;
      props.allowTags = this.props.allowTags;
      props.forceRender = this.props.forceRender;
      props.header = this._getHeader();
      props.parent = this;

      return props;
    },

    _shouldOpenToContent() {
      let result = false;

      if (typeof this.props.openToContent === "string") {
        let screenSize = this.getScreenSize();
        this.props.openToContent
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
      } else if (typeof this.props.openToContent === "boolean") {
        result = this.props.openToContent;
      }

      return result;
    },

    _onInput(opt, checkRequired) {
      let requiredResult = checkRequired ? this._checkRequired(opt.value) : true;
      let scrollElement = this._findScrollElement(this._root);

      if (requiredResult) {
        this.toggle(() =>
          this.isOpen() && this._shouldOpenToContent()
            ? UU5.Common.Tools.scrollToTarget(
                this.getId() + "-input",
                false,
                UU5.Environment._fixedOffset + 20,
                scrollElement
              )
            : null
        );
      } else {
        this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"), null, () =>
          this.toggle(() =>
            this.isOpen() && this._shouldOpenToContent()
              ? UU5.Common.Tools.scrollToTarget(
                  this.getId() + "-input",
                  false,
                  UU5.Environment._fixedOffset + 20,
                  scrollElement
                )
              : null
          )
        );
      }
    },

    _onItem(opt) {
      let multiple = this.props.multiple;

      if (this.isOpen() && opt && opt.value != null) {
        let value = [];
        if (opt.value !== null) {
          if (multiple) {
            if (this.state.value && this.state.value.length > 0) {
              for (let i = 0; i < this.state.value.length; i++) {
                value.push(this.state.value[i]);
              }
            }
            if (opt.value !== this.state.value || this.state.value.length === 0) {
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

        let result = value;
        let requiredResult = this._checkRequired(result);
        opt._data = { type: "changeValue", value: opt.value, requiredResult, multiple, result };
        opt.component = this;

        // For returning a full item list to onChange
        // if (multiple) {
        //   opt.value = value.map((item) => this._itemList.getRenderedChildren()[item].props.value)
        // } else {
        //   opt.value = this._itemList.getRenderedChildren()[value[0]].props.value;
        // }

        if (typeof opt.value === "number") {
          opt.value = this._getChildren()[opt.value].props.value;
        }

        if (typeof this.props.onChange === "function") {
          multiple ? this.props.onChange(opt) : this.toggle(() => this.props.onChange(opt));
        } else if (!requiredResult) {
          this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"), null);
        } else {
          this.onChangeDefault(opt);
        }
      }

      return this;
    },

    _onSelectDefault(opt, setStateCallback) {
      let result = opt._data.result;
      let multiple = this.props.multiple;
      let requiredResult = opt._data.requiredResult;
      let _callCallback = typeof setStateCallback === "function";

      if (!requiredResult) {
        _callCallback = false;
        this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"), null, () =>
          this.close(setStateCallback)
        );
      } else if (typeof this.props.onValidate === "function") {
        opt.component = this;
        opt.value = result;

        if (!multiple) {
          opt.value = result[0];
        }

        result = this.props.onValidate(opt);
        if (result && typeof result === "object") {
          let callback = () => {
            if (typeof result.setStateCallback === "function") {
              result.setStateCallback();
            }

            if (typeof setStateCallback === "function") {
              setStateCallback();
            }
          };
          let onChangeFeedbackOpt = {
            feedback: result.feedback,
            message: result.message,
            value: result.value,
            callback,
            component: this
          };
          if (typeof this.props.onChangeFeedback === "function") {
            _callCallback = false;
            this.props.onChangeFeedback(onChangeFeedbackOpt);
          } else {
            _callCallback = false;
            this.onChangeFeedbackDefault(onChangeFeedbackOpt);
          }
        }
      } else {
        _callCallback = false;

        if (!multiple) {
          result = result[0];
        }

        result = this._valuesToValuesArray(result);

        if (multiple) {
          this._setCustomFeedback("initial", null, result, setStateCallback);
        } else {
          this._setCustomFeedback("initial", null, result, () => this.close(setStateCallback));
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _onSelectAllDefault(opt, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";
      let value = this.getValue_(opt.value);
      if (this._checkRequired(opt.value)) {
        if (typeof this.props.onValidate === "function") {
          opt.component = this;
          opt.value = value;

          let result = this.props.onValidate(opt);
          if (result && typeof result === "object") {
            let setStateCallbackComposed = () => {
              if (typeof result.setStateCallback === "function") {
                result.setStateCallback();
              }

              if (typeof setStateCallback === "function") {
                setStateCallback();
              }
            };
            let onChangeFeedbackOpt = {
              feedback: result.feedback,
              message: result.message,
              value: result.value,
              callback: setStateCallbackComposed,
              component: this
            };
            if (typeof this.props.onChangeFeedback === "function") {
              _callCallback = false;
              this.props.onChangeFeedback(onChangeFeedbackOpt);
            } else {
              _callCallback = false;
              this.onChangeFeedbackDefault(onChangeFeedbackOpt);
            }
          }
        } else {
          _callCallback = false;
          this._setCustomFeedback("initial", null, value, setStateCallback);
        }
      } else {
        this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"), null);
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _onRemoveDefault(opt, setStateCallback) {
      let _callCallback = true;
      let values = this.getValue() || [];
      let setStateCallbackComposed = () => {
        if (opt._data && typeof opt._data.callback === "function") {
          opt._data.callback();
        }

        if (typeof setStateCallback === "function") {
          setStateCallback();
        }
      };

      let index = opt.index !== undefined ? opt.index : values.indexOf(opt.value);

      if (index > -1) {
        values.splice(index, 1);
        !values.length && (values = null);
        _callCallback = false;
        this.setValue(values, setStateCallbackComposed);
      }

      if (_callCallback) {
        setStateCallbackComposed();
      }

      return this;
    },

    _checkRequired(value) {
      let result = true;
      if (((!value && value !== 0) || value.length < 1) && this.props.required && this.shouldValidateRequired()) {
        result = false;
      }

      return result;
    },

    _validateRequired() {
      if (!this._checkRequired(this.state.value)) {
        this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"));
      }
    },

    _onFocus(opt) {
      this._addKeyEvents();
      return this;
    },

    _getMainAttrs() {
      let attrs = this._getInputAttrs();
      attrs.className += " " + this.getClassName("stateHolder");
      attrs.id = this.getId();

      if (this.isOpen()) {
        attrs.className += " " + this.getClassName().open;
      }

      if (this.props.multiple) {
        attrs.className += " " + this.getClassName().multiple;
      }

      if (this.props.selectAllEnabled) {
        attrs.className += " " + this.getClassName().selectAllEnabled;
      }

      if (this.state.value && this.state.value.length) {
        attrs.className += " " + this.getClassName().hasValue;
      }

      if (this._shouldOpenToContent()) {
        attrs.className += " " + this.getClassName().screenSizeBehaviour;
      }

      let handleClick = e => {
        let clickData = this._findTarget(e.nativeEvent);
        if (clickData.input && ((this.isOpen() && !clickData.item) || !this.isOpen())) {
          document.activeElement.blur();
          e.preventDefault();
          let opt = { value: this.state.value, event: e, component: this };
          this._onInput(opt, this.isOpen());
        }
      };

      if (!this.isReadOnly() && !this.isComputedDisabled()) {
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

    _getInputMainAttrs() {
      let attrs = this.props.inputAttrs || {};

      attrs.className === "" ? delete attrs.className : null;

      if (this.isOpen()) {
        attrs.className += " " + this.getClassName("inputOpen");
      }

      if (!this.isReadOnly() && !this.isComputedDisabled()) {
        attrs = UU5.Common.Tools.merge(
          {
            tabIndex: !this.isReadOnly() && !this.isComputedDisabled() ? "0" : undefined,
            onFocus: !this.isReadOnly() && !this.isComputedDisabled() ? () => this._onFocus() : null
          },
          attrs
        );
      }
      return attrs;
    },

    _getItemValues(children) {
      let result = [];
      if (this.props.placeholder && children === null) {
        result.push(<UU5.Bricks.Span className={this.getClassName("placeholder")} content={this.props.placeholder} />);
      }
      if (children && this.state.value) {
        if (Array.isArray(this.state.value)) {
          for (let i = 0; i < this.state.value.length; i++) {
            let child = children.find(child => child.props.value === this.state.value[i]);
            let childContent = child
              ? child.props.selectedContent || child.props.content || child.props.children || child.props.value
              : null;
            result.push(childContent);
          }
        } else {
          result = [this.state.value];
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

    _isSelectedAll() {
      let result = false;
      if (this.props.children && this.state.value) {
        if (this._getChildren().length === this.state.value.length) {
          result = true;
        }
      }
      return result;
    },

    _selectAll() {
      let result = [];
      if (!this._isSelectedAll()) {
        this._getChildren().forEach((item, i) => {
          result.push(item.props.value);
        });
      }

      let value = this.getValue_(result);
      let opt = { value: value, component: this, _data: { type: "selectAll", value: result } };

      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
      return this;
    },

    _onOpen(setStateCallback) {
      if (this._itemList) {
        this._itemList.open(
          {
            onClose: this._onClose,
            aroundElement: this._textInput.findDOMNode(),
            position: "bottom",
            offset: this._shouldOpenToContent() ? 0 : 4,
            preventPositioning: this._shouldOpenToContent()
          },
          setStateCallback
        );
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _onClose(setStateCallback) {
      if (this._itemList) {
        this._itemList.close(setStateCallback);
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _getIcon() {
      if (this.isOpen()) {
        return this.props.iconOpen;
      } else {
        return this.props.iconClosed;
      }
    },

    _getChildren() {
      let children = [];
      if (this.props.children) {
        let childTagNames = this.props.allowTags.concat(this.getDefault().childTagName);
        UU5.Common.Children.toArray(this.props.children).forEach(child => {
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
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      let children = this._getChildren();

      return (
        <div {...this._getMainAttrs()} ref={comp => (this._root = comp)}>
          {this.getLabel(inputId)}
          {this.getInputWrapper([
            <ItemsInput
              id={inputId}
              name={this.props.name || inputId}
              value={this._getItemValues(children)}
              placeholder={this.props.placeholder}
              multiple={this.props.multiple}
              mainAttrs={this._getInputMainAttrs()}
              disabled={this.isDisabled() || this.isLoading()}
              readonly={this.isReadOnly()}
              loading={this.isLoading()}
              onItemClick={!this.isReadOnly() && !this.isComputedDisabled() ? opt => this.removeValue(opt) : null}
              icon={
                (!this.props.multiple || !this.state.value || !this.state.value.length) &&
                !this.isComputedDisabled() &&
                !this.isReadOnly()
                  ? this._getIcon()
                  : null
              }
              feedback={this.getFeedback()}
              ref_={item => (this._textInput = item)}
              borderRadius={this.props.borderRadius}
              elevation={this.props.elevation}
              bgStyle={this.props.bgStyle}
              inputWidth={this._getInputWidth()}
              colorSchema={this.props.colorSchema}
            />,
            <ItemList {...this._getItemListProps()}>{this.isOpen() && children}</ItemList>
          ])}
        </div>
      );
    }
    //@@viewOn:render
  })
);

Select.Option = SelectOption;

export default Select;
