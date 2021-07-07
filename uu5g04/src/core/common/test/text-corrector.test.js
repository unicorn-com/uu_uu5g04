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

import React from "react";
import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

var text =
  "Vnitřní mezery se u závorek nedělají (ani tečka na konci věty není uvnitř, ale až za závorkou). " +
  "I když 2. pololetí bylo teplo a vlhko, cena 2 500 000 Kč zůstala. 25. 8. 2016 se Mgr. Ing. Koza Líza Ph.D. CSc. dr. h. c. spustila " +
  "po 5 km jízdy a za 5 % původní ceny byla i ráda, tj. pořádný zářez.";

var vidraContent =
  "Vidra vnitřní vidra s vidra vidra mezery se u závorek nedělají (ani tečka na konci věty není uvnitř, ale až za závorkou). " +
  "I když 2. pololetí bylo teplo a vlhko, cena 2 500 000 Kč zůstala. 25. 8. 2016 se Mgr. Ing. Koza Líza Ph.D. CSc. dr. h. c. spustila " +
  "po 5 km jízdy a za 5 % původní ceny byla i ráda, tj. pořádný zářez a vidra ne vidra, vidra.";

var vidraCorrectContent =
  "Vydra vnitřní vydra s vydra vydra mezery se u závorek nedělají (ani tečka na konci věty není uvnitř, ale až za závorkou). " +
  "I když 2. pololetí bylo teplo a vlhko, cena 2 500 000 Kč zůstala. 25. 8. 2016 se Mgr. Ing. Koza Líza Ph.D. CSc. dr. h. c. spustila " +
  "po 5 km jízdy a za 5 % původní ceny byla i ráda, tj. pořádný zářez a vydra ne vydra, vydra.";

describe("UU5.Common.ContentMixin - textCorrector test", () => {
  it("checkGrammar, checkSpaces is TRUE. Result is in the snapshot", () => {
    const wrapper = shallow(
      <UU5.Bricks.Span id={"uuID"} content={vidraContent} textCorrector={true} checkGrammar={true} />
    );
    expect(wrapper).toMatchSnapshot();

    //In variable mountedWrapper, you can see that when textCorrector is true, checkSpaces is true.
    //HTML tags can be seen as: & nbsp;
    const mountedWrapper = mount(
      <UU5.Bricks.Span id={"uuID"} content={vidraContent} textCorrector={true} checkGrammar={true} />
    );
    expect(mountedWrapper.html()).toMatchSnapshot();
  });

  /**
   * Text corrector is turned off.
   */

  it("textCorrector is FALSE", () => {
    const wrapper = shallow(
      <UU5.Bricks.Span id={"uuID"} content={vidraContent} textCorrector={false} checkGrammar={false} />
    );
    expect(wrapper).toMatchSnapshot();

    const mountedWrapper = mount(
      <UU5.Bricks.Span id={"uuID"} content={vidraContent} textCorrector={false} checkGrammar={false} />
    );
    expect(mountedWrapper.html()).toMatchSnapshot();
  });

  /**
   * The correct result of the checkHighlight test is if the cavity text that searches is enveloped in the span with the css class: uu5-common-text-corrector-highlight
   */

  it("textCorrector is true,checkHighlight should by called by ifc search()", () => {
    let searchString = "vydr";

    const shallowWrapper = shallow(
      <UU5.Bricks.Span id={"uuID"} content={vidraCorrectContent} textCorrector={true} checkHighlight={true} />
    );
    UU5.Environment.search(searchString);
    expect(shallowWrapper).toMatchSnapshot();

    //in mounted wraper is real result how to render compoennt. With checkEscapes and CheckHihglight
    const mountedWrapper = mount(
      <UU5.Bricks.Span id={"uuID"} content={vidraCorrectContent} textCorrector={true} checkHighlight={true} />
    );
    UU5.Environment.search(searchString);
    expect(mountedWrapper.html()).toMatchSnapshot();
  });
});
