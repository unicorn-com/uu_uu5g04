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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.ColorSchemaMixin",
  ],
  props: {
    position: {
      values: ["10px -50px", "6em 30%"],
    },
    draggable: {
      values: [true, false],
    },
    borderRadius: {
      values: ["4px", "8px"],
    },
    elevation: {
      values: ["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5],
    },
    bgStyle: {
      values: ["filled", "outline", "transparent", "underline"],
    },
    width: {
      values: [200, "500px"],
    },
    header: {
      values: ["floating-box", "some-text"],
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

describe(`UU5.Bricks.FloatingBox props`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.FloatingBox, CONFIG);
});
