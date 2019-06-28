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

import React from 'react';
import {shallow} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";

const TagName = "UU5.Bricks.Table.Col";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    span: {
      values:[1,2]
    },
  },
  requiredProps: {
    parent: shallow(
      <UU5.Bricks.Table.ColGroup id="parentIdColGroup" parent={
        shallow(<UU5.Bricks.Table id="parentId"/>).instance()
      } />
    ).instance()
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: false
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});


describe(`${TagName} docKit examples`, () => {

  it(`${TagName} should render without crash`, () => {

    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Table id={"uuID"} header='Table'>
          {/*@@viewOn:0*/}
          <UU5.Bricks.Table.ColGroup id={"uuID02"}>
            <UU5.Bricks.Table.Col id={"uuID03"} span={1} colorSchema="blue"/>
            <UU5.Bricks.Table.Col id={"uuID04"} span={2} colorSchema="red"/>
          </UU5.Bricks.Table.ColGroup>
          {/*@@viewOff:0*/}
          <UU5.Bricks.Table.THead id={"uuID05"}>
            <UU5.Bricks.Table.Tr id={"uuID06"}>
              <UU5.Bricks.Table.Th id={"uuID07"} content='Name'/>
              <UU5.Bricks.Table.Th id={"uuID08"} content='Rank'/>
              <UU5.Bricks.Table.Th id={"uuID09"} content='Promotion prospects'/>
            </UU5.Bricks.Table.Tr>
          </UU5.Bricks.Table.THead>
          <UU5.Bricks.Table.TBody id={"uuID010"}>
            <UU5.Bricks.Table.Tr id={"uuID011"}>
              <UU5.Bricks.Table.Td id={"uuID012"} content='Rimmer'/>
              <UU5.Bricks.Table.Td id={"uuID013"} content='2nd class technician'/>
              <UU5.Bricks.Table.Td id={"uuID014"} content='comical'/>
            </UU5.Bricks.Table.Tr>
          </UU5.Bricks.Table.TBody>
        </UU5.Bricks.Table>
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});










