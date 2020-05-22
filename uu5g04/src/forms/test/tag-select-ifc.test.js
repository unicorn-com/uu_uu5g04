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
import "uu5g04-forms";

const { mount, shallow, wait } = UU5.Test.Tools;
const availableTags = [
  { value: "Prg", content: { cs: "Praha", en: "Prague" } },
  { value: "Plzeň" },
  { value: "Brno", content: <div>Brno</div> }
];

describe("UU5.Forms.InputMixin interface test", () => {
  it("setValue(value, setStateCallBack)", () => {
    const wrapper = shallow(<UU5.Forms.TagSelect availableTags={availableTags} />);
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining([]));
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().setValue(["Prg"], mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining(["Prg"]));
    wrapper.instance().setValue(["Ostrava"], mockFunc); // this isn't allowed value so it won't be set
    wrapper.update();
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining([]));
  });

  it("setValue - allowCustomTags and ignoreTags", () => {
    const wrapper = shallow(
      <UU5.Forms.TagSelect availableTags={availableTags} allowCustomTags ignoreTags={["Hradec Králové"]} />
    );
    const mockFunc = jest.fn();
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining([]));
    wrapper.instance().setValue(["Ostrava"], mockFunc);
    wrapper.update();
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining(["Ostrava"]));
    wrapper.instance().setValue(["Hradec Králové"], mockFunc); // this is ignored tag so it won't be set
    wrapper.update();
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining([]));
  });

  it("setFeedback", () => {
    const wrapper = shallow(<UU5.Forms.TagSelect availableTags={availableTags} />);
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().setFeedback("success", "Success message", ["Prg"], mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("Success message");
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining(["Prg"]));
    wrapper.instance().setFeedback("error", "Error message", ["Ostrava"], mockFunc); // this isn't allowed value so it won't be set
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("Error message");
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining([]));
  });

  it("setFeedback - allowCustomTags and ignoreTags", () => {
    const wrapper = shallow(
      <UU5.Forms.TagSelect availableTags={availableTags} allowCustomTags ignoreTags={["Hradec Králové"]} />
    );
    expect(wrapper.instance().getFeedback()).toEqual("initial");
    const mockFunc = jest.fn();
    const returnValue = wrapper.instance().setFeedback("success", "Success message", ["Ostrava"], mockFunc);
    wrapper.update();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().getFeedback()).toEqual("success");
    expect(wrapper.instance().getMessage()).toEqual("Success message");
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining(["Ostrava"]));
    wrapper.instance().setFeedback("error", "Error message", ["Hradec Králové"], mockFunc); // this isn't allowed value so it won't be set
    wrapper.update();
    expect(wrapper.instance().getFeedback()).toEqual("error");
    expect(wrapper.instance().getMessage()).toEqual("Error message");
    expect(wrapper.instance().getValue()).toEqual(expect.arrayContaining([]));
  });
});
