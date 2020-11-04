//@@viewOn:revision
// coded: Petr Bišof, 16.10.2020
// reviewed: Filip Janovský, 19.10.2020
//@@viewOn:revision

//@@viewOn:imports
import UU5 from "uu5g04";
import ns from "../bricks-ns.js";
import Css from "./css";
import Icon from "../icon.js";
import Lsi from "../bricks-lsi.js";
//@@viewOff:imports

const classNames = {
  header: (screenSize) => {
    return Css.css`
      display: flex;
      align-items: center;
      justify-content: ${screenSize === "xs" ? "space-between" : "center"};
      flex-flow: row nowrap;
      padding: 8px;
      background: #F5F5F5;
      border-radius: 4px;
    `;
  },
  button: () => {
    return Css.css`
    &.color-schema-blue-rich.uu5-bricks-button-transparent {
      &:focus, &:active, &:hover, &:active:hover {
      background-color: transparent;
    }
  },
  &.uu5-bricks-button-transparent {
    &:focus, &:active, &:hover, &:active:hover {
    background-color: transparent;
  }
},
    &.color-schema-default{
      &:focus, &:active, &:hover, &:active:hover {
        background-color: transparent;
      }
    }

    `;
  },
  collapseButton: (collapse) => {
    return collapse
      ? ""
      : Css.css`
      position: absolute;
      right: 8px;
      `;
  },
};

export const ModalBusToolbar = UU5.Common.Component.create({
  //@@viewOn:mixins
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ModalBusToolbar"),
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onChange: UU5.PropTypes.func,
    itemList: UU5.PropTypes.array,
    activeItem: UU5.PropTypes.string,
    collapse: UU5.PropTypes.bool,
    toggleCollapse: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      onChange: undefined,
      itemList: undefined,
      activeItem: undefined,
      collapse: undefined,
      toggleCollapse: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let { itemList, activeItem, onChange, collapse, toggleCollapse, setNext, setPrevious, ...props } = this.props;

    const attrs = UU5.Common.VisualComponent.getAttrs(props);
    let disableNext = activeItem === itemList[itemList.length - 1] ? true : false;
    let disablePrevious = activeItem === itemList[0] ? true : false;

    return (
      <UU5.Bricks.ScreenSize>
        {({ screenSize }) => (
          <div
            {...attrs}
            data-name="Toolbar"
            className={(attrs.className ? attrs.className + " " : "") + classNames.header(screenSize)}
          >
            <div className={Css.css`position: relative;`}>
              <UU5.Bricks.Button
                bgStyle="transparent"
                disabled={disablePrevious}
                onClick={() => setPrevious()}
                className={classNames.button()}
              >
                <Icon icon="mdi-chevron-left" />
              </UU5.Bricks.Button>
              {itemList.map((item) => (
                <UU5.Bricks.Button
                  key={item}
                  bgStyle="transparent"
                  colorSchema={activeItem === item ? "primary" : undefined}
                  onClick={() => onChange(item)}
                  className={classNames.button()}
                >
                  <UU5.Bricks.Icon
                    icon={activeItem === item ? "mdi-circle-slice-8" : "mdi-checkbox-blank-circle-outline"}
                  />
                </UU5.Bricks.Button>
              ))}
              <UU5.Bricks.Button
                bgStyle="transparent"
                disabled={disableNext}
                onClick={() => setNext()}
                className={classNames.button()}
              >
                <Icon icon="mdi-chevron-right" />
              </UU5.Bricks.Button>
            </div>
            <UU5.Bricks.Button
              bgStyle="transparent"
              content={
                collapse ? <UU5.Bricks.Lsi lsi={Lsi.modalBus.expand} /> : <UU5.Bricks.Lsi lsi={Lsi.modalBus.collapse} />
              }
              onClick={() => toggleCollapse()}
              className={classNames.collapseButton(collapse)}
            />
          </div>
        )}
      </UU5.Bricks.ScreenSize>
    );
  },
  //@@viewOff:render
});

export default ModalBusToolbar;
