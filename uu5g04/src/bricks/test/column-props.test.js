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
    "UU5.Common.PureRenderMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
  ],
  props: {
    width: {
      values: ["200px", "30%", "10em", 200],
    },
    colWidth: {
      values: ["xs6 s6 m4 l3 xl3", "xs-6 s-6 m-4 l-3 xl-3", { xs: 6, s: 6, m: 4, l: 3, xl: 3 }],
    },
    noSpacing: {
      values: [true, false],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Row id={"parentID"}></UU5.Bricks.Row>).instance(),
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const This = {};

describe(`UU5.Bricks.Column`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Column, CONFIG);
});

describe(`UU5.Bricks.Column is wrapped in UU5.Bricks.Row`, () => {
  it("column is set with width", () => {
    const wrapper = shallow(
      <UU5.Bricks.Row id={"uuID01"}>
        <UU5.Bricks.Column id={"uuID02"} width="20%" style="backgroundColor: yellow">
          <UU5.Bricks.P id={"uuID03"}>20% Column</UU5.Bricks.P>
        </UU5.Bricks.Column>
        <UU5.Bricks.Column id={"uuID04"} width="200px" style="backgroundColor: orange">
          <UU5.Bricks.P id={"uuID05"}>100px Column</UU5.Bricks.P>
        </UU5.Bricks.Column>
        <UU5.Bricks.Column id={"uuID06"} width="10em" style="backgroundColor: red">
          <UU5.Bricks.P id={"uuID07"}>10em Column</UU5.Bricks.P>
        </UU5.Bricks.Column>
        <UU5.Bricks.Column id={"uuID08"} width="10cm" style="backgroundColor: pink">
          <UU5.Bricks.P id={"uuID09"}>10cm Column</UU5.Bricks.P>
        </UU5.Bricks.Column>
      </UU5.Bricks.Row>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Bootsrap grid", () => {
    const wrapper = shallow(
      <UU5.Bricks.Row id={"uuID01"}>
        <UU5.Bricks.Column id={"uuID02"} colWidth="xs12 s3" style="backgroundColor: yellow">
          <UU5.Bricks.P id={"uuID03"}>xs12 s3</UU5.Bricks.P>
        </UU5.Bricks.Column>
        <UU5.Bricks.Column id={"uuID04"} colWidth="xs12 s3" style="backgroundColor: orange">
          <UU5.Bricks.P id={"uuID05"}>xs12 s3</UU5.Bricks.P>
        </UU5.Bricks.Column>
        <UU5.Bricks.Column id={"uuID06"} colWidth="xs12 s3" style="backgroundColor: red">
          <UU5.Bricks.P id={"uuID07"}> xs12 s3</UU5.Bricks.P>
        </UU5.Bricks.Column>
        <UU5.Bricks.Column id={"uuID08"} colWidth="xs12 s3" style="backgroundColor: pink">
          <UU5.Bricks.P id={"uuID09"}>xs12 s3</UU5.Bricks.P>
        </UU5.Bricks.Column>
      </UU5.Bricks.Row>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
