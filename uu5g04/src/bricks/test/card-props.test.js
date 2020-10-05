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
    "UU5.Common.SectionMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
  ],
  props: {
    elevation: {
      values: ["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5],
    },
    elevationHover: {
      values: ["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5],
    },
    inline: {
      values: [true, false],
    },
    width: {
      values: [500, 800],
    },
    minWidth: {
      values: [300, 450],
    },
    noSpaces: {
      values: [true, false],
    },
  },
  requiredProps: {},
  opt: {},
};

describe(`UU5.Bricks.Card props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Card, CONFIG);
});

describe(`UU5.Bricks.Card docKit example should render`, () => {
  it(`UU5.Bricks.Card contains touchIcons`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Card id={"uuID"} style="paddingLeft:6px; backgroundColor:#FF5A51" header="Card">
        <UU5.Bricks.TouchIcon id={"uuID2"} content="Click" />
        <UU5.Bricks.TouchIcon id={"uuID3"} content="Click" />
        <UU5.Bricks.TouchIcon id={"uuID4"} content="Click" />
      </UU5.Bricks.Card>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
