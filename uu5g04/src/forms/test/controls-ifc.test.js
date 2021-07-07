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

describe("UU5.Forms.ControlsMixin intreface testing", function () {
  it("getForm() should return instance of forms", () => {
    const wrapper = mount(
      <UU5.Forms.Form
        id={"idForm"}
        header={
          <UU5.Bricks.Box
            id={"uuID"}
            content="Basic registration form demo"
            colorSchema="green"
            className="font-size-m"
          />
        }
      >
        <UU5.Forms.Text
          id={"uuID02"}
          label="SubName"
          name="subname"
          placeholder="Smith"
          required
          ref_={(text) => (this.text = text)}
        />
        <UU5.Forms.Controls id={"controlsID"} ref_={(controls) => (this.controls = controls)} />
      </UU5.Forms.Form>
    );
    expect(this.controls.getForm()).not.toBe(undefined);
    expect(this.controls.getForm()).not.toBe(null);
    expect(this.controls.getForm()).toEqual(expect.any(Object));
    expect(() => this.controls.getForm()).not.toThrow();
    expect(this.controls.getForm() === wrapper.instance()).toBe(true);
  });
});
