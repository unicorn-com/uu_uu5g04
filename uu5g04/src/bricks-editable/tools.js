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

import * as UU5 from "uu5g04";

export const Tools = {
  iconDocLink:
    "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=icons",

  getState(defaultProps, nextProps, customFunction) {
    let props = UU5.Common.Tools.mergeDeep({ props: defaultProps }).props;
    let editablePropsValues = Tools._getEditablePropsValues(defaultProps, nextProps);
    let inputObject = {};
    let content, contentEditable;

    props.forEach((item) => {
      let name = item.name;
      let currentValue = editablePropsValues[name];

      item.value = currentValue !== undefined ? currentValue : item.value;
      if (name === "content") {
        content = item;
        let hasContent = editablePropsValues.content !== null && editablePropsValues.content !== undefined;
        item.name = hasContent ? "content" : "children";
        item.label = "Content";
        item.value = hasContent ? editablePropsValues.content : editablePropsValues.children;
        item.props = item.props || {};
        item.props.ref_ = (input) => (inputObject.input = input);
      } else if (name === "contentEditable") {
        contentEditable = item;
        item.props = item.props ? item.props : {};
        item.props.onChange = (opt) => {
          opt.component.setValue(opt.value);
          if (inputObject.input) {
            opt.value ? inputObject.input.disable() : inputObject.input.enable();
          }
        };
      }

      if (item.type == "uu5json") {
        item.props = item.props || {};
        item.props.valueFormat = "object";
      }

      if (typeof customFunction === "function") {
        customFunction(item, currentValue);
      }

      return item;
    });

    if (contentEditable && content && contentEditable.value) {
      content.props.disabled = true;
    }

    return props;
  },

  _getEditablePropsValues(defaultProps, props) {
    let editableProps = defaultProps.map((item) => item.name);

    if (editableProps.indexOf("content") > -1) {
      editableProps = editableProps.concat(["children"]);
    }
    return props.component.getEditablePropsValues(editableProps);
  },
};

export default Tools;
