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
import React from "react";
import UU5 from "uu5g04";
import createReactClass from "create-react-class";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const Component = createReactClass({
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.LevelMixin, UU5.Common.ContentMixin],
  statics: {
    tagName: "Component",
  },
  render() {
    return <div {...this.getMainAttrs()}>{this.getChildren()}</div>;
  },
});
const IncreaseLevel = createReactClass({
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.LevelMixin, UU5.Common.ContentMixin],
  statics: {
    tagName: "IncreaseLevel",
    opt: {
      increaseLevel: true,
    },
  },
  render() {
    return <div {...this.getMainAttrs()}>{this.getChildren()}</div>;
  },
});

describe(`UU5.Common.LevelMixin - interface`, () => {
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
