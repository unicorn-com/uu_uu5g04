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
    "UU5.Common.SectionMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    noSpacing: {
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

describe(`UU5.Bricks.Container`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Container, CONFIG);
});

describe(`UU5.Bricks.Container contains other component`, () => {
  it(`UU5.Bricks.Container containt Paragraph and noSpacing is true -> should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"} header="noSpacing={true}" noSpacing>
        <UU5.Bricks.Paragraph id={"uuID02"} />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Container containt Paragraph and noSpacing is false -> should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"} header="noSpacing={false}" noSpacing={false}>
        <UU5.Bricks.Paragraph id={"uuID02"} />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Container containt Row and Columns -> should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"} header="Container - header">
        <UU5.Bricks.Row id={"uuID02"}>
          <UU5.Bricks.Column id={"uuID03"} colWidth="xs12 m4">
            <UU5.Bricks.Paragraph />
          </UU5.Bricks.Column>
          <UU5.Bricks.Column id={"uuID04"} colWidth="xs12 m4">
            <UU5.Bricks.Paragraph />
          </UU5.Bricks.Column>
          <UU5.Bricks.Column id={"uuID05"} colWidth="xs12 m4">
            <UU5.Bricks.Paragraph />
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
