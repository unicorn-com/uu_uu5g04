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
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    agreedText: {
      values: ["I agree"],
    },
    infoText: {
      values: ["More information"],
    },
    infoHref: {
      values: ["https://unicorn.com/cz/cookies"],
    },
    infoTarget: {
      values: ["_blank", "_parent", "_top", "_self"],
    },
    fixed: {
      values: ["top", "bottom"],
    },
    //onAgree
    expireDays: {
      values: [365],
    },
    cookieKey: {
      values: ["UCL.Parrot.Home_123v12"],
    },
    cookieValue: {
      values: ["yes", "no"],
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const This = {};

describe(`UU5.Bricks.CookieBar`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.CookieBar, CONFIG);
});

describe(`UU5.Bricks.CookieBar example DocKit`, () => {
  it(`UU5.Bricks.CookieBar example 01 should render`, () => {
    let localStorage = jest.fn();
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.CookieBar id={"uuID2"} colorSchema="blue" className="relative" agreedText="Unicorn" />
        <UU5.Bricks.CookieBar id={"uuID3"} colorSchema="blue" className="relative" infoText="More information" />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
