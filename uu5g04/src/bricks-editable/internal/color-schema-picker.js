//@@viewOn:imports
import UU5 from "uu5g04";
import LazyLoadedLibraries from "./lazy-loaded-libraries";

import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";
//@@viewOff:imports

const { createVisualComponent } = LazyLoadedLibraries["uu5g04-hooks"];

const notAllowedValues = ["default", "primary", "success", "info", "warning", "danger", "custom"];

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("ColorSchemaPicker"),
};
//@@viewOff:statics

const ColorSchemaPicker = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onChange: UU5.PropTypes.func,
    label: UU5.PropTypes.object,
    value: UU5.PropTypes.string,
    useRichColor: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onChange: undefined,
    label: <UU5.Bricks.Lsi lsi={Lsi.colorSchemaPicker.label} />,
    value: undefined,
    showOnlyRichColors: false,
  },
  //@@viewOff:defaultProps

  render({ label, onChange, value, ...props }) {
    //@@viewOn:hooks
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private

    let useValue = value;
    if (useValue) {
      useValue =
        useValue === "white" || useValue === "black" || useValue.includes("rich") || !props.showOnlyRichColors
          ? useValue
          : `${useValue}-rich`;
    }

    let getSelectOptions = () => {
      let colorSchemaList = UU5.Environment.colorSchema;
      if (props.showOnlyRichColors) {
        colorSchemaList = colorSchemaList.filter(
          (color) => !color.includes("rich") && !notAllowedValues.includes(color)
        );
      }
      let getValue = (value) =>
        props.showOnlyRichColors ? (value === "black" || value === "white" ? value : `${value}-rich`) : value;

      return ["none", ...colorSchemaList].map((colorSchema) => (
        <UU5.Forms.Select.Option
          key={colorSchema}
          value={getValue(colorSchema)}
          content={colorSchema === "none" ? <UU5.Bricks.Lsi lsi={Lsi.colorSchemaPicker.valueInherit} /> : colorSchema}
        />
      ));
    };
    //@@viewOff:private

    //@@viewOn:render
    return (
      <UU5.Forms.Select
        {...props}
        label={label}
        value={useValue || "none"}
        onChange={(opt) => onChange({ ...opt, value: opt.value === "none" ? null : opt.value })}
      >
        {getSelectOptions()}
      </UU5.Forms.Select>
    );
    //@@viewOff:render
  },
});

export default ColorSchemaPicker;
