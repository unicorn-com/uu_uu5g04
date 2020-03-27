import ListenerRegistry from "./internal/listener-registry";

const XS = 480;
const S = 768;
const M = 992;
const L = 1360;
const XL = Infinity;

const LISTENER_REGISTRY = new ListenerRegistry();

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
    xl: XL
  };

  static countSize(element = window) {
    let result;
    let screenWidth = element.innerWidth || element.clientWidth;

    if (screenWidth <= this.XS) {
      result = "xs";
    } else if (screenWidth <= this.S) {
      result = "s";
    } else if (screenWidth <= this.M) {
      result = "m";
    } else if (screenWidth <= this.L) {
      result = "l";
    } else {
      result = "xl";
    }

    return result;
  }

  static register(listener) {
    return LISTENER_REGISTRY.register(listener);
  }

  static unregister(listener) {
    return LISTENER_REGISTRY.unregister(listener);
  }

  static setSize(event, screenSize) {
    if (actualScreenSize !== screenSize) {
      actualScreenSize = screenSize;
      LISTENER_REGISTRY.run(event, screenSize);
    }
  }

  static getSize() {
    return actualScreenSize;
  }

  static splitColumns(colWidth) {
    let result = {};
    colWidth.split(" ").forEach(item => {
      let splitter = item.split("-");
      result[splitter[0]] = splitter[1];
    });
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
    }

    return result;
  }
}

let actualScreenSize = ScreenSize.countSize();
const resizeFn = e => ScreenSize.setSize(e, ScreenSize.countSize());

window.addEventListener("resize", resizeFn);
window.addEventListener("orientationchange", resizeFn);

export { ScreenSize };
export default ScreenSize;
