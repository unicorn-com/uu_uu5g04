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
import ns from "./forms-ns.js";

import InputMixin from "./mixins/input-mixin.js";
import Loading from "./internal/loading.js";

import Context from "./form-context.js";

import "./icon-picker.less";
//@@viewOff:imports

let _icons = {};

export const IconPicker = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "IconPicker", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ScreenSizeMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ColorSchemaMixin,
      InputMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("IconPicker"),
      classNames: {
        rightWrapper: ns.css("right-wrapper"),
        right: ns.css("input-label-right"),
        main: ns.css("iconpicker"),
        open: ns.css("iconpicker-open"),
        openButton: ns.css("iconpicker-open-button"),
        selectedIcon: ns.css("iconpicker-selected-icon"),
        arrowIcon: ns.css("iconpicker-arrow-down-icon"),
        picker: ns.css("iconpicker-picker"),
        pickerBody: ns.css("iconpicker-body"),
        pickerHeader: ns.css("iconpicker-header"),
        pickerFooter: ns.css("iconpicker-footer"),
        pickerItem: ns.css("iconpicker-item"),
        pickerItemSelected: ns.css("iconpicker-item-selected"),
        error: ns.css("iconpicker-error"),
        multicategory: ns.css("iconpicker-multicategory"),
        searchInput: ns.css("iconpicker-search-input"),
        categoryInput: ns.css("iconpicker-category-input"),
        removeSelection: ns.css("iconpicker-remove-selected-icon"),
        loading: ns.css("input-loading-icon"),
        screenSizeBehaviour: ns.css("screen-size-behaviour"),
        buttonError: ns.css("button-error")
      },
      defaults: {
        arrowIcon: "mdi-menu-down"
      },
      lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Forms.iconPicker, UU5.Environment.Lsi.Forms.message)
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      disableBackdrop: UU5.PropTypes.bool,
      categories: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
      selectedCategory: UU5.PropTypes.oneOf(Object.keys(UU5.Environment.iconLibraries)),
      placeholder: UU5.PropTypes.string,
      required: UU5.PropTypes.bool,
      requiredMessage: UU5.PropTypes.any,
      value: UU5.PropTypes.string,
      borderRadius: UU5.PropTypes.string,
      bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
      openToContent: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string]),
      onClose: UU5.PropTypes.func
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        disableBackdrop: false,
        categories: ["mdi"],
        selectedCategory: "mdi",
        placeholder: null,
        value: null,
        borderRadius: null,
        bgStyle: null,
        elevation: null,
        openToContent: "xs",
        onClose: null
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      let selectedCategory = this.props.categories.find(item => item === this.props.selectedCategory)
        ? this.props.selectedCategory
        : this.props.categories[0];
      return {
        open: false,
        loading: false,
        error: false,
        selectedCategory: [selectedCategory],
        icons: [],
        searchString: "",
        scrollPosition: null
      };
    },

    componentWillMount() {
      this._calls = [];

      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: this.state.value, event: null, component: this });
      }

      this._lastScroll = 0;
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.controlled) {
        if (nextProps.onValidate && typeof nextProps.onValidate === "function") {
          this._validateOnChange({ value: nextProps.value, event: null, component: this }, true);
        }
      }

      return this;
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    open(setStateCallback) {
      if (!this.state.open) {
        this.setState({ open: true }, () => this._open(setStateCallback));
      }

      return this;
    },

    close(setStateCallback) {
      if (this.state.open) {
        this._lastScroll = this._virtualList.getScrollTop();
        this._close(setStateCallback);
      }

      return this;
    },

    toggle(setStateCallback) {
      if (this.isOpen()) {
        this.close(setStateCallback);
      } else {
        this.open(setStateCallback);
      }
      return this;
    },

    isOpen() {
      return this.state.open;
    },

    isLoadingData() {
      return this.state.loading;
    },

    isValid() {
      let feedback = this.getFeedback();
      let result = true;

      if (this.props.required && (!this.state.value || this.state.value.length < 1)) {
        this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"));
        result = false;
      } else if (feedback === "error") {
        result = false;
      } else if (typeof this.isValid_ === "function") {
        result = this.isValid_();
      }

      if (result && typeof this.props.onValidate === "function") {
        let validation = this.props.onValidate(value, this);
        if (validation && typeof validation === "object") {
          if (validation.feedback === "error") {
            result = false;
          }
        }
      }

      return result;
    },

    onChangeDefault(opt, setStateCallback) {
      this.setValue(opt.value, () =>
        this.isOpen()
          ? this.close(setStateCallback)
          : typeof setStateCallback === "function"
          ? setStateCallback()
          : null
      );
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    setValue_(value, setStateCallback) {
      if (typeof this.props.onValidate === "function") {
        this._validateOnChange(
          {
            value: value,
            event: null,
            component: this
          },
          false,
          () =>
            this.isOpen() ? this.close(setStateCallback) : typeof setStateCallback === "function" && setStateCallback()
        );
      } else {
        this.setInitial(null, value, () =>
          this.isOpen() ? this.close(setStateCallback) : typeof setStateCallback === "function" && setStateCallback()
        );
      }

      return this;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _checkRequired(value) {
      let result = true;
      let isValidIcon;
      for (let category in this.state.icons) {
        isValidIcon = this.state.icons[category].some(icon => icon === value);
      }

      if (!isValidIcon && this.props.required && this.shouldValidateRequired()) {
        result = false;
      }

      return result;
    },

    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = this.props.onValidate(opt);
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
              context: { event: opt.event, func: this.props.onValidate, result: result }
            });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _open(setStateCallback) {
      this._loadIcons(() => {
        if (this._picker) {
          this._picker.open(
            {
              onBeforeClose: () => (this._lastScroll = this._virtualList.getScrollTop()),
              onClose: () => this.isOpen() && this._close(),
              aroundElement: this._button,
              position: "bottom",
              offset: this._shouldOpenToContent() ? 0 : 4,
              preventPositioning: this._shouldOpenToContent(),
              className: this.getClassName("picker"),
              bodyClassName: this.getClassName("pickerBody"),
              headerClassName: this.getClassName("pickerHeader"),
              footerClassName: this.getClassName("pickerFooter")
            },
            () => {
              this._virtualList.setScrollTop(this._lastScroll);

              UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), e => {
                if (e.which === 27) {
                  this.close();
                  e.preventDefault();
                }
              });

              if (this._shouldOpenToContent()) {
                UU5.Common.Tools.scrollToTarget(
                  this.getId() + "-button",
                  false,
                  UU5.Environment._fixedOffset + 20,
                  this._findScrollElement(this._root)
                );
              }

              typeof setStateCallback === "function" && setStateCallback();
            }
          );
        } else if (typeof setStateCallback === "function") {
          setStateCallback();
        }
      });
    },

    _close(setStateCallback) {
      UU5.Environment.EventListener.removeWindowEvent("keydown", this.getId());

      this.setState({ open: false }, () => {
        if (!this._checkRequired(this.state.value)) {
          this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessageChoice"), this.state.value);
        } else {
          this.setInitial(null, this.state.value);
        }

        if (this._picker) {
          this._picker.close(setStateCallback);
        } else if (typeof setStateCallback === "function") {
          setStateCallback();
        }

        if (typeof this.props.onClose === "function") {
          this.props.onClose();
        }
      });
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

    _onClickButton() {
      this.toggle();
    },

    _onClickIcon(iconName, event) {
      let opt = { component: this, event: event, value: iconName };
      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
    },

    _onIconEnter(iconName, event) {
      if (event.which === 13) {
        event.preventDefault();
        this._onClickIcon(iconName, event);
      }
    },

    _onChangeSearchString(searchString) {
      this._lastSearch = new Date();
      setTimeout(() => {
        if (new Date() - this._lastSearch >= 500) {
          this.setState({ searchString: searchString });
        }
      }, 500);
    },

    _resetSearchString() {
      this.setState({ searchString: "" });
    },

    _changeCategory(category) {
      this.setState({ selectedCategory: category }, () => this._open());
    },

    _parseRules(rules, library) {
      let icons = [];

      if (rules) {
        for (let i = 0; i < rules.length; i++) {
          let rule = rules[i];
          if (rule.selectorText && rule.style.content) {
            let selectors = rule.selectorText.split(",");
            let ruleIcons = selectors.map(selector => {
              let result = false;
              if (
                selector.startsWith("." + library + "-") &&
                (selector.endsWith(":before") || selector.endsWith(":after"))
              ) {
                result = selector.substr(1).replace(/[^a-zA-Z0-9\-_].*/, "");
              } else {
                let match = selector.match(/^\[\s*class\s*\*=\s*['"]?([a-zA-Z0-9_\-]*).*:(before|after)$/);
                if (match) {
                  result = match[1];
                }
              }
              return result || null;
            });
            ruleIcons[0] && icons.push(ruleIcons[0]);
          }
        }
      }

      return icons;
    },

    _loadIcons(setStateCallback) {
      this._calls = []; // reset loading
      let callbackExecuted = false;

      this.state.selectedCategory.forEach(library => {
        if (!_icons[library]) {
          callbackExecuted = true;
          if (this._calls.length === 0) {
            this.setState({ loading: true, error: false });
          }
          this._calls.push(library);
          let xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
              let callIndex;
              this._calls.find((call, index) => {
                callIndex = index;
                return call == library;
              });
              this._calls.splice(callIndex, 1);

              let styleSheet = document.createElement("style");
              styleSheet.textContent = xhttp.responseText.replace(/@font-face\{[^}]*\}/g, "");
              document.head.appendChild(styleSheet);

              let rules = (styleSheet.sheet || {}).cssRules;
              let icons = new Set(this._parseRules(rules, library));

              _icons[library] = [...icons];

              if (this._calls.length === 0) {
                this.setState({ loading: false, error: false, icons: _icons }, setStateCallback);
              }
            } else if (xhttp.readyState == 2 && xhttp.status >= 400) {
              let callIndex;
              this._calls.find((call, index) => {
                callIndex = index;
                return call == library;
              });
              this._calls.splice(callIndex, 1);
              if (this.state.selectedCategory.length === 1) {
                this.setState({ error: true }, setStateCallback);
              } else {
                this.setState({ loading: false }, setStateCallback);
              }
            }
          };
          xhttp.open("GET", UU5.Environment.iconLibraries[library], true);
          xhttp.send();
        } else if (!this.state.icons[library]) {
          this.setState(state => {
            let icons = { ...state.icons, ...{ [library]: _icons[library] } };
            return { icons: icons, loading: false };
          });
        } else {
          this.setState({ loading: false, error: false });
        }
      });

      if (!callbackExecuted && typeof setStateCallback === "function") {
        setStateCallback();
      }
    },

    _getIconButtons() {
      let result;

      if (this.state.error) {
        result = <div className={this.getClassName("error")}>{this.getLsiComponent("loadError")}</div>;
      } else if (this.isLoadingData()) {
        result = <UU5.Bricks.Loading />;
      } else {
        let icons = ["iconpicker-remove-selection"];
        this.state.selectedCategory.forEach(category => {
          if (this.state.icons[category]) {
            icons = icons.concat(this.state.icons[category]);
          }

          if (category === "plus4u5") {
            icons.splice(icons.indexOf("plus4u5-plus4u"), 1);
          }
        });

        if (this.state.searchString) {
          let regexp = new RegExp(this.state.searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");
          icons = icons.filter(icon => {
            return icon.match(regexp);
          });
        }

        if (!icons || !icons.length) {
          if (this.state.searchString) {
            result = <div className={this.getClassName("error")}>{this.getLsiComponent("noMatchError")}</div>;
          } else {
            result = null;
          }
        } else {
          result = (
            <UU5.Bricks.VirtualList
              data={icons}
              itemHeight={32}
              itemWidth={32}
              height={176}
              width={267}
              boxPadding={{
                left: 4,
                right: 4,
                top: 1,
                bottom: 1
              }}
              initialScrollTop={this.state.scrollPosition}
              ref_={list => (this._virtualList = list)}
              item={item => {
                let icon;
                if (item.data == "iconpicker-remove-selection") {
                  let className = this.getClassName("pickerItem") + " " + this.getClassName("removeSelection");
                  icon = (
                    <span
                      className={className}
                      onClick={e => this._onClickIcon(null, e)}
                      title={this.getLsiValue("removeSelection")}
                      tabIndex={0}
                    ></span>
                  );
                } else {
                  let className = this.getClassName("pickerItem");
                  if (this.getValue() === item.data) {
                    className += " " + this.getClassName("pickerItemSelected");
                  }
                  icon = (
                    <UU5.Bricks.Icon
                      icon={item.data}
                      tooltip={item.data}
                      className={className}
                      mainAttrs={{
                        tabIndex: 0,
                        onClick:
                          !this.isReadOnly() && !this.isComputedDisabled()
                            ? e => this._onClickIcon(item.data, e)
                            : null,
                        onKeyDown: e => this._onIconEnter(item.data, e)
                      }}
                    />
                  );
                }

                return icon;
              }}
            />
          );
        }
      }

      return result;
    },

    _getButton() {
      let className = this.getClassName("openButton");
      if (!this.state.disabled && !this.state.readonly && this.state.feedback && this.state.feedback !== "initial") {
        switch (this.state.feedback) {
          case "success":
            className = className.replace(/ ?color-schema-[a-z-]+ ?/, "");
            className += " color-schema-" + UU5.Environment.getColorSchema("success");
            break;
          case "warning":
            className = className.replace(/ ?color-schema-[a-z-]+ ?/, "");
            className += " color-schema-" + UU5.Environment.getColorSchema("warning");
            break;
          case "error":
            className = className.replace(/ ?color-schema-[a-z-]+ ?/, "");
            className += " color-schema-" + UU5.Environment.getColorSchema("danger");
            className += " " + this.getClassName("buttonError");
            break;
        }
      } else if (this.props.colorSchema) {
        className += " color-schema-" + UU5.Environment.getColorSchema(this.props.colorSchema);
      }

      let props = {
        onClick: !this.isComputedDisabled() ? this._onClickButton : null,
        size: this.props.size,
        className,
        ref_: button => (this._button = button),
        id: this.getId() + "-button",
        disabled: this.isComputedDisabled() || this.isReadOnly(),
        bgStyle: this.props.bgStyle || "filled",
        borderRadius: this.props.borderRadius,
        elevation: this.props.elevation,
        mainAttrs: this.props.inputAttrs
      };

      return (
        <UU5.Bricks.Button {...props}>
          {this.state.value && !this.isLoading() ? (
            <UU5.Bricks.Icon icon={this.state.value} className={this.getClassName("selectedIcon")} />
          ) : (
            " "
          )}
          {this.isLoading() ? (
            <Loading className={this.getClassName("loading")} id={this.getId()} />
          ) : (
            <UU5.Bricks.Icon icon={this.getDefault("arrowIcon")} className={this.getClassName("arrowIcon")} />
          )}
        </UU5.Bricks.Button>
      );
    },

    _getHeader() {
      let categories = [...this.props.categories];
      if (this.props.categories.length > 1) {
        categories.unshift(this.getLsiComponent("selectAll"));
      }

      return (
        <UU5.Bricks.Row>
          <UU5.Forms.TextIcon
            onChange={opt => {
              opt.component.onChangeDefault(opt);
              this._onChangeSearchString(opt.value);
            }}
            icon={this.state.searchString ? "mdi-close" : "mdi-magnify"}
            onClick={this.state.searchString ? this._resetSearchString : null}
            placeholder={this.props.placeholder || this.getLsiValue("searchPlaceholder")}
            className={this.getClassName("searchInput")}
            value={this.state.searchString}
            readOnly={this.isReadOnly()}
            disabled={this.isComputedDisabled()}
            size="s"
          />
          {this.props.categories.length > 1 ? (
            <UU5.Forms.Select
              onChange={opt => {
                opt.component.onChangeDefault(opt);
                let value = opt.value;
                if (opt.value == this.getLsiComponent("selectAll")) {
                  value = [...this.props.categories];
                } else {
                  value = [value];
                }
                this._changeCategory(value);
              }}
              openToContent={false}
              value={
                this.state.selectedCategory.length > 1 ? [this.getLsiComponent("selectAll")] : this.state.selectedCategory
              }
              className={this.getClassName("categoryInput")}
              readOnly={this.isReadOnly()}
              disabled={this.isComputedDisabled()}
              size="s"
              mainAttrs={{
                onClick: e => {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {categories.map((library, key) => (
                <UU5.Forms.Select.Option content={library} key={key} value={library} />
              ))}
            </UU5.Forms.Select>
          ) : null}
        </UU5.Bricks.Row>
      );
    },

    _getPickerProps() {
      let props = {};

      props.ref_ = ref => (this._picker = ref);
      props.fitHeightToViewport = true;
      props.forceRender = true;
      props.controlled = false;
      props.disableBackdrop = this.props.disableBackdrop;
      props.header = this._getHeader();

      return props;
    },

    _getMainAttrs() {
      let mainAttrs = this._getInputAttrs();
      mainAttrs.id = this.getId();
      mainAttrs.ref = root => (this._root = root);

      if (this.isOpen()) {
        mainAttrs.className += " " + this.getClassName("open");
      }

      if (this.props.categories.length > 1) {
        mainAttrs.className += " " + this.getClassName("multicategory");
      }

      if (this._shouldOpenToContent()) {
        mainAttrs.className += " " + this.getClassName("screenSizeBehaviour");
      }

      return mainAttrs;
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      return (
        <div {...this._getMainAttrs()}>
          {this.getLabel(this.getId() + "-_button")}
          {this.getInputWrapper([
            <UU5.Bricks.Div className={this.getClassName("rightWrapper")} key="button">
              {this._getButton()}
            </UU5.Bricks.Div>,
            <UU5.Bricks.Popover {...this._getPickerProps()} key="popover">
              {this.isOpen() ? this._getIconButtons() : null}
            </UU5.Bricks.Popover>
          ])}
        </div>
      );
    }
    //@@viewOff:render
  })
);

export const Iconpicker = IconPicker;

export default IconPicker;
