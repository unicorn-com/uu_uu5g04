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

const SLIDER = shallow(<UU5.Bricks.Slider id="parentId" value={20} />).instance();
const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin", "UU5.Common.ContentMixin"],
  props: {
    value: {
      values: [10, 100],
    },
  },
  requiredProps: {
    parent: SLIDER,
    _checkValue: SLIDER._checkValue,
    _getStyle: SLIDER._getStyle,
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Slider.Item`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Slider.Item, CONFIG);

  it("Take snapshot", () => {
    const wrapper = shallow(
      <UU5.Bricks.Slider id={"uuID"}>
        <UU5.Bricks.Slider.Item id={"uuID02"} content="1" />
        <UU5.Bricks.Slider.Item id={"uuID03"} content="2" value={3} />
      </UU5.Bricks.Slider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
