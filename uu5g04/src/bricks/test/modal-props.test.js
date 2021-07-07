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

// NOTE For this test only we'll use non-HOC variant of UU5.Bricks.Modal (without modal bus HOC).
const NonHocModal = UU5.Bricks.Modal._originalComponent;

const MyModalComponent = UU5.Common.VisualComponent.create({
  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onCloseAlert(event) {
    alert("You closed modal window.");
    this.setState({ isCalled: true });
  },

  render() {
    return (
      <NonHocModal shown={true} header="sticky" id={"idModal"} onClose={this.onCloseAlert}>
        This modal has props shown = true and onClose eventn handlers.
      </NonHocModal>
    );
  },
});

const MOUNT_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstOpen: "onFirstOpen",
  onEachOpen: "onEachOpen",
};

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.CcrReaderMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    size: {
      values: ["s", "m", "l", "auto", "max"],
    },
    shown: {
      values: [true, false],
    },
    sticky: {
      values: [true, false],
    },
    stickyBackground: {
      values: [true, false],
    },
    scrollableBackground: {
      values: [true, false],
    },
    forceRender: {
      values: [true, false],
    },
    overflow: {
      values: [true, false],
    },
    mountContent: {
      values: [
        MOUNT_CONTENT_VALUES.onEachExpand,
        MOUNT_CONTENT_VALUES.onFirstExpand,
        MOUNT_CONTENT_VALUES.onFirstRender,
      ],
    },
    offsetTop: {
      values: ["auto", 200],
    },
    //onClose

    // NOTE Skipping because controlled/hidden doesn't work properly with each other and there's
    // hard to estimate how to change it without breaking compatibility.
    hidden: {
      values: [true, false],
      opt: {
        skip: true,
      },
    },
    controlled: {
      values: [true, false],
      opt: {
        skip: true,
      },
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const This = {};

describe(`UU5.Bricks.Modal props`, () => {
  UU5.Test.Tools.testProperties(NonHocModal, CONFIG);
});

describe(`UU5.Bricks.Modal props.Function`, () => {
  it(`UU5.Bricks.Modal -  onClose() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyModalComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("close");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("You closed modal window.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You closed modal window.");
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Modal -  mountContent default ( mount on first render, never unmount )`, () => {
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
      <NonHocModal>
        <Log />
      </NonHocModal>
    );

    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isHidden()).toBeTruthy();

    // open modal
    wrapper.instance().open();
    jest.runAllTimers();
    expect(wrapper.instance().isHidden()).toBeFalsy();
    expect(log).toBeCalledTimes(2);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close modal - components will be rerendered
    wrapper.instance().close();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(4);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // open modal again - components will be rerendered but without mounting of the component
    wrapper.instance().open();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(5);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    wrapper.unmount();

    // check correct using of unmount
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);
  });

  it(`UU5.Bricks.Modal -  mountContent: ${MOUNT_CONTENT_VALUES.onFirstOpen} ( mount on first open, never unmount )`, () => {
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
      <NonHocModal mountContent={MOUNT_CONTENT_VALUES.onFirstOpen}>
        <Log />
      </NonHocModal>
    );

    // modal is not rendered before first open
    expect(log).not.toBeCalled();
    expect(mountLog).not.toBeCalled();
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isHidden()).toBeTruthy();

    // open modal
    wrapper.instance().open();
    jest.runAllTimers();
    expect(wrapper.instance().isHidden()).toBeFalsy();
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close modal - components will be rerendered
    wrapper.instance().close();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(3); // there are 2 renders of modal's content when closing
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // open modal again - components will be rerendered but without mounting of the component
    wrapper.instance().open();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(4);
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    wrapper.unmount();

    // check correct using of unmount
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);
  });

  it(`UU5.Bricks.Modal -  mountContent: ${MOUNT_CONTENT_VALUES.onEachOpen} ( mount on each open, unmount on each close )`, () => {
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
      <NonHocModal mountContent={MOUNT_CONTENT_VALUES.onEachOpen}>
        <Log />
      </NonHocModal>
    );

    // modal is not rendered before first open of modal
    expect(log).not.toBeCalled();
    expect(mountLog).not.toBeCalled();
    expect(unmountLog).not.toBeCalled();
    expect(wrapper.instance().isHidden()).toBeTruthy();

    // open modal
    wrapper.instance().open();
    jest.runAllTimers();
    expect(wrapper.instance().isHidden()).toBeFalsy();
    expect(log).toBeCalled();
    expect(log).toBeCalledTimes(1);
    expect(mountLog).toBeCalled();
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).not.toBeCalled();

    // close modal - components will be rerendered
    wrapper.instance().close();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(2); // component does not rerender but it is unmounted
    expect(mountLog).toBeCalledTimes(1);
    expect(unmountLog).toBeCalled();
    expect(unmountLog).toBeCalledTimes(1);

    // open modal again - components will be rerendered but without mounting of the component
    wrapper.instance().open();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(3);
    expect(mountLog).toBeCalledTimes(2);
    expect(unmountLog).toBeCalledTimes(1);

    // unmount again
    wrapper.instance().close();
    jest.runAllTimers();
    expect(log).toBeCalledTimes(4); // component does not rerender but it is unmounted
    expect(mountLog).toBeCalledTimes(2);
    expect(unmountLog).toBeCalledTimes(2);

    wrapper.unmount();

    // check correct using of unmount - component is already unmounted
    expect(unmountLog).toBeCalledTimes(2);
  });
});

describe(`UU5.Bricks.Modal docKit example`, () => {
  it(`UU5.Bricks.Modal example01`, () => {
    const wrapper = shallow(
      <NonHocModal id={"modalID"} shown={true} header="shown">
        This modal has props <UU5.Bricks.Code id={"idCODE"} content="shown" /> and therefore is displayed right away.
      </NonHocModal>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
