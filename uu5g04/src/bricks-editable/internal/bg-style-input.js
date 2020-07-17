//@@viewOn:imports
import UU5 from "uu5g04";
import LazyLoadedLibraries from "./lazy-loaded-libraries";

import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";
//@@viewOff:imports

const { createVisualComponent } = LazyLoadedLibraries["uu5g04-hooks"];

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("BgStyleInput")
};
//@@viewOff:statics

const BgStyleInput = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onChange: UU5.PropTypes.func,
    label: UU5.PropTypes.object,
    items: UU5.PropTypes.arrayOf(UU5.PropTypes.object),
    value: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onChange: undefined,
    label: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.label} />,
    items: [
      { value: "filled", content: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.filled} /> },
      { value: "outline", content: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.outline} /> },
      { value: "transparent", content: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.transparent} /> },
      { value: "underline", content: <UU5.Bricks.Lsi lsi={Lsi.bgStyleInput.underline} /> }
    ],
    value: UU5.PropTypes.string
  },
  //@@viewOff:defaultProps

  render({ items, label, onChange, value, ...props }) {
    //@@viewOn:hooks
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <UU5.Forms.SwitchSelector {...props} label={label} value={value} onChange={onChange} items={items} />;
    //@@viewOff:render
  }
});

export default BgStyleInput;
