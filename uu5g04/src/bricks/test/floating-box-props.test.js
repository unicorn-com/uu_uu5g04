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

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin", "UU5.Common.ContentMixin", "UU5.Common.ColorSchemaMixin"],
  props: {
    position: {
      values: ["10px -50px", "6em 30%"]
    },
    draggable: {
      values: [true, false]
    },
    borderRadius: {
      values: ["4px", "8px"]
    },
    elevation: {
      values: ["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5]
    },
    bgStyle: {
      values: ["filled", "outline", "transparent", "underline"]
    },
    width: {
      values: [200, "500px"]
    },
    header: {
      values: ["floating-box", "some-text"]
    }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true
    }
  }
};

describe(`UU5.Bricks.FloatingBox props`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.FloatingBox, CONFIG);
});
