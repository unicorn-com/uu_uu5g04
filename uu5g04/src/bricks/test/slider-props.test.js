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

const MySliderHandler = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onChangeAlert(event) {
    alert("onChange has been called.");
    this.setState({ isCalled: true });
  },

  onChangedAlert(event) {
    alert("onChanged has been called.");
    this.setState({ isCalled: true });
  },

  render() {
    return <UU5.Bricks.Slider value={4} id={"uuID"} onChange={this.onChangeAlert} onChanged={this.onChangedAlert} />;
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    min: {
      values: [10],
    },
    max: {
      values: [50],
    },
    step: {
      values: [5],
    },
    value: {
      values: [30, [33, 77]],
    },
    //onChange
    //onChanged
    size: {
      values: ["s", "m", "l", "xl"],
    },
    vertical: {
      values: [true, false],
    },
  },
  requiredProps: {
    //children: [<UU5.Bricks.Slider.Item id={"childID"} dynamic={false} disabled={true} label="Profile"/>]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

describe(`UU5.Bricks.Slider`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Slider, CONFIG);
});

describe(`UU5.Bricks.Slider props.Function`, () => {
  it(`UU5.Bricks.Slider -  onChange() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MySliderHandler />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("change");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChange has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChange has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Slider -  onChanged() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MySliderHandler />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("changed");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChanged has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChanged has been called.");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.Slider docKit examples`, () => {
  it(`UU5.Bricks.Slider example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.Slider id={"defaultProps"} ref_={(slider1) => (this.slider1 = slider1)} />
        <UU5.Bricks.Slider id={"propsSetting"} value={4} min={2} max={10} step={3} size={"xl"} />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
