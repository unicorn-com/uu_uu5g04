import React from "react";
import UU5 from "uu5g04";

const { mount, shallow, wait } = UU5.Test.Tools;

let origUu5DataMap;
beforeEach(() => {
  origUu5DataMap = UU5.Environment.uu5DataMap;
  UU5.Environment.uu5DataMap = { testKey: "testValue" };
});
afterEach(() => {
  UU5.Environment.uu5DataMap = origUu5DataMap;
});

const Component = UU5.Common.VisualComponent.create({
  displayName: "Component",
  mixins: [UU5.Common.BaseMixin, UU5.Common.NestingLevelMixin],
  statics: {
    nestingLevelList: ["boxCollection", "box"]
  },
  render() {
    let { children } = this.props;
    return <div>{React.isValidElement(children) ? React.cloneElement(children, { parent: this }) : null}</div>;
  }
});
window.UU5.D = { Component };

describe("UU5.Utils.Content", () => {
  it("getChildren()", async () => {
    let props, child, parent, children, nestingLevelList, statics;

    mount(
      <Component ref={ref => (parent = ref)}>
        <Component ref={ref => (child = ref)} {...props} />
      </Component>
    );
    props = { nestingLevel: "boxCollection", parent };
    nestingLevelList = ["boxCollection", "box", "smallBoxCollection"];
    statics = { nestingLevel: nestingLevelList };

    children = UU5.Utils.Content.getChildren(null, props, statics);
    expect(children).toBeFalsy();

    children = UU5.Utils.Content.getChildren(undefined, props, statics);
    expect(children).toBeFalsy();

    children = UU5.Utils.Content.getChildren(true, props, statics);
    expect(children).toEqual(true);

    children = UU5.Utils.Content.getChildren(false, props, statics);
    expect(children).toEqual(false);

    children = UU5.Utils.Content.getChildren(0, props, statics);
    expect(children).toEqual(0);

    children = UU5.Utils.Content.getChildren(1, props, statics);
    expect(children).toEqual(1);

    children = UU5.Utils.Content.getChildren("", props, statics);
    expect(children).toBe("");

    children = UU5.Utils.Content.getChildren("text", props, statics);
    expect(children).toBe("text"); // text-corrector is not used

    children = UU5.Utils.Content.getChildren("<uu5string/><UU5.D.Component a='b' />", props, statics);
    expect(Array.isArray(children)).toBeTruthy();
    expect(children[0]).toMatchObject({ props: { a: "b" }, type: Component });

    children = UU5.Utils.Content.getChildren("<uu5data/>testKey", props, statics);
    expect(children).toBe("testValue");

    children = UU5.Utils.Content.getChildren('<uu5json/>[0, false, "text"]', props, statics);
    expect(Array.isArray(children)).toBeTruthy();
    expect(children[0]).toEqual(0);
    expect(children[1]).toEqual(false);
    expect(children[2]).toBe("text"); // text-corrector is not used

    children = UU5.Utils.Content.getChildren(<Component a="b" />, props, statics);
    expect(children).toMatchObject({ props: { a: "b" } });

    children = UU5.Utils.Content.getChildren(props => <Component a="b" {...props} />, props, statics);
    expect(children).toMatchObject({ props: { a: "b", nestingLevel: "boxCollection" } });
    // NOTE Returned "children" have prop "parent" set to the value in "props", not to the component instance
    // from where getChildren() was called. The reason is that current uu5g04 components (and other libraries)
    // assume that whatever is in "parent" has BaseMixin which isn't true for components for which Content.getChildren()
    // API is meant for (i.e. mixin-less components). Developer can still use Content.getChildren() in a BaseMixin
    // component and adjust "parent" for returned children to contain the BaseMixin component instance if needed.
    expect(children.props.parent === props.parent).toBeTruthy();

    children = UU5.Utils.Content.getChildren([<Component a="b" key="abc" />, "text"], props, statics);
    expect(Array.isArray(children)).toBeTruthy();
    expect(children[0]).toMatchObject({ props: { a: "b" } });
    expect(children[1]).toBe("text"); // text-corrector is not used

    children = UU5.Utils.Content.getChildren(
      props => [<Component a="b" key="abc" {...props} />, "text"],
      props,
      statics
    );
    expect(Array.isArray(children)).toBeTruthy();
    expect(children[0]).toMatchObject({ props: { a: "b", nestingLevel: "boxCollection" } });
    expect(children[0].props.parent === props.parent).toBeTruthy();
    expect(children[0].key).toBe("abc");
    expect(children[1]).toBe("text"); // text-corrector is not used

    children = UU5.Utils.Content.getChildren({ tag: "UU5.D.Component", props: { a: "b" } }, props, statics);
    expect(children).toMatchObject({ props: { a: "b" }, type: Component });

    children = UU5.Utils.Content.getChildren(
      { tag: "UU5.D.Component", propsArray: [{ a: "b" }, { a: "c" }] },
      props,
      statics
    );
    expect(Array.isArray(children)).toBeTruthy();
    expect(children[0]).toMatchObject({ props: { a: "b", nestingLevel: "boxCollection" }, type: Component });
    expect(children[0].props.parent === props.parent).toBeTruthy();
    expect(children[1]).toMatchObject({ props: { a: "c", nestingLevel: "boxCollection" }, type: Component });
    expect(children[1].props.parent === props.parent).toBeTruthy();
  });
});
