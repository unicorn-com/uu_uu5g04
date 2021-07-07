//@@viewOn:imports
import UU5 from "uu5g04";
import LazyLoadedLibraries from "./lazy-loaded-libraries";

import ns from "../bricks-editable-ns.js";
//@@viewOff:imports

const { createVisualComponent, useScreenSize } = LazyLoadedLibraries["uu5g04-hooks"];

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("SpaceInput"),
};
//@@viewOff:statics
const SpaceInput = createVisualComponent({
  ...STATICS,
  //@@viewOn:propTypes
  propTypes: {
    onChange: UU5.PropTypes.func,
    value: UU5.PropTypes.string,
    placeholder: UU5.PropTypes.string,
    className: UU5.PropTypes.string,
    position: UU5.PropTypes.string,
    feedback: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onChange: undefined,
    value: undefined,
    placeholder: undefined,
    className: undefined,
    position: undefined,
    feedback: undefined,
  },
  //@@viewOff:defaultProps

  render({ value, className, onChange, position, feedback, placeholder }) {
    //@@viewOn:private
    let screenSize = useScreenSize();
    value = value?.trim();
    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <UU5.Forms.Text
        size={screenSize === "xs" ? "m" : "s"}
        value={value}
        className={className}
        borderRadius="4px"
        validateOnChange={false}
        feedback={feedback}
        placeholder={placeholder}
        onBlur={onChange(position)}
      />
    );
    //@@viewOff:render
  },
});

export default SpaceInput;
