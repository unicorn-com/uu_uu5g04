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
    "UU5.Common.SectionMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin"
  ],
  props: {
    columnsCount: {
      values: [1, 2, 3, 4, 5, 6]
    }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.Newspaper`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Newspaper, CONFIG);
});

describe(`UU5.Bricks.Newspaper docKit examples`, () => {
  it(`UU5.Bricks.Newspaper should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"iiROOT"}>
        <UU5.Bricks.Newspaper id={"uuID"} columnsCount={3}>
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas libero. Aliquam erat volutpat. Duis
          condimentum augue id magna semper rutrum. Nam quis nulla. Etiam commodo dui eget wisi. Fusce suscipit libero
          eget elit. Etiam bibendum elit eget erat. Vestibulum erat nulla, ullamcorper nec,rutrum non, nonummy ac, erat.
          Etiam neque. Vivamus luctus egestas leo. Integer in sapien. Nullam sapien sem, ornare ac, nonummy non,
          lobortis a enim. Donec quis nibh at felis congue commodo. Pellentesque arcu. In enim a arcu imperdiet
          malesuada. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id
          lacus. Cras pede libero, dapibus nec, pretium sit amet, tempor quis. Quis autem vel eum iure reprehenderit qui
          in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas
          nulla pariatur? Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra
          metus odio a lectus. Duis sapien nunc, commodo et, interdum suscipit, sollicitudin et, dolor. Fusce aliquam
          vestibulum ipsum. Duis ante orci, molestie vitae vehicula venenatis, tincidunt ac pede. Aenean id metus id
          velit ullamcorper pulvinar.
        </UU5.Bricks.Newspaper>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
