//@@viewOn:imports
import UU5 from "uu5g04";
import LazyLoadedLibraries from "./lazy-loaded-libraries";

import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";
//@@viewOff:imports

const { createVisualComponent } = LazyLoadedLibraries["uu5g04-hooks"];

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("ColorSchemaPicker")
};
//@@viewOff:statics

const ColorSchemaPicker = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onChange: UU5.PropTypes.func,
    label: UU5.PropTypes.object,
    value: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onChange: undefined,
    label: <UU5.Bricks.Lsi lsi={Lsi.colorSchemaPicker.label} />,
    value: undefined
  },
  //@@viewOff:defaultProps

  render({ label, onChange, value, ...props }) {
    //@@viewOn:hooks
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <UU5.Forms.Select {...props} label={label} value={value} onChange={onChange}>
        {[...UU5.Environment.colorSchema].map(colorSchema => (
          <UU5.Forms.Select.Option key={colorSchema} value={colorSchema} content={colorSchema} />
        ))}
      </UU5.Forms.Select>
    );
    //@@viewOff:render
  }
});

export default ColorSchemaPicker;
