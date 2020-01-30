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

import createEmotion from "create-emotion";

// 1. Follow uu_appg01_devkit's rules for style elements insertion to ensure proper
//    style order (.less styles are less specific than emotion CSS - this is handled
//    by devkit for .less styles; both must be before [data-uu-app-styles-insert-before]
//    element or at the end of the <head>).
// 2. Ensure that the target insertion element is computed at the time of createCssModule()
//    call - this is ensured by createEmotion() itself. (If it was computed later, e.g. during
//    first CSS class computation, then some other library B which depends on this one could
//    have already inserted its own <style> tag and it would be before ours - we want initial
//    style order among libraries to be based on topological sort of the dependency tree.)
// 3. Emotion styles created later can be inserted into new <style> elements (this is behaviour
//    of emotion itself). Ensure that these new <style> elements stick together with the initial
//    <style> element. This fixes wrong order e.g. in case of lazy component and an emotion
//    class from a library that depends on the one with the lazy component.
function getStylePseudoContainer(key, owner) {
  function insertStyleElement(styleEl) {
    let insertionEl = document.head || document.body;

    if (owner) styleEl.setAttribute("data-owner", owner);
    styleEl.setAttribute("data-emotion", key);
    styleEl.setAttribute("data-tech", "emotion");

    // insert the style element
    // 1. after last matching data-emotion element
    let els = insertionEl.querySelectorAll(`style[data-emotion="${key}"]`);
    if (els.length > 0) {
      let el = els[els.length - 1];
      el.parentNode.insertBefore(styleEl, el.nextSibling);
      return;
    }

    if (owner) {
      // 2. after last matching data-owner (this keeps multiple emotion CSS modules
      //    within 1 built file together)
      els = insertionEl.querySelectorAll(`style[data-owner="${owner}"]`);
      if (els.length > 0) {
        let el = els[els.length - 1];
        el.parentNode.insertBefore(styleEl, el.nextSibling);
        return;
      }
    }

    // 3. before element with data-uu-app-styles-insert-before attribute
    let el = document.querySelector("[data-uu-app-styles-insert-before]");
    if (el) {
      el.parentNode.insertBefore(styleEl, el);
      return;
    }

    // 4. at the end of <head> or <body>
    insertionEl.appendChild(styleEl);
  }

  return {
    appendChild: insertStyleElement,
    insertBefore: insertStyleElement,
    insertAfter: insertStyleElement
  };
}

const getCss = (key, owner) => {
  const context = typeof global !== "undefined" ? global : {};

  if (context[key] === undefined) {
    context[key] = {};
  }

  // The key option is required when there will be multiple instances in a single app
  let emotion = createEmotion(context[key], { key, container: getStylePseudoContainer(key, owner) });

  /* set production behavior to emotions */
  emotion.sheet.isSpeedy = true;

  return {
    css: emotion.css,
    injectGlobal: emotion.injectGlobal,
    keyframes: emotion.keyframes
  };
};

export const Css = {
  ...getCss("uu"),

  createCssModule(key, owner = null) {
    this[key] = getCss(key, owner);
    return this[key];
  }
};

export default Css;
