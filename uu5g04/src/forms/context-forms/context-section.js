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
    `
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
  ...UU5.Bricks.Section.propTypes
};
ContextSection.defaultProps = {};
