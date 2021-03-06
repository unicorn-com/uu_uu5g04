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

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.LevelMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.PureRenderMixin",
  ],
  props: {},
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

describe(`UU5.Bricks.Section`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.Section, CONFIG);
});

describe(`UU5.Bricks.Section docKit examples`, () => {
  it(`UU5.Bricks.Section should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Section id={"uuID"} header="Infrastructure" footer="Author: www.unicorn.com" level={2}>
        Robust and reliable hardware and software infrastructure, whether your own or in the cloud, is essential for the
        operation of information systems and all other application software equipment. Also of importance is the
        management of infrastructure security linked with to access of users to the company’s ICT environment and data.
        The fulfilment of the company’s business plan depends on choosing the right components for ICT infrastructure,
        deploying them quickly with optimum settings, and ensuring secure and continued operation. Unicorn has long-term
        experience with the delivery of ICT infrastructures and cloud services for the operation of information systems.
        Based on this experience, we are able to find and deliver optimum solutions both for new and existing customers.
        Our solutions have a great value to expense ratio. Because we are not dependent on any system vendor, we are
        always able to select the most suitable solution for each situation.
      </UU5.Bricks.Section>,
      { disableLifecycleMethods: true }
    );
    expect(wrapper).toMatchSnapshot();
  });
});
