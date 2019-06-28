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
import {shallow} from 'enzyme';
import UU5 from "uu5g04";
import "uu5g04-bricks";
import enzymeToJson from 'enzyme-to-json';
import TestTools from "../../core/test/test-tools.js";

const TagName = "UU5.Bricks.ClickConfirm";

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.CcrWriterMixin"
  ],
  props: {
    //Component have not own props
  },
  requiredProps: {
    //Component have not own requiredProps
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    },
    enzymeToJson: false
  }
};

const This = {};

describe(`${TagName}`, () => {
  TestTools.testProperties(TagName, CONFIG);
});

describe('UU5.Bricks.ClickConfirm - example in dockit', () => {

  it('example in dockit', () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"containerID"}>
        <UU5.Bricks.ClickConfirm id={"uuOID"} ref_={(click) => this._click = click}/>
        <UU5.Bricks.TouchIcon
          id={"uuID"}
          content="open"
          icon="mdi-verified"
          colorSchema="pink"
          onClick={(button, event) => {
            this._click.open({
              content: <UU5.Bricks.Badge id={"idBadge"} content="Verified"/>,
              event: event
            })
          }}
        />
      </UU5.Bricks.Container>
    );
    expect(enzymeToJson(wrapper)).toMatchSnapshot();
  });

});


