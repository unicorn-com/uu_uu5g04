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


const TagName = "UU5.Bricks.Table";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    striped: {
      values:[true, false]
    },
    bordered: {
      values:[true, false]
    },
    hover: {
      values:[true, false]
    },
    condensed: {
      values:[true, false]
    },
    responsive: {
      values: [true, false]
    },
    allowTags: {
      allowTagsArray: ["UU5.Example.MyColumnComponent"]
    },

  },
  requiredProps: {
    children: [
      <UU5.Bricks.Table.Tr id={"child01"}>
        <UU5.Bricks.Table.Td id={"child02"} content='Rimmer'/>
      </UU5.Bricks.Table.Tr>
    ]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: true
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe('UU5.Bricks.Table - docKitExamples', () => {

  it('props-allowTags', () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header='Table' footer='Table footer' allowTags={["UU5.Example.MyColumnComponent"]} id={"uuID1"}>
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content='Name' id={"uuID4"}/>
            <UU5.Bricks.Table.Th content='Rank' id={"uuID5"}/>
            <UU5.Bricks.Table.Th content='Promotion prospects' id={"uuID5"}/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>

        <UU5.Bricks.Table.TBody id={"uuID6"}>
          <UU5.Bricks.Table.Tr id={"uuID7"}>
            <UU5.Bricks.Table.Td content='Rimmer' id={"uuID8"}/>
            <UU5.Bricks.Table.Td content='2nd class technician' id={"uuID8"}/>
            <UU5.Bricks.Table.Td content='comical' id={"uuID9"}/>
          </UU5.Bricks.Table.Tr>
          <UU5.Bricks.Table.Tr id={"uuID10"}>
            <MyColumnComponent id={"allowID"} span={1} colorSchema="blue"/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('props-striped/Bordered', () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header='Table' footer='Table footer' allowBodyTags={["UU5.Example.MyColumnComponent"]}
                        id={"uuID1"}
                        striped={true} bordered={true}>
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content='Name' id={"uuID4"}/>
            <UU5.Bricks.Table.Th content='Rank' id={"uuID5"}/>
            <UU5.Bricks.Table.Th content='Promotion prospects' id={"uuID5"}/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>

        <UU5.Bricks.Table.TBody id={"uuID6"}>
          <UU5.Bricks.Table.Tr id={"uuID7"}>
            <UU5.Bricks.Table.Td content='Rimmer' id={"uuID8"}/>
            <UU5.Bricks.Table.Td content='2nd class technician' id={"uuID8"}/>
            <UU5.Bricks.Table.Td content='comical' id={"uuID9"}/>
          </UU5.Bricks.Table.Tr>
          <UU5.Bricks.Table.Tr id={"uuID10"}>
            <MyColumnComponent id={"allowID"} span={1} colorSchema="blue"/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('props-hover/Conseded', () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header='Table' footer='Table footer' allowBodyTags={["UU5.Example.MyColumnComponent"]}
                        id={"uuID1"}
                        hover={true} consended={true}>
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content='Name' id={"uuID4"}/>
            <UU5.Bricks.Table.Th content='Rank' id={"uuID5"}/>
            <UU5.Bricks.Table.Th content='Promotion prospects' id={"uuID5"}/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>

        <UU5.Bricks.Table.TBody id={"uuID6"}>
          <UU5.Bricks.Table.Tr id={"uuID7"}>
            <UU5.Bricks.Table.Td content='Rimmer' id={"uuID8"}/>
            <UU5.Bricks.Table.Td content='2nd class technician' id={"uuID8"}/>
            <UU5.Bricks.Table.Td content='comical' id={"uuID9"}/>
          </UU5.Bricks.Table.Tr>
          <UU5.Bricks.Table.Tr id={"uuID10"}>
            <MyColumnComponent id={"allowID"} span={1} colorSchema="blue"/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it('props-responsive', () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header='Table' footer='Table footer' allowBodyTags={["UU5.Example.MyColumnComponent"]}
                        id={"uuID1"}
                        responsive={true}>
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content='Name' id={"uuID4"}/>
            <UU5.Bricks.Table.Th content='Rank' id={"uuID5"}/>
            <UU5.Bricks.Table.Th content='Promotion prospects' id={"uuID5"}/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>

        <UU5.Bricks.Table.TBody id={"uuID6"}>
          <UU5.Bricks.Table.Tr id={"uuID7"}>
            <UU5.Bricks.Table.Td content='Rimmer' id={"uuID8"}/>
            <UU5.Bricks.Table.Td content='2nd class technician' id={"uuID8"}/>
            <UU5.Bricks.Table.Td content='comical' id={"uuID9"}/>
          </UU5.Bricks.Table.Tr>
          <UU5.Bricks.Table.Tr id={"uuID10"}>
            <MyColumnComponent id={"allowID"} span={1} colorSchema="blue"/>
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});












