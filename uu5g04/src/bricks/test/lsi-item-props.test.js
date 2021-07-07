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
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    language: {
      values: ["en", "cs"],
    },
  },
  requiredProps: {
    language: "en-us",
    parent: shallow(
      <UU5.Bricks.Lsi
        id="parentId"
        lsi={{
          cs: "cs, sk -> (cs) Při neznámém jazyku se zobrazí první v lsi",
          sk: "cs, sk -> (sk) Pri neznámom jazyku sa zobrazí prvý v lsi",
        }}
      />
    ).instance(),
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Lsi.Item props`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Lsi.Item, CONFIG);
});

describe(`UU5.Bricks.Lsi.Item docKit example`, () => {
  it(`UU5.Bricks.Lsi.Item example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID0"}>
        <UU5.Bricks.Lsi.Item id={"uuID1"} language="cs">
          Item: cs, en, sk - (cs) Při neznámém jazyku se zobrazí Environment.defaultLanguage en
        </UU5.Bricks.Lsi.Item>
        <UU5.Bricks.Lsi.Item
          id={"uuID2"}
          language="en"
          content="Item: cs, en, sk -> (en) When an unknown language is displayed Environment.defaultLanguage en"
        />
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
