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
  props: {},
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Text`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Text, CONFIG);
});

describe(`UU5.Bricks.Text docKit examples`, () => {
  it(`UU5.Bricks.Text should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID01"}>
        <UU5.Bricks.Text id={"uuID02"}>Text in Bricks.Text</UU5.Bricks.Text>
        <UU5.Bricks.Text id={"uuID03"} disabled>
          Text is disabled in Bricks.Text
        </UU5.Bricks.Text>
        <UU5.Bricks.Text id={"uuID04"} colorSchema="cyan" className="center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </UU5.Bricks.Text>
        <br />
        <UU5.Bricks.Text id={"uuID05"}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in leo sed odio dictum pellentesque.
          <UU5.Bricks.Text id={"uuID06"} colorSchema="red">
            Suspendisse sagittis accumsan mi, a pulvinar sem luctus nec.
          </UU5.Bricks.Text>
          Morbi pharetra eleifend mauris in viverra. Morbi turpis diam.
        </UU5.Bricks.Text>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
