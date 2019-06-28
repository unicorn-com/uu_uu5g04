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

import React from 'react';
import {shallow} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import TestTools from "../../core/test/test-tools.js";
import renderer from 'react-test-renderer';


const TagName = "UU5.Bricks.Row";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    display: {
      values: ["standard", "flex"]
    },
    noSpacing: {
      values: [true, false]
    }
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Container id="parentId"/>).instance(),
    children: [<UU5.Bricks.Column id={"childID"} colWidth="xs12 s3" style="backgroundColor: yellow"
                                  content={"child column"}/>]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: true
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});


describe(`${TagName} docKit examples`, () => {
  it(`${TagName} should render without crash`, () => {
    const wrapper = renderer.create(
      <UU5.Bricks.Container>
        <UU5.Bricks.Row>
          <UU5.Bricks.Column colWidth="xs12 s3" style="backgroundColor: yellow">
            <UU5.Bricks.P>First Column</UU5.Bricks.P>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs12 s3" style="backgroundColor: orange">
            <UU5.Bricks.P>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper dignissim
              iaculis.</UU5.Bricks.P>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs12 s3" style="backgroundColor: red">
            <UU5.Bricks.P>Third Column</UU5.Bricks.P>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs12 s3" style="backgroundColor: pink">
            <UU5.Bricks.P>Forth Column</UU5.Bricks.P>
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
        <UU5.Bricks.Row display="flex">
          <UU5.Bricks.Column colWidth="xs12 s3" style="backgroundColor: yellow">
            <UU5.Bricks.P>First Column</UU5.Bricks.P>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs12 s3" style="backgroundColor: orange">
            <UU5.Bricks.P>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper dignissim
              iaculis.</UU5.Bricks.P>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs12 s3" style="backgroundColor: red">
            <UU5.Bricks.P>Third Column</UU5.Bricks.P>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth="xs12 s3" style="backgroundColor: pink">
            <UU5.Bricks.P>Forth Column</UU5.Bricks.P>
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
      </UU5.Bricks.Container>
    ).toJSON();
    expect(wrapper).toMatchSnapshot();
  });
});










