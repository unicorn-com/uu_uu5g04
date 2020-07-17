//@@viewOn:imports
import UU5 from "uu5g04";

import ns from "./bricks-editable-ns.js";
import EditableLsi from "./bricks-editable-lsi.js";
import CarouselItem from "../carousel-item.js";
import Css from "./css";
import { EditItemInfo } from "./modal-editation-components";
//@@viewOff:imports

const isValidItems = items => {
  return Array.isArray(items) && items.length;
};

const editableComponentPropsSetup = [
  {
    name: "type",
    type: "switchSelector",
    label: EditableLsi.carousel.typeLabel,
    getProps: () => ({
      items: [
        { value: "circular", content: <UU5.Bricks.Lsi lsi={EditableLsi.carousel.typeValueCircular} /> },
        { value: "final", content: <UU5.Bricks.Lsi lsi={EditableLsi.carousel.typeValueFinal} /> },
        { value: "rewind", content: <UU5.Bricks.Lsi lsi={EditableLsi.carousel.typeValueRewind} /> }
      ]
    })
  },
  {
    name: "interval",
    type: "number",
    label: EditableLsi.carousel.intervalLabel,
    getProps: props => ({
      min: 0,
      step: 0.5,
      suffix: "s",
      valueType: "number",
      value: props.value / 1000, // from ms to s
      onChange: opt => props.onChange({ ...opt, value: opt.value * 1000 }) // to ms
    })
  },
  [
    {
      name: "displayedItems",
      type: "number",
      label: EditableLsi.carousel.displayedItemsLabel,
      getProps: (props, componentProps, items) => ({
        min: 1,
        max: isValidItems(items) ? items.length : 1,
        valueType: "number",
        value: isValidItems(items) ? props.value : undefined,
        disabled: isValidItems(items) ? !items.length : true
      })
    },
    { name: "stepByOne", type: "bool", label: EditableLsi.carousel.stepByOneLabel }
  ],
  {
    name: "activeIndex",
    type: "number",
    label: EditableLsi.carousel.activeIndexLabel,
    getProps: (props, componentProps, items) => ({
      min: 1,
      max: isValidItems(items) ? items.length : 1,
      valueType: "number",
      value: isValidItems(items) ? props.value + 1 : undefined,
      onChange: opt => props.onChange({ ...opt, value: opt.value - 1 }),
      disabled: isValidItems(items) ? !items.length : true
    })
  }
];

const editableAdditionalPropsSetup = [
  { name: "colorSchema" },
  [
    { name: "prevIcon", type: "iconPicker", label: EditableLsi.carousel.prevIconLabel },
    { name: "nextIcon", type: "iconPicker", label: EditableLsi.carousel.nextIconLabel }
  ],
  [
    { name: "hideControls", type: "bool", label: EditableLsi.carousel.hideControlsLabel },
    { name: "hideIndicators", type: "bool", label: EditableLsi.carousel.hideIndicatorsLabel }
  ]
];

const editablePropsSetup = [
  {
    name: <UU5.Bricks.Lsi lsi={EditableLsi.common.componentPropsLabel} />,
    setup: editableComponentPropsSetup
  },
  {
    name: <UU5.Bricks.Lsi lsi={EditableLsi.common.advancedPropsLabel} />,
    setup: editableAdditionalPropsSetup
  }
];

const editableItemPropsSetup = { setup: EditItemInfo };

const newEditableItem = {
  tagName: "UU5.Bricks.Carousel.Item",
  isElement: true,
  props: {
    contentEditable: true
  }
};

export const CarouselEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("CarouselEditable"),
    classNames: {
      main:
        ns.css("carousel-editable ") +
        Css.css`
        & + .uu5-bricks-carousel-item {
          position: relative;
          float: none;
        }
      `,
      switchSelector: Css.css`
        .uu5-bricks-switch-selector {
          min-width: auto;
        }
      `
    },
    lsi: () => EditableLsi.carousel
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    component: UU5.PropTypes.object.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      editationModalOpen: false,
      activeItemIndex: 0
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPropsToSave() {
    return {}; // has no state
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _registerEditToolbar(toolbar) {
    this._editToolbar = toolbar;
  },

  _registerEditModal(modal) {
    this._editModal = modal;
  },

  _onEndEditation() {
    this.props.component.endEditation();
  },

  _onChangeRenderedItem({ value }) {
    this.setState({ activeItemIndex: value });
  },

  _onCloseEditationModal(newProps) {
    if (newProps) {
      newProps.interval = newProps.interval || 0;
      this.setState({ editationModalOpen: false }, () => {
        this.props.component.saveEditation(newProps);
        this._editToolbar.closeMoreSettings();
      });
    } else {
      this.setState({ editationModalOpen: false }, this._editToolbar.closeMoreSettings);
    }
  },

  _onSettingsClick() {
    //EditationModal will use the content/children value of the component, but it's children can be already in edit mode, so their actual values can be lost, so endChildrenEditation and make sure that data are correct.
    this.props.component.endChildrenEditation();
    this.setState(state => ({ editationModalOpen: !state.editationModalOpen }));
  },

  _getEditableItemLabel(item, itemIndex) {
    return this.getLsiComponent("itemLabel", undefined, { itemNumber: itemIndex + 1 });
  },

  _renderMoreSettingsModal() {
    return (
      <UU5.Common.Suspense fallback="">
        <UU5.BricksEditable.Modal
          shown
          componentName={this.props.component.getTagName()}
          componentProps={this.props.component.getEditablePropsValues(Object.keys(this.props.component.props))}
          onClose={this._onCloseEditationModal}
          component={this.props.component}
          ref_={this._registerEditModal}
          componentPropsForm={editablePropsSetup}
          header={this.getLsiComponent("modalHeader")}
          itemName={CarouselItem.tagName}
          itemDefaultProps={CarouselItem.defaultProps}
          itemPropsForm={editableItemPropsSetup}
          newItem={newEditableItem}
          getItemLabel={this._getEditableItemLabel}
        />
      </UU5.Common.Suspense>
    );
  },

  _getToolbarItems(allChildren) {
    return [
      <UU5.Forms.SwitchSelector
        items={(allChildren || []).map((item, index) => ({
          value: index,
          content: this.getLsiComponent("itemLabel", undefined, { itemNumber: index + 1 }),
          bgStyle: this.state.activeItemIndex === index ? "underline" : undefined,
          colorSchema: "primary"
        }))}
        onChange={this._onChangeRenderedItem}
        className={this.getClassName("switchSelector")}
        value={this.state.activeItemIndex}
        key="switchSelector"
        bgStyle="transparent"
        colorSchema="custom"
        size="l"
        spacing={0}
      />
    ];
  },

  _renderItem(allChildren) {
    return (allChildren || [])[this.state.activeItemIndex];
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let allChildren = this.props.component.getChildren();

    return (
      <UU5.Bricks.Div {...this.getMainPropsToPass()}>
        <UU5.BricksEditable.Toolbar
          {...this.getMainPropsToPass()}
          ref_={this._registerEditToolbar}
          items={this._getToolbarItems(allChildren)}
          onClose={this._onEndEditation}
          onMoreSettingsClick={this._onSettingsClick}
        >
          {this._renderItem(allChildren)}
        </UU5.BricksEditable.Toolbar>
        {this.state.editationModalOpen ? this._renderMoreSettingsModal() : null}
      </UU5.Bricks.Div>
    );
  }
  //@@viewOff:render
});

export default CarouselEditable;
