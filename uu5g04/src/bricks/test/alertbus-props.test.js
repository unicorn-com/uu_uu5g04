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

const MyAlertBus = createReactClass({
  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onCloseAlert(event) {
    alert("Your close Alert in AlertBus");
    this.setState({ isCalled: true });
  },

  render() {
    return (
      <UU5.Bricks.AlertBus
        content="Alert in Bus"
        header="AlertBus-onClose"
        id={"uuAlertID"}
        onClose={this.onCloseAlert}
      />
    );
  }
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.CcrWriterMixin"
  ],
  props: {
    colorSchema: {
      values: [
        "default",
        "red",
        "red-rich",
        "green",
        "green-rich",
        "yellow",
        "yellow-rich",
        "purple",
        "purple-rich",
        "brown",
        "brown-rich",
        "orange",
        "orange-rich",
        "cyan",
        "cyan-rich",
        "grey",
        "grey-rich",
        "pink",
        "pink-rich"
      ]
    },
    position: {
      values: ["left", "center", "right"]
    },
    closeTimer: {
      values: [3000, 1500]
    },
    closeDisabled: {
      values: [true, false]
    },
    block: {
      values: [true, false]
    },
    forceRender: {
      values: [true, false]
    }
    //onClose:{}
  },
  requiredProps: {},
  opt: {
  }
};

describe(`UU5.Bricks.AlertBus`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.AlertBus, CONFIG);

  it(`UU5.Bricks.AlertBus  onClose()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyAlertBus />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("close");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("Your close Alert in AlertBus");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("Your close Alert in AlertBus");
    expect(wrapper).toMatchSnapshot();
  });
});
