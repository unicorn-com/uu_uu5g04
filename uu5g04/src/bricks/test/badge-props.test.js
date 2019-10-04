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
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {

  },
  requiredProps: {},
  opt: {
  }
};


describe(`UU5.Bricks.Badge`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Badge, CONFIG);
});

describe(`UU5.Bricks.Badge badge is nested in another Component`, () => {

  it(`UU5.Bricks.Badge with Icon`, () => {
    const tree = shallow(
      <UU5.Bricks.Container id={"uuID"}>
      <UU5.Bricks.TouchIcon id={"uuID2"} icon="mdi-account-multiple" bgStyle="transparent" className="icon" />
      <UU5.Bricks.Badge id={"uuID3"} content="3" className="badge1" colorSchema="red" />
      </UU5.Bricks.Container>
    );
    expect(tree).toMatchSnapshot();
  });

  it(`UU5.Bricks.Badge redner into Link`, () => {
    const tree = shallow(
      <UU5.Bricks.Link id={"uuID"} href="#">Updates
        <UU5.Bricks.Badge id={"uuID2"} content="4" />
      </UU5.Bricks.Link>
    );
    expect(tree).toMatchSnapshot();
  });

  it(`UU5.Bricks.Badge render into Button`, () => {
    const tree = shallow(
      <UU5.Bricks.Button id={"uuID"} size="l" colorSchema="primary">
        Fresh
        <UU5.Bricks.Badge id={"uuID2"} content="152" colorSchema="purple" />
      </UU5.Bricks.Button>
    );
    expect(tree).toMatchSnapshot();
  });

});


