import Environment from "../environment/environment";

export const ColorSchema = {
  _SCHEMA_TO_GDS_MAP: {
    primary: "primary",
    success: "positive",
    info: "important",
    warning: "warning",
    danger: "negative",
    yellow: "yellow",
    orange: "orange",
    pink: "pink",
    red: "red",
    purple: "purple",
    cyan: "cyan",
    blue: "blue",
    green: "green",
    brown: "brown",
    amber: "yellow",
    "deep-orange": "orange",
    "deep-purple": "dark-purple",
    indigo: "dark-blue",
    teal: "dark-green",
    "light-green": "light-green",
    "light-blue": "light-blue",
    lime: "yellow",
    "blue-grey": "steel",
    grey: "normal",
    black: "black",
    white: "white",
  },

  getClassName(colorSchema) {
    let result = colorSchema ? "color-schema-" + colorSchema : "";
    if (result) {
      let usedColorSchema = Environment.getColorSchema(colorSchema);
      if (usedColorSchema && usedColorSchema !== colorSchema) result = "color-schema-" + usedColorSchema + " " + result;
    }
    return result;
  },

  // NOTE Used also in uu_plus4u5g02 for converting colorSchema-s of g04 Alert-s.
  _toGdsColorScheme(colorSchema) {
    return ColorSchema._SCHEMA_TO_GDS_MAP[colorSchema?.replace(/-rich$/, "")];
  },
};
export default ColorSchema;
