export class Style {
  static parse(styleString) {
    let obj = {};
    let properties = styleString.split(";");

    properties.forEach(item => {
      let keysAndValues = item.split(":");
      if (keysAndValues.length > 1) {
        obj[keysAndValues[0].trim()] = keysAndValues[1].trim();
      }
    });

    return obj;
  }

  static joinClassName(...classNames) {
    return classNames.filter(v => v).join(" ");
  }
}

export default Style;
