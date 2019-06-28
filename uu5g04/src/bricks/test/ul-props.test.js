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
import renderer from 'react-test-renderer';
import createReactClass from "create-react-class";

const MyAllowTagsComponents = createReactClass({
  mixins: [UU5.Common.BaseMixin],
  statics: {tagName: "UU5.Example.MyCompLi", classNames: {main: "mytr"}},
  render() {
    return (
      <UU5.Example.MyCompLi {...this.getMainPropsToPass()}/>
    );
  }
});


const TagName = "UU5.Bricks.Ul";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin"
  ],
  props: {
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompLi"]
    },
    type: {
      values: ["disc", "square", "circle"]
    }
  },
  requiredProps: {},
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

describe(`${TagName} AllowTagsComponent`, () => {

  it(`${TagName} props - allowTags`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Ul id={"uuID02"} allowTags={["UU5.Example.MyCompLi"]}>
        <UU5.Bricks.Li id={"uuID03"} content="Buy milk"/>
        <MyAllowTagsComponents id={"alloid"} content={"allow tags content"}/>
      </UU5.Bricks.Ul>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});


describe(`${TagName} docKit examples`, () => {

  it(`${TagName} should render without crash`, () => {
    const wrapper = renderer.create(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Ul id={"uuID02"}>
          <UU5.Bricks.Li id={"uuID03"} content="Buy milk"/>
        </UU5.Bricks.Ul>
        <UU5.Bricks.Ul id={"uuID04"} type="square">
          <UU5.Bricks.Li id={"uuID05"} content="Buy milk"/>
        </UU5.Bricks.Ul>
        <UU5.Bricks.Ul id={"uuID06"} type="circle">
          <UU5.Bricks.Li id={"uuID07"} content="Buy milk"/>
        </UU5.Bricks.Ul>
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});










