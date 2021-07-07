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
import "uu5g04-block-layout";

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
    actions: {
      values: [
        [
          {
            icon: "mdi-phone",
            active: true,
            content: "Phone",
            onClick: () => null,
          },
          {
            icon: "mdi-phone",
            content: "Phone",
            active: true,
            bgStyle: "transparent",
            borderRadius: "8px",
            disabled: true,
            onClick: () => null,
          },
          {
            icon: "mdi-phone",
            content: {
              cs: "Telefon",
              en: "Phone",
            },
            onClick: () => null,
          },
        ],
        [
          {
            icon: "mdi-phone",
            content: "Phone",
            onClick: () => null,
          },
          {
            icon: "mdi-phone",
            content: {
              cs: "Telefon",
              en: "Phone",
            },
            onClick: () => null,
          },
        ],
        [
          {
            activeContent: "Phone",
            content: "Call",
            icon: "mdi-phone",
            onClick: () => null,
          },
        ],
        [
          {
            activeContent: "Phone",
            content: "Call",
            activeIcon: "mdi-check",
            icon: "mdi-phone",
            onClick: () => null,
          },
        ],
        [
          {
            icon: "mdi-settings",
            content: "Settings",
            active: true,
            colorSchema: "primary",
            onClick: () => null,
          },
        ],
        [
          { icon: "mdi-email", content: "Send E-mail", onClick: () => null },
          { icon: "mdi-settings", content: "Settings", onClick: () => null },
        ],
      ],
    },
  },
  requiredProps: {
    children: <UU5.BlockLayout.Row>Test</UU5.BlockLayout.Row>,
  },
  opt: {},
};

describe(`UU5.BlockLayout.Block props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.BlockLayout.Block, CONFIG);

  it(`UU5.BlockLayout.Block menuBgStyle, menuColorSchema, menuBorderRadius`, () => {
    const wrapper = shallow(
      <UU5.BlockLayout.Block
        menuColorSchema="success"
        menuBgStyle="filled"
        menuBorderRadius="8px"
        actions={[
          {
            icon: "mdi-settings",
            content: "Settings",
            active: true,
            colorSchema: "primary",
            onClick: () => null,
          },
          { icon: "mdi-email", content: "Send E-mail", onClick: () => null },
          { icon: "mdi-settings", content: "Settings", onClick: () => null },
        ]}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
