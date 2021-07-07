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
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    size: {
      values: ["s", "m", "l", "xl"],
    },
    switchedOn: {
      values: [true, false],
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"],
    },
    props: {
      values: [{ size: "s" }],
    },
    onProps: {
      values: [{ colorSchema: "success", pressed: true }],
    },
    offProps: {
      values: [{ colorSchema: "danger", pressed: false }],
    },
  },
  requiredProps: {},
  opt: {},
};

describe(`UU5.Bricks.ButtonSwitch props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.ButtonSwitch, CONFIG);

  const This = {};

  it(`UU5.Bricks.ButtonSwitch with combination of props, onProps, onProps`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"switchID"}
        ref_={(item) => (This._buttonSwitch = item)}
        props={{
          onClick: () => This._buttonSwitch.toggle(),
          content: "props content",
        }}
        onProps={{
          content: "onProps content",
        }}
        offProps={{
          content: "offProps content",
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
    wrapper.simulate("click");
    expect(wrapper).toMatchSnapshot();
  });

  //If I click to buttonSwitch the content turned off button it turns to turned on
  it(`UU5.Bricks.ButtonSwitch with onClick`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonSwitch
        id={"switchID"}
        ref_={(item) => (This._buttonSwitch = item)}
        props={{
          onClick: () => This._buttonSwitch.toggle(),
        }}
        onProps={{
          colorSchema: "default",
          content: "turned on",
        }}
        offProps={{
          content: "turned off",
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    wrapper.simulate("click");
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
