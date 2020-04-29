//@@viewOn:imports
import UU5 from "uu5g04";
import LazyLoadedLibraries from "./lazy-loaded-libraries";

import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";
//@@viewOff:imports

const { createVisualComponent } = LazyLoadedLibraries["uu5g04-hooks"];

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("BorderRadiusInput")
};
//@@viewOff:statics

const BorderRadiusInput = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    componentProps: UU5.PropTypes.object,
    onChange: UU5.PropTypes.func,
    label: UU5.PropTypes.object,
    items: UU5.PropTypes.arrayOf(UU5.PropTypes.object)
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    componentProps: undefined,
    onChange: undefined,
    label: <UU5.Bricks.Lsi lsi={Lsi.borderRadiusInput.label} />,
    items: [
      { value: "0", content: Lsi.none },
      { value: "2px" },
      { value: "4px" },
      { value: "8px" },
      { value: "16px" },
      { value: "50%", content: Lsi.rounded }
    ]
  },
  //@@viewOff:defaultProps

  render({ items, label, componentProps, onChange, ...props }) {
    //@@viewOn:hooks
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
        value={componentProps.borderRadius}
        onChange={opt => onChange({ value: opt.value })}
        items={items}
      />
    );
    //@@viewOff:render
  }
});

export default BorderRadiusInput;
