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
import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const availableTags = [
  { value: "Prg", content: { cs: "Praha", en: "Prague" } },
  { value: "Plzeň" },
  { value: "Brno", content: <div>Brno</div> },
  { value: "Ostrava", colorSchema: "red" },
  { value: "Liberec", colorSchema: "red", bgStyle: "filled" },
];

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin", "UU5.Common.LsiMixin", "UU5.Forms.InputMixin"],
  props: {
    value: {
      values: [undefined, ["Prg"], ["Brno", "Ostrava", "Liberec"]],
    },
    size: {
      values: ["s", "m", "l", "xl"],
    },
    bgStyle: {
      values: [undefined, "outline", "underline", "filled", "transparent"],
    },
    elevation: {
      values: [undefined, 1, 5, -1],
    },
    borderRadius: {
      values: [undefined, 8, "50%"],
    },
  },
  requiredProps: {
    availableTags,
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Forms.TagSelect props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.TagSelect, CONFIG);
});
