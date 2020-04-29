import * as UU5 from "uu5g04";
import Css from "./css.js";
import ns from "../forms-ns.js";

function hasValue(value) {
  return !!(value && value.length);
}

function isComputedDisabled(state) {
  if (state.disabled || state.feedback === "loading") {
    return true;
  } else {
    return false;
  }
}

const COLORS = UU5.Environment.colors;

// space between each tag
const TAG_SPACING = {
  s: "3px 2px",
  m: "3px 2px",
  l: "4px 3px",
  xl: "5px 4px"
};

const TAG_PADDING = {
  s: "1px 3px 3px 5px",
  m: "2px 4px 3px 7px",
  l: "3px 4px 4px 8px",
  xl: "3px 6px 5px 9px"
};

const TAG_HEIGHT = {
  s: "20px",
  m: "24px",
  l: "28px",
  xl: "32px"
};

const INPUT_PADDING = {
  s: "3px",
  m: "4px",
  l: "6px",
  xl: "8px"
};

const INPUT_FONT_SIZE = {
  s: "12px",
  m: "14px",
  l: "16px",
  xl: "18px"
};

const INPUT_MIN_HEIGHT = {
  s: "22px",
  m: "30px",
  l: "38px",
  xl: "46px"
};

const ICON_MARGIN_TOP = {
  s: "4px",
  m: "5px",
  l: "6px",
  xl: "6px"
};

const INPUT_MIN_WIDTHS = {
  s: "136px",
  m: "160px",
  l: "180px",
  xl: "200px"
};

const CommonClassNames = {
  main: props => {
    let styles = `
      .uu5-bricks-button.uu5-forms-input-button {
        width: auto; padding: 0 16px;
      }

      & .uu5-forms-select-option.uu5-forms-select-option.uu5-forms-select-option {
        border: none;
        padding: 9px 16px;
        color: rgba(0,0,0,0.87) !important;

        &.uu5-common-disabled {
          color: rgba(0,0,0,0.24);
        }
      }
    `;

    if (props.inputWidth === "auto" || props.nestingLevel === "inline") {
      styles += `
        .uu5-forms-items-input {
          &.uu5-forms-items-input.uu5-forms-items-input.uu5-forms-items-input {
            width: auto
          }

          min-width: ${INPUT_MIN_WIDTHS[props.size]};
        }
      `;
    }

    return ns.css("tag-select") + " " + Css.css(styles);
  },
  tag: props => {
    return Css.css(`
      && {
        display: inline-flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.1);
        color: rgba(0, 0, 0, .87);
        height: ${TAG_HEIGHT[props.size]};
        padding: ${TAG_PADDING[props.size]};
        margin: ${TAG_SPACING[props.size]};
        max-width: 100%;

        .uu5-bricks-icon {
          font-size: inherit;
          position: static;
          padding: 2px 0 0 0;
        }
      }
    `);
  },
  tagTextWrapper: () => {
    return Css.css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `;
  },
  itemsInput: () => {
    return Css.css(`
      & > .uu5-forms-input-form-item-value {
        display: flex;
        flex-grow: 1;
      }
    `);
  },
  inputValueWrapper: props => {
    let paddingLeft,
      paddingRight = parseInt(INPUT_PADDING[props.size]) + parseInt(TAG_PADDING[props.size].split(" ")[3]) + "px";

    if (props.multiple) {
      paddingLeft = INPUT_PADDING[props.size];
    } else {
      paddingLeft = parseInt(INPUT_PADDING[props.size]) + parseInt(TAG_PADDING[props.size].split(" ")[3]) + "px";
    }

    return Css.css(`
      display: flex;
      flex-grow: 1;
      align-items: center;
      padding-left: ${paddingLeft};
      padding-right: ${paddingRight};
      max-width: 100%;
    `);
  },
  valueWrapper: () => Css.css`
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  `,
  inputValue: props => {
    return Css.css(`
      display: flex;
      flex: 1 1 auto;
      flex-wrap: ${props.multiple ? "wrap" : "nowrap"};
      align-items: center;
      min-width: 0;
      min-height: ${INPUT_MIN_HEIGHT[props.size]}
    `);
  },
  inputResetIconWrapper: () => {
    return Css.css(`
      &&& {
        height: 100%;
      }
    `);
  },
  inputResetIcon: (props, state) => {
    return Css.css(`
      &&& {
        height: 1em;
        padding: 0;
        margin-top: ${ICON_MARGIN_TOP[props.size]};
        cursor: ${!state.readOnly && !isComputedDisabled(state) ? "pointer" : "default"};
        position: relative;
      }
    `);
  },
  textInput: (props, state) => {
    let padding;
    let showPlaceholder = !state.searchValue && (props.multiple || !hasValue(state.value));
    let placeholder = showPlaceholder
      ? props.placeholder || UU5.Common.BaseMixin.getLsiItem(UU5.Environment.Lsi.Forms.tagSelect.placeholder)
      : null;
    let placeholderWidth = showPlaceholder
      ? UU5.Common.Tools.calculateTextWidth(placeholder, {
          fontSize: `${INPUT_FONT_SIZE[props.size]}`,
          whiteSpace: "pre"
        })
      : undefined;

    if (props.multiple) {
      padding = parseInt(TAG_PADDING[props.size].split(" ")[3]) + "px";
    } else {
      padding = "0px";
    }

    let flex = "1 0 auto";
    let margin = TAG_SPACING[props.size];
    let minWidth = 0;

    if (!props.multiple && !state.searchValue) {
      flex = "0 0 0";
      margin = "0 -1px 0 0";
      minWidth = placeholderWidth || 1;
    }

    return Css.css(`
      flex: ${flex};
      display: inline-block;
      padding-left: ${padding};
      padding-right: ${padding};
      margin: ${margin};
      cursor: ${!state.readOnly && !isComputedDisabled(state) ? "text" : "default"};;
      max-width: 100%;
      min-width: ${minWidth}px;

      &&&& > input {
        height: ${TAG_HEIGHT[props.size]};
        padding: 0;
        max-width: 100%;
        background-color: transparent;

      ${UU5.Common.Tools.isIE() ? "&::-ms-clear { display: none; }" : ""}

      &&& > input:focus {
        background-color: transparent;
      }
    `);
  },
  itemList: props => {
    const colors = getColors(props.colorSchema);

    return Css.css(`
      && {
        display: block;
      }

      .uu5-forms-auto-complete-item {
        text-overflow: ellipsis;
        overflow: hidden;

        &:hover, &:focus {
          background-color: ${colors.itemBgColorHover};
        }

        &.uu5-forms-auto-complete-item.uu5-forms-item-list-selected {
          background-color: ${colors.selectedItemBgColor};

          &:hover, &:focus {
            background-color: ${colors.selectedItemBgColorHover};
            color: ${colors.selectedItemTextColorHover};
          }
        }
      }

    `);
  }
};

function getStandardColors(colorShades) {
  return {
    itemBgColorHover: COLORS.grey.c300,
    selectedItemBgColor: colorShades.c50,
    selectedItemBgColorHover: colorShades.c500,
    selectedItemTextColorHover: colorShades.inverse
  };
}

const getRichColors = getStandardColors;
const getDefaultColors = getStandardColors;

function getWhiteColors(colorShades) {
  // TODO
  return {
    itemBgColorHover: COLORS.grey.c300,
    selectedItemBgColor: colorShades.c50,
    selectedItemBgColorHover: colorShades.c500,
    selectedItemTextColorHover: colorShades.inverse
  };
}

function getBlackColors(colorShades) {
  // TODO
  return {
    itemBgColorHover: COLORS.grey.c300,
    selectedItemBgColor: colorShades.c50,
    selectedItemBgColorHover: colorShades.c500,
    selectedItemTextColorHover: colorShades.inverse
  };
}

function getGreyColors(colorShades) {
  // TODO
  return {
    itemBgColorHover: COLORS.grey.c300,
    selectedItemBgColor: colorShades.c50,
    selectedItemBgColorHover: colorShades.c500,
    selectedItemTextColorHover: colorShades.inverse
  };
}

function getColors(colorSchema) {
  colorSchema = colorSchema || "default";
  colorSchema = UU5.Environment.colorSchemaMap[colorSchema].color;
  let colorShades = getShades(colorSchema);

  if (colorSchema === "default") {
    return getDefaultColors(colorShades);
  } else if (colorSchema === "white") {
    return getWhiteColors(colorShades);
  } else if (colorSchema === "black") {
    return getBlackColors(colorShades);
  } else if (colorSchema === "grey" || colorSchema === "grey-rich") {
    return getGreyColors(colorShades);
  } else if (colorSchema.match(/\w+-rich/)) {
    return getRichColors(colorShades);
  } else {
    return getStandardColors(colorShades);
  }
}

function getShades(colorSchema) {
  // get the most commonly used shades of the given colorSchema
  if (colorSchema === "default" || colorSchema === "blue" || colorSchema === "custom") {
    return UU5.Environment.colors["blue"];
  } else {
    return UU5.Environment.colors[colorSchema.replace(/-rich/, "")];
  }
}

export default { CommonClassNames };
