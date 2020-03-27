import * as UU5 from "uu5g04";
//import "uu5g04-bricks";

import ns from "./bricks-editable-ns.js";
import Css from "./css.js";
import Lsi from "./bricks-editable-lsi.js";

import ColorSquare from "./color-square.js";

const COLOR_SCHEMAS = [
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "red",
  "pink",
  "purple",
  "deep-purple",
  "brown",
  "grey",
  "blue-grey",
  "black",
  "white"
];

export const ColorPicker = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("ColorPicker"),
    classNames: {
      main: () =>
        ns.css("color-picker") +
        " " +
        Css.css(`
        position: relative;

        & > .uu5-bricks-icon.uu5-bricks-icon.uu5-bricks-icon.uu5-bricks-icon {
          margin-right: -10px;
          position: relative;
          top: -2px;
        }

        & > div {
          position: absolute;
          bottom: -1px;
          left: 0;
        }
      `),
      popover: () =>
        Css.css(`
        width: 300px;
        color: ${UU5.Environment.colors.common.darkText};

        .uu5-bricks-popover-body {
          & > div:last-child {
            justify-content: center;
            max-width: 100%;
          }
        }
      `)
    },
    lsi: Lsi.colorPicker
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    value: UU5.PropTypes.string,
    onClick: UU5.PropTypes.func,
    colorSchema: UU5.PropTypes.string,
    bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline", "link"])
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      value: undefined,
      onClick: undefined,
      colorSchema: undefined,
      bgStyle: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      open: false
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _registerPopover(ref) {
    this._popover = ref;
  },

  _onChange(value) {
    this._togglePicker(undefined, () => {
      if (typeof this.props.onClick === "function") {
        this.props.onClick({ component: this, value });
      }
    });
  },

  _togglePicker(component, setSateCallback) {
    this.setState(
      state => ({ open: !state.open }),
      () => {
        if (this.state.open) {
          this._popover.open({
            // eslint-disable-next-line react/no-find-dom-node
            aroundElement: component.findDOMNode(),
            position: "bottom",
            onClose: () => this.setState({ open: false })
          });
        } else {
          this._popover.close();
        }

        if (typeof setSateCallback === "function") {
          setSateCallback();
        }
      }
    );
  },

  _getProps() {
    let props = this.getMainPropsToPass();

    props.onClick = this._togglePicker;
    props.tooltip = this.getLsiValue("colorSchemaTooltip");
    props.pressed = this.state.open;
    props.colorSchema = this.props.colorSchema;
    props.bgStyle = this.props.bgStyle;

    return props;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return [
      <UU5.Bricks.Button {...this._getProps()} key="button">
        <UU5.Bricks.Icon icon="mdi-palette" key="icon" />
        <ColorSquare
          className="color-viewer"
          colorSchema={this.props.value}
          width="24px"
          height="4px"
          key="color-viewer"
        />
      </UU5.Bricks.Button>,
      <UU5.Bricks.Popover
        key="color-schema-popover"
        ref_={this._registerPopover}
        controlled={false}
        className={this.getClassName("popover")}
        forceRender
      >
        <UU5.Bricks.Div>
          <ColorSquare colorSchema="default" onClick={this._onChange} label={this.getLsiValue("defaultColorSchema")} />
        </UU5.Bricks.Div>
        <UU5.Bricks.Div style={{ display: "flex", flexWrap: "wrap" }}>
          {COLOR_SCHEMAS.map(colorSchema => {
            return <ColorSquare key={colorSchema} colorSchema={colorSchema} onClick={this._onChange} />;
          })}
        </UU5.Bricks.Div>
      </UU5.Bricks.Popover>
    ];
  }
  //@@viewOff:render
});

export default ColorPicker;
