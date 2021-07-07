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

export const ContextSection = UU5.Common.Reference.forward(({ className, ...props }, ref) => {
  const classNames = [
    Css.css`
      & > .uu5-bricks-header {
        display: flex;
        align-items: center;
      }

      & .uu5-forms-controls {
        padding: 32px 0 20px;
      }
    `,
  ];
  if (className) classNames.push(className);

  return (
    <ContextFormProvider>
      <UU5.Bricks.Section {...props} ref={ref} className={classNames.join(" ")} />
    </ContextFormProvider>
  );
});

ContextSection.displayName = ContextSection.tagName = ns.name("ContextSection");
ContextSection.propTypes = {
  ...UU5.Bricks.Section.propTypes,
};
ContextSection.defaultProps = {};
