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

//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "../forms-ns.js";

import { ContextFormProvider } from "./context.js";
import Css from "./css.js";
//@@viewOff:imports

const sideOffset = 40;
const sideOffsetMobile = 16;
const topOffset = 8;
const bottomOffset = 32;

export const ContextModal = UU5.Common.Reference.forward(({ className, ...props }, ref) => {
  const classNames = [
    Css.css`
      & .uu5-bricks-modal-header {
        font-size: 18px;
        border-bottom: 1px solid rgba(0,0,0,.12);
      }

      & .uu5-bricks-modal-body {
        background: none;
        padding: ${topOffset}px ${sideOffsetMobile}px ${bottomOffset}px;
        ${UU5.Utils.ScreenSize.getMinMediaQueries("m", `padding: ${topOffset}px ${sideOffset}px ${bottomOffset}px;`)}

        .uu5-forms-form > .uu5-bricks-alert-bus {
          margin: -${topOffset}px 0px 24px -${sideOffsetMobile}px;
          ${UU5.Utils.ScreenSize.getMinMediaQueries("m", `margin: -${topOffset}px 0px 24px -${sideOffset}px;`)}
          width: 0;
          min-width: calc(100% + ${2 * sideOffsetMobile}px);
          ${UU5.Utils.ScreenSize.getMinMediaQueries("m", `min-width: calc(100% + ${2 * sideOffset}px);`)}

          &.uu5-bricks-alert-without-header .uu5-bricks-alert-content {
            padding: 16px;
            ${UU5.Utils.ScreenSize.getMinMediaQueries("m", `padding: 16px ${sideOffset}px;`)}

            /** just for IE **/
            @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
              width: 100%;
            }
          }
        }
      }

      & .uu5-bricks-modal-footer {
        border-top: 1px solid rgba(0,0,0,.12);
        padding: 8px 16px;
        ${UU5.Utils.ScreenSize.getMinMediaQueries("m", `padding: 8px 40px;`)}

        & > .uu5-forms-controls {
          padding: 0;
        }
      }
    `,
  ];
  if (className) classNames.push(className);

  return (
    <ContextFormProvider>
      <UU5.Bricks.Modal {...props} location="portal" ref={ref} className={classNames.join(" ")} />
    </ContextFormProvider>
  );
});

ContextModal.displayName = ContextModal.tagName = ns.name("ContextModal");
ContextModal.propTypes = {
  ...UU5.Bricks.Modal.propTypes,
};
ContextModal.defaultProps = {};

export default ContextModal;
