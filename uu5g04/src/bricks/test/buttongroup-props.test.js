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

/**
 * This is a created component for the Allow Tags test.
 * It is tested that a self-created component can be inserted into the buttonGroup under its own brand.
 */
const MyAllowTagsComponents = createReactClass({
  mixins: [UU5.Common.BaseMixin],
  statics: {tagName: "UU5.Example.MyCompButton", classNames: {main: "mytr"}},
  render() {
    return (
      <UU5.Example.MyCompButton {...this.getMainPropsToPass()}/>
    );
  }
});

const TagName = "UU5.Bricks.ButtonGroup";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    size: {
      values: ["s", "m", "l", "xl"]
    },
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"]
    },
    vertical: {
      values: [true, false]
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"]
    }
  },
  requiredProps: {},
  opt: {
    enzymeToJson: false
  }
};



describe(`${TagName} props testing`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe(`${TagName} docKit example - contain another components`, () => {

  it(`${TagName} packaging another component`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonGroup id={"uuID"} size="s">
        <UU5.Bricks.Button id={"uuID2"} content="Home"/>
        <UU5.Bricks.Dropdown id={"uuID3"} content="Dropdown"/>
      </UU5.Bricks.ButtonGroup>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it(`${TagName} Component from allow tags is used in example`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonGroup id={"uuID"} size="s" allowTags={["UU5.Example.MyCompButton"]}>
        <MyAllowTagsComponents tooltip={"This is my allowTags Component"} id={"myAllowTagsID"}/>
        <UU5.Bricks.Button id={"uuID2"} content="Home"/>
        <UU5.Bricks.Dropdown id={"uuID3"} content="Dropdown"/>
      </UU5.Bricks.ButtonGroup>
    );
    expect(wrapper).toMatchSnapshot();
  });


});


