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
import UU5 from "uu5g04";
import "uu5g04-bricks";
import TestTools from "../../core/test/test-tools.js";
import renderer from 'react-test-renderer';

const TagName = "UU5.Bricks.Blockquote";

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
    background: {
      values: [true, false]
    },
    alignment: {
      values: ["left", "right"]
    },
    footer: "My Footer Content"
    ,
    footerAlignment: {
      values: ["left", "right"]
    },
    noSpacing: {
      values: [true, false]
    }
  },
  requiredProps: {},
  opt: {
    enzymeToJson: false
  }
};


describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe('HTML render into snapshot', () => {

  it('Blockquote should render as HTML', () => {
    const tree = renderer.create(
      <UU5.Bricks.Blockquote>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </UU5.Bricks.Blockquote>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

});




