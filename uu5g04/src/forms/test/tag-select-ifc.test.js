/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

const { mount, shallow, wait } = UU5.Test.Tools;
const availableTags = [
  { value: "Prg", content: { cs: "Praha", en: "Prague" } },
  { value: "Plzeň" },
  { value: "Brno", content: <div>Brno</div> },
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
