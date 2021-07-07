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
    progress: {
      values: [0, 50, 100],
    },
    striped: {
      values: [true, false],
    },
    animated: {
      values: [true, false],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.ProgressBar id="parentId" />).instance(),
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.ProgressBar.Item`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.ProgressBar.Item, CONFIG);
});

describe(`UU5.Bricks.ProgressBar.Item docKit examples`, () => {
  it(`UU5.Bricks.ProgressBar.Item should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ProgressBar id={"uuID"}>
        {/*@@viewOn:0*/}
        <UU5.Bricks.ProgressBar.Item id={"uuID2"} progress={20} striped colorSchema="blue" />
        <UU5.Bricks.ProgressBar.Item id={"uuID3"} progress={30} colorSchema="purple" />
        <UU5.Bricks.ProgressBar.Item id={"uuID4"} progress={45} animated colorSchema="red" />
        {/*@@viewOff:0*/}
      </UU5.Bricks.ProgressBar>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
