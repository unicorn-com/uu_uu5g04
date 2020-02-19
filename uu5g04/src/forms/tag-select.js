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
    mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, InputMixin],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("TagSelect"),
      classNames: {
        ...TagSelectStyles.CommonClassNames,
        item: ns.css("auto-complete-item", "group-item"),
        inputOpen: ns.css("items-input-open")
      },
      lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Forms.tagSelect, UU5.Environment.Lsi.Forms.message)
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.arrayOf(UU5.PropTypes.string)]),
      availableTags: UU5.PropTypes.arrayOf(
        UU5.PropTypes.shape({
          value: UU5.PropTypes.string,
          content: UU5.PropTypes.string
        })
      ),
      ignoreTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
      allowCustomTags: UU5.PropTypes.bool,
      colorSchema: UU5.PropTypes.string,
      multiple: UU5.PropTypes.bool,
      borderRadius: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
      bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5])
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
        elevation: undefined
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      this._hasFocus = false;
      this._hasTempFeedback = false;
      this._initAvailableTags();

      return {
        searchValue: ""
      };
    },

    componentWillMount() {
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validate({ value: this.state.value, event: null, component: this });
      }
    },

    componentWillReceiveProps(nextProps) {
      this._initAvailableTags(nextProps);

      if (nextProps.controlled) {
        let value = this._filterValues(
          this._normalizeValue(nextProps.value),
          nextProps.availableTags,
          nextProps.ignoreTags
        );
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

        if (opt._data.state) {
          this.setState({ ...opt._data.state }, () => this._onOpen(setStateCallback));
        }
      }

      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    getInitialValue_(propValue) {
      return this._filterValues(this._normalizeValue(propValue));
    },

    setValue_(value, setStateCallback) {
      if (typeof this.props.onValidate === "function") {
        this._validate({ value, event: null, component: this });
      } else {
        this.setState({ value, feedback: "initial" }, setStateCallback);
      }

      return this;
    },

    setFeedback_(feedback, message, value, setStateCallback) {
      this._hasTempFeedback = false;
      this.setFeedbackDefault(feedback, message, value, setStateCallback);
    },

    reset_(setStateCallback) {
      this.setState(
        {
          message: this.props.message,
          feedback: this.props.feedback,
          value: this._filterValues(this._normalizeValue(this.props.value)),
          readOnly: this.props.readOnly
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

    _normalizeValue(value) {
      if (value && !Array.isArray(value)) {
        value = [value];
      } else {
        value = value || [];
      }

      return value;
    },

    _filterValues(value, availableTags = this.props.availableTags, ignoreTags = this.props.ignoreTags) {
      if (!availableTags) {
        availableTags = this.props.availableTags || [];
      }

      if (!ignoreTags) {
        ignoreTags = this.props.ignoreTags || [];
      }

      return value.filter(
        valueItem =>
          availableTags.find(availTagItem => availTagItem.value === valueItem) &&
          !ignoreTags.find(ignoreTag => ignoreTag === valueItem)
      );
    },

    _initAvailableTags(props = this.props) {
      this._availableTags = props.availableTags
        ? props.availableTags.map(tag => ({
            value: tag.value,
            content: tag.content || tag.value,
            searchValue: tag.value ? tag.value.toLowerCase() : tag.value
          }))
        : [];
    },

    _hasValue() {
      return !!(this.state.value && this.state.value.length);
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

    _emptyValues(e) {
      e.stopPropagation();
      this.setState({ value: [] });
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

      let newValue = this.state.value.filter(item => item !== tag);
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
      this.setState(state => {
        let newState = { searchValue };
        if (!state.open) newState.open = true;
        return newState;
      }, this._onOpen);
    },

    _addTagValue({ value }) {
      let newData = { state: {} };
      let isValid = true;
      if (!value) return;
      // validate value towards ignored tags
      if (this.props.ignoreTags && this.props.ignoreTags.find(ignoreTag => ignoreTag === value)) {
        this._hasTempFeedback = true;
        newData.state = { feedback: "error", message: this.getLsiValue("tagIsNotAllowed").replace("$1", value) };
        isValid = false;
      } else if (this._hasValue() && this.state.value.indexOf(value) !== -1) {
        // validate value towards currently set tags
        this._hasTempFeedback = true;
        newData.state = { feedback: "warning", message: this.getLsiValue("tagIsAlreadyAdded").replace("$1", value) };
        isValid = false;
      } else if (!this.props.allowCustomTags && !this._availableTags.find(tag => tag.value === value)) {
        this._hasTempFeedback = true;
        newData.state = { feedback: "error", message: this.getLsiValue("customTagIsNotAllowed") };
        isValid = false;
      } else {
        newData.state = { feedback: "initial", searchValue: "", message: null };

        if (this.props.allowCustomTags) {
          if (!this._availableTags.find(tag => tag.value === value)) {
            let availableTags = [...this._availableTags];
            availableTags.push({ value, content: value, searchValue: value.toLowerCase ? value.toLowerCase() : value });
            newData.availableTags = availableTags;
          }
        }
      }

      if (isValid) {
        value = value === undefined ? this.state.searchValue : value;

        if (this._hasValue() && this.props.multiple) {
          value = [...this.state.value, value];
        } else {
          value = [value];
        }

        newData.state.value = value;
        newData.state.searchValue = "";

        if (!this.props.multiple) {
          newData.state.open = false;
        }

        if (typeof this.props.onChange === "function") {
          this.props.onChange({ component: this, value, _data: newData });
          return;
        }
      }

      this.onChangeDefault({ value, _data: newData });
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

      UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), e => {
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
            offset: 4
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
        this._hasFocus = false;
        this._removeEvent();
        this.setState(
          state => (state.open ? { open: false, searchValue: "" } : undefined),
          this._hasTempFeedback ? this.setInitial : undefined
        );
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
        state => (!state.open ? { open: true } : undefined),
        () => this._onOpen(this._focusInput)
      );
    },

    _onMainInputFocus() {
      this._addKeyboardEvent();
    },

    _getTagList() {
      let result;
      if (this._hasValue()) {
        if (this.props.multiple) {
          result = this.state.value.map(tag => (
            <UU5.Bricks.Label
              key={tag}
              colorSchema="custom"
              // Arrow fn because sending tag is necessary
              // eslint-disable-next-line react/jsx-no-bind
              iconOnClick={
                this.isReadOnly() || this.isComputedDisabled() ? null : (_, e) => this._removeTagValue(e, tag)
              }
              icon="mdi-close"
              className={this.getClassName("tag")}
            >
              <span className={this.getClassName("tagTextWrapper")}>{tag}</span>
            </UU5.Bricks.Label>
          ));
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
            onClick: !this.isReadOnly() && !this.isComputedDisabled() ? this._onInputClick : undefined
          }}
          placeholder={this.props.placeholder || this.getLsiValue("placeholder")}
          ref_={this._registerTextInput}
          onFocus={this._onInputFocus}
          bgStyle="transparent"
          onChange={this._onSearchValueChange}
          className={this.getClassName("textInput")}
          readonly={this.isReadOnly()}
          onKeyDown={!this.isReadOnly() && !this.isComputedDisabled() ? this._onTextInputKeyPress : undefined}
        />
      );
    },

    _getItemListItems() {
      let foundAutocompleteItems = this._hasValue()
        ? this._availableTags.filter(({ value }) => this.state.value.indexOf(value) === -1)
        : this._availableTags;

      if (this.state.searchValue) {
        foundAutocompleteItems = foundAutocompleteItems.filter(
          ({ searchValue }) => searchValue.indexOf(this.state.searchValue.toLowerCase()) !== -1
        );
      }

      return foundAutocompleteItems.map((item, i) => (
        <Option
          className={this.getClassName("item")}
          key={i}
          value={item.value}
          content={item.content}
          mainAttrs={{ id: this.getId() + "-item-" + i, tabIndex: 0 }}
        />
      ));
    },

    _getInputContent() {
      if (this._hasValue()) {
        let content = [this._getTextInput()];

        if (!this.state.searchValue) {
          content.push(this._getTagList());
        }

        return content;
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
          {this._hasValue() && !this.isComputedDisabled() ? (
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
          result = (
            <ItemList
              onChange={this._addTagValue}
              ref={this._registerItemList}
              id={`${this.getId()}-item-list`}
              value={this.state.value}
              parent={this}
              className={this.getClassName("itemList")}
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
            onClick: !this.isReadOnly() && !this.isComputedDisabled() ? () => this._onInputClick() : null
          },
          ...attrs
        };
      }

      return attrs;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      return (
        <UU5.Bricks.Div {...this._getInputAttrs()}>
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
            </>
          )}
        </UU5.Bricks.Div>
      );
    }
    //@@viewOff:render
  })
);

export default TagSelect;
