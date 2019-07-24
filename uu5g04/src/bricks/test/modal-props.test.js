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
import { shallow, mount } from "enzyme";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";
import createReactClass from "create-react-class";

const MyModalComponent = createReactClass({

  getInitialState: () => {
    return {
      isCalled: false
    };
  },

  onCloseAlert(event) {
    alert("You closed modal window.");
    this.setState({isCalled: true})
  },

  render() {
    return (
      <UU5.Bricks.Modal
        shown={true}
        header="sticky"
        id={"idModal"}
        onClose={this.onCloseAlert}
      >
        This modal has props shown = true and onClose eventn handlers.
      </UU5.Bricks.Modal>
    );
  }
});

const TagName = "UU5.Bricks.Modal";

const MOUNT_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstOpen: "onFirstOpen",
  onEachOpen: "onEachOpen"
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
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    size: {
      values: ["s", "m", "l", "auto"]
    },
    shown: {
      values: [true, false]
    },
    sticky: {
      values: [true, false]
    },
    stickyBackground: {
      values: [true, false]
    },
    scrollableBackground: {
      values: [true, false]
    },
    forceRender: {
      values: [true, false]
    },
    overflow: {
      values: [true, false]
    },
    mountContent: {
      values: [
        MOUNT_CONTENT_VALUES.onEachExpand,
        MOUNT_CONTENT_VALUES.onFirstExpand,
        MOUNT_CONTENT_VALUES.onFirstRender
      ]
    }
    //onClose
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: true
  }
};

const This = {};


describe(`${TagName} props`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe(`${TagName} props.Function`, () => {

  it(`${TagName} -  onClose() should be called`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(
      <MyModalComponent/>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate('close');
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith('You closed modal window.');
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You closed modal window.");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} -  mountContent default ( mount on first render, never unmount )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = createReactClass({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function() {
        log();
        return "Logged";
      }
    });
    const wrapper = mount(
      <UU5.Bricks.Modal>
        <Log />
      </UU5.Bricks.Modal>
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

  it(`${TagName} -  mountContent: ${MOUNT_CONTENT_VALUES.onFirstOpen} ( mount on first open, never unmount )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = createReactClass({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function() {
        log();
        return "Logged";
      }
    });
    const wrapper = mount(
      <UU5.Bricks.Modal mountContent={MOUNT_CONTENT_VALUES.onFirstOpen}>
        <Log />
      </UU5.Bricks.Modal>
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

  it(`${TagName} -  mountContent: ${MOUNT_CONTENT_VALUES.onEachOpen} ( mount on each open, unmount on each close )`, () => {
    jest.useFakeTimers();

    const log = jest.fn();
    const mountLog = jest.fn();
    const unmountLog = jest.fn();
    const Log = createReactClass({
      componentDidMount() {
        mountLog();
      },
      componentWillUnmount() {
        unmountLog();
      },
      render: function() {
        log();
        return "Logged";
      }
    });
    const wrapper = mount(
      <UU5.Bricks.Modal mountContent={MOUNT_CONTENT_VALUES.onEachOpen}>
        <Log />
      </UU5.Bricks.Modal>
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

describe(`${TagName} docKit example`, () => {
  it(`${TagName} example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Modal
        id={"modalID"}
        shown={true}
        header="shown"
      >
        This modal has props <UU5.Bricks.Code id={"idCODE"} content='shown'/> and therefore is displayed right away.
      </UU5.Bricks.Modal>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});
