/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./forms-ns.js";

import InputMixin from "./mixins/input-mixin.js";
import Loading from "./internal/loading.js";

import Context from "./form-context.js";
import { classNames } from "./internal/icon-picker-styles";

import "./icon-picker.less";
//@@viewOff:imports

let _icons = {};

const ALL_ICONS_NAME = "all";

function isStandardObject(label) {
  return label && typeof label === "object" && !label.type;
}

function getCategoryByCode(code, categories) {
  return categories.find((categoryDef) =>
    typeof categoryDef === "object" ? code === categoryDef.code : categoryDef === code
  );
}

function getIconLibrariesFromIconList(iconList) {
  let libraries = [];

  for (let icon of iconList) {
    icon = typeof icon === "object" ? icon.icon : icon;
    let library = icon.split("-")[0];
    if (libraries.indexOf(library) === -1) libraries.push(library);
  }

  return libraries;
}

function getIconLibrariesFromCategory(category, availableCategories) {
  if (category === ALL_ICONS_NAME) {
    let result = [];

    for (let i = 0; i < availableCategories.length; i++) {
      let iItem = availableCategories[i];
      if (typeof iItem === "object") {
        let categories = getIconLibrariesFromIconList(iItem.iconList);
        result = [...result, ...categories];
      } else {
        result.push(iItem);
      }
    }

    return result;
  }

  let categoryDefinition = getCategoryByCode(category, availableCategories);

  if (typeof categoryDefinition === "object") {
    return getIconLibrariesFromIconList(categoryDefinition.iconList);
  } else {
    return [categoryDefinition];
  }
}

function getIconsToRender(icons, category, availableCategories, hideEmptyIcon) {
  let resultIcons = [];
  if (!hideEmptyIcon) resultIcons.push("iconpicker-remove-selection");
  let selectedCategoryDefinition = getCategoryByCode(category, availableCategories);

  if (typeof selectedCategoryDefinition === "object" && selectedCategoryDefinition.iconList) {
    resultIcons = [
      ...resultIcons,
      ...selectedCategoryDefinition.iconList.map((icon) =>
        icon && typeof icon === "object" ? { ...icon, category: selectedCategoryDefinition.code } : icon
      ),
    ];
  } else if (category === ALL_ICONS_NAME) {
    for (let availableCategory of availableCategories) {
      let categoryIcons =
        typeof availableCategory === "object" && availableCategory.iconList
          ? availableCategory.iconList.map((icon) => ({ ...icon, category: availableCategory.code }))
          : icons[availableCategory];
      if (categoryIcons) {
        resultIcons = [...resultIcons, ...categoryIcons];
      }
    }
  } else {
    let categoryIcons = icons[category];
    if (categoryIcons) {
      resultIcons = [...resultIcons, ...categoryIcons];
    }
  }

  // remove plus4u icon because of its abnormal size
  let plus4uIconIndex = resultIcons.indexOf("plus4u5-plus4u");
  if (plus4uIconIndex > -1) {
    resultIcons.splice(plus4uIconIndex, 1);
  }

  return resultIcons;
}

function getIconDefinitionByName(iconName, availableCategories) {
  for (let i = 0; i < availableCategories.length; i++) {
    let category = availableCategories[i];
    if (typeof category === "object") {
      let iconList = category.iconList;
      for (let j = 0; j < iconList.length; j++) {
        let icon = iconList[j];
        let iconCode = icon.code;
        if (iconCode) {
          iconCode = category.code + "-" + iconCode;
          if (iconCode === iconName) {
            return icon;
          }
        }
      }
    }
  }
}

function getIconFullCode(iconDefinition, category) {
  return iconDefinition.code ? `${category}-${iconDefinition.code}` : iconDefinition.icon;
}

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
      InputMixin,
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("IconPicker"),
      classNames,
      defaults: {
        arrowIcon: "mdi-menu-down",
      },
      lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Forms.iconPicker, UU5.Environment.Lsi.Forms.message),
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      disableBackdrop: UU5.PropTypes.bool,
      categories: UU5.PropTypes.arrayOf(
        UU5.PropTypes.oneOfType([
          UU5.PropTypes.string,
          UU5.PropTypes.shape({
            code: UU5.PropTypes.string,
            label: UU5.PropTypes.oneOfType([UU5.PropTypes.node, UU5.PropTypes.object]),
            iconList: UU5.PropTypes.arrayOf(
              UU5.PropTypes.oneOfType([
                UU5.PropTypes.string,
                UU5.PropTypes.shape({
                  icon: UU5.PropTypes.string,
                  state: UU5.PropTypes.string,
                  component: UU5.PropTypes.func,
                  code: UU5.PropTypes.string,
                }),
              ])
            ),
          }),
        ])
      ),
      selectedCategory: UU5.PropTypes.string,
      placeholder: UU5.PropTypes.string,
      required: UU5.PropTypes.bool,
      requiredMessage: UU5.PropTypes.any,
      value: UU5.PropTypes.oneOfType([
        UU5.PropTypes.string,
        UU5.PropTypes.shape({
          icon: UU5.PropTypes.string,
          state: UU5.PropTypes.string,
        }),
      ]),
      borderRadius: UU5.PropTypes.string,
      bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
      openToContent: UU5.PropTypes.oneOfType([UU5.PropTypes.bool, UU5.PropTypes.string]),
      onClose: UU5.PropTypes.func,
      popoverLocation: UU5.PropTypes.oneOf(["local", "portal"]),
      hideSearchInput: UU5.PropTypes.bool,
      hideEmptyIcon: UU5.PropTypes.bool,
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
        onClose: null,
        popoverLocation: "local", // "local" <=> backward-compatible behaviour
        hideSearchInput: false,
        hideEmptyIcon: false,
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      let selectedCategory = this.props.categories?.[0];
      if (this.props.selectedCategory === ALL_ICONS_NAME) {
        selectedCategory = ALL_ICONS_NAME;
      } else if (this.props.selectedCategory) {
        selectedCategory = this.props.categories.find((item) => item === this.props.selectedCategory)
          ? this.props.selectedCategory
          : this.props.categories[0];
      }
      if (selectedCategory && typeof selectedCategory === "object") {
        selectedCategory = selectedCategory.code;
      }
      return {
        open: false,
        loading: false,
        error: false,
        selectedCategory,
        icons: {},
        searchString: "",
        scrollPosition: null,
      };
    },

    UNSAFE_componentWillMount() {
      this._calls = [];

      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: this.state.value, event: null, component: this });
      }

      this._lastScroll = 0;
    },

    UNSAFE_componentWillReceiveProps(nextProps) {
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
            component: this,
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
        isValidIcon = this.state.icons[category].some((icon) => icon === value);
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
              context: { event: opt.event, func: this.props.onValidate, result: result },
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
              footerClassName: this.getClassName("pickerFooter"),
            },
            () => {
              this._virtualList.setScrollTop(this._lastScroll);

              UU5.Environment.EventListener.addWindowEvent("keydown", this.getId(), (e) => {
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
          .some((size) => {
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
            let ruleIcons = selectors.map((selector) => {
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

              if (result && !result.endsWith("-")) {
                return result;
              } else {
                return null;
              }
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

      getIconLibrariesFromCategory(this.state.selectedCategory, this.props.categories).forEach((library) => {
        if (!_icons[library]) {
          callbackExecuted = true;
          if (this._calls.length === 0) {
            this.setState({ loading: true, error: false });
          }
          this._calls.push(library);
          let xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = () => {
            if (!this.isRendered()) return;
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
          this.setState((state) => {
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

    _getVirtualListItem(item) {
      let icon;
      if (item.data == "iconpicker-remove-selection") {
        let className = this.getClassName("pickerItem") + " " + this.getClassName("removeSelection");
        icon = (
          <span
            className={className}
            onClick={(e) => this._onClickIcon(null, e)}
            title={this.getLsiValue("removeSelection")}
            tabIndex={0}
          />
        );
      } else {
        let className = "";
        if (this.getValue() === item.data) {
          className += this.getClassName("pickerItemSelected");
        }
        if (typeof item.data === "object") {
          if (item.data.component) {
            className += " " + this.getClassName("pickerItemCustom");
            const Component = item.data.component;
            icon = (
              <span
                title={getIconFullCode(item.data, item.data.category)}
                className={className}
                tabIndex={0}
                onClick={
                  !this.isReadOnly() && !this.isComputedDisabled() ? (e) => this._onClickIcon(item.data, e) : null
                }
                onKeyDown={(e) => this._onIconEnter(item.data, e)}
              >
                <Component icon={item.data.icon} state={item.data.state} />
              </span>
            );
          } else {
            className += " " + this.getClassName("pickerItemTag");
            icon = (
              <UU5.Bricks.Tag
                icon={item.data.icon}
                state={item.data.state}
                tooltip={item.data.icon}
                className={className}
                mainAttrs={{
                  tabIndex: 0,
                  onClick:
                    !this.isReadOnly() && !this.isComputedDisabled() ? (e) => this._onClickIcon(item.data, e) : null,
                  onKeyDown: (e) => this._onIconEnter(item.data, e),
                }}
              />
            );
          }
        } else {
          className = " " + this.getClassName("pickerItem");
          icon = (
            <UU5.Bricks.Icon
              icon={item.data}
              tooltip={item.data}
              className={className}
              mainAttrs={{
                tabIndex: 0,
                onClick:
                  !this.isReadOnly() && !this.isComputedDisabled() ? (e) => this._onClickIcon(item.data, e) : null,
                onKeyDown: (e) => this._onIconEnter(item.data, e),
              }}
            />
          );
        }
      }

      return icon;
    },

    _getIconButtons() {
      let result;

      if (this.state.error) {
        result = <div className={this.getClassName("error")}>{this.getLsiComponent("loadError")}</div>;
      } else if (this.isLoadingData()) {
        result = <UU5.Bricks.Loading />;
      } else {
        let icons = getIconsToRender(
          this.state.icons,
          this.state.selectedCategory,
          this.props.categories,
          this.props.hideEmptyIcon
        );

        if (this.state.searchString) {
          let regexp = new RegExp(this.state.searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "g");
          icons = icons.filter((icon) => {
            let iconSearchCode = icon;
            if (typeof icon === "object") iconSearchCode = icon.code ? `${icon.category}-${icon.code}` : icon.icon;
            return iconSearchCode.match(regexp);
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
                bottom: 1,
              }}
              initialScrollTop={this.state.scrollPosition}
              ref_={(list) => (this._virtualList = list)}
              item={this._getVirtualListItem}
            />
          );
        }
      }

      return result;
    },

    _getDisplayedValue() {
      let iconDefinition =
        (this.state.value && typeof this.state.value === "object"
          ? this.state.value
          : getIconDefinitionByName(this.state.value, this.props.categories)) || this.state.value;
      if (iconDefinition && !this.isLoading()) {
        if (typeof iconDefinition === "object") {
          if (iconDefinition.component) {
            const Component = iconDefinition.component;
            return (
              <span className={this.getClassName("selectedCustom")}>
                <Component icon={iconDefinition.icon} state={iconDefinition.state} />
              </span>
            );
          } else {
            return (
              <UU5.Bricks.Tag
                icon={iconDefinition.icon}
                state={iconDefinition.state}
                className={this.getClassName("selectedTag")}
              />
            );
          }
        } else {
          return <UU5.Bricks.Icon icon={iconDefinition} className={this.getClassName("selectedIcon")} />;
        }
      } else {
        return " ";
      }
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
        ref_: (button) => (this._button = button),
        id: this.getId() + "-button",
        disabled: this.isComputedDisabled() || this.isReadOnly(),
        bgStyle: this.props.bgStyle || "filled",
        borderRadius: this.props.borderRadius,
        elevation: this.props.elevation,
        mainAttrs: this.props.inputAttrs,
      };

      return (
        <UU5.Bricks.Button {...props}>
          {this._getDisplayedValue()}
          {this.isLoading() ? (
            <Loading className={this.getClassName("loading")} id={this.getId()} />
          ) : (
            <UU5.Bricks.Icon icon={this.getDefault("arrowIcon")} className={this.getClassName("arrowIcon")} />
          )}
        </UU5.Bricks.Button>
      );
    },

    _getHeader() {
      let categories = this.props.categories.map((category) => {
        if (typeof category === "object") {
          return {
            content: isStandardObject(category.label) ? <UU5.Bricks.Lsi lsi={category.label} /> : category.label,
            value: category.code,
          };
        } else {
          return { content: category, value: category };
        }
      });
      if (this.props.categories.length > 1) {
        categories.unshift({ content: this.getLsiComponent("selectAll"), value: ALL_ICONS_NAME });
      }

      return (
        <UU5.Bricks.Row className={this.getClassName("header")}>
          {!this.props.hideSearchInput ? (
            <UU5.Forms.TextIcon
              onChange={(opt) => {
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
          ) : null}
          {this.props.categories.length > 1 ? (
            <UU5.Forms.Select
              onChange={(opt) => {
                opt.component.onChangeDefault(opt);
                let value = opt.value;
                this._changeCategory(value);
              }}
              openToContent={false}
              value={this.state.selectedCategory}
              className={this.getClassName("categoryInput")}
              readOnly={this.isReadOnly()}
              disabled={this.isComputedDisabled()}
              size="s"
              mainAttrs={{
                onClick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                },
              }}
            >
              {categories.map((category, key) => (
                <UU5.Forms.Select.Option content={category.content} key={key} value={category.value} />
              ))}
            </UU5.Forms.Select>
          ) : null}
        </UU5.Bricks.Row>
      );
    },

    _getPickerProps() {
      let props = {};

      props.ref_ = (ref) => (this._picker = ref);
      props.fitHeightToViewport = true;
      props.forceRender = true;
      props.controlled = false;
      props.disableBackdrop = this.props.disableBackdrop;
      props.header = this._getHeader();
      props.location = !this._shouldOpenToContent() ? this.props.popoverLocation : "local";
      props.id = this.getId() + "-popover";
      props.className = "";

      if (this.props.popoverLocation === "portal") {
        props.className = this.getClassName("input", "UU5.Forms.InputMixin") + this.props.size;
      }

      if (this.props.categories.length > 1) {
        props.className += " " + this.getClassName("multicategory");
      }

      if (this.state.readOnly) {
        props.className += " " + this.getClassName("readOnly", "UU5.Forms.InputMixin");
      }

      return props;
    },

    _getMainAttrs() {
      let mainAttrs = this._getInputAttrs();
      mainAttrs.id = this.getId();
      mainAttrs.ref = (root) => (this._root = root);

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
            </UU5.Bricks.Popover>,
          ])}
        </div>
      );
    },
    //@@viewOff:render
  })
);

export const Iconpicker = IconPicker;

export default IconPicker;
