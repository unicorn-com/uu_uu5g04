import UU5 from "uu5g04";
/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

export const TAG = "UU5.BlockLayout.";

export const css = UU5.Common.Css.createCssModule("uublocklayout").css;

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
  `,
};

export default {
  TAG,
  css,
  Font,
};
