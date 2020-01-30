import React from "react";
import UU5 from "uu5g04";

const { mount, shallow, wait } = UU5.Test.Tools;

describe("UU5.Common.Component", () => {
  let Component, wrapper;

  it("create()", async () => {
    Component = UU5.Common.Component.create({
      render: () => "abc"
    });
    expect(Component).toBeTruthy();
    wrapper = mount(<Component />);
    expect(wrapper.text()).toBe("abc");

    Component = UU5.Common.Component.create({
      mixins: [UU5.Common.BaseMixin],
      render: () => "abc"
    });
    expect(Component).toBeTruthy();
    wrapper = mount(<Component />);
    expect(wrapper.text()).toBe("abc");
    expect(wrapper.instance()).toBeTruthy();
  });

  it("create() should process defaultProps", async () => {
    Component = UU5.Common.Component.create({
      defaultProps: {
        prop: "abc"
      },
      render() {
        return this.props.prop;
      }
    });
    expect(Component).toBeTruthy();
    wrapper = mount(<Component />);
    expect(wrapper.text()).toBe("abc");
    wrapper = mount(<Component prop="cde" />);
    expect(wrapper.text()).toBe("cde");
  });

  it("create() should set displayName from tagName", async () => {
    Component = UU5.Common.Component.create({
      statics: {
        tagName: "AAA"
      },
      render() {
        return this.props.prop;
      }
    });
    expect(Component).toBeTruthy();
    expect(Component.displayName).toBe("AAA");

    Component = UU5.Common.Component.create({
      displayName: "BBB",
      statics: {
        tagName: "AAA"
      },
      render() {
        return this.props.prop;
      }
    });
    expect(Component).toBeTruthy();
    expect(Component.displayName).toBe("BBB");
  });

  it("create() should set tagName from displayName", async () => {
    Component = UU5.Common.Component.create({
      displayName: "BBB",
      render() {
        return this.props.prop;
      }
    });
    expect(Component).toBeTruthy();
    expect(Component.tagName).toBe("BBB");

    Component = UU5.Common.Component.create({
      displayName: "BBB",
      statics: {
        tagName: "AAA"
      },
      render() {
        return this.props.prop;
      }
    });
    expect(Component).toBeTruthy();
    expect(Component.tagName).toBe("AAA");
  });
});
