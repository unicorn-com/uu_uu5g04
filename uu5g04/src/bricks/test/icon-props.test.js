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
import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    icon: {
      values: [
        "uu5-alert-circle",
        "uu5-arrow-down",
        "uu5-arrow-left",
        "uu5-arrow-right",
        "uu5-arrow-up",
        "uu5-calendar",
        "uu5-clock",
        "uu5-cross",
        "uu5-error-circle",
        "uu5-finder",
        "uu5-flag-upload",
        "uu5-menu",
        "uu5-minus",
        "uu5-ok",
        "uu5-ok-circle",
        "uu5-person",
        "uu5-picture",
        "uu5-plus",
        "uu5-point",
        "uu5-thumb"
      ]
    },
    clickable: {
      values: [true, false]
    }
    // // TODO Make SVG loading in UU5.Bricks.Icon mockable.
    // authenticate: {
    //   values: [true, false],
    //   requiredProps: {
    //     src:
    //       "https://uuos9.plus4u.net/uu-bookkitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/getBinaryData?code=testSvg" // to pass "trusted domain" check and therefore add access_token parameter based on the prop
    //   }
    // }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.Icon`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Icon, CONFIG);
});

describe(`UU5.Bricks.Icon docKit examples`, () => {
  it(`UU5.Bricks.Icon should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Icon id={"uuID02"} icon="mdi-check" />
        <UU5.Bricks.Button id="butID" colorSchema="info">
          <UU5.Bricks.Icon id={"uuID03"} icon="mdi-magnify" /> Search
        </UU5.Bricks.Button>
        <UU5.Bricks.Link id={"idLINK"} href="#">
          <UU5.Bricks.Icon id={"uuID04"} icon="mdi-facebook" />
        </UU5.Bricks.Link>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
