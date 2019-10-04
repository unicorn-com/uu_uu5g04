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

// these are using "require" for easier setting up of SystemJS
const React = require("react");
const ReactDnD = require("react-dnd");
const ReactDnDHtml5Backend = require("react-dnd-html5-backend");

// loading SystemJS into JSDOM environment needs a bit of fiddling...
let origDocument = global.document;
let origLocation = global.location;
delete global.document;
delete global.location;
let SystemJS = require("systemjs");
global.document = origDocument;
global.location = origLocation;
SystemJS.set(SystemJS.normalizeSync("react-dnd"), SystemJS.newModule(ReactDnD));
SystemJS.set(SystemJS.normalizeSync("react-dnd-html5-backend"), SystemJS.newModule(ReactDnDHtml5Backend));

class Component extends React.Component {
  render() {
    return this.props.connectDragSource(
      <div id={this.props.id}>
        <div>isDragging: {this.props.isDragging}</div>
        {this.props.children}
      </div>
    );
  }
}
const dragSpec = {
  beginDrag(props, monitor, component) {
    return { id: props.id };
  }
};
const dragCollect = function (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: !!monitor.isDragging()
  };
};
const DnDComponent = ReactDnD.DragSource("item", dragSpec, dragCollect)(Component);

describe(`UU5.Common.DnD`, () => {
  it("Provider - basic usage", function() {
    let content = "Content of DnD Component";

    // DnD.Provider with native DnDComponent - should work
    let wrapper = mount(
      <UU5.Common.DnD.Provider>
        <DnDComponent id="dnd">{content}</DnDComponent>
      </UU5.Common.DnD.Provider>
    );
    expect(wrapper.find("#dnd").first().html() || "").toContain(content);
    wrapper.unmount();

    // standalone native DnDComponent - won't work (missing DragDropContext)
    wrapper = mount(<DnDComponent id="dnd">{content}</DnDComponent>);
    expect(wrapper.find("#dnd").first().html() || "").not.toContain(content);
    wrapper.unmount();
  });

  it("withContext - basic usage", function() {
    const DnDComponentWithContext = UU5.Common.DnD.withContext(DnDComponent);
    let content = "Content of DnD Component";

    // DnD.Provider with UU5-wrapped DnDComponent - should work
    let wrapper = mount(
      <UU5.Common.DnD.Provider>
        <DnDComponentWithContext id="dnd">{content}</DnDComponentWithContext>
      </UU5.Common.DnD.Provider>
    );
    expect(wrapper.find("#dnd").first().html() || "").toContain(content);
    wrapper.unmount();

    // standalone UU5-wrapped DnDComponent - should work
    wrapper = mount(<DnDComponentWithContext id="dnd">{content}</DnDComponentWithContext>);
    expect(wrapper.find("#dnd").first().html() || "").toContain(content);
    wrapper.unmount();

    // DnD.Provider with multiple components - should work
    wrapper = mount(
      <UU5.Common.DnD.Provider>
        <DnDComponentWithContext id="dnd1">{content}</DnDComponentWithContext>
        <DnDComponentWithContext id="dnd2">{content}</DnDComponentWithContext>
        <DnDComponent id="dnd3">{content}</DnDComponent>
      </UU5.Common.DnD.Provider>
    );
    expect(wrapper.find("#dnd1").first().html() || "").toContain(content);
    expect(wrapper.find("#dnd2").first().html() || "").toContain(content);
    expect(wrapper.find("#dnd3").first().html() || "").toContain(content);
    wrapper.unmount();

    // multiple standalone components - only UU5-wrapped should work
    wrapper = mount(
      <div>
        <DnDComponentWithContext id="dnd1">{content}</DnDComponentWithContext>
        <DnDComponentWithContext id="dnd2">{content}</DnDComponentWithContext>
        <DnDComponent id="dnd3">{content}</DnDComponent>
      </div>
    );
    expect(wrapper.find("#dnd1").first().html() || "").toContain(content);
    expect(wrapper.find("#dnd2").first().html() || "").toContain(content);
    expect(wrapper.find("#dnd3").first().html() || "").not.toContain(content);
    wrapper.unmount();
  });

  it("withContext - custom DragDropContext", async function() {
    const DnDComponentWithContext = UU5.Common.DnD.withContext(DnDComponent);
    const App = props => props.children;
    const CustomDnDContext = ReactDnD.DragDropContext(ReactDnDHtml5Backend.default)(App);
    let content = "Content of DnD Component";

    // native DnDComponent - should work
    let wrapper = mount(
      <CustomDnDContext>
        <DnDComponent id="dnd">{content}</DnDComponent>
      </CustomDnDContext>
    );
    expect(wrapper.find("#dnd").first().html() || "").toContain(content);
    wrapper.unmount();

    // UU5-wrapped DnDComponent - should work with omitDragDropContext only ("cannot have 2 backends at the same time")
    await expect(async () => {
      wrapper = mount(
        <CustomDnDContext>
          <DnDComponentWithContext id="dnd1">{content}</DnDComponentWithContext>
          <DnDComponent id="dnd2">{content}</DnDComponent>
        </CustomDnDContext>
      );
      wrapper.unmount();
    }).rejects;
    wrapper = mount(
      <CustomDnDContext>
        <DnDComponentWithContext id="dnd1" omitDragDropContext>{content}</DnDComponentWithContext>
        <DnDComponent id="dnd2">{content}</DnDComponent>
      </CustomDnDContext>
    );
    expect(wrapper.find("#dnd1").first().html() || "").toContain(content);
    expect(wrapper.find("#dnd2").first().html() || "").toContain(content);
    wrapper.unmount();
  });
});
