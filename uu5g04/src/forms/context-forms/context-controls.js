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
    `
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
  align: UU5.PropTypes.oneOf(["left", "center", "right"])
};
ContextControls.defaultProps = {
  align: "right"
};

export default ContextControls;
