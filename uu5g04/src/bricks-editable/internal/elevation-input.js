//@@viewOn:imports
import UU5 from "uu5g04";
import LazyLoadedLibraries from "./lazy-loaded-libraries";

import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";
//@@viewOff:imports

const { createVisualComponent, useMemo } = LazyLoadedLibraries["uu5g04-hooks"];

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("ElevationInput")
};
//@@viewOff:statics

const ElevationInput = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    componentProps: UU5.PropTypes.object,
    onChange: UU5.PropTypes.func,
    label: UU5.PropTypes.object,
    items: UU5.PropTypes.arrayOf(UU5.PropTypes.object),
    value: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.number])
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    componentProps: undefined,
    onChange: undefined,
    label: <UU5.Bricks.Lsi lsi={Lsi.elevationInput.label} />,
    items: [
      { value: "-1" },
      { value: "0" },
      { value: "1" },
      { value: "2" },
      { value: "3" },
      { value: "4" },
      { value: "5" }
    ],
    value: undefined
  },
  //@@viewOff:defaultProps

  render({ items, label, onChange, value, ...props }) {
    //@@viewOn:hooks
    const usedValue = useMemo(() => {
      if (value != null) {
        return value + ""; // number to string
      } else {
        return "0";
      }
    }, [value]);
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <UU5.Forms.SwitchSelector
        {...props}
        label={label}
        value={usedValue}
        onChange={opt => onChange({ ...opt, value: +opt.value })}
        items={items}
      />
    );
    //@@viewOff:render
  }
});

export default ElevationInput;
