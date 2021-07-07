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
import ns from "../forms-ns.js";

import { ContextFormConsumer } from "./context.js";
import Controls from "../controls";
import Css from "./css.js";
//@@viewOff:imports

export const ContextControls = UU5.Common.Reference.forward(({ align, className, ...props }, ref) => {
  let classNames = [
    Css.css`
      text-align: ${align};

      & > .uu5-bricks-button {
        margin: 0;

        & + .uu5-bricks-button {
          margin-left: 8px;
        }
      }
    `,
  ];
  if (className) classNames.push(className);

  return (
    <ContextFormConsumer>
      {({ getForm }) => <Controls {...props} getForm={getForm} ref_={ref} className={classNames.join(" ")} />}
    </ContextFormConsumer>
  );
});

ContextControls.displayName = ContextControls.tagName = ns.name("ContextControls");
ContextControls.propTypes = {
  ...Controls.propTypes,
  align: UU5.PropTypes.oneOf(["left", "center", "right"]),
};
ContextControls.defaultProps = {
  align: "right",
};

export default ContextControls;
