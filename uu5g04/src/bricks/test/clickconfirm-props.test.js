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
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.CcrWriterMixin",
  ],
  props: {
    // NOTE Skipping because the controlled doesn't work properly with hidden and there's
    // hard to estimate how to change it without breaking compatibility.
    controlled: {
      values: [true, false],
      opt: {
        skip: true,
      },
    },
  },
  requiredProps: {
    controlled: false,
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const This = {};

describe(`UU5.Bricks.ClickConfirm`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.ClickConfirm, CONFIG);
});

describe("UU5.Bricks.ClickConfirm - example in dockit", () => {
  it("example in dockit", () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"containerID"}>
        <UU5.Bricks.ClickConfirm id={"uuOID"} ref_={(click) => (this._click = click)} />
        <UU5.Bricks.TouchIcon
          id={"uuID"}
          content="open"
          icon="mdi-verified"
          colorSchema="pink"
          onClick={(button, event) => {
            this._click.open({
              content: <UU5.Bricks.Badge id={"idBadge"} content="Verified" />,
              event: event,
            });
          }}
        />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
