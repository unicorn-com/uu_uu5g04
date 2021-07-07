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
    "UU5.Common.SectionMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    striped: {
      values: [true, false],
    },
    bordered: {
      values: [true, false],
    },
    hover: {
      values: [true, false],
    },
    condensed: {
      values: [true, false],
    },
    responsive: {
      values: [true, false],
    },
    allowTags: {
      allowTagsArray: ["UU5.Example.MyColumnComponent"],
    },
  },
  requiredProps: {
    children: [
      <UU5.Bricks.Table.Tr id={"child01"}>
        <UU5.Bricks.Table.Td id={"child02"} content="Rimmer" />
      </UU5.Bricks.Table.Tr>,
    ],
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Bricks.Table`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Table, CONFIG);
});

describe("UU5.Bricks.Table - docKitExamples", () => {
  it("props-allowTags", () => {
    const wrapper = shallow(
      <UU5.Bricks.Table header="Table" footer="Table footer" allowTags={["UU5.Example.MyColumnComponent"]} id={"uuID1"}>
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content="Name" id={"uuID4"} />
            <UU5.Bricks.Table.Th content="Rank" id={"uuID5"} />
            <UU5.Bricks.Table.Th content="Promotion prospects" id={"uuID5"} />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>

        <UU5.Bricks.Table.TBody id={"uuID6"}>
          <UU5.Bricks.Table.Tr id={"uuID7"}>
            <UU5.Bricks.Table.Td content="Rimmer" id={"uuID8"} />
            <UU5.Bricks.Table.Td content="2nd class technician" id={"uuID8"} />
            <UU5.Bricks.Table.Td content="comical" id={"uuID9"} />
          </UU5.Bricks.Table.Tr>
          <UU5.Bricks.Table.Tr id={"uuID10"}>
            <MyColumnComponent id={"allowID"} span={1} colorSchema="blue" />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("props-striped/Bordered", () => {
    const wrapper = shallow(
      <UU5.Bricks.Table
        header="Table"
        footer="Table footer"
        allowBodyTags={["UU5.Example.MyColumnComponent"]}
        id={"uuID1"}
        striped={true}
        bordered={true}
      >
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content="Name" id={"uuID4"} />
            <UU5.Bricks.Table.Th content="Rank" id={"uuID5"} />
            <UU5.Bricks.Table.Th content="Promotion prospects" id={"uuID5"} />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>

        <UU5.Bricks.Table.TBody id={"uuID6"}>
          <UU5.Bricks.Table.Tr id={"uuID7"}>
            <UU5.Bricks.Table.Td content="Rimmer" id={"uuID8"} />
            <UU5.Bricks.Table.Td content="2nd class technician" id={"uuID8"} />
            <UU5.Bricks.Table.Td content="comical" id={"uuID9"} />
          </UU5.Bricks.Table.Tr>
          <UU5.Bricks.Table.Tr id={"uuID10"}>
            <MyColumnComponent id={"allowID"} span={1} colorSchema="blue" />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("props-hover/Conseded", () => {
    const wrapper = shallow(
      <UU5.Bricks.Table
        header="Table"
        footer="Table footer"
        allowBodyTags={["UU5.Example.MyColumnComponent"]}
        id={"uuID1"}
        hover={true}
        consended={true}
      >
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content="Name" id={"uuID4"} />
            <UU5.Bricks.Table.Th content="Rank" id={"uuID5"} />
            <UU5.Bricks.Table.Th content="Promotion prospects" id={"uuID5"} />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>

        <UU5.Bricks.Table.TBody id={"uuID6"}>
          <UU5.Bricks.Table.Tr id={"uuID7"}>
            <UU5.Bricks.Table.Td content="Rimmer" id={"uuID8"} />
            <UU5.Bricks.Table.Td content="2nd class technician" id={"uuID8"} />
            <UU5.Bricks.Table.Td content="comical" id={"uuID9"} />
          </UU5.Bricks.Table.Tr>
          <UU5.Bricks.Table.Tr id={"uuID10"}>
            <MyColumnComponent id={"allowID"} span={1} colorSchema="blue" />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("props-responsive", () => {
    const wrapper = shallow(
      <UU5.Bricks.Table
        header="Table"
        footer="Table footer"
        allowBodyTags={["UU5.Example.MyColumnComponent"]}
        id={"uuID1"}
        responsive={true}
      >
        <UU5.Bricks.Table.THead id={"uuID2"}>
          <UU5.Bricks.Table.Tr id={"uuID3"}>
            <UU5.Bricks.Table.Th content="Name" id={"uuID4"} />
            <UU5.Bricks.Table.Th content="Rank" id={"uuID5"} />
            <UU5.Bricks.Table.Th content="Promotion prospects" id={"uuID5"} />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.THead>

        <UU5.Bricks.Table.TBody id={"uuID6"}>
          <UU5.Bricks.Table.Tr id={"uuID7"}>
            <UU5.Bricks.Table.Td content="Rimmer" id={"uuID8"} />
            <UU5.Bricks.Table.Td content="2nd class technician" id={"uuID8"} />
            <UU5.Bricks.Table.Td content="comical" id={"uuID9"} />
          </UU5.Bricks.Table.Tr>
          <UU5.Bricks.Table.Tr id={"uuID10"}>
            <MyColumnComponent id={"allowID"} span={1} colorSchema="blue" />
          </UU5.Bricks.Table.Tr>
        </UU5.Bricks.Table.TBody>
      </UU5.Bricks.Table>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
