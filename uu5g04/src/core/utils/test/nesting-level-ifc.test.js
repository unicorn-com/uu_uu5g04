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

const NLMComponent = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin, UU5.Common.NestingLevelMixin],
  render() {
    let { children } = this.props;
    return <div>{React.isValidElement(children) ? React.cloneElement(children, { parent: this }) : null}</div>;
  },
});

describe("UU5.Utils.NestingLevel", () => {
  it("getNestingLevel()", async () => {
    let level;

    level = UU5.Utils.NestingLevel.getNestingLevel(
      { nestingLevel: "bigBox" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getNestingLevel(
      { nestingLevel: "bigBoxCollection" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getNestingLevel(
      { nestingLevel: "boxCollection" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getNestingLevel({ nestingLevel: "box" }, { nestingLevel: ["boxCollection", "box"] });
    expect(level).toBe("box");

    level = UU5.Utils.NestingLevel.getNestingLevel(
      { nestingLevel: "smallBoxCollection" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBeFalsy();

    level = UU5.Utils.NestingLevel.getNestingLevel(
      { nestingLevel: "asdf" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getNestingLevel({ nestingLevel: "box" }, {});
    expect(level).toBe("box");

    level = UU5.Utils.NestingLevel.getNestingLevel({ nestingLevel: "smallBoxCollection" }, {});
    expect(level).toBe("smallBoxCollection");

    level = UU5.Utils.NestingLevel.getNestingLevel({ nestingLevel: "asdf" }, {});
    expect(level).toBe("spa");

    level = UU5.Utils.NestingLevel.getNestingLevel({}, {});
    expect(level).toBe("spa");

    // test finding of nearest parent with NestingLevelMixin and using its nestingLevel
    // (which child will then use to derive its own nesting level)
    let child;
    let wrapper = mount(
      <NLMComponent nestingLevel="bigBox">
        <NLMComponent ref={(ref) => (child = ref)} />
      </NLMComponent>
    );
    expect(child && child.props && child.props.parent).toBeTruthy();

    level = UU5.Utils.NestingLevel.getNestingLevel(child.props, { nestingLevel: ["boxCollection", "box"] });
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getNestingLevel(child.props, { nestingLevel: ["spa", "bigBoxCollection"] });
    expect(level).toBeFalsy();

    level = UU5.Utils.NestingLevel.getNestingLevel(child.props, {});
    expect(level).toBe("boxCollection");

    wrapper.setProps({ nestingLevel: "box" });
    level = UU5.Utils.NestingLevel.getNestingLevel(child.props, {
      nestingLevel: ["boxCollection", "box", "smallBoxCollection"],
    });
    expect(level).toBe("smallBoxCollection");

    wrapper.setProps({ nestingLevel: "boxCollection" });
    level = UU5.Utils.NestingLevel.getNestingLevel(child.props, {
      nestingLevel: ["boxCollection", "box", "smallBoxCollection"],
    });
    expect(level).toBe("boxCollection");
  });

  it("getChildNestingLevel()", async () => {
    let level;

    level = UU5.Utils.NestingLevel.getChildNestingLevel(
      { nestingLevel: "bigBox" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getChildNestingLevel(
      { nestingLevel: "bigBoxCollection" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getChildNestingLevel(
      { nestingLevel: "boxCollection" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getChildNestingLevel(
      { nestingLevel: "box" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBe("smallBoxCollection");

    level = UU5.Utils.NestingLevel.getChildNestingLevel(
      { nestingLevel: "smallBoxCollection" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBeFalsy();

    level = UU5.Utils.NestingLevel.getChildNestingLevel(
      { nestingLevel: "asdf" },
      { nestingLevel: ["boxCollection", "box"] }
    );
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getChildNestingLevel({ nestingLevel: "box" }, {});
    expect(level).toBe("smallBoxCollection");

    level = UU5.Utils.NestingLevel.getChildNestingLevel({ nestingLevel: "smallBoxCollection" }, {});
    expect(level).toBe("smallBoxCollection");

    level = UU5.Utils.NestingLevel.getChildNestingLevel({ nestingLevel: "asdf" }, {});
    expect(level).toBe("page");

    level = UU5.Utils.NestingLevel.getChildNestingLevel({}, {});
    expect(level).toBe("page");

    // test finding of nearest parent with NestingLevelMixin and using its nestingLevel
    // (which child will then use to derive its own nesting level)
    let child;
    let wrapper = mount(
      <NLMComponent nestingLevel="bigBox">
        <NLMComponent ref={(ref) => (child = ref)} />
      </NLMComponent>
    );
    expect(child && child.props && child.props.parent).toBeTruthy();

    level = UU5.Utils.NestingLevel.getChildNestingLevel(child.props, { nestingLevel: ["boxCollection", "box"] });
    expect(level).toBe("boxCollection");

    level = UU5.Utils.NestingLevel.getChildNestingLevel(child.props, { nestingLevel: ["spa", "bigBoxCollection"] });
    expect(level).toBeFalsy();

    level = UU5.Utils.NestingLevel.getChildNestingLevel(child.props, {});
    expect(level).toBe("boxCollection");

    wrapper.setProps({ nestingLevel: "box" });
    level = UU5.Utils.NestingLevel.getChildNestingLevel(child.props, {
      nestingLevel: ["boxCollection", "box", "smallBoxCollection"],
    });
    expect(level).toBe("smallBoxCollection");

    wrapper.setProps({ nestingLevel: "boxCollection" });
    level = UU5.Utils.NestingLevel.getChildNestingLevel(child.props, {
      nestingLevel: ["boxCollection", "box", "smallBoxCollection"],
    });
    expect(level).toBe("boxCollection");
  });
});
