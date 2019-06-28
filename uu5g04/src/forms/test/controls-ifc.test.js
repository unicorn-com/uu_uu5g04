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

import React from 'react';
import {mount} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";


describe('UU5.Forms.ControlsMixin intreface testing', function () {

  it('getForm() should return instance of forms', () => {
    const wrapper = mount(
      <UU5.Forms.Form
        id={"idForm"}
        header={
          <UU5.Bricks.Box
            id={"uuID"}
            content='Basic registration form demo'
            colorSchema='green'
            className='font-size-m'
          />
        }
      >
        <UU5.Forms.Text
          id={"uuID02"}
          label='SubName'
          name='subname'
          placeholder='Smith'
          required
          ref_={text => this.text = text}
        />
        <UU5.Forms.Controls id={"controlsID"} ref_={controls => this.controls = controls}/>
      </UU5.Forms.Form>
    );
    expect(this.controls.getForm()).not.toBe(undefined);
    expect(this.controls.getForm()).not.toBe(null);
    expect(this.controls.getForm()).toEqual(expect.any(Object));
    expect(() => this.controls.getForm()).not.toThrow();
    expect(this.controls.getForm()).toBe(wrapper.instance());
  });


});
