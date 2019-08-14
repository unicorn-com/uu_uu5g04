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

const TagName = "UU5.Bricks.ButtonSwitch";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    size: {
      values: ["s", "m", "l", "xl"]
    },
    switchedOn: {
      values: [true, false]
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"]
    },
    props: {
      values: [{size: "s"}]
    },
    onProps: {
      values: [{colorSchema: "success", pressed: true}]
    },
    offProps: {
      values: [{colorSchema: "danger", pressed: false}]
    },
  },
  requiredProps: {},
  opt: {
    enzymeToJson: true
  }
};


describe(`${TagName} props testing`, () => {
  TestTools.testProperties(TagName, CONFIG);

  const This = {};

  it(`${TagName} with combination of props, onProps, onProps`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"switchID"}
        ref_={item => This._buttonSwitch = item}
        props={{
          onClick: () => This._buttonSwitch.toggle(),
          content: "props content"
        }}
        onProps={{
          content: "onProps content"
        }}
        offProps={{
          content: "offProps content"
        }}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    wrapper.simulate("click");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  //If I click to buttonSwitch the content turned off button it turns to turned on
  it(`${TagName} with onClick`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"switchID"}
        ref_={item => This._buttonSwitch = item}
        props={{
          onClick: () => This._buttonSwitch.toggle()
        }}
        onProps={{
          colorSchema: "default",
          content: "turned on"
        }}
        offProps={{
          content: "turned off"
        }}
      />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    wrapper.simulate('click');
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});
