import React from "react";
import UU5 from "uu5g04";

const { mount, shallow, wait } = UU5.Test.Tools;

let origToolsError;
beforeEach(() => {
  origToolsError = UU5.Common.Tools.error;
  UU5.Common.Tools.error = jest.fn(function (msg) {
    if (typeof msg === "string" && msg.match(/nesting/i)) return;
    return origToolsError.apply(this, arguments);
  });
});
afterEach(() => {
  UU5.Common.Tools.error = origToolsError;
});

let componentFactory = (nestingLevelList) => {
  let Component = UU5.Common.VisualComponent.create({
    mixins: [UU5.Common.BaseMixin, UU5.Common.NestingLevelMixin],
    propTypes: {
      nestingLevel: UU5.PropTypes.any, // prevent error messages
    },
    statics: {
      nestingLevelList: nestingLevelList,
    },
    render() {
      let { children } = this.props;
      return <div>{React.isValidElement(children) ? React.cloneElement(children, { parent: this }) : null}</div>;
    },
  });
  return Component;
};

describe("UU5.Common.NestingLevelMixin", () => {
  it("getNestingLevel()", async () => {
    let wrapper, Component, ComponentParent;

    // component with nesting level list
    Component = componentFactory(["boxCollection", "box"]);
    wrapper = mount(<Component nestingLevel="bigBox" />);

    expect(wrapper.instance().getNestingLevel()).toBe("boxCollection");

    wrapper.setProps({ nestingLevel: "bigBoxCollection" });
    expect(wrapper.instance().getNestingLevel()).toBe("boxCollection");

    wrapper.setProps({ nestingLevel: "boxCollection" });
    expect(wrapper.instance().getNestingLevel()).toBe("boxCollection");

    wrapper.setProps({ nestingLevel: "box" });
    expect(wrapper.instance().getNestingLevel()).toBe("box");

    wrapper.setProps({ nestingLevel: "smallBoxCollection" });
    expect(wrapper.instance().getNestingLevel()).toBeFalsy();

    wrapper.setProps({ nestingLevel: "asdf" });
    expect(wrapper.instance().getNestingLevel()).toBe("boxCollection");

    // component without nesting level list
    Component = componentFactory();
    wrapper = mount(<Component nestingLevel="box" />);
    expect(wrapper.instance().getNestingLevel()).toBe("box");

    wrapper.setProps({ nestingLevel: "smallBoxCollection" });
    expect(wrapper.instance().getNestingLevel()).toBe("smallBoxCollection");

    wrapper.setProps({ nestingLevel: "asdf" });
    expect(wrapper.instance().getNestingLevel()).toBe("spa");

    wrapper.setProps({ nestingLevel: undefined });
    expect(wrapper.instance().getNestingLevel()).toBe("spa");

    // test finding of nearest parent with NestingLevelMixin and using its nestingLevel
    // (which child will then use to derive its own nesting level)
    let child, parent;
    ComponentParent = componentFactory(UU5.Environment.nestingLevelList);
    Component = componentFactory(["boxCollection", "box", "smallBoxCollection"]);
    wrapper = mount(
      <ComponentParent nestingLevel="bigBox" ref={(ref) => (parent = ref)}>
        <Component ref={(ref) => (child = ref)} />
      </ComponentParent>
    );
    expect(child.getNestingLevel()).toBe("boxCollection");

    wrapper = mount(
      <ComponentParent nestingLevel="smallBox" ref={(ref) => (parent = ref)}>
        <Component ref={(ref) => (child = ref)} />
      </ComponentParent>
    );
    expect(child.getNestingLevel()).toBeFalsy();

    wrapper = mount(
      <ComponentParent nestingLevel="box" ref={(ref) => (parent = ref)}>
        <Component ref={(ref) => (child = ref)} />
      </ComponentParent>
    );
    expect(child.getNestingLevel()).toBe("smallBoxCollection");

    wrapper = mount(
      <ComponentParent nestingLevel="boxCollection" ref={(ref) => (parent = ref)}>
        <Component ref={(ref) => (child = ref)} />
      </ComponentParent>
    );
    expect(child.getNestingLevel()).toBe("boxCollection");
  });
});
