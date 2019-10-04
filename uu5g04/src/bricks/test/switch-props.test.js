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

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import createReactClass from "create-react-class";

const { mount, shallow, wait } = UU5.Test.Tools;

const MySwitchComponent = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false,
      feedback: 'initial',
      message: ''
    };
  },

  onClickAlert(event) {
    alert("onClick was Called");
    this.setState({isCalled: true});
    this.setState({feedback: 'Success'});
    this.setState({message: 'onClick props in Bricks.Switch was success'});
    {
      () => this.sliderButton.toggle();
    }
  },

  render() {
    return (
      <UU5.Bricks.Switch
        id={"uuID"}
        ref_={sliderButton => this.sliderButton = sliderButton}
        onClick={this.onClickAlert}
      />
    );
  }
});


const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.ColorSchemaMixin"
  ],
  props: {
    size: {
      values: ["s", "m", "l", "xl"]
    },
    switchedOn: {
      values: [true, false]
    },
    offIcon: {
      values: ["mdi-chevron-left"]
    },
    onIcon: {
      values: ["mdi-chevron-right"]
    }
    //onClick
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.Switch props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Switch, CONFIG);


  it(`UU5.Bricks.Switch onClick()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MySwitchComponent/>
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    expect(wrapper.state().feedback).toMatch(/initial/);
    expect(wrapper.state().message).toEqual("");
    wrapper.simulate('click');
    wrapper.update();
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('onClick was Called');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(wrapper.state().feedback).toMatch(/Success/);
    expect(wrapper.state().message).toMatch(/onClick props in Bricks.Switch was success/);
    expect(window.alert.mock.calls[0][0]).toEqual("onClick was Called");
  });

  it(`UU5.Bricks.Switch onClick() should toggle button`, function () {
    const wrapper = mount(
      <UU5.Bricks.Switch id={"mySwitch"} ref_={switchButton => this.switchButton = switchButton}
                         onClick={() => {
                           this.switchButton.toggle()
                         }}
      />);
    expect(this.switchButton.isSwitchedOn()).toBeFalsy();
    wrapper.find('Button').simulate('click');
    wrapper.update();
    //After simulate click ifc isSwitchenOn must be return true.
    expect(this.switchButton.isSwitchedOn()).toBeTruthy();
  });
});
