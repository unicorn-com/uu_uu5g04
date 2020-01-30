import React from "react";
import PropTypes from "prop-types";
import UU5 from "uu5g04";

const { mount, shallow, wait } = UU5.Test.Tools;

describe("UU5.Common.VisualComponent", () => {
  let Component, wrapper;

  it("create()", async () => {
    Component = UU5.Common.VisualComponent.create({
      render: () => "abc"
    });
    expect(Component).toBeTruthy();
    wrapper = mount(<Component />);
    expect(wrapper.text()).toBe("abc");

    Component = UU5.Common.VisualComponent.create({
      mixins: [UU5.Common.BaseMixin],
      render: () => "abc"
    });
    expect(Component).toBeTruthy();
    wrapper = mount(<Component />);
    expect(wrapper.text()).toBe("abc");
    expect(wrapper.instance()).toBeTruthy();
  });

  it("create() should merge propTypes", async () => {
    Component = UU5.Common.VisualComponent.create({
      render: () => null
    });
    expect(Component).toBeTruthy();
    expect(Component.propTypes).toMatchObject({
      id: expect.anything(),
      className: expect.anything(),
      style: expect.anything(),
      disabled: expect.anything(),
      hidden: expect.anything(),
      mainAttrs: expect.anything(),
      noIndex: expect.anything()
    });

    // check custom propTypes having bigger priority than default ones
    let propTypes1 = Component.propTypes;
    Component = UU5.Common.VisualComponent.create({
      propTypes: {
        id: PropTypes.number,
        className: PropTypes.number,
        style: PropTypes.number
      },
      render: () => null
    });
    expect(Component).toBeTruthy();
    expect(Component.propTypes).toMatchObject({
      id: PropTypes.number,
      className: PropTypes.number,
      style: PropTypes.number,
      disabled: propTypes1.disabled,
      hidden: propTypes1.hidden,
      mainAttrs: propTypes1.mainAttrs,
      noIndex: propTypes1.noIndex
    });
  });

  it("create() should merge getDefaultProps()", async () => {
    let defaultProps1;
    Component = UU5.Common.VisualComponent.create({
      render: () => null
    });
    expect(Component).toBeTruthy();
    expect(typeof Component.getDefaultProps).toBe("function");
    expect((defaultProps1 = Component.getDefaultProps())).toMatchObject({
      id: undefined,
      className: undefined,
      style: undefined,
      disabled: undefined,
      hidden: undefined,
      mainAttrs: undefined,
      noIndex: undefined
    });

    Component = UU5.Common.VisualComponent.create({
      getDefaultProps() {
        return {
          id: "1",
          className: "a b",
          style: "c"
        };
      },
      render: () => null
    });
    expect(typeof Component.getDefaultProps).toBe("function");
    expect(Component.getDefaultProps()).toMatchObject({
      id: "1",
      className: "a b",
      style: "c",
      disabled: defaultProps1.disabled,
      hidden: defaultProps1.hidden,
      mainAttrs: defaultProps1.mainAttrs,
      noIndex: defaultProps1.noIndex
    });
  });

  it("getAttrs()", () => {
    let result = UU5.Common.VisualComponent.getAttrs(
      {
        id: "1",
        className: "a b",
        style: { color: "red" },
        disabled: true,
        hidden: false,
        noIndex: true,
        mainAttrs: { foo: "bar", className: "c", style: { foo: "bar" } }
      },
      "d"
    );
    expect(result).toMatchObject({
      id: "1",
      className: "d a b uu5-noindex",
      style: { color: "red" },
      disabled: true,
      hidden: false
    });
  });
});
