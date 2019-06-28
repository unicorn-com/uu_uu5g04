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
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";
import renderer from 'react-test-renderer';
import createReactClass from "create-react-class";

/**
 * This is a created component for the Allow Tags test.
 * It is tested that a self-created component can be inserted into the accordion under its own brand.
 */
const MyAllowTagsComponents = createReactClass({
  mixins: [UU5.Common.BaseMixin],
  statics: {tagName: "UU5.Example.MyCompButton", classNames: {main: "mytr"}},
  render() {
    return (
      <UU5.Example.MyCompButton {...this.getMainPropsToPass()}/>
    );
  }
});

const TagName = "UU5.Bricks.ContextMenu";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.CcrWriterMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.NestingLevelMixin"
  ],
  props: {
    shown: {
      values: [true, false]
    },
    // parentElement: {}, - Expression from DEV - Do not test this props.
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"]
    }
  },
  requiredProps: {
    children: [<UU5.Bricks.ContextMenu.Item id={"uuID2"} label="Ráno" icon="mdi-weather-sunset-up"/>]
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


  it(`${TagName} myComponent from allowTags is used`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ContextMenu id={"uuID"} shown={true} header='Header'
                              footer='Footer' allowTags={["UU5.Example.MyCompButton"]}>
        <UU5.Bricks.ContextMenu.Item
          id={"uuID2"}
          label="Ráno"
          icon="mdi-weather-sunset-up"
          space
        />
        <MyAllowTagsComponents id={"allowId"} content={"allowTagsContent"}/>
      </UU5.Bricks.ContextMenu>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });


  it(`${TagName} example make snapshot`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ContextMenu id={"uuID"} shown={true} header='Header' footer='Footer'>
        <UU5.Bricks.ContextMenu.Item
          id={"uuID2"}
          label="Ráno"
          icon="mdi-weather-sunset-up"
          space
        />
        <UU5.Bricks.ContextMenu.Item
          id={"uuID3"}
          label="Dopoledne"
          space
        />
        <UU5.Bricks.ContextMenu.Item
          id={"uuID4"}
          label="V poledne"
          icon="mdi-weather-sunny"
          space
          disabled
        />
        <UU5.Bricks.ContextMenu.Item
          id={"uuID5"}
          label="Odpoledne"
          space
        />
        <UU5.Bricks.ContextMenu.Item
          id={"uuID6"}
          label="Večer"
          icon="mdi-weather-sunset"
        />
        <UU5.Bricks.ContextMenu.Item
          id={"uuID7"}
          divider
        />
        <UU5.Bricks.ContextMenu.Item
          id={"uuID10"}
          label="Úplně jiné"
          disabled
        />
      </UU5.Bricks.ContextMenu>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });
});










