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
import ns from "./bricks-editable-ns.js";
import Css from "./css.js";
import EditableLsi from "./bricks-editable-lsi.js";
//@@viewOff:imports

const Lsi = EditableLsi.screenSize;

const sizesStates = ["xs", "s", "m", "l", "xl"];

const DEFAULT_PROPS_MAP = {
  children: undefined,
};

const MAIN_CLASS_NAME = ns.css("screen-size-editable");
const NAME = ns.name("ScreenSizeEditable");

const newEditableItem = {
  tagName: "UU5.Bricks.ScreenSize.Item",
  isElement: true,
  props: {
    screenSize: "m",
  },
};

let itemEditation = [
  {
    name: "screenSize",
    type: "tagSelect",
    label: <UU5.Bricks.Lsi lsi={Lsi.sizes} />,
    getProps: (props) => {
      return {
        availableTags: [...sizesStates.map((size) => ({ value: size })), { content: Lsi.otherLabel, value: "*" }],
        multiple: true,
        required: true,
        message: <UU5.Bricks.Lsi lsi={Lsi.sameScreenSizeInfo} />,
        onChange: (opt) => {
          let value = opt.value;
          if (Array.isArray(value)) {
            let starIndex = value.indexOf("*");
            if (starIndex > -1 && value.length > starIndex + 1) {
              value = [...value];
              value.splice(starIndex, 1);
            } else if (starIndex > -1) {
              value = "*";
            }
          }
          props.onChange({ ...opt, value: value?.length > 1 ? value : value[0] });
        },
      };
    },
  },
];

const editableItemPropsSetup = {
  setup: itemEditation,
  info: (
    <UU5.Common.Fragment>
      <UU5.Bricks.Lsi lsi={Lsi.componentInfo} /> <UU5.Common.Help tagName={"UU5.Bricks.ScreenSize"} />
    </UU5.Common.Fragment>
  ),
};

const CLASS_NAMES = {
  flexContainer: () => {
    return Css.css`
      display: flex;
    `;
  },
  sideColumns: () => {
    return Css.css`
      flex: 1 0 auto;
      background-color: #C1C1C1;
    `;
  },
  centreColumn: (sizeToUse) => {
    let style =
      sizeToUse === "xl"
        ? `flex-basis: 100%;`
        : `
      width: ${sizeToUse};
    `;

    return Css.css`
        ${style};
    `;
  },
};

export const ScreenSizeEditable = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.ContentMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: NAME,
    classNames: {
      main: MAIN_CLASS_NAME,
    },
    lsi: () => Lsi,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    component: UU5.PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      component: null,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      ...this._getState(this.props),
      activeItemIndex: 0,
      editationModalOpen: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ ...this._getState(nextProps) });
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  getPropsToSave() {
    return this.state.editationModalOpen ? this._modal.getPropsToSave() : {};
  },
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _getState(props) {
    let state = { ...props.component.getEditablePropsValues(Object.keys(this.props.component.props)) };
    let allChildren = props.component.getChildren();
    if (!Array.isArray(allChildren) && allChildren) {
      allChildren = [allChildren];
    }
    if (Array.isArray(allChildren)) {
      let childTagName = this.props.component.getDefault()?.childTagName;
      allChildren = allChildren.filter(
        (child) => UU5.Common.Element.isValid(child) && child.type.tagName === childTagName
      );

      if (allChildren.length === 0) {
        allChildren = null;
      }
    }
    state.children = allChildren;
    return state;
  },
  _onSettingsClick() {
    //EditationModal will use the content/children value of the component, but it's children can be already in edit mode, so their actual values can be lost, so endChildrenEditation and make sure that data are correct.
    this.props.component.endChildrenEditation();
    this.setState((state) => ({ editationModalOpen: !state.editationModalOpen }));
  },

  _registerEditToolbar(toolbar) {
    this._editToolbar = toolbar;
  },

  _registerDiv(div) {
    this._div = div;
  },

  // props actions
  _onEndEditation() {
    this.props.component.endEditation();
  },

  _onChangeRenderedItem({ value }) {
    //EditationModal will use the content/children value of the component, but it's children can be already in edit mode, so their actual values can be lost, so endChildrenEditation and make sure that data are correct.
    this.props.component.endChildrenEditation();
    this.setState({ activeItemIndex: value });
  },

  _getPropsToSave(propsToSave) {
    if (propsToSave === undefined) propsToSave = { ...this.state };

    for (let propName in DEFAULT_PROPS_MAP) {
      if (propsToSave[propName] !== undefined && propsToSave[propName] === DEFAULT_PROPS_MAP[propName]) {
        propsToSave[propName] = undefined;
      }
    }

    return propsToSave;
  },
  _getSwitchSelectorLabels(screenSize) {
    if (typeof screenSize === "string") {
      return screenSize === "*" ? <UU5.Bricks.Lsi lsi={Lsi.otherLabel} /> : screenSize;
    }

    return screenSize.map((item, index) => {
      return screenSize.length === index + 1 ? `${item}` : `${item}, `;
    });
  },

  _getToolbarItems(allChildren) {
    if (Array.isArray(allChildren)) {
      return [
        <UU5.Bricks.SwitchSelector
          items={(allChildren || []).map((item, index) => ({
            value: index,
            content: this._getSwitchSelectorLabels(item.props.screenSize),
            bgStyle: this.state.activeItemIndex === index ? "underline" : undefined,
            colorSchema: "primary",
          }))}
          onChange={this._onChangeRenderedItem}
          value={this.state.activeItemIndex}
          key="switchSelector"
          bgStyle="transparent"
          colorSchema="custom"
          size="l"
        />,
      ];
    } else {
      return null;
    }
  },

  _sizeToUse(screenSize) {
    for (let i = sizesStates.length - 1; i >= 0; i--) {
      let heighestSize = screenSize.find((size) => size === sizesStates[i]);
      if (heighestSize) {
        return heighestSize;
      }
    }
  },
  _renderItem(allChildren) {
    if (Array.isArray(allChildren) && allChildren[this.state.activeItemIndex]) {
      let sizeToUse;
      if (typeof allChildren[this.state.activeItemIndex].props.screenSize === "string") {
        sizeToUse =
          allChildren[this.state.activeItemIndex].props.screenSize === "*"
            ? "*"
            : UU5.Utils.ScreenSize.SIZE_MAP[allChildren[this.state.activeItemIndex].props.screenSize];
      } else {
        let heighestSize = this._sizeToUse(allChildren[this.state.activeItemIndex].props.screenSize);
        if (heighestSize) {
          sizeToUse = UU5.Utils.ScreenSize.SIZE_MAP[heighestSize];
        }
      }
      sizeToUse = sizeToUse === Infinity || sizeToUse === "*" ? "xl" : `${sizeToUse}px`;
      return UU5.Common.Element.clone(allChildren[this.state.activeItemIndex], {
        className: CLASS_NAMES.centreColumn(sizeToUse),
      });
    } else {
      return null;
    }
  },
  _getAllItems(allChildren) {
    if (Array.isArray(allChildren)) {
      let allChildrenWithEditItems = allChildren.map((child) => {
        return child;
      });
      return allChildrenWithEditItems;
    } else {
      return null;
    }
  },
  _getItemLabel(item, itemIndex) {
    let label = "";
    if (item.props && item.props.screenSize) {
      label = `${item.props.screenSize}`;
    } else if (item.screenSize) {
      label = `${item?.screenSize}`;
    } else {
      label = this.getLsiComponent("itemLabel", undefined, { itemNumber: itemIndex + 1 });
    }
    if (label === "*") {
      label = <UU5.Bricks.Lsi lsi={Lsi.otherLabel} />;
    }
    return label;
  },
  _renderMoreSettingsModal() {
    let componentProps = this.props.component.getEditablePropsValues(Object.keys(this.props.component.props));
    componentProps.info = "";
    return this.state.editationModalOpen ? (
      <UU5.Common.Suspense fallback="">
        <UU5.BricksEditable.Modal
          shown
          componentName={this.props.component.getTagName()}
          componentProps={componentProps}
          header={EditableLsi.screenSize.name}
          onClose={this._onCloseEditationModal}
          itemName={UU5.Bricks.ScreenSize.Item.tagName}
          itemDefaultProps={UU5.Bricks.ScreenSize.Item.defaultProps}
          itemPropsForm={editableItemPropsSetup}
          itemsSource="children"
          newItem={newEditableItem}
          ref_={(modal) => (this._modal = modal)}
          getItemLabel={this._getItemLabel}
        />
      </UU5.Common.Suspense>
    ) : null;
  },
  _onCloseEditationModal(newProps) {
    if (newProps) {
      this.setState({ editationModalOpen: false, children: UU5.Common.UU5String.toChildren(newProps.children) }, () => {
        this.props.component.saveEditation(newProps);
      });
    } else {
      this.setState({ editationModalOpen: false });
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let allChildren = this.state.children;
    if (!Array.isArray(allChildren) && allChildren) {
      allChildren = [allChildren];
    }
    if (Array.isArray(allChildren)) {
      let childTagName = this.props.component.getDefault()?.childTagName;
      allChildren = allChildren.filter(
        (child) => UU5.Common.Element.isValid(child) && child.type.tagName === childTagName
      );

      if (allChildren.length === 0) {
        allChildren = null;
      }
    }

    return (
      <>
        <UU5.BricksEditable.Toolbar
          {...this.getMainPropsToPass()}
          ref_={this._registerEditToolbar}
          items={this._getToolbarItems(this.state.children)}
          onMoreSettingsClick={this._onSettingsClick}
          onClose={this._onEndEditation}
        >
          <UU5.Bricks.Div className={CLASS_NAMES.flexContainer()} ref_={this._registerDiv}>
            <span className={CLASS_NAMES.sideColumns()}></span>
            {this._renderItem(this.state.children)}
            <span className={CLASS_NAMES.sideColumns()}></span>
          </UU5.Bricks.Div>
        </UU5.BricksEditable.Toolbar>
        {this._renderMoreSettingsModal()}
      </>
    );
  },
  //@@viewOff:render
});

export default ScreenSizeEditable;
