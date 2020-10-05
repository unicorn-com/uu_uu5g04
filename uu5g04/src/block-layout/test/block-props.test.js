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
          },
          {
            icon: "mdi-phone",
            content: "Phone",
            active: true,
            bgStyle: "transparent",
            borderRadius: "8px",
            disabled: true,
          },
          {
            icon: "mdi-phone",
            content: {
              cs: "Telefon",
              en: "Phone",
            },
          },
        ],
        [
          {
            icon: "mdi-phone",
            content: "Phone",
          },
          {
            icon: "mdi-phone",
            content: {
              cs: "Telefon",
              en: "Phone",
            },
          },
        ],
        [
          {
            activeContent: "Phone",
            content: "Call",
            icon: "mdi-phone",
          },
        ],
        [
          {
            activeContent: "Phone",
            content: "Call",
            activeIcon: "mdi-check",
            icon: "mdi-phone",
          },
        ],
        [
          {
            icon: "mdi-settings",
            content: "Settings",
            active: true,
            colorSchema: "primary",
          },
        ],
        [
          { icon: "mdi-email", content: "Send E-mail" },
          { icon: "mdi-settings", content: "Settings" },
        ],
      ],
    },
  },
  requiredProps: {
    onClick: () => "TODO",
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
          },
          { icon: "mdi-email", content: "Send E-mail" },
          { icon: "mdi-settings", content: "Settings" },
        ]}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
