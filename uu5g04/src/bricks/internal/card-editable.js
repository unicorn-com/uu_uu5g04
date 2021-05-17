//@@viewOn:imports
import UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import { CardInline } from "./modal-editation-components";
import ColorPicker from "./color-picker.js";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const DEFAULT_PROPS_MAP = {
  elevation: 1,
  elevationHover: 1,
  inline: false,
  width: null,
  minWidth: null,
  noSpaces: false,
  bgStyle: "filled",
  borderRadius: null,
  header: "",
  footer: "",
  level: null,
};

const editableComponentPropsSetup = [
  {
    name: "bgStyle",
  },
  {
    name: "colorSchema",
  },
  {
    name: "borderRadius",
  },
];

const editableInlinePropsSetup = [
  CardInline,
  {
    name: "width",
    type: "number",
    label: EditableLsi.card.widthLabel,
    getProps: (props, componentProps) => ({
      step: 50,
      min: 0,
      suffix: "px",
      valueType: "number",
      disabled: !componentProps.inline,
    }),
  },
  {
    name: "minWidth",
    type: "number",
    label: EditableLsi.card.minWidthLabel,
    getProps: (props, componentProps) => ({
      step: 50,
      min: 0,
      suffix: "px",
      valueType: "number",
      disabled: !componentProps.inline,
    }),
  },
];

const editableElevationPropsSetup = [
  {
    name: "noSpaces",
    type: "switchSelector",
    label: EditableLsi.card.noSpacesLabel,
    getProps: () => ({
      items: [
        { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.valueFalse} />, value: false },
        { content: <UU5.Bricks.Lsi lsi={EditableLsi.common.valueTrue} />, value: true },
      ],
      message: <UU5.Bricks.Lsi lsi={EditableLsi.card.noSpacesMessage} />,
    }),
  },
  {
    name: "elevation",
  },
  {
    name: "elevationHover",
    type: "elevation",
    label: EditableLsi.card.elevationHoverLabel,
  },
];

const editablePropsSetup = [
  {
    name: EditableLsi.common.componentPropsLabel,
    setup: editableComponentPropsSetup,
  },
  {
    name: EditableLsi.card.inlinePropsLabel,
    setup: editableInlinePropsSetup,
  },
  {
    name: EditableLsi.card.elevationPropsLabel,
    setup: editableElevationPropsSetup,
  },
];

export const CardEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("CardEditable"),
    classNames: {
      main: ns.css("card-editable"),
    },
    lsi: () => ({ ...EditableLsi.card, ...EditableLsi.common }),
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    component: UU5.PropTypes.object.isRequired,
    renderView: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: null,
      renderView: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    let values = this.props.component.getEditablePropsValues(Object.keys(DEFAULT_PROPS_MAP));

    return {
      ...values,
      showFooter: !!values.footer,
      showHeader: !!values.header,
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPropsToSave() {
    return this._getPropsToSave(); //this._editModal ? this._editModal.getPropsToSave() : undefined;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerEditModal(modal) {
    this._editModal = modal;
  },

  _onEndEditation() {
    this.props.component.endEditation(this._getPropsToSave());
  },

  _getPropsToSave(state = this.state) {
    // eslint-disable-next-line no-unused-vars
    let { showFooter, showHeader, children, content, ...result } = state;

    for (let propName in DEFAULT_PROPS_MAP) {
      if (result[propName] !== undefined && result[propName] === DEFAULT_PROPS_MAP[propName]) {
        result[propName] = undefined;
      }
    }

    // remove header or footer if they are not showed
    if (!showHeader) {
      result.header = undefined;
    }
    if (!showFooter) {
      result.footer = undefined;
    }

    return result;
  },

  // change state handlers
  _changeColorSchema(opt) {
    this.setState({ colorSchema: opt.value }, () => {
      this.props.component.saveEditation({
        colorSchema: !opt.value || opt.value === "default" ? undefined : opt.value,
      });
    });
  },

  _toggleHeader(value, setStateCallback) {
    this.setState(
      (state) => ({
        showHeader: !state.showHeader,
      }),
      setStateCallback
    );
  },

  _toggleFooter(value, setStateCallback) {
    this.setState(
      (state) => ({
        showFooter: !state.showFooter,
      }),
      setStateCallback
    );
  },

  _toggleUnderline() {
    this.setState((state) => ({ underline: !state.underline }));
  },

  _changeLevel(value, setStateCallback) {
    this.setState({ level: value }, setStateCallback);
  },

  _changeHeaderContent(opt) {
    this.setState({ header: opt.value });
  },

  _changeFooterContent(opt) {
    this.setState({ footer: opt.value });
  },

  _getHeaderToolbarItems() {
    let levelItems = [1, 2, 3, 4, 5, 6].map((level) => ({
      content: `${this.getLsiValue("level")} ${level}`,
      value: `${level}`,
    }));
    levelItems.unshift({ content: this.getLsiValue("defaultLevel"), value: null });

    return [
      {
        type: ColorPicker,
        props: () => {
          return {
            value: this.state.colorSchema,
            onClick: this._changeColorSchema,
            tooltip: this.getLsiValue("colorSchemaTooltip"),
          };
        },
      },
      {
        type: "button",
        props: () => {
          return {
            pressed: this.state.underline,
            onClick: this._toggleUnderline,
            tooltip: this.getLsiValue("underlineTooltip"),
            icon: "mdi-format-underline",
          };
        },
      },
      {
        type: "dropdown",
        props: () => {
          let label = this.state.level
            ? `${this.getLsiValue("level")} ${this.state.level}`
            : `${this.getLsiValue("defaultLevel")}`;

          return {
            value: this.state.level,
            label,
            onClick: this._changeLevel,
            tooltip: this.getLsiValue("levelTooltip"),
            items: levelItems,
            className: this.getClassName("levelDropdown"),
          };
        },
      },
    ];
  },

  _getToolbarSettings() {
    return [
      {
        value: this.state.showHeader,
        onClick: this._toggleHeader,
        label: this.getLsiValue("showHeaderCheckboxLabel"),
      },
      {
        value: this.state.showFooter,
        onClick: this._toggleFooter,
        label: this.getLsiValue("showFooterCheckboxLabel"),
      },
    ];
  },

  _getToolbarProps() {
    let props = this.getMainPropsToPass();

    props.onClose = this._onEndEditation;
    props.onMoreSettingsClick = this._openEditModal;
    props.settingsItems = this._getToolbarSettings();
    props.ref_ = this._registerToolbar;

    return props;
  },

  _openEditModal() {
    //EditationModal will use the content/children value of the component, but it's children can be already in edit mode, so their actual values can be lost, so endChildrenEditation and make sure that data are correct.
    this.props.component.endChildrenEditation();
    this.setState({ editModalOpen: true });
  },

  _onCloseEditationModal(newProps) {
    if (newProps) {
      let newState = { ...newProps };
      delete newState.children;
      delete newState.content;
      this.setState({ ...newState, editModalOpen: false }, () => this.props.component.saveEditation(newProps));
    } else {
      this.setState({ editModalOpen: false });
    }
  },

  _renderEditModal() {
    return (
      <UU5.BricksEditable.Modal
        shown
        componentName={this.props.component.getTagName()}
        componentProps={this.props.component.getEditablePropsValues(Object.keys(this.props.component.props))}
        onClose={this._onCloseEditationModal}
        component={this.props.component}
        ref_={this._registerEditModal}
        componentPropsForm={editablePropsSetup}
        header={this.getLsiValue("modalHeader")}
      />
    );
  },

  //@@viewOff:private

  //@@viewOn:render
  render() {
    const mainProps = this.getMainPropsToPass();
    return (
      <>
        <UU5.BricksEditable.Toolbar
          {...mainProps}
          onClose={this._onEndEditation}
          settingsItems={this._getToolbarSettings()}
          onMoreSettingsClick={this._openEditModal}
        >
          {this.props.renderView(
            [
              this.state.showHeader ? (
                <UU5.BricksEditable.Input
                  value={this.state.header || ""}
                  placeholder={this.getLsi("headerPlaceholder")}
                  onChange={this._changeHeaderContent}
                  toolbarItems={this._getHeaderToolbarItems()}
                  key="headerInput"
                >
                  {({ children }) => (
                    <UU5.Bricks.Header
                      underline={this.state.underline}
                      level={this.state.level}
                      parent={this.props.inline ? undefined : this.props.component}
                      nestingLevel={undefined}
                    >
                      {children}
                    </UU5.Bricks.Header>
                  )}
                </UU5.BricksEditable.Input>
              ) : null,
              this.props.component.getChildren(),
              this.state.showFooter ? (
                <UU5.BricksEditable.Input
                  value={this.state.footer || ""}
                  placeholder={this.getLsi("footerPlaceholder")}
                  onChange={this._changeFooterContent}
                  key="footerInput"
                >
                  {({ children }) => <UU5.Bricks.Footer parent={this.props.component}>{children}</UU5.Bricks.Footer>}
                </UU5.BricksEditable.Input>
              ) : null,
            ],
            true
          )}
        </UU5.BricksEditable.Toolbar>
        {this.state.editModalOpen ? this._renderEditModal() : null}
      </>
    );
  },
  //@@viewOff:render
});

export default CardEditable;
