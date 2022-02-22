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
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    parameters: {
      values: [{ example: "some" }],
    },
    numbered: {
      values: [true, false],
    },
    trimmed: {
      values: [true, false],
    },
    blockKey: {
      values: ["Key"],
    },
    blockStart: {
      values: ["@@myBlockOn:"],
    },
    blockEnd: {
      values: ["@@myBlockOff:"],
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.FileViewer`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.FileViewer, CONFIG);

  it("Default values detailed", () => {
    const wrapper = shallow(
      <UU5.Bricks.FileViewer id={"FV"} src="https://cdn.plus4u.net/libs/roboto/1.0.0/roboto.css" />
    );
    //here is save default values
    expect(wrapper).toMatchSnapshot();
  });
});
