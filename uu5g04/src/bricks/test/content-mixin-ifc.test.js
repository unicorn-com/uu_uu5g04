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

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

describe(`UU5.Common.ContentMixin dynamic - interface`, () => {
  it(`insertChild`, () => {
    const wrapper = mount(
      <UU5.Bricks.Div dynamic controlled={false} id="root">
        <UU5.Bricks.Div id="id1" />
      </UU5.Bricks.Div>
    );
    let instance = wrapper.instance();
    expectChildren(wrapper, "id1");

    instance.insertChild(<UU5.Bricks.Div id="id2" />);
    expectChildren(wrapper, "id1", "id2");

    instance.insertChild(<UU5.Bricks.Div id="id3" />, { position: 0 });
    expectChildren(wrapper, "id3", "id1", "id2");

    executeAsSingleRender(wrapper, () => {
      instance.insertChild(<UU5.Bricks.Div id="id4" />, { position: 3 });
      instance.insertChild(<UU5.Bricks.Div id="id5" />, { position: 1 });
      instance.insertChild(<UU5.Bricks.Div id="id6" />, { position: 1 }); // position is relative to children from cumulated state
    });
    expectChildren(wrapper, "id3", "id6", "id5", "id1", "id2", "id4");

    // NOTE Seems like insertChild without using ID is not really supported - ContentMixin
    // will use childIndex as "key" but it doesn't update "key" on other children, i.e. there
    // will be duplicit keys which might cause issues in React...
    // let comp1, comp2/*, span*/;
    // executeAsSingleRender(wrapper, () => { // test without using IDs
    //   instance.insertChild(<UU5.Bricks.Div ref_={comp => comp1 = comp} />, { position: 1 });
    //   // instance.insertChild(<span ref={comp => span = comp} />); // rendered children contain only UU5 components
    //   instance.insertChild(<UU5.Bricks.Div ref_={comp => comp2 = comp} />, { position: 1 });
    // });
    // expectChildren(wrapper, "id3", comp2.getId(), comp1.getId(), "id6", "id5", "id1", "id2", "id4"/*, span.id*/);
  });

  it(`insertChildBefore`, () => {
    const wrapper = mount(
      <UU5.Bricks.Div dynamic controlled={false} id="root">
        <UU5.Bricks.Div id="id1" />
      </UU5.Bricks.Div>
    );

    let instance = wrapper.instance();
    expectChildren(wrapper, "id1");

    instance.insertChildBefore(<UU5.Bricks.Div id="id2" />);
    expectChildren(wrapper, "id2", "id1");

    instance.insertChildBefore(<UU5.Bricks.Div id="id3" />, { childAfterId: "id1" });
    expectChildren(wrapper, "id2", "id3", "id1");

    executeAsSingleRender(wrapper, () => {
      instance.insertChildBefore(<UU5.Bricks.Div id="id4" />, { childAfterId: "id3" }); // before "id3"
      instance.insertChildBefore(<UU5.Bricks.Div id="id5" />, { childAfterId: "id2" });
      instance.insertChildBefore(<UU5.Bricks.Div id="id6" />, { childAfterId: "id1" });
    });
    expectChildren(wrapper, "id5", "id2", "id4", "id3", "id6", "id1");

    executeAsSingleRender(wrapper, () => {
      instance.insertChildBefore(<UU5.Bricks.Div id="id7" />, { childAfterId: "id4", childBeforeId: "id1" }); // should ignore childBeforeId
      instance.insertChildBefore(<UU5.Bricks.Div id="id8" />, { childAfterId: "id7" }); // relative to previous new child (not yet rendered)
    });
    expectChildren(wrapper, "id5", "id2", "id8", "id7", "id4", "id3", "id6", "id1");

    let comp1, comp2;
    executeAsSingleRender(wrapper, () => {
      // test without using IDs
      instance.insertChildBefore(<UU5.Bricks.Div ref_={(comp) => (comp1 = comp)} />, { childAfterId: "id2" });
      instance.insertChildBefore(<UU5.Bricks.Div ref_={(comp) => (comp2 = comp)} />);
    });
    expectChildren(wrapper, comp2.getId(), "id5", comp1.getId(), "id2", "id8", "id7", "id4", "id3", "id6", "id1");
  });

  it(`insertChildAfter`, () => {
    const wrapper = mount(
      <UU5.Bricks.Div dynamic controlled={false} id="root">
        <UU5.Bricks.Div id="id1" />
      </UU5.Bricks.Div>
    );

    let instance = wrapper.instance();
    expectChildren(wrapper, "id1");

    instance.insertChildAfter(<UU5.Bricks.Div id="id2" />);
    expectChildren(wrapper, "id1", "id2");

    instance.insertChildAfter(<UU5.Bricks.Div id="id3" />, { childBeforeId: "id1" });
    expectChildren(wrapper, "id1", "id3", "id2");

    executeAsSingleRender(wrapper, () => {
      instance.insertChildAfter(<UU5.Bricks.Div id="id4" />, { childBeforeId: "id3" }); // after "id3"
      instance.insertChildAfter(<UU5.Bricks.Div id="id5" />, { childBeforeId: "id1" });
      instance.insertChildAfter(<UU5.Bricks.Div id="id6" />, { childBeforeId: "id2" });
    });
    expectChildren(wrapper, "id1", "id5", "id3", "id4", "id2", "id6");

    executeAsSingleRender(wrapper, () => {
      instance.insertChildAfter(<UU5.Bricks.Div id="id7" />, { childBeforeId: "id5", childAfterId: "id6" }); // should ignore childAfterId
      instance.insertChildAfter(<UU5.Bricks.Div id="id8" />, { childBeforeId: "id7" }); // relative to previous new child (not yet rendered)
    });
    expectChildren(wrapper, "id1", "id5", "id7", "id8", "id3", "id4", "id2", "id6");

    let comp1, comp2;
    executeAsSingleRender(wrapper, () => {
      // test without using IDs
      instance.insertChildAfter(<UU5.Bricks.Div ref_={(comp) => (comp1 = comp)} />, { childBeforeId: "id5" });
      instance.insertChildAfter(<UU5.Bricks.Div ref_={(comp) => (comp2 = comp)} />);
    });
    expectChildren(wrapper, "id1", "id5", comp1.getId(), "id7", "id8", "id3", "id4", "id2", "id6", comp2.getId());
  });

  it(`updateChild`, () => {
    const wrapper = mount(
      <UU5.Bricks.Div dynamic controlled={false} id="root">
        <UU5.Bricks.Div id="id1" />
        <UU5.Bricks.Div id="id2" />
        <UU5.Bricks.Div id="id3" />
      </UU5.Bricks.Div>
    );
    let instance = wrapper.instance();
    expectChildren(wrapper, "id1", "id2", "id3");
    expect(wrapper.find("#id2").first().instance().props.tooltip).toBeFalsy();

    instance.updateChild("id2", { tooltip: "new" });
    expect(wrapper.find("#id2").first().instance().props.tooltip).toBe("new");

    executeAsSingleRender(wrapper, () => {
      instance.insertChild(<UU5.Bricks.Div id="id4" />, { position: 0 });
      instance.updateChild("id2", { tooltip: "new2" });
    });
    expect(wrapper.find("#id2").first().instance().props.tooltip).toBe("new2");
    expectChildren(wrapper, "id4", "id1", "id2", "id3");

    executeAsSingleRender(wrapper, () => {
      instance.insertChild(<UU5.Bricks.Div id="id5" />, { position: 0 });
      instance.updateChild("id5", { tooltip: "new" });
    });
    expect(wrapper.find("#id5").first().instance().props.tooltip).toBe("new");
    expectChildren(wrapper, "id5", "id4", "id1", "id2", "id3");
  });

  it(`replaceChild`, () => {
    const wrapper = mount(
      <UU5.Bricks.Div dynamic controlled={false} id="root">
        <UU5.Bricks.Div id="id1" />
        <UU5.Bricks.Div id="id2" />
        <UU5.Bricks.Div id="id3" />
      </UU5.Bricks.Div>
    );
    let instance = wrapper.instance();
    expectChildren(wrapper, "id1", "id2", "id3");

    instance.replaceChild("id2", <UU5.Bricks.Div id="id2-0" />);
    expectChildren(wrapper, "id1", "id2-0", "id3");

    executeAsSingleRender(wrapper, () => {
      instance.insertChild(<UU5.Bricks.Div id="id4" />, { position: 0 });
      instance.replaceChild("id1", <UU5.Bricks.Div id="id1-0" />);
    });
    expectChildren(wrapper, "id4", "id1-0", "id2-0", "id3");

    executeAsSingleRender(wrapper, () => {
      instance.insertChild(<UU5.Bricks.Div id="id5" />, { position: 0 });
      instance.replaceChild("id5", <UU5.Bricks.Div id="id5-0" />);
    });
    expectChildren(wrapper, "id5-0", "id4", "id1-0", "id2-0", "id3");
  });

  it(`deleteChild`, () => {
    const wrapper = mount(
      <UU5.Bricks.Div dynamic controlled={false} id="root">
        <UU5.Bricks.Div id="id1" />
        <UU5.Bricks.Div id="id2" />
        <UU5.Bricks.Div id="id3" />
      </UU5.Bricks.Div>
    );
    let instance = wrapper.instance();
    expectChildren(wrapper, "id1", "id2", "id3");

    instance.deleteChild("id2");
    expectChildren(wrapper, "id1", "id3");

    executeAsSingleRender(wrapper, () => {
      instance.insertChild(<UU5.Bricks.Div id="id4" />, { position: 0 });
      instance.deleteChild("id1");
    });
    expectChildren(wrapper, "id4", "id3");

    executeAsSingleRender(wrapper, () => {
      instance.insertChild(<UU5.Bricks.Div id="id5" />, { position: 0 });
      instance.deleteChild("id5");
    });
    expectChildren(wrapper, "id4", "id3");
  });

  it(`clearChildren`, () => {
    const wrapper = mount(
      <UU5.Bricks.Div dynamic controlled={false} id="root">
        <UU5.Bricks.Div id="id1" />
        <UU5.Bricks.Div id="id2" />
        <UU5.Bricks.Div id="id3" />
      </UU5.Bricks.Div>
    );
    let instance = wrapper.instance();
    expectChildren(wrapper, "id1", "id2", "id3");

    instance.clearChildren();
    expectChildren(wrapper);

    instance.insertChild(<UU5.Bricks.Div id="id1" />);
    expectChildren(wrapper, "id1");
    executeAsSingleRender(wrapper, () => {
      instance.insertChild(<UU5.Bricks.Div id="id2" />);
      instance.clearChildren();
      instance.insertChild(<UU5.Bricks.Div id="id3" />);
    });
    expectChildren(wrapper, "id3");

    executeAsSingleRender(wrapper, () => {
      instance.insertChild(<UU5.Bricks.Div id="id2" />);
      instance.clearChildren();
    });
    expectChildren(wrapper);
  });
});

function expectChildren(wrapper, ...ids) {
  let instance = wrapper.instance();

  // assert that children have expected IDs & order
  let children = instance.getChildren();
  expect(children).toBeTruthy();
  expect(children.length).toBe(ids.length);
  expect(children.map((child) => child.props.id || "")).toEqual(ids);

  // assert that children don't have same keys
  let usedKeys = children.map((child) => child.props.key).filter(Boolean);
  let usedUniqueKeys = [...new Set(usedKeys)];
  expect(usedKeys).toEqual(usedUniqueKeys);

  // assert that rendered children have same IDs & order as children
  let renderedChildren = instance.getRenderedChildren();
  expect(renderedChildren).toBeTruthy();
  expect(renderedChildren.length).toBe(children.length);
  expect(renderedChildren.map((child) => child.props.id || "")).toEqual(children.map((child) => child.props.id || ""));
}

function executeAsSingleRender(wrapper, testFn) {
  // React cumulates this.setState() calls in case that they're called in event handlers
  // (because React registers handlers itself, so it knows when whole handling is finished and
  // can optimize by cumulating setState-s) => add an event handler and simulate the event
  wrapper.setProps({ mainAttrs: { onSelect: () => testFn() } });
  wrapper.simulate("select");
}
