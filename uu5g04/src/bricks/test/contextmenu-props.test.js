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

//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

/**
 * This is a created component for the Allow Tags test.
 * It is tested that a self-created component can be inserted into the accordion under its own brand.
 */
const MyAllowTagsComponents = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],
  statics: { tagName: "UU5.Example.MyCompButton", classNames: { main: "mytr" } },
  render() {
    return <UU5.Example.MyCompButton {...this.getMainPropsToPass()} />;
  }
});

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
    },
    compactSubmenu: {
      values: [true, false]
    }
  },
  requiredProps: {
    children: [<UU5.Bricks.ContextMenu.Item id={"uuID2"} label="Ráno" icon="mdi-weather-sunset-up" />]
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.ContextMenu`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.ContextMenu, CONFIG);
});

describe(`UU5.Bricks.ContextMenu docKit examples`, () => {
  it(`UU5.Bricks.ContextMenu myComponent from allowTags is used`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ContextMenu
        id={"uuID"}
        shown={true}
        header="Header"
        footer="Footer"
        allowTags={["UU5.Example.MyCompButton"]}
      >
        <UU5.Bricks.ContextMenu.Item id={"uuID2"} label="Ráno" icon="mdi-weather-sunset-up" space />
        <MyAllowTagsComponents id={"allowId"} content={"allowTagsContent"} />
      </UU5.Bricks.ContextMenu>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.ContextMenu example make snapshot`, () => {
    const wrapper = shallow(
      <UU5.Bricks.ContextMenu id={"uuID"} shown={true} header="Header" footer="Footer">
        <UU5.Bricks.ContextMenu.Item id={"uuID2"} label="Ráno" icon="mdi-weather-sunset-up" space />
        <UU5.Bricks.ContextMenu.Item id={"uuID3"} label="Dopoledne" space />
        <UU5.Bricks.ContextMenu.Item id={"uuID4"} label="V poledne" icon="mdi-weather-sunny" space disabled />
        <UU5.Bricks.ContextMenu.Item id={"uuID5"} label="Odpoledne" space />
        <UU5.Bricks.ContextMenu.Item id={"uuID6"} label="Večer" icon="mdi-weather-sunset" />
        <UU5.Bricks.ContextMenu.Item id={"uuID7"} divider />
        <UU5.Bricks.ContextMenu.Item id={"uuID10"} label="Úplně jiné" disabled />
      </UU5.Bricks.ContextMenu>
    );
    expect(wrapper).toMatchSnapshot();
  });
});

const getContextMenu = props => (
  <UU5.Bricks.ContextMenu {...props}>
    <UU5.Bricks.ContextMenu.Item label="Level 0" space>
      <UU5.Bricks.ContextMenu.Item label="Level 1" space>
        <UU5.Bricks.ContextMenu.Item label="Level 2" space />
      </UU5.Bricks.ContextMenu.Item>
      <UU5.Bricks.ContextMenu.Item label="Level 1 Standard Item" space />
    </UU5.Bricks.ContextMenu.Item>
  </UU5.Bricks.ContextMenu>
);

describe(`UU5.Bricks.ContextMenu functionality`, () => {
  it(`UU5.Bricks.ContextMenu compactSubmenu`, () => {
    const origGetScreenSize = UU5.Common.Tools.getScreenSize;

    UU5.Common.Tools.getScreenSize = () => "l";
    let wrapper = mount(getContextMenu({ compactSubmenu: "xs s" }));
    expect(
      wrapper.findWhere(
        node =>
          node.instance() &&
          node.instance().getTagName &&
          node.instance().getTagName() === "UU5.Bricks.CompactContextMenu"
      ).length
    ).toBe(0);

    UU5.Common.Tools.getScreenSize = () => "s";
    wrapper = mount(getContextMenu({ compactSubmenu: "xs s" }));
    expect(
      wrapper.findWhere(
        node =>
          node.instance() &&
          node.instance().getTagName &&
          node.instance().getTagName() === "UU5.Bricks.CompactContextMenu"
      ).length
    ).toBe(1);

    wrapper.instance().open();
    wrapper.update();
    let item = wrapper.findWhere(node => node.hasClass("uu5-bricks-link") && node.text() === "Level 0");
    item.simulate("click");
    wrapper.update();

    expect(wrapper.findWhere(node => node.hasClass("uu5-bricks-link") && node.text() === "Back").length).toBe(1);
    item = wrapper.findWhere(node => node.hasClass("uu5-bricks-link") && node.text() === "Level 1");
    item.simulate("click");
    wrapper.update();

    let backButton = wrapper.findWhere(node => node.hasClass("uu5-bricks-link") && node.text() === "Back");
    expect(wrapper.findWhere(node => node.hasClass("uu5-bricks-link") && node.text() === "Level 2").length).toBe(1);
    backButton.simulate("click");
    wrapper.update();

    item = wrapper.findWhere(node => node.hasClass("uu5-bricks-link") && node.text() === "Level 1 Standard Item");
    item.simulate("click");
    wrapper.update();
    expect(wrapper.instance().isOpen()).toBeFalsy();

    UU5.Common.Tools.getScreenSize = origGetScreenSize;
  });
});
