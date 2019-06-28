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
import { mount } from "enzyme";
import UU5 from "uu5g04";
import createReactClass from "create-react-class";

const TagName = "UU5.Common.LevelMixin";

const Component = createReactClass({
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.LevelMixin, UU5.Common.ContentMixin],
  statics: {
    tagName: "Component"
  },
  render() {
    return <div {...this.getMainAttrs()}>{this.getChildren()}</div>;
  }
});
const IncreaseLevel = createReactClass({
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.LevelMixin, UU5.Common.ContentMixin],
  statics: {
    tagName: "IncreaseLevel",
    opt: {
      increaseLevel: true
    }
  },
  render() {
    return <div {...this.getMainAttrs()}>{this.getChildren()}</div>;
  }
});

describe(`${TagName} - interface`, () => {
  it(`getLevel`, () => {
    const wrapper = mount(
      <Component>
        <IncreaseLevel id="id0">
          <Component id="id1" level="3">
            <Component id="id1-1" />
            <Component id="id1-2" level={5} />
            <IncreaseLevel id="id1-3" />
            <IncreaseLevel id="id1-4" level="6" />
          </Component>
        </IncreaseLevel>
      </Component>
    );
    let instance = wrapper.instance();
    expect(instance.getLevel()).toBe(0);

    // prettier-ignore
    {
      expect(wrapper.find("#id0").first().instance().getLevel()).toBe(1);
      expect(wrapper.find("#id1").first().instance().getLevel()).toBe(3);
      expect(wrapper.find("#id1-1").first().instance().getLevel()).toBe(3);
      expect(wrapper.find("#id1-2").first().instance().getLevel()).toBe(5);
      expect(wrapper.find("#id1-3").first().instance().getLevel()).toBe(4);
      expect(wrapper.find("#id1-4").first().instance().getLevel()).toBe(6);

      // props change
      wrapper.setProps({ level: 1 });
      expect(wrapper.instance().getLevel()).toBe(1);
      expect(wrapper.find("#id0").first().instance().getLevel()).toBe(2);
      wrapper.setProps({ level: undefined });
      expect(wrapper.instance().getLevel()).toBe(0);
      expect(wrapper.find("#id0").first().instance().getLevel()).toBe(1);
    }
  });

  it(`checkLevel`, () => {
    const wrapper = mount(
      <Component>
        <IncreaseLevel id="id0">
          <Component id="id1" level="3">
            <Component id="id1-1" />
            <Component id="id1-2" level={5} />
            <IncreaseLevel id="id1-3" />
            <IncreaseLevel id="id1-4" level="6" />
          </Component>
        </IncreaseLevel>
      </Component>
    );
    let instance = wrapper.instance();
    expect(instance.checkLevel()).toBe(0);

    // prettier-ignore
    {
      expect(wrapper.find("#id0").first().instance().checkLevel()).toBe(1);
      expect(wrapper.find("#id1").first().instance().checkLevel()).toBe(3);
      expect(wrapper.find("#id1-1").first().instance().checkLevel()).toBe(3);
      expect(wrapper.find("#id1-2").first().instance().checkLevel()).toBe(5);
      expect(wrapper.find("#id1-3").first().instance().checkLevel()).toBe(4);
      expect(wrapper.find("#id1-4").first().instance().checkLevel()).toBe(6);

      // next props
      let nextProps1 = Object.assign({}, wrapper.props(), { level: 1 });
      expect(instance.checkLevel(nextProps1)).toBe(1);
      let nextProps2 = Object.assign({}, wrapper.props(), { level: undefined });
      expect(instance.checkLevel(nextProps2)).toBe(0);
    }
  });
});
