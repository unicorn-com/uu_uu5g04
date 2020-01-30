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

const Draggable = UU5.Common.VisualComponent.create({
  displayName: "Draggable",
  mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin, UU5.Common.ContentMixin, UU5.Bricks.DraggableMixin],

  render: function() {
    return (
      <div {...this.getMainAttrs()}>
        {this.getChildren()}
        {this.getDisabledCover()}
      </div>
    );
  }
});

const MyDragableItemComponent = UU5.Common.VisualComponent.create({
  getInitialState() {
    return {
      isCalled: false
    };
  },

  onMoveStartHandler(event) {
    alert("onMoveStart handler was called successfully.");
    this.setState({ isCalled: true });
  },
  onMoveHandler(event) {
    alert("onMove handler was called successfully.");
    this.setState({ isCalled: true });
  },
  onMoveEndHandler(event) {
    alert("onMoveEnd handler was called successfully.");
    this.setState({ isCalled: true });
  },

  render() {
    return (
      <Draggable className="wrapper" id={"uuID01"}>
        <UU5.Bricks.DraggableItem
          id={"uuID02"}
          className="item"
          onMoveStart={this.onMoveStartHandler}
          onMove={this.onMoveHandler}
          onMoveEnd={this.onMoveEndHandler}
        ></UU5.Bricks.DraggableItem>
      </Draggable>
    );
  }
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.ContentMixin",
    "UU5.Bricks.DraggableMixin"
  ],
  props: {
    x: {
      values: [50]
    },
    y: {
      values: [70]
    }
    //onMoveStart
    //onMove
    //onMoveEnds
  },
  requiredProps: {
    parent: shallow(<Draggable id="parentId" />).instance()
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true
    }
  }
};

describe(`UU5.Bricks.DraggableItem`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.DraggableItem, CONFIG);
});

describe(`UU5.Bricks.DraggableItem props.function`, () => {
  it(`UU5.Bricks.DraggableItem onMoveStart()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyDragableItemComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.find("DraggableItem").simulate("moveStart");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onMoveStart handler was called successfully.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onMoveStart handler was called successfully.");
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.DraggableItem onMove()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyDragableItemComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.find("DraggableItem").simulate("move");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onMove handler was called successfully.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onMove handler was called successfully.");
    expect(wrapper).toMatchSnapshot();
  });

  it(`UU5.Bricks.DraggableItem onMoveEnd()`, () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MyDragableItemComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.find("DraggableItem").simulate("moveEnd");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onMoveEnd handler was called successfully.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onMoveEnd handler was called successfully.");
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Bricks.DraggableItem docKit example`, () => {
  it(`UU5.Bricks.DraggableItem example 01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID1"}>
        {/*@@viewOn:0*/}
        <Draggable id={"uuID2"} className="wrapper">
          <UU5.Bricks.DraggableItem
            id={"uuID3"}
            className="item"
            onMove={obj => {
              console.log(obj.x, obj.y);
              obj.component.setPosition(obj.x, obj.y);
            }}
            onMoveStart={obj => console.log("move started")}
            onMoveEnd={obj => console.log("move ended")}
          ></UU5.Bricks.DraggableItem>
        </Draggable>
        {/*@@viewOff:0*/}
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
