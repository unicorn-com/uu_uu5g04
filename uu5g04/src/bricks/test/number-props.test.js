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
import TestTools from "../../core/test/test-tools.js";
import renderer from 'react-test-renderer';
import createReactClass from "create-react-class";

const MyNumberHandler = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onChangeHandler(event) {
    alert("onChange event has been called.");
    this.setState({isCalled: true})
  },
  render() {
    return (
      <UU5.Bricks.Number id={"uuID"} value={5223.65663} onChange={this.onChangeHandler}/>
    );
  }
});



const TagName = "UU5.Bricks.Number";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    value: {
      values: [225658.14522]
    },
    //onChange:
    thousandSeparator: {
      values: [",",".", " "]
    },
    decimalSeparator: {
      values: [",",".", " "]
    },
    maxDecimalLength: {
      values: [5]
    },
    minDecimalLength: {
      values: [10]
    },
    rounded: {
      values: [-5,-2,0]
    }
  },
  requiredProps: {
    value: 225658.14522
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
});

describe(`${TagName}`, () => {

  it(`${TagName} - onChange props()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyNumberHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('change');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onChange event has been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChange event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

});

describe(`${TagName} docKit examples`, () => {

  it(`${TagName} should render without crash`, () => {
    const wrapper = renderer.create(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.Row id={"uuID1"}>
          <UU5.Bricks.Column colWidth="xs12 s3 m4">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Number value={876.1564} />
            {/*@@viewOff:0*/}
          </UU5.Bricks.Column>
          <UU5.Bricks.Column  colWidth="xs12 s8 m5">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Number thousandSeparator="," value={8766641564} />
            {/*@@viewOff:0*/}
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
        <UU5.Bricks.Row id={"uuID3"}>
          <UU5.Bricks.Column colWidth="xs12 s7 m5">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Number decimalSeparator="." value={87661564.435} />
            {/*@@viewOff:0*/}
          </UU5.Bricks.Column>
          <UU5.Bricks.Column  colWidth="xs12 s8 m5">
            {/*@@viewOn:0*/}
            <UU5.Bricks.Number value={-27415.78963} maxDecimalLength={3} />
            {/*@@viewOff:0*/}
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
        <UU5.Bricks.Column colWidth="xs12 s7 m5">
          {/*@@viewOn:0*/}
          <UU5.Bricks.Number value={-27415.78963} minDecimalLength={10} />
          {/*@@viewOff:0*/}
        </UU5.Bricks.Column>
        <UU5.Bricks.Column colWidth="xs12 s4 m5">
          {/*@@viewOn:0*/}
          <UU5.Bricks.Number value={-27415.78963} rounded={-3} />
          {/*@@viewOff:0*/}
        </UU5.Bricks.Column>
      </UU5.Bricks.Container>
    ).toJSON();
    expect(wrapper).toMatchSnapshot();
  });

});










