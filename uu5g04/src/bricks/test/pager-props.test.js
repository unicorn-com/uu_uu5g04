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
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    leftLink: {
      values: [{ href: "#leftlink", text: "Předchozí článek", icon: "uu5-plus" }],
    },
    rightLink: {
      values: [{ href: "#rightlink", text: "Další článek", icon: "uu5-plus" }],
    },
    upLink: {
      values: [{ href: "#uplink", text: "Nahoru", icon: "uu5-plus" }],
    },
    downLink: {
      values: [{ href: "#downlink", text: "Dolů", icon: "uu5-plus" }],
    },
    background: {
      values: [true, false],
    },
    size: {
      values: ["s", "m", "l", "xl"],
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Pager`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Pager, CONFIG);
});

describe(`UU5.Bricks.Pager docKit examples`, () => {
  it(`UU5.Bricks.Pager should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.Column id={"uuID2"} level="3" colWidth="xs12 s4 m4" header="Links">
          <UU5.Bricks.Pager id={"uuID3"} leftLink={{ href: "#", text: "previous", icon: "mdi-arrow-left" }} />
          <UU5.Bricks.Pager id={"uuID4"} rightLink={{ href: "#", text: "next", icon: "mdi-arrow-right" }} />
          <UU5.Bricks.Pager id={"uuID5"} upLink={{ href: "#", text: "up", icon: "mdi-arrow-up" }} />
          <UU5.Bricks.Pager id={"uuID6"} downLink={{ href: "#", text: "down", icon: "mdi-arrow-down" }} />
        </UU5.Bricks.Column>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
