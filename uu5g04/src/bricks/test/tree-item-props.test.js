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
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.NestingLevelMixin"
  ],
  props: {
    label: {
      values: ["Tree items label"]
    },
    iconCollapsed: {
      values: ["uu5-plus"]
    },
    iconExpanded: {
      values: ["uu5-calendar"]
    },
    expanded: {
      values: [true, false]
    },
    items: {
      values: [
        [{ label: "Item 1", items: [{ label: "Item 1.1" }] }, { label: "Item 2", items: [{ label: "Item 2.1" }] }]
      ]
    }
  },
  requiredProps: {
    parent: shallow(
      <UU5.Bricks.Tree.List
        parent={shallow(<UU5.Bricks.Tree id={"idParentTree"} />).instance()}
        id={"idParent"}
        iconExpanded="mdi-menu-down"
        iconCollapsed="mdi-menu-right"
      />
    ).instance()
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.Tree.Item`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Tree.Item, CONFIG);
});

describe(`UU5.Bricks.Tree.Item docKit examples`, () => {
  it(`UU5.Bricks.Tree.Item should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Tree id={"idROT"} size="xl">
        <UU5.Bricks.Tree.Item id={"uuID01"} label="Movies" expanded>
          <UU5.Bricks.Tree.Item id={"uuID02"} label="Comedies">
            <UU5.Bricks.Tree.Item id={"uuID03"} label="Anchorman" />
            <UU5.Bricks.Tree.Item id={"uuID04"} label="Yesman" />
          </UU5.Bricks.Tree.Item>
        </UU5.Bricks.Tree.Item>
      </UU5.Bricks.Tree>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
