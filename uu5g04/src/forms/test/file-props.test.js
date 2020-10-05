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

let origIsTrustedDomain;
beforeEach(async () => {
  origIsTrustedDomain = UU5.Environment.isTrustedDomain;
  UU5.Environment.isTrustedDomain = () => true;
});
afterEach(() => {
  UU5.Environment.isTrustedDomain = origIsTrustedDomain;
});

const MixinPropsFunction = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],

  getInitialState() {
    return {
      isCalled: false,
      defaultValue: null,
    };
  },

  onChangeHandler(event) {
    alert("onChange event has been called.");
    this.setState({ isCalled: true });
    this.setState({ defaultValue: event.target.value });
  },

  onValidateHandler(event) {
    alert("onValidate event has been called.");
    this.setState({ isCalled: true });
    this.setState({ defaultValue: event.target.value });
  },

  onChangeFeedbackHandler(event) {
    alert("onChangeFeedback event has been called.");
    this.setState({ isCalled: true });
    this.setState({ defaultValue: event.target.value });
  },

  render() {
    return (
      <UU5.Forms.File
        id={"checkID"}
        label="Select file."
        value={this.state.defaultValue}
        onChange={this.onChangeHandler}
        onValidate={this.onValidateHandler}
        onChangeFeedback={this.onChangeFeedbackHandler}
      />
    );
  },
});

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Forms.InputMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.ChoiceMixin",
  ],
  props: {
    value: {
      values: [{ name: "ucetniuzaverka.doc" }, [{ name: "ucetniuzaverka1.doc" }, { name: "index.html" }]],
    },
    multiple: {
      values: [true, false],
    },
    icon: {
      values: ["mdi-clock-outline"],
    },
    selectedIcon: {
      values: ["mdi-clock-outline"],
    },
    closeIcon: {
      values: ["uu5-minus"],
    },
  },
  requiredProps: {
    //The component does not have any required props
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

describe(`UU5.Forms.File props`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.File, CONFIG);

  it("downloadIcon", () => {
    let wrapper = shallow(
      <UU5.Forms.File
        id="uuID"
        downloadIcon="mdi-account"
        value={{ name: "test.json", url: "http://localhost/getFile?code=test.json" }}
      />
    );
    expect(wrapper).toMatchSnapshot();

    wrapper.setProps({ downloadIcon: "mdi-content-save" });
    expect(wrapper).toMatchSnapshot();

    wrapper.setProps({ downloadIcon: null });
    expect(wrapper).toMatchSnapshot();
  });

  it("authenticate", async () => {
    let wrapper = shallow(
      <UU5.Forms.File
        id="uuID"
        authenticate
        value={{ name: "test.json", url: "http://localhost/getFile?code=test.json" }}
      />
    );
    await wait();
    expect(wrapper).toMatchSnapshot();

    wrapper.setProps({ authenticate: false });
    await wait();
    expect(wrapper).toMatchSnapshot();

    wrapper.setProps({ authenticate: null });
    await wait();
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.File props function -> Forms.InputMixin`, () => {
  it("onChange()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().defaultValue).toEqual(null);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("change", { target: { value: { name: "test.js" } } });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChange event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(wrapper.state().defaultValue).toMatchObject({ name: "test.js" });
    expect(window.alert.mock.calls[0][0]).toEqual("onChange event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it(`onChangeDefault() with callback`, () => {
    let callback = jest.fn();
    let wrapper = shallow(<UU5.Forms.File />);
    wrapper.instance().onChangeDefault({}, callback);
    expect(callback).toBeCalled();
  });

  it("onValidate()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().isCalled).toBeFalsy();
    expect(wrapper.state().defaultValue).toEqual(null);
    wrapper.simulate("validate", { target: { value: { name: "test.js" } } });
    expect(wrapper.state().defaultValue).toMatchObject({ name: "test.js" });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onValidate event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onValidate event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it("onChangeFeedback()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().isCalled).toBeFalsy();
    expect(wrapper.state().defaultValue).toEqual(null);
    wrapper.simulate("changeFeedback", { target: { value: { name: "test.js" } } });
    expect(wrapper.state().defaultValue).toMatchObject({ name: "test.js" });
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onChangeFeedback event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onChangeFeedback event has been called.");
    expect(wrapper).toMatchSnapshot();
  });
});
