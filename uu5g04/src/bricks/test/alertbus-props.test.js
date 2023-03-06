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
import { mount, shallow, omitConsoleLogs } from "uu5g05-test";
//@@viewOff:imports

beforeEach(() => {
  omitConsoleLogs("deprecated");
});

const MyAlertBus = UU5.Common.VisualComponent.create({
  //@@viewOn:reactLifeCycle
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  onCloseAlert(event) {
    alert("Your close Alert in AlertBus");
    this.setState({ isCalled: true });
  },
  //@@viewOff:interface

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.AlertBus
        content="Alert in Bus"
        header="AlertBus-onClose"
        id={"uuAlertID"}
        onClose={this.onCloseAlert}
      />
    );
  },
  //@@viewOff:render
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.CcrWriterMixin",
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
        "pink-rich",
      ],
    },
    position: {
      values: ["left", "center", "right"],
    },
    closeTimer: {
      values: [3000, 1500],
    },
    closeDisabled: {
      values: [true, false],
    },
    block: {
      values: [true, false],
    },
    forceRender: {
      values: [true, false],
    },
    descending: {
      values: [undefined, true, false],
    },
  },
  requiredProps: {},
  opt: {},
};

describe(`UU5.Bricks.AlertBus`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.AlertBus, CONFIG);

  it(`UU5.Bricks.AlertBus rendering`, () => {
    const wrapper = mount(<UU5.Bricks.AlertBus />);
    wrapper.instance().setAlerts([{ content: "alert 1" }, { content: "alert 2" }]);
    wrapper.update();
    let alertList = wrapper.find(UU5.Bricks.Alert);
    expect(alertList.at(0).text()).toBe("alert 1");
  });

  it(`UU5.Bricks.AlertBus stacked with descending`, () => {
    let wrapper = mount(<UU5.Bricks.AlertBus stacked />);
    // alerts sorted by colorSchema
    wrapper.instance().setAlerts([
      { content: "alert 1", colorSchema: "success" },
      { content: "alert 2", colorSchema: "danger" },
    ]);
    wrapper.update();
    let alertList = wrapper.find(UU5.Bricks.Alert);
    // sorted by colorSchema
    expect(alertList.at(0).text()).toBe("alert 2");
    expect(alertList.at(1).text()).toBe("alert 1");

    wrapper = mount(<UU5.Bricks.AlertBus stacked descending={true} />);
    // new alerts are at the bottom
    wrapper.instance().setAlerts([{ content: "alert 1" }, { content: "alert 2" }]);
    wrapper.update();
    alertList = wrapper.find(UU5.Bricks.Alert);
    // second alert is shown
    expect(alertList.at(0).text()).toBe("alert 2");
    expect(alertList.at(1).text()).toBe("alert 1");

    wrapper = mount(<UU5.Bricks.AlertBus stacked descending={false} />);
    // new alerts are at the top
    wrapper.instance().setAlerts([{ content: "alert 1" }, { content: "alert 2" }]);
    wrapper.update();
    alertList = wrapper.find(UU5.Bricks.Alert);
    expect(alertList.at(0).text()).toBe("alert 1");
    expect(alertList.at(1).text()).toBe("alert 2");
  });

  it(`UU5.Bricks.AlertBus onClose()`, () => {
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

  it(`UU5.Bricks.AlertBus location="local"`, () => {
    let alertBus;
    const wrapper = mount(
      <UU5.Bricks.Page alertBus={<UU5.Bricks.AlertBus />}>
        <UU5.Bricks.AlertBus ref_={(ref) => (alertBus = ref)} location="local" />
      </UU5.Bricks.Page>
    );
    alertBus.addAlert({ content: "Alert Content" });
    wrapper.update();
    expect(alertBus.getAlerts().length).toBe(1);
  });

  it(`UU5.Bricks.AlertBus location="page"`, () => {
    let alertBus;
    let page;
    const wrapper = mount(
      <UU5.Bricks.Page ref_={(ref) => (page = ref)} alertBus={<UU5.Bricks.AlertBus />}>
        <UU5.Bricks.AlertBus ref_={(ref) => (alertBus = ref)} location="page" />
      </UU5.Bricks.Page>
    );
    alertBus.addAlert({ content: "Alert Content" });
    wrapper.update();
    expect(page.getAlertBus().getAlerts().length).toBe(1);
  });

  it(`UU5.Bricks.AlertBus location="portal"`, () => {
    let alertBus;
    const wrapper = mount(
      <UU5.Bricks.Page alertBus={<UU5.Bricks.AlertBus />}>
        <UU5.Bricks.AlertBus ref_={(ref) => (alertBus = ref)} location="portal" />
      </UU5.Bricks.Page>
    );
    alertBus.addAlert({ content: "Alert Content" });
    wrapper.update();
    expect(
      UU5.Common.DOM.findNode(alertBus).parentElement.id === "uu5-common-portal-alert-bus" ||
        UU5.Common.DOM.findNode(alertBus).parentElement.parentElement.className === "uu5-bricks-page-alert-bus-portal"
    ).toBeTruthy();
  });
});
