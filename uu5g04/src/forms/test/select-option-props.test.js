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
import "uu5g04-forms";
//@@viewOff:imports

const { mount, shallow, wait } = UU5.Test.Tools;

const SelectOptionFunctionProps = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],

  getInitialState: () => {
    return {
      isCalled: false,
    };
  },

  onClickItemHandler(event) {
    alert("You clicked to Select.Option.");
    this.setState({ isCalled: true });
  },

  render() {
    return (
      <UU5.Bricks.Container id={"uuID01"}>
        {/*@@viewOn:0*/}
        <UU5.Forms.Select id={"uuID02"} label="Issue category" ref_={(item) => (this.select = item)}>
          <UU5.Forms.Select.Option id={"uuID03"} onClick={this.onClickItemHandler} value="Info" />
        </UU5.Forms.Select>
        {/*@@viewOff:0*/}
      </UU5.Bricks.Container>
    );
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {
    value: {
      values: ["Možnost číslo 1"],
    },
    //onClick: {},
    selectedContent: {
      values: ["Nějaký text"],
    },
  },
  requiredProps: {
    parent: shallow(<UU5.Forms.Select id="parentId" />).instance(),
    value: "option value",
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

describe(`UU5.Forms.Select.Option props`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.Select.Option, CONFIG);

  it("onClick()", () => {
    const wrapper = shallow(<SelectOptionFunctionProps />);
    window.alert = jest.fn();
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.find("select-option").simulate("click");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("You clicked to Select.Option.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("You clicked to Select.Option.");
    expect(wrapper).toMatchSnapshot();
  });
});
