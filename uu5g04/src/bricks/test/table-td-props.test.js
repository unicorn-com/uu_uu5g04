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
import TestTools from "../../core/test/test-tools.js";
import renderer from 'react-test-renderer';

const TagName = "UU5.Bricks.Table.Td";

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
      values:["3", 3]
    },
    rowSpan: {
      values:[3, "3"]
    }
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Table id="parentId"/>).instance()
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
    const wrapper = renderer.create(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.Table id={"uuID2"}>
          {/*@@viewOn:0*/}
          <UU5.Bricks.Table.TBody colorSchema="blue">
            <UU5.Bricks.Table.Tr>
              <UU5.Bricks.Table.Td colSpan={3} rowSpan={"3"} content='Rimmer' />
              <UU5.Bricks.Table.Td colSpan={3} rowSpan={"3"} content='2nd class technician' />
              <UU5.Bricks.Table.Td colSpan={3} rowSpan={"3"} content='comical' />
            </UU5.Bricks.Table.Tr>
            <UU5.Bricks.Table.Tr>
              <UU5.Bricks.Table.Td colSpan={"3"} rowSpan={3} content='Dave Lister' />
              <UU5.Bricks.Table.Td colSpan={"3"} rowSpan={3} content='3rd class technician' />
              <UU5.Bricks.Table.Td colSpan={"3"} rowSpan={3} content='zero' />
            </UU5.Bricks.Table.Tr>
            <UU5.Bricks.Table.Tr>
              <UU5.Bricks.Table.Td content='Kristine Kochanski' />
              <UU5.Bricks.Table.Td content='1st console officer' />
              <UU5.Bricks.Table.Td content='high' />
            </UU5.Bricks.Table.Tr>
          </UU5.Bricks.Table.TBody>
          {/*@@viewOff:0*/}
        </UU5.Bricks.Table>
      </UU5.Bricks.Container>
    ).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});










