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

const MyAllowTagsComponents = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],
  statics: { tagName: "UU5.Example.MyCompLi", classNames: { main: "mytr" } },
  render() {
    return <UU5.Example.MyCompLi {...this.getMainPropsToPass()} />;
  }
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin"
  ],
  props: {
    allowTags: {
      allowTagsArray: ["UU5.Example.MyCompLi"]
    },
    type: {
      values: ["disc", "square", "circle"]
    }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Bricks.Ul`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Ul, CONFIG);
});

describe(`UU5.Bricks.Ul AllowTagsComponent`, () => {
  it(`UU5.Bricks.Ul props - allowTags`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Ul id={"uuID02"} allowTags={["UU5.Example.MyCompLi"]}>
        <UU5.Bricks.Li id={"uuID03"} content="Buy milk" />
        <MyAllowTagsComponents id={"alloid"} content={"allow tags content"} />
      </UU5.Bricks.Ul>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
