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
