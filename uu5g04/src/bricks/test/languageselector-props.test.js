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

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.ScreenSizeMixin",
    "UU5.Common.LsiMixin",
    "UU5.Common.ColorSchemaMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    headerMode: {
      values: ["all", "flag", "label", "code"]
    },
    bodyMode: {
      values: ["all", "flag", "label", "label-code"]
    },
    displayedLanguages: {
      values: ["cs", "sk", "en"]
    },
    languages: {
      values: [
        {
          en: {flag: "https://image.flaticon.com/icons/svg/197/197484.svg", language: "English"},
          de: {flag: "https://image.flaticon.com/icons/svg/s197/197571.svg", language: "Deutsch"}
        }
      ]
    },
    defaultLanguage: "en"
    ,
    size: {
      values: ["s", "m", "l", "xl"]
    },
    bgStyle: {
      values: ["filled", "outline", "transparent"]
    },
    pullRight: {
      values: [true, false]
    },
    dropup: {
      values: [true, false]
    },
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};


describe(`UU5.Bricks.LanguageSelector`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.LanguageSelector, CONFIG);
});


describe(`UU5.Bricks.LanguageSelector docKit examples`, () => {

  it(`UU5.Bricks.LanguageSelector example01`, () => {
    const wrapper = shallow(
      <UU5.Bricks.Container id={"idROOT"}>
        <UU5.Bricks.LanguageSelector id={"uuID1"} headerMode="all"/>
        <UU5.Bricks.LanguageSelector id={"uuID2"} headerMode="flag"/>
        <UU5.Bricks.LanguageSelector id={"uuID3"} headerMode="label"/>
        <UU5.Bricks.LanguageSelector id={"uuID4"} headerMode="code"/>
        <UU5.Bricks.LanguageSelector id={"uuID5"} bodyMode="all"/>
        <UU5.Bricks.LanguageSelector id={"uuID6"} bodyMode="flag"/>
        <UU5.Bricks.LanguageSelector id={"uuID7"} bodyMode="label"/>
        <UU5.Bricks.LanguageSelector id={"uuID8"} bodyMode="label-code"/>
        <UU5.Bricks.LanguageSelector id={"uuID9"} bodyMode="all" defaultLanguage={"cs"}/>
        <UU5.Bricks.LanguageSelector id={"uuID10"} bodyMode="all" displayedLanguages={["cs", "sk", "en"]}/>
        <UU5.Bricks.LanguageSelector id={"uuID11"}
                                     bodyMode="all"
                                     languages={{
                                       en: {
                                         flag: "https://image.flaticon.com/icons/svg/197/197484.svg",
                                         language: "English"
                                       },
                                       de: {
                                         flag: "httpss://image.flaticon.com/icons/svg/197/197571.svg",
                                         language: "Deutsch"
                                       }
                                     }}
        />
        <UU5.Bricks.LanguageSelector id={"uuID12"} bodyMode="all" size="s"/>
        <UU5.Bricks.LanguageSelector id={"uuID13"} bodyMode="all" size="m"/>
        <UU5.Bricks.LanguageSelector id={"uuID14"} bodyMode="all" size="l"/>
        <UU5.Bricks.LanguageSelector id={"uuID15"} bodyMode="all" size="xl"/>
        <UU5.Bricks.LanguageSelector id={"uuID16"} bodyMode="all" size="l" bgStyle="filled" colorSchema="blue"/>
        <UU5.Bricks.LanguageSelector id={"uuID17"} bodyMode="all" size="l" bgStyle="outline" colorSchema="purple"/>
        <UU5.Bricks.LanguageSelector id={"uuID18"} bodyMode="all" size="l" bgStyle="transparent" colorSchema="pink"/>
      </UU5.Bricks.Container>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('UU5.Bricks.LanguageSelector check default values', () => {
    const wrapper = shallow(
      <UU5.Bricks.LanguageSelector id={"uuID"}/>
    );
    expect(wrapper.instance().props.headerMode).toMatch(/all/);
    expect(wrapper.instance().props.bodyMode).toMatch(/all/);
    expect(wrapper.instance().props.displayedLanguages).toBeNull();
    expect(wrapper.instance().props.languages).toBeNull;
    expect(wrapper.instance().props.defaultLanguage).toBeNull();
    expect(wrapper.instance().props.size).toMatch(/m/);
    //expect(wrapper.instance().props.bgStyle).toMatch(/filled/);
    expect(wrapper.instance().props.pullRight).toBeFalsy();
    expect(wrapper.instance().props.pullRight).not.toBeUndefined();
    expect(wrapper.instance().props.pullRight).not.toBeNull();
    expect(wrapper.instance().props.dropup).toBeFalsy();
    expect(wrapper.instance().props.dropup).not.toBeUndefined();
    expect(wrapper.instance().props.dropup).not.toBeNull();
  });

});










