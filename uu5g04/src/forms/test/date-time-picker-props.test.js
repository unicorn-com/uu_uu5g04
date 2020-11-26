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

const { mount, shallow, wait, setInputValue } = UU5.Test.Tools;

function accessCurrentValues(wrapper) {
  return {
    value: () => wrapper.instance().getValue(),
    displayedDateValue: () => {
      let inputs = wrapper.find("input");
      return inputs.length > 0 ? inputs.at(0).getDOMNode().value : null;
    },
    displayedTimeValue: () => {
      let inputs = wrapper.find("input");
      return inputs.length > 1 ? inputs.at(1).getDOMNode().value : null;
    },
  };
}

const MixinPropsFunction = UU5.Common.VisualComponent.create({
  mixins: [UU5.Common.BaseMixin],

  getInitialState() {
    return {
      isCalled: false,
      defaultValue: "09.02.2013 12:00:00",
    };
  },

  onFocusHandler(event) {
    alert("onFocus event has been called.");
    this.setState({ isCalled: true });
  },

  onBlurHandler(event) {
    alert("onBlur event has been called.");
    this.setState({ isCalled: true });
  },

  onEnterHandler(event) {
    alert("onEnter event has been called.");
    this.setState({ isCalled: true });
  },

  validateOnChangeHandler(event) {
    alert("ValidateOnChange event has been called.");
    this.setState({ isCalled: true });
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
      <UU5.Forms.DateTimePicker
        id={"checkID"}
        label="Date of birth"
        value={this.state.defaultValue}
        onFocus={this.onFocusHandler}
        onBlur={this.onBlurHandler}
        onEnter={this.onEnterHandler}
        validateOnChange={true}
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
    "UU5.Forms.TextInputMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Forms.InputMixin",
  ],
  props: {
    value: {
      values: ["1.1.2017", "1994-10-10T10:00:00", "1994-10-10T10:00:00Z"],
    },
    dateFrom: {
      values: ["1.1.1990"],
    },
    dateTo: {
      values: ["1.1.2020"],
    },
    buttonHidden: {
      values: [true, false],
    },
    calendarIconOpen: {
      values: ["uu5-clock"],
    },
    calendarIconClosed: {
      values: ["uu5-clock"],
    },
    timeIconOpen: {
      values: ["uu5-arrow-right"],
    },
    timeIconClosed: {
      values: ["uu5-arrow-left"],
    },
    format: {
      values: ["dd.mm.Y", "dd/mm/Y", "dd-mm-Y", "dd:mm:Y - q"],
    },
    hideFormatPlaceholder: {
      values: [true, false],
    },
    timeFormat: {
      values: ["12", "24"],
    },
    seconds: {
      values: [true, false],
    },
    country: {
      values: ["en-us"],
    },
    nanMessage: {
      values: ["Prosím zadejte validní datum a čas."],
    },
    beforeRangeMessage: {
      values: ["Zkus zadat pozdější datum a čas."],
    },
    afterRangeMessage: {
      values: ["Přestřelil jsi, zkus trochu ubrat."],
    },
    // parseDate -In agreement with developers, this props need not be tested.
    placeholderTime: {
      values: ["15:00"],
    },
    dateIcon: {
      values: ["uu5-plus"],
    },
    timeIcon: {
      values: ["uu5-clock"],
    },
    valueType: {
      values: [null, "date", "string"],
    },
    dateInputAttrs: {
      values: [null, { style: "background-color: red" }],
    },
    timeInputAttrs: {
      values: [null, { style: "background-color: red" }],
    },
    hideWeekNumber: {
      values: [true, false]
    }
  },
  requiredProps: {
    //The component does not have any required props
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false,
    },
  },
};

const ISOFormatTest = (props, country, expectedValue) => {
  const wrapper = mount(<UU5.Forms.DateTimePicker {...props} country={country} id="uuID" />);

  let dateValue = wrapper.find("#uuID-date-input").at(1).getDOMNode().value;
  let timeValue = wrapper.find("#uuID-time-input").at(1).getDOMNode().value;

  expect(dateValue + " " + timeValue).toBe(expectedValue);
};

describe(`UU5.Forms.DateTimePicker props`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.DateTimePicker, CONFIG);

  it(`UU5.Forms.DateTimePicker - ISO format value`, () => {
    let defaultCountry = "en-US";
    ISOFormatTest({ value: "2019-07-20" }, defaultCountry, "7/20/2019 00:00");
    ISOFormatTest({ value: "2019-07-20T07:00:00.000Z" }, defaultCountry, "7/20/2019 09:00");
    ISOFormatTest({ value: "2019-07-20T07:00:00.000+02:00" }, defaultCountry, "7/20/2019 07:00");
    // FIXME Uncomment when Jest tests use full-icu so that Intl.DateTimeFormat works.
    // ISOFormatTest({ value: "2019-07-20T07:00:00.000+02:00" }, "cs-CZ", "20. 7. 2019 07:00");
    ISOFormatTest({ value: "2019-07-20T07:00:00.000+02:00", seconds: true }, defaultCountry, "7/20/2019 07:00:00");
    ISOFormatTest({ value: "2019-07-20T07:00:00.000+02:00", timeFormat: "12" }, defaultCountry, "7/20/2019 07:00 AM");
  });

  it(`valueType`, () => {
    let wrapper = mount(<UU5.Forms.DateTimePicker value="2.2.2020 10:00" valueType="iso" />);
    expect(wrapper.instance().getValue()).toBe("2020-02-02T09:00:00.000Z");

    wrapper = mount(<UU5.Forms.DateTimePicker value="2.2.2020 10:00" valueType="isoLocal" />);
    expect(wrapper.instance().getValue()).toBe("2020-02-02T10:00:00");
  });
});

describe("TextInputMixin props.function", () => {
  it("validateOnChange() -  input is invalid", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"uuID"}
        label="Date of appointment"
        validateOnChange={true}
        onValidate={(opt) => {
          let feedback;
          if (opt.value) {
            feedback = {
              feedback: "success",
              message: "Is valid.",
              value: opt.value,
            };
          } else {
            feedback = {
              feedback: "error",
              message: "Not valid.",
              value: opt.value,
            };
          }
          return feedback;
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.feedback).toEqual("error");
    expect(wrapper.instance().state.message).toEqual("Not valid.");
    expect(wrapper.instance().getValue()).toBe(null);
    expect(wrapper.instance().state.dateString).toEqual(null);
    expect(wrapper.instance().state.timeString).toEqual(null);
  });

  it("validateOnChange() -  input is valid", () => {
    const wrapper = shallow(
      <UU5.Forms.DateTimePicker
        id={"uuID"}
        label="Date of appointment"
        validateOnChange={true}
        value={"9.11.2013 12:00"}
        onValidate={(opt) => {
          let feedback;
          if (opt.value) {
            feedback = {
              feedback: "success",
              message: "Is valid.",
              value: opt.value,
            };
          } else {
            feedback = {
              feedback: "error",
              message: "Not valid.",
              value: opt.value,
            };
          }
          return feedback;
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.feedback).toEqual("success");
    expect(wrapper.instance().state.message).toEqual("Is valid.");
    expect(wrapper.instance().getValue()).toMatch(/9.11.2013 12:00/);
    expect(wrapper.instance().state.dateString).toBe("09/11/2013");
    expect(wrapper.instance().state.timeString).toBe("12:00");
  });

  it(`onChangeDefault() with callback`, () => {
    let callback = jest.fn();
    let wrapper = shallow(<UU5.Forms.DateTimePicker />);
    wrapper.instance().onChangeDefault({ _data: { type: "calendarPicker" } }, callback);
    expect(callback).toBeCalled();
  });

  it("onFocus()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("focus");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onFocus event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onFocus event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it("onBlur()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("blur");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onBlur event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onBlur event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it("onEnter()", () => {
    window.alert = jest.fn();
    const wrapper = shallow(<MixinPropsFunction />);
    expect(wrapper.state().isCalled).toBeFalsy();
    wrapper.simulate("enter");
    expect(window.alert).toBeCalled();
    expect(window.alert).toHaveBeenCalledWith("onEnter event has been called.");
    expect(wrapper.state().isCalled).toBeTruthy();
    expect(window.alert.mock.calls[0][0]).toEqual("onEnter event has been called.");
    expect(wrapper).toMatchSnapshot();
  });

  it("timeZone", () => {
    let wrapper, value, displayedTimeValue;

    wrapper = mount(<UU5.Forms.DateTimePicker timeZone={3} value={"2019-11-01T10:00:00Z"} />);
    expect(wrapper.instance().getValue()).toBe("01/11/2019 11:00");

    // "iso"; displayed value should be adjusted by timeZone prop; getValue() should remain initial (but affected by valueType)
    wrapper = mount(<UU5.Forms.DateTimePicker timeZone={5} value={"2019-11-01T10:00:00Z"} valueType="iso" />);
    ({ value, displayedTimeValue } = accessCurrentValues(wrapper));
    expect(displayedTimeValue()).toBe("15:00");
    expect(value()).toBe("2019-11-01T10:00:00.000Z");
    // changing time should parse the new time as if it was in timeZone
    setInputValue(wrapper.find("input").at(1), "18:00"); // +3 from currently displayed
    expect(displayedTimeValue()).toBe("18:00");
    expect(value()).toBe("2019-11-01T13:00:00.000Z"); // +3 from initial

    // "isoLocal"; displayed value should be adjusted by timeZone prop; getValue() should stay the same as initial (but affected by valueType)
    wrapper = mount(<UU5.Forms.DateTimePicker timeZone={5} value={"2019-11-01T10:00:00Z"} valueType="isoLocal" />);
    ({ value, displayedTimeValue } = accessCurrentValues(wrapper));
    expect(displayedTimeValue()).toBe("15:00");
    expect(value()).toBe("2019-11-01T11:00:00"); // local OS time zone (cs-CZ) for that date is GMT+1
    // changing time should parse the new time as if it was in timeZone
    setInputValue(wrapper.find("input").at(1), "18:00"); // +3 from currently displayed
    expect(displayedTimeValue()).toBe("18:00");
    expect(value()).toBe("2019-11-01T14:00:00"); // +3 from initial

    // "string"; displayed value should be adjusted by timeZone prop; getValue() should stay the same as initial (but affected by valueType)
    wrapper = mount(<UU5.Forms.DateTimePicker timeZone={5} value={"2019-11-01T10:00:00Z"} valueType="string" />);
    ({ value, displayedTimeValue } = accessCurrentValues(wrapper));
    expect(displayedTimeValue()).toBe("15:00");
    expect(value()).toBe("01/11/2019 11:00"); // local OS time zone (cs-CZ) for that date is GMT+1
    // changing time should parse the new time as if it was in timeZone
    setInputValue(wrapper.find("input").at(1), "18:00"); // +3 from currently displayed
    expect(displayedTimeValue()).toBe("18:00");
    expect(value()).toBe("01/11/2019 14:00"); // +3 from initial

    // "date"; displayed value should be adjusted by timeZone prop; getValue() should stay the same as initial (but affected by valueType)
    wrapper = mount(<UU5.Forms.DateTimePicker timeZone={5} value={"2019-11-01T10:00:00Z"} valueType="date" />);
    ({ value, displayedTimeValue } = accessCurrentValues(wrapper));
    expect(displayedTimeValue()).toBe("15:00");
    expect(value() + "").toBe(new Date("2019-11-01T10:00:00Z") + "");
    // changing time should parse the new time as if it was in timeZone
    setInputValue(wrapper.find("input").at(1), "18:00"); // +3 from currently displayed
    expect(displayedTimeValue()).toBe("18:00");
    expect(value() + "").toBe(new Date("2019-11-01T13:00:00Z") + ""); // +3 from initial

    // TODO Negative timeZone.
  });
});

describe(`UU5.Forms.DateTimePicker props function`, () => {
  it("parseDate(), valueType is null", function () {
    const dateValue = "2013-08-02";
    const timeValue = "01:20";
    const method = jest.fn(() => new Date(2019, 2, 14, 5, 23, 0, 0));
    const wrapper = shallow(<UU5.Forms.DateTimePicker id={"checkID"} parseDate={method} />);
    method.mockClear();
    // according to docs, parseDate is for parsing passed value, i.e. calling getValue()
    // should trigger it (though maybe multiple times so we'll check only last invocation)
    let value = wrapper
      .setProps({ value: dateValue + " " + timeValue })
      .instance()
      .getValue();
    expect(method).toBeCalled();
    expect(value + "").toBe("14/03/2019 01:20");
    expect(wrapper).toMatchSnapshot();
  });

  it("parseDate(), valueType is string", function () {
    const dateValue = "2013-08-02";
    const timeValue = "01:20";
    const method = jest.fn(() => new Date(2019, 2, 14, 5, 23, 0, 0));
    const wrapper = shallow(<UU5.Forms.DateTimePicker id={"checkID"} parseDate={method} valueType="string" />);
    method.mockClear();
    // according to docs, parseDate is for parsing passed value, i.e. calling getValue()
    // should trigger it (though maybe multiple times so we'll check only last invocation)
    let value = wrapper
      .setProps({ value: dateValue + " " + timeValue })
      .instance()
      .getValue();
    expect(method).toBeCalled();
    expect(value + "").toBe("14/03/2019 01:20");
    expect(wrapper).toMatchSnapshot();
  });

  it("parseDate(), valueType is date", function () {
    const dateValue = "2013-08-02";
    const timeValue = "01:20";
    const method = jest.fn(() => new Date(2019, 2, 14, 5, 23, 0, 0));
    const wrapper = shallow(<UU5.Forms.DateTimePicker id={"checkID"} parseDate={method} valueType="date" />);
    method.mockClear();
    // according to docs, parseDate is for parsing passed value, i.e. calling getValue()
    // should trigger it (though maybe multiple times so we'll check only last invocation)
    let value = wrapper
      .setProps({ value: dateValue + " " + timeValue })
      .instance()
      .getValue();
    expect(method).toBeCalled();
    let expectedValue = new Date(2019, 2, 14, 5, 23, 0, 0);
    expectedValue.setHours(1);
    expectedValue.setMinutes(20);
    expect(value.getTime()).toBe(expectedValue.getTime());
    expect(wrapper).toMatchSnapshot();
  });
});

describe(`UU5.Forms.DateTimePicker default props check`, () => {
  it(`UU5.Forms.DateTimePicker daf props values`, () => {
    const wrapper = shallow(<UU5.Forms.DateTimePicker id={"uuID"} />);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.value).toBe(null);
    expect(wrapper.instance().props.dateFrom).toBe(null);
    expect(wrapper.instance().props.dateTo).toBe(null);
    expect(wrapper.instance().props.format).toBe(null);
    expect(wrapper.instance().props.hideFormatPlaceholder).toBe(false);
    expect(wrapper.instance().props.timeFormat).toBe(null);
    expect(wrapper.instance().props.country).toBe(null);
    expect(wrapper.instance().props.seconds).toBeFalsy();
    expect(wrapper.instance().props.seconds).not.toBeUndefined();
    expect(wrapper.instance().props.nanMessage).toMatch(/Please insert a valid date and time./);
    expect(wrapper.instance().props.beforeRangeMessage).toMatch(/Date and time is out of range./);
    expect(wrapper.instance().props.afterRangeMessage).toMatch(/Date and time is out of range./);
    expect(wrapper.instance().props.placeholderTime).toBe(null);
    expect(wrapper.instance().props.dateIcon).toMatch(/mdi-calendar/);
    expect(wrapper.instance().props.timeIcon).toMatch(/mdi-clock-outline/);
  });
});

describe(`UU5.Forms.DateTimePicker check default default props from Mixins`, () => {
  it(`UU5.Forms.InputMixin`, () => {
    const wrapper = shallow(<UU5.Forms.DateTimePicker id={"uuID"} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.inputAttrs).toBe(null);
    expect(wrapper.instance().props.size).toEqual("m");
    expect(wrapper.instance().props.readOnly).toBeFalsy();
    expect(wrapper.instance().props.feedback).toEqual("initial");
    expect(wrapper.instance().props.message).toBe(null);
    expect(wrapper.instance().props.label).toBe(null);
    expect(wrapper.instance().props.onChange).toBe(null);
    expect(wrapper.instance().props.onValidate).toBe(null);
    expect(wrapper.instance().props.onChangeFeedback).toBe(undefined);
    expect(wrapper.instance().props.inputColWidth).toMatchObject({ xs: 12, s: 7 });
    expect(wrapper.instance().props.labelColWidth).toMatchObject({ xs: 12, s: 5 });
  });

  it(`UU5.Forms.TextInputMixin`, () => {
    const wrapper = shallow(<UU5.Forms.DateTimePicker id={"uuID"} />);
    expect(wrapper.instance().props.placeholder).toBe(null);
    expect(wrapper.instance().props.required).toBeFalsy();
    expect(wrapper.instance().props.requiredMessage).toBe(null);
    expect(wrapper.instance().props.focusMessage).toBe(null);
    expect(wrapper.instance().props.patternMessage).toBe(null);
    expect(wrapper.instance().props.autocompleteItems).toBe(null);
    expect(wrapper.instance().props.onFocus).toBe(null);
    expect(wrapper.instance().props.onBlur).toBe(null);
    expect(wrapper.instance().props.onEnter).toBe(null);
    expect(wrapper.instance().props.validateOnChange).toBeFalsy();
  });

  it(`UU5.Commons.Mixin Base,Elementary`, () => {
    const wrapper = shallow(<UU5.Forms.DateTimePicker id={"uuID"} />);
    //Check UU5.Common.Elementary.Mixin default props
    expect(wrapper.instance().props.hidden).toBeFalsy();
    expect(wrapper.instance().props.disabled).toBeFalsy();
    expect(wrapper.instance().props.selected).toBeFalsy();
    expect(wrapper.instance().props.controlled).toBeTruthy;
    //Check default values of props BaseMixin.
    expect(wrapper.instance().props.id).toEqual("uuID");
    expect(wrapper.instance().props.name).toBe(null);
    expect(wrapper.instance().props.tooltip).toBe(null);
    expect(wrapper.instance().props.className).toBe(null);
    expect(wrapper.instance().props.style).toBe(null);
    expect(wrapper.instance().props.mainAttrs).toBe(null);
    expect(wrapper.instance().props.parent).toBe(null);
    expect(wrapper.instance().props.ref_).toBe(null);
    expect(wrapper.instance().props.noIndex).toBeFalsy();
    expect(wrapper.instance().props.hideWeekNumber).toBe(false);
  });
});
