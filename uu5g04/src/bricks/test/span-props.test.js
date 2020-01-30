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

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {},
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.Span`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Span, CONFIG);
});

describe(`UU5.Bricks.Span docKit examples`, () => {
  it(`UU5.Bricks.Span should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Span id={"uuID02"} style={{ color: "red", fontSize: "30px" }}>
          Lorem ipsum
        </UU5.Bricks.Span>{" "}
        dolor sit amet, consectetur{" "}
        <UU5.Bricks.Span id={"uuID03"} style={{ backgroundColor: "#64B5F6" }}>
          adipiscing elit.
        </UU5.Bricks.Span>
        Aliquam eu sollicitudin{" "}
        <UU5.Bricks.Span id={"uuID04"} style={{ fontWeight: "bold" }}>
          elit
        </UU5.Bricks.Span>
        .
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
