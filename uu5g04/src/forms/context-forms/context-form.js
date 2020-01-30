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
import Form from "../form.js";
import Css from "./css.js";
//@@viewOff:imports

export const ContextForm = UU5.Common.Reference.forward(({ className, ...props }, ref) => {
  const classNames = [
    Css.css`
      padding: 0 !important;
      
      & > .uu5-bricks-alert-bus {
        position: relative;
        background-color: ${UU5.Environment.colors.grey.c100};
        box-shadow: none;
        transform: none;
        left: initial;
        
        &.uu5-common-hidden {
          margin: 0;
          padding: 0;
        }
        
        &.uu5-bricks-alert-without-header .uu5-bricks-alert-content {
          padding: 16px;
          
          /* just for IE */
          @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
            width: 100%;
          }
        }
      }

      & > .uu5-bricks-row {
        margin-left: -8px;
        margin-right: -8px;

        .uu5-forms-input {
          margin-bottom: 0;
          text-align:left;
        }
      }
      
      /* FIXME bug in UU5.RichText */
      .uu5-richtext-toolbar-button > .uu5-forms-iconpicker.uu5-richtext-toolbar-iconpicker,
      .uu5-richtext-toolbar-dropdown-button > .uu5-forms-iconpicker.uu5-richtext-toolbar-iconpicker,
      .uu5-forms-iconpicker .uu5-forms-iconpicker-header .uu5-forms-iconpicker-search-input {
        margin: 0;
      }
    `
  ];
  if (className) classNames.push(className);

  return (
    <ContextFormConsumer>
      {({ setForm }) => (
        <Form
          {...props}
          ref={ref}
          ref_={form => {
            setForm(form);
            typeof props.ref_ === "function" && props.ref_(form);
          }}
          className={classNames.join(" ")}
          spacing={props.spacing}
        />
      )}
    </ContextFormConsumer>
  );
});

ContextForm.displayName = ContextForm.tagName = ns.name("ContextForm");
ContextForm.propTypes = {
  ...Form.propTypes
};
ContextForm.defaultProps = {
  ...Form.getDefaultProps(),
  labelColWidth: "xs-12",
  inputColWidth: "xs-12",
  spacing: 16
};
