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

const MyColumnComponent = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],

  statics: { tagName: "UU5.Example.MyColumnComponent", classNames: { main: "mytr" } },

  render() {
    return <UU5.Example.MyColumnComponent {...this.getMainPropsToPass()} span={1} colorSchema="purple-rich" />;
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    allowTags: {
      allowTagsArray: ["UU5.Example.MyColumnComponent"],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Bricks.Table id="parentId" />).instance(),
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Table.ColGroup`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Table.ColGroup, CONFIG);

  it("props-allowTags", () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header="Table" id={"uuID01"}>
        {/*@@viewOn:0*/}
        <UU5.Bricks.Table.ColGroup id={"uuID02"}>
          <UU5.Bricks.Table.Col id={"uuID03"} />
          <MyColumnComponent id={"allowID"} />
        </UU5.Bricks.Table.ColGroup>
        {/*@@viewOff:0*/}
        <UU5.Bricks.Table.THead id={"uuID04"}>
          <UU5.Bricks.Table.Tr id={"uuID05"}>
            <UU5.Bricks.Table.Th id={"uuID06"} content="Name" />
            <UU5.Bricks.Table.Th id={"uuID07"} content="Rank" />
            <UU5.Bricks.Table.Th id={"uuID08"} content="Promotion prospects" />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>
      </UU5.Bricks.Table>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.Table.ColGroup docKit examples`, () => {
  it("props-allowTags", () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header="Table" footer="Table footer" id={"uuID1"}>
        <UU5.Bricks.Table.ColGroup id={"uuIDGroup"} allowTags={["UU5.Example.MyColumnComponent"]}>
          <MyColumnComponent id={"myIDs"} />
          <UU5.Bricks.Table.Col id={"uuIDlast"} span={2} colorSchema="red" />
        </UU5.Bricks.Table.ColGroup>
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content="Name" id={"uuID4"} />
            <UU5.Bricks.Table.Th content="Rank" id={"uuID5"} />
            <UU5.Bricks.Table.Th content="Promotion prospects" id={"uuID5"} />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>
      </UU5.Bricks.Table>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
