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

describe("UU5.Forms.Select.Option", function() {
  it("getValue()", () => {
    let select;
    let selectOption;
    const wrapper = mount(
      <UU5.Forms.Select label="Issue category" disableBackdrop ref_={item => (select = item)}>
        <UU5.Forms.Select.Option
          value="Info"
          ref_={item => {
            selectOption = item;
          }}
        />
      </UU5.Forms.Select>
    );
    select.open();
    wrapper.update();
    expect(selectOption.getValue()).toEqual("Info");
    expect(selectOption.state).toEqual(
      expect.objectContaining({
        hidden: false,
        disabled: false,
        selected: false
      })
    );
  });
});
