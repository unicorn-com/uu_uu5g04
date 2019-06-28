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

import createEmotion from 'create-emotion';

const getCss = key => {
  const context = typeof global !== 'undefined' ? global : {};

  if (context[key] === undefined) {
    context[key] = {}
  }

  // The key option is required when there will be multiple instances in a single app
  let emotion = createEmotion(context[key], { key });

  /* set production behavior to emotions */
  // emotion.sheet.isSpeedy = true;

  return {
    css: emotion.css,
    injectGlobal: emotion.injectGlobal,
    keyframes: emotion.keyframes
  };
};

export const Css = {
  ...getCss("uu"),

  createCssModule(key) {
    this[key] = getCss(key);
    return this[key];
  }
};

export default Css;
