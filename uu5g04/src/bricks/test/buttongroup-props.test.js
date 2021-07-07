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

//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

/**
 * This is a created component for the Allow Tags test.
 * It is tested that a self-created component can be inserted into the buttonGroup under its own brand.
 */
const MyAllowTagsComponents = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],
  statics: { tagName: "UU5.Example.MyCompButton", classNames: { main: "mytr" } },
  render() {
    return <UU5.Example.MyCompButton {...this.getMainPropsToPass()} />;
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    size: {
      values: ["s", "m", "l", "xl"],
    },
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"],
    },
    vertical: {
      values: [true, false],
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"],
    },
  },
  requiredProps: {},
  opt: {},
};

describe(`UU5.Bricks.ButtonGroup props testing`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.ButtonGroup, CONFIG);
});

describe(`UU5.Bricks.ButtonGroup docKit example - contain another components`, () => {
  it(`UU5.Bricks.ButtonGroup packaging another component`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonGroup id={"uuID"} size="s">
        <UU5.Bricks.Button id={"uuID2"} content="Home" />
        <UU5.Bricks.Dropdown id={"uuID3"} content="Dropdown" />
      </UU5.Bricks.ButtonGroup>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.ButtonGroup Component from allow tags is used in example`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ButtonGroup id={"uuID"} size="s" allowTags={["UU5.Example.MyCompButton"]}>
        <MyAllowTagsComponents tooltip={"This is my allowTags Component"} id={"myAllowTagsID"} />
        <UU5.Bricks.Button id={"uuID2"} content="Home" />
        <UU5.Bricks.Dropdown id={"uuID3"} content="Dropdown" />
      </UU5.Bricks.ButtonGroup>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
