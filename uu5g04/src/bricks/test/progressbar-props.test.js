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

const MyAllowTagsComponents = createReactClass({
  mixins: [UU5.Common.BaseMixin],
  statics: {tagName: "UU5.Example.MyCompButton", classNames: {main: "mytr"}},
  render() {
    return (
      <UU5.Example.MyCompButton {...this.getMainPropsToPass()}/>
    );
  }
});



const TagName = "UU5.Bricks.ProgressBar";

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
    progress: {
      values: [0,50,100]
    },
   striped: {
     values: [true, false]
   },
    animated: {
      values: [true, false]
    },
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"]
    },
    size: {
      values: ["s", "m", "l", "xl"]
    }
  },
  requiredProps: {
    children: [<UU5.Bricks.ProgressBar.Item id={"childID"} progress={25} striped colorSchema="blue"/>]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true
    },
    enzymeToJson: true
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);

  it(`${TagName} - props.Allowtags is used in example`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ProgressBar id={"uuID"} allowTags={["UU5.Example.MyCompButton"]}>
        <UU5.Bricks.ProgressBar.Item id={"uuIDitems"} progress={20} colorSchema="blue"/>
        <MyAllowTagsComponents id={"allowID"} content={"I am allowTags component"}/>
      </UU5.Bricks.ProgressBar>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});


describe(`${TagName} docKit examples`, () => {

  it(`${TagName} should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.ProgressBar id={"uuID1"} progress={40} />
        <UU5.Bricks.ProgressBar id={"uuID2"} progress={60} striped />
        <UU5.Bricks.ProgressBar id={"uuID3"} progress={85} animated />
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});










