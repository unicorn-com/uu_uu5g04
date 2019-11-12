/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

const Color = {};

export const parseColorFromString = stringValue => {
  let result = { opacity: 100, r: 0, g: 0, b: 0 };
  if (stringValue[0] === "#") {
    // parse value from #123 or #112233
    result.opacity = 100;
    switch (stringValue.length) {
      case 4:
        result.r = parseInt(stringValue[1] + stringValue[1], 16);
        result.g = parseInt(stringValue[2] + stringValue[2], 16);
        result.b = parseInt(stringValue[3] + stringValue[3], 16);
        break;
      case 7:
        result.r = parseInt(stringValue[1] + stringValue[2], 16);
        result.g = parseInt(stringValue[3] + stringValue[4], 16);
        result.b = parseInt(stringValue[5] + stringValue[6], 16);
        break;
      default:
        // error
        throw "Unsupported value format " + stringValue;
    }
  } else {
    // parse value from rgb(255, 255, 255) or rgba(255, 255, 255)
    let rgbParts = stringValue.match(
      /^(rgba?)\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*,?\s*([0-9]*\.?[0-9]*)\s*\)$/
    );
    if (rgbParts) {
      if (rgbParts[1] === "rgba") {
        result.opacity = Math.floor(parseFloat(rgbParts[5]) * 100);
      }
      result.r = parseInt(rgbParts[2]);
      result.g = parseInt(rgbParts[3]);
      result.b = parseInt(rgbParts[4]);
    } else {
      // error
      throw "Unsupported value format " + stringValue;
    }
  }

  // validate correct values
  if (isNaN(result.opacity) || result.opacity > 100 || result.opacity < 0) {
    // error
    throw "Unsupported opacity value in " + stringValue;
  }

  for (let color in result) {
    if (color === "opacity") continue;
    let value = result[color];
    if (isNaN(value) || value < 0 || value > 255) {
      // error
      throw "Unsupported color value format " + stringValue;
    }
  }

  return result;
};

export const colorObjectToString = (valueObj, opts = { shorten: true, upperCase: false }) => {
  // value validation
  if (typeof valueObj !== "object" || !Color.getValid(valueObj)) {
    // error;
    throw "Unsupported value type or invalid value\n" + JSON.stringify(valueObj, null, 2);
  }

  let result;

  if (valueObj.opacity === 100) {
    let redString = new Number(valueObj.r).toString(16);
    let greenString = new Number(valueObj.g).toString(16);
    let blueString = new Number(valueObj.b).toString(16);

    // add leading 0 char if missing
    if (redString.length === 1) redString = "0" + redString;
    if (greenString.length === 1) greenString = "0" + greenString;
    if (blueString.length === 1) blueString = "0" + blueString;

    // check if all numbers is not from same characters to use shorten string
    if (
      opts.shorten &&
      redString[0] === redString[1] &&
      greenString[0] === greenString[1] &&
      blueString[0] === blueString[1]
    ) {
      redString = redString[0];
      greenString = greenString[0];
      blueString = blueString[0];
    }

    result = "#" + redString + greenString + blueString;

    if (opts.upperCase) {
      result = result.toUpperCase();
    }
  } else {
    result = `rgba( ${valueObj.r}, ${valueObj.g}, ${valueObj.b}, ${valueObj.opacity / 100})`;
  }

  return result;
};

const validateColorString = stringValue => {
  if (!stringValue) return false;
  let result;
  try {
    result = Color.parse(stringValue) && stringValue;
  } catch (e) {
    result = false;
  }

  return result;
};

const validateColorObject = valueObj => {
  if (!valueObj) return false;
  let result = valueObj;
  if (valueObj.opacity > 100 || valueObj.opacity < 0) {
    // error
    result = false;
  }
  if (valueObj.r < 0 || valueObj.r > 255 || valueObj.b < 0 || valueObj.b > 255 || valueObj.g < 0 || valueObj.g > 255) {
    // error
    result = false;
  }

  return result;
};

// returns false if value is not a valid color otherwise returns valid value
const getValidColor = value => {
  return typeof value === "string" ? validateColorString(value) : validateColorObject(value);
};

const getValidColorString = (value, opts) => {
  if (typeof value === "string") {
    return Color.getValid(value);
  } else {
    try {
      return Color.toString(value, opts);
    } catch (e) {
      return "";
    }
  }
};

const getValidColorObject = value => {
  if (typeof value === "string") {
    try {
      return Color.parse(value);
    } catch (e) {
      return null;
    }
  } else {
    return Color.getValid(value);
  }
};

Color.parse = parseColorFromString;
Color.toString = colorObjectToString;
Color.getValid = getValidColor;
Color.getValidString = getValidColorString;
Color.getValidObject = getValidColorObject;

export default Color;
