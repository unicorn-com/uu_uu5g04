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

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    name: {
      values: ["Summer"],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Tabs id={"idParent"} value={"Tabs values"} stacked={true} />).instance(),
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

describe(`UU5.Bricks.Tabs.Item`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Tabs.Item, CONFIG);
});

describe(`UU5.Bricks.Tabs.Item docKit examples`, () => {
  it(`UU5.Bricks.Tabs.Item should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tabs id={"uuID01"} fade>
        <UU5.Bricks.Tabs.Item id={"uuID"} header="Tab 1">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Class aptent taciti sociosqu ad litora
        </UU5.Bricks.Tabs.Item>
        <UU5.Bricks.Tabs.Item id={"uuID2"} header="Tab 2">
          torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in, auctor et, scelerisque
          sed, est.
        </UU5.Bricks.Tabs.Item>
        <UU5.Bricks.Tabs.Item id={"uuID3"} header="Tab 3">
          torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in, auctor et, scelerisque
          sed, est. torquent per conubia nostra, per inceptos hymenaeos. Donec ipsum massa, ullamcorper in, auctor et,
          scelerisque sed, est.
        </UU5.Bricks.Tabs.Item>
      </UU5.Bricks.Tabs>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
