//@@viewOn:imports
import UU5 from "uu5g04";
import Css from "./css.js";
import LazyLoadedLibraries from "./lazy-loaded-libraries";
import MarginInput from "./margin-input.js";
import PaddingInput from "./padding-input.js";

import ns from "../bricks-editable-ns.js";
//@@viewOff:imports

const { createVisualComponent } = LazyLoadedLibraries["uu5g04-hooks"];

const CLASS_NAMES = {
  main: (displayInputs) => {
    return Css.css`
      display: flex;
      align-items: center;
      max-width: calc(100% - 100px);
      position: relative;
      margin: 8px 40px 40px 72px;
      height: 144px;
      min-width: 192px;
    `;
  },
  title: (displayInputs) => {
    return Css.css`
      display: inline;
    `;
  },
};

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("SpacesInputView"),
};
//@@viewOff:statics
const SpacesInputView = createVisualComponent({
  ...STATICS,
  //@@viewOn:propTypes
  propTypes: {
    hidePaddingHorizontal: UU5.PropTypes.bool,
    hideVerticalPadding: UU5.PropTypes.bool,
    hideVerticalMargin: UU5.PropTypes.bool,
    hideHorizontalMargin: UU5.PropTypes.bool,
    margin: UU5.PropTypes.object,
    padding: UU5.PropTypes.object,
    marginPlaceholder: UU5.PropTypes.object,
    paddingPlaceholder: UU5.PropTypes.object,
    onChange: UU5.PropTypes.func,
    title: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    screenSizeList: ["xs", "s", "l"],
    hidePaddingHorizontal: false,
    hideVerticalPadding: false,
    hideVerticalMargin: false,
    hideHorizontalMargin: false,
    margin: undefined,
    padding: undefined,
    marginPlaceholder: undefined,
    paddingPlaceholder: undefined,
    onChange: undefined,
  },
  //@@viewOff:defaultProps

  render({
    items,
    label,
    onChange,
    value,
    minSize,
    maxSize,
    padding,
    margin,
    values,
    hidePaddingHorizontal,
    hidePaddingVertical,
    hideMarginVertical,
    hideMarginHorizontal,
    feedback,
    marginPlaceholder,
    paddingPlaceholder,
    ...props
  }) {
    //@@viewOn:private
    let commonProps = {
      hidePaddingHorizontal,
      hidePaddingVertical,
      hideMarginVertical,
      hideMarginHorizontal,
      feedback,
    };

    let onChangePadding = (position) => (paddingValue) => {
      let value = paddingValue.value?.trim();
      onChange({
        margin,
        padding: { ...padding, [position]: value },
        value: paddingValue.value,
      });
    };

    let onChangeMargin = (position) => (marginValue) => {
      onChange({
        padding,
        margin: { ...margin, [position]: marginValue.value?.trim() },
        value: marginValue.value,
      });
    };
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    return (
      <>
        <div className={CLASS_NAMES.title(props.displayInputs)}>{props.title}</div>
        <div className={CLASS_NAMES.main(props.displayInputs)}>
          <MarginInput value={margin} placeholder={marginPlaceholder} onChange={onChangeMargin} {...commonProps}>
            <PaddingInput
              value={padding}
              placeholder={paddingPlaceholder}
              onChange={onChangePadding}
              hidePaddingHorizontal={hidePaddingHorizontal}
              hidePaddingVertical={hidePaddingVertical}
              feedback={feedback}
            />
          </MarginInput>
        </div>
      </>
    );
    //@@viewOff:render
  },
});

export default SpacesInputView;
