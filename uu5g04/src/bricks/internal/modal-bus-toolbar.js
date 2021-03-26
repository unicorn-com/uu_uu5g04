//@@viewOn:revision
// coded: Petr Bišof, 16.10.2020
// reviewed: Filip Janovský, 19.10.2020
//@@viewOn:revision

//@@viewOn:imports
import UU5 from "uu5g04";
import ns from "../bricks-ns.js";
import Css from "./css";
import Lsi from "../bricks-lsi.js";
//@@viewOff:imports

const classNames = {
  header: () => Css.css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: row nowrap;
    padding: 8px;
    background: #F5F5F5;
    border-radius: 4px 4px 0 0;
    cursor: move;
  `,
  buttonWrapper: () => Css.css`
    position: relative;
  `,
  button: (itemId, activeItemId) => Css.css`
    &.color-schema-blue-rich.uu5-bricks-button-transparent {
      &:focus, &:active, &:hover, &:active:hover {
        background-color: transparent;
      }
    }
    &.uu5-bricks-button-transparent {
        &:focus, &:active, &:hover, &:active:hover {
        background-color: transparent;
      }
    }
    &.color-schema-default {
      &:focus, &:active, &:hover, &:active:hover {
        background-color: transparent;
      }
    }

    && {
     border-bottom: 4px solid ${itemId === activeItemId ? `#2196F3` : `rgba(0,0,0,0)`};
    }
  `,
  inactiveLabel: () => Css.css`
    color: ${UU5.Environment.colors.grey.c700};
    font-style: italic;
    font-size: 14px;
  `,
  icon: (itemId, activeItemId, allowClose) => Css.css`
    ${itemId !== activeItemId && allowClose ? `background-color: #2196F3; color: white; border-radius: 2px` : ""}
  `,
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
    activeItemId: UU5.PropTypes.string,
    collapse: UU5.PropTypes.bool,
    toggleCollapse: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      onChange: undefined,
      itemList: undefined,
      activeItemId: undefined,
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
    let { itemList, activeItemId, onChange, collapse, toggleCollapse, setNext, setPrevious, ...props } = this.props;
    const attrs = UU5.Common.VisualComponent.getAttrs(props);

    return (
      <div
        {...attrs}
        data-name="Toolbar"
        className={(attrs.className ? attrs.className + " " : "") + classNames.header()}
      >
        <div className={classNames.buttonWrapper()} data-name="Toolbar-Button">
          {itemList.map((item) => (
            <UU5.Bricks.Button
              key={item.id}
              bgStyle="transparent"
              colorSchema={activeItemId === item.id ? "primary" : undefined}
              onClick={() => onChange(item.id)}
              className={classNames.button(
                item.id,
                activeItemId,
                this.props.itemList[this.props.itemList.length - 1]?.id === item.id
              )}
            >
              <UU5.Bricks.Icon
                icon={"mdi-file-presentation-box"}
                className={classNames.icon(
                  item.id,
                  activeItemId,
                  this.props.itemList[this.props.itemList.length - 1]?.id === item.id
                )}
              />
            </UU5.Bricks.Button>
          ))}
        </div>
        {this.props.itemList[this.props.itemList.length - 1]?.id !== activeItemId ? (
          <UU5.Bricks.Lsi lsi={Lsi.modalBus.inactiveModal} className={classNames.inactiveLabel()} />
        ) : null}
        <UU5.Bricks.Button
          bgStyle="transparent"
          content={
            collapse ? <UU5.Bricks.Lsi lsi={Lsi.modalBus.expand} /> : <UU5.Bricks.Lsi lsi={Lsi.modalBus.collapse} />
          }
          onClick={() => toggleCollapse()}
          mainAttrs={{
            ["data-name"]: "Toolbar-Button",
          }}
        />
      </div>
    );
  },
  //@@viewOff:render
});

export default ModalBusToolbar;
