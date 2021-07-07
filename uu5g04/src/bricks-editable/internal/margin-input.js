//@@viewOn:imports
import UU5 from "uu5g04";
import Css from "./css.js";
import LazyLoadedLibraries from "./lazy-loaded-libraries";
import SpaceInput from "./space-input.js";

import ns from "../bricks-editable-ns.js";
//@@viewOff:imports

const { createVisualComponent, useScreenSize } = LazyLoadedLibraries["uu5g04-hooks"];

const CLASS_NAMES = {
  outerContainer: (hidePadding) => {
    return Css.css`
      position: absolute;
      width: 100%;
      height: ${hidePadding ? "64px" : "116px"};
      border: 12px solid #FDEAD6;
    `;
  },
  marginVertical: (hideMarginVertical, position, screenSize, hidePadding) => {
    let topValue =
      position === "bottom" ? (screenSize === "xs" ? "-36px" : "-30px") : screenSize === "xs" ? "-53px" : "-46px"; //(hidePadding ? "-30px" : "-30px")
    return Css.css`
    &&{position: absolute;
      ${position}: ${topValue};
      left: calc(50% - 25px);
      width: 50px;
      display: ${hideMarginVertical ? "none" : null};}
      .uu5-forms-message{
        position: absolute;
      }
    `;
  },
  marginHorizontal: (hideMarginVertical, position, partialMargin, hidePadding) => {
    return Css.css`
    &&{position: absolute;
      width: 50px;
      ${position}: -54px;
      top:${hidePadding ? "-8px" : "18px"};
      display: ${hideMarginVertical ? "none" : null};
    }
    .uu5-forms-message{
      position: absolute;
    }
    `;
  },
};

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("MarginInput"),
};
//@@viewOff:statics
const MarginInput = createVisualComponent({
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

  render({
    items,
    label,
    onChange,
    value,
    minSize,
    maxSize,
    values,
    padding,
    onChangePadding,
    hidePaddingHorizontal,
    hidePaddingVertical,
    hideMarginVertical,
    hideMarginHorizontal,
    feedback,
    placeholder,
    ...props
  }) {
    //@@viewOn:private

    let screenSize = useScreenSize();
    let hidePadding = hidePaddingHorizontal && hidePaddingVertical;
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <div className={CLASS_NAMES.outerContainer(hidePadding)}>
        {props.children}
        <SpaceInput
          onChange={onChange}
          value={value?.bottom}
          placeholder={placeholder?.bottom}
          className={CLASS_NAMES.marginVertical(hideMarginVertical, "bottom", screenSize, hidePadding)}
          position="bottom"
          feedback={feedback}
        />
        <SpaceInput
          onChange={onChange}
          value={value?.left}
          placeholder={placeholder?.left}
          className={CLASS_NAMES.marginHorizontal(hideMarginHorizontal, "left", screenSize, hidePadding)}
          position="left"
          feedback={feedback}
        />
        <SpaceInput
          onChange={onChange}
          value={value?.right}
          placeholder={placeholder?.right}
          className={CLASS_NAMES.marginHorizontal(hideMarginHorizontal, "right", screenSize, hidePadding)}
          position="right"
          feedback={feedback}
        />
        <SpaceInput
          onChange={onChange}
          value={value?.top}
          placeholder={placeholder?.top}
          className={CLASS_NAMES.marginVertical(hideMarginVertical, "top", screenSize, hidePadding)}
          position="top"
          feedback={feedback}
        />
      </div>
    );
    //@@viewOff:render
  },
});

export default MarginInput;
