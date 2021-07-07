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

//`UU5.Bricks.Address`

const CONFIG = {
  mixins: ["UU5.Common.BaseMixin", "UU5.Common.ElementaryMixin", "UU5.Common.ContentMixin"],
  props: {
    //The component does not have any props
  },
  requiredProps: {},
  opt: {},
};

describe(`UU5.Bricks.Address`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Address, CONFIG);

  it(`UU5.Bricks.Address docKit example`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Address id={"uuID"}> Stanley Stalion Sunny Street 42 Savannah States </UU5.Bricks.Address>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
