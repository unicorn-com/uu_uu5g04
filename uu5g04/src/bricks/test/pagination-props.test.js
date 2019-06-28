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

const MyPaganitionHandler = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onChangeHandler(event) {
    alert("onChange has been called.");
    this.setState({isCalled: true})
  },
  onChangedHandler(event) {
    alert("onChanged has been called.");
    this.setState({isCalled: true})
  },
  render() {
    return (
      <UU5.Bricks.Pagination
        id={"myCMP"}
        items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
        activeIndex={6}
        range={5}
        prevLabel="Previous"
        nextLabel="Next"
        size="m"
        onChange={this.onChangeHandler}
        onChanged={this.onChangedHandler}
        background
      />
    );
  }
});


const TagName = "UU5.Bricks.Pagination";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    items: {
      values: [[1, 2, 3, 4, 5, 6, 7, 8], null,[] ]
    },
    activeIndex: {
      values: [0,3,6]
    },
    range: {
      values: [1,2,3,4]
    },
    prevIcon: {
      values: ["uu5-plus"]
    },
    prevLabel: {
      values: ["Předchozí"]
    },
    nextIcon: {
      values: ["uu5-minus"]
    },
    nextLabel: {
      values: ["Následující"]
    },
    firstIcon:{
      values: ["uu5-plus"]
    },
    firstLabel: {
      values: ["První"]
    },
    lastIcon: {
      values: ["uu5-plus"]
    },
    lastLabel: {
      values: ["Poslední"]
    },
    size: {
      values: ["s", "m", "l", "xl"]
    },
    //onChange
    //onChanged
    background: {
      values: [true, false]
    }
  },
  requiredProps: {},
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

describe(`${TagName}`, () => {

  it(`${TagName} - onChange()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyPaganitionHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('change');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onChange has been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChange has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it(`${TagName} - onChanged()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyPaganitionHandler/>
    );
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('changed');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onChanged has been called.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChanged has been called.");
    expect(wrapper).toMatchSnapshot();
  });

});


describe(`${TagName} docKit examples`, () => {

  it(`${TagName} should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.Pagination
          id={"first"}
          items={[1, 2, 3, 4, 5, 6, 7, 8]}
          range={5}
          firstLabel="First"
          lastLabel="Last"
          prevLabel="Previous"
          nextLabel="Next"
          size="s"
        />
        <UU5.Bricks.Pagination
          id={"second"}
          items={[1, 2, 3, 4, 5, 6, 7, 8]}
          range={3}
          firstIcon="mdi-chevron-double-left"
          lastIcon="mdi-chevron-double-right"
          prevIcon="mdi-arrow-left-bold-circle"
          nextIcon="mdi-arrow-right-bold-circle"
          size="m"
          colorSchema="purple"
        />
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});










