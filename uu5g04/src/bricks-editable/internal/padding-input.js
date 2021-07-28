//@@viewOn:imports
import UU5 from "uu5g04";
import Css from "./css.js";
import LazyLoadedLibraries from "./lazy-loaded-libraries";
import SpaceInput from "./space-input.js";

import ns from "../bricks-editable-ns.js";
//@@viewOff:imports

const { createVisualComponent } = LazyLoadedLibraries["uu5g04-hooks"];

const CLASS_NAMES = {
  innerContainer: (hidePadding) => {
    return Css.css`
      position: absolute;
      top: 2px;
      left: 2px;
      width: calc(100% - 4px);
      height: ${hidePadding ? "36px" : "88px"};
      border 12px solid #E1F0E1;
    `;
  },
  paddingVertical: (hidePaddingVertical, position, hidePadding) => {
    let positionValue = position === "bottom" ? (hidePadding ? "bottom: -29px;" : "bottom: -8px;") : "top: -24px;";
    return Css.css`
    &&{position: absolute;
      left: calc(50% - 25px);
      width: 50px;
      ${positionValue}
      display: ${hidePaddingVertical ? "none" : null};}
      .uu5-forms-message{
        position: absolute;
      }
    `;
  },
  paddingHorizontal: (hideHorizontalPadding, position) => {
    return Css.css`
    &&{position: absolute;
      width: 50px;
      top: 4px;
      ${position}: -8px;
      display: ${hideHorizontalPadding ? "none" : null};}
      .uu5-forms-message{
        position: absolute;
      }
    `;
  },
};

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("PaddingInput"),
};
//@@viewOff:statics
const PaddingInput = createVisualComponent({
  ...STATICS,
  //@@viewOn:propTypes
  propTypes: {
    hidePaddingHorizontal: UU5.PropTypes.bool,
    hideVerticalPadding: UU5.PropTypes.bool,
    hideVerticalMargin: UU5.PropTypes.bool,
    hideHorizontalMargin: UU5.PropTypes.bool,
    value: UU5.PropTypes.object,
    placeholder: UU5.PropTypes.object,
    feedback: UU5.PropTypes.string,
    onChange: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    hidePaddingHorizontal: false,
    hideVerticalPadding: false,
    hideVerticalMargin: false,
    hideHorizontalMargin: false,
    value: undefined,
    placeholder: undefined,
    onChange: undefined,
    feedback: undefined,
  },
  //@@viewOff:defaultProps

  render({ items, label, onChange, value, minSize, maxSize, values, feedback, placeholder, ...props }) {
    //@@viewOn:private
    let hidePadding = props.hidePaddingHorizontal && props.hidePaddingVertical;
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    return (
      <div className={CLASS_NAMES.innerContainer(hidePadding)}>
        <SpaceInput
          onChange={onChange}
          value={value?.top}
          placeholder={placeholder?.top}
          className={CLASS_NAMES.paddingVertical(props.hidePaddingVertical, "top", hidePadding)}
          position="top"
          feedback={feedback}
        />
        <SpaceInput
          onChange={onChange}
          value={value?.right}
          placeholder={placeholder?.right}
          className={CLASS_NAMES.paddingHorizontal(props.hidePaddingVertical, "right", hidePadding)}
          position="right"
          feedback={feedback}
        />
        <SpaceInput
          onChange={onChange}
          value={value?.bottom}
          placeholder={placeholder?.bottom}
          className={CLASS_NAMES.paddingVertical(props.hidePaddingVertical, "bottom", hidePadding)}
          position="bottom"
          feedback={feedback}
        />
        <SpaceInput
          onChange={onChange}
          value={value?.left}
          placeholder={placeholder?.left}
          className={CLASS_NAMES.paddingHorizontal(props.hidePaddingHorizontal, "left", hidePadding)}
          position="left"
          feedback={feedback}
        />
      </div>
    );
    //@@viewOff:render
  },
});

export default PaddingInput;
