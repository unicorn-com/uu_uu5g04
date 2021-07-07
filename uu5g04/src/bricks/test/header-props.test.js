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
    "UU5.Common.LevelMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    underline: {
      values: [true, false],
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const This = {};

describe(`UU5.Bricks.Header`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Header, CONFIG);
});

describe(`UU5.Bricks.Header docKit examples`, () => {
  it(`UU5.Bricks.Header should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID07"}>
        <UU5.Bricks.Header id={"uuID01"} level="0" content="Header - Level 0" />
        <UU5.Bricks.Header id={"uuID02"} level="1" content="Header - Level 1" />
        <UU5.Bricks.Header id={"uuID03"} level="2" content="Header - Level 2" />
        <UU5.Bricks.Header id={"uuID04"} level="3" content="Header - Level 3" />
        <UU5.Bricks.Header id={"uuID05"} level="4" content="Header - Level 4" />
        <UU5.Bricks.Header id={"uuID06"} level="5" content="Header - Level 5" />
        <UU5.Bricks.Header id={"uuID07"} level="6" content="Header - Level 6" />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Header should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Header id={"uuID02"} level="0" content="Header - Level 0" underline={true} />
        <UU5.Bricks.Header id={"uuID03"} level="1" content="Header - Level 1" underline={true} />
        <UU5.Bricks.Header id={"uuID04"} level="2" content="Header - Level 2" underline={true} />
        <UU5.Bricks.Header id={"uuID05"} level="3" content="Header - Level 3" underline={true} />
        <UU5.Bricks.Header id={"uuID06"} level="4" content="Header - Level 4" underline={true} />
        <UU5.Bricks.Header id={"uuID07"} level="5" content="Header - Level 5" underline={true} />
        <UU5.Bricks.Header id={"uuID08"} level="6" content="Header - Level 6" underline={true} />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
