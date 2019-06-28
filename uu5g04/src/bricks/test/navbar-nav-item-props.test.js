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
import {shallow, mount} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";
import createReactClass from "create-react-class";


const MyNavBarNavItemHandler = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onClickAlert(event) {
    alert("You have been clicked to NavBar.Nav.Item");
    this.setState({isCalled: true})
  },

  render() {
    return (
      <UU5.Bricks.NavBar colorSchema="primary">
        <UU5.Bricks.NavBar.Nav>
          <UU5.Bricks.NavBar.Nav.Item onClick={this.onClickAlert}>
            onClick
          </UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
  }
});


const TagName = "UU5.Bricks.NavBar.Nav.Item";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    //onClick
  },
  requiredProps: {
    parent: shallow(
      <UU5.Bricks.NavBar.Nav
        id="parentId"
        parent={shallow(<UU5.Bricks.NavBar id="parentId2"/>).instance()}
      />
    ).instance()
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true
    },
    enzymeToJson: false
  }
};


describe(`${TagName} props`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe(`${TagName} props.Function`, () => {

  it(`${TagName} -  onClick() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyNavBarNavItemHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.find('nav-bar-nav-item').simulate('click');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('You have been clicked to NavBar.Nav.Item');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You have been clicked to NavBar.Nav.Item");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});


describe(`${TagName} Mixin Props control values of props`, () => {

  it('Make snapshot with shallow', () => {
    const wrapper = shallow(
      <UU5.Bricks.NavBar colorSchema="primary" id={"uuID01"}>
        <UU5.Bricks.NavBar.Nav id={"uuID02"}>
          <UU5.Bricks.NavBar.Nav.Item
            id={"uuID03"}
            name={"Item name"}
            tooltip={"Item tooltip"}
            className="Item className"
            style={{fontSize: "20px", color: "red"}}
            mainAttrs={{style: {backgroundColor: "black"}}}
            noIndex={true}
          >
            <UU5.Bricks.Icon id={"uuID04"} icon="mdi-home"/>Home</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} BaseMixinProps`, () => {
    const wrapper = mount(
      <UU5.Bricks.NavBar colorSchema="primary" id={"uuID01"}>
        <UU5.Bricks.NavBar.Nav id={"uuID02"}>
          <UU5.Bricks.NavBar.Nav.Item
            id={"uuID03"}
            name={"Item name"}
            tooltip={"Item tooltip"}
            className="Item className"
            style={{fontSize: "20px", color: "red"}}
            mainAttrs={{style: {backgroundColor: "black"}}}
            noIndex={true}
          >
            <UU5.Bricks.Icon id={"uuID04"} icon="mdi-home"/>Home</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper.find('nav-bar-nav-item').instance().props.id).toEqual("uuID03");
    expect(wrapper.find('nav-bar-nav-item').instance().props.name).toEqual("Item name");
    expect(wrapper.find('nav-bar-nav-item').instance().props.tooltip).toEqual("Item tooltip");
    expect(wrapper.find('nav-bar-nav-item').instance().props.className).toEqual("Item className");
    expect(wrapper.find('nav-bar-nav-item').instance().props.style).toEqual(expect.objectContaining({
      fontSize: '20px',
      color: 'red'
    }));
    expect(wrapper.find('nav-bar-nav-item').instance().props.mainAttrs).toEqual(expect.objectContaining({"style": {"backgroundColor": "black"}}));
    expect(wrapper.find('nav-bar-nav-item').instance().props.noIndex).toBeTruthy();
  });

  it(`${TagName} Elementary Mixin Props`, () => {
    const wrapper = mount(
      <UU5.Bricks.NavBar colorSchema="primary" id={"uuID01"}>
        <UU5.Bricks.NavBar.Nav id={"uuID02"}>
          <UU5.Bricks.NavBar.Nav.Item
            id={"uuID03"}
            hidden={true}
            disabled={true}
            selected={true}
            controlled={false}
          >
            <UU5.Bricks.Icon id={"uuID04"} icon="mdi-home"/>Home</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper.find('nav-bar-nav-item').instance().props.hidden).toBeTruthy();
    expect(wrapper.find('nav-bar-nav-item').instance().props.disabled).toBeTruthy();
    expect(wrapper.find('nav-bar-nav-item').instance().props.selected).toBeTruthy();
    expect(wrapper.find('nav-bar-nav-item').instance().props.controlled).toBeFalsy();
  });

  it(`${TagName} Content And PureRender Mixins props`, () => {
    const wrapper = mount(
      <UU5.Bricks.NavBar colorSchema="primary" id={"uuID01"}>
        <UU5.Bricks.NavBar.Nav id={"uuID02"}>
          <UU5.Bricks.NavBar.Nav.Item
            id={"uuID03"}
            content={"Text of content from mixin"}
            ignoreInnerHTML={true}
            checkSpaces={true}
            checkGrammar={true}
            checkHighlight={true}
            textCorrector={true}
            dynamic={true}
            mode={"outline"}
            pureRender={true}
          >
            <UU5.Bricks.Icon id={"uuID04"} icon="mdi-home"/>Home</UU5.Bricks.NavBar.Nav.Item>
        </UU5.Bricks.NavBar.Nav>
      </UU5.Bricks.NavBar>
    );
    expect(wrapper.find('nav-bar-nav-item').instance().props.content).toEqual("Text of content from mixin");
    expect(wrapper.find('nav-bar-nav-item').instance().props.ignoreInnerHTML).toBeTruthy();
    expect(wrapper.find('nav-bar-nav-item').instance().props.checkSpaces).toBeTruthy();
    expect(wrapper.find('nav-bar-nav-item').instance().props.checkGrammar).toBeTruthy();
    expect(wrapper.find('nav-bar-nav-item').instance().props.checkHighlight).toBeTruthy();
    expect(wrapper.find('nav-bar-nav-item').instance().props.textCorrector).toBeTruthy();
    expect(wrapper.find('nav-bar-nav-item').instance().props.dynamic).toBeTruthy();
    expect(wrapper.find('nav-bar-nav-item').instance().props.mode).toEqual("outline");
    expect(wrapper.find('nav-bar-nav-item').instance().props.pureRender).toBeTruthy();
  });


});

