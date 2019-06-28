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
 * This is the Link component that contains the onClick handler that is used to test the function type props.
 */
const MyLink = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onClickAlert(event) {
    alert("onClick have been called.");
    this.setState({isCalled: true})
  },
  onCtrlClickAlert(event) {
    alert("onCtrlClick have been called.");
    this.setState({isCalled: true})
  },
  onWheelClickAlert(event) {
    alert("onWheelClick have been called.");
    this.setState({isCalled: true})
  },

  render() {
    return (
      <UU5.Bricks.Link
        href="http://www.unicorn.com/"
        content="www.unicorn.com"
        onClick={this.onClickAlert}
        onCtrlClick={this.onCtrlClickAlert}
        onWheelClick={this.onWheelClickAlert}
      />
    );
  }
});


const TagName = "UU5.Bricks.Link";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    href: {
      values: ["https://unicorn.com/", "www.unicorn.com", "#about", "mailto:me@example.com", "ftp://example.com/folder"]
    },
    //onClick:
    //onCtrlClick
    //onWheelClick
    smoothScroll: {
      values: [0,3000]
    },
    offset: {
      values: [0,70]
    },
    target: {
      values: ["_blank", "_parent", "_top", "_self"]
    },
    download: {
      values: [true, false]
    },
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

describe(`${TagName} props.Function`, () => {

  it(`${TagName} -  onClick() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyLink/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('click');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onClick have been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onClick have been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} -  onCtrlClick() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyLink/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('ctrlClick');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onCtrlClick have been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onCtrlClick have been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} -  onWheelClick() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyLink/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('wheelClick');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onWheelClick have been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onWheelClick have been called.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});

describe(`${TagName} docKit examples`, () => {

  it(`${TagName} should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Link
          id={"uuID02"}
          href="http://www.unicorn.com/"
          target="_blank"
        >
          www.unicorn.com
        </UU5.Bricks.Link>
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});










