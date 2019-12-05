import * as UU5 from "uu5g04";

const COLORS = UU5.Environment.colors;
// const HEX_REGEXP = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
// const RGB_REGEXP = /^rgb\((0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s?(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s?(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d)\)$/;
// const RGBA_REGEXP = /^rgba\((0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s?(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s?(0|255|25[0-4]|2[0-4]\d|1\d\d|0?\d?\d),\s?(0?\.\d+|1(\.0)?)\)$/;
// const isColor = string => HEX_REGEXP.test(string) || RGB_REGEXP.test(string) || RGBA_REGEXP.test(string);

const getStandardColors = (colorShades, bgStyle) => {
  let definitions;

  if (bgStyle === "filled") {
    definitions = {
      borderColor: colorShades.c700,
      borderColorHover: colorShades.c900,
      borderColorActive: colorShades.c900
    };
  } else {
    definitions = {
      borderColor: colorShades.c500,
      borderColorHover: colorShades.c500,
      borderColorActive: colorShades.c900
    };
  }

  return definitions;
};

const getRichColors = getStandardColors;

const getDefaultColors = (colorShades, bgStyle) => {
  let definitions;

  if (bgStyle === "filled" || !bgStyle) {
    definitions = {
      bgColor: colorShades.c300,
      bgColorHover: colorShades.c400,
      bgColorActive: colorShades.c500,
      textColor: COLORS.common.darkText,
      textColorHover: COLORS.common.darkText,
      textColorActive: COLORS.common.darkText,
      borderColor: colorShades.c400,
      borderColorHover: colorShades.c500,
      borderColorActive: colorShades.c500
    };
  } else if (bgStyle === "link") {
    definitions = {
      bgColor: "transparent",
      bgColorHover: "transparent",
      bgColorActive: "transparent",
      textColor: COLORS.common.darkText,
      textColorHover: COLORS.common.darkText,
      textColorActive: COLORS.common.black,
      borderColor: colorShades.c400,
      borderColorHover: colorShades.darkText,
      borderColorActive: colorShades.c500
    };
  } else {
    definitions = {
      bgColor: COLORS.white.c900,
      bgColorHover: colorShades.c200,
      bgColorActive: colorShades.c300,
      textColor: COLORS.common.darkText,
      textColorHover: COLORS.common.darkText,
      textColorActive: COLORS.common.darkText,
      borderColor: colorShades.c400,
      borderColorHover: colorShades.c500,
      borderColorActive: colorShades.c500
    };
  }

  if (bgStyle === "transparent") {
    definitions.bgColor = "transparent";
  }

  return definitions;
};

const getWhiteColors = (colorShades, bgStyle) => {
  let definitions;

  if (bgStyle === "filled") {
    definitions = {
      borderColor: colorShades.c900,
      borderColorHover: colorShades.c800,
      borderColorActive: colorShades.c700
    };
  } else {
    definitions = {
      borderColor: colorShades.c900,
      borderColorHover: colorShades.c900,
      borderColorActive: colorShades.c700
    };
  }

  return definitions;
};

const getBlackColors = (colorShades, bgStyle) => {
  let definitions;

  if (bgStyle === "filled") {
    definitions = {
      borderColor: colorShades.c900,
      borderColorHover: colorShades.c800,
      borderColorActive: colorShades.c700
    };
  } else {
    definitions = {
      borderColor: colorShades.c900,
      borderColorHover: colorShades.c900,
      borderColorActive: colorShades.c900
    };
  }

  return definitions;
};

const getGreyColors = (colorShades, bgStyle) => {
  let definitions;

  if (bgStyle === "filled") {
    definitions = {
      borderColor: colorShades.c800,
      borderColorHover: colorShades.c900,
      borderColorActive: colorShades.c900
    };
  } else {
    definitions = {
      borderColor: colorShades.c600,
      borderColorHover: colorShades.c600,
      borderColorActive: colorShades.c900
    };
  }

  return definitions;
};

const getColors = (colorSchema, bgStyle) => {
  bgStyle = getBgStyle(bgStyle);
  colorSchema = UU5.Environment.colorSchemaMap[colorSchema].color;
  let colorShades = getShades(colorSchema);

  if (!colorSchema || colorSchema === "custom") {
    return null;
  } else if (colorSchema === "default") {
    return getDefaultColors(colorShades, bgStyle);
  } else if (colorSchema === "white") {
    return getWhiteColors(colorShades, bgStyle);
  } else if (colorSchema === "black") {
    return getBlackColors(colorShades, bgStyle);
  } else if (colorSchema === "grey" || colorSchema === "grey-rich") {
    return getGreyColors(colorShades, bgStyle);
  } else if (colorSchema.match(/\w+-rich/)) {
    return getRichColors(colorShades, bgStyle);
  } else {
    return getStandardColors(colorShades, bgStyle);
  }
};

const getBgStyle = bgStyle => {
  if (["filled", "outline", "transparent", "underline", "link"].indexOf(bgStyle)) {
    return bgStyle;
  } else if (bgStyle === "inverted") {
    return "outline";
  } else {
    return "filled";
  }
};

const getShades = colorSchema => {
  // get the most commonly used shades of the given colorSchema
  if (colorSchema === "default" || colorSchema === "grey" || !colorSchema) {
    return UU5.Environment.colors["grey"];
  } else {
    return UU5.Environment.colors[colorSchema.replace(/-rich/, "")];
  }
};

export default { getColors, getBgStyle };
