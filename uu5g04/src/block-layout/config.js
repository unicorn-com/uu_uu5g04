import UU5 from "uu5g04";
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

export const TAG = "UU5.BlockLayout.";

UU5.Common.Css.createCssModule("uublocklayout");
export const css = UU5.Common.Css.uublocklayout.css;

const normalFont = () => css`
  color: rgba(0, 0, 0, 0.87);
`;

export const Font = {
  normal: normalFont,
  primary: () => css`
    ${normalFont()}
    font-weight: bold;
  `,
  secondary: () => css`
    &&:not([class*="color-schema-"]) {
      color: rgba(0, 0, 0, 0.54);
    }
  `,
  sizeS: () => css`
    font-size: 0.8em;
  `
};

export default {
  TAG,
  css,
  Font
};
