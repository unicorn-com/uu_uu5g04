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

const CONFIG = {
  mixins: [
    "UU5.Common.BaseMixin",
    "UU5.Common.ElementaryMixin",
    "UU5.Common.NestingLevelMixin",
    "UU5.Common.PureRenderMixin",
    "UU5.Common.LsiMixin",
    "UU5.Common.SectionMixin",
    "UU5.Common.ContentMixin",
    "UU5.Common.LevelMixin",
  ],
  props: {
    striped: {
      values: [true, false],
    },
    bordered: {
      values: [true, false],
    },
    hover: {
      values: [true, false],
    },
    condensed: {
      values: [true, false],
    },
    headerRow: {
      values: [["Uchazeč(ka)", "Nasazení", "Přínos"]],
    },
    footerRow: {
      values: [["Monika", "Katka", "Karel"]],
    },
  },
  requiredProps: {
    rows: [["Eliška", "Vysoké", "Dostačující"]],
  },
  opt: {
    shallowOpt: {
      disableLifecycleMethods: true,
    },
  },
};

describe(`UU5.Bricks.DataTable`, () => {
  UU5.Test.Tools.testProperties(UU5.Bricks.DataTable, CONFIG);
});
