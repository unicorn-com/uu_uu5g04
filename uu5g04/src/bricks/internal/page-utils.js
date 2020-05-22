import UU5 from "uu5g04";

let disabledBodyScrollings = {};

export function enableBodyScrolling(key, skipRestoreScrollTop = false) {
  let wasActive = Object.keys(disabledBodyScrollings).length === 0;
  let bodyScrollY = disabledBodyScrollings[key];
  delete disabledBodyScrollings[key];
  let isActive = Object.keys(disabledBodyScrollings).length === 0;
  if (!wasActive && isActive) {
    if (document.body.style.overflow) document.body.style.overflow = "";
    if (document.documentElement.style.overflow) document.documentElement.style.overflow = "";
    if (!skipRestoreScrollTop && typeof bodyScrollY === "number") {
      document.documentElement.scrollTop = bodyScrollY;
      document.body.scrollTop = bodyScrollY;
    }
    if (document.body.style.paddingRight) document.body.style.paddingRight = "";

    document.documentElement.classList.remove("uu5-common-no-scroll");
  }
}

export function disableBodyScrolling(key) {
  let wasActive = Object.keys(disabledBodyScrollings).length === 0;
  let bodyScrollY = window.scrollY || document.body.scrollTop || window.pageYOffset;
  disabledBodyScrollings[key] = bodyScrollY;
  if (wasActive) {
    document.body.style.overflow = "hidden";
    // this breaks scroll position on MS Edge
    if (UU5.Common.Tools.isMobileIOS()) {
      document.documentElement.style.overflow = "hidden";
    }
    if (document.body.scrollTop !== bodyScrollY) document.body.scrollTop = bodyScrollY;
    if (UU5.Common.Tools.getDocumentHeight() > window.innerHeight) {
      let paddingRight = UU5.Environment.getScrollBarWidth();
      if (paddingRight) document.body.style.paddingRight = paddingRight + "px";
    }

    document.documentElement.classList.add("uu5-common-no-scroll");
  }
}
