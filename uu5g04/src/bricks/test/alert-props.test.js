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

const MyAlertComponent = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onCloseAlert(event) {
    alert("onCloseAlert");
    this.setState({ isCalled: true });
  },

  onCloseAfterAlert(event) {
    alert("onCloseAfterAlert");
    this.setState({ isCalled: true });
  },

  onCloseBerforeAlert(event) {
    alert("onCloseBeforeAlert");
    this.setState({ isCalled: true });
  },

  render() {
    return (
      <UU5.Bricks.Alert
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fermentum placerat tristique."
        header="onClose"
        id={"uuAlertID"}
        onClose={this.onCloseAlert}
        onCloseAfter={this.onCloseAfterAlert}
        onCloseBefore={this.onCloseBerforeAlert}
      />
    );
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    position: {
      values: ["left", "center", "right"],
    },
    closeTimer: {
      values: [3000, 1500],
    },
    closeDisabled: {
      values: [true, false],
    },
    // onClose: {},
    // onCloseAfter: {},
    // onCloseBefore: {},
    block: {
      values: [true, false],
    },
  },
  requiredProps: {
    children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fermentum placerat tristique.",
    header: "Header content",
  },
  opt: {},
};

describe(`UU5.Bricks.Alert props`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Alert, CONFIG);

  it("onClose() - alert should be open", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyAlertComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("close");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onCloseAlert");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onCloseAlert");
    expect(wrapper).toMatchSnapshot();
  });

  it("onCloseAfter() - alert should open with onCloseAfter", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyAlertComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("closeAfter");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onCloseAfterAlert");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onCloseAfterAlert");
    expect(wrapper).toMatchSnapshot();
  });

  it("onCloseBefore() - alert should open with onCloseBefore", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyAlertComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("closeBefore");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onCloseBeforeAlert");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onCloseBeforeAlert");
    expect(wrapper).toMatchSnapshot();
  });
});
