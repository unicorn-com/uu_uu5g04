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

const { mount, shallow, wait } = UU5.Test.Tools;

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin"
  ],
  props: {
    data: {
      values: [
        {
          header: "Cookies Info Header",
          chapters: [
            {
              header: "Chapter header ",
              rows: ["chapter line of text", "chapter line of text"]
            }
          ]
        }
      ]
    },
    headerLevel: {
      values: [0, 1, 2, 3, 4, 5, 6]
    },
    chapterLevel: {
      values: [0, 1, 2, 3, 4, 5, 6]
    }
  },
  requiredProps: {},
  opt: {
    shallowOpt: {
      disableLifecycleMethods: false
    }
  }
};

const This = {};

describe(`UU5.Bricks.CookiesInfo`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.CookiesInfo, CONFIG);
});

describe(`UU5.Bricks.CookiesInfo docKit example`, () => {
  it(`UU5.Bricks.CookiesInfo should render without crash`, () => {
    const wrapper = shallow(
      <UU5.Bricks.CookiesInfo
        id={"uuID"}
        chapterLevel={4}
        data={{
          barText:
            "Soubory cookies nám pomáhají poskytovat, chránit a zlepšovat naše služby. Prohlížením tohoto webu s jejich použitím souhlasíte.",
          barButton: "Rozumím",
          chapters: [
            {
              rows: [
                "Cookie je krátký textový soubor, který navštívená webová stránka odešle do prohlížeče. Umožňuje webu zaznamenat informace o vaší návštěvě, například preferovaný jazyk a další nastavení. Příští návštěva stránek tak může být snazší a produktivnější. Soubory cookie jsou důležité. Bez nich by procházení webu bylo mnohem složitější.",
                "Soubory cookie slouží k celé řadě účelů. Používáme je například ke sledování počtu návštěvníků na stránce, k usnadnění registrace nových služeb, k výběru relevantních reklam, k ochraně vašich dat, aj."
              ]
            },
            {
              rows: [
                "Při zpracování těchto souborů důsledně dbáme na ochranu vašeho soukromí a vždy postupujeme v souladu s příslušnými právními předpisy a etickými standardy. Veškeré získané údaje chráníme za použití těch nejmodernějších technologií, a dalším osobám či firmám je sdělujeme pouze v nezbytně nutném rozsahu, vyjma případů, kdy nám poskytnutí osobních údajů může uložit zákon."
              ]
            },
            {
              rows: [
                "Ano, stačí, když si před návštěvou našich stránek ve svém prohlížeči spustíte funkci anonymního prohlížení. V takovém případě je ale možné, že se vám některé části našich stránek nebudou zobrazovat správně a jejich prohlížení pro vás může být složitější."
              ]
            }
          ]
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
