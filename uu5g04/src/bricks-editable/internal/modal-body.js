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

//@@viewOn:revision
// coded: Martin Mach, 16.09.2020
// reviewed: Filip Janovský, 16.09.2020 - approved
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

import Css from "./css.js";
import RollMenu from "./roll-menu.js";
import Menu from "./menu.js";
import ComponentInfo from "./component-info.js";
import MoveItemFormModal from "./move-item-form-modal.js";
import ns from "../bricks-editable-ns.js";
import Helpers from "./helpers.js";
import Lsi from "../bricks-editable-lsi.js";
import LazyLoadedLibraries from "./lazy-loaded-libraries.js";
import ConfirmModal from "./confirm-modal.js";
//@@viewOff:imports

// check if hooks is already loaded
async function importHooks() {
  let normalizedName = SystemJS.normalizeSync("uu5g04-hooks");
  let isConfigured = !normalizedName.endsWith("uu5g04-hooks");
  if (!isConfigured) {
    SystemJS.config({
      paths: {
        "uu5g04-hooks":
          UU5.Environment.basePath + "uu5g04-hooks" + (process.env.NODE_ENV === "production" ? ".min" : "") + ".js",
      },
    });
  }
  LazyLoadedLibraries["uu5g04-hooks"] = await SystemJS.import("uu5g04-hooks");
}

const ElevationInput = UU5.Common.Component.lazy(async () => {
  await importHooks();
  return import("./elevation-input.js");
});

const BgStyleInput = UU5.Common.Component.lazy(async () => {
  await importHooks();
  return import("./bg-style-input.js");
});

const BorderRadiusInput = UU5.Common.Component.lazy(async () => {
  await importHooks();
  return import("./border-radius-input.js");
});

const SizeInput = UU5.Common.Component.lazy(async () => {
  await importHooks();
  return import("./size-input.js");
});

const ColorSchemaPicker = UU5.Common.Component.lazy(async () => {
  await importHooks();
  return import("./color-schema-picker.js");
});

const FORM_PROPS = {
  spacing: 16,
  inputColWidth: "xs-12",
  labelColWidth: "xs-12",
  labelAlignment: "left",
};
const EDITATION_COMPONENT_PROPS = UU5.PropTypes.oneOfType([
  UU5.PropTypes.func,
  UU5.PropTypes.shape({
    name: UU5.PropTypes.string.isRequired,
    placeholder: UU5.PropTypes.string,
    type: UU5.PropTypes.oneOfType([
      UU5.PropTypes.array,
      UU5.PropTypes.oneOf([
        "text",
        "textarea",
        "number",
        "colorSchemaPicker",
        "uu5string",
        "switchSelector",
        "bool",
        "separator",
        "richText",
        "richTextExpandable",
      ]),
      UU5.PropTypes.node,
    ]),
    required: UU5.PropTypes.bool,
    label: UU5.PropTypes.oneOfType([UU5.PropTypes.node, UU5.PropTypes.object]),
    getProps: UU5.PropTypes.func,
  }),
]);

const EDITATION_SETUP_PROPS = UU5.PropTypes.oneOfType([
  UU5.PropTypes.arrayOf(
    UU5.PropTypes.oneOfType([UU5.PropTypes.arrayOf(EDITATION_COMPONENT_PROPS), EDITATION_COMPONENT_PROPS])
  ),
  UU5.PropTypes.elementType,
]);

function isCompactVersion(screenSize) {
  return !UU5.Common.Tools.isIE() && ["xs", "s", "m"].indexOf(screenSize) > -1;
}

function isMobileVersion(screenSize) {
  return isCompactVersion(screenSize) || UU5.Common.Tools.isMobileOrTablet;
}

function hasMenu(props) {
  return (Array.isArray(props.componentPropsForm) && props.componentPropsForm.length > 1) || props.itemPropsForm;
}

const ModalBody = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ModalBody"),
    classNames: {
      main: (props, state) => {
        let classNames = [ns.css("modal-body")];

        classNames.push(
          Css.css(`
            & > .uu5-bricks-modal-dialog {
              ${isCompactVersion(props.screenSize) ? `min-height: ${state.menuHeight}px;` : ""}
            }

            & > * > .uu5-bricks-modal-header {
              padding: 0;
              border-bottom: solid 1px #E0E0E0;

              & > .uu5-bricks-modal-header-title {
                flex-grow: 1;
              }
            }

            & > * > .uu5-bricks-modal-footer {
              border-top: solid 1px #E0E0E0;
              display: flex;
              justify-content: flex-end;
              padding: 8px 64px;
              ${UU5.Utils.ScreenSize.getMaxMediaQueries("m", `padding: 8px 32px;`)}
              ${UU5.Common.Tools.isIE() ? "background-color: #FFFFFF" : ""}
            }

            & > * > .uu5-bricks-modal-body {
              padding: 0;
              height: 100%;
              display: flex;
              flex: 1 1 auto;
            }
          `)
        );

        return classNames.join(" ");
      },
      headerContent: () =>
        Css.css(`
        padding: 8px;
        display: flex;
        flex-grow: 1;
        justify-content: space-between;
        max-width: 100%;
      `),
      headerLeftWrapper: (props) =>
        Css.css(`
        display: flex;
        align-items: center;
        max-width: 100%;
        ${!isCompactVersion(props.screenSize) || !hasMenu(props) ? "padding-left: 8px;" : ""}
      `),
      headerText: () =>
        Css.css(`
        z-index: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `),
      cancelButton: () =>
        Css.css(`
        margin-right: 8px;
      `),
      standardEditMenu: (props) =>
        Css.css(`
        font-size: 15px;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-style: solid;
        border-color: #E0E0E0;
        border-width: 0 1px 0 0;
        background-color: #FAFAFA;
        flex: 0 0 auto;
        ${props.menuWidth ? `width: ${UU5.Common.Tools.fillUnit(props.menuWidth)};` : ""}
      `),
      compactEditMenu: () =>
        Css.css(`
        font-size: 15px;
        height: 100%;
        flex: none;
        z-index: 1;
      `),
      compactEditMenuAnimated: () =>
        Css.css(`
        height: 100%;
        display: flex;
        flex-direction: column;
      `),
      compactEditMenuBackgroundLayer: () =>
        Css.css(`
        background-color: #FAFAFA;
        display: flex;
        flex-direction: column;
      `),
      compactEditMenuHeader: () =>
        Css.css(`
        padding: 8px;
      `),
      editMenuOpenButton: () =>
        Css.css(`
        margin-right: 8px;
      `),
      categoriesRow: () =>
        Css.css(`
        border-bottom: solid 1px #E0E0E0;
        overflow: hidden;
        flex: 0 0 auto;
      `),
      itemListRow: () =>
        Css.css(`
        overflow: hidden;
        flex: 1 1 auto;
        height: 100%;
      `),
      itemListWrapper: () =>
        Css.css(`
        padding: 0 10px;
      `),
      standardLayoutWrapper: () =>
        Css.css(`
        flex-grow: 1;
      `),
      compactLayoutWrapper: () =>
        Css.css(`
        width: 100%;
        position: relative;
      `),
      editation: () =>
        Css.css(`
        height: 100%;
        overflow: auto;
        padding: 0;
        flex: 1 1 auto;
      `),
      editForm: () =>
        Css.css(`
        padding: 0;
      `),
      editationContent: () =>
        Css.css(`
        padding: 0 64px 24px;
        ${UU5.Utils.ScreenSize.getMaxMediaQueries("m", `padding: 0 32px 24px;`)}
      `),
      editationRow: () => Css.css`
        margin: 0 -8px;
      `,
      editationInput: () => Css.css`
        &:last-child {
          margin-bottom: 0;
        }
      `,
      settingsButton: () =>
        Css.css(`
        text-align: left;
      `),
      addItemButton: () =>
        Css.css(`
        & > .uu5-bricks-icon {
          font-size: 16px;
        }
      `),
    },
    lsi: Lsi.modal,
    errors: {
      childIsString:
        "The only child of the edited component is type string which is not supported. It must be a component.",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onClose: UU5.PropTypes.func.isRequired,
    componentName: UU5.PropTypes.string.isRequired,
    componentProps: UU5.PropTypes.object.isRequired,
    componentPropsForm: UU5.PropTypes.arrayOf(
      UU5.PropTypes.shape({
        name: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.object]), // string or lsi object
        icon: UU5.PropTypes.string,
        info: UU5.PropTypes.node,
        formProps: UU5.PropTypes.object,
        setup: EDITATION_SETUP_PROPS,
      })
    ).isRequired,
    itemName: UU5.PropTypes.string,
    itemDefaultProps: UU5.PropTypes.object,
    itemPropsForm: UU5.PropTypes.shape({
      info: UU5.PropTypes.node,
      formProps: UU5.PropTypes.object,
      setup: EDITATION_SETUP_PROPS,
    }),
    newItem: UU5.PropTypes.shape({
      formProps: UU5.PropTypes.object,
      tagName: UU5.PropTypes.string,
      props: UU5.PropTypes.object,
    }),
    menuWidth: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number]),
    itemsSource: UU5.PropTypes.string,
    getItemLabel: UU5.PropTypes.func,
    header: UU5.PropTypes.oneOfType([UU5.PropTypes.node, UU5.PropTypes.object]),
    screenSize: UU5.PropTypes.oneOf(["xs", "s", "m", "l", "xl"]),
    shown: UU5.PropTypes.bool,
    size: UU5.PropTypes.oneOf(["s", "m", "l", "auto", "max"]),
    saveButtonProps: UU5.PropTypes.shape(UU5.Bricks.Button.propTypes || {}),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: undefined,
      getPropValues: undefined,
      itemComponent: undefined,
      propsForm: undefined,
      newItem: undefined,
      itemsSource: undefined,
      getItemLabel: undefined,
      header: undefined,
      screenSize: undefined,
      shown: false,
      size: undefined,
      onSaveAndClose: undefined,
      onCancel: undefined,
      saveButtonProps: undefined,
      menuWidth: 250,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._itemsSource = "children"; // save the name of a prop from which we have taken the items
    this._itemsInUU5String = true; // remember whether the component's items were in uu5string
    this._contentChanged = false; // remember whether the content was changed and should be saved
    this._propsToReturn = []; // remember props that were edited so that we can only return those
    this._itemsPropsToReturn = {}; // remember props that were edited for each of the items so that we can only return those
    this._movingItemIndex = undefined;

    let items;
    let propValues = { ...this.props.componentProps };

    if (this.props.itemName) {
      if (this.props.itemsSource) {
        items = propValues[this.props.itemsSource];
        this._itemsSource = this.props.itemsSource;
      } else if (propValues.content) {
        items = propValues.content;
        this._itemsSource = "content";
        propValues.children = null;
      } else if (propValues.children) {
        items = propValues.children;
        this._itemsSource = "children";
        propValues.content = null;
      }

      if (typeof items === "string") {
        items = this._stringToUu5String(items);
        items = this._Uu5StringToItems(items);
      } else {
        if (Array.isArray(items)) {
          this._itemsInUU5String = false;
          items = items.map((item) => {
            const isElement = UU5.Common.Element.isValid(item);
            return {
              tagName: isElement ? item.type.tagName : this.props.itemName,
              props: isElement ? UU5.Common.Tools.mergeDeep({}, item.props) : item,
              isElement,
            };
          });
        } else if (items && typeof items === "object" && items.type) {
          const isElement = UU5.Common.Element.isValid(items);
          items = [
            {
              tagName: isElement ? items.type.tagName : this.props.itemName,
              props: isElement ? UU5.Common.Tools.mergeDeep({}, items.props) : items,
              isElement,
            },
          ];
        }
      }

      if (Array.isArray(items)) {
        items = items.filter((item) => item.tagName === this.props.itemName);
        items.forEach((item) => (item.id = UU5.Common.Tools.generateUUID()));
      }

      if (items) {
        items.forEach((item) => {
          if (item.props) {
            this._itemsPropsToReturn[item.id] = Object.keys(item.props);
          }
        });

        if (this._itemsInUU5String) {
          let itemComponentProps = UU5.Common.Tools.findComponent(this.props.itemName).props;
          items = items.map((item) => ({ ...item, props: { ...itemComponentProps, ...item.props } }));
        }
      }
    }

    return {
      propValues,
      items,
      activeCategoryIndex: 0,
      activeItemId: undefined,
      shown: false,
      editMenuOpen: false,
      menuHeight: undefined,
      validation: this.props.componentPropsForm.map(() => undefined),
      itemsValidation: items ? items.map(() => undefined) : undefined,
      itemMoveModalShown: false,
      confirmModalProps: undefined,
    };
  },

  componentDidMount() {
    if (this.props.shown) {
      this._setMenuHeight();
      this._modal.open(undefined, () => this.setState({ shown: true }));
    }
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.shown !== this.props.shown) {
      if (nextProps.shown) {
        this._modal.open(undefined, () => this.setState({ shown: true }));
      } else {
        this._modal.close(undefined, () => this.setState({ shown: false }));
      }
    }
  },

  componentDidUpdate() {
    this._setMenuHeight();
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPropsToSave() {
    let props;

    if (this._propsToReturn.length) {
      props = {};
      this._propsToReturn.forEach((changedPropName) => {
        props[changedPropName] = this.state.propValues[changedPropName];
      });
    }

    if (this._itemsSource && this._contentChanged) {
      let items;

      if (this.state.items) {
        if (this._itemsInUU5String) {
          items = this._filterOutUnchangedItemProps(this.state.items);
          items = this._itemsToUu5String(items);
        } else {
          items = this.state.items.map((item) => {
            return item.isElement ? UU5.Common.Tools.findComponent(item.tagName, item.props) : item.props;
          });
        }
      }

      if (!props) {
        props = {};
      }

      props[this._itemsSource] = items;
    }

    return props;
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _registerRollMenu(ref) {
    this._rollMenu = ref;
  },

  _registerModal(ref) {
    this._modal = ref;
  },

  _registerItemMoveModal(ref) {
    this._itemMoveModal = ref;
  },

  _registerAlertBus(ref) {
    this._alertBus = ref;
  },

  _isMobileVersion(props = this.props) {
    return isMobileVersion(props.screenSize);
  },

  _isCompactVersion(props = this.props) {
    return isCompactVersion(props.screenSize);
  },

  _setMenuHeight() {
    if (this._rollMenu && this._isCompactVersion()) {
      let menuHeight = this._rollMenu.measureHeight();
      menuHeight = Math.min(menuHeight, window.innerHeight - 32);
      this.setState((state) => (Math.abs(menuHeight - state.menuHeight) < 0.2 ? undefined : { menuHeight }));
    }
  },

  _getItemIndexById(items = this.state.items, id = this.state.activeItemId) {
    return items ? items.findIndex((item) => item.id === id) : undefined;
  },

  _toggleEditMenu() {
    this.setState((state) => ({ editMenuOpen: !state.editMenuOpen }));
  },

  _onSave() {
    this.props.onClose(this.getPropsToSave());
  },

  _onCancel() {
    this.props.onClose();
  },

  _onClickCloseButton() {
    this._closeModal(false);
  },

  _closeModal(save) {
    this._modal.close(true, save ? this._onSave : this._onCancel);
  },

  _save() {
    this._validateAll(() => {
      const isValid = this._isValid();

      if (isValid) {
        this._closeModal(true);
      } else {
        this._alertBus.setAlert({
          content: this.getLsiComponent("onSaveInvalidForm"),
          colorSchema: "red",
        });
      }
    });
  },

  _cancel() {
    this._modal.close(true, () => this._closeModal(false));
  },

  _isValid() {
    let result = true;

    result = Helpers.isValid(this.state.validation);

    if (result && this.state.itemsValidation) {
      result = result = Helpers.isValid(this.state.itemsValidation);
    }

    return result;
  },

  _validateAll(setStateCallback) {
    this._validateCategories(() => this._validateItems(setStateCallback));
  },

  _validateOneCategory(setup, validation, validatedItemIndex) {
    let validationResult = Helpers.getComponentValidationResult(this.state.propValues[setup.name], setup.required);

    if (validationResult) {
      if (validation[validatedItemIndex]) {
        validation[validatedItemIndex][setup.name] = validationResult;
      } else {
        validation[validatedItemIndex] = { [setup.name]: validationResult };
      }
    } else {
      validation[validatedItemIndex] = this.state.validation[validatedItemIndex]; // FIXME: merge validation and this.state.validation with prefering validation
    }
  },

  _validateOneItem(setup, itemsValidation, validatedItemIndex) {
    let validationResult = Helpers.getComponentValidationResult(
      this.state.items[validatedItemIndex].props[setup.name],
      setup.required
    );

    if (validationResult) {
      if (itemsValidation[validatedItemIndex]) {
        itemsValidation[validatedItemIndex][setup.name] = validationResult;
      } else {
        itemsValidation[validatedItemIndex] = { [setup.name]: validationResult };
      }
    } else {
      itemsValidation[validatedItemIndex] = this.state.itemsValidation[validatedItemIndex];
    }
  },

  _validateCategories(setStateCallback) {
    let validation = this.props.componentPropsForm.map(() => undefined);

    this.props.componentPropsForm.forEach((validatedItem, validatedItemIndex) => {
      if (Helpers.isComponent(validatedItem.setup)) {
        if (typeof validatedItem.setup.isValid === "function") {
          validation[validatedItemIndex] = validatedItem.setup.isValid({
            componentProps: this.state.propValues,
            items: this.state.items,
          });
        } else {
          validation[validatedItemIndex] = this.state.validation[validatedItemIndex];
        }
      } else {
        validatedItem.setup.forEach((setup) => {
          if (Array.isArray(setup)) {
            setup.forEach((setupItem) => {
              this._validateOneCategory(setupItem, validation, validatedItemIndex);
            });
          } else {
            this._validateOneCategory(setup, validation, validatedItemIndex);
          }
        });
      }
    });

    this.setState({ validation }, setStateCallback);
  },

  _validateItems(setStateCallback) {
    if (this.state.items) {
      let itemsValidation = this.state.items.map(() => undefined);

      this.state.items.forEach((validatedItem, validatedItemIndex) => {
        if (Helpers.isComponent(this.props.itemPropsForm.setup)) {
          if (typeof this.props.itemPropsForm.setup.isValid === "function") {
            itemsValidation[validatedItemIndex] = this.props.itemPropsForm.setup.isValid();
          } else {
            itemsValidation[validatedItemIndex] = this.state.itemsValidation[validatedItemIndex];
          }
        } else {
          this.props.itemPropsForm.setup.forEach((setup) => {
            if (Array.isArray(setup)) {
              setup.forEach((setupItem) => {
                this._validateOneItem(setupItem, itemsValidation, validatedItemIndex);
              });
            } else {
              this._validateOneItem(setup, itemsValidation, validatedItemIndex);
            }
          });
        }
      });

      this.setState({ itemsValidation }, setStateCallback);
    } else if (typeof setStateCallback === "function") {
      setStateCallback();
    }
  },

  _getComponentValidationResult(validation, itemIndex, propName, feedback) {
    validation = [...validation];
    let validatedItem = validation[itemIndex];

    if (!feedback && validatedItem && validatedItem[propName]) {
      delete validatedItem[propName];
      if (Object.keys(validatedItem).length === 0) validatedItem = undefined;
    } else if (feedback) {
      if (!validatedItem) validatedItem = {};
      validatedItem[propName] = feedback;
    }

    validation[itemIndex] = validatedItem;

    return validation;
  },

  _getCustomComponentValidationResult(state, errors, componentIndex) {
    let validationResult;

    if (typeof state.activeCategoryIndex === "number") {
      validationResult = [...state.validation];
      if (componentIndex === undefined) {
        // a whole custom category
        validationResult[state.activeCategoryIndex] = errors;
      } else {
        // a single custom component/input
        let validatedSection = validationResult[state.activeCategoryIndex];
        if (validatedSection === undefined) {
          validatedSection = {};
        }
        validatedSection[componentIndex] = errors;
        validationResult[state.activeCategoryIndex] = validatedSection;
      }
    } else {
      validationResult = [...state.itemsValidation];
      let activeItemIndex = state.items.findIndex((item) => item.id === state.activeItemId);
      if (componentIndex === undefined) {
        // a whole custom category
        validationResult[activeItemIndex] = errors;
      } else {
        // a single custom component/input
        let validatedItem = validationResult[activeItemIndex];
        if (validatedItem === undefined) {
          validatedItem = {};
        }
        validatedItem[componentIndex] = errors;
        validationResult[activeItemIndex] = validatedItem;
      }
    }

    return validationResult;
  },

  _getValidationResultToPass(componentIndex) {
    let result;

    if (typeof this.state.activeCategoryIndex === "number") {
      let validatedSection = this.state.validation[this.state.activeCategoryIndex];
      if (validatedSection) {
        if (componentIndex === undefined) {
          result = validatedSection;
        } else {
          result = validatedSection[componentIndex];
        }
      }
    } else {
      let itemIndex = this.state.items.findIndex((item) => item.id === this.state.activeItemId);
      let validatedItem = this.state.itemsValidation[itemIndex];

      if (validatedItem) {
        if (componentIndex === undefined) {
          result = validatedItem;
        } else {
          result = validatedItem[componentIndex];
        }
      }
    }

    return result;
  },

  _onChange(propName, value) {
    if (this.state.activeCategoryIndex === undefined && this.state.activeItemId) {
      this._onChangeItemProps(propName, value);
    } else {
      this._onChangeProps(propName, value);
    }
  },

  _onChangeProps(propName, value, setStateCallback) {
    if (this._propsToReturn.indexOf(propName) === -1) {
      this._propsToReturn.push(propName);
    }

    this.setState((state) => {
      let propValues = { ...state.propValues };
      propValues[propName] = value;
      return { propValues };
    }, setStateCallback);
  },

  _onChangeItemProps(propName, value, setStateCallback) {
    this._contentChanged = true;

    this.setState((state) => {
      let items = [...state.items];
      let activeIndex = items.findIndex((item) => item.id === state.activeItemId);
      items[activeIndex].props = { ...items[activeIndex].props };
      items[activeIndex].props[propName] = value;

      if (!this._itemsPropsToReturn[state.activeItemId]) {
        this._itemsPropsToReturn[state.activeItemId] = [];
      }

      this._itemsPropsToReturn[state.activeItemId].push(propName);

      return { items };
    }, setStateCallback);
  },

  _onCustomChangeProps(componentIndex, newPropValues, errors) {
    if (Object.keys(newPropValues).indexOf(this._itemsSource) !== -1) {
      this._contentChanged = true;
    }
    Object.keys(newPropValues).forEach((changedPropName) => {
      if (this._propsToReturn.indexOf(changedPropName) === -1) {
        this._propsToReturn.push(changedPropName);
      }
    });

    this.setState((state) => {
      let newState = { ...state, propValues: { ...state.propValues, ...newPropValues } };
      let validationResult = this._getCustomComponentValidationResult(state, errors, componentIndex);
      if (typeof this.state.activeCategoryIndex === "number") {
        newState.validation = validationResult;
      } else {
        newState.itemsValidation = validationResult;
      }

      return newState;
    });
  },

  _onCustomChangeItems(componentIndex, editedItems, errors) {
    this._contentChanged = true;

    this.setState((state) => {
      // get edited items' props and merge with state.items' props
      let newItems = editedItems.map((item) => {
        if (!item.id) {
          item.id = UU5.Common.Tools.generateUUID();
        }

        let matchingStateItem = state.items ? state.items[this._getItemIndexById(state.items, item.id)] : null;

        if (!matchingStateItem && this.props.newItem) {
          item.props = { ...this.props.newItem.props, ...item.props };
        }

        if (item.props) {
          if (!this._itemsPropsToReturn[item.id]) {
            this._itemsPropsToReturn[item.id] = [];
          }

          Object.keys(item.props).forEach((propName) => this._itemsPropsToReturn[item.id].push(propName));
        }

        return {
          ...(matchingStateItem || { tagName: this.props.newItem.tagName, id: item.id }),
          props: { ...(matchingStateItem ? matchingStateItem.props : {}), ...item.props },
        };
      });
      let newState = { items: newItems };

      if (!state.itemsValidation && newItems) {
        newState.itemsValidation = newItems.map(() => undefined);
      } else if (state.itemsValidation && !newItems) {
        newState.itemsValidation = undefined;
      }

      let validationResult = this._getCustomComponentValidationResult(state, errors, componentIndex);
      if (typeof this.state.activeCategoryIndex === "number") {
        newState.validation = validationResult;
      } else {
        newState.itemsValidation = validationResult;
      }

      return newState;
    });
  },

  _onInputChangeFeedback(propName, opt) {
    opt.component.onChangeFeedbackDefault(opt);

    this.setState((state) => {
      let itemIndex;
      let validation;
      let feedback = {
        feedback: opt.feedback,
        message: opt.message,
      };

      if (state.activeCategoryIndex === undefined) {
        itemIndex = state.activeItemIndex;
        validation = state.itemsValidation;
      } else {
        itemIndex = state.activeCategoryIndex;
        validation = state.validation;
      }

      return { validation: this._getComponentValidationResult(validation, itemIndex, propName, feedback) };
    });
  },

  _itemInsertBefore(index) {
    this._contentChanged = true;

    this.setState((state) => {
      let items = [...state.items];
      let newItem = this._getNewItem();
      items.splice(index, 0, newItem);

      if (newItem.props) {
        this._itemsPropsToReturn[newItem.id] = Object.keys(newItem.props);
      }

      return { items };
    });
  },

  _itemInsertAfter(index) {
    this._contentChanged = true;

    this.setState((state) => {
      let items = [...state.items];
      let newItem = this._getNewItem();
      items.splice(index + 1, 0, newItem);

      if (newItem.props) {
        this._itemsPropsToReturn[newItem.id] = Object.keys(newItem.props);
      }

      return { items };
    });
  },

  _onSaveItemMove({ values }) {
    let newPosition = values.position - 1;

    let items = [...this.state.items];
    let itemsValidation = this.state.itemsValidation ? [...this.state.itemsValidation] : [];
    let movingItem = items.splice(this._movingItemIndex, 1)[0];
    let movingItemValidation = itemsValidation.splice(this._movingItemIndex, 1)[0];
    items.splice(newPosition, 0, movingItem);
    itemsValidation.splice(newPosition, 0, movingItemValidation);

    this._contentChanged = true;
    this.setState({ itemMoveModalShown: false, items, itemsValidation });
  },

  _onCancelItemMove() {
    this.setState({ itemMoveModalShown: false });
  },

  _openItemMoveModal(index) {
    this._movingItemIndex = index;
    this.setState({ itemMoveModalShown: true });
  },

  _onCloseItemMoveModal() {
    this.setState({ itemMoveModalShown: false });
  },

  // Currently not used
  // TODO: Fix itemsValidation
  _itemMoveUp(index) {
    this._contentChanged = true;

    if (this._canMoveItemUp(index)) {
      this.setState((state) => {
        let items = [...state.items];
        let removedElement = items.splice(index, 1)[0];
        items.splice(index - 1, 0, removedElement);
        return { items };
      });
    }
  },

  // Currently not used
  // TODO: Fix itemsValidation
  _itemMoveDown(index) {
    this._contentChanged = true;

    if (this._canMoveItemDown()) {
      this.setState((state) => {
        let items = [...state.items];
        let removedElement = items.splice(index, 1)[0];
        items.splice(index + 1, 0, removedElement);
        return { items };
      });
    }
  },

  _itemDuplicate(index) {
    this._contentChanged = true;

    this.setState((state) => {
      let items = [...state.items];
      let itemsValidation = state.itemsValidation ? [...state.itemsValidation] : [];
      let newItem = this._getNewItem();
      newItem.props = items[index].props;
      let newItemsIndex = index + 1;
      items.splice(newItemsIndex, 0, newItem);
      itemsValidation.splice(newItemsIndex, 0, undefined);

      if (newItem.props) {
        this._itemsPropsToReturn[newItem.id] = Object.keys(newItem.props);
      }

      return { items };
    });
  },

  _itemRemove(index) {
    let confirmModalProps = {
      onConfirm: () => {
        this._contentChanged = true;

        this.setState((state) => {
          let items = [...state.items];
          let itemsValidation = state.itemsValidation ? [...state.itemsValidation] : [];
          let removedItemId = items[index].id;
          let activeItemId = state.activeItemId;
          items.splice(index, 1);
          itemsValidation.splice(index, 1);

          if (removedItemId === activeItemId) {
            let newActiveItem = items[items.length - 1];
            if (newActiveItem) {
              activeItemId = newActiveItem.id;
            }
          }

          let newState = { items, activeItemId, itemsValidation, confirmModalProps: undefined };

          if (!items.length) {
            newState.items = undefined;
            newState.activeItemId = undefined;
            newState.activeCategoryIndex = 0;
          }

          return newState;
        });
      },
      onRefuse: () => this.setState({ confirmModalProps: undefined }),
      headerContent: this.getLsiComponent("itemRemoveModalHeader"),
      confirmButtonContent: this.getLsiComponent("itemRemoveModalConfirmButton"),
    };

    this.setState({ confirmModalProps });
  },

  _addItem() {
    this._contentChanged = true;

    this.setState((state) => {
      let items = state.items ? [...state.items] : null;
      let itemsValidation = state.itemsValidation ? [...state.itemsValidation] : [];

      if (!Array.isArray(items)) {
        items = [];
      }

      let newItem = this._getNewItem();

      if (newItem.props) {
        this._itemsPropsToReturn[newItem.id] = Object.keys(newItem.props);
      }

      items.push(newItem);
      itemsValidation.push(undefined);

      return { items, itemsValidation };
    });
  },

  _canMoveItemUp(index) {
    return index > 0;
  },

  _canMoveItemDown(index) {
    return index < this.state.items.length - 1;
  },

  _getNewItem() {
    let props = this.props.newItem.props || {};
    return { ...this.props.newItem, props, id: UU5.Common.Tools.generateUUID() };
  },

  _setActiveCategoryIndex(index) {
    this.setState({ activeCategoryIndex: index, activeItemId: undefined, editMenuOpen: false });
  },

  _setActiveItem(index) {
    this.setState({ activeCategoryIndex: undefined, activeItemId: this.state.items[index].id, editMenuOpen: false });
  },

  _stringToUu5String(value) {
    value = value.replace(UU5.Common.REGEXP.uu5string, "");
    return `<uu5string/>${value}`;
  },

  _itemsToUu5String(items) {
    let uu5string;

    if (Array.isArray(items) && items.length) {
      uu5string = new UU5.Common.UU5String();
      uu5string.content = items.map(this._itemToUu5String);
      uu5string = this._stringToUu5String(uu5string.toString());
    }

    return uu5string;
  },

  _itemToUu5String(item) {
    let defaultItemProps = this.props.itemName ? this.props.itemDefaultProps : undefined;
    let uu5stringObject = new UU5.Common.UU5String.Object();
    uu5stringObject.tag = item.tagName;

    for (let propName in item.props) {
      if (propName === "children") continue;
      let propValue = item.props[propName];
      if ((defaultItemProps && defaultItemProps[propName] === propValue) || propValue === undefined) continue;
      uu5stringObject.props.props.push({ name: propName, value: propValue });
    }

    if (item.props.children) {
      uu5stringObject.children = UU5.Common.Tools.isUU5String(item.props.children)
        ? UU5.Common.UU5String.parse(item.props.children)
        : item.props.children;
    }

    return uu5stringObject;
  },

  _Uu5StringToItems(uu5string) {
    let items;

    if (typeof uu5string === "string") {
      items = UU5.Common.UU5String.parse(uu5string);
      items = items.filter((item) => typeof item !== "string" || item.trim() !== ""); // filter out white spaces
      items = items.map((item) => {
        let props = { ...item.props.toObject() };
        if (item.children.length) {
          props.children = item.children;
        }

        return {
          props,
          tagName: item.tag,
        };
      });
    }

    return items;
  },

  _filterOutUnchangedItemProps(items) {
    if (Object.keys(this._itemsPropsToReturn).length) {
      return items.map((item) => {
        let changedProps = this._itemsPropsToReturn[item.id];
        if (changedProps) {
          let itemProps = {};
          changedProps.forEach((changedProp) => {
            let newPropValue = item.props[changedProp];
            itemProps[changedProp] = newPropValue;
          });
          return { ...item, props: itemProps };
        } else {
          return { ...item, props: undefined };
        }
      });
    } else {
      return undefined;
    }
  },

  _getMenuItemIcons(validation) {
    let availableIconTypes = [
      { feedback: "error", icon: "mdi-alert", colorSchema: "red" },
      { feedback: "warning", icon: "mdi-alert", colorSchema: "orange" },
    ];
    let infoIcons = [];

    if (validation) {
      Object.keys(validation).forEach((validationItem) => {
        let feedback;
        if (validation[validationItem] && typeof validation[validationItem] === "object" && !isNaN(validationItem)) {
          feedback =
            Object.keys(validation[validationItem]).find((key) => {
              let feedbackItem = validation[validationItem][key];
              return Helpers.getFeedback(feedbackItem) === "error";
            }) && "error";
        } else {
          feedback = Helpers.getFeedback(validation[validationItem]);
        }
        const iconTypeIndex = availableIconTypes.findIndex((item) => item.feedback === feedback);
        const iconData = availableIconTypes[iconTypeIndex];

        if (iconTypeIndex > -1) {
          infoIcons.push({ icon: iconData.icon, colorSchema: iconData.colorSchema });
          availableIconTypes.slice(iconTypeIndex, 1);
        }
      });
    }

    if (infoIcons.length === 0) infoIcons = undefined;

    return infoIcons;
  },

  _getItemsMenu() {
    let controls = [
      { label: this.getLsiComponent("menuItemInsertBefore"), onClick: this._itemInsertBefore },
      { label: this.getLsiComponent("menuItemInsertAfter"), onClick: this._itemInsertAfter },
      { label: this.getLsiComponent("menuItemMoveToPosition"), onClick: this._openItemMoveModal },
      { label: this.getLsiComponent("menuItemDuplicate"), onClick: this._itemDuplicate },
      { label: this.getLsiComponent("menuItemDelete"), onClick: this._itemRemove },
    ];
    let items = [];

    if (this.state.items) {
      items = this.state.items.map((item, index) => {
        let itemLabel;
        if (typeof this.props.getItemLabel === "function") {
          itemLabel = this.props.getItemLabel(item.isElement ? item : item.props, index);
        } else {
          itemLabel = `Item${index + 1}`;
        }

        return {
          content: <span>{itemLabel}</span>,
          infoIcons: this._getMenuItemIcons(this.state.itemsValidation ? this.state.itemsValidation[index] : null),
        };
      });
    }

    return (
      <Menu
        items={items}
        activeItemIndex={this._getItemIndexById()}
        onItemClick={this._setActiveItem}
        onAddItem={this._addItem}
        controls={controls}
      />
    );
  },

  _getEditationComponent(componentData, valueSource, validationSource) {
    let value = valueSource[componentData.name];
    let validation = validationSource ? validationSource[componentData.name] : undefined;
    let result = { props: {} };
    let changeType = "onChange";

    if (componentData.type) {
      switch (componentData.type) {
        case "separator":
          result.Component = "UU5.Bricks.Line";
          result.props.size = 1;
          break;
        case "text":
          result.Component = "UU5.Forms.Text";
          result.value = value || "";
          changeType = "onBlur";
          break;
        case "textarea":
          result.Component = "UU5.Forms.TextArea";
          result.value = value || "";
          changeType = "onBlur";
          break;
        case "uu5string":
          result.Component = "UU5.CodeKit.Uu5StringEditor";
          result.props.rows = 5;
          result.props.showGutter = false;
          value = this._stringToUu5String(value);
          changeType = "onBlur";
          break;
        case "number":
          result.Component = "UU5.Forms.Number";
          // changeType can't be onBlur because it won't be called when changing value by +- buttons
          break;
        case "bool":
          result.Component = "UU5.Forms.Checkbox";
          result.props.type = 2;
          break;
        case "switchSelectorBool":
          result.Component = "UU5.Forms.SwitchSelector";
          result.props.inputAttrs = {
            ...result.props.inputAttrs,
          };
          result.props.items = [
            { value: false, content: <UU5.Bricks.Lsi lsi={Lsi.common.valueFalse} /> },
            { value: true, content: <UU5.Bricks.Lsi lsi={Lsi.common.valueTrue} /> },
          ];
          break;
        case "switchSelector":
          result.Component = "UU5.Forms.SwitchSelector";
          result.props.inputAttrs = {
            ...result.props.inputAttrs,
          };
          break;
        case "color":
          result.Component = "UU5.Forms.ColorPicker";
          break;
        case "colorSchemaPicker":
        case "colorSchema":
          result.Component = ColorSchemaPicker;
          break;
        case "elevation":
          result.Component = ElevationInput;
          break;
        case "borderRadius":
          result.Component = BorderRadiusInput;
          break;
        case "bgStyle":
          result.Component = BgStyleInput;
          break;
        case "size":
          result.Component = SizeInput;
          break;
        case "iconPicker":
          result.Component = "UU5.Forms.IconPicker";
          break;
        case "tagSelect":
          result.Component = "UU5.Forms.TagSelect";
          break;
        case "editorInput":
          result.Component = "UU5.RichText.EditorInput";
          break;
        case "expandableEditorInput":
          result.Component = "UU5.RichText.ExpandableEditorInput";
          break;
      }
    } else if (componentData.name) {
      switch (componentData.name) {
        case "elevation":
          result.Component = ElevationInput;
          result.props.value = valueSource.elevation;
          break;
        case "borderRadius":
          result.Component = BorderRadiusInput;
          result.props.value = valueSource.borderRadius;
          break;
        case "bgStyle":
          result.Component = BgStyleInput;
          result.props.value = valueSource.bgStyle;
          break;
        case "size":
          result.Component = SizeInput;
          result.props.value = valueSource.size;
          break;
        case "colorSchema":
          result.Component = ColorSchemaPicker;
          result.props.value = valueSource.colorSchema;
          break;
      }
    }

    if (!result.Component) {
      result.Component = "UU5.Forms.Text";
    }

    if (componentData.name) {
      result.props[changeType] = (opt) => {
        let defaultFn = typeof opt === "object" && opt.component && opt.component[`${changeType}Default`];
        this._onChange(
          componentData.name,
          opt.value,
          !!componentData.required,
          typeof defaultFn === "function" ? defaultFn(opt) : undefined
        );
      };
    }

    if (result.Component !== "UU5.Bricks.Line") {
      result.props.label = Helpers.getLabel(componentData.label);
      result.props.value = value;
      result.props.required = componentData.required;
      result.props.className = this.getClassName("editationInput");
      result.props.onChangeFeedback = (opt) => this._onInputChangeFeedback(componentData.name, opt);
    }

    if (validation) {
      result.props = { ...result.props, ...validation };
    }

    let customProps =
      typeof componentData.getProps === "function"
        ? componentData.getProps(result.props, this.state.propValues, this.state.items, this.state.activeItemId)
        : null;
    if (customProps) {
      result.props = { ...result.props, ...customProps };
    }

    return result;
  },

  _getEditationColumn(component, index, activeIdentifier, valueSource, validationSource) {
    let key = "edit-component-" + index;
    if (typeof component === "function") {
      const Component = component;
      return (
        <Component
          componentProps={this.state.propValues}
          items={this.state.items}
          onChangeProps={(...args) => this._onCustomChangeProps(index, ...args)}
          onChangeItems={(...args) => this._onCustomChangeItems(index, ...args)}
          errors={this._getValidationResultToPass(index)}
          editedItemId={activeIdentifier}
          key={key}
        />
      );
    } else {
      let { Component, children, props = {} } = this._getEditationComponent(component, valueSource, validationSource);
      props.key = key;

      if (typeof Component === "string") {
        return UU5.Common.Tools.findComponent(Component, props, children);
      } else {
        return <Component {...props}>{children}</Component>;
      }
    }
  },

  _getEditationRow(setupSource, activeIdentifier, valueSource, validationSource) {
    if (Array.isArray(setupSource)) {
      return setupSource.map((setupColumn, index) =>
        this._getEditationColumn(setupColumn, index, activeIdentifier, valueSource, validationSource)
      );
    } else {
      return this._getEditationColumn(setupSource, 0, activeIdentifier, valueSource, validationSource);
    }
  },

  _getEditation() {
    let editationContent;
    let setupSource;
    let valueSource;
    let validationSource;
    let formProps = FORM_PROPS;
    let info;
    let activeIdentifier;
    let tagName;
    let contentKey;

    if (Array.isArray(this.props.componentPropsForm) && typeof this.state.activeCategoryIndex === "number") {
      activeIdentifier = this.state.activeCategoryIndex;
      contentKey = "category-" + activeIdentifier;
      setupSource = this.props.componentPropsForm[activeIdentifier].setup;
      info = this.props.componentPropsForm[activeIdentifier].info;
      formProps = { ...formProps, ...this.props.componentPropsForm[activeIdentifier].formProps };
      valueSource = this.state.propValues;
      tagName = this.props.componentName;
      validationSource = this.state.validation[this.state.activeCategoryIndex];
    } else if (this.state.activeItemId) {
      activeIdentifier = this.state.activeItemId;
      contentKey = "item-" + activeIdentifier;
      setupSource = this.props.itemPropsForm.setup;
      info = this.props.itemPropsForm.info;
      formProps = { ...formProps, ...this.props.itemPropsForm.formProps };
      valueSource = this.state.items[this._getItemIndexById()].props;
      tagName = this.props.itemName;
      validationSource = this.state.itemsValidation ? this.state.itemsValidation[this._getItemIndexById()] : undefined;
    } else {
      return null;
    }

    if (Array.isArray(setupSource)) {
      editationContent = [];
      setupSource.forEach((setupSourceItem, index) => {
        if (Array.isArray(setupSourceItem)) {
          let editRowContent = this._getEditationRow(setupSourceItem, activeIdentifier, valueSource, validationSource);
          let colWidth = 12 / editRowContent.length;
          editationContent.push(
            <UU5.Bricks.Row className={this.getClassName("editationRow")} key={"row-" + index}>
              {editRowContent.map((editRow, index) => (
                <UU5.Bricks.Column key={index} colWidth={`xs-${colWidth}`}>
                  {editRow}
                </UU5.Bricks.Column>
              ))}
            </UU5.Bricks.Row>
          );
        } else {
          editationContent.push(
            this._getEditationColumn(setupSourceItem, index, activeIdentifier, valueSource, validationSource)
          );
        }
      });
    } else if (typeof setupSource === "function") {
      const SetupSource = setupSource;
      editationContent = (
        <SetupSource
          componentProps={this.state.propValues}
          items={this.state.items}
          onChangeProps={(...args) => this._onCustomChangeProps(undefined, ...args)}
          onChangeItems={(...args) => this._onCustomChangeItems(undefined, ...args)}
          errors={this._getValidationResultToPass()}
          editedItemId={activeIdentifier}
        />
      );
    }

    if (!info) {
      info = (
        <UU5.Common.Fragment>
          {this.getLsiComponent("componentInfo")} <UU5.Common.Help tagName={tagName} />
        </UU5.Common.Fragment>
      );
    }

    return (
      <UU5.Common.Fragment>
        <UU5.Bricks.Row>
          <ComponentInfo iconFontSize="26px">{info}</ComponentInfo>
        </UU5.Bricks.Row>
        <UU5.Bricks.Row className={this.getClassName("editationContent")} key={contentKey}>
          <UU5.Forms.Form {...formProps} className={this.getClassName("editForm")}>
            <UU5.Common.Suspense>{editationContent}</UU5.Common.Suspense>
          </UU5.Forms.Form>
        </UU5.Bricks.Row>
      </UU5.Common.Fragment>
    );
  },

  // Function prepared for when the animation is required by UX
  // _getFadeInAnimation(animationId, index) {
  //   const fadeIn = Css.keyframes(`
  //     /* ${animationId} - this is a workaround to make sure that each of these animations is unique and therefore will start each time this component is rendered */
  //     0% {
  //       opacity: 0;
  //     }

  //     100% {
  //       opacity: 1;
  //     }
  //   `);

  //   return Css.css(`
  //     opacity: 0;
  //     animation-name: ${fadeIn};
  //     animation-delay: ${0.1 + 0.1 * (index + 1)}s;
  //     animation-duration: ${0.1 * (index + 1)}s;
  //     animation-fill-mode: forwards;
  //   `);

  //   return null;
  // },

  _getCategoriesMenu() {
    if (Array.isArray(this.props.componentPropsForm)) {
      let items = this.props.componentPropsForm.map((category, index) => {
        return {
          content: category.name,
          icon: category.icon,
          infoIcons: this._getMenuItemIcons(this.state.validation[index]),
        };
      });

      return (
        <Menu
          items={items}
          activeItemIndex={this.state.activeCategoryIndex}
          onItemClick={this._setActiveCategoryIndex}
        />
      );
    } else {
      return null;
    }
  },

  _renderModalHeader() {
    const isCompactVersion = this._isCompactVersion();
    const headerText = this.props.header
      ? Helpers.getLabel(this.props.header)
      : this.getLsiComponent("header", undefined, { name: this.props.componentName });
    const closeButton = (
      <UU5.Bricks.Button
        bgStyle="transparent"
        onClick={this._onClickCloseButton}
        content={<UU5.Bricks.Icon icon="mdi-close" />}
      />
    );
    let headerContent;

    if (isCompactVersion) {
      headerContent = (
        <UU5.Common.Fragment>
          {hasMenu(this.props) ? (
            <UU5.Bricks.Button
              className={this.getClassName("editMenuOpenButton")}
              bgStyle="transparent"
              content={<UU5.Bricks.Icon icon="mdi-menu" />}
              onClick={this._toggleEditMenu}
            />
          ) : null}
          <UU5.Bricks.Div className={this.getClassName("headerText")}>{headerText}</UU5.Bricks.Div>
        </UU5.Common.Fragment>
      );
    } else {
      headerContent = <UU5.Bricks.Div className={this.getClassName("headerText")}>{headerText}</UU5.Bricks.Div>;
    }

    return (
      <div className={this.getClassName("headerContent")}>
        {hasMenu(this.props) && isCompactVersion ? this._renderEditMenu() : null}
        <div className={this.getClassName("headerLeftWrapper")}>{headerContent}</div>
        <div>{closeButton}</div>
      </div>
    );
  },

  _renderEditMenu() {
    const menu = (
      <UU5.Common.Fragment>
        <UU5.Bricks.Row className={this.getClassName("categoriesRow")}>{this._getCategoriesMenu()}</UU5.Bricks.Row>
        {this.props.itemName && (
          <UU5.Bricks.Row className={this.getClassName("itemListRow")}>{this._getItemsMenu()}</UU5.Bricks.Row>
        )}
      </UU5.Common.Fragment>
    );

    if (this._isCompactVersion()) {
      const rollMenuHeader = (
        <div className={this.getClassName("compactEditMenuHeader")}>
          <UU5.Bricks.Button
            bgStyle="transparent"
            content={<UU5.Bricks.Icon icon="mdi-close" />}
            onClick={this._toggleEditMenu}
          />
        </div>
      );

      return (
        <RollMenu
          header={rollMenuHeader}
          className={this.getClassName("compactEditMenu")}
          animatedWrapperProps={{ className: this.getClassName("compactEditMenuAnimated") }}
          direction="horizontal"
          open={this.state.editMenuOpen}
          backgroundLayerClassName={this.getClassName("compactEditMenuBackgroundLayer")}
          ref_={this._registerRollMenu}
        >
          {menu}
        </RollMenu>
      );
    } else {
      return (
        <UU5.Bricks.Column colWidth="xs-4" className={this.getClassName("standardEditMenu")} noSpacing>
          {menu}
        </UU5.Bricks.Column>
      );
    }
  },

  _renderStandardLayout() {
    return (
      <UU5.Bricks.Row display="flex" className={this.getClassName("standardLayoutWrapper")}>
        {hasMenu(this.props) ? this._renderEditMenu() : null}
        <UU5.Bricks.Column className={this.getClassName("editation")} colWidth={hasMenu(this.props) ? "xs-8" : "xs-12"}>
          {this._getEditation()}
        </UU5.Bricks.Column>
      </UU5.Bricks.Row>
    );
  },

  _renderCompactLayout() {
    return (
      <UU5.Bricks.Row className={this.getClassName("compactLayoutWrapper")}>{this._getEditation()}</UU5.Bricks.Row>
    );
  },

  _getModalSize() {
    if (this.props.size) {
      return this.props.size;
    } else {
      if (hasMenu(this.props)) {
        return "l";
      } else {
        return "m";
      }
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.Modal
        {...this.getMainPropsToPass()}
        location="portal"
        size={this._getModalSize()}
        sticky
        stickyBackground
        ref_={this._registerModal}
        shown={this.state.shown}
        header={this._renderModalHeader()}
        underline={!this._isCompactVersion()}
        footer={
          <UU5.Common.Fragment>
            <UU5.Bricks.Button onClick={this._cancel} className={this.getClassName("cancelButton")}>
              {this.getLsiComponent("cancelButton")}
            </UU5.Bricks.Button>
            <UU5.Bricks.Button colorSchema="blue" {...this.props.saveButtonProps} onClick={this._save}>
              {this.getLsiComponent("saveButton")}
            </UU5.Bricks.Button>
          </UU5.Common.Fragment>
        }
      >
        {this._isCompactVersion() ? this._renderCompactLayout() : this._renderStandardLayout()}
        <UU5.Bricks.AlertBus ref_={this._registerAlertBus} />
        {this.state.itemMoveModalShown ? (
          <MoveItemFormModal
            shown
            size="s"
            header={this.getLsiComponent("itemMoveModalHeader")}
            onClose={this._onCloseItemMoveModal}
            onSave={this._onSaveItemMove}
            onCancel={this._onCancelItemMove}
            currentPosition={this._movingItemIndex}
            maxPosition={this.state.items.length}
          />
        ) : null}
        {this.state.confirmModalProps ? <ConfirmModal {...this.state.confirmModalProps} /> : null}
      </UU5.Bricks.Modal>
    );
  },
  //@@viewOff:render
});

export default ModalBody;
