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
import {shallow} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";


const TagName = "UU5.Bricks.Tabs";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    type: {
      values: ["tabs", "pills"]
    },
    stacked: {
      values: [true, false]
    },
    justified: {
      values: [true, false]
    },
    fade: {
      values: [true, false]
    },
    activeName: {
      values: ["active"]
    }
  },
  requiredProps: {
    children: [
      <UU5.Bricks.Tabs.Item header='Tab 1' name={"active"} id={"childID"}>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad
        litora
      </UU5.Bricks.Tabs.Item>
    ]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true
    },
    enzymeToJson: true
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);

  it(`${TagName} stacked=true`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs stacked={true}>
        <UU5.Bricks.Tabs.Item>Tab 1</UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );

    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} stacked=false`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs stacked={false}>
        <UU5.Bricks.Tabs.Item>Tab 1</UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );

    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    UU5.Environment.EventListener.triggerScreenSize({}, "xs");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

  it(`${TagName} stacked="s l"`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs stacked="s l">
        <UU5.Bricks.Tabs.Item>Tab 1</UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );
    UU5.Environment.EventListener.triggerScreenSize({}, "l");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
    UU5.Environment.EventListener.triggerScreenSize({}, "m");
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});

describe(`${TagName} docKit examples`, () => {

  it(`${TagName} should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs id={"uuID1"} fade>
        <UU5.Bricks.Tabs.Item id={"uuID2"} header='Tab 1'>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad
          litora
        </UU5.Bricks.Tabs.Item>
        <UU5.Bricks.Tabs.Item id={"uuID3"} header='Tab 2'>
          torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in,
          auctor et,
          scelerisque sed, est.
        </UU5.Bricks.Tabs.Item>
        <UU5.Bricks.Tabs.Item id={"uuID4"} header='Tab 3'>
          torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in,
          auctor et,
          scelerisque sed, est.
          torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in,
          auctor et,
          scelerisque sed, est.
        </UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});


describe(`${TagName} render from uu5string`, () => {
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

  it(`${TagName} active first tab with string as first child `, () => {
    const wrapper = shallow(
    <UU5.Bricks.Div content={uu5string} />
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});


