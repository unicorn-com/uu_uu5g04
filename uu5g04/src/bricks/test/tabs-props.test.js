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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const MOUNT_TAB_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstActive: "onFirstActive",
  onActive: "onActive",
};

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
    type: {
      values: ["tabs", "pills"],
    },
    stacked: {
      values: [true, false],
    },
    justified: {
      values: [true, false],
    },
    fade: {
      values: [true, false],
    },
    initialActiveName: {
      values: ["tab2"],
    },
    activeName: {
      values: ["tab2"],
    },
    // mountTabContent - this prop is tested further below
  },
  requiredProps: {
    children: [
      <UU5.Bricks.Tabs.Item header="Tab 1" name="tab1" id="tab1" key="tab1">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora
      </UU5.Bricks.Tabs.Item>,
      <UU5.Bricks.Tabs.Item header="Tab 2" name="tab2" id="tab2" key="tab2">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora
      </UU5.Bricks.Tabs.Item>,
      <UU5.Bricks.Tabs.Item header="Tab 3" name="tab3" id="tab3" key="tab3">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora
      </UU5.Bricks.Tabs.Item>,
    ],
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

const getTabItems = (items, testFn) => {
  return items.map((item, i) => {
    return (
      // eslint-disable-next-line react/jsx-no-bind
      <UU5.Bricks.Tabs.Item ref_={() => testFn && testFn(i)} key={i} name={`${i}`} header={`tab number ${item}`}>
        Lorem ipsum dolor sit amet
      </UU5.Bricks.Tabs.Item>
    );
  });
};

describe(`UU5.Bricks.Tabs`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Tabs, CONFIG);

  it(`UU5.Bricks.Tabs stacked=true`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs stacked={true}>
        <UU5.Bricks.Tabs.Item>Tab 1</UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );

    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Tabs stacked=false`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs stacked={false}>
        <UU5.Bricks.Tabs.Item>Tab 1</UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );

    expect(wrapper).toMatchSnapshot();
    UU5.Environment.EventListener.triggerScreenSize({}, "xs");
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Tabs stacked="s l"`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs stacked="s l">
        <UU5.Bricks.Tabs.Item>Tab 1</UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );
    UU5.Environment.EventListener.triggerScreenSize({}, "l");
    expect(wrapper).toMatchSnapshot();
    UU5.Environment.EventListener.triggerScreenSize({}, "m");
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.Tabs - mountTabContent: ${MOUNT_TAB_CONTENT_VALUES.onFirstRender} (mounted before open, never unmount`, () => {
    const mountFn = jest.fn();
    mount(<UU5.Bricks.Tabs mountTabContent="onFirstRender">{getTabItems([1, 2, 3], mountFn)}</UU5.Bricks.Tabs>);
    expect(mountFn).toBeCalledTimes(3);
    expect(mountFn.mock.calls[0][0]).toBe(0); // first tab mounted
    expect(mountFn.mock.calls[1][0]).toBe(1); // second tab mounted
    expect(mountFn.mock.calls[2][0]).toBe(2); // third tab mounted
  });

  it(`UU5.Bricks.Tabs - mountTabContent: ${MOUNT_TAB_CONTENT_VALUES.onFirstActive} (mounted when open, never unmount)`, () => {
    const mountFn = jest.fn();
    const wrapper = mount(
      <UU5.Bricks.Tabs mountTabContent="onFirstActive">{getTabItems([1, 2, 3], mountFn)}</UU5.Bricks.Tabs>
    );
    expect(mountFn).toBeCalledTimes(1);
    expect(mountFn.mock.calls[0][0]).toBe(0); // first tab mounted
    const buttons = wrapper.find(".uu5-bricks-button");
    buttons.at(1).simulate("click");
    expect(mountFn).toBeCalledTimes(2);
    expect(mountFn.mock.calls[1][0]).toBe(1); // second tab mounted
    buttons.at(2).simulate("click");
    expect(mountFn).toBeCalledTimes(3);
    expect(mountFn.mock.calls[2][0]).toBe(2); // third tab mounted
    buttons.at(0).simulate("click");
    expect(mountFn).toBeCalledTimes(3); // repeatedly opening tabs doesnt trigger mount anymore
    buttons.at(1).simulate("click");
    expect(mountFn).toBeCalledTimes(3); // repeatedly opening tabs doesnt trigger mount anymore
    buttons.at(2).simulate("click");
    expect(mountFn).toBeCalledTimes(3); // repeatedly opening tabs doesnt trigger mount anymore
  });

  it(`UU5.Bricks.Tabs - mountTabContent: ${MOUNT_TAB_CONTENT_VALUES.onActive} (mounted when open, unmount on close)`, () => {
    const mountFn = jest.fn();
    const wrapper = mount(
      <UU5.Bricks.Tabs mountTabContent="onActive">{getTabItems([1, 2, 3], mountFn)}</UU5.Bricks.Tabs>
    );
    expect(mountFn).toBeCalledTimes(1);
    expect(mountFn.mock.calls[0][0]).toBe(0); // first tab mounted
    const buttons = wrapper.find(".uu5-bricks-button");
    buttons.at(1).simulate("click");
    expect(mountFn).toBeCalledTimes(2);
    expect(mountFn.mock.calls[1][0]).toBe(1); // second tab mounted
    buttons.at(2).simulate("click");
    expect(mountFn).toBeCalledTimes(3);
    expect(mountFn.mock.calls[2][0]).toBe(2); // third tab mounted
    buttons.at(0).simulate("click");
    expect(mountFn).toBeCalledTimes(4);
    expect(mountFn.mock.calls[3][0]).toBe(0); // first tab mounted again
    buttons.at(1).simulate("click");
    expect(mountFn).toBeCalledTimes(5);
    expect(mountFn.mock.calls[4][0]).toBe(1); // second tab mounted again
    buttons.at(2).simulate("click");
    expect(mountFn).toBeCalledTimes(6);
    expect(mountFn.mock.calls[5][0]).toBe(2); // third tab mounted again
  });
});

describe(`UU5.Bricks.Tabs docKit examples`, () => {
  it(`UU5.Bricks.Tabs should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs id={"uuID1"} fade>
        <UU5.Bricks.Tabs.Item id={"uuID2"} header="Tab 1">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora
        </UU5.Bricks.Tabs.Item>
        <UU5.Bricks.Tabs.Item id={"uuID3"} header="Tab 2">
          torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in, auctor et, scelerisque
          sed, est.
        </UU5.Bricks.Tabs.Item>
        <UU5.Bricks.Tabs.Item id={"uuID4"} header="Tab 3">
          torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in, auctor et, scelerisque
          sed, est. torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in, auctor et,
          scelerisque sed, est.
        </UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.Tabs render from uu5string`, () => {
  const uu5string = `<uu5string/>
      <UU5.Bricks.Tabs fade id="uuID5">
      <UU5.Bricks.Tabs.Item id="uuID6"  header='Tab 1'>
      First tab
      </UU5.Bricks.Tabs.Item>
      <UU5.Bricks.Tabs.Item id="uuID7"  header='Tab 2'>
      Second tab
      </UU5.Bricks.Tabs.Item>
      <UU5.Bricks.Tabs.Item id="uuID8"  header='Tab 3'>
      Third tab
      </UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>`;

  it(`UU5.Bricks.Tabs active first tab with string as first child `, () => {
    const wrapper = shallow(<UU5.Bricks.Div content={uu5string} />);
    expect(wrapper).toMatchSnapshot();
  });
});
