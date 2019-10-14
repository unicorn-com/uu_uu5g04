import * as UU5 from "uu5g04";

const COLOR_DATA_STANDARD = {
  borderColor: {
    standard: "700",
    focus: "900",
    active: "900"
  }
};
const COLOR_DATA_DEFAULT = {
  borderColor: {
    standard: "400",
    focus: "500",
    active: "500"
  }
};
const COLOR_DATA_RICH = COLOR_DATA_STANDARD;
const COLOR_DATA_WHITE = {
  borderColor: {
    standard: "900",
    focus: "800",
    active: "700"
  }
};
const COLOR_DATA_BLACK = {
  borderColor: {
    standard: "900",
    focus: "800",
    active: "700"
  }
};
const COLOR_DATA_GREY_RICH = {
  borderColor: {
    standard: "800",
    focus: "800",
    active: "900"
  }
};

const elevationMixin = extraShadow => `
  &.uu5-elevation--1,
  &.uu5-elevation-hover--1:hover,
  &.uu5-common-elevation--1,
  &.uu5-common-elevation-hover--1:hover {
    box-shadow: ${extraShadow}, ${UU5.Common.Tools.ELEVATIONS[-1 + ""]};
  }
  &.uu5-elevation-0,
  &.uu5-elevation-hover-0:hover,
  &.uu5-common-elevation-0,
  &.uu5-common-elevation-hover-0:hover {
    box-shadow: ${extraShadow}, ${UU5.Common.Tools.ELEVATIONS[0 + ""]};
  }
  &.uu5-elevation-1,
  &.uu5-elevation-hover-1:hover,
  &.uu5-common-elevation-1,
  &.uu5-common-elevation-hover-1:hover {
    box-shadow: ${extraShadow}, ${UU5.Common.Tools.ELEVATIONS[1 + ""]};
  }
  &.uu5-elevation-2,
  &.uu5-elevation-hover-2:hover,
  &.uu5-common-elevation-2,
  &.uu5-common-elevation-hover-2:hover {
    box-shadow: ${extraShadow}, ${UU5.Common.Tools.ELEVATIONS[2 + ""]};
  }
  &.uu5-elevation-3,
  &.uu5-elevation-hover-3:hover,
  &.uu5-common-elevation-3,
  &.uu5-common-elevation-hover-3:hover {
    box-shadow: ${extraShadow}, ${UU5.Common.Tools.ELEVATIONS[3 + ""]};
  }
  &.uu5-elevation-4,
  &.uu5-elevation-hover-4:hover,
  &.uu5-common-elevation-4,
  &.uu5-common-elevation-hover-4:hover {
    box-shadow: ${extraShadow}, ${UU5.Common.Tools.ELEVATIONS[4 + ""]};
  }
  &.uu5-elevation-5,
  &.uu5-elevation-hover-5:hover,
  &.uu5-common-elevation-5,
  &.uu5-common-elevation-hover-5:hover {
    box-shadow: ${extraShadow}, ${UU5.Common.Tools.ELEVATIONS[5 + ""]};
  }
`;

const getColors = colorSchema => {
  if (colorSchema === "default" || colorSchema === "grey" || !colorSchema) {
    return COLOR_DATA_DEFAULT;
  } else if (colorSchema === "white") {
    return COLOR_DATA_WHITE;
  } else if (colorSchema === "black") {
    return COLOR_DATA_BLACK;
  } else if (colorSchema === "grey-rich") {
    return COLOR_DATA_GREY_RICH;
  } else if (colorSchema.match(/\w+-rich/)) {
    return COLOR_DATA_RICH;
  } else {
    return COLOR_DATA_STANDARD;
  }
};

export default { getColors, elevationMixin };
