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
    span: {
      values: [1, 2],
    },
  },
  requiredProps: {
    parent: shallow(
      <UU5.Bricks.Table.ColGroup
        id="parentIdColGroup"
        parent={shallow(<UU5.Bricks.Table id="parentId" />).instance()}
      />
    ).instance(),
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Table.Col`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Table.Col, CONFIG);
});

describe(`UU5.Bricks.Table.Col docKit examples`, () => {
  it(`UU5.Bricks.Table.Col should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Table id={"uuID"} header="Table">
          {/*@@viewOn:0*/}
          <UU5.Bricks.Table.ColGroup id={"uuID02"}>
            <UU5.Bricks.Table.Col id={"uuID03"} span={1} colorSchema="blue" />
            <UU5.Bricks.Table.Col id={"uuID04"} span={2} colorSchema="red" />
          </UU5.Bricks.Table.ColGroup>
          {/*@@viewOff:0*/}
          <UU5.Bricks.Table.THead id={"uuID05"}>
            <UU5.Bricks.Table.Tr id={"uuID06"}>
              <UU5.Bricks.Table.Th id={"uuID07"} content="Name" />
              <UU5.Bricks.Table.Th id={"uuID08"} content="Rank" />
              <UU5.Bricks.Table.Th id={"uuID09"} content="Promotion prospects" />
            </UU5.Bricks.Table.Tr>
          </UU5.Bricks.Table.THead>
          <UU5.Bricks.Table.TBody id={"uuID010"}>
            <UU5.Bricks.Table.Tr id={"uuID011"}>
              <UU5.Bricks.Table.Td id={"uuID012"} content="Rimmer" />
              <UU5.Bricks.Table.Td id={"uuID013"} content="2nd class technician" />
              <UU5.Bricks.Table.Td id={"uuID014"} content="comical" />
            </UU5.Bricks.Table.Tr>
          </UU5.Bricks.Table.TBody>
        </UU5.Bricks.Table>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
