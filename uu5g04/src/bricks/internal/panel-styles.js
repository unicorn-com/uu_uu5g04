import * as UU5 from "uu5g04";

const COLORS = UU5.Environment.colors;

const getDefaultColors = (colorShades, bgStyle) => {
  let definitions = {
    buttonBgColor: "transparent",
    buttonTextColor: COLORS.common.darkText,
    buttonBgColorHover: colorShades.c400,
    buttonTextColorHover: COLORS.common.darkText,
    buttonBgColorActive: colorShades.c500,
    buttonTextColorActive: COLORS.common.darkText
  };

  if (bgStyle === "filled") {
    definitions = {
      ...definitions,
      bgColor: colorShades.c300,
      bgColorHover: colorShades.c400,
      bgColorActive: colorShades.c500,
      textColor: COLORS.common.darkText,
      textColorHover: COLORS.common.darkText,
      textColorActive: COLORS.common.darkText,
      borderColor: colorShades.c300,
      borderColorHover: colorShades.c400,
      borderColorActive: colorShades.c500
    };
  } else {
    definitions = {
      ...definitions,
      bgColor: "transparent",
      bgColorHover: colorShades.c200,
      bgColorActive: colorShades.c300,
      textColor: COLORS.common.darkText,
      textColorHover: COLORS.common.darkText,
      textColorActive: COLORS.common.darkText,
      borderColor: colorShades.c400,
      borderColorHover: colorShades.c400,
      borderColorActive: colorShades.c400
    };
  }

  return definitions;
};

const getColors = (colorSchema, bgStyle) => {
  colorSchema = UU5.Environment.colorSchemaMap[colorSchema].color;
  let colorShades = getShades(colorSchema);

  if (!colorSchema || colorSchema === "custom") {
    return null;
  } else if (colorSchema === "default") {
    return getDefaultColors(colorShades, bgStyle);
  } else {
    return null;
  }
};

const getButtonActiveStyles = (colorSchema, bgColorHover, textColorHover, bgColorActive, textColorActive) => {
  return `
    &:hover {
      background-color: ${bgColorHover};

      ${colorSchema !== "default" ? `color: ${textColorHover};` : ""}
    }

    &:active {
      background-color: ${bgColorActive};

      ${colorSchema !== "default" ? `color: ${textColorActive};` : ""}
    }
  `;
};

const getHoverStyles = (
  colorSchema,
  bgColorActive,
  textColorActive,
  borderColorActive,
  bgColorHover,
  textColorHover,
  borderColorHover
) => {
  return `
    &:active:hover, &.active:hover,
    &:active:focus, &.active:focus {
      background-color: ${bgColorActive};
      border-color: ${borderColorActive};

      ${colorSchema !== "default" ? `color: ${textColorActive};` : ""}
    }

    &:hover, &:focus {
      background-color: ${bgColorHover};
      border-color: ${borderColorHover};

      ${colorSchema !== "default" ? `color: ${textColorHover};` : ""}
    }
  `;
};

const getShades = colorSchema => {
  // get the most commonly used shades of the given colorSchema
  if (colorSchema === "default" || colorSchema === "grey" || !colorSchema) {
    return UU5.Environment.colors["grey"];
  } else {
    return UU5.Environment.colors[colorSchema.replace(/-rich/, "")];
  }
};

export default { getColors, getButtonActiveStyles, getHoverStyles };
