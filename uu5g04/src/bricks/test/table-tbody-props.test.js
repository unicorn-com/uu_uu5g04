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
    "UU5.Common.ContentMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompButton"],
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

describe(`UU5.Bricks.Table.TBody`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Table.TBody, CONFIG);

  it("props.allowTags - example", () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header="Table" footer="Table footer" id={"uuID1"}>
        <UU5.Bricks.Table.TBody id={"uuID2"} colorSchema="blue" allowTags={["UU5.Example.MyCompButton"]}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Td id={"uuID4"} content="Rimmer" />
            <UU5.Bricks.Table.Td id={"uuID5"} content="2nd class technician" />
            <UU5.Bricks.Table.Td id={"uuID6"} content="comical" />
          </UU5.Bricks.Table.Tr>
          <UU5.Bricks.Table.Tr id={"uuID7"}>
            <MyAllowTagsComponents id={"allowID"} content={"AllowTags Content"} />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
