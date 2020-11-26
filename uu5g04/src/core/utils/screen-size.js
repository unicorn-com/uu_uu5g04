import { Utils } from "uu5g05";

const g05ScreenSize = Utils.ScreenSize;

const XS = g05ScreenSize.XS;
const S = g05ScreenSize.S;
const M = g05ScreenSize.M;
const L = g05ScreenSize.L;
const XL = g05ScreenSize.XL;

class ScreenSize {
  static XS = XS;
  static S = S;
  static M = M;
  static L = L;
  static XL = XL;

  static SIZE_MAP = g05ScreenSize._SIZE_MAP;

  static countSize(width = window.innerWidth) {
    return g05ScreenSize.countSize(width);
  }

  static register(listener) {
    return g05ScreenSize._register(listener);
  }

  static unregister(listener) {
    return g05ScreenSize._unregister(listener);
  }

  static setSize(event, screenSize) {
    return g05ScreenSize._setSize(event, screenSize);
  }

  static getSize() {
    return g05ScreenSize.getSize();
  }

  static splitColumns(colWidth) {
    return g05ScreenSize.parseValue(colWidth);
  }

  static getMediaQueries(screenSize, inner) {
    let result;

    switch (screenSize.toLowerCase()) {
      case "xs":
        result = `@media screen and (max-width: ${this.XS}px) {
  ${inner}
}`;
        break;
      case "s":
        result = `@media screen and (min-width: ${this.XS + 1}px) and (max-width: ${this.S}px) {
  ${inner}
}`;
        break;
      case "m":
        result = `@media screen and (min-width: ${this.S + 1}px) and (max-width: ${this.M}px) {
  ${inner}
}`;
        break;
      case "l":
        result = `@media screen and (min-width: ${this.M + 1}px) and (max-width: ${this.L}px) {
  ${inner}
}`;
        break;
      case "xl":
        result = `@media screen and (min-width: ${this.L + 1}px) {
  ${inner}
}`;
        break;
    }

    return result;
  }

  static getMinMediaQueries(screenSize, inner) {
    let result;

    switch (screenSize.toLowerCase()) {
      case "xs":
        result = inner;
        break;
      case "s":
        result = `@media screen and (min-width: ${this.XS + 1}px) {
  ${inner}
}`;
        break;
      case "m":
        result = `@media screen and (min-width: ${this.S + 1}px) {
  ${inner}
}`;
        break;
      case "l":
        result = `@media screen and (min-width: ${this.M + 1}px) {
  ${inner}
}`;
        break;
      case "xl":
        result = `@media screen and (min-width: ${this.L + 1}px) {
  ${inner}
}`;
        break;
    }

    return result;
  }

  static getMaxMediaQueries(screenSize, inner) {
    let result;

    switch (screenSize.toLowerCase()) {
      case "xs":
        result = `@media screen and (max-width: ${this.XS}px) {
  ${inner}
}`;
        break;
      case "s":
        result = `@media screen and (max-width: ${this.S}px) {
  ${inner}
}`;
        break;
      case "m":
        result = `@media screen and (max-width: ${this.M}px) {
  ${inner}
}`;
        break;
      case "l":
        result = `@media screen and (max-width: ${this.L}px) {
  ${inner}
}`;
        break;
      case "xl":
        result = inner;
        break;
    }

    return result;
  }
}

// backward compatibility
ScreenSize.splitColumns = ScreenSize.parseValue;

export { ScreenSize };
export default ScreenSize;
