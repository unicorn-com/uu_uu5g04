//@@viewOn:imports
import UU5 from "uu5g04";
import LazyLoadedLibraries from "./lazy-loaded-libraries";

import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";
//@@viewOff:imports

const { createVisualComponent, useMemo } = LazyLoadedLibraries["uu5g04-hooks"];

const sizes = ["xs", "s", "m", "l", "xl"];

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("SizeInput"),
};
//@@viewOff:statics

const SizeInput = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onChange: UU5.PropTypes.func,
    label: UU5.PropTypes.object,
    items: UU5.PropTypes.arrayOf(UU5.PropTypes.object),
    value: UU5.PropTypes.string,
    minSize: UU5.PropTypes.oneOf(sizes),
    maxSize: UU5.PropTypes.oneOf(sizes),
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onChange: undefined,
    label: <UU5.Bricks.Lsi lsi={Lsi.sizeInput.label} />,
    items: undefined,
    value: UU5.PropTypes.string,
    minSize: "xs",
    maxSize: "xl",
  },
  //@@viewOff:defaultProps

  render({ items, label, onChange, value, minSize, maxSize, ...props }) {
    //@@viewOn:hooks
    const usedItems = useMemo(() => {
      if (items) {
        return items;
      } else {
        return sizes.slice(sizes.indexOf(minSize), sizes.indexOf(maxSize) + 1).map((size) => ({
          value: size,
          content: <UU5.Bricks.Lsi lsi={Lsi.sizeInput[`value${size.toUpperCase()}`]} />,
        }));
      }
    }, [items, minSize, maxSize]);
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <UU5.Forms.SwitchSelector {...props} label={label} value={value} onChange={onChange} items={usedItems} />;
    //@@viewOff:render
  },
});

export default SizeInput;
