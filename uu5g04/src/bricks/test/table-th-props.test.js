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
    "UU5.Common.ContentMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    colSpan: {
      values: ["3", 3]
    },
    rowSpan: {
      values: [3, "3"]
    }
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Table id="parentId" />).instance()
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.Table.Th`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Table.Th, CONFIG);
});

describe(`UU5.Bricks.Table.Th docKit examples`, () => {
  it(`UU5.Bricks.Table.Th should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Table id={"uuID2"} header="Table">
        {/*@@viewOn:0*/}
        <UU5.Bricks.Table.THead id={"uuIDA"} colorSchema="danger">
          <UU5.Bricks.Table.Tr id={"uuIDB"}>
            <UU5.Bricks.Table.Th id={"uuIDA1"} colSpan={"3"} rowSpan={3} content="Name" />
            <UU5.Bricks.Table.Th id={"uuIDA2"} colSpan={3} rowSpan={"3"} content="Rank" />
            <UU5.Bricks.Table.Th id={"uuIDA3"} content="Promotion prospects" />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>
        {/*@@viewOff:0*/}
        <UU5.Bricks.Table.TBody id={"uuIDA4"}>
          <UU5.Bricks.Table.Tr id={"uuIDA5"}>
            <UU5.Bricks.Table.Td id={"uuIDA6"} content="Rimmer" />
            <UU5.Bricks.Table.Td id={"uuIDA7"} content="2nd class technician" />
            <UU5.Bricks.Table.Td id={"uuIDA8"} content="comical" />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
