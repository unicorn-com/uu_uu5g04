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

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: [
    "UU5.Forms.ControlsMixin",
    "UU5.Common.BaseMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.ElementaryMixin"
  ],
  props: {
    buttonReset: {
      values: [true, false]
    },
    buttonValidate: {
      values: [true, false]
    }
  },
  requiredProps: {
    //The component does not have any required props
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

describe(`UU5.Forms.Controls props`, () => {
  UU5.Test.Tools.testProperties(UU5.Forms.Controls, CONFIG);

  it('buttonProps', () => {
    const wrapper = mount(<UU5.Forms.Controls id={"controlsID"} buttonSubmitProps={{ className: "submit-button", disabled: true }} />);
    let submitButton = wrapper.find("button").find(".submit-button");
    expect(submitButton.hasClass("uu5-common-disabled")).toBeTruthy();
  });
});

describe(`UU5.Forms.Controls docKit example`, () => {

  it('Example forms with formcontrols', () => {
    const wrapper = shallow(
      <UU5.Forms.Form
        id={"idRoot"}
        header={<UU5.Bricks.Box
          id={"idBox"}
          content='Basic registration form demo'
          colorSchema='green'
          className='font-size-m'/>}
      >
        <UU5.Forms.Text
          id={"idText"}
          label='Name'
          name='name'
          placeholder='John'
          required
        />
        <UU5.Forms.Text
          id={"idText2"}
          label='SubName'
          name='subname'
          placeholder='Smith'
          required
        />
        <UU5.Forms.Controls id={"controlsID"} buttonReset buttonValidate />
      </UU5.Forms.Form>
    );
    expect(wrapper).toMatchSnapshot();
  });


  it(`UU5.Commons.Mixin Base,Elementary`, () => {
    const wrapper = shallow(
      <UU5.Forms.Controls id={"controlsID"} buttonReset buttonValidate />
    );
    //Check UU5.Common.Elementary.Mixin default props
    expect(wrapper.instance().props.hidden).toBeFalsy();
    expect(wrapper.instance().props.disabled).toBeFalsy();
    expect(wrapper.instance().props.selected).toBeFalsy();
    expect(wrapper.instance().props.controlled).toBeTruthy;
    //Check default values of props BaseMixin.
    expect(wrapper.instance().props.id).toEqual("controlsID");
    expect(wrapper.instance().props.name).toBe(null);
    expect(wrapper.instance().props.tooltip).toBe(null);
    expect(wrapper.instance().props.className).toBe(null);
    expect(wrapper.instance().props.style).toBe(null);
    expect(wrapper.instance().props.mainAttrs).toBe(null);
    expect(wrapper.instance().props.parent).toBe(null);
    expect(wrapper.instance().props.ref_).toBe(null);
    expect(wrapper.instance().props.noIndex).toBeFalsy();
    //Check UU5.Common.PureRender.Mixin default values
    expect(wrapper.instance().props.pureRender).toBeFalsy();
  });
});


