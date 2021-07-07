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
    "UU5.Common.SectionMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.CcrWriterMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    // NOTE Skipping because controlled/hidden/shown doesn't work properly with each other and there's
    // hard to estimate how to change it without breaking compatibility.
    shown: {
      values: [true, false],
      opt: {
        skip: true,
      },
    },
    parentElement: {
      values: [this],
    },
  },
  requiredProps: {
    children: [<UU5.Bricks.Button key={"childrenKey"} id={"childID"} content={"I am button in pop over"} />],
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Popover`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Popover, CONFIG);
});
