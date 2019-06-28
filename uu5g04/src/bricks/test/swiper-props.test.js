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

const MySwipperHandler = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onSwipeOpenLeftMenuHandler(event) {
    alert("onSwipeOpenLeftMenu have been called.");
    this.setState({isCalled: true})
  },

  onSwipeCloseLeftMenuHandler(event) {
    alert("onSwipeCloseLeftMenu have been called.");
    this.setState({isCalled: true})
  },

  onSwipeOpenRightMenuHandler(event) {
    alert("onSwipeOpenRightMenu have been called.");
    this.setState({isCalled: true})
  },

  onSwipeCloseRightMenuHandler(event) {
    alert("onSwipeCloseRightMenu have been called.");
    this.setState({isCalled: true})
  },


  render() {
    return (
      <UU5.Bricks.Swiper
        id={"uuID"}
        onSwipeCloseRightMenu={this.onSwipeCloseRightMenuHandler}
        onSwipeOpenRightMenu={this.onSwipeOpenRightMenuHandler}
        onSwipeCloseLeftMenu={this.onSwipeCloseLeftMenuHandler}
        onSwipeOpenLeftMenu={this.onSwipeOpenLeftMenuHandler}
        onWip
        style={{
          backgroundColor: "lightblue",
          minHeight: "200px",
          width: "100%"
        }}
      />
    );
  }
});

//`${TagName}`

const TagName = "UU5.Bricks.Swiper";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.SwipeMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    leftMenuOpen: {
      values: [true, false]
    },
    rightMenuOpen: {
      values: [true, false]
    },
    //onSwipeOpenLeftMenu
    //onSwipeCloseLeftMenu
    //onSwipeOpenRightMenu
    //onSwipeCloseRightMenu
    allowBodyTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"]
    },
    allowMenuTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"]
    }
  },
  requiredProps: {
    children: [
      <UU5.Bricks.Swiper.Body id={"childBody"}>
        <UU5.Bricks.P id={"idP"} className="center">
          On touch screen you can open menus by swipe on blue area. If you dont have touchscreen, turn on
          console(chrome - F12) and switch to mobile device view by pressing icon at top left corner of the
          console or by pressing ctrl+shift+M.
        </UU5.Bricks.P>
      </UU5.Bricks.Swiper.Body>
    ]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true
    },
    enzymeToJson: false
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);

  it('AllowMenuTags + AllowBodyTags example', () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper
        id={"uuID"}
        allowBodyTags={["UU5.Example.MyCompButton"]}
        allowmenuTags={["UU5.Example.MyCompButton"]}
      >
        <UU5.Bricks.Swiper.Menu id={"uuID4"}>
          <MyAllowTagsComponents id={"allowID"} content={"allow tags component"}/>
        </UU5.Bricks.Swiper.Menu>

        <UU5.Bricks.Swiper.Body id={"uuID6"}>
          <MyAllowTagsComponents id={"allowID2"} content={"allow tags component2"}/>
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});

describe(`${TagName} props.Function`, () => {

  it(`${TagName} -  onSwipeOpenLeftMenu() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MySwipperHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('swipeOpenLeftMenu');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onSwipeOpenLeftMenu have been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onSwipeOpenLeftMenu have been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} -  onSwipeCloseLeftMenu() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MySwipperHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('swipeCloseLeftMenu');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onSwipeCloseLeftMenu have been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onSwipeCloseLeftMenu have been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} -  onSwipeOpenRightMenu() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MySwipperHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('swipeOpenRightMenu');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onSwipeOpenRightMenu have been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onSwipeOpenRightMenu have been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} -  onSwipeCloseRightMenu() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MySwipperHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('swipeCloseRightMenu');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onSwipeCloseRightMenu have been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onSwipeCloseRightMenu have been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


});


describe(`${TagName} docKit examples`, () => {

  it(`${TagName} example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper
        id={"uuID"}
        style={{
          backgroundColor: "lightblue",
          minHeight: "200px",
          width: "100%"

        }}
      >
        <UU5.Bricks.Swiper.Menu id={"uuID2"} style={{backgroundColor: "lightgrey"}}>
          <UU5.Bricks.Button id={"uuID3"} content="Close"/>
        </UU5.Bricks.Swiper.Menu>

        <UU5.Bricks.Swiper.Menu id={"uuID4"} pullRight style={{backgroundColor: "lightgrey"}}>
          <UU5.Bricks.Button id={"uuID5"} content="Close"/>
        </UU5.Bricks.Swiper.Menu>

        <UU5.Bricks.Swiper.Body id={"uuID6"}>
          <UU5.Bricks.P id={"uuID7"} className="center">
            On touch screen you can open menus by swipe on blue area. If you dont have touchscreen, turn on
            console(chrome - F12) and switch to mobile device view by pressing icon at top left corner of the
            console or by pressing ctrl+shift+M.
          </UU5.Bricks.P>
        </UU5.Bricks.Swiper.Body>
      </UU5.Bricks.Swiper>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});










