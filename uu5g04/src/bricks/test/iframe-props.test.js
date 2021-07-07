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
    src: {
      values: ["https://plus4u.net/"],
    },
    resize: {
      values: [true, false],
    },
    height: {
      values: ["400", "40em"],
    },
    syncTimeout: {
      values: [3],
      // make snapshots without waiting for timeout (to see that iframe is not present initially)
      opt: { wait: false },
    },
    inline: {
      values: [true, false],
    },
    iframeAttrs: {
      values: [{ name: "reactName" }],
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Iframe`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Iframe, CONFIG);
});

describe(`UU5.Bricks.Iframe docKit examples`, () => {
  it(`UU5.Bricks.Iframe example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.Column id={"uuID2"} colWidth="s6">
          <UU5.Bricks.Iframe id={"uuID3"} />
        </UU5.Bricks.Column>
        <UU5.Bricks.Column id={"uuID4"} colWidth="s6">
          <UU5.Bricks.Iframe id={"uuID5"} src="https://plus4u.net" />
        </UU5.Bricks.Column>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
