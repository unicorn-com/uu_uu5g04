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
    src: "https://cdn.plus4u.net/libs/clearsans/1.0.0/fonts/clear-sans.css",
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
      <UU5.Bricks.FileViewer id={"FV"} src="https://cdn.plus4u.net/libs/clearsans/1.0.0/fonts/clear-sans.css" />
    );
    //here is save default values
    expect(wrapper).toMatchSnapshot();
  });
});
