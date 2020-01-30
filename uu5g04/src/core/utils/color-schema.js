import Environment from "../environment/environment";

export const ColorSchema = {
  getClassName(colorSchema) {
    let result = colorSchema ? "color-schema-" + colorSchema : "";
    if (result) {
      let usedColorSchema = Environment.getColorSchema(colorSchema);
      if (usedColorSchema && usedColorSchema !== colorSchema) result = "color-schema-" + usedColorSchema + " " + result;
    }
    return result;
  }
};
export default ColorSchema;
