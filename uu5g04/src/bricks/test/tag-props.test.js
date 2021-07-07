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

const { shallow } = UU5.Test.Tools;

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.NestingLevelMixin"],
  props: {
    icon: {
      values: ["mdi-check", "uubml-symbol-state-s02"],
    },
    iconAfter: {
      values: ["mdi-check", "uubml-symbol-state-s02"],
    },
    size: {
      values: ["m", "s"],
    },
    state: {
      values: [
        "system",
        "initial",
        "active",
        "final",
        "alternativeActive",
        "problemActive",
        "passive",
        "alternativeFinal",
        "cancel",
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

describe(`UU5.Bricks.Tag`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Tag, CONFIG);
});

describe(`UU5.Bricks.Tag render example`, () => {
  it(`UU5.Bricks.Tag should render without crash`, () => {
    const wrapper = shallow(<UU5.Bricks.Tag id="uuID" />);
    expect(wrapper).toMatchSnapshot();
  });
});
