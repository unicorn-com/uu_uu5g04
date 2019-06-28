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

const TagName = "UU5.Bricks.NavBar.Nav";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    aligned:  {
      values: ["left", "right"]
    },
    smoothScroll: {
      values: [3000]
    },
    offset: {
      values: [70]
    },
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"]
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.NavBar id="parentId"/>).instance(),
    children: [
      <UU5.Bricks.NavBar.Nav.Item id={"child02"}>News</UU5.Bricks.NavBar.Nav.Item>
    ]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: true
  }
};

const This = {};


describe(`${TagName} props`, () => {

  TestTools.testProperties(TagName, CONFIG);

  it('UU5.Bricks.NavBar.Nav - props.AllowTags', () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID"} colorSchema="primary">
        <UU5.Bricks.NavBar.Header id={"uuID2"} content="aligned='right'"/>
        <UU5.Bricks.NavBar.Nav id={"uuID3"} allowTags={["UU5.Example.MyCompButton"]}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID4"}>
            <UU5.Bricks.Icon
              id={"uuID5"}
              icon="mdi-home"
            />
            Home
          </UU5.Bricks.NavBar.Nav.Item>
          <MyAllowTagsComponents id={"allowID"} content={"allowTags Content"}/>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});


describe(`${TagName} docKit example`, () => {

  it(`${TagName} example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID"} colorSchema="primary">
        <UU5.Bricks.NavBar.Header id={"uuID2"} content="aligned='right'"/>
        <UU5.Bricks.NavBar.Nav id={"uuID3"}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID4"}><UU5.Bricks.Icon id={"uuID5"} icon="mdi-home" />Home</UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID6"}>
            <UU5.Bricks.Icon icon="mdi-newspaper" id={"uuID7"} />News
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID8"}>
            <UU5.Bricks.Icon id={"uuID9"} icon="mdi-account" />MyProfile
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID10"}>
            <UU5.Bricks.Icon id={"uuID11"} icon="mdi-logout" style={{ color: "red" }} />LogOut
          </UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} example02`, () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar id={"uuID"} colorSchema="primary">
        <UU5.Bricks.NavBar.Header id={"uuID2"} content="aligned='right'"/>
        <UU5.Bricks.NavBar.Nav id={"uuID3"} aligned="right" smoothScroll={3000} offset={70}>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID4"}><UU5.Bricks.Icon id={"uuID5"} icon="mdi-home" />Home</UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID6"}>
            <UU5.Bricks.Icon icon="mdi-newspaper" id={"uuID7"} />News
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID8"}>
            <UU5.Bricks.Icon id={"uuID9"} icon="mdi-account" />MyProfile
          </UU5.Bricks.NavBar.Nav.Item>
          <UU5.Bricks.NavBar.Nav.Item id={"uuID10"}>
            <UU5.Bricks.Icon id={"uuID11"} icon="mdi-logout" style={{ color: "red" }} />LogOut
          </UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});

