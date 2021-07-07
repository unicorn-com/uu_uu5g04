//@@viewOn:imports
import UU5 from "uu5g04";
import Css from "./css.js";
import LazyLoadedLibraries from "./lazy-loaded-libraries";
import SpacesInputView from "./spaces-input-view";
import Lsi from "../bricks-editable-lsi.js";

import ns from "../bricks-editable-ns.js";
//@@viewOff:imports

const CLASS_NAMES = {
  infoMargin: () => {
    return Css.css`
      width: 16px;
      height: 16px;
      display:inline-block;
      background-color: #FDEAD6;
      margin-right: 4px;
    `;
  },
  infoPadding: () => {
    return Css.css`
      width: 16px;
      height: 16px;
      display:inline-block;
      background-color: #E1F0E1;
      margin-left: 8px;
      margin-right: 4px;
    `;
  },
  legendContainer: () => {
    return Css.css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `;
  },
  infoWrapper: () => {
    return Css.css`
      display: flex;
      align-items: center;
    `;
  },
  message: () => {
    return Css.css`
      display: block;
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.34);
      font-size: 14px;
      font-style: italic;
    `;
  },
};

const { createVisualComponent } = LazyLoadedLibraries["uu5g04-hooks"];

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("SpacesInput"),
};
//@@viewOff:statics
const SpacesInput = createVisualComponent({
  ...STATICS,
  //@@viewOn:propTypes
  propTypes: {
    hidePaddingHorizontal: UU5.PropTypes.bool,
    hideVerticalPadding: UU5.PropTypes.bool,
    hideVerticalMargin: UU5.PropTypes.bool,
    hideHorizontalMargin: UU5.PropTypes.bool,
    screenSizeList: UU5.PropTypes.arrayOf(UU5.PropTypes.oneOf(["xs", "s", "l"])),
    header: UU5.PropTypes.string,
    value: UU5.PropTypes.object,
    valuePlaceholder: UU5.PropTypes.object,
    onChange: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    screenSizeList: ["xs", "s", "l"],
    header: "Margins & paddings",
    hidePaddingHorizontal: false,
    hideVerticalPadding: false,
    hideVerticalMargin: false,
    hideHorizontalMargin: false,
    value: undefined,
    valuePlaceholder: undefined,
    onChange: UU5.PropTypes.func,
  },
  //@@viewOff:defaultProps
  onChangeFeedbackDefault: () => {},

  render({
    hidePaddingHorizontal,
    hidePaddingVertical,
    hideMarginVertical,
    hideMarginHorizontal,
    onChange,
    screenSizeList,
    onChangeFeedback,
    ...props
  }) {
    let padding = { ...props.value.padding };
    let margin = { ...props.value.margin };
    let paddingPlaceholder = { ...props?.valuePlaceholder?.padding };
    let marginPlaceholder = { ...props?.valuePlaceholder?.margin };
    let onChangeView = (position) => (opt) => {
      let screenSizes = {
        padding: { ...padding, [position]: opt.padding },
        margin: { ...margin, [position]: opt.margin },
      };
      let spaces = ["padding", "margin"];
      let newFeedback = "";
      for (let x = 0; x < spaces.length; x++) {
        for (let i = 0; i < screenSizeList.length; i++) {
          for (const item in screenSizes[spaces[x]][screenSizeList[i]]) {
            if (screenSizes[spaces[x]][screenSizeList[i]][item]) {
              let value = screenSizes[spaces[x]][screenSizeList[i]][item].trim();

              let match = /^(-)?((\d*(?!\s)(?:.)(px|vh|vw|%|em)?)|auto)$/.test(value);
              if (screenSizes[spaces[x]][screenSizeList[i]][item] && !match) {
                newFeedback = "error";
              }
            }
          }
        }
      }
      onChange({ value: screenSizes });
      onChangeFeedback({ feedback: newFeedback });
    };
    let commonProps = {
      hidePaddingHorizontal,
      hidePaddingVertical,
      hideMarginVertical,
      hideMarginHorizontal,
    };
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <UU5.Bricks.Section
        header={{
          element: (
            <div className={CLASS_NAMES.legendContainer()}>
              <h3>{props.header}</h3>
              <span className={CLASS_NAMES.infoWrapper()}>
                <div className={CLASS_NAMES.infoMargin()} />
                Margin
                <div className={CLASS_NAMES.infoPadding()} />
                Padding
              </span>
            </div>
          ),
        }}
      >
        {screenSizeList.includes("xs") && (
          <SpacesInputView
            {...props}
            margin={margin.xs}
            padding={padding.xs}
            marginPlaceholder={marginPlaceholder.xs}
            paddingPlaceholder={paddingPlaceholder.xs}
            onChange={onChangeView("xs")}
            title="Mobile"
            {...commonProps}
          />
        )}
        {screenSizeList.includes("s") && (
          <SpacesInputView
            {...props}
            margin={margin.s}
            padding={padding.s}
            marginPlaceholder={marginPlaceholder.s}
            paddingPlaceholder={paddingPlaceholder.s}
            onChange={onChangeView("s")}
            title="Tablet"
            {...commonProps}
          />
        )}
        {screenSizeList.includes("l") && (
          <SpacesInputView
            {...props}
            margin={margin.l}
            padding={padding.l}
            marginPlaceholder={marginPlaceholder.l}
            paddingPlaceholder={paddingPlaceholder.l}
            onChange={onChangeView("l")}
            title="Desktop"
            {...commonProps}
          />
        )}
        <UU5.Bricks.Lsi className={CLASS_NAMES.message()} lsi={Lsi.spacesInput.infoMessagePartOne} />
        <UU5.Bricks.Lsi className={CLASS_NAMES.message()} lsi={Lsi.spacesInput.infoMessagePartTwo} />
      </UU5.Bricks.Section>
    );
    //@@viewOff:render
  },
});

export default SpacesInput;
