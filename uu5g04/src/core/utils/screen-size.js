import EventManager from "./event-manager";
import Context from "../common/context";

const XS = 480;
const S = 768;
const M = 992;
const L = 1360;
const XL = Infinity;

class ScreenSize {
  static XS = XS;
  static S = S;
  static M = M;
  static L = L;
  static XL = XL;

  static SIZE_MAP = {
    xs: XS,
    s: S,
    m: M,
    l: L,
    xl: XL,
  };

  static countSize(width = window.innerWidth) {
    let result;

    if (width <= this.XS) {
      result = "xs";
    } else if (width <= this.S) {
      result = "s";
    } else if (width <= this.M) {
      result = "m";
    } else if (width <= this.L) {
      result = "l";
    } else {
      result = "xl";
    }

    return result;
  }

  static register(listener) {
    return EventManager.register("screenSize", listener);
  }

  static unregister(listener) {
    return EventManager.unregister("screenSize", listener);
  }

  static setSize(event, screenSize) {
    if (actualScreenSize !== screenSize) {
      actualScreenSize = screenSize;
      EventManager.trigger("screenSize", event, screenSize);
    }
  }

  static getSize() {
    return actualScreenSize;
  }

  static parseValue(value) {
    let result;

    // parse value
    if (typeof value === "object") {
      result = value;
    } else if (typeof value === "string") {
      result = {};
      value.split(" ").forEach((item) => {
        let parts = item.match(/^([^-]+)-(.*)$/);
        if (parts) {
          result[parts[1]] = parts[2];
        }
      });
    } else {
      return { xs: value };
    }

    // filter all non screen size keys from result
    let _result = {};
    result = Object.keys(result)
      .filter((key) => this.SIZE_MAP[key])
      .forEach((key) => (_result[key] = result[key]));
    result = _result;

    // check if result contains some key - if not original value was only string with - and it is not screen size value
    if (!Object.keys(result).length) {
      result = { xs: value };
    }

    return result;
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

// slightly "hide" this as we need it only for proper interoperability of ScreenSizeMixin and
// hooks ScreenSizeProvider
const ScreenSizeContext = Context.create(null);
Object.defineProperty(ScreenSize, "Context", {
  value: ScreenSizeContext,
  enumerable: false,
});

let actualScreenSize = ScreenSize.countSize();
const resizeFn = (e) => ScreenSize.setSize(e, ScreenSize.countSize());

window.addEventListener("resize", resizeFn);
window.addEventListener("orientationchange", resizeFn);

export { ScreenSize };
export default ScreenSize;
