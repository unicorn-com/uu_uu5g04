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
    "UU5.Common.ContentMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    infoHeader: {
      values: ["Text in header in Box"],
    },
    infoContent: {
      values: ["Text in opened modal window"],
    },
    disableClick: {
      values: [true, false],
    },
  },
  requiredProps: {},
  opt: {},
};

describe(`UU5.Bricks.Box`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Box, CONFIG);
});

describe(`UU5.Bricks.Box example from docKit`, () => {
  it(`UU5.Bricks.Box in The box are Icon and Span`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Box
        id={"uuID"}
        colorSchema="primary"
        infoHeader="This is infoHeader from the Box"
        infoContent="This is infoContent from the box"
      >
        <UU5.Bricks.Icon id={"uuID2"} />
        <UU5.Bricks.Span id={"uuID3"} content=" CLICK ME! Box with infoHeader/infoContent " />
      </UU5.Bricks.Box>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
