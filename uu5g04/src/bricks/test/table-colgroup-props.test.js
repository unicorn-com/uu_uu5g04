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
import createReactClass from "create-react-class";

const MyColumnComponent = createReactClass({
  mixins: [UU5.Common.BaseMixin],

  statics: {tagName: "UU5.Example.MyColumnComponent", classNames: {main: "mytr"}},

  render() {
    return (
      <UU5.Example.MyColumnComponent {...this.getMainPropsToPass()} span={1} colorSchema="purple-rich"/>
    );
  }

});


const TagName = "UU5.Bricks.Table.ColGroup";

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
    allowTags: {
      allowTagsArray: ["UU5.Example.MyColumnComponent"]
    },
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


  it('props-allowTags', () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header='Table' id={"uuID01"}>
        {/*@@viewOn:0*/}
        <UU5.Bricks.Table.ColGroup id={"uuID02"}>
          <UU5.Bricks.Table.Col id={"uuID03"}/>
          <MyColumnComponent id={"allowID"}/>
        </UU5.Bricks.Table.ColGroup>
        {/*@@viewOff:0*/}
        <UU5.Bricks.Table.THead id={"uuID04"}>
          <UU5.Bricks.Table.Tr id={"uuID05"}>
            <UU5.Bricks.Table.Th id={"uuID06"} content='Name'/>
            <UU5.Bricks.Table.Th id={"uuID07"} content='Rank'/>
            <UU5.Bricks.Table.Th id={"uuID08"} content='Promotion prospects'/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>
      </UU5.Bricks.Table>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});


describe(`${TagName} docKit examples`, () => {

  it('props-allowTags', () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header='Table' footer='Table footer' id={"uuID1"}>
        <UU5.Bricks.Table.ColGroup id={"uuIDGroup"} allowTags={["UU5.Example.MyColumnComponent"]}>
          <MyColumnComponent id={"myIDs"}/>
          <UU5.Bricks.Table.Col id={"uuIDlast"} span={2} colorSchema="red"/>
        </UU5.Bricks.Table.ColGroup>
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content='Name' id={"uuID4"}/>
            <UU5.Bricks.Table.Th content='Rank' id={"uuID5"}/>
            <UU5.Bricks.Table.Th content='Promotion prospects' id={"uuID5"}/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>
      </UU5.Bricks.Table>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});










