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

const { mount, shallow, wait } = UU5.Test.Tools;

/**
 * Props from mixes for HTML components and Link were tested in self-tests
 * Here is a check of component rendering and snapshot creation
 * Tests link component can be found in link-props.test.js, and HTML components also have their own tests props of mixin etc..
 */

describe('Bricks.Factory example docKit', () => {

  it('examples HTML5 components should render', () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID1"}>
        {/*@@viewOn:0*/}
        <UU5.Bricks.Div id={"uuID2"}> UU5.Bricks.Div - HTML5 div element</UU5.Bricks.Div>

        <UU5.Bricks.P id={"uuID3"}>UU5.Bricks.P - HTML5 odstavec</UU5.Bricks.P>

        <UU5.Bricks.Paragraph id={"uuID4"}/>
        Paragraph se chová podobně jako UU5.Bricks.P. Pokud je ale UU5.Bricks.Paragraph prázdný, vygeneruje do
        svého obsahu Lorem ipsum

        <br/>

        <UU5.Bricks.Span id={"uuID5"}>UU5.Bricks.Span - HTML5 span</UU5.Bricks.Span>

        <UU5.Bricks.Mark id={"uuID6"}>UU5.Bricks.Mark - zvýrazněný (podbarvený) text</UU5.Bricks.Mark>

        <br/>

        <UU5.Bricks.Del id={"uuID7"}>UU5.Bricks.Del - odstraněný text. Standardně se zobrazuje jako přeškrtnutý.
          Používá se např. při editaci textu více uživateli k zviditelnění změn.
        </UU5.Bricks.Del>

        <br/>

        <UU5.Bricks.U id={"uuID8"}>UU5.Bricks.U - podrtržený text </UU5.Bricks.U>

        <br/>

        <UU5.Bricks.Strong id={"uuID9"}>
          UU5.Bricks.Strong - definuje důležitý text, standardně se zobrazuje tučně (bold)
        </UU5.Bricks.Strong>

        <br/>

        <UU5.Bricks.Em id={"uuID10"}>
          UU5.Bricks.Em - definuje zvýrazněný text, standardně se zobrazuje kurzívou (italic)
        </UU5.Bricks.Em>

        <UU5.Bricks.Pre id={"uuID11"}>
          UU5.Bricks.Pre - zobrazení předformátovaného textu, zobrazuje se obvykle textem s pevnou šířkou znaku,
          zachovává mezery a konce řádků atp.
        </UU5.Bricks.Pre>

        <UU5.Bricks.Samp id={"uuID12"}>
          UU5.Bricks.Samp - označuje vzorový, zejména textový výstup z nějakého programu. Používejte např. pro
          ukázky csv souborů, výstupy z terminálů atp.
        </UU5.Bricks.Samp>
        {/*@@viewOff:0*/}
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('unicorn Links should render', () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.LinkUnicorn id={"uuID2"}/>
        <UU5.Bricks.LinkUnicornSystems id={"uuID3"}/>
        <UU5.Bricks.LinkUnicornUniverse id={"uuID4"}/>
        <UU5.Bricks.LinkUnicornCollege id={"uuID5"}/>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('uuDOCKIT Links should render', () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.LinkUAF id={"uuID1"}/>
        <UU5.Bricks.LinkUuApp id={"uuID2"}/>
        <UU5.Bricks.LinkUU5 id={"uuID3"}/>
        <UU5.Bricks.LinkUu5ComponentRegistry id={"uuID4"}/>
        <UU5.Bricks.LinkUu5CodeKit id={"uuID5"}/>
        <UU5.Bricks.LinkUuAppServer id={"uuID6"}/>
        <UU5.Bricks.LinkUuAppServer id={"uuID7"}/>
        <UU5.Bricks.LinkUuOIDC id={"uuID8"}/>
        <UU5.Bricks.LinkUuCloud id={"uuID9"}/>
        <UU5.Bricks.LinkUuDocKit id={"uuID10"}/>
        <UU5.Bricks.LinkUuBmlDraw id={"uuID11"}/>
        <UU5.Bricks.LinkUuKnowledgeBase id={"uuID12"}/>
        <UU5.Bricks.LinkUuP id={"uuID13"}/>
        <UU5.Bricks.LinkUnicornApproach id={"uuID14"}/>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('otherLinks should render', () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"uuID"}>
        <UU5.Bricks.LinkPlus4U id={"uuID1"}/>
        <UU5.Bricks.LinkBootstrap id={"uuID2"}/>
        <UU5.Bricks.LinkW3Schools id={"uuID3"}/>
        <UU5.Bricks.LinkHTML5 id={"uuID4"}/>
        <UU5.Bricks.LinkCSS id={"uuID5"}/>
        <UU5.Bricks.LinkJavaScript id={"uuID6"}/>
        <UU5.Bricks.LinkJQuery id={"uuID7"}/>
        <UU5.Bricks.LinkReact id={"uuID8"}/>
        <UU5.Bricks.LinkRuby id={"uuID9"}/>
        <UU5.Bricks.LinkPuma id={"uuID10"}/>
        <UU5.Bricks.LinkDocker id={"uuID11"}/>
        <UU5.Bricks.LinkMSAzure id={"uuID12"}/>
        <UU5.Bricks.LinkMongoDB id={"uuID13"}/>
        <UU5.Bricks.LinkMaterialDesign id={"uuID14"}/>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });

});








