/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const MySwitchComponent = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
      feedback: "initial",
      message: "",
    };
  },

  onClickAlert(event) {
    alert("onClick was Called");
    this.setState({ isCalled: true });
    this.setState({ feedback: "Success" });
    this.setState({ message: "onClick props in Bricks.Switch was success" });
    {
      () => this.sliderButton.toggle();
    }
  },

  render() {
    return (
      <UU5.Bricks.Switch
        id={"uuID"}
        ref_={(sliderButton) => (this.sliderButton = sliderButton)}
        onClick={this.onClickAlert}
      />
    );
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.ColorSchemaMixin",
  ],
  props: {
    size: {
      values: ["s", "m", "l", "xl"],
    },
    switchedOn: {
      values: [true, false],
    },
    offIcon: {
      values: ["mdi-chevron-left"],
    },
    onIcon: {
      values: ["mdi-chevron-right"],
    },
    //onClick
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Switch props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Switch, CONFIG);

  it(`UU5.Bricks.Switch onClick()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MySwitchComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    expect(wrapper.state().feedback).toMatch(/initial/);
    expect(wrapper.state().message).toEqual("");
    wrapper.simulate("click");
    wrapper.update();
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onClick was Called");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(wrapper.state().feedback).toMatch(/Success/);
    expect(wrapper.state().message).toMatch(/onClick props in Bricks.Switch was success/);
    expect(window.alert.mock.calls[0][0]).toEqual("onClick was Called");
  });

  it(`UU5.Bricks.Switch onClick() should toggle button`, function () {
    const wrapper = mount(
      <UU5.Bricks.Switch
        id={"mySwitch"}
        ref_={(switchButton) => (this.switchButton = switchButton)}
        onClick={() => {
          this.switchButton.toggle();
        }}
      />
    );
    expect(this.switchButton.isSwitchedOn()).toBeFalsy();
    wrapper.find("Button").simulate("click");
    wrapper.update();
    //After simulate click ifc isSwitchenOn must be return true.
    expect(this.switchButton.isSwitchedOn()).toBeTruthy();
  });
});
