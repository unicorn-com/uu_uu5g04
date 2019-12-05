import * as UU5 from "uu5g04";

export const elevationMixin = extraShadow => `
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
    box-shadow: ${extraShadow || "none"};
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

export default { elevationMixin };
