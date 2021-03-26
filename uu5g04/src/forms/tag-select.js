//@@viewOn:imports
import React from "react";
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "./forms-ns.js";

import InputMixin from "./mixins/input-mixin.js";
import TextInput from "./internal/text-input.js";
import ItemsInput from "./internal/items-input.js";
import Context from "./form-context.js";
import TagSelectStyles from "./internal/tag-select-styles.js";
import ItemList from "./internal/item-list.js";
import Option from "./select-option.js";
//@@viewOff:imports

export const TagSelect = Context.withContext(
  UU5.Common.VisualComponent.create({
    //@@viewOn:mixins
    mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.LsiMixin, InputMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("TagSelect"),
      classNames: {
        ...TagSelectStyles.CommonClassNames,
        item: ns.css("auto-complete-item", "group-item"),
        inputOpen: ns.css("items-input-open"),
      },
      lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Forms.tagSelect, UU5.Environment.Lsi.Forms.message),
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.arrayOf(UU5.PropTypes.string)]),
      availableTags: UU5.PropTypes.arrayOf(
        UU5.PropTypes.shape({
          value: UU5.PropTypes.string,
          content: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.object]),
        })
      ),
      ignoreTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
      allowCustomTags: UU5.PropTypes.bool,
      colorSchema: UU5.PropTypes.string,
      multiple: UU5.PropTypes.bool,
      borderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
      bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
      placeholder: UU5.PropTypes.string,
      required: UU5.PropTypes.bool,
      requiredMessage: UU5.PropTypes.any,
      popoverLocation: UU5.PropTypes.oneOf(["local", "portal"]),
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: undefined,
        availableTags: undefined,
        ignoreTags: undefined,
        allowCustomTags: false,
        multiple: false,
        borderRadius: undefined,
        bgStyle: undefined,
        elevation: undefined,
        placeholder: undefined,
        required: false,
        requiredMessage: undefined,
        popoverLocation: "local", // "local" <=> backward-compatible behaviour
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._hasFocus = false;
      this._hasTempFeedback = false;
      this._initAvailableTags();

      return {
        searchValue: "",
      };
    },

    UNSAFE_componentWillMount() {
      this._correctAvailableTags(this._normalizeValue(this.props.value));
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validate({ value: this.state.value, event: null, component: this });
      }
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.controlled) {
        if (this.props.availableTags !== nextProps.availableTags) {
          this._initAvailableTags(nextProps);
        }
        let value = this._filterValues(
          this._normalizeValue(nextProps.value),
          nextProps.allowCustomTags,
          nextProps.availableTags,
          nextProps.ignoreTags
        );
        this._correctAvailableTags(value, nextProps);
        if (this.props.onValidate && typeof this.props.onValidate === "function") {
          this._validate({ value, event: null, component: this }, true);
        } else {
          this.setState({ feedback: nextProps.feedback, message: nextProps.message, value });
        }
      }
    },

    componentWillUnmount() {
      this._removeEvent();
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    isTagSelect() {
      return true;
    },

    onChangeDefault(opt, setStateCallback) {
      if (opt._data) {
        if (opt._data.availableTags) {
          this._availableTags = opt._data.availableTags;
        }

        if (opt._data.state && this._checkRequired(opt._data.state)) {
          this.setState({ ...opt._data.state }, () => this._onOpen(setStateCallback));
        }
      }

      return this;
    },

    isValid() {
      let feedback = this.getFeedback();
      let value = this.getValue();
      let result = true;

      if (this.props.required && !this._hasValue(this.state.value)) {
        this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessage"));
        result = false;
      } else if (feedback === "error" && !this.props.onValidate) {
        result = false;
      }

      if (result && this.props.onValidate) {
        let validation = this.props.onValidate({ value, component: this });
        if (validation && typeof validation === "object") {
          if (validation.feedback === "error") {
            this.setError(validation.message);
            result = false;
          } else {
            this.setInitial();
          }
        }
      }
      return result;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    getInitialValue_(propValue) {
      return this._filterValues(this._normalizeValue(propValue));
    },

    setValue_(value, setStateCallback) {
      value = this._normalizeValue(value);
      let { state, availableTags } = this._getSetTagValuesResult(value);
      this._availableTags = availableTags;

      if (this._checkRequired({ value: state.value })) {
        if (typeof this.props.onValidate === "function") {
          this._validate({ value: state.value || [], event: null, component: this });
        } else {
          this.setState(state, setStateCallback);
        }
      }

      return this;
    },

    setFeedback_(feedback, message, value, setStateCallback) {
      this._hasTempFeedback = false;
      value = this._normalizeValue(value);
      let { state, availableTags } = this._getSetTagValuesResult(value);
      this._availableTags = availableTags;
      this.setFeedbackDefault(feedback, message, state.value, setStateCallback);
    },

    reset_(setStateCallback) {
      let value = this._filterValues(this._normalizeValue(this.props.value));
      this._correctAvailableTags(value);
      this.setState(
        {
          message: this.props.message,
          feedback: this.props.feedback,
          value,
          readOnly: this.props.readOnly,
        },
        setStateCallback
      );
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _registerItemsInput(itemsInput) {
      this._itemsInput = itemsInput;
    },

    _registerTextInput(textInput) {
      this._textInput = textInput;
    },

    _registerItemList(ref) {
      this._itemList = ref;
    },

    _checkRequired(opt, setStateCallback) {
      let result = true;

      if (this.props.required) {
        if (!opt || !this._hasValue(opt.value)) {
          result = false;
          let value = opt && opt.value ? opt.value : [];
          this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessage"), value, setStateCallback);
        }
      }

      return result;
    },

    _normalizeValue(value) {
      if (value && !Array.isArray(value)) {
        value = [value];
      } else {
        value = value || [];
      }

      return value;
    },

    _filterValues(
      value,
      allowCustomTags = this.props.allowCustomTags,
      availableTags = this.props.availableTags,
      ignoreTags = this.props.ignoreTags
    ) {
      if (!availableTags) {
        availableTags = this.props.availableTags || [];
      }

      if (!ignoreTags) {
        ignoreTags = this.props.ignoreTags || [];
      }

      let result;

      if (allowCustomTags) {
        result = value.filter((valueItem) => !ignoreTags.find((ignoreTag) => ignoreTag === valueItem));
      } else {
        result = value.filter(
          (valueItem) =>
            availableTags.find((availTagItem) => availTagItem.value === valueItem) &&
            !ignoreTags.find((ignoreTag) => ignoreTag === valueItem)
        );
      }

      return result;
    },

    _initAvailableTags(props = this.props) {
      this._availableTags = props.availableTags
        ? props.availableTags.map((tag) => ({
            value: tag.value,
            content: tag.content || tag.value,
            searchValue: this._getTagSearchValue(tag),
          }))
        : [];
    },

    _correctAvailableTags(value, props = this.props) {
      value &&
        value.forEach((valueItem) => {
          if (props.allowCustomTags && !this._availableTags.find((availTagItem) => availTagItem.value === valueItem)) {
            this._availableTags.push({
              value: valueItem,
              content: valueItem,
              searchValue: this._getTagSearchValue(valueItem),
            });
          }
        });
    },

    _getTagContent(tag) {
      if (typeof tag.content === "object" && !UU5.Common.Element.isValid(tag.content)) {
        return this.getLsiItem(tag.content);
      } else {
        return tag ? tag.content : null;
      }
    },

    _getTagSearchValue(tag) {
      let searchValue = "";

      if (typeof tag === "string") {
        searchValue = tag;
      } else {
        if ((UU5.Common.Element.isValid(tag.content) && typeof tag.content !== "string") || !tag.content) {
          searchValue = tag.value;
        } else {
          searchValue = this._getTagContent(tag);
        }
      }

      return searchValue.toLowerCase();
    },

    _getTagTooltip(tag) {
      if (UU5.Common.Element.isValid(tag.content)) {
        return tag.value;
      } else {
        return this._getTagContent(tag);
      }
    },

    _hasValue(value) {
      return !!(value && value.length);
    },

    _validate(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;
        if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              _callCallback = false;
              this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
            } else {
              _callCallback = false;
              this.setState({ value: opt.value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: {
                event: opt.event,
                func: this.props.onValidate,
                result: result,
              },
            });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _emptyValues(e) {
      e.stopPropagation();
      let opt = { component: this, event: e, value: [], _data: { state: { value: [] } } };
      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
    },

    _close(setStateCallback) {
      if (this._itemList) {
        this._itemList.close(() =>
          this.setState(
            { open: false },
            typeof this.props.onClose === "function" ? () => this.props.onClose(setStateCallback) : setStateCallback
          )
        );
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _removeTagValue(e, tag) {
      e.preventDefault();
      e.stopPropagation();

      let newValue = this.state.value.filter((item) => item !== tag);
      let opt = { component: this, event: e, value: newValue, _data: { state: { value: newValue } } };
      if (newValue.length !== this.state.value.length) {
        if (typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      }
    },

    _onSearchValueChange(e) {
      let searchValue = e.target.value;
      this.setState((state) => {
        let newState = { searchValue };
        if (!state.open) newState.open = true;
        return newState;
      }, this._onOpen);
    },

    _onInputWrapperResize() {
      if (this.props.popoverLocation === "portal" && this.state.open) {
        this._onOpen();
      }
    },

    _getSetTagValuesResult(values) {
      let result = { state: { value: [], feedback: "initial", message: null }, availableTags: this._availableTags };

      values.forEach((valueItem) => {
        let itemResult = this._getAddTagValueResult({ value: valueItem }, []);
        result.availableTags = itemResult.availableTags;
        if (itemResult && itemResult.state) itemResult = itemResult.state;
        if (Array.isArray(itemResult.value)) result.state.value = [...result.state.value, ...itemResult.value];

        if (itemResult.feedback === "error") {
          result.state.feedback = itemResult.feedback;
          result.state.message = itemResult.message;
        }
      });

      return result;
    },

    _getAddTagValueResult({ value }, currentValue = this.state.value) {
      let newData = { state: {}, availableTags: this._availableTags };
      let isValid = true;
      value = typeof value === "string" ? value.trim() : value;
      if (!value) return null;
      // validate value towards ignored tags
      if (this.props.ignoreTags && this.props.ignoreTags.find((ignoreTag) => ignoreTag === value)) {
        this._hasTempFeedback = true;
        newData.state = {
          feedback: "error",
          message: this.getLsiComponent("tagIsNotAllowed", null, value),
          value: this.state.value,
        };
        isValid = false;
      } else if (this._hasValue(currentValue) && currentValue.indexOf(value) !== -1) {
        // validate value towards currently set tags
        this._hasTempFeedback = true;
        newData.state = {
          feedback: "warning",
          message: this.getLsiComponent("tagIsAlreadyAdded", null, value),
          value: this.state.value,
        };
        isValid = false;
      } else if (!this.props.allowCustomTags && !this._availableTags.find((tag) => tag.value === value)) {
        this._hasTempFeedback = true;
        newData.state = {
          feedback: "error",
          message: this.getLsiComponent("customTagIsNotAllowed"),
          value: this.state.value,
        };
        isValid = false;
      } else {
        newData.state = { feedback: "initial", searchValue: "", message: null, value: this.state.value };

        if (this.props.allowCustomTags) {
          if (!this._availableTags.find((tag) => tag.value === value)) {
            let availableTags = [...this._availableTags];
            availableTags.push({ value, content: value, searchValue: value.toLowerCase ? value.toLowerCase() : value });
            newData.availableTags = availableTags;
          }
        }
      }

      if (isValid) {
        value = value === undefined ? this.state.searchValue : value;

        if (this._hasValue(currentValue) && this.props.multiple) {
          value = [...currentValue, value];
        } else {
          value = [value];
        }

        newData.state.value = value;
        newData.state.searchValue = "";

        if (!this.props.multiple) {
          newData.state.open = false;
        }
      }

      return newData;
    },

    _addTagValue({ value }) {
      let newData = this._getAddTagValueResult({ value });

      if (newData) {
        let isValid = newData.state.feedback === "initial";

        if (isValid) {
          if (typeof this.props.onChange === "function") {
            this.props.onChange({ component: this, value: newData.state.value, _data: newData });
            return;
          }
        }

        this.onChangeDefault({ value, _data: newData });
      }
    },

    _getMatchingTags(searchedTag, availableTags = this._availableTags) {
      return availableTags.filter(({ searchValue }) => searchValue.indexOf(searchedTag.toLowerCase()) !== -1);
    },

    _addKeyboardEvent() {
      let current = -1;
      let itemList;
      let items;

      UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), (e) => {
        itemList = this._itemList;
        items = itemList && itemList.getRenderedChildren();

        if (items && e.which === 13) {
          // enter
          if (this.state.open) {
            e.preventDefault();
          } else {
            setTimeout(() => {
              this._onMainInputFocus();
            });
          }
        } else if (items && (e.which === 38 || e.which === 40)) {
          // top / bottom
          e.preventDefault();
        } else if (this._hasFocus && e.which === 9) {
          // tab
          if (this.state.open) {
            this._close(this._onTextInputBlur);
          } else {
            this._onTextInputBlur();
          }
        } else if (items && e.which === 27 && this.state.open) {
          // esc
          e.preventDefault();
          this._close(this._focusInput);
        }
      });

      UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), (e) => {
        switch (e.which) {
          case 13: // enter
            if (items) {
              if (this.state.open && items[current]) {
                itemList.changeValue(items[current].props.value, e, this._onTextInputBlur);
              }
            }
            break;
          case 38: // top
            if (items) {
              e.preventDefault();
              current = current - 1 < -1 ? -1 : current - 1;
              if (this.state.open) {
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
              if (this.state.open) {
                current = current + 1 >= items.length ? items.length - 1 : current + 1;
                items && items.length && items[current].focus();
              } else {
                current = 0;
                itemList = this._itemList;
                items = itemList.getRenderedChildren();
                items && items.length && items[current].focus();
              }
            } else if (!this.state.open) {
              this.setState({ open: true }, this._onOpen);
            }
            break;
          default:
            break;
        }
      });
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
      let labelMatch = `label[id='${this.getId()}']`;
      let inputMatch = `.uu5-forms-items-input[id='${this.getId()}-input']`;
      let pickerMatch = "[id='" + this.getId() + "-item-list-inner']";
      let tagMatch = ".uu5-bricks-label";
      let result = {
        component: false,
        input: false,
        label: false,
        tag: false,
        picker: false,
      };
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
          } else if (item[functionType](tagMatch)) {
            result.tag = true;
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

    _onOpen(setStateCallback) {
      if (this._itemList) {
        this._itemList.open(
          {
            aroundElement: UU5.Common.DOM.findNode(this._itemsInput),
            position: "bottom",
            offset: 4,
            fitWidthToAroundElement: this.props.popoverLocation === "portal",
          },
          setStateCallback
        );
      } else if (typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _onMouseDown(e) {
      let clickData = this._findTarget(e);

      if (!(clickData.input || clickData.picker)) {
        this._close(this._onTextInputBlur);
        this._removeEvent();
      }
    },

    _onTextInputBlur() {
      if (this._hasFocus) {
        let callback = this._hasTempFeedback ? this.setInitial : undefined;

        if (!this.props.multiple && this.state.searchValue && this.state.searchValue.trim()) {
          let potentialValue;

          if (this.props.allowCustomTags) {
            potentialValue = this.state.searchValue.trim();
          } else {
            // if there is only one matching tag, set it as a value
            let matchingTag = this._getMatchingTags(this.state.searchValue.trim());
            potentialValue = Array.isArray(matchingTag) && matchingTag.length === 1 ? matchingTag[0].value : undefined;
          }

          if (potentialValue) {
            callback = () => this._addTagValue({ value: potentialValue });
          }
        }

        this._hasFocus = false;
        this._removeEvent();
        this.setState((state) => (state.open ? { open: false, searchValue: "" } : undefined), callback);
      }
    },

    _onInputFocus() {
      if (!this._hasFocus) {
        this._hasFocus = true;
        this._addKeyboardEvent();
        this._addEvent();
      }
    },

    _focusInput() {
      if (this._textInput) {
        this._textInput.focus();
      }

      this._onInputFocus();
    },

    _onInputClick() {
      this.setState(
        (state) => (!state.open ? { open: true } : undefined),
        () => this._onOpen(this._focusInput)
      );
    },

    _onMainInputFocus() {
      this._addKeyboardEvent();
    },

    _getTagList() {
      let result;
      if (this._hasValue(this.state.value)) {
        if (this.props.multiple) {
          result = this.state.value.map((value) => {
            let tag = this._availableTags.find((availableTag) => availableTag.value === value);

            return (
              <UU5.Bricks.Label
                key={value}
                colorSchema="custom"
                // Arrow fn because sending tag is necessary
                // eslint-disable-next-line react/jsx-no-bind
                iconOnClick={
                  this.isReadOnly() || this.isComputedDisabled() ? null : (_, e) => this._removeTagValue(e, value)
                }
                icon="mdi-close"
                className={this.getClassName("tag")}
                tooltip={this._getTagTooltip(tag)}
              >
                <span className={this.getClassName("tagTextWrapper")}>{this._getTagContent(tag)}</span>
              </UU5.Bricks.Label>
            );
          });
        } else {
          result = this.state.value[0];
        }
      } else {
        result = [];
      }

      return result;
    },

    _onTextInputKeyPress(e) {
      if ((e.keyCode || e.which) === 13 && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault(); // prevent sending form

        if (!this.isReadOnly() && !this.isComputedDisabled()) {
          this._addTagValue({ value: this.state.searchValue });
        }
      }
    },

    _getTextInput() {
      return (
        <TextInput
          key="text-input"
          value={this.state.searchValue}
          wrapperAttrs={{
            onClick: !this.isReadOnly() && !this.isComputedDisabled() ? this._onInputClick : undefined,
          }}
          placeholder={this.props.placeholder || this.getLsiValue("placeholder")}
          ref_={this._registerTextInput}
          onFocus={this._onInputFocus}
          bgStyle="transparent"
          onChange={this._onSearchValueChange}
          className={this.getClassName("textInput")}
          disabled={this.isComputedDisabled()}
          readonly={this.isReadOnly()}
          onKeyDown={!this.isReadOnly() && !this.isComputedDisabled() ? this._onTextInputKeyPress : undefined}
          colorSchema={this.props.colorSchema === "custom" ? this.props.colorSchema : undefined}
        />
      );
    },

    _getItemListItems() {
      let foundAutocompleteItems = this._hasValue(this.state.value)
        ? this._availableTags.filter(({ value }) => this.state.value.indexOf(value) === -1)
        : this._availableTags;

      if (this.state.searchValue && this.state.searchValue.trim()) {
        foundAutocompleteItems = this._getMatchingTags(this.state.searchValue.trim(), foundAutocompleteItems);
      }

      return foundAutocompleteItems.map((item, i) => (
        <Option
          className={this.getClassName("item")}
          key={i}
          value={item.value}
          content={this._getTagContent(item)}
          mainAttrs={{ id: this.getId() + "-item-" + i, tabIndex: 0 }}
        />
      ));
    },

    _getInputContent() {
      if (this._hasValue(this.state.value)) {
        let inputContent = [this._getTextInput()];

        if (!this.state.searchValue && !this.state.searchValue.trim()) {
          let tag = this._availableTags.find((availableTag) => availableTag.value === this._getTagList());

          inputContent.push(
            <div className={this.getClassName("valueWrapper")} title={this._getTagTooltip(tag)} key="value">
              {this._getTagContent(tag)}
            </div>
          );
        }

        return inputContent;
      } else {
        return this._getTextInput();
      }
    },

    _getMultiInputContent() {
      let content = this._getTagList();
      content.push(this._getTextInput());
      return content;
    },

    _onEnterResetIcon(e) {
      if (e.which === 13) {
        this._emptyValues(e);
      }
    },

    _getInputValue() {
      let value = this.props.multiple ? this._getMultiInputContent() : this._getInputContent();

      return (
        <div className={this.getClassName("inputValueWrapper")}>
          <div className={this.getClassName("inputValue")}>{value}</div>
          {this._hasValue(this.state.value) && !this.isComputedDisabled() ? (
            <div className={this.getClassName("inputResetIconWrapper")}>
              <UU5.Bricks.Icon
                icon="mdi-close"
                className={this.getClassName("inputResetIcon")}
                mainAttrs={
                  !this.isReadOnly()
                    ? { onClick: this._emptyValues, onKeyPress: this._onEnterResetIcon, tabIndex: "0" }
                    : null
                }
              />
            </div>
          ) : null}
        </div>
      );
    },

    _getItemList() {
      let result = null;

      if (this.state.open) {
        let items = this._getItemListItems();

        if (items.length) {
          let className = this.getClassName("itemList");
          if (this.props.popoverLocation === "portal") {
            className += " " + this.getClassName("input", "UU5.Forms.InputMixin") + this.props.size;
          }

          result = (
            <ItemList
              onChange={this._addTagValue}
              ref={this._registerItemList}
              id={`${this.getId()}-item-list`}
              value={this.state.value}
              parent={this}
              className={className}
              location={this.props.popoverLocation}
            >
              {items}
            </ItemList>
          );
        }
      }

      return result;
    },

    _getInputMainAttrs() {
      let attrs = this.props.inputAttrs || {};
      attrs.tabIndex = "-1";

      if (this.state.open) {
        if (attrs.className) {
          attrs.className += " " + this.getClassName("inputOpen");
        } else {
          attrs.className = this.getClassName("inputOpen");
        }
      }

      if (!this.isReadOnly() && !this.isComputedDisabled()) {
        attrs = {
          ...{
            tabIndex: !this.isReadOnly() && !this.isComputedDisabled() ? "0" : undefined,
            onFocus: !this.isReadOnly() && !this.isComputedDisabled() ? () => this._onMainInputFocus() : null,
            onClick: !this.isReadOnly() && !this.isComputedDisabled() ? () => this._onInputClick() : null,
          },
          ...attrs,
        };
      }

      return attrs;
    },

    _getMainPropsToPass() {
      let props = this._getInputAttrs();

      if (this.props.colorSchema) {
        props.className += " " + "color-schema-" + this.props.colorSchema;
      }

      return props;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      return (
        <UU5.Bricks.Div {...this._getMainPropsToPass()}>
          {this.getLabel(inputId)}
          {this.getInputWrapper(
            <>
              <ItemsInput
                id={inputId}
                name={this.props.name || inputId}
                value={this._getInputValue()}
                disabled={this.isDisabled() || this.isLoading()}
                readonly={this.isReadOnly()}
                loading={this.isLoading()}
                feedback={this.getFeedback()}
                ref_={this._registerItemsInput}
                colorSchema={this.props.colorSchema}
                className={this.getClassName("itemsInput")}
                borderRadius={UU5.Common.Tools.fillUnit(this.props.borderRadius)}
                elevation={this.props.elevation}
                bgStyle={this.props.bgStyle}
                inputWidth={this._getInputWidth()}
                mainAttrs={this._getInputMainAttrs()}
              />
              {this._getItemList()}
              {this.props.popoverLocation === "portal" && this.state.open ? (
                <UU5.Bricks.ResizeObserver onResize={this._onInputWrapperResize} key="resizeObserver" />
              ) : null}
            </>
          )}
        </UU5.Bricks.Div>
      );
    },
    //@@viewOff:render
  })
);

export default TagSelect;
