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
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ContentMixin",
  ],
  props: {
    screenSize: {
      values: ["xs", "s", "m", "l", "xl"],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.ScreenSize id={"parent"} />).instance(),
    screenSize: "xs",
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

describe(`UU5.Bricks.ScreenSize.Item`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.ScreenSize.Item, CONFIG);
});

describe("Test UU5.bricks.ScreenSize.items own props", () => {
  it("props.ScreeSize - test", () => {
    //component wil be render only if you set screeSize L.
    const wrapper = shallow(
      <UU5.Bricks.ScreenSize id="uuIDroot">
        <UU5.Bricks.ScreenSize.Item id={"uuID4"} screenSize={"l"}>
          <UU5.Bricks.Span content="Content for M-XL" />
        </UU5.Bricks.ScreenSize.Item>
      </UU5.Bricks.ScreenSize>
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ screenSize: "xl" });
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ screenSize: "m" });
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ screenSize: "s" });
    expect(wrapper).toMatchSnapshot();
    wrapper.setProps({ screenSize: "xs" });
    expect(wrapper).toMatchSnapshot();
  });
});

let baseMixinprops = {
  id: "myId",
  name: "myName",
  tooltip: "My Tooltip",
  className: "my-classname",
  style: "padding:8px; borderRadius: 2px",
  mainAttrs: {
    style: [{ backgroundColor: "red", color: "blue" }],
  },
  // parent: {},
  // ref_: {},
  noIndex: true,
};

let elementaryMixinprops = {
  hidden: true,
  disabled: true,
  selected: true,
  controlled: false,
};

let contentMixinprops = {
  content: "This is Content from ContentMixin",
  ignoreHTML: true,
  checkSpaces: true,
  checkGrammar: true,
  checkHighlight: true,
  textCorrector: true,
  dynamic: true,
  mode: "standart",
};

let nestingLevelMixinprops = {
  nestingLevel: "boxCollection",
};

describe("Mixin Props testing", () => {
  it("Default values", () => {
    const wrapper = shallow(
      <UU5.Bricks.ScreenSize id="uuIDroot">
        <UU5.Bricks.ScreenSize.Item id={"uuID4"} screenSize={"l"}>
          <UU5.Bricks.Span content="Content for M-XL" />
        </UU5.Bricks.ScreenSize.Item>
      </UU5.Bricks.ScreenSize>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("props of BaseMixin", () => {
    const wrapper = shallow(
      <UU5.Bricks.ScreenSize id="uuIDroot">
        <UU5.Bricks.ScreenSize.Item id={"uuID4"} screenSize={"l"} {...baseMixinprops}>
          <UU5.Bricks.Span content="Content for M-XL" />
        </UU5.Bricks.ScreenSize.Item>
      </UU5.Bricks.ScreenSize>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("props of ElementaryMixin", () => {
    const wrapper = shallow(
      <UU5.Bricks.ScreenSize id="uuIDroot">
        <UU5.Bricks.ScreenSize.Item id={"uuID4"} screenSize={"l"} {...elementaryMixinprops}>
          <UU5.Bricks.Span content="Content for M-XL" />
        </UU5.Bricks.ScreenSize.Item>
      </UU5.Bricks.ScreenSize>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("props of NestingLevelMixin", () => {
    const wrapper = shallow(
      <UU5.Bricks.ScreenSize id="uuIDroot">
        <UU5.Bricks.ScreenSize.Item id={"uuID4"} screenSize={"l"} {...nestingLevelMixinprops}>
          <UU5.Bricks.Span content="Content for M-XL" />
        </UU5.Bricks.ScreenSize.Item>
      </UU5.Bricks.ScreenSize>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.ScreenSize.Item docKit examples`, () => {
  it(`UU5.Bricks.ScreenSize.Item should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ScreenSize id={"uuID"}>
        <UU5.Bricks.ScreenSize.Item id={"uuID2"} screenSize="xs">
          <UU5.Bricks.Span content="Content for XS" />
        </UU5.Bricks.ScreenSize.Item>
        <UU5.Bricks.ScreenSize.Item id={"uuID3"} screenSize="s">
          <UU5.Bricks.Span content="Content for S" />
        </UU5.Bricks.ScreenSize.Item>
        <UU5.Bricks.ScreenSize.Item id={"uuID4"} screenSize={["m", "l", "xl"]}>
          <UU5.Bricks.Span content="Content for M-XL" />
        </UU5.Bricks.ScreenSize.Item>
      </UU5.Bricks.ScreenSize>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
