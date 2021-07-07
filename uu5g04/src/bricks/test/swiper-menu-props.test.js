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
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    pullRight: {
      value: [true, false],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Swiper id="parentId" />).instance(),
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Swiper.Menu`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Swiper.Menu, CONFIG);
});

describe(`UU5.Bricks.Swiper.Menu docKit examples`, () => {
  it(`UU5.Bricks.Swiper.Menu example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Swiper
        id={"uuID"}
        style={{
          backgroundColor: "lightblue",
          minHeight: "200px",
          width: "100%",
        }}
      >
        {/*@@viewOn:0*/}
        <UU5.Bricks.Swiper.Menu id={"idA"} style={{ backgroundColor: "lightgrey" }}>
          <UU5.Bricks.Button id={"idB"} content="Close" onClick={() => this._swiper.closeLeftMenu()} />
        </UU5.Bricks.Swiper.Menu>
        <UU5.Bricks.Swiper.Body id={"uuID2"}>
          <UU5.Bricks.P id={"uuID3"} className="center">
            On touch screen you can open menus by swipe on blue area. If you dont have touchscreen, turn on
            console(chrome - F12) and switch to mobile device view by pressing icon at top left corner of the console or
            by pressing ctrl+shift+M.
          </UU5.Bricks.P>
        </UU5.Bricks.Swiper.Body>
        {/*@@viewOff:0*/}
      </UU5.Bricks.Swiper>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
