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

const MyPanelHandler = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onClickAlert(event) {
    alert("You just clicked on the Panel");
    this.setState({ isCalled: true });
  },

  render() {
    return (
      <UU5.Bricks.Panel id={"uuID"} onClick={this.onClickAlert}>
        onClick
      </UU5.Bricks.Panel>
    );
  },
});

const MOUNT_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstExpand: "onFirstExpand",
  onEachExpand: "onEachExpand",
};

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    expanded: {
      values: [true, false],
    },
    // NOTE :-( Skipping because controlled/alwaysExpanded doesn't work properly with each other and there's
    // hard to estimate how to change it without breaking compatibility.
    alwaysExpanded: {
      values: [true, false],
      opt: {
        skip: true,
      },
    },
    iconExpanded: {
      values: ["uu5-plus"],
    },
    iconCollapsed: {
      values: ["uu5-minus"],
    },
    //onClick
    disableHeaderClick: {
      values: [true, false],
    },
    size: {
      values: ["s", "m", "l", "xl"],
    },
    mountContent: {
      values: [
        MOUNT_CONTENT_VALUES.onEachExpand,
        MOUNT_CONTENT_VALUES.onFirstExpand,
        MOUNT_CONTENT_VALUES.onFirstRender,
      ],
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Panel`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Panel, CONFIG);
});

describe(`UU5.Bricks.Panel props.Function`, () => {
  it(`UU5.Bricks.Panel -  onClick() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyPanelHandler />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("click");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("You just clicked on the Panel");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You just clicked on the Panel");
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Panel -  mountContent default ( mount on first render, never unmount )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = UU5.Common.VisualComponent.create({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function () {
        log();
        return "Logged";
      },
    });
    const wrapper = mount(
      <UU5.Bricks.Panel>
        <Log />
      </UU5.Bricks.Panel>
    );

    // in first render strategy content of panel is rendered before first open of panel
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isExpanded()).toBeFalsy();

    // open panel
    wrapper.instance().expand();
    jest.runAllTimers();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(log).toBeCalledTimes(2);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close panel - components will be rerendered
    wrapper.instance().collapse();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(3);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // open panel again - components will be rerendered but without mounting of the component
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(4);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    wrapper.unmount();

    // check correct using of unmount
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);
  });

  it(`UU5.Bricks.Panel - mountContent: ${MOUNT_CONTENT_VALUES.onFirstRender} ( mounted before expand, never unmount )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = UU5.Common.VisualComponent.create({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function () {
        log();
        return "Logged";
      },
    });
    const wrapper = mount(
      <UU5.Bricks.Panel mountContent={MOUNT_CONTENT_VALUES.onFirstRender}>
        <Log />
      </UU5.Bricks.Panel>
    );

    // in first open strategy content of panel is not rendered before first open of panel
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isExpanded()).toBeFalsy();

    // open panel
    wrapper.instance().expand();
    jest.runAllTimers();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(log).toBeCalledTimes(2);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close panel - components will be rerendered
    wrapper.instance().collapse();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(3);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // open panel again - components will be rerendered but without mounting of the component
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(4);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    wrapper.unmount();

    // check correct using of unmount
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);
  });

  it(`UU5.Bricks.Panel -  mountContent: ${MOUNT_CONTENT_VALUES.onFirstExpand} ( mount on first expand, never unmount )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = UU5.Common.VisualComponent.create({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function () {
        log();
        return "Logged";
      },
    });
    const wrapper = mount(
      <UU5.Bricks.Panel mountContent={MOUNT_CONTENT_VALUES.onFirstExpand}>
        <Log />
      </UU5.Bricks.Panel>
    );

    // in first open strategy content of panel is not rendered before first open of panel
    expect(log).not.toBeCalled();
    expect(mountLog).not.toBeCalled();
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isExpanded()).toBeFalsy();

    // open panel
    wrapper.instance().expand();
    jest.runAllTimers();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close panel - components will be rerendered
    wrapper.instance().collapse();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(2);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // open panel again - components will be rerendered but without mounting of the component
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(3);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    wrapper.unmount();

    // check correct using of unmount
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);
  });

  it(`UU5.Bricks.Panel -  unmountCollapsedBody: ${MOUNT_CONTENT_VALUES.onEachExpand} ( mount on each expand, unmount on each collapse )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = UU5.Common.VisualComponent.create({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function () {
        log();
        return "Logged";
      },
    });
    const wrapper = mount(
      <UU5.Bricks.Panel mountContent={MOUNT_CONTENT_VALUES.onEachExpand}>
        <Log />
      </UU5.Bricks.Panel>
    );

    // in first open strategy content of panel is not rendered before first open of panel
    expect(log).not.toBeCalled();
    expect(mountLog).not.toBeCalled();
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isExpanded()).toBeFalsy();

    // open panel
    wrapper.instance().expand();
    jest.runAllTimers();
    expect(wrapper.instance().isExpanded()).toBeTruthy();
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close panel - components will be rerendered
    wrapper.instance().collapse();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(1); // component does not rerender but it is unmounted
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);

    // open panel again - components will be rerendered but without mounting of the component
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(2);
    expect(mountLog).toBeCalledTimes(2);
    expect(unmountLog).toBeCalledTimes(1);

    // unmount again
    wrapper.instance().toggle();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(2); // component does not rerender but it is unmounted
    expect(mountLog).toBeCalledTimes(2);
    expect(unmountLog).toBeCalledTimes(2);

    wrapper.unmount();

    // check correct using of unmount - component is already unmounted
    expect(unmountLog).toBeCalledTimes(2);
  });
});
