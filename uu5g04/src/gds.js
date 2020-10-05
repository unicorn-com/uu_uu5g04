let jsonKeyMap = {
  color: "a",
  default: "b",
  print: "c",
  common: "d",
  highlighted: "e",
  distinct: "f",
  subdued: "g",
  width: "h",
  style: "i",
  radius: "j",
  colors: "k",
  background: "l",
  foreground: "m",
  border: "n",
  hover: "o",
  pressed: "p",
  focused: "q",
  selected: "r",
  disabled: "s",
  readOnly: "t",
  primary: "u",
  secondary: "v",
  neutral: "w",
  positive: "x",
  warning: "y",
  negative: "z",
  inset: "A",
  offsetX: "B",
  offsetY: "C",
  blurRadius: "D",
  spreadRadius: "E",
  elevation: "F",
  line: "G",
  scroll: "H",
  building: "I",
  fontSize: "J",
  fontFamily: "K",
  fontWeight: "L",
  lineHeight: "M",
  letterSpacing: "N",
  textTransform: "O",
  small: "P",
  medium: "Q",
  large: "R",
  BorderPalette: "S",
  basic: "T",
  blank: "U",
  solidThin: "V",
  solidStrong: "W",
  dashedThin: "X",
  dashedStrong: "Y",
  dottedThin: "Z",
  dottedStrong: "_",
  expressive: "$",
  BorderSwatches: "ab",
  thin: "bb",
  strong: "cb",
  solid: "db",
  dashed: "eb",
  dotted: "fb",
  ColorPalette: "gb",
  light: "hb",
  main: "ib",
  dark: "jb",
  darkest: "kb",
  lightest: "lb",
  soft: "mb",
  ColorSwatches: "nb",
  indigo: "ob",
  c50: "pb",
  c100: "qb",
  c200: "rb",
  c300: "sb",
  c400: "tb",
  c500: "ub",
  c600: "vb",
  c700: "wb",
  c800: "xb",
  c900: "yb",
  blue: "zb",
  "light-blue": "Ab",
  cyan: "Bb",
  teal: "Cb",
  green: "Db",
  "light-green": "Eb",
  lime: "Fb",
  yellow: "Gb",
  amber: "Hb",
  orange: "Ib",
  "deep-orange": "Jb",
  red: "Kb",
  pink: "Lb",
  purple: "Mb",
  "deep-purple": "Nb",
  brown: "Ob",
  grey: "Pb",
  "blue-grey": "Qb",
  white: "Rb",
  black: "Sb",
  ElevationPalette: "Tb",
  groundLayer: "Ub",
  elevated: "Vb",
  highlyElevated: "Wb",
  upperLayer: "Xb",
  Shape: "Yb",
  cell: "Zb",
  formElement: "_b",
  ground: "$b",
  input: "ac",
  interactiveElement: "bc",
  interactiveItem: "cc",
  layout: "dc",
  top: "ec",
  left: "fc",
  right: "gc",
  bottom: "hc",
  content: "ic",
  mask: "jc",
  overlay: "kc",
  Text: "lc",
  Typography: "mc",
  largeScreen: "nc",
  expose: "oc",
  hero: "pc",
  lead: "qc",
  broad: "rc",
  notice: "sc",
  interface: "tc",
  title: "uc",
  major: "vc",
  minor: "wc",
  micro: "xc",
  xsmall: "yc",
  highlight: "zc",
  interactive: "Ac",
  story: "Bc",
  heading: "Cc",
  h1: "Dc",
  h2: "Ec",
  h3: "Fc",
  h4: "Gc",
  h5: "Hc",
  body: "Ic",
  special: "Jc",
  caption: "Kc",
  code: "Lc",
  smallScreen: "Mc",
};
let invertedJsonKeyMap;
let ref__0 = "2px"; // BorderPalette.basic.blank.radius.0
let ref__1 = 1; // BorderPalette.basic.blank.radius.1
let ref__2 = "1px"; // BorderPalette.basic.solidThin.width.0
let ref__3 = "solid"; // BorderPalette.basic.solidThin.style.0
let ref__4 = [
  // BorderPalette.basic.blank.radius
  ref__0,
  ref__1,
];
let ref__5 = [
  // BorderPalette.basic.solidThin.style
  ref__3,
  ref__1,
];
let ref__6 = [
  // BorderPalette.basic.solidThin.width
  ref__2,
  ref__1,
];
let ref__7 = "dashed"; // BorderPalette.basic.dashedThin.style.0
let ref__8 = [
  // BorderPalette.basic.dashedThin.style
  ref__7,
  ref__1,
];
let ref__9 = "dotted"; // BorderPalette.basic.dottedThin.style.0
let ref__10 = [
  // BorderPalette.basic.dottedThin.style
  ref__9,
  ref__1,
];
let ref__11 = "12px"; // BorderPalette.expressive.blank.radius.0
let ref__12 = [
  // BorderPalette.expressive.blank.radius
  ref__11,
  ref__1,
];
let ref__14 = "#fff"; // ColorPalette.light.main.default.0
let ref__15 = "#F5F5F5"; // ColorPalette.light.main.dark.0
let ref__16 = "#E0E0E0"; // ColorPalette.light.main.darkest.0
let ref__17 = "#212121"; // ColorPalette.dark.main.default.0
let ref__18 = "#424242"; // ColorPalette.dark.main.light.0
let ref__19 = "#616161"; // ColorPalette.dark.main.lightest.0
let ref__20 = "#757575"; // ColorPalette.subdued.main.default.0
let ref__21 = "#9E9E9E"; // ColorPalette.subdued.main.light.0
let ref__22 = "#BDBDBD"; // ColorPalette.subdued.main.lightest.0
let ref__23 = "#2196F3"; // ColorPalette.primary.main.default.0
let ref__24 = "#1E88E5"; // ColorPalette.primary.main.dark.0
let ref__25 = "#1976D2"; // ColorPalette.primary.main.darkest.0
let ref__26 = "#42A5F5"; // ColorPalette.primary.main.light.0
let ref__27 = "#64B5F6"; // ColorPalette.primary.main.lightest.0
let ref__28 = "#E3F2FD"; // ColorPalette.primary.soft.default.0
let ref__29 = "#BBDEFB"; // ColorPalette.primary.soft.dark.0
let ref__30 = "#90CAF9"; // ColorPalette.primary.soft.darkest.0
let ref__31 = "#00BCD4"; // ColorPalette.secondary.main.default.0
let ref__32 = "#00ACC1"; // ColorPalette.secondary.main.dark.0
let ref__33 = "#0097A7"; // ColorPalette.secondary.main.darkest.0
let ref__34 = "#26C6DA"; // ColorPalette.secondary.main.light.0
let ref__35 = "#4DD0E1"; // ColorPalette.secondary.main.lightest.0
let ref__36 = "#E0F7FA"; // ColorPalette.secondary.soft.default.0
let ref__37 = "#B2EBF2"; // ColorPalette.secondary.soft.dark.0
let ref__38 = "#80DEEA"; // ColorPalette.secondary.soft.darkest.0
let ref__39 = [
  // ColorPalette.subdued.main.light
  ref__21,
  ref__1,
];
let ref__40 = [
  // ColorPalette.subdued.main.default
  ref__20,
  ref__1,
];
let ref__41 = [
  // ColorPalette.dark.main.lightest
  ref__19,
  ref__1,
];
let ref__42 = [
  // ColorPalette.subdued.main.lightest
  ref__22,
  ref__1,
];
let ref__43 = [
  // ColorPalette.light.main.darkest
  ref__16,
  ref__1,
];
let ref__44 = "#FAFAFA"; // ColorPalette.neutral.soft.default.0
let ref__45 = [
  // ColorPalette.light.main.dark
  ref__15,
  ref__1,
];
let ref__46 = "#EEEEEE"; // ColorPalette.neutral.soft.darkest.0
let ref__47 = "#4CAF50"; // ColorPalette.positive.main.default.0
let ref__48 = "#43A047"; // ColorPalette.positive.main.dark.0
let ref__49 = "#388E3C"; // ColorPalette.positive.main.darkest.0
let ref__50 = "#66BB6A"; // ColorPalette.positive.main.light.0
let ref__51 = "#81C784"; // ColorPalette.positive.main.lightest.0
let ref__52 = "#E8F5E9"; // ColorPalette.positive.soft.default.0
let ref__53 = "#C8E6C9"; // ColorPalette.positive.soft.dark.0
let ref__54 = "#A5D6A7"; // ColorPalette.positive.soft.darkest.0
let ref__55 = "#FF9800"; // ColorPalette.warning.main.default.0
let ref__56 = "#FB8C00"; // ColorPalette.warning.main.dark.0
let ref__57 = "#F57C00"; // ColorPalette.warning.main.darkest.0
let ref__58 = "#FFA726"; // ColorPalette.warning.main.light.0
let ref__59 = "#FFB74D"; // ColorPalette.warning.main.lightest.0
let ref__60 = "#FFF3E0"; // ColorPalette.warning.soft.default.0
let ref__61 = "#FFE0B2"; // ColorPalette.warning.soft.dark.0
let ref__62 = "#FFCC80"; // ColorPalette.warning.soft.darkest.0
let ref__63 = "#F44336"; // ColorPalette.negative.main.default.0
let ref__64 = "#E53935"; // ColorPalette.negative.main.dark.0
let ref__65 = "#D32F2F"; // ColorPalette.negative.main.darkest.0
let ref__66 = "#EF5350"; // ColorPalette.negative.main.light.0
let ref__67 = "#E57373"; // ColorPalette.negative.main.lightest.0
let ref__68 = "#FFEBEE"; // ColorPalette.negative.soft.default.0
let ref__69 = "#FFCDD2"; // ColorPalette.negative.soft.dark.0
let ref__70 = "#EF9A9A"; // ColorPalette.negative.soft.darkest.0
let ref__213 = false; // ElevationPalette.groundLayer.elevated.inset
let ref__214 = 0; // ElevationPalette.groundLayer.elevated.offsetX
let ref__215 = 4; // ElevationPalette.groundLayer.elevated.blurRadius
let ref__216 = 0.4; // ElevationPalette.groundLayer.highlyElevated.color.1
let ref__217 = 2; // ElevationPalette.groundLayer.highlyElevated.offsetY
let ref__219 = [
  // ElevationPalette.groundLayer.highlyElevated.color
  ref__17,
  ref__216,
];
let ref__221 = 14; // ElevationPalette.upperLayer.highlyElevated.blurRadius
let ref__222 = [
  // ColorPalette.light.main.default
  ref__14,
  ref__1,
];
let ref__223 = {
  // Shape.background.line.light.building.common.default
  a: ref__222,
};
let ref__224 = [
  // ColorPalette.dark.main.default
  ref__17,
  ref__1,
];
let ref__225 = {
  // Shape.background.line.light.building.highlighted.default
  a: ref__224,
};
let ref__226 = 0.08; // Shape.background.line.light.building.distinct.default.color.1
let ref__227 = {
  // Shape.background.line.light.building.distinct.default
  a: [ref__17, ref__226],
};
let ref__228 = [
  // ColorPalette.primary.soft.default
  ref__28,
  ref__1,
];
let ref__229 = {
  // Shape.background.line.light.primary.common.default
  a: ref__228,
};
let ref__230 = [
  // ColorPalette.primary.main.default
  ref__23,
  ref__1,
];
let ref__231 = {
  // Shape.background.line.light.primary.highlighted.default
  a: ref__230,
};
let ref__232 = {}; // Shape.background.line.light.building.subdued
let ref__233 = [
  // ColorPalette.secondary.soft.default
  ref__36,
  ref__1,
];
let ref__234 = {
  // Shape.background.line.light.secondary.common.default
  a: ref__233,
};
let ref__235 = [
  // ColorPalette.secondary.main.default
  ref__31,
  ref__1,
];
let ref__236 = {
  // Shape.background.line.light.secondary.highlighted.default
  a: ref__235,
};
let ref__237 = [
  // ColorPalette.neutral.soft.default
  ref__44,
  ref__1,
];
let ref__238 = {
  // Shape.background.line.light.neutral.common.default
  a: ref__237,
};
let ref__239 = {
  // Shape.background.line.light.neutral.highlighted.default
  a: ref__39,
};
let ref__240 = [
  // ColorPalette.positive.soft.default
  ref__52,
  ref__1,
];
let ref__241 = {
  // Shape.background.line.light.positive.common.default
  a: ref__240,
};
let ref__242 = [
  // ColorPalette.positive.main.default
  ref__47,
  ref__1,
];
let ref__243 = {
  // Shape.background.line.light.positive.highlighted.default
  a: ref__242,
};
let ref__244 = [
  // ColorPalette.warning.soft.default
  ref__60,
  ref__1,
];
let ref__245 = {
  // Shape.background.line.light.warning.common.default
  a: ref__244,
};
let ref__246 = [
  // ColorPalette.warning.main.default
  ref__55,
  ref__1,
];
let ref__247 = {
  // Shape.background.line.light.warning.highlighted.default
  a: ref__246,
};
let ref__248 = [
  // ColorPalette.negative.soft.default
  ref__68,
  ref__1,
];
let ref__249 = {
  // Shape.background.line.light.negative.common.default
  a: ref__248,
};
let ref__250 = [
  // ColorPalette.negative.main.default
  ref__63,
  ref__1,
];
let ref__251 = {
  // Shape.background.line.light.negative.highlighted.default
  a: ref__250,
};
let ref__252 = {
  // Shape.background.line.light.building.highlighted
  b: ref__225,
  c: ref__225,
};
let ref__253 = {
  // Shape.background.line.light.building.common
  b: ref__223,
  c: ref__223,
};
let ref__255 = {
  // Shape.background.line.dark.building.distinct.default
  a: [ref__14, 0.14],
};
let ref__256 = [
  // ColorPalette.primary.soft.dark
  ref__29,
  ref__1,
];
let ref__257 = {
  // Shape.background.line.primary.common.default
  a: ref__256,
};
let ref__258 = [
  // ColorPalette.primary.main.light
  ref__26,
  ref__1,
];
let ref__259 = {
  // Shape.background.line.primary.highlighted.default
  a: ref__258,
};
let ref__260 = [
  // ColorPalette.secondary.soft.dark
  ref__37,
  ref__1,
];
let ref__261 = {
  // Shape.background.line.secondary.common.default
  a: ref__260,
};
let ref__262 = [
  // ColorPalette.secondary.main.light
  ref__34,
  ref__1,
];
let ref__263 = {
  // Shape.background.line.secondary.highlighted.default
  a: ref__262,
};
let ref__264 = {
  // Shape.background.line.neutral.common.default
  a: ref__45,
};
let ref__265 = {
  // Shape.background.line.neutral.highlighted.default
  a: ref__42,
};
let ref__266 = [
  // ColorPalette.positive.soft.dark
  ref__53,
  ref__1,
];
let ref__267 = {
  // Shape.background.line.positive.common.default
  a: ref__266,
};
let ref__268 = [
  // ColorPalette.positive.main.light
  ref__50,
  ref__1,
];
let ref__269 = {
  // Shape.background.line.positive.highlighted.default
  a: ref__268,
};
let ref__270 = [
  // ColorPalette.warning.soft.dark
  ref__61,
  ref__1,
];
let ref__271 = {
  // Shape.background.line.warning.common.default
  a: ref__270,
};
let ref__272 = [
  // ColorPalette.warning.main.light
  ref__58,
  ref__1,
];
let ref__273 = {
  // Shape.background.line.warning.highlighted.default
  a: ref__272,
};
let ref__274 = [
  // ColorPalette.negative.soft.dark
  ref__69,
  ref__1,
];
let ref__275 = {
  // Shape.background.line.negative.common.default
  a: ref__274,
};
let ref__276 = [
  // ColorPalette.negative.main.light
  ref__66,
  ref__1,
];
let ref__277 = {
  // Shape.background.line.negative.highlighted.default
  a: ref__276,
};
let ref__284 = {
  // Shape.background.line.primary.common
  b: ref__257,
  c: ref__257,
};
let ref__1187 = {
  // Shape.background.line.primary.highlighted
  b: ref__259,
  c: ref__259,
};
let ref__278 = {
  // Shape.background.line.primary
  d: ref__284,
  e: ref__1187,
  f: ref__232,
  g: ref__232,
};
let ref__285 = {
  // Shape.background.line.secondary.common
  b: ref__261,
  c: ref__261,
};
let ref__279 = {
  // Shape.background.line.secondary
  d: ref__285,
  e: {
    b: ref__263,
    c: ref__263,
  },
  f: ref__232,
  g: ref__232,
};
let ref__286 = {
  // Shape.background.line.neutral.common
  b: ref__264,
  c: ref__264,
};
let ref__280 = {
  // Shape.background.line.neutral
  d: ref__286,
  e: {
    b: ref__265,
    c: ref__265,
  },
  f: ref__232,
  g: ref__232,
};
let ref__287 = {
  // Shape.background.line.positive.common
  b: ref__267,
  c: ref__267,
};
let ref__281 = {
  // Shape.background.line.positive
  d: ref__287,
  e: {
    b: ref__269,
    c: ref__269,
  },
  f: ref__232,
  g: ref__232,
};
let ref__288 = {
  // Shape.background.line.warning.common
  b: ref__271,
  c: ref__271,
};
let ref__282 = {
  // Shape.background.line.warning
  d: ref__288,
  e: {
    b: ref__273,
    c: ref__273,
  },
  f: ref__232,
  g: ref__232,
};
let ref__289 = {
  // Shape.background.line.negative.common
  b: ref__275,
  c: ref__275,
};
let ref__283 = {
  // Shape.background.line.negative
  d: ref__289,
  e: {
    b: ref__277,
    c: ref__277,
  },
  f: ref__232,
  g: ref__232,
};
let ref__290 = {
  // Shape.background.line.light.primary.highlighted
  b: ref__231,
  c: ref__231,
};
let ref__291 = {
  // Shape.background.line.light.secondary.highlighted
  b: ref__236,
  c: ref__236,
};
let ref__292 = {
  // Shape.background.line.light.neutral.highlighted
  b: ref__239,
  c: ref__239,
};
let ref__293 = {
  // Shape.background.line.light.positive.highlighted
  b: ref__243,
  c: ref__243,
};
let ref__294 = {
  // Shape.background.line.light.warning.highlighted
  b: ref__247,
  c: ref__247,
};
let ref__295 = {
  // Shape.background.line.light.negative.highlighted
  b: ref__251,
  c: ref__251,
};
let ref__296 = {
  // BorderPalette.basic.solidThin
  h: ref__6,
  i: ref__5,
  j: ref__4,
};
let ref__297 = [
  // Shape.cell.light.building.common.default.colors.foreground
  ref__225,
  ref__1,
];
let ref__298 = [
  // Shape.cell.light.building.common.default.border
  ref__296,
  ref__1,
];
let ref__299 = {
  // BorderPalette.basic.solidStrong
  h: ref__4,
  i: ref__5,
  j: ref__4,
};
let ref__303 = [
  // Shape.cell.light.building.common.pressed.border
  ref__299,
  ref__1,
];
let ref__300 = {
  // Shape.cell.light.building.common.pressed
  k: {
    l: ref__222,
    m: ref__297,
    n: ref__40,
  },
  n: ref__303,
};
let ref__305 = [
  // Shape.cell.light.building.common.disabled.colors.foreground
  ref__225,
  ref__216,
];
let ref__301 = {
  // Shape.cell.light.building.common.disabled
  k: {
    l: ref__222,
    m: ref__305,
    n: ref__43,
  },
  n: ref__298,
};
let ref__302 = {
  // Shape.cell.light.building.common.default
  k: {
    l: ref__222,
    m: ref__297,
    n: ref__43,
  },
  n: ref__298,
};
let ref__304 = {
  // Shape.cell.light.building.highlighted.pressed
  k: {
    l: ref__43,
    m: ref__297,
    n: ref__40,
  },
  n: ref__303,
};
let ref__306 = {
  // Shape.cell.light.building.highlighted.disabled
  k: {
    l: ref__43,
    m: ref__305,
    n: ref__43,
  },
  n: ref__298,
};
let ref__307 = {
  // Shape.cell.light.building.highlighted.default
  k: {
    l: ref__43,
    m: ref__297,
    n: ref__43,
  },
  n: ref__298,
};
let ref__308 = {
  // Shape.cell.light.building.common.hover
  k: {
    l: ref__45,
    m: ref__297,
    n: ref__43,
  },
  n: ref__298,
};
let ref__309 = {
  // Shape.cell.light.building.distinct.pressed
  k: {
    l: ref__45,
    m: ref__297,
    n: ref__40,
  },
  n: ref__303,
};
let ref__310 = {
  // Shape.cell.light.building.distinct.disabled
  k: {
    l: ref__45,
    m: ref__305,
    n: ref__43,
  },
  n: ref__298,
};
let ref__311 = [
  // ColorPalette.primary.main.dark
  ref__24,
  ref__1,
];
let ref__312 = {
  // Shape.cell.light.primary.common.pressed
  k: {
    l: ref__222,
    m: ref__297,
    n: ref__311,
  },
  n: ref__303,
};
let ref__313 = [
  // ColorPalette.primary.soft.darkest
  ref__30,
  ref__1,
];
let ref__314 = {
  // Shape.cell.light.primary.highlighted.pressed
  k: {
    l: ref__256,
    m: ref__297,
    n: ref__311,
  },
  n: ref__303,
};
let ref__315 = {
  // Shape.cell.light.primary.highlighted.disabled
  k: {
    l: ref__256,
    m: ref__305,
    n: ref__43,
  },
  n: ref__298,
};
let ref__316 = {
  // Shape.cell.light.primary.highlighted.default
  k: {
    l: ref__256,
    m: ref__297,
    n: ref__43,
  },
  n: ref__298,
};
let ref__317 = {
  // Shape.cell.light.primary.common.hover
  k: {
    l: ref__228,
    m: ref__297,
    n: ref__43,
  },
  n: ref__298,
};
let ref__902 = {
  // Shape.cell.light.primary.distinct.pressed.colors
  l: ref__228,
  m: ref__297,
  n: ref__311,
};
let ref__318 = {
  // Shape.cell.light.primary.distinct.pressed
  k: ref__902,
  n: ref__303,
};
let ref__319 = {
  // Shape.cell.light.primary.distinct.disabled
  k: {
    l: ref__228,
    m: ref__305,
    n: ref__43,
  },
  n: ref__298,
};
let ref__320 = [
  // ColorPalette.secondary.main.dark
  ref__32,
  ref__1,
];
let ref__321 = {
  // Shape.cell.light.secondary.common.pressed
  k: {
    l: ref__222,
    m: ref__297,
    n: ref__320,
  },
  n: ref__303,
};
let ref__322 = [
  // ColorPalette.secondary.soft.darkest
  ref__38,
  ref__1,
];
let ref__323 = {
  // Shape.cell.light.secondary.highlighted.pressed
  k: {
    l: ref__260,
    m: ref__297,
    n: ref__320,
  },
  n: ref__303,
};
let ref__324 = {
  // Shape.cell.light.secondary.highlighted.disabled
  k: {
    l: ref__260,
    m: ref__305,
    n: ref__43,
  },
  n: ref__298,
};
let ref__325 = {
  // Shape.cell.light.secondary.highlighted.default
  k: {
    l: ref__260,
    m: ref__297,
    n: ref__43,
  },
  n: ref__298,
};
let ref__326 = {
  // Shape.cell.light.secondary.common.hover
  k: {
    l: ref__233,
    m: ref__297,
    n: ref__43,
  },
  n: ref__298,
};
let ref__911 = {
  // Shape.cell.light.secondary.distinct.pressed.colors
  l: ref__233,
  m: ref__297,
  n: ref__320,
};
let ref__327 = {
  // Shape.cell.light.secondary.distinct.pressed
  k: ref__911,
  n: ref__303,
};
let ref__328 = {
  // Shape.cell.light.secondary.distinct.disabled
  k: {
    l: ref__233,
    m: ref__305,
    n: ref__43,
  },
  n: ref__298,
};
let ref__1373 = {
  // Shape.cell.light.neutral.common.hover.colors.foreground.0
  a: ref__41,
};
let ref__329 = [
  // Shape.cell.light.neutral.common.hover.colors.foreground
  ref__1373,
  ref__1,
];
let ref__330 = {
  // Shape.cell.light.neutral.common.pressed
  k: {
    l: ref__237,
    m: ref__329,
    n: ref__40,
  },
  n: ref__303,
};
let ref__331 = {
  // Shape.cell.light.neutral.common.default.colors.foreground.0
  a: ref__40,
};
let ref__337 = [
  // Shape.cell.light.neutral.common.disabled.colors.foreground
  ref__331,
  ref__216,
];
let ref__332 = {
  // Shape.cell.light.neutral.common.disabled
  k: {
    l: ref__237,
    m: ref__337,
    n: ref__43,
  },
  n: ref__298,
};
let ref__335 = [
  // Shape.cell.light.neutral.common.default.colors.foreground
  ref__331,
  ref__1,
];
let ref__333 = {
  // Shape.cell.light.neutral.common.default
  k: {
    l: ref__237,
    m: ref__335,
    n: ref__43,
  },
  n: ref__298,
};
let ref__334 = [
  // ColorPalette.neutral.soft.darkest
  ref__46,
  ref__1,
];
let ref__336 = {
  // Shape.cell.light.neutral.highlighted.pressed
  k: {
    l: ref__334,
    m: ref__329,
    n: ref__40,
  },
  n: ref__303,
};
let ref__338 = {
  // Shape.cell.light.neutral.highlighted.disabled
  k: {
    l: ref__334,
    m: ref__337,
    n: ref__43,
  },
  n: ref__298,
};
let ref__339 = {
  // Shape.cell.light.neutral.highlighted.default
  k: {
    l: ref__334,
    m: ref__335,
    n: ref__43,
  },
  n: ref__298,
};
let ref__340 = {
  // Shape.cell.light.neutral.distinct.pressed
  k: {
    l: ref__45,
    m: ref__329,
    n: ref__40,
  },
  n: ref__303,
};
let ref__341 = {
  // Shape.cell.light.neutral.distinct.disabled
  k: {
    l: ref__45,
    m: ref__337,
    n: ref__43,
  },
  n: ref__298,
};
let ref__342 = {
  // Shape.cell.light.neutral.distinct.default
  k: {
    l: ref__45,
    m: ref__335,
    n: ref__43,
  },
  n: ref__298,
};
let ref__343 = [
  // ColorPalette.positive.main.dark
  ref__48,
  ref__1,
];
let ref__344 = [
  // ColorPalette.positive.main.darkest
  ref__49,
  ref__1,
];
let ref__1375 = {
  // Shape.cell.light.positive.common.hover.colors.foreground.0
  a: ref__344,
};
let ref__345 = [
  // Shape.cell.light.positive.common.hover.colors.foreground
  ref__1375,
  ref__1,
];
let ref__346 = {
  // Shape.cell.light.positive.common.pressed
  k: {
    l: ref__240,
    m: ref__345,
    n: ref__343,
  },
  n: ref__303,
};
let ref__347 = {
  // Shape.cell.light.positive.common.default.colors.foreground.0
  a: ref__343,
};
let ref__354 = [
  // Shape.cell.light.positive.common.disabled.colors.foreground
  ref__347,
  ref__216,
];
let ref__348 = {
  // Shape.cell.light.positive.common.disabled
  k: {
    l: ref__240,
    m: ref__354,
    n: ref__43,
  },
  n: ref__298,
};
let ref__351 = [
  // Shape.cell.light.positive.common.default.colors.foreground
  ref__347,
  ref__1,
];
let ref__349 = {
  // Shape.cell.light.positive.common.default
  k: {
    l: ref__240,
    m: ref__351,
    n: ref__43,
  },
  n: ref__298,
};
let ref__350 = [
  // ColorPalette.positive.soft.darkest
  ref__54,
  ref__1,
];
let ref__352 = [
  // ColorPalette.positive.main.lightest
  ref__51,
  ref__1,
];
let ref__353 = {
  // Shape.cell.light.positive.highlighted.pressed
  k: {
    l: ref__350,
    m: ref__345,
    n: ref__343,
  },
  n: ref__303,
};
let ref__355 = {
  // Shape.cell.light.positive.highlighted.disabled
  k: {
    l: ref__350,
    m: ref__354,
    n: ref__43,
  },
  n: ref__298,
};
let ref__356 = {
  // Shape.cell.light.positive.highlighted.default
  k: {
    l: ref__350,
    m: ref__351,
    n: ref__43,
  },
  n: ref__298,
};
let ref__357 = {
  // Shape.cell.light.positive.distinct.pressed
  k: {
    l: ref__266,
    m: ref__345,
    n: ref__343,
  },
  n: ref__303,
};
let ref__358 = {
  // Shape.cell.light.positive.distinct.disabled
  k: {
    l: ref__266,
    m: ref__354,
    n: ref__43,
  },
  n: ref__298,
};
let ref__359 = {
  // Shape.cell.light.positive.distinct.default
  k: {
    l: ref__266,
    m: ref__351,
    n: ref__43,
  },
  n: ref__298,
};
let ref__360 = [
  // ColorPalette.warning.main.dark
  ref__56,
  ref__1,
];
let ref__361 = [
  // ColorPalette.warning.main.darkest
  ref__57,
  ref__1,
];
let ref__1377 = {
  // Shape.cell.light.warning.common.hover.colors.foreground.0
  a: ref__361,
};
let ref__362 = [
  // Shape.cell.light.warning.common.hover.colors.foreground
  ref__1377,
  ref__1,
];
let ref__363 = {
  // Shape.cell.light.warning.common.pressed
  k: {
    l: ref__244,
    m: ref__362,
    n: ref__360,
  },
  n: ref__303,
};
let ref__364 = {
  // Shape.cell.light.warning.common.default.colors.foreground.0
  a: ref__360,
};
let ref__371 = [
  // Shape.cell.light.warning.common.disabled.colors.foreground
  ref__364,
  ref__216,
];
let ref__365 = {
  // Shape.cell.light.warning.common.disabled
  k: {
    l: ref__244,
    m: ref__371,
    n: ref__43,
  },
  n: ref__298,
};
let ref__368 = [
  // Shape.cell.light.warning.common.default.colors.foreground
  ref__364,
  ref__1,
];
let ref__366 = {
  // Shape.cell.light.warning.common.default
  k: {
    l: ref__244,
    m: ref__368,
    n: ref__43,
  },
  n: ref__298,
};
let ref__367 = [
  // ColorPalette.warning.soft.darkest
  ref__62,
  ref__1,
];
let ref__369 = [
  // ColorPalette.warning.main.lightest
  ref__59,
  ref__1,
];
let ref__370 = {
  // Shape.cell.light.warning.highlighted.pressed
  k: {
    l: ref__367,
    m: ref__362,
    n: ref__360,
  },
  n: ref__303,
};
let ref__372 = {
  // Shape.cell.light.warning.highlighted.disabled
  k: {
    l: ref__367,
    m: ref__371,
    n: ref__43,
  },
  n: ref__298,
};
let ref__373 = {
  // Shape.cell.light.warning.highlighted.default
  k: {
    l: ref__367,
    m: ref__368,
    n: ref__43,
  },
  n: ref__298,
};
let ref__374 = {
  // Shape.cell.light.warning.distinct.pressed
  k: {
    l: ref__270,
    m: ref__362,
    n: ref__360,
  },
  n: ref__303,
};
let ref__375 = {
  // Shape.cell.light.warning.distinct.disabled
  k: {
    l: ref__270,
    m: ref__371,
    n: ref__43,
  },
  n: ref__298,
};
let ref__376 = {
  // Shape.cell.light.warning.distinct.default
  k: {
    l: ref__270,
    m: ref__368,
    n: ref__43,
  },
  n: ref__298,
};
let ref__377 = [
  // ColorPalette.negative.main.dark
  ref__64,
  ref__1,
];
let ref__378 = [
  // ColorPalette.negative.main.darkest
  ref__65,
  ref__1,
];
let ref__1379 = {
  // Shape.cell.light.negative.common.hover.colors.foreground.0
  a: ref__378,
};
let ref__379 = [
  // Shape.cell.light.negative.common.hover.colors.foreground
  ref__1379,
  ref__1,
];
let ref__380 = {
  // Shape.cell.light.negative.common.pressed
  k: {
    l: ref__248,
    m: ref__379,
    n: ref__377,
  },
  n: ref__303,
};
let ref__381 = {
  // Shape.cell.light.negative.common.default.colors.foreground.0
  a: ref__377,
};
let ref__388 = [
  // Shape.cell.light.negative.common.disabled.colors.foreground
  ref__381,
  ref__216,
];
let ref__382 = {
  // Shape.cell.light.negative.common.disabled
  k: {
    l: ref__248,
    m: ref__388,
    n: ref__43,
  },
  n: ref__298,
};
let ref__385 = [
  // Shape.cell.light.negative.common.default.colors.foreground
  ref__381,
  ref__1,
];
let ref__383 = {
  // Shape.cell.light.negative.common.default
  k: {
    l: ref__248,
    m: ref__385,
    n: ref__43,
  },
  n: ref__298,
};
let ref__384 = [
  // ColorPalette.negative.soft.darkest
  ref__70,
  ref__1,
];
let ref__386 = [
  // ColorPalette.negative.main.lightest
  ref__67,
  ref__1,
];
let ref__387 = {
  // Shape.cell.light.negative.highlighted.pressed
  k: {
    l: ref__384,
    m: ref__379,
    n: ref__377,
  },
  n: ref__303,
};
let ref__389 = {
  // Shape.cell.light.negative.highlighted.disabled
  k: {
    l: ref__384,
    m: ref__388,
    n: ref__43,
  },
  n: ref__298,
};
let ref__390 = {
  // Shape.cell.light.negative.highlighted.default
  k: {
    l: ref__384,
    m: ref__385,
    n: ref__43,
  },
  n: ref__298,
};
let ref__391 = {
  // Shape.cell.light.negative.distinct.pressed
  k: {
    l: ref__274,
    m: ref__379,
    n: ref__377,
  },
  n: ref__303,
};
let ref__392 = {
  // Shape.cell.light.negative.distinct.disabled
  k: {
    l: ref__274,
    m: ref__388,
    n: ref__43,
  },
  n: ref__298,
};
let ref__393 = {
  // Shape.cell.light.negative.distinct.default
  k: {
    l: ref__274,
    m: ref__385,
    n: ref__43,
  },
  n: ref__298,
};
let ref__395 = 0.16; // Shape.cell.dark.building.common.hover.colors.background.1
let ref__396 = [
  // Shape.cell.dark.building.common.default.colors.foreground
  ref__223,
  ref__1,
];
let ref__397 = [
  // Shape.cell.dark.building.common.default.colors.border
  ref__14,
  0.3,
];
let ref__398 = [
  // Shape.cell.dark.building.common.default.colors.background
  ref__14,
  ref__214,
];
let ref__399 = {
  // Shape.cell.dark.building.common.pressed
  k: {
    l: ref__398,
    m: ref__396,
    n: ref__222,
  },
  n: ref__303,
};
let ref__404 = [
  // Shape.cell.dark.building.common.disabled.colors.foreground
  ref__223,
  ref__216,
];
let ref__400 = {
  // Shape.cell.dark.building.common.disabled
  k: {
    l: ref__398,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__401 = {
  // Shape.cell.dark.building.common.default
  k: {
    l: ref__398,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__402 = 0.6; // Shape.cell.dark.building.highlighted.hover.colors.background.1
let ref__403 = {
  // Shape.cell.dark.building.highlighted.pressed
  k: {
    l: ref__397,
    m: ref__396,
    n: ref__222,
  },
  n: ref__303,
};
let ref__405 = {
  // Shape.cell.dark.building.highlighted.disabled
  k: {
    l: ref__397,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__406 = {
  // Shape.cell.dark.building.highlighted.default
  k: {
    l: ref__397,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__408 = [
  // Shape.cell.dark.building.common.hover.colors.background
  ref__14,
  ref__395,
];
let ref__407 = {
  // Shape.cell.dark.building.common.hover
  k: {
    l: ref__408,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__409 = {
  // Shape.cell.dark.building.distinct.pressed
  k: {
    l: ref__408,
    m: ref__396,
    n: ref__222,
  },
  n: ref__303,
};
let ref__410 = {
  // Shape.cell.dark.building.distinct.disabled
  k: {
    l: ref__408,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__411 = [
  // Shape.cell.dark.primary.common.default.colors.background
  ref__26,
  ref__214,
];
let ref__412 = {
  // Shape.cell.dark.primary.common.pressed
  k: {
    l: ref__411,
    m: ref__396,
    n: ref__258,
  },
  n: ref__303,
};
let ref__413 = {
  // Shape.cell.dark.primary.common.disabled
  k: {
    l: ref__411,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__414 = {
  // Shape.cell.dark.primary.common.default
  k: {
    l: ref__411,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__415 = 0.24; // Shape.cell.dark.primary.highlighted.default.colors.background.1
let ref__416 = 0.48; // Shape.cell.dark.primary.highlighted.hover.colors.background.1
let ref__417 = [
  // Shape.cell.dark.primary.highlighted.default.colors.background
  ref__26,
  ref__415,
];
let ref__940 = {
  // Shape.cell.dark.primary.highlighted.pressed.colors
  l: ref__417,
  m: ref__396,
  n: ref__258,
};
let ref__418 = {
  // Shape.cell.dark.primary.highlighted.pressed
  k: ref__940,
  n: ref__303,
};
let ref__419 = {
  // Shape.cell.dark.primary.highlighted.disabled
  k: {
    l: ref__417,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__420 = {
  // Shape.cell.dark.primary.highlighted.default
  k: {
    l: ref__417,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__422 = [
  // Shape.cell.dark.primary.common.hover.colors.background
  ref__26,
  ref__395,
];
let ref__421 = {
  // Shape.cell.dark.primary.common.hover
  k: {
    l: ref__422,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__423 = {
  // Shape.cell.dark.primary.distinct.pressed
  k: {
    l: ref__422,
    m: ref__396,
    n: ref__258,
  },
  n: ref__303,
};
let ref__424 = {
  // Shape.cell.dark.primary.distinct.disabled
  k: {
    l: ref__422,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__425 = [
  // Shape.cell.dark.secondary.common.default.colors.background
  ref__34,
  ref__214,
];
let ref__426 = {
  // Shape.cell.dark.secondary.common.pressed
  k: {
    l: ref__425,
    m: ref__396,
    n: ref__262,
  },
  n: ref__303,
};
let ref__427 = {
  // Shape.cell.dark.secondary.common.disabled
  k: {
    l: ref__425,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__428 = {
  // Shape.cell.dark.secondary.common.default
  k: {
    l: ref__425,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__429 = [
  // Shape.cell.dark.secondary.highlighted.default.colors.background
  ref__34,
  ref__415,
];
let ref__947 = {
  // Shape.cell.dark.secondary.highlighted.pressed.colors
  l: ref__429,
  m: ref__396,
  n: ref__262,
};
let ref__430 = {
  // Shape.cell.dark.secondary.highlighted.pressed
  k: ref__947,
  n: ref__303,
};
let ref__431 = {
  // Shape.cell.dark.secondary.highlighted.disabled
  k: {
    l: ref__429,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__432 = {
  // Shape.cell.dark.secondary.highlighted.default
  k: {
    l: ref__429,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__434 = [
  // Shape.cell.dark.secondary.common.hover.colors.background
  ref__34,
  ref__395,
];
let ref__433 = {
  // Shape.cell.dark.secondary.common.hover
  k: {
    l: ref__434,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__435 = {
  // Shape.cell.dark.secondary.distinct.pressed
  k: {
    l: ref__434,
    m: ref__396,
    n: ref__262,
  },
  n: ref__303,
};
let ref__436 = {
  // Shape.cell.dark.secondary.distinct.disabled
  k: {
    l: ref__434,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__437 = [
  // Shape.cell.dark.neutral.common.default.colors.background
  ref__22,
  ref__395,
];
let ref__438 = {
  // Shape.cell.dark.neutral.common.pressed
  k: {
    l: ref__437,
    m: ref__396,
    n: ref__42,
  },
  n: ref__303,
};
let ref__439 = {
  // Shape.cell.dark.neutral.common.disabled
  k: {
    l: ref__437,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__440 = {
  // Shape.cell.dark.neutral.common.default
  k: {
    l: ref__437,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__441 = 0.64; // Shape.cell.dark.neutral.highlighted.hover.colors.background.1
let ref__442 = [
  // Shape.cell.dark.neutral.highlighted.default.colors.background
  ref__22,
  ref__416,
];
let ref__443 = {
  // Shape.cell.dark.neutral.highlighted.pressed
  k: {
    l: ref__442,
    m: ref__396,
    n: ref__42,
  },
  n: ref__303,
};
let ref__444 = {
  // Shape.cell.dark.neutral.highlighted.disabled
  k: {
    l: ref__442,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__445 = {
  // Shape.cell.dark.neutral.highlighted.default
  k: {
    l: ref__442,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__447 = [
  // Shape.cell.dark.neutral.common.hover.colors.background
  ref__22,
  ref__415,
];
let ref__446 = {
  // Shape.cell.dark.neutral.common.hover
  k: {
    l: ref__447,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__952 = {
  // Shape.cell.dark.neutral.distinct.pressed.colors
  l: ref__447,
  m: ref__396,
  n: ref__42,
};
let ref__448 = {
  // Shape.cell.dark.neutral.distinct.pressed
  k: ref__952,
  n: ref__303,
};
let ref__449 = {
  // Shape.cell.dark.neutral.distinct.disabled
  k: {
    l: ref__447,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__450 = [
  // Shape.cell.dark.positive.common.default.colors.background
  ref__50,
  ref__395,
];
let ref__451 = {
  // Shape.cell.dark.positive.common.pressed
  k: {
    l: ref__450,
    m: ref__396,
    n: ref__268,
  },
  n: ref__303,
};
let ref__452 = {
  // Shape.cell.dark.positive.common.disabled
  k: {
    l: ref__450,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__453 = {
  // Shape.cell.dark.positive.common.default
  k: {
    l: ref__450,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__454 = [
  // Shape.cell.dark.positive.highlighted.default.colors.background
  ref__50,
  ref__416,
];
let ref__455 = {
  // Shape.cell.dark.positive.highlighted.pressed
  k: {
    l: ref__454,
    m: ref__396,
    n: ref__268,
  },
  n: ref__303,
};
let ref__456 = {
  // Shape.cell.dark.positive.highlighted.disabled
  k: {
    l: ref__454,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__457 = {
  // Shape.cell.dark.positive.highlighted.default
  k: {
    l: ref__454,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__459 = [
  // Shape.cell.dark.positive.common.hover.colors.background
  ref__50,
  ref__415,
];
let ref__458 = {
  // Shape.cell.dark.positive.common.hover
  k: {
    l: ref__459,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__960 = {
  // Shape.cell.dark.positive.distinct.pressed.colors
  l: ref__459,
  m: ref__396,
  n: ref__268,
};
let ref__460 = {
  // Shape.cell.dark.positive.distinct.pressed
  k: ref__960,
  n: ref__303,
};
let ref__461 = {
  // Shape.cell.dark.positive.distinct.disabled
  k: {
    l: ref__459,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__462 = [
  // Shape.cell.dark.warning.common.default.colors.background
  ref__58,
  ref__395,
];
let ref__463 = {
  // Shape.cell.dark.warning.common.pressed
  k: {
    l: ref__462,
    m: ref__396,
    n: ref__272,
  },
  n: ref__303,
};
let ref__464 = {
  // Shape.cell.dark.warning.common.disabled
  k: {
    l: ref__462,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__465 = {
  // Shape.cell.dark.warning.common.default
  k: {
    l: ref__462,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__466 = [
  // Shape.cell.dark.warning.highlighted.default.colors.background
  ref__58,
  ref__416,
];
let ref__467 = {
  // Shape.cell.dark.warning.highlighted.pressed
  k: {
    l: ref__466,
    m: ref__396,
    n: ref__272,
  },
  n: ref__303,
};
let ref__468 = {
  // Shape.cell.dark.warning.highlighted.disabled
  k: {
    l: ref__466,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__469 = {
  // Shape.cell.dark.warning.highlighted.default
  k: {
    l: ref__466,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__471 = [
  // Shape.cell.dark.warning.common.hover.colors.background
  ref__58,
  ref__415,
];
let ref__470 = {
  // Shape.cell.dark.warning.common.hover
  k: {
    l: ref__471,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__968 = {
  // Shape.cell.dark.warning.distinct.pressed.colors
  l: ref__471,
  m: ref__396,
  n: ref__272,
};
let ref__472 = {
  // Shape.cell.dark.warning.distinct.pressed
  k: ref__968,
  n: ref__303,
};
let ref__473 = {
  // Shape.cell.dark.warning.distinct.disabled
  k: {
    l: ref__471,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__474 = [
  // Shape.cell.dark.negative.common.default.colors.background
  ref__66,
  ref__395,
];
let ref__475 = {
  // Shape.cell.dark.negative.common.pressed
  k: {
    l: ref__474,
    m: ref__396,
    n: ref__276,
  },
  n: ref__303,
};
let ref__476 = {
  // Shape.cell.dark.negative.common.disabled
  k: {
    l: ref__474,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__477 = {
  // Shape.cell.dark.negative.common.default
  k: {
    l: ref__474,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__478 = [
  // Shape.cell.dark.negative.highlighted.default.colors.background
  ref__66,
  ref__416,
];
let ref__479 = {
  // Shape.cell.dark.negative.highlighted.pressed
  k: {
    l: ref__478,
    m: ref__396,
    n: ref__276,
  },
  n: ref__303,
};
let ref__480 = {
  // Shape.cell.dark.negative.highlighted.disabled
  k: {
    l: ref__478,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__481 = {
  // Shape.cell.dark.negative.highlighted.default
  k: {
    l: ref__478,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__483 = [
  // Shape.cell.dark.negative.common.hover.colors.background
  ref__66,
  ref__415,
];
let ref__482 = {
  // Shape.cell.dark.negative.common.hover
  k: {
    l: ref__483,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__976 = {
  // Shape.cell.dark.negative.distinct.pressed.colors
  l: ref__483,
  m: ref__396,
  n: ref__276,
};
let ref__484 = {
  // Shape.cell.dark.negative.distinct.pressed
  k: ref__976,
  n: ref__303,
};
let ref__485 = {
  // Shape.cell.dark.negative.distinct.disabled
  k: {
    l: ref__483,
    m: ref__404,
    n: ref__397,
  },
  n: ref__298,
};
let ref__486 = {
  // Shape.cell.subdued.primary.common.pressed
  k: {
    l: ref__398,
    m: ref__396,
    n: ref__258,
  },
  n: ref__303,
};
let ref__569 = [
  // Shape.cell.dark.building.highlighted.hover.colors.background
  ref__14,
  ref__402,
];
let ref__487 = {
  // Shape.cell.dark.building.highlighted.hover
  k: {
    l: ref__569,
    m: ref__396,
    n: ref__397,
  },
  n: ref__298,
};
let ref__488 = {
  // Shape.cell.subdued.primary.highlighted.pressed
  k: {
    l: ref__397,
    m: ref__396,
    n: ref__258,
  },
  n: ref__303,
};
let ref__489 = {
  // Shape.cell.subdued.primary.distinct.pressed
  k: {
    l: ref__408,
    m: ref__396,
    n: ref__258,
  },
  n: ref__303,
};
let ref__490 = {
  // Shape.cell.subdued.secondary.common.pressed
  k: {
    l: ref__398,
    m: ref__396,
    n: ref__262,
  },
  n: ref__303,
};
let ref__491 = {
  // Shape.cell.subdued.secondary.highlighted.pressed
  k: {
    l: ref__397,
    m: ref__396,
    n: ref__262,
  },
  n: ref__303,
};
let ref__492 = {
  // Shape.cell.subdued.secondary.distinct.pressed
  k: {
    l: ref__408,
    m: ref__396,
    n: ref__262,
  },
  n: ref__303,
};
let ref__493 = {
  // Shape.cell.dark.neutral
  d: {
    b: ref__440,
    o: ref__446,
    p: ref__438,
    q: ref__438,
    r: ref__438,
    s: ref__439,
    t: ref__439,
    c: ref__440,
  },
  e: {
    b: ref__445,
    o: {
      k: {
        l: [ref__22, ref__441],
        m: ref__396,
        n: ref__397,
      },
      n: ref__298,
    },
    p: ref__443,
    q: ref__443,
    r: ref__443,
    s: ref__444,
    t: ref__444,
    c: ref__445,
  },
  f: {
    b: ref__446,
    o: ref__445,
    p: ref__448,
    q: ref__448,
    r: ref__448,
    s: ref__449,
    t: ref__449,
    c: ref__446,
  },
  g: ref__232,
};
let ref__494 = {
  // Shape.cell.dark.positive
  d: {
    b: ref__453,
    o: ref__458,
    p: ref__451,
    q: ref__451,
    r: ref__451,
    s: ref__452,
    t: ref__452,
    c: ref__453,
  },
  e: {
    b: ref__457,
    o: {
      k: {
        l: [ref__50, ref__441],
        m: ref__396,
        n: ref__397,
      },
      n: ref__298,
    },
    p: ref__455,
    q: ref__455,
    r: ref__455,
    s: ref__456,
    t: ref__456,
    c: ref__457,
  },
  f: {
    b: ref__458,
    o: ref__457,
    p: ref__460,
    q: ref__460,
    r: ref__460,
    s: ref__461,
    t: ref__461,
    c: ref__458,
  },
  g: ref__232,
};
let ref__495 = {
  // Shape.cell.dark.warning
  d: {
    b: ref__465,
    o: ref__470,
    p: ref__463,
    q: ref__463,
    r: ref__463,
    s: ref__464,
    t: ref__464,
    c: ref__465,
  },
  e: {
    b: ref__469,
    o: {
      k: {
        l: [ref__58, ref__441],
        m: ref__396,
        n: ref__397,
      },
      n: ref__298,
    },
    p: ref__467,
    q: ref__467,
    r: ref__467,
    s: ref__468,
    t: ref__468,
    c: ref__469,
  },
  f: {
    b: ref__470,
    o: ref__469,
    p: ref__472,
    q: ref__472,
    r: ref__472,
    s: ref__473,
    t: ref__473,
    c: ref__470,
  },
  g: ref__232,
};
let ref__496 = {
  // Shape.cell.dark.negative
  d: {
    b: ref__477,
    o: ref__482,
    p: ref__475,
    q: ref__475,
    r: ref__475,
    s: ref__476,
    t: ref__476,
    c: ref__477,
  },
  e: {
    b: ref__481,
    o: {
      k: {
        l: [ref__66, ref__441],
        m: ref__396,
        n: ref__397,
      },
      n: ref__298,
    },
    p: ref__479,
    q: ref__479,
    r: ref__479,
    s: ref__480,
    t: ref__480,
    c: ref__481,
  },
  f: {
    b: ref__482,
    o: ref__481,
    p: ref__484,
    q: ref__484,
    r: ref__484,
    s: ref__485,
    t: ref__485,
    c: ref__482,
  },
  g: ref__232,
};
let ref__497 = {
  // Shape.cell.dark.building
  d: {
    b: ref__401,
    o: ref__407,
    p: ref__399,
    q: ref__399,
    r: ref__399,
    s: ref__400,
    t: ref__400,
    c: ref__401,
  },
  e: {
    b: ref__406,
    o: ref__487,
    p: ref__403,
    q: ref__403,
    r: ref__403,
    s: ref__405,
    t: ref__405,
    c: ref__406,
  },
  f: {
    b: ref__407,
    o: ref__406,
    p: ref__409,
    q: ref__409,
    r: ref__409,
    s: ref__410,
    t: ref__410,
    c: ref__407,
  },
  g: ref__232,
};
let ref__498 = {
  // Shape.cell.light.primary
  d: {
    b: ref__302,
    o: ref__317,
    p: ref__312,
    q: ref__312,
    r: ref__312,
    s: ref__301,
    t: ref__301,
    c: ref__302,
  },
  e: {
    b: ref__316,
    o: {
      k: {
        l: ref__313,
        m: ref__297,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__314,
    q: ref__314,
    r: ref__314,
    s: ref__315,
    t: ref__315,
    c: ref__316,
  },
  f: {
    b: ref__317,
    o: ref__316,
    p: ref__318,
    q: ref__318,
    r: ref__318,
    s: ref__319,
    t: ref__319,
    c: ref__317,
  },
  g: ref__232,
};
let ref__499 = {
  // Shape.cell.light.secondary
  d: {
    b: ref__302,
    o: ref__326,
    p: ref__321,
    q: ref__321,
    r: ref__321,
    s: ref__301,
    t: ref__301,
    c: ref__302,
  },
  e: {
    b: ref__325,
    o: {
      k: {
        l: ref__322,
        m: ref__297,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__323,
    q: ref__323,
    r: ref__323,
    s: ref__324,
    t: ref__324,
    c: ref__325,
  },
  f: {
    b: ref__326,
    o: ref__325,
    p: ref__327,
    q: ref__327,
    r: ref__327,
    s: ref__328,
    t: ref__328,
    c: ref__326,
  },
  g: ref__232,
};
let ref__500 = {
  // Shape.cell.light.neutral
  d: {
    b: ref__333,
    o: {
      k: {
        l: ref__45,
        m: ref__329,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__330,
    q: ref__330,
    r: ref__330,
    s: ref__332,
    t: ref__332,
    c: ref__333,
  },
  e: {
    b: ref__339,
    o: {
      k: {
        l: ref__43,
        m: ref__329,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__336,
    q: ref__336,
    r: ref__336,
    s: ref__338,
    t: ref__338,
    c: ref__339,
  },
  f: {
    b: ref__342,
    o: {
      k: {
        l: ref__334,
        m: ref__329,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__340,
    q: ref__340,
    r: ref__340,
    s: ref__341,
    t: ref__341,
    c: ref__342,
  },
  g: ref__232,
};
let ref__501 = {
  // Shape.cell.light.positive
  d: {
    b: ref__349,
    o: {
      k: {
        l: ref__266,
        m: ref__345,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__346,
    q: ref__346,
    r: ref__346,
    s: ref__348,
    t: ref__348,
    c: ref__349,
  },
  e: {
    b: ref__356,
    o: {
      k: {
        l: ref__352,
        m: ref__345,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__353,
    q: ref__353,
    r: ref__353,
    s: ref__355,
    t: ref__355,
    c: ref__356,
  },
  f: {
    b: ref__359,
    o: {
      k: {
        l: ref__350,
        m: ref__345,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__357,
    q: ref__357,
    r: ref__357,
    s: ref__358,
    t: ref__358,
    c: ref__359,
  },
  g: ref__232,
};
let ref__502 = {
  // Shape.cell.light.warning
  d: {
    b: ref__366,
    o: {
      k: {
        l: ref__270,
        m: ref__362,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__363,
    q: ref__363,
    r: ref__363,
    s: ref__365,
    t: ref__365,
    c: ref__366,
  },
  e: {
    b: ref__373,
    o: {
      k: {
        l: ref__369,
        m: ref__362,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__370,
    q: ref__370,
    r: ref__370,
    s: ref__372,
    t: ref__372,
    c: ref__373,
  },
  f: {
    b: ref__376,
    o: {
      k: {
        l: ref__367,
        m: ref__362,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__374,
    q: ref__374,
    r: ref__374,
    s: ref__375,
    t: ref__375,
    c: ref__376,
  },
  g: ref__232,
};
let ref__503 = {
  // Shape.cell.light.negative
  d: {
    b: ref__383,
    o: {
      k: {
        l: ref__274,
        m: ref__379,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__380,
    q: ref__380,
    r: ref__380,
    s: ref__382,
    t: ref__382,
    c: ref__383,
  },
  e: {
    b: ref__390,
    o: {
      k: {
        l: ref__386,
        m: ref__379,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__387,
    q: ref__387,
    r: ref__387,
    s: ref__389,
    t: ref__389,
    c: ref__390,
  },
  f: {
    b: ref__393,
    o: {
      k: {
        l: ref__384,
        m: ref__379,
        n: ref__43,
      },
      n: ref__298,
    },
    p: ref__391,
    q: ref__391,
    r: ref__391,
    s: ref__392,
    t: ref__392,
    c: ref__393,
  },
  g: ref__232,
};
let ref__507 = {
  // Shape.formElement.light.primary.common.default.colors.foreground.0
  a: ref__311,
};
let ref__506 = [
  // Shape.formElement.light.primary.common.default.colors.foreground
  ref__507,
  ref__1,
];
let ref__504 = {
  // Shape.formElement.light.primary.common.default
  k: {
    l: ref__222,
    m: ref__506,
    n: ref__42,
  },
  n: ref__298,
};
let ref__505 = {
  // BorderPalette.basic.blank
  j: ref__4,
};
let ref__520 = [
  // Shape.formElement.light.primary.common.disabled.colors.background
  ref__14,
  ref__216,
];
let ref__514 = [
  // Shape.formElement.light.primary.common.disabled.colors.foreground
  ref__507,
  ref__216,
];
let ref__522 = [
  // Shape.formElement.light.primary.common.disabled.colors.border
  ref__22,
  ref__216,
];
let ref__508 = {
  // Shape.formElement.light.primary.common.disabled
  k: {
    l: ref__520,
    m: ref__514,
    n: ref__522,
  },
  n: ref__298,
};
let ref__511 = [
  // Shape.formElement.light.primary.common.pressed.border
  ref__505,
  ref__1,
];
let ref__509 = {
  // Shape.formElement.light.primary.common.pressed
  k: {
    l: ref__230,
    m: ref__396,
  },
  n: ref__511,
};
let ref__510 = {
  // Shape.formElement.light.primary.common.focused
  k: {
    l: ref__222,
    m: ref__506,
    n: ref__311,
  },
  n: ref__303,
};
let ref__1015 = [
  // Shape.formElement.light.primary.highlighted.disabled.colors.background
  ref__23,
  ref__216,
];
let ref__512 = {
  // Shape.formElement.light.primary.highlighted.disabled
  k: {
    l: ref__1015,
    m: ref__404,
  },
  n: ref__511,
};
let ref__513 = {
  // Shape.formElement.light.primary.distinct.default
  k: {
    l: ref__45,
    m: ref__506,
  },
  n: ref__511,
};
let ref__528 = [
  // Shape.formElement.light.primary.distinct.disabled.colors.background
  ref__15,
  ref__216,
];
let ref__515 = {
  // Shape.formElement.light.primary.distinct.disabled
  k: {
    l: ref__528,
    m: ref__514,
  },
  n: ref__511,
};
let ref__516 = {
  // Shape.formElement.light.primary.subdued.default
  k: {
    l: ref__398,
    m: ref__506,
  },
  n: ref__511,
};
let ref__517 = {
  // Shape.formElement.light.primary.subdued.disabled
  k: {
    l: ref__398,
    m: ref__514,
  },
  n: ref__511,
};
let ref__521 = {
  // Shape.formElement.light.secondary.common.default.colors.foreground.0
  a: ref__320,
};
let ref__519 = [
  // Shape.formElement.light.secondary.common.default.colors.foreground
  ref__521,
  ref__1,
];
let ref__518 = {
  // Shape.formElement.light.secondary.common.default
  k: {
    l: ref__222,
    m: ref__519,
    n: ref__42,
  },
  n: ref__298,
};
let ref__529 = [
  // Shape.formElement.light.secondary.common.disabled.colors.foreground
  ref__521,
  ref__216,
];
let ref__523 = {
  // Shape.formElement.light.secondary.common.disabled
  k: {
    l: ref__520,
    m: ref__529,
    n: ref__522,
  },
  n: ref__298,
};
let ref__524 = {
  // Shape.formElement.light.secondary.common.pressed
  k: {
    l: ref__235,
    m: ref__396,
  },
  n: ref__511,
};
let ref__525 = {
  // Shape.formElement.light.secondary.common.focused
  k: {
    l: ref__222,
    m: ref__519,
    n: ref__320,
  },
  n: ref__303,
};
let ref__1020 = [
  // Shape.formElement.light.secondary.highlighted.disabled.colors.background
  ref__31,
  ref__216,
];
let ref__526 = {
  // Shape.formElement.light.secondary.highlighted.disabled
  k: {
    l: ref__1020,
    m: ref__404,
  },
  n: ref__511,
};
let ref__527 = {
  // Shape.formElement.light.secondary.distinct.default
  k: {
    l: ref__45,
    m: ref__519,
  },
  n: ref__511,
};
let ref__530 = {
  // Shape.formElement.light.secondary.distinct.disabled
  k: {
    l: ref__528,
    m: ref__529,
  },
  n: ref__511,
};
let ref__531 = {
  // Shape.formElement.light.secondary.subdued.default
  k: {
    l: ref__398,
    m: ref__519,
  },
  n: ref__511,
};
let ref__532 = {
  // Shape.formElement.light.secondary.subdued.disabled
  k: {
    l: ref__398,
    m: ref__529,
  },
  n: ref__511,
};
let ref__533 = {
  // Shape.formElement.light.neutral.common.default
  k: {
    l: ref__222,
    m: ref__335,
    n: ref__43,
  },
  n: ref__298,
};
let ref__534 = {
  // Shape.formElement.light.neutral.common.disabled
  k: {
    l: ref__520,
    m: ref__337,
    n: [ref__16, ref__216],
  },
  n: ref__298,
};
let ref__535 = {
  // Shape.formElement.light.neutral.common.pressed
  k: {
    l: ref__39,
    m: ref__396,
  },
  n: ref__511,
};
let ref__536 = {
  // Shape.formElement.light.neutral.common.focused
  k: {
    l: ref__222,
    m: ref__335,
    n: ref__40,
  },
  n: ref__303,
};
let ref__919 = [
  // Shape.formElement.light.neutral.highlighted.disabled.colors.background
  ref__21,
  ref__216,
];
let ref__537 = {
  // Shape.formElement.light.neutral.highlighted.disabled
  k: {
    l: ref__919,
    m: ref__404,
  },
  n: ref__511,
};
let ref__538 = {
  // Shape.formElement.light.neutral.distinct.default
  k: {
    l: ref__237,
    m: ref__335,
  },
  n: ref__511,
};
let ref__539 = {
  // Shape.formElement.light.neutral.distinct.disabled
  k: {
    l: [ref__44, ref__216],
    m: ref__337,
  },
  n: ref__511,
};
let ref__540 = {
  // Shape.formElement.light.neutral.subdued.default
  k: {
    l: ref__398,
    m: ref__335,
  },
  n: ref__511,
};
let ref__541 = {
  // Shape.formElement.light.neutral.subdued.disabled
  k: {
    l: ref__398,
    m: ref__337,
  },
  n: ref__511,
};
let ref__542 = {
  // Shape.formElement.light.positive.common.default
  k: {
    l: ref__222,
    m: ref__351,
    n: ref__352,
  },
  n: ref__298,
};
let ref__543 = {
  // Shape.formElement.light.positive.common.disabled
  k: {
    l: ref__520,
    m: ref__354,
    n: [ref__51, ref__216],
  },
  n: ref__298,
};
let ref__544 = {
  // Shape.formElement.light.positive.common.pressed
  k: {
    l: ref__242,
    m: ref__396,
  },
  n: ref__511,
};
let ref__545 = {
  // Shape.formElement.light.positive.common.focused
  k: {
    l: ref__222,
    m: ref__351,
    n: ref__343,
  },
  n: ref__303,
};
let ref__925 = [
  // Shape.formElement.light.positive.highlighted.disabled.colors.background
  ref__47,
  ref__216,
];
let ref__546 = {
  // Shape.formElement.light.positive.highlighted.disabled
  k: {
    l: ref__925,
    m: ref__404,
  },
  n: ref__511,
};
let ref__547 = {
  // Shape.formElement.light.positive.distinct.default
  k: {
    l: ref__240,
    m: ref__351,
  },
  n: ref__511,
};
let ref__548 = {
  // Shape.formElement.light.positive.distinct.disabled
  k: {
    l: [ref__52, ref__216],
    m: ref__354,
  },
  n: ref__511,
};
let ref__549 = {
  // Shape.formElement.light.positive.subdued.default
  k: {
    l: ref__398,
    m: ref__351,
  },
  n: ref__511,
};
let ref__550 = {
  // Shape.formElement.light.positive.subdued.disabled
  k: {
    l: ref__398,
    m: ref__354,
  },
  n: ref__511,
};
let ref__551 = {
  // Shape.formElement.light.warning.common.default
  k: {
    l: ref__222,
    m: ref__368,
    n: ref__369,
  },
  n: ref__298,
};
let ref__552 = {
  // Shape.formElement.light.warning.common.disabled
  k: {
    l: ref__520,
    m: ref__371,
    n: [ref__59, ref__216],
  },
  n: ref__298,
};
let ref__553 = {
  // Shape.formElement.light.warning.common.pressed
  k: {
    l: ref__246,
    m: ref__396,
  },
  n: ref__511,
};
let ref__554 = {
  // Shape.formElement.light.warning.common.focused
  k: {
    l: ref__222,
    m: ref__368,
    n: ref__360,
  },
  n: ref__303,
};
let ref__931 = [
  // Shape.formElement.light.warning.highlighted.disabled.colors.background
  ref__55,
  ref__216,
];
let ref__555 = {
  // Shape.formElement.light.warning.highlighted.disabled
  k: {
    l: ref__931,
    m: ref__404,
  },
  n: ref__511,
};
let ref__556 = {
  // Shape.formElement.light.warning.distinct.default
  k: {
    l: ref__244,
    m: ref__368,
  },
  n: ref__511,
};
let ref__557 = {
  // Shape.formElement.light.warning.distinct.disabled
  k: {
    l: [ref__60, ref__216],
    m: ref__371,
  },
  n: ref__511,
};
let ref__558 = {
  // Shape.formElement.light.warning.subdued.default
  k: {
    l: ref__398,
    m: ref__368,
  },
  n: ref__511,
};
let ref__559 = {
  // Shape.formElement.light.warning.subdued.disabled
  k: {
    l: ref__398,
    m: ref__371,
  },
  n: ref__511,
};
let ref__560 = {
  // Shape.formElement.light.negative.common.default
  k: {
    l: ref__222,
    m: ref__385,
    n: ref__386,
  },
  n: ref__298,
};
let ref__561 = {
  // Shape.formElement.light.negative.common.disabled
  k: {
    l: ref__520,
    m: ref__388,
    n: [ref__67, ref__216],
  },
  n: ref__298,
};
let ref__562 = {
  // Shape.formElement.light.negative.common.pressed
  k: {
    l: ref__250,
    m: ref__396,
  },
  n: ref__511,
};
let ref__563 = {
  // Shape.formElement.light.negative.common.focused
  k: {
    l: ref__222,
    m: ref__385,
    n: ref__377,
  },
  n: ref__303,
};
let ref__937 = [
  // Shape.formElement.light.negative.highlighted.disabled.colors.background
  ref__63,
  ref__216,
];
let ref__564 = {
  // Shape.formElement.light.negative.highlighted.disabled
  k: {
    l: ref__937,
    m: ref__404,
  },
  n: ref__511,
};
let ref__565 = {
  // Shape.formElement.light.negative.distinct.default
  k: {
    l: ref__248,
    m: ref__385,
  },
  n: ref__511,
};
let ref__566 = {
  // Shape.formElement.light.negative.distinct.disabled
  k: {
    l: [ref__68, ref__216],
    m: ref__388,
  },
  n: ref__511,
};
let ref__567 = {
  // Shape.formElement.light.negative.subdued.default
  k: {
    l: ref__398,
    m: ref__385,
  },
  n: ref__511,
};
let ref__568 = {
  // Shape.formElement.light.negative.subdued.disabled
  k: {
    l: ref__398,
    m: ref__388,
  },
  n: ref__511,
};
let ref__630 = [
  // Shape.formElement.dark.primary.common.disabled.colors.border
  ref__14,
  ref__415,
];
let ref__570 = {
  // Shape.formElement.dark.primary.common.disabled
  k: {
    l: ref__398,
    m: ref__404,
    n: ref__630,
  },
  n: ref__298,
};
let ref__571 = {
  // Shape.formElement.dark.primary.common.default
  k: {
    l: ref__398,
    m: ref__396,
    n: ref__569,
  },
  n: ref__298,
};
let ref__572 = {
  // Shape.formElement.dark.primary.common.pressed
  k: {
    l: ref__258,
    m: ref__396,
  },
  n: ref__511,
};
let ref__573 = {
  // Shape.formElement.dark.primary.common.focused
  k: {
    l: ref__222,
    m: ref__506,
    n: ref__258,
  },
  n: ref__303,
};
let ref__1037 = [
  // Shape.formElement.dark.primary.highlighted.disabled.colors.background
  ref__26,
  ref__216,
];
let ref__574 = {
  // Shape.formElement.dark.primary.highlighted.disabled
  k: {
    l: ref__1037,
    m: ref__404,
  },
  n: ref__511,
};
let ref__575 = 0.2; // Shape.formElement.dark.primary.distinct.default.colors.background.1
let ref__942 = [
  // Shape.formElement.dark.primary.distinct.default.colors.background
  ref__14,
  ref__575,
];
let ref__576 = {
  // Shape.formElement.dark.primary.distinct.default
  k: {
    l: ref__942,
    m: ref__396,
  },
  n: ref__511,
};
let ref__577 = {
  // Shape.formElement.dark.primary.subdued.default
  k: {
    l: ref__398,
    m: ref__396,
  },
  n: ref__511,
};
let ref__578 = {
  // Shape.formElement.dark.primary.subdued.disabled
  k: {
    l: ref__398,
    m: ref__404,
  },
  n: ref__511,
};
let ref__579 = {
  // Shape.formElement.dark.primary.common.hover
  k: {
    l: ref__222,
    m: ref__396,
    n: ref__569,
  },
  n: ref__298,
};
let ref__580 = {
  // Shape.formElement.dark.secondary.common.pressed
  k: {
    l: ref__262,
    m: ref__396,
  },
  n: ref__511,
};
let ref__581 = {
  // Shape.formElement.dark.secondary.common.focused
  k: {
    l: ref__222,
    m: ref__519,
    n: ref__262,
  },
  n: ref__303,
};
let ref__1046 = [
  // Shape.formElement.dark.secondary.highlighted.disabled.colors.background
  ref__34,
  ref__216,
];
let ref__582 = {
  // Shape.formElement.dark.secondary.highlighted.disabled
  k: {
    l: ref__1046,
    m: ref__404,
  },
  n: ref__511,
};
let ref__583 = {
  // Shape.formElement.dark.primary.distinct.disabled
  k: {
    l: [ref__14, ref__226],
    m: ref__404,
  },
  n: ref__511,
};
let ref__584 = {
  // Shape.formElement.dark.primary.distinct.readOnly
  k: {
    l: [ref__15, ref__226],
    m: ref__404,
  },
  n: ref__511,
};
let ref__955 = {
  // Shape.formElement.dark.neutral.common.default.colors
  l: ref__398,
  m: ref__396,
  n: ref__39,
};
let ref__585 = {
  // Shape.formElement.dark.neutral.common.default
  k: ref__955,
  n: ref__298,
};
let ref__586 = {
  // Shape.formElement.dark.neutral.common.disabled
  k: {
    l: ref__398,
    m: ref__404,
    n: ref__39,
  },
  n: ref__298,
};
let ref__587 = {
  // Shape.formElement.dark.neutral.common.pressed
  k: {
    l: ref__42,
    m: ref__396,
  },
  n: ref__511,
};
let ref__588 = {
  // Shape.formElement.dark.neutral.common.focused
  k: {
    l: ref__222,
    m: ref__335,
    n: ref__42,
  },
  n: ref__303,
};
let ref__589 = {
  // Shape.formElement.dark.neutral.highlighted.disabled
  k: {
    l: ref__522,
    m: ref__404,
  },
  n: ref__511,
};
let ref__590 = {
  // Shape.formElement.dark.neutral.distinct.default
  k: {
    l: ref__447,
    m: ref__396,
  },
  n: ref__511,
};
let ref__591 = {
  // Shape.formElement.dark.neutral.distinct.disabled
  k: {
    l: [ref__22, ref__226],
    m: ref__404,
  },
  n: ref__511,
};
let ref__963 = {
  // Shape.formElement.dark.positive.common.default.colors
  l: ref__398,
  m: ref__396,
  n: ref__242,
};
let ref__592 = {
  // Shape.formElement.dark.positive.common.default
  k: ref__963,
  n: ref__298,
};
let ref__593 = {
  // Shape.formElement.dark.positive.common.disabled
  k: {
    l: ref__398,
    m: ref__404,
    n: ref__242,
  },
  n: ref__298,
};
let ref__594 = {
  // Shape.formElement.dark.positive.common.pressed
  k: {
    l: ref__268,
    m: ref__396,
  },
  n: ref__511,
};
let ref__595 = {
  // Shape.formElement.dark.positive.common.focused
  k: {
    l: ref__222,
    m: ref__351,
    n: ref__268,
  },
  n: ref__303,
};
let ref__1063 = [
  // Shape.formElement.dark.positive.highlighted.disabled.colors.background
  ref__50,
  ref__216,
];
let ref__596 = {
  // Shape.formElement.dark.positive.highlighted.disabled
  k: {
    l: ref__1063,
    m: ref__404,
  },
  n: ref__511,
};
let ref__597 = {
  // Shape.formElement.dark.positive.distinct.default
  k: {
    l: ref__459,
    m: ref__396,
  },
  n: ref__511,
};
let ref__598 = {
  // Shape.formElement.dark.positive.distinct.disabled
  k: {
    l: [ref__50, ref__226],
    m: ref__404,
  },
  n: ref__511,
};
let ref__971 = {
  // Shape.formElement.dark.warning.common.default.colors
  l: ref__398,
  m: ref__396,
  n: ref__246,
};
let ref__599 = {
  // Shape.formElement.dark.warning.common.default
  k: ref__971,
  n: ref__298,
};
let ref__600 = {
  // Shape.formElement.dark.warning.common.disabled
  k: {
    l: ref__398,
    m: ref__404,
    n: ref__246,
  },
  n: ref__298,
};
let ref__601 = {
  // Shape.formElement.dark.warning.common.pressed
  k: {
    l: ref__272,
    m: ref__396,
  },
  n: ref__511,
};
let ref__602 = {
  // Shape.formElement.dark.warning.common.focused
  k: {
    l: ref__222,
    m: ref__368,
    n: ref__272,
  },
  n: ref__303,
};
let ref__1072 = [
  // Shape.formElement.dark.warning.highlighted.disabled.colors.background
  ref__58,
  ref__216,
];
let ref__603 = {
  // Shape.formElement.dark.warning.highlighted.disabled
  k: {
    l: ref__1072,
    m: ref__404,
  },
  n: ref__511,
};
let ref__604 = {
  // Shape.formElement.dark.warning.distinct.default
  k: {
    l: ref__471,
    m: ref__396,
  },
  n: ref__511,
};
let ref__605 = {
  // Shape.formElement.dark.warning.distinct.disabled
  k: {
    l: [ref__58, ref__226],
    m: ref__404,
  },
  n: ref__511,
};
let ref__979 = {
  // Shape.formElement.dark.negative.common.default.colors
  l: ref__398,
  m: ref__396,
  n: ref__250,
};
let ref__606 = {
  // Shape.formElement.dark.negative.common.default
  k: ref__979,
  n: ref__298,
};
let ref__607 = {
  // Shape.formElement.dark.negative.common.disabled
  k: {
    l: ref__398,
    m: ref__404,
    n: ref__250,
  },
  n: ref__298,
};
let ref__608 = {
  // Shape.formElement.dark.negative.common.pressed
  k: {
    l: ref__276,
    m: ref__396,
  },
  n: ref__511,
};
let ref__609 = {
  // Shape.formElement.dark.negative.common.focused
  k: {
    l: ref__222,
    m: ref__385,
    n: ref__276,
  },
  n: ref__303,
};
let ref__1081 = [
  // Shape.formElement.dark.negative.highlighted.disabled.colors.background
  ref__66,
  ref__216,
];
let ref__610 = {
  // Shape.formElement.dark.negative.highlighted.disabled
  k: {
    l: ref__1081,
    m: ref__404,
  },
  n: ref__511,
};
let ref__611 = {
  // Shape.formElement.dark.negative.distinct.default
  k: {
    l: ref__483,
    m: ref__396,
  },
  n: ref__511,
};
let ref__612 = {
  // Shape.formElement.dark.negative.distinct.disabled
  k: {
    l: [ref__66, ref__226],
    m: ref__404,
  },
  n: ref__511,
};
let ref__613 = {
  // Shape.formElement.dark
  u: {
    d: {
      b: ref__571,
      o: ref__579,
      p: ref__572,
      q: ref__573,
      r: ref__232,
      s: ref__570,
      t: ref__570,
      c: ref__571,
    },
    e: {
      b: ref__572,
      o: ref__572,
      p: ref__572,
      q: ref__573,
      r: ref__232,
      s: ref__574,
      t: ref__574,
      c: ref__572,
    },
    f: {
      b: ref__576,
      o: ref__576,
      p: ref__572,
      q: ref__573,
      r: ref__232,
      s: ref__583,
      t: ref__584,
      c: ref__576,
    },
    g: {
      b: ref__577,
      o: ref__577,
      p: ref__572,
      q: ref__573,
      r: ref__232,
      s: ref__578,
      t: ref__578,
      c: ref__577,
    },
  },
  v: {
    d: {
      b: ref__571,
      o: ref__579,
      p: ref__580,
      q: ref__581,
      r: ref__232,
      s: ref__570,
      t: ref__570,
      c: ref__571,
    },
    e: {
      b: ref__580,
      o: ref__580,
      p: ref__580,
      q: ref__581,
      r: ref__232,
      s: ref__582,
      t: ref__582,
      c: ref__580,
    },
    f: {
      b: ref__576,
      o: ref__576,
      p: ref__580,
      q: ref__581,
      r: ref__232,
      s: ref__583,
      t: ref__584,
      c: ref__576,
    },
    g: {
      b: ref__577,
      o: ref__577,
      p: ref__580,
      q: ref__581,
      r: ref__232,
      s: ref__578,
      t: ref__578,
      c: ref__577,
    },
  },
  w: {
    d: {
      b: ref__585,
      o: ref__585,
      p: ref__587,
      q: ref__588,
      r: ref__232,
      s: ref__586,
      t: ref__586,
      c: ref__585,
    },
    e: {
      b: ref__587,
      o: ref__587,
      p: ref__587,
      q: ref__588,
      r: ref__232,
      s: ref__589,
      t: ref__589,
      c: ref__587,
    },
    f: {
      b: ref__590,
      o: ref__590,
      p: ref__587,
      q: ref__588,
      r: ref__232,
      s: ref__591,
      t: ref__591,
      c: ref__590,
    },
    g: {
      b: ref__577,
      o: ref__577,
      p: ref__587,
      q: ref__588,
      r: ref__232,
      s: ref__578,
      t: ref__578,
      c: ref__577,
    },
  },
  x: {
    d: {
      b: ref__592,
      o: ref__592,
      p: ref__594,
      q: ref__595,
      r: ref__232,
      s: ref__593,
      t: ref__593,
      c: ref__592,
    },
    e: {
      b: ref__594,
      o: ref__594,
      p: ref__594,
      q: ref__595,
      r: ref__232,
      s: ref__596,
      t: ref__596,
      c: ref__594,
    },
    f: {
      b: ref__597,
      o: ref__597,
      p: ref__594,
      q: ref__595,
      r: ref__232,
      s: ref__598,
      t: ref__598,
      c: ref__597,
    },
    g: {
      b: ref__577,
      o: ref__577,
      p: ref__594,
      q: ref__595,
      r: ref__232,
      s: ref__578,
      t: ref__578,
      c: ref__577,
    },
  },
  y: {
    d: {
      b: ref__599,
      o: ref__599,
      p: ref__601,
      q: ref__602,
      r: ref__232,
      s: ref__600,
      t: ref__600,
      c: ref__599,
    },
    e: {
      b: ref__601,
      o: ref__601,
      p: ref__601,
      q: ref__602,
      r: ref__232,
      s: ref__603,
      t: ref__603,
      c: ref__601,
    },
    f: {
      b: ref__604,
      o: ref__604,
      p: ref__601,
      q: ref__602,
      r: ref__232,
      s: ref__605,
      t: ref__605,
      c: ref__604,
    },
    g: {
      b: ref__577,
      o: ref__577,
      p: ref__601,
      q: ref__602,
      r: ref__232,
      s: ref__578,
      t: ref__578,
      c: ref__577,
    },
  },
  z: {
    d: {
      b: ref__606,
      o: ref__606,
      p: ref__608,
      q: ref__609,
      r: ref__232,
      s: ref__607,
      t: ref__607,
      c: ref__606,
    },
    e: {
      b: ref__608,
      o: ref__608,
      p: ref__608,
      q: ref__609,
      r: ref__232,
      s: ref__610,
      t: ref__610,
      c: ref__608,
    },
    f: {
      b: ref__611,
      o: ref__611,
      p: ref__608,
      q: ref__609,
      r: ref__232,
      s: ref__612,
      t: ref__612,
      c: ref__611,
    },
    g: {
      b: ref__577,
      o: ref__577,
      p: ref__608,
      q: ref__609,
      r: ref__232,
      s: ref__578,
      t: ref__578,
      c: ref__577,
    },
  },
};
let ref__614 = {
  // Shape.formElement.main.primary.common.pressed
  k: {
    l: ref__222,
    m: ref__506,
  },
  n: ref__511,
};
let ref__615 = {
  // Shape.formElement.main.primary.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__514,
  },
  n: ref__511,
};
let ref__616 = {
  // Shape.formElement.main.secondary.common.pressed
  k: {
    l: ref__222,
    m: ref__519,
  },
  n: ref__511,
};
let ref__617 = {
  // Shape.formElement.main.secondary.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__529,
  },
  n: ref__511,
};
let ref__910 = [
  // Shape.formElement.main.primary.subdued.readOnly.colors.background
  ref__15,
  ref__214,
];
let ref__618 = {
  // Shape.formElement.main.primary.subdued.readOnly
  k: {
    l: ref__910,
    m: ref__404,
  },
  n: ref__511,
};
let ref__619 = {
  // Shape.formElement.main.neutral.common.pressed
  k: {
    l: ref__222,
    m: ref__335,
  },
  n: ref__511,
};
let ref__620 = {
  // Shape.formElement.main.neutral.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__337,
  },
  n: ref__511,
};
let ref__621 = {
  // Shape.formElement.main.positive.common.pressed
  k: {
    l: ref__222,
    m: ref__351,
  },
  n: ref__511,
};
let ref__622 = {
  // Shape.formElement.main.positive.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__354,
  },
  n: ref__511,
};
let ref__623 = {
  // Shape.formElement.main.warning.common.pressed
  k: {
    l: ref__222,
    m: ref__368,
  },
  n: ref__511,
};
let ref__624 = {
  // Shape.formElement.main.warning.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__371,
  },
  n: ref__511,
};
let ref__625 = {
  // Shape.formElement.main.negative.common.pressed
  k: {
    l: ref__222,
    m: ref__385,
  },
  n: ref__511,
};
let ref__626 = {
  // Shape.formElement.main.negative.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__388,
  },
  n: ref__511,
};
let ref__627 = {
  // Shape.formElement.light.primary.common
  b: ref__504,
  o: ref__504,
  p: ref__509,
  q: ref__510,
  r: ref__232,
  s: ref__508,
  t: ref__508,
  c: ref__504,
};
let ref__628 = {
  // Shape.formElement.light.primary.highlighted
  b: ref__509,
  o: ref__509,
  p: ref__509,
  q: ref__510,
  r: ref__232,
  s: ref__512,
  t: ref__512,
  c: ref__509,
};
let ref__629 = {
  // Shape.formElement.soft.primary.distinct.default
  k: {
    l: ref__569,
    m: ref__506,
  },
  n: ref__511,
};
let ref__631 = {
  // Shape.formElement.soft.primary.distinct.disabled
  k: {
    l: ref__630,
    m: ref__514,
  },
  n: ref__511,
};
let ref__632 = {
  // Shape.formElement.light.primary.subdued
  b: ref__516,
  o: ref__516,
  p: ref__509,
  q: ref__510,
  r: ref__232,
  s: ref__517,
  t: ref__517,
  c: ref__516,
};
let ref__633 = {
  // Shape.formElement.light.secondary.common
  b: ref__518,
  o: ref__518,
  p: ref__524,
  q: ref__525,
  r: ref__232,
  s: ref__523,
  t: ref__523,
  c: ref__518,
};
let ref__634 = {
  // Shape.formElement.light.secondary.highlighted
  b: ref__524,
  o: ref__524,
  p: ref__524,
  q: ref__525,
  r: ref__232,
  s: ref__526,
  t: ref__526,
  c: ref__524,
};
let ref__635 = {
  // Shape.formElement.soft.secondary.distinct.default
  k: {
    l: ref__569,
    m: ref__519,
  },
  n: ref__511,
};
let ref__636 = {
  // Shape.formElement.soft.secondary.distinct.disabled
  k: {
    l: ref__630,
    m: ref__529,
  },
  n: ref__511,
};
let ref__637 = {
  // Shape.formElement.light.secondary.subdued
  b: ref__531,
  o: ref__531,
  p: ref__524,
  q: ref__525,
  r: ref__232,
  s: ref__532,
  t: ref__532,
  c: ref__531,
};
let ref__638 = {
  // Shape.formElement.light.neutral.common
  b: ref__533,
  o: ref__533,
  p: ref__535,
  q: ref__536,
  r: ref__232,
  s: ref__534,
  t: ref__534,
  c: ref__533,
};
let ref__639 = {
  // Shape.formElement.light.neutral.highlighted
  b: ref__535,
  o: ref__535,
  p: ref__535,
  q: ref__536,
  r: ref__232,
  s: ref__537,
  t: ref__537,
  c: ref__535,
};
let ref__640 = {
  // Shape.formElement.soft.neutral.distinct.default
  k: {
    l: ref__569,
    m: ref__335,
  },
  n: ref__511,
};
let ref__641 = {
  // Shape.formElement.soft.neutral.distinct.disabled
  k: {
    l: ref__630,
    m: ref__337,
  },
  n: ref__511,
};
let ref__642 = {
  // Shape.formElement.light.neutral.subdued
  b: ref__540,
  o: ref__540,
  p: ref__535,
  q: ref__536,
  r: ref__232,
  s: ref__541,
  t: ref__541,
  c: ref__540,
};
let ref__643 = {
  // Shape.formElement.light.positive.common
  b: ref__542,
  o: ref__542,
  p: ref__544,
  q: ref__545,
  r: ref__232,
  s: ref__543,
  t: ref__543,
  c: ref__542,
};
let ref__644 = {
  // Shape.formElement.light.positive.highlighted
  b: ref__544,
  o: ref__544,
  p: ref__544,
  q: ref__545,
  r: ref__232,
  s: ref__546,
  t: ref__546,
  c: ref__544,
};
let ref__645 = {
  // Shape.formElement.soft.positive.distinct.default
  k: {
    l: ref__569,
    m: ref__351,
  },
  n: ref__511,
};
let ref__646 = {
  // Shape.formElement.soft.positive.distinct.disabled
  k: {
    l: ref__630,
    m: ref__354,
  },
  n: ref__511,
};
let ref__647 = {
  // Shape.formElement.light.positive.subdued
  b: ref__549,
  o: ref__549,
  p: ref__544,
  q: ref__545,
  r: ref__232,
  s: ref__550,
  t: ref__550,
  c: ref__549,
};
let ref__648 = {
  // Shape.formElement.light.warning.common
  b: ref__551,
  o: ref__551,
  p: ref__553,
  q: ref__554,
  r: ref__232,
  s: ref__552,
  t: ref__552,
  c: ref__551,
};
let ref__649 = {
  // Shape.formElement.light.warning.highlighted
  b: ref__553,
  o: ref__553,
  p: ref__553,
  q: ref__554,
  r: ref__232,
  s: ref__555,
  t: ref__555,
  c: ref__553,
};
let ref__650 = {
  // Shape.formElement.soft.warning.distinct.default
  k: {
    l: ref__569,
    m: ref__368,
  },
  n: ref__511,
};
let ref__651 = {
  // Shape.formElement.soft.warning.distinct.disabled
  k: {
    l: ref__630,
    m: ref__371,
  },
  n: ref__511,
};
let ref__652 = {
  // Shape.formElement.light.warning.subdued
  b: ref__558,
  o: ref__558,
  p: ref__553,
  q: ref__554,
  r: ref__232,
  s: ref__559,
  t: ref__559,
  c: ref__558,
};
let ref__653 = {
  // Shape.formElement.light.negative.common
  b: ref__560,
  o: ref__560,
  p: ref__562,
  q: ref__563,
  r: ref__232,
  s: ref__561,
  t: ref__561,
  c: ref__560,
};
let ref__654 = {
  // Shape.formElement.light.negative.highlighted
  b: ref__562,
  o: ref__562,
  p: ref__562,
  q: ref__563,
  r: ref__232,
  s: ref__564,
  t: ref__564,
  c: ref__562,
};
let ref__655 = {
  // Shape.formElement.soft.negative.distinct.default
  k: {
    l: ref__569,
    m: ref__385,
  },
  n: ref__511,
};
let ref__656 = {
  // Shape.formElement.soft.negative.distinct.disabled
  k: {
    l: ref__630,
    m: ref__388,
  },
  n: ref__511,
};
let ref__657 = {
  // Shape.formElement.light.negative.subdued
  b: ref__567,
  o: ref__567,
  p: ref__562,
  q: ref__563,
  r: ref__232,
  s: ref__568,
  t: ref__568,
  c: ref__567,
};
let ref__658 = {
  // ElevationPalette.groundLayer.elevated
  a: [ref__17, 0.32],
  A: ref__213,
  B: ref__214,
  C: ref__1,
  D: ref__215,
  E: ref__214,
};
let ref__659 = {
  // Shape.ground.light.building.common.default.colors
  l: ref__222,
};
let ref__660 = {
  // ElevationPalette.groundLayer.highlyElevated
  a: ref__219,
  A: ref__213,
  B: ref__214,
  C: ref__217,
  D: 7,
  E: ref__214,
};
let ref__661 = [
  // Shape.ground.light.building.common.default.elevation
  ref__658,
  ref__1,
];
let ref__665 = [
  // Shape.ground.light.building.common.hover.elevation
  ref__660,
  ref__1,
];
let ref__662 = {
  // Shape.ground.light.building.common.hover
  k: ref__659,
  n: ref__511,
  F: ref__665,
};
let ref__663 = {
  // Shape.ground.light.building.common.default
  k: ref__659,
  n: ref__511,
  F: ref__661,
};
let ref__664 = {
  // Shape.ground.light.building.highlighted.default.colors
  l: ref__224,
};
let ref__666 = [
  // ColorPalette.dark.main.light
  ref__18,
  ref__1,
];
let ref__667 = {
  // Shape.ground.light.building.highlighted.hover
  k: ref__664,
  n: ref__511,
  F: ref__665,
};
let ref__668 = {
  // Shape.ground.light.building.highlighted.default
  k: ref__664,
  n: ref__511,
  F: ref__661,
};
let ref__669 = {
  // Shape.ground.light.building.common.pressed.colors
  l: ref__45,
};
let ref__670 = {
  // Shape.ground.light.building.common.pressed
  k: ref__669,
  n: ref__511,
  F: ref__661,
};
let ref__671 = {
  // Shape.ground.light.building.distinct.default
  k: ref__669,
  n: ref__511,
};
let ref__672 = {
  // Shape.ground.light.building.subdued.default.colors
  l: ref__222,
  n: ref__43,
};
let ref__673 = {
  // Shape.ground.light.building.subdued.hover
  k: ref__672,
  n: ref__298,
  F: ref__661,
};
let ref__674 = {
  // Shape.ground.light.building.common.selected.colors
  l: ref__222,
  n: ref__224,
};
let ref__675 = {
  // Shape.ground.light.building.subdued.default
  k: ref__672,
  n: ref__298,
};
let ref__676 = {
  // Shape.ground.light.primary.common.default.colors
  l: ref__228,
};
let ref__677 = {
  // Shape.ground.light.primary.common.hover
  k: ref__676,
  n: ref__511,
  F: ref__665,
};
let ref__678 = {
  // Shape.ground.light.primary.common.default
  k: ref__676,
  n: ref__511,
  F: ref__661,
};
let ref__679 = [
  // ColorPalette.primary.main.darkest
  ref__25,
  ref__1,
];
let ref__758 = {
  // Shape.ground.light.primary.highlighted.hover.colors
  l: ref__311,
};
let ref__680 = {
  // Shape.ground.light.primary.highlighted.hover
  k: ref__758,
  n: ref__511,
  F: ref__665,
};
let ref__757 = {
  // Shape.ground.light.primary.highlighted.default.colors
  l: ref__230,
};
let ref__681 = {
  // Shape.ground.light.primary.highlighted.default
  k: ref__757,
  n: ref__511,
  F: ref__661,
};
let ref__682 = {
  // Shape.ground.light.primary.common.pressed.colors
  l: ref__256,
};
let ref__683 = {
  // Shape.ground.light.primary.common.selected.colors
  l: ref__228,
  n: ref__230,
};
let ref__684 = {
  // Shape.ground.light.primary.distinct.default
  k: ref__676,
  n: ref__511,
};
let ref__685 = {
  // Shape.ground.light.primary.subdued.default.colors
  l: ref__222,
  n: ref__256,
};
let ref__686 = {
  // Shape.ground.light.primary.subdued.hover
  k: ref__685,
  n: ref__298,
  F: ref__661,
};
let ref__687 = {
  // Shape.ground.light.primary.subdued.default
  k: ref__685,
  n: ref__298,
};
let ref__688 = {
  // Shape.ground.light.secondary.common.default.colors
  l: ref__233,
};
let ref__689 = {
  // Shape.ground.light.secondary.common.hover
  k: ref__688,
  n: ref__511,
  F: ref__665,
};
let ref__690 = {
  // Shape.ground.light.secondary.common.default
  k: ref__688,
  n: ref__511,
  F: ref__661,
};
let ref__691 = [
  // ColorPalette.secondary.main.darkest
  ref__33,
  ref__1,
];
let ref__771 = {
  // Shape.ground.light.secondary.highlighted.hover.colors
  l: ref__320,
};
let ref__692 = {
  // Shape.ground.light.secondary.highlighted.hover
  k: ref__771,
  n: ref__511,
  F: ref__665,
};
let ref__770 = {
  // Shape.ground.light.secondary.highlighted.default.colors
  l: ref__235,
};
let ref__693 = {
  // Shape.ground.light.secondary.highlighted.default
  k: ref__770,
  n: ref__511,
  F: ref__661,
};
let ref__694 = {
  // Shape.ground.light.secondary.common.pressed.colors
  l: ref__260,
};
let ref__695 = {
  // Shape.ground.light.secondary.common.selected.colors
  l: ref__233,
  n: ref__235,
};
let ref__696 = {
  // Shape.ground.light.secondary.distinct.default
  k: ref__688,
  n: ref__511,
};
let ref__697 = {
  // Shape.ground.light.secondary.subdued.default.colors
  l: ref__222,
  n: ref__260,
};
let ref__698 = {
  // Shape.ground.light.secondary.subdued.hover
  k: ref__697,
  n: ref__298,
  F: ref__661,
};
let ref__699 = {
  // Shape.ground.light.secondary.subdued.default
  k: ref__697,
  n: ref__298,
};
let ref__700 = {
  // Shape.ground.light.neutral.common.default.colors
  l: ref__237,
};
let ref__701 = {
  // Shape.ground.light.neutral.common.hover
  k: ref__700,
  n: ref__511,
  F: ref__665,
};
let ref__702 = {
  // Shape.ground.light.neutral.common.default
  k: ref__700,
  n: ref__511,
  F: ref__661,
};
let ref__784 = {
  // Shape.ground.light.neutral.highlighted.hover.colors
  l: ref__40,
};
let ref__703 = {
  // Shape.ground.light.neutral.highlighted.hover
  k: ref__784,
  n: ref__511,
  F: ref__665,
};
let ref__783 = {
  // Shape.ground.light.neutral.highlighted.default.colors
  l: ref__39,
};
let ref__704 = {
  // Shape.ground.light.neutral.highlighted.default
  k: ref__783,
  n: ref__511,
  F: ref__661,
};
let ref__705 = {
  // Shape.ground.light.neutral.common.selected.colors
  l: ref__237,
  n: ref__39,
};
let ref__706 = {
  // Shape.ground.light.neutral.distinct.default
  k: ref__700,
  n: ref__511,
};
let ref__707 = {
  // Shape.ground.light.neutral.subdued.default.colors
  l: ref__222,
  n: ref__45,
};
let ref__708 = {
  // Shape.ground.light.neutral.subdued.hover
  k: ref__707,
  n: ref__298,
  F: ref__661,
};
let ref__709 = {
  // Shape.ground.light.neutral.subdued.default
  k: ref__707,
  n: ref__298,
};
let ref__710 = {
  // Shape.ground.light.positive.common.default.colors
  l: ref__240,
};
let ref__711 = {
  // Shape.ground.light.positive.common.hover
  k: ref__710,
  n: ref__511,
  F: ref__665,
};
let ref__712 = {
  // Shape.ground.light.positive.common.default
  k: ref__710,
  n: ref__511,
  F: ref__661,
};
let ref__797 = {
  // Shape.ground.light.positive.highlighted.hover.colors
  l: ref__343,
};
let ref__713 = {
  // Shape.ground.light.positive.highlighted.hover
  k: ref__797,
  n: ref__511,
  F: ref__665,
};
let ref__796 = {
  // Shape.ground.light.positive.highlighted.default.colors
  l: ref__242,
};
let ref__714 = {
  // Shape.ground.light.positive.highlighted.default
  k: ref__796,
  n: ref__511,
  F: ref__661,
};
let ref__715 = {
  // Shape.ground.light.positive.common.pressed.colors
  l: ref__266,
};
let ref__716 = {
  // Shape.ground.light.positive.common.selected.colors
  l: ref__240,
  n: ref__242,
};
let ref__717 = {
  // Shape.ground.light.positive.distinct.default
  k: ref__710,
  n: ref__511,
};
let ref__718 = {
  // Shape.ground.light.positive.subdued.default.colors
  l: ref__222,
  n: ref__266,
};
let ref__719 = {
  // Shape.ground.light.positive.subdued.hover
  k: ref__718,
  n: ref__298,
  F: ref__661,
};
let ref__720 = {
  // Shape.ground.light.positive.subdued.default
  k: ref__718,
  n: ref__298,
};
let ref__721 = {
  // Shape.ground.light.warning.common.default.colors
  l: ref__244,
};
let ref__722 = {
  // Shape.ground.light.warning.common.hover
  k: ref__721,
  n: ref__511,
  F: ref__665,
};
let ref__723 = {
  // Shape.ground.light.warning.common.default
  k: ref__721,
  n: ref__511,
  F: ref__661,
};
let ref__810 = {
  // Shape.ground.light.warning.highlighted.hover.colors
  l: ref__360,
};
let ref__724 = {
  // Shape.ground.light.warning.highlighted.hover
  k: ref__810,
  n: ref__511,
  F: ref__665,
};
let ref__809 = {
  // Shape.ground.light.warning.highlighted.default.colors
  l: ref__246,
};
let ref__725 = {
  // Shape.ground.light.warning.highlighted.default
  k: ref__809,
  n: ref__511,
  F: ref__661,
};
let ref__726 = {
  // Shape.ground.light.warning.common.pressed.colors
  l: ref__270,
};
let ref__727 = {
  // Shape.ground.light.warning.common.selected.colors
  l: ref__244,
  n: ref__246,
};
let ref__728 = {
  // Shape.ground.light.warning.distinct.default
  k: ref__721,
  n: ref__511,
};
let ref__729 = {
  // Shape.ground.light.warning.subdued.default.colors
  l: ref__222,
  n: ref__270,
};
let ref__730 = {
  // Shape.ground.light.warning.subdued.hover
  k: ref__729,
  n: ref__298,
  F: ref__661,
};
let ref__731 = {
  // Shape.ground.light.warning.subdued.default
  k: ref__729,
  n: ref__298,
};
let ref__732 = {
  // Shape.ground.light.negative.common.default.colors
  l: ref__248,
};
let ref__733 = {
  // Shape.ground.light.negative.common.hover
  k: ref__732,
  n: ref__511,
  F: ref__665,
};
let ref__734 = {
  // Shape.ground.light.negative.common.default
  k: ref__732,
  n: ref__511,
  F: ref__661,
};
let ref__823 = {
  // Shape.ground.light.negative.highlighted.hover.colors
  l: ref__377,
};
let ref__735 = {
  // Shape.ground.light.negative.highlighted.hover
  k: ref__823,
  n: ref__511,
  F: ref__665,
};
let ref__822 = {
  // Shape.ground.light.negative.highlighted.default.colors
  l: ref__250,
};
let ref__736 = {
  // Shape.ground.light.negative.highlighted.default
  k: ref__822,
  n: ref__511,
  F: ref__661,
};
let ref__737 = {
  // Shape.ground.light.negative.common.pressed.colors
  l: ref__274,
};
let ref__738 = {
  // Shape.ground.light.negative.common.selected.colors
  l: ref__248,
  n: ref__250,
};
let ref__739 = {
  // Shape.ground.light.negative.distinct.default
  k: ref__732,
  n: ref__511,
};
let ref__740 = {
  // Shape.ground.light.negative.subdued.default.colors
  l: ref__222,
  n: ref__274,
};
let ref__741 = {
  // Shape.ground.light.negative.subdued.hover
  k: ref__740,
  n: ref__298,
  F: ref__661,
};
let ref__742 = {
  // Shape.ground.light.negative.subdued.default
  k: ref__740,
  n: ref__298,
};
let ref__749 = {
  // Shape.ground.dark.building.common.hover.colors
  l: ref__408,
  n: ref__222,
};
let ref__743 = {
  // Shape.ground.dark.building.common.hover
  k: ref__749,
  n: ref__298,
};
let ref__744 = {
  // Shape.ground.dark.building.common.default.colors
  l: ref__398,
  n: ref__222,
};
let ref__745 = {
  // Shape.ground.dark.building.common.default
  k: ref__744,
  n: ref__298,
};
let ref__746 = {
  // Shape.ground.light.building.distinct.pressed
  k: {
    l: ref__43,
  },
  n: ref__511,
};
let ref__747 = {
  // Shape.ground.dark.building.highlighted.default
  k: ref__659,
  n: ref__511,
};
let ref__834 = {
  // Shape.ground.dark.building.common.pressed.colors
  l: ref__408,
  n: ref__569,
};
let ref__748 = {
  // Shape.ground.dark.building.common.pressed
  k: ref__834,
  n: ref__298,
};
let ref__750 = {
  // Shape.ground.dark.building.distinct.default
  k: {
    l: ref__408,
  },
  n: ref__511,
};
let ref__838 = {
  // Shape.ground.dark.building.subdued.default.colors
  l: ref__398,
  n: ref__397,
};
let ref__751 = {
  // Shape.ground.dark.building.subdued.default
  k: ref__838,
  n: ref__298,
};
let ref__752 = {
  // Shape.ground.dark.building.subdued.hover
  k: {
    l: ref__408,
    n: ref__397,
  },
  n: ref__298,
};
let ref__753 = {
  // Shape.ground.dark.building.common.selected
  k: ref__744,
  n: ref__303,
};
let ref__761 = {
  // Shape.ground.dark.primary.common.hover.colors
  l: ref__422,
  n: ref__258,
};
let ref__754 = {
  // Shape.ground.dark.primary.common.hover
  k: ref__761,
  n: ref__298,
};
let ref__755 = {
  // Shape.ground.dark.primary.common.default.colors
  l: ref__411,
  n: ref__258,
};
let ref__756 = {
  // Shape.ground.dark.primary.common.default
  k: ref__755,
  n: ref__298,
};
let ref__759 = {
  // Shape.ground.dark.primary.highlighted.hover
  k: ref__757,
  n: ref__511,
};
let ref__760 = {
  // Shape.ground.dark.primary.highlighted.default
  k: {
    l: ref__258,
  },
  n: ref__511,
};
let ref__762 = {
  // Shape.ground.dark.primary.distinct.default
  k: {
    l: ref__422,
  },
  n: ref__511,
};
let ref__763 = [
  // Shape.cell.dark.primary.highlighted.hover.colors.background
  ref__26,
  ref__416,
];
let ref__764 = {
  // Shape.ground.dark.primary.subdued.default
  k: {
    l: ref__411,
    n: ref__763,
  },
  n: ref__298,
};
let ref__765 = {
  // Shape.ground.dark.primary.subdued.hover
  k: {
    l: ref__422,
    n: ref__763,
  },
  n: ref__298,
};
let ref__766 = {
  // Shape.ground.dark.primary.common.selected
  k: ref__755,
  n: ref__303,
};
let ref__774 = {
  // Shape.ground.dark.secondary.common.hover.colors
  l: ref__434,
  n: ref__262,
};
let ref__767 = {
  // Shape.ground.dark.secondary.common.hover
  k: ref__774,
  n: ref__298,
};
let ref__768 = {
  // Shape.ground.dark.secondary.common.default.colors
  l: ref__425,
  n: ref__262,
};
let ref__769 = {
  // Shape.ground.dark.secondary.common.default
  k: ref__768,
  n: ref__298,
};
let ref__772 = {
  // Shape.ground.dark.secondary.highlighted.hover
  k: ref__770,
  n: ref__511,
};
let ref__773 = {
  // Shape.ground.dark.secondary.highlighted.default
  k: {
    l: ref__262,
  },
  n: ref__511,
};
let ref__775 = {
  // Shape.ground.dark.secondary.distinct.default
  k: {
    l: ref__434,
  },
  n: ref__511,
};
let ref__776 = [
  // Shape.cell.dark.secondary.highlighted.hover.colors.background
  ref__34,
  ref__416,
];
let ref__777 = {
  // Shape.ground.dark.secondary.subdued.default
  k: {
    l: ref__425,
    n: ref__776,
  },
  n: ref__298,
};
let ref__778 = {
  // Shape.ground.dark.secondary.subdued.hover
  k: {
    l: ref__434,
    n: ref__776,
  },
  n: ref__298,
};
let ref__779 = {
  // Shape.ground.dark.secondary.common.selected
  k: ref__768,
  n: ref__303,
};
let ref__787 = {
  // Shape.ground.dark.neutral.common.hover.colors
  l: ref__437,
  n: ref__42,
};
let ref__780 = {
  // Shape.ground.dark.neutral.common.hover
  k: ref__787,
  n: ref__298,
};
let ref__789 = [
  // Shape.ground.dark.neutral.common.default.colors.background
  ref__22,
  ref__214,
];
let ref__781 = {
  // Shape.ground.dark.neutral.common.default.colors
  l: ref__789,
  n: ref__42,
};
let ref__782 = {
  // Shape.ground.dark.neutral.common.default
  k: ref__781,
  n: ref__298,
};
let ref__785 = {
  // Shape.ground.dark.neutral.highlighted.hover
  k: ref__783,
  n: ref__511,
};
let ref__786 = {
  // Shape.ground.dark.neutral.highlighted.default
  k: {
    l: ref__42,
  },
  n: ref__511,
};
let ref__788 = {
  // Shape.ground.dark.neutral.distinct.default
  k: {
    l: ref__437,
  },
  n: ref__511,
};
let ref__790 = {
  // Shape.ground.dark.neutral.subdued.default
  k: {
    l: ref__789,
    n: ref__442,
  },
  n: ref__298,
};
let ref__791 = {
  // Shape.ground.dark.neutral.subdued.hover
  k: {
    l: ref__437,
    n: ref__442,
  },
  n: ref__298,
};
let ref__792 = {
  // Shape.ground.dark.neutral.common.selected
  k: ref__781,
  n: ref__303,
};
let ref__800 = {
  // Shape.ground.dark.positive.common.hover.colors
  l: ref__450,
  n: ref__268,
};
let ref__793 = {
  // Shape.ground.dark.positive.common.hover
  k: ref__800,
  n: ref__298,
};
let ref__802 = [
  // Shape.ground.dark.positive.common.default.colors.background
  ref__50,
  ref__214,
];
let ref__794 = {
  // Shape.ground.dark.positive.common.default.colors
  l: ref__802,
  n: ref__268,
};
let ref__795 = {
  // Shape.ground.dark.positive.common.default
  k: ref__794,
  n: ref__298,
};
let ref__798 = {
  // Shape.ground.dark.positive.highlighted.hover
  k: ref__796,
  n: ref__511,
};
let ref__799 = {
  // Shape.ground.dark.positive.highlighted.default
  k: {
    l: ref__268,
  },
  n: ref__511,
};
let ref__801 = {
  // Shape.ground.dark.positive.distinct.default
  k: {
    l: ref__450,
  },
  n: ref__511,
};
let ref__803 = {
  // Shape.ground.dark.positive.subdued.default
  k: {
    l: ref__802,
    n: ref__454,
  },
  n: ref__298,
};
let ref__804 = {
  // Shape.ground.dark.positive.subdued.hover
  k: {
    l: ref__450,
    n: ref__454,
  },
  n: ref__298,
};
let ref__805 = {
  // Shape.ground.dark.positive.common.selected
  k: ref__794,
  n: ref__303,
};
let ref__813 = {
  // Shape.ground.dark.warning.common.hover.colors
  l: ref__462,
  n: ref__272,
};
let ref__806 = {
  // Shape.ground.dark.warning.common.hover
  k: ref__813,
  n: ref__298,
};
let ref__815 = [
  // Shape.ground.dark.warning.common.default.colors.background
  ref__58,
  ref__214,
];
let ref__807 = {
  // Shape.ground.dark.warning.common.default.colors
  l: ref__815,
  n: ref__272,
};
let ref__808 = {
  // Shape.ground.dark.warning.common.default
  k: ref__807,
  n: ref__298,
};
let ref__811 = {
  // Shape.ground.dark.warning.highlighted.hover
  k: ref__809,
  n: ref__511,
};
let ref__812 = {
  // Shape.ground.dark.warning.highlighted.default
  k: {
    l: ref__272,
  },
  n: ref__511,
};
let ref__814 = {
  // Shape.ground.dark.warning.distinct.default
  k: {
    l: ref__462,
  },
  n: ref__511,
};
let ref__816 = {
  // Shape.ground.dark.warning.subdued.default
  k: {
    l: ref__815,
    n: ref__466,
  },
  n: ref__298,
};
let ref__817 = {
  // Shape.ground.dark.warning.subdued.hover
  k: {
    l: ref__462,
    n: ref__466,
  },
  n: ref__298,
};
let ref__818 = {
  // Shape.ground.dark.warning.common.selected
  k: ref__807,
  n: ref__303,
};
let ref__826 = {
  // Shape.ground.dark.negative.common.hover.colors
  l: ref__474,
  n: ref__276,
};
let ref__819 = {
  // Shape.ground.dark.negative.common.hover
  k: ref__826,
  n: ref__298,
};
let ref__828 = [
  // Shape.ground.dark.negative.common.default.colors.background
  ref__66,
  ref__214,
];
let ref__820 = {
  // Shape.ground.dark.negative.common.default.colors
  l: ref__828,
  n: ref__276,
};
let ref__821 = {
  // Shape.ground.dark.negative.common.default
  k: ref__820,
  n: ref__298,
};
let ref__824 = {
  // Shape.ground.dark.negative.highlighted.hover
  k: ref__822,
  n: ref__511,
};
let ref__825 = {
  // Shape.ground.dark.negative.highlighted.default
  k: {
    l: ref__276,
  },
  n: ref__511,
};
let ref__827 = {
  // Shape.ground.dark.negative.distinct.default
  k: {
    l: ref__474,
  },
  n: ref__511,
};
let ref__829 = {
  // Shape.ground.dark.negative.subdued.default
  k: {
    l: ref__828,
    n: ref__478,
  },
  n: ref__298,
};
let ref__830 = {
  // Shape.ground.dark.negative.subdued.hover
  k: {
    l: ref__474,
    n: ref__478,
  },
  n: ref__298,
};
let ref__831 = {
  // Shape.ground.dark.negative.common.selected
  k: ref__820,
  n: ref__303,
};
let ref__832 = {
  // Shape.ground.subdued.primary.common.hover
  k: ref__749,
  n: ref__298,
  F: ref__661,
};
let ref__833 = {
  // Shape.ground.light.primary.common.pressed
  k: ref__682,
  n: ref__511,
  F: ref__661,
};
let ref__835 = {
  // Shape.ground.dark.building.distinct.pressed
  k: {
    l: ref__630,
    n: ref__397,
  },
  n: ref__298,
};
let ref__836 = {
  // Shape.ground.subdued.primary.distinct.hover
  k: ref__834,
  n: ref__298,
  F: ref__661,
};
let ref__837 = {
  // Shape.ground.dark.building.distinct.selected
  k: ref__749,
  n: ref__303,
};
let ref__839 = {
  // Shape.ground.subdued.primary.subdued.hover
  k: ref__838,
  n: ref__298,
  F: ref__661,
};
let ref__1299 = {
  // Shape.ground.subdued.primary.common.default
  k: {
    n: ref__398,
  },
  n: ref__298,
};
let ref__840 = {
  // Shape.ground.subdued.primary.common
  b: ref__1299,
  o: ref__832,
  p: ref__748,
  q: ref__832,
  r: ref__753,
  s: ref__232,
  t: ref__232,
  c: ref__745,
};
let ref__841 = {
  // Shape.ground.light.secondary.common.pressed
  k: ref__694,
  n: ref__511,
  F: ref__661,
};
let ref__842 = {
  // Shape.ground.subdued.primary.distinct
  b: ref__750,
  o: ref__836,
  p: ref__835,
  q: ref__836,
  r: ref__837,
  s: ref__232,
  t: ref__232,
  c: ref__750,
};
let ref__1305 = {
  // Shape.ground.subdued.primary.subdued.print
  k: {
    l: ref__397,
  },
  n: ref__298,
};
let ref__843 = {
  // Shape.ground.subdued.primary.subdued
  b: ref__751,
  o: ref__839,
  p: ref__752,
  q: ref__839,
  r: ref__753,
  s: ref__232,
  t: ref__232,
  c: ref__1305,
};
let ref__844 = {
  // Shape.ground.light.positive.common.pressed
  k: ref__715,
  n: ref__511,
  F: ref__661,
};
let ref__845 = {
  // Shape.ground.light.warning.common.pressed
  k: ref__726,
  n: ref__511,
  F: ref__661,
};
let ref__846 = {
  // Shape.ground.light.negative.common.pressed
  k: ref__737,
  n: ref__511,
  F: ref__661,
};
let ref__1302 = {
  // Shape.ground.subdued.primary.highlighted.selected.colors
  l: ref__256,
  n: ref__222,
};
let ref__1308 = {
  // Shape.ground.subdued.secondary.highlighted.selected.colors
  l: ref__260,
  n: ref__222,
};
let ref__1311 = {
  // Shape.ground.subdued.neutral.highlighted.selected.colors
  l: ref__45,
  n: ref__222,
};
let ref__1313 = {
  // Shape.ground.subdued.positive.highlighted.selected.colors
  l: ref__266,
  n: ref__222,
};
let ref__1315 = {
  // Shape.ground.subdued.warning.highlighted.selected.colors
  l: ref__270,
  n: ref__222,
};
let ref__1317 = {
  // Shape.ground.subdued.negative.highlighted.selected.colors
  l: ref__274,
  n: ref__222,
};
let ref__847 = {
  // Shape.ground.subdued
  u: {
    d: ref__840,
    e: {
      b: ref__663,
      o: ref__677,
      p: ref__833,
      q: ref__677,
      r: {
        k: ref__1302,
        n: ref__303,
        F: ref__661,
      },
      s: ref__232,
      t: ref__232,
      c: ref__663,
    },
    f: ref__842,
    g: ref__843,
  },
  v: {
    d: ref__840,
    e: {
      b: ref__663,
      o: ref__689,
      p: ref__841,
      q: ref__689,
      r: {
        k: ref__1308,
        n: ref__303,
        F: ref__661,
      },
      s: ref__232,
      t: ref__232,
      c: ref__663,
    },
    f: ref__842,
    g: ref__843,
  },
  w: {
    d: ref__840,
    e: {
      b: ref__663,
      o: ref__701,
      p: ref__670,
      q: ref__701,
      r: {
        k: ref__1311,
        n: ref__303,
        F: ref__661,
      },
      s: ref__232,
      t: ref__232,
      c: ref__663,
    },
    f: ref__842,
    g: ref__843,
  },
  x: {
    d: ref__840,
    e: {
      b: ref__663,
      o: ref__711,
      p: ref__844,
      q: ref__711,
      r: {
        k: ref__1313,
        n: ref__303,
        F: ref__661,
      },
      s: ref__232,
      t: ref__232,
      c: ref__663,
    },
    f: ref__842,
    g: ref__843,
  },
  y: {
    d: ref__840,
    e: {
      b: ref__663,
      o: ref__722,
      p: ref__845,
      q: ref__722,
      r: {
        k: ref__1315,
        n: ref__303,
        F: ref__661,
      },
      s: ref__232,
      t: ref__232,
      c: ref__663,
    },
    f: ref__842,
    g: ref__843,
  },
  z: {
    d: ref__840,
    e: {
      b: ref__663,
      o: ref__733,
      p: ref__846,
      q: ref__733,
      r: {
        k: ref__1317,
        n: ref__303,
        F: ref__661,
      },
      s: ref__232,
      t: ref__232,
      c: ref__663,
    },
    f: ref__842,
    g: ref__843,
  },
};
let ref__850 = [
  // Shape.ground.soft.primary.common.default.colors.background
  ref__28,
  ref__214,
];
let ref__848 = {
  // Shape.ground.soft.primary.common.default.colors
  l: ref__850,
};
let ref__849 = {
  // Shape.ground.soft.primary.common.hover
  k: ref__848,
  n: ref__511,
  F: ref__665,
};
let ref__851 = {
  // Shape.ground.soft.primary.common.default
  k: ref__848,
  n: ref__511,
  F: ref__661,
};
let ref__1240 = {
  // Shape.ground.light.primary.highlighted.pressed.colors
  l: ref__679,
};
let ref__1242 = {
  // Shape.ground.light.primary.highlighted.selected.colors
  l: ref__230,
  n: ref__222,
};
let ref__852 = {
  // Shape.ground.light.primary.highlighted
  b: ref__681,
  o: ref__680,
  p: {
    k: ref__1240,
    n: ref__511,
    F: ref__661,
  },
  q: ref__680,
  r: {
    k: ref__1242,
    n: ref__303,
    F: ref__661,
  },
  s: ref__232,
  t: ref__232,
  c: ref__681,
};
let ref__853 = {
  // Shape.ground.light.primary.distinct.pressed
  k: ref__682,
  n: ref__511,
};
let ref__854 = {
  // Shape.ground.soft.primary.subdued.default.colors
  l: ref__398,
  n: ref__256,
};
let ref__855 = {
  // Shape.ground.soft.primary.subdued.hover
  k: ref__854,
  n: ref__298,
  F: ref__661,
};
let ref__856 = {
  // Shape.ground.soft.primary.subdued.default
  k: ref__854,
  n: ref__298,
};
let ref__859 = [
  // Shape.ground.soft.secondary.common.default.colors.background
  ref__36,
  ref__214,
];
let ref__857 = {
  // Shape.ground.soft.secondary.common.default.colors
  l: ref__859,
};
let ref__858 = {
  // Shape.ground.soft.secondary.common.hover
  k: ref__857,
  n: ref__511,
  F: ref__665,
};
let ref__860 = {
  // Shape.ground.soft.secondary.common.default
  k: ref__857,
  n: ref__511,
  F: ref__661,
};
let ref__1250 = {
  // Shape.ground.light.secondary.highlighted.pressed.colors
  l: ref__691,
};
let ref__1252 = {
  // Shape.ground.light.secondary.highlighted.selected.colors
  l: ref__235,
  n: ref__222,
};
let ref__861 = {
  // Shape.ground.light.secondary.highlighted
  b: ref__693,
  o: ref__692,
  p: {
    k: ref__1250,
    n: ref__511,
    F: ref__661,
  },
  q: ref__692,
  r: {
    k: ref__1252,
    n: ref__303,
    F: ref__661,
  },
  s: ref__232,
  t: ref__232,
  c: ref__693,
};
let ref__862 = {
  // Shape.ground.light.secondary.distinct.pressed
  k: ref__694,
  n: ref__511,
};
let ref__863 = {
  // Shape.ground.soft.secondary.subdued.default.colors
  l: ref__398,
  n: ref__260,
};
let ref__864 = {
  // Shape.ground.soft.secondary.subdued.hover
  k: ref__863,
  n: ref__298,
  F: ref__661,
};
let ref__865 = {
  // Shape.ground.soft.secondary.subdued.default
  k: ref__863,
  n: ref__298,
};
let ref__868 = [
  // Shape.ground.soft.neutral.common.default.colors.background
  ref__44,
  ref__214,
];
let ref__866 = {
  // Shape.ground.soft.neutral.common.default.colors
  l: ref__868,
};
let ref__867 = {
  // Shape.ground.soft.neutral.common.hover
  k: ref__866,
  n: ref__511,
  F: ref__665,
};
let ref__869 = {
  // Shape.ground.soft.neutral.common.default
  k: ref__866,
  n: ref__511,
  F: ref__661,
};
let ref__1260 = {
  // Shape.ground.light.neutral.highlighted.pressed.colors
  l: ref__41,
};
let ref__1262 = {
  // Shape.ground.light.neutral.highlighted.selected.colors
  l: ref__39,
  n: ref__222,
};
let ref__870 = {
  // Shape.ground.light.neutral.highlighted
  b: ref__704,
  o: ref__703,
  p: {
    k: ref__1260,
    n: ref__511,
    F: ref__661,
  },
  q: ref__703,
  r: {
    k: ref__1262,
    n: ref__303,
    F: ref__661,
  },
  s: ref__232,
  t: ref__232,
  c: ref__704,
};
let ref__871 = {
  // Shape.ground.soft.neutral.subdued.default.colors
  l: ref__398,
  n: ref__45,
};
let ref__872 = {
  // Shape.ground.soft.neutral.subdued.hover
  k: ref__871,
  n: ref__298,
  F: ref__661,
};
let ref__873 = {
  // Shape.ground.soft.neutral.subdued.default
  k: ref__871,
  n: ref__298,
};
let ref__876 = [
  // Shape.ground.soft.positive.common.default.colors.background
  ref__52,
  ref__214,
];
let ref__874 = {
  // Shape.ground.soft.positive.common.default.colors
  l: ref__876,
};
let ref__875 = {
  // Shape.ground.soft.positive.common.hover
  k: ref__874,
  n: ref__511,
  F: ref__665,
};
let ref__877 = {
  // Shape.ground.soft.positive.common.default
  k: ref__874,
  n: ref__511,
  F: ref__661,
};
let ref__1270 = {
  // Shape.ground.light.positive.highlighted.pressed.colors
  l: ref__344,
};
let ref__1272 = {
  // Shape.ground.light.positive.highlighted.selected.colors
  l: ref__242,
  n: ref__222,
};
let ref__878 = {
  // Shape.ground.light.positive.highlighted
  b: ref__714,
  o: ref__713,
  p: {
    k: ref__1270,
    n: ref__511,
    F: ref__661,
  },
  q: ref__713,
  r: {
    k: ref__1272,
    n: ref__303,
    F: ref__661,
  },
  s: ref__232,
  t: ref__232,
  c: ref__714,
};
let ref__879 = {
  // Shape.ground.light.positive.distinct.pressed
  k: ref__715,
  n: ref__511,
};
let ref__880 = {
  // Shape.ground.soft.positive.subdued.default.colors
  l: ref__398,
  n: ref__266,
};
let ref__881 = {
  // Shape.ground.soft.positive.subdued.hover
  k: ref__880,
  n: ref__298,
  F: ref__661,
};
let ref__882 = {
  // Shape.ground.soft.positive.subdued.default
  k: ref__880,
  n: ref__298,
};
let ref__885 = [
  // Shape.ground.soft.warning.common.default.colors.background
  ref__60,
  ref__214,
];
let ref__883 = {
  // Shape.ground.soft.warning.common.default.colors
  l: ref__885,
};
let ref__884 = {
  // Shape.ground.soft.warning.common.hover
  k: ref__883,
  n: ref__511,
  F: ref__665,
};
let ref__886 = {
  // Shape.ground.soft.warning.common.default
  k: ref__883,
  n: ref__511,
  F: ref__661,
};
let ref__1280 = {
  // Shape.ground.light.warning.highlighted.pressed.colors
  l: ref__361,
};
let ref__1282 = {
  // Shape.ground.light.warning.highlighted.selected.colors
  l: ref__246,
  n: ref__222,
};
let ref__887 = {
  // Shape.ground.light.warning.highlighted
  b: ref__725,
  o: ref__724,
  p: {
    k: ref__1280,
    n: ref__511,
    F: ref__661,
  },
  q: ref__724,
  r: {
    k: ref__1282,
    n: ref__303,
    F: ref__661,
  },
  s: ref__232,
  t: ref__232,
  c: ref__725,
};
let ref__888 = {
  // Shape.ground.light.warning.distinct.pressed
  k: ref__726,
  n: ref__511,
};
let ref__889 = {
  // Shape.ground.soft.warning.subdued.default.colors
  l: ref__398,
  n: ref__270,
};
let ref__890 = {
  // Shape.ground.soft.warning.subdued.hover
  k: ref__889,
  n: ref__298,
  F: ref__661,
};
let ref__891 = {
  // Shape.ground.soft.warning.subdued.default
  k: ref__889,
  n: ref__298,
};
let ref__894 = [
  // Shape.ground.soft.negative.common.default.colors.background
  ref__68,
  ref__214,
];
let ref__892 = {
  // Shape.ground.soft.negative.common.default.colors
  l: ref__894,
};
let ref__893 = {
  // Shape.ground.soft.negative.common.hover
  k: ref__892,
  n: ref__511,
  F: ref__665,
};
let ref__895 = {
  // Shape.ground.soft.negative.common.default
  k: ref__892,
  n: ref__511,
  F: ref__661,
};
let ref__1290 = {
  // Shape.ground.light.negative.highlighted.pressed.colors
  l: ref__378,
};
let ref__1292 = {
  // Shape.ground.light.negative.highlighted.selected.colors
  l: ref__250,
  n: ref__222,
};
let ref__896 = {
  // Shape.ground.light.negative.highlighted
  b: ref__736,
  o: ref__735,
  p: {
    k: ref__1290,
    n: ref__511,
    F: ref__661,
  },
  q: ref__735,
  r: {
    k: ref__1292,
    n: ref__303,
    F: ref__661,
  },
  s: ref__232,
  t: ref__232,
  c: ref__736,
};
let ref__897 = {
  // Shape.ground.light.negative.distinct.pressed
  k: ref__737,
  n: ref__511,
};
let ref__898 = {
  // Shape.ground.soft.negative.subdued.default.colors
  l: ref__398,
  n: ref__274,
};
let ref__899 = {
  // Shape.ground.soft.negative.subdued.hover
  k: ref__898,
  n: ref__298,
  F: ref__661,
};
let ref__900 = {
  // Shape.ground.soft.negative.subdued.default
  k: ref__898,
  n: ref__298,
};
let ref__901 = {
  // Shape.input.light.primary.common.default
  k: {
    l: ref__222,
    m: ref__297,
    n: ref__42,
  },
  n: ref__298,
};
let ref__903 = {
  // Shape.input.light.primary.common.pressed
  k: ref__902,
  n: ref__298,
};
let ref__904 = {
  // Shape.input.light.primary.common.disabled
  k: {
    l: ref__520,
    m: ref__305,
    n: ref__522,
  },
  n: ref__298,
};
let ref__1024 = [
  // Shape.input.light.primary.highlighted.disabled.colors.border
  ref__20,
  ref__216,
];
let ref__905 = {
  // Shape.input.light.primary.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__305,
    n: ref__1024,
  },
  n: ref__303,
};
let ref__906 = {
  // Shape.input.light.primary.distinct.default
  k: {
    l: ref__45,
    m: ref__297,
  },
  n: ref__511,
};
let ref__907 = {
  // Shape.input.light.primary.distinct.pressed
  k: {
    l: ref__228,
    m: ref__297,
  },
  n: ref__511,
};
let ref__908 = {
  // Shape.input.light.primary.distinct.disabled
  k: {
    l: ref__528,
    m: ref__305,
  },
  n: ref__511,
};
let ref__909 = {
  // Shape.input.light.primary.subdued.default
  k: {
    l: ref__398,
    m: ref__297,
  },
  n: ref__511,
};
let ref__912 = {
  // Shape.input.light.secondary.common.pressed
  k: ref__911,
  n: ref__298,
};
let ref__913 = {
  // Shape.input.light.secondary.distinct.pressed
  k: {
    l: ref__233,
    m: ref__297,
  },
  n: ref__511,
};
let ref__914 = {
  // Shape.input.light.primary.subdued.disabled
  k: {
    l: ref__398,
    m: ref__305,
  },
  n: ref__511,
};
let ref__915 = {
  // Shape.input.light.primary.subdued.readOnly
  k: {
    l: ref__910,
    m: ref__305,
  },
  n: ref__511,
};
let ref__918 = {
  // Shape.input.light.neutral.common.pressed.colors
  l: ref__237,
  m: ref__335,
  n: ref__40,
};
let ref__916 = {
  // Shape.input.light.neutral.common.pressed
  k: ref__918,
  n: ref__298,
};
let ref__917 = {
  // Shape.input.light.neutral.highlighted.default
  k: {
    l: ref__222,
    m: ref__335,
    n: ref__39,
  },
  n: ref__303,
};
let ref__920 = {
  // Shape.input.light.neutral.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__337,
    n: ref__919,
  },
  n: ref__303,
};
let ref__921 = {
  // Shape.input.light.neutral.distinct.pressed
  k: {
    l: ref__45,
    m: ref__335,
  },
  n: ref__511,
};
let ref__924 = {
  // Shape.input.light.positive.common.pressed.colors
  l: ref__240,
  m: ref__351,
  n: ref__343,
};
let ref__922 = {
  // Shape.input.light.positive.common.pressed
  k: ref__924,
  n: ref__298,
};
let ref__923 = {
  // Shape.input.light.positive.highlighted.default
  k: {
    l: ref__222,
    m: ref__351,
    n: ref__242,
  },
  n: ref__303,
};
let ref__926 = {
  // Shape.input.light.positive.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__354,
    n: ref__925,
  },
  n: ref__303,
};
let ref__927 = {
  // Shape.input.light.positive.distinct.pressed
  k: {
    l: ref__266,
    m: ref__351,
  },
  n: ref__511,
};
let ref__930 = {
  // Shape.input.light.warning.common.pressed.colors
  l: ref__244,
  m: ref__368,
  n: ref__360,
};
let ref__928 = {
  // Shape.input.light.warning.common.pressed
  k: ref__930,
  n: ref__298,
};
let ref__929 = {
  // Shape.input.light.warning.highlighted.default
  k: {
    l: ref__222,
    m: ref__368,
    n: ref__246,
  },
  n: ref__303,
};
let ref__932 = {
  // Shape.input.light.warning.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__371,
    n: ref__931,
  },
  n: ref__303,
};
let ref__933 = {
  // Shape.input.light.warning.distinct.pressed
  k: {
    l: ref__270,
    m: ref__368,
  },
  n: ref__511,
};
let ref__936 = {
  // Shape.input.light.negative.common.pressed.colors
  l: ref__248,
  m: ref__385,
  n: ref__377,
};
let ref__934 = {
  // Shape.input.light.negative.common.pressed
  k: ref__936,
  n: ref__298,
};
let ref__935 = {
  // Shape.input.light.negative.highlighted.default
  k: {
    l: ref__222,
    m: ref__385,
    n: ref__250,
  },
  n: ref__303,
};
let ref__938 = {
  // Shape.input.light.negative.highlighted.disabled
  k: {
    l: ref__520,
    m: ref__388,
    n: ref__937,
  },
  n: ref__303,
};
let ref__939 = {
  // Shape.input.light.negative.distinct.pressed
  k: {
    l: ref__274,
    m: ref__385,
  },
  n: ref__511,
};
let ref__941 = {
  // Shape.input.dark.primary.common.pressed
  k: ref__940,
  n: ref__298,
};
let ref__943 = {
  // Shape.input.dark.primary.common.disabled
  k: {
    l: ref__398,
    m: ref__404,
    n: ref__942,
  },
  n: ref__298,
};
let ref__944 = {
  // Shape.input.dark.primary.highlighted.pressed
  k: {
    l: ref__417,
    m: ref__396,
    n: ref__311,
  },
  n: ref__303,
};
let ref__945 = {
  // Shape.input.dark.primary.highlighted.disabled
  k: {
    l: ref__398,
    m: ref__404,
    n: ref__520,
  },
  n: ref__303,
};
let ref__946 = {
  // Shape.input.dark.primary.distinct.pressed
  k: {
    l: ref__417,
    m: ref__396,
  },
  n: ref__511,
};
let ref__948 = {
  // Shape.input.dark.secondary.common.pressed
  k: ref__947,
  n: ref__298,
};
let ref__949 = {
  // Shape.input.dark.secondary.highlighted.pressed
  k: {
    l: ref__429,
    m: ref__396,
    n: ref__320,
  },
  n: ref__303,
};
let ref__950 = {
  // Shape.input.dark.secondary.distinct.pressed
  k: {
    l: ref__429,
    m: ref__396,
  },
  n: ref__511,
};
let ref__951 = {
  // Shape.input.dark.primary.distinct.print
  k: {
    l: [ref__15, ref__575],
    m: ref__396,
  },
  n: ref__511,
};
let ref__953 = {
  // Shape.input.dark.neutral.common.pressed
  k: ref__952,
  n: ref__298,
};
let ref__957 = {
  // Shape.input.dark.neutral.common.disabled.colors
  l: ref__398,
  m: ref__404,
  n: ref__919,
};
let ref__954 = {
  // Shape.input.dark.neutral.common.disabled
  k: ref__957,
  n: ref__298,
};
let ref__956 = {
  // Shape.input.dark.neutral.highlighted.default
  k: ref__955,
  n: ref__303,
};
let ref__958 = {
  // Shape.input.dark.neutral.highlighted.disabled
  k: ref__957,
  n: ref__303,
};
let ref__959 = {
  // Shape.input.dark.neutral.distinct.pressed
  k: {
    l: ref__442,
    m: ref__396,
  },
  n: ref__511,
};
let ref__961 = {
  // Shape.input.dark.positive.common.pressed
  k: ref__960,
  n: ref__298,
};
let ref__965 = {
  // Shape.input.dark.positive.common.disabled.colors
  l: ref__398,
  m: ref__404,
  n: ref__925,
};
let ref__962 = {
  // Shape.input.dark.positive.common.disabled
  k: ref__965,
  n: ref__298,
};
let ref__964 = {
  // Shape.input.dark.positive.highlighted.default
  k: ref__963,
  n: ref__303,
};
let ref__966 = {
  // Shape.input.dark.positive.highlighted.disabled
  k: ref__965,
  n: ref__303,
};
let ref__967 = {
  // Shape.input.dark.positive.distinct.pressed
  k: {
    l: ref__454,
    m: ref__396,
  },
  n: ref__511,
};
let ref__969 = {
  // Shape.input.dark.warning.common.pressed
  k: ref__968,
  n: ref__298,
};
let ref__973 = {
  // Shape.input.dark.warning.common.disabled.colors
  l: ref__398,
  m: ref__404,
  n: ref__931,
};
let ref__970 = {
  // Shape.input.dark.warning.common.disabled
  k: ref__973,
  n: ref__298,
};
let ref__972 = {
  // Shape.input.dark.warning.highlighted.default
  k: ref__971,
  n: ref__303,
};
let ref__974 = {
  // Shape.input.dark.warning.highlighted.disabled
  k: ref__973,
  n: ref__303,
};
let ref__975 = {
  // Shape.input.dark.warning.distinct.pressed
  k: {
    l: ref__466,
    m: ref__396,
  },
  n: ref__511,
};
let ref__977 = {
  // Shape.input.dark.negative.common.pressed
  k: ref__976,
  n: ref__298,
};
let ref__981 = {
  // Shape.input.dark.negative.common.disabled.colors
  l: ref__398,
  m: ref__404,
  n: ref__937,
};
let ref__978 = {
  // Shape.input.dark.negative.common.disabled
  k: ref__981,
  n: ref__298,
};
let ref__980 = {
  // Shape.input.dark.negative.highlighted.default
  k: ref__979,
  n: ref__303,
};
let ref__982 = {
  // Shape.input.dark.negative.highlighted.disabled
  k: ref__981,
  n: ref__303,
};
let ref__983 = {
  // Shape.input.dark.negative.distinct.pressed
  k: {
    l: ref__478,
    m: ref__396,
  },
  n: ref__511,
};
let ref__984 = {
  // Shape.input.dark.primary
  d: {
    b: ref__571,
    o: ref__571,
    p: ref__941,
    q: ref__941,
    r: ref__232,
    s: ref__943,
    t: ref__943,
    c: ref__571,
  },
  e: {
    b: ref__399,
    o: ref__399,
    p: ref__944,
    q: ref__944,
    r: ref__232,
    s: ref__945,
    t: ref__945,
    c: ref__399,
  },
  f: {
    b: ref__576,
    o: ref__576,
    p: ref__946,
    q: ref__946,
    r: ref__232,
    s: ref__584,
    t: ref__584,
    c: ref__951,
  },
  g: {
    b: ref__577,
    o: ref__577,
    p: ref__946,
    q: ref__946,
    r: ref__232,
    s: ref__578,
    t: ref__618,
    c: ref__577,
  },
};
let ref__985 = {
  // Shape.input.dark.secondary.common
  b: ref__571,
  o: ref__571,
  p: ref__948,
  q: ref__948,
  r: ref__232,
  s: ref__943,
  t: ref__943,
  c: ref__571,
};
let ref__986 = {
  // Shape.input.dark.secondary.distinct
  b: ref__576,
  o: ref__576,
  p: ref__950,
  q: ref__950,
  r: ref__232,
  s: ref__584,
  t: ref__584,
  c: ref__951,
};
let ref__987 = {
  // Shape.input.dark.secondary.subdued
  b: ref__577,
  o: ref__577,
  p: ref__950,
  q: ref__950,
  r: ref__232,
  s: ref__578,
  t: ref__618,
  c: ref__577,
};
let ref__988 = {
  // Shape.input.dark.neutral
  d: {
    b: ref__585,
    o: ref__585,
    p: ref__953,
    q: ref__953,
    r: ref__232,
    s: ref__954,
    t: ref__954,
    c: ref__585,
  },
  e: {
    b: ref__956,
    o: ref__956,
    p: ref__448,
    q: ref__448,
    r: ref__232,
    s: ref__958,
    t: ref__958,
    c: {
      k: {
        l: ref__520,
        m: ref__396,
        n: ref__39,
      },
      n: ref__303,
    },
  },
  f: {
    b: ref__590,
    o: ref__590,
    p: ref__959,
    q: ref__959,
    r: ref__232,
    s: ref__591,
    t: ref__591,
    c: ref__590,
  },
  g: {
    b: ref__577,
    o: ref__577,
    p: ref__590,
    q: ref__590,
    r: ref__232,
    s: ref__578,
    t: ref__618,
    c: ref__577,
  },
};
let ref__989 = {
  // Shape.input.dark.positive
  d: {
    b: ref__592,
    o: ref__592,
    p: ref__961,
    q: ref__961,
    r: ref__232,
    s: ref__962,
    t: ref__962,
    c: ref__592,
  },
  e: {
    b: ref__964,
    o: ref__964,
    p: ref__460,
    q: ref__460,
    r: ref__232,
    s: ref__966,
    t: ref__966,
    c: {
      k: {
        l: ref__520,
        m: ref__396,
        n: ref__242,
      },
      n: ref__303,
    },
  },
  f: {
    b: ref__597,
    o: ref__597,
    p: ref__967,
    q: ref__967,
    r: ref__232,
    s: ref__598,
    t: ref__598,
    c: ref__597,
  },
  g: {
    b: ref__577,
    o: ref__577,
    p: ref__597,
    q: ref__597,
    r: ref__232,
    s: ref__578,
    t: ref__618,
    c: ref__577,
  },
};
let ref__990 = {
  // Shape.input.dark.warning
  d: {
    b: ref__599,
    o: ref__599,
    p: ref__969,
    q: ref__969,
    r: ref__232,
    s: ref__970,
    t: ref__970,
    c: ref__599,
  },
  e: {
    b: ref__972,
    o: ref__972,
    p: ref__472,
    q: ref__472,
    r: ref__232,
    s: ref__974,
    t: ref__974,
    c: {
      k: {
        l: ref__520,
        m: ref__396,
        n: ref__246,
      },
      n: ref__303,
    },
  },
  f: {
    b: ref__604,
    o: ref__604,
    p: ref__975,
    q: ref__975,
    r: ref__232,
    s: ref__605,
    t: ref__605,
    c: ref__604,
  },
  g: {
    b: ref__577,
    o: ref__577,
    p: ref__604,
    q: ref__604,
    r: ref__232,
    s: ref__578,
    t: ref__618,
    c: ref__577,
  },
};
let ref__991 = {
  // Shape.input.dark.negative
  d: {
    b: ref__606,
    o: ref__606,
    p: ref__977,
    q: ref__977,
    r: ref__232,
    s: ref__978,
    t: ref__978,
    c: ref__606,
  },
  e: {
    b: ref__980,
    o: ref__980,
    p: ref__484,
    q: ref__484,
    r: ref__232,
    s: ref__982,
    t: ref__982,
    c: {
      k: {
        l: ref__520,
        m: ref__396,
        n: ref__250,
      },
      n: ref__303,
    },
  },
  f: {
    b: ref__611,
    o: ref__611,
    p: ref__983,
    q: ref__983,
    r: ref__232,
    s: ref__612,
    t: ref__612,
    c: ref__611,
  },
  g: {
    b: ref__577,
    o: ref__577,
    p: ref__611,
    q: ref__611,
    r: ref__232,
    s: ref__578,
    t: ref__618,
    c: ref__577,
  },
};
let ref__993 = {
  // Shape.input.main.primary.common.pressed.colors
  l: ref__942,
  m: ref__396,
  n: ref__222,
};
let ref__992 = {
  // Shape.input.main.primary.common.pressed
  k: ref__993,
  n: ref__298,
};
let ref__994 = {
  // Shape.input.main.primary.highlighted.pressed
  k: ref__993,
  n: ref__303,
};
let ref__995 = {
  // Shape.input.main.primary.distinct.pressed
  k: {
    l: ref__520,
    m: ref__396,
  },
  n: ref__511,
};
let ref__996 = {
  // Shape.input.main.primary
  d: {
    b: ref__571,
    o: ref__571,
    p: ref__992,
    q: ref__992,
    r: ref__232,
    s: ref__570,
    t: ref__570,
    c: ref__571,
  },
  e: {
    b: ref__399,
    o: ref__399,
    p: ref__994,
    q: ref__994,
    r: ref__232,
    s: ref__945,
    t: ref__945,
    c: ref__399,
  },
  f: {
    b: ref__576,
    o: ref__576,
    p: ref__995,
    q: ref__995,
    r: ref__232,
    s: ref__583,
    t: ref__583,
    c: ref__576,
  },
  g: {
    b: ref__577,
    o: ref__577,
    p: ref__995,
    q: ref__995,
    r: ref__232,
    s: ref__578,
    t: ref__618,
    c: ref__577,
  },
};
let ref__997 = {
  // Shape.input.light.primary.common
  b: ref__901,
  o: ref__901,
  p: ref__903,
  q: ref__903,
  r: ref__232,
  s: ref__904,
  t: ref__904,
  c: ref__901,
};
let ref__998 = {
  // Shape.input.light.primary.highlighted
  b: ref__300,
  o: ref__300,
  p: ref__318,
  q: ref__314,
  r: ref__232,
  s: ref__905,
  t: ref__905,
  c: ref__300,
};
let ref__999 = {
  // Shape.input.soft.primary.distinct.default
  k: {
    l: ref__569,
    m: ref__297,
  },
  n: ref__511,
};
let ref__1000 = {
  // Shape.input.soft.primary.distinct.pressed
  k: {
    l: ref__222,
    m: ref__297,
  },
  n: ref__511,
};
let ref__1001 = {
  // Shape.input.soft.primary.distinct.disabled
  k: {
    l: ref__630,
    m: ref__305,
  },
  n: ref__511,
};
let ref__1002 = {
  // Shape.input.light.secondary.common
  b: ref__901,
  o: ref__901,
  p: ref__912,
  q: ref__912,
  r: ref__232,
  s: ref__904,
  t: ref__904,
  c: ref__901,
};
let ref__1003 = {
  // Shape.input.light.secondary.highlighted
  b: ref__300,
  o: ref__300,
  p: ref__327,
  q: ref__323,
  r: ref__232,
  s: ref__905,
  t: ref__905,
  c: ref__300,
};
let ref__1004 = {
  // Shape.input.soft.primary.distinct
  b: ref__999,
  o: ref__999,
  p: ref__1000,
  q: ref__1000,
  r: ref__232,
  s: ref__1001,
  t: ref__1001,
  c: ref__999,
};
let ref__1005 = {
  // Shape.input.soft.primary.subdued
  b: ref__909,
  o: ref__909,
  p: ref__1000,
  q: ref__1000,
  r: ref__232,
  s: ref__914,
  t: ref__914,
  c: ref__909,
};
let ref__1006 = {
  // Shape.input.light.neutral.common
  b: ref__533,
  o: ref__533,
  p: ref__916,
  q: ref__916,
  r: ref__232,
  s: ref__534,
  t: ref__534,
  c: ref__533,
};
let ref__1007 = {
  // Shape.input.light.neutral.highlighted
  b: ref__917,
  o: ref__917,
  p: {
    k: ref__918,
    n: ref__303,
  },
  q: {
    k: {
      l: ref__45,
      m: ref__335,
      n: ref__40,
    },
    n: ref__303,
  },
  r: ref__232,
  s: ref__920,
  t: ref__920,
  c: ref__917,
};
let ref__1008 = {
  // Shape.input.light.positive.common
  b: ref__542,
  o: ref__542,
  p: ref__922,
  q: ref__922,
  r: ref__232,
  s: ref__543,
  t: ref__543,
  c: ref__542,
};
let ref__1009 = {
  // Shape.input.light.positive.highlighted
  b: ref__923,
  o: ref__923,
  p: {
    k: ref__924,
    n: ref__303,
  },
  q: {
    k: {
      l: ref__266,
      m: ref__351,
      n: ref__343,
    },
    n: ref__303,
  },
  r: ref__232,
  s: ref__926,
  t: ref__926,
  c: ref__923,
};
let ref__1010 = {
  // Shape.input.light.warning.common
  b: ref__551,
  o: ref__551,
  p: ref__928,
  q: ref__928,
  r: ref__232,
  s: ref__552,
  t: ref__552,
  c: ref__551,
};
let ref__1011 = {
  // Shape.input.light.warning.highlighted
  b: ref__929,
  o: ref__929,
  p: {
    k: ref__930,
    n: ref__303,
  },
  q: {
    k: {
      l: ref__270,
      m: ref__368,
      n: ref__360,
    },
    n: ref__303,
  },
  r: ref__232,
  s: ref__932,
  t: ref__932,
  c: ref__929,
};
let ref__1012 = {
  // Shape.input.light.negative.common
  b: ref__560,
  o: ref__560,
  p: ref__934,
  q: ref__934,
  r: ref__232,
  s: ref__561,
  t: ref__561,
  c: ref__560,
};
let ref__1013 = {
  // Shape.input.light.negative.highlighted
  b: ref__935,
  o: ref__935,
  p: {
    k: ref__936,
    n: ref__303,
  },
  q: {
    k: {
      l: ref__274,
      m: ref__385,
      n: ref__377,
    },
    n: ref__303,
  },
  r: ref__232,
  s: ref__938,
  t: ref__938,
  c: ref__935,
};
let ref__1014 = {
  // Shape.interactiveElement.light.primary.common.default
  k: {
    m: ref__311,
    n: ref__311,
  },
  n: ref__298,
};
let ref__1016 = [
  // ColorPalette.primary.main.lightest
  ref__27,
  ref__1,
];
let ref__1017 = {
  // Shape.interactiveElement.light.primary.subdued.default
  k: {
    l: [ref__23, ref__214],
    m: ref__311,
  },
  n: ref__511,
};
let ref__1018 = {
  // Shape.interactiveElement.light.primary.distinct.print
  k: {
    n: ref__311,
    m: ref__311,
  },
  n: ref__298,
};
let ref__1019 = {
  // Shape.interactiveElement.light.secondary.common.default
  k: {
    m: ref__320,
    n: ref__320,
  },
  n: ref__298,
};
let ref__1021 = [
  // ColorPalette.secondary.main.lightest
  ref__35,
  ref__1,
];
let ref__1022 = {
  // Shape.interactiveElement.light.secondary.subdued.default
  k: {
    l: [ref__31, ref__214],
    m: ref__320,
  },
  n: ref__511,
};
let ref__1023 = {
  // Shape.interactiveElement.light.secondary.distinct.print
  k: {
    n: ref__320,
    m: ref__320,
  },
  n: ref__298,
};
let ref__1025 = {
  // Shape.interactiveElement.light.neutral.common.default
  k: {
    m: ref__40,
    n: ref__40,
  },
  n: ref__298,
};
let ref__1026 = {
  // Shape.interactiveElement.light.neutral.subdued.default
  k: {
    l: [ref__21, ref__214],
    m: ref__40,
  },
  n: ref__511,
};
let ref__1027 = {
  // Shape.interactiveElement.light.neutral.distinct.print
  k: {
    n: ref__40,
    m: ref__40,
  },
  n: ref__298,
};
let ref__1028 = {
  // Shape.interactiveElement.light.positive.common.default
  k: {
    m: ref__343,
    n: ref__343,
  },
  n: ref__298,
};
let ref__1029 = {
  // Shape.interactiveElement.light.positive.subdued.default
  k: {
    l: [ref__47, ref__214],
    m: ref__343,
  },
  n: ref__511,
};
let ref__1030 = {
  // Shape.interactiveElement.light.positive.distinct.print
  k: {
    n: ref__343,
    m: ref__343,
  },
  n: ref__298,
};
let ref__1031 = {
  // Shape.interactiveElement.light.warning.common.default
  k: {
    m: ref__360,
    n: ref__360,
  },
  n: ref__298,
};
let ref__1032 = {
  // Shape.interactiveElement.light.warning.subdued.default
  k: {
    l: [ref__55, ref__214],
    m: ref__360,
  },
  n: ref__511,
};
let ref__1033 = {
  // Shape.interactiveElement.light.warning.distinct.print
  k: {
    n: ref__360,
    m: ref__360,
  },
  n: ref__298,
};
let ref__1034 = {
  // Shape.interactiveElement.light.negative.common.default
  k: {
    m: ref__377,
    n: ref__377,
  },
  n: ref__298,
};
let ref__1035 = {
  // Shape.interactiveElement.light.negative.subdued.default
  k: {
    l: [ref__63, ref__214],
    m: ref__377,
  },
  n: ref__511,
};
let ref__1036 = {
  // Shape.interactiveElement.light.negative.distinct.print
  k: {
    n: ref__377,
    m: ref__377,
  },
  n: ref__298,
};
let ref__1038 = {
  // Shape.interactiveElement.dark.primary.common.default
  k: {
    m: ref__258,
    n: ref__258,
  },
  n: ref__298,
};
let ref__1039 = {
  // Shape.interactiveElement.light.primary.highlighted.default
  k: {
    l: ref__230,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1040 = {
  // Shape.interactiveElement.light.primary.highlighted.hover
  k: {
    l: ref__311,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1041 = {
  // Shape.interactiveElement.light.primary.distinct.default
  k: {
    l: ref__256,
    m: ref__311,
  },
  n: ref__511,
};
let ref__1042 = {
  // Shape.interactiveElement.light.primary.distinct.hover
  k: {
    l: ref__313,
    m: ref__679,
  },
  n: ref__511,
};
let ref__1043 = {
  // Shape.interactiveElement.light.primary.distinct.pressed.colors
  l: ref__1016,
  m: ref__679,
};
let ref__1044 = {
  // Shape.interactiveElement.light.primary.distinct.disabled
  k: {
    l: [ref__29, ref__216],
    m: ref__311,
  },
  n: ref__511,
};
let ref__1045 = {
  // Shape.interactiveElement.dark.primary.subdued.default
  k: {
    l: ref__411,
    m: ref__258,
  },
  n: ref__511,
};
let ref__1047 = {
  // Shape.interactiveElement.dark.secondary.common.default
  k: {
    m: ref__262,
    n: ref__262,
  },
  n: ref__298,
};
let ref__1048 = {
  // Shape.interactiveElement.light.secondary.highlighted.default
  k: {
    l: ref__235,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1049 = {
  // Shape.interactiveElement.light.secondary.highlighted.hover
  k: {
    l: ref__320,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1050 = {
  // Shape.interactiveElement.light.secondary.distinct.default
  k: {
    l: ref__260,
    m: ref__320,
  },
  n: ref__511,
};
let ref__1051 = {
  // Shape.interactiveElement.light.secondary.distinct.hover
  k: {
    l: ref__322,
    m: ref__691,
  },
  n: ref__511,
};
let ref__1052 = {
  // Shape.interactiveElement.light.secondary.distinct.pressed.colors
  l: ref__1021,
  m: ref__691,
};
let ref__1053 = {
  // Shape.interactiveElement.light.secondary.distinct.disabled
  k: {
    l: [ref__37, ref__216],
    m: ref__320,
  },
  n: ref__511,
};
let ref__1054 = {
  // Shape.interactiveElement.dark.secondary.subdued.default
  k: {
    l: ref__425,
    m: ref__262,
  },
  n: ref__511,
};
let ref__1055 = {
  // Shape.interactiveElement.dark.neutral.common.default
  k: {
    m: ref__42,
    n: ref__42,
  },
  n: ref__298,
};
let ref__1056 = {
  // Shape.interactiveElement.light.neutral.highlighted.default
  k: {
    l: ref__39,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1057 = {
  // Shape.interactiveElement.light.neutral.highlighted.hover
  k: {
    l: ref__40,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1058 = {
  // Shape.interactiveElement.light.neutral.distinct.default
  k: {
    l: ref__45,
    m: ref__40,
  },
  n: ref__511,
};
let ref__1059 = {
  // Shape.interactiveElement.light.neutral.distinct.hover
  k: {
    l: ref__334,
    m: ref__41,
  },
  n: ref__511,
};
let ref__1060 = {
  // Shape.interactiveElement.light.neutral.distinct.pressed.colors
  l: ref__43,
  m: ref__41,
};
let ref__1061 = {
  // Shape.interactiveElement.light.neutral.distinct.disabled
  k: {
    l: ref__528,
    m: ref__40,
  },
  n: ref__511,
};
let ref__1062 = {
  // Shape.interactiveElement.dark.neutral.subdued.default
  k: {
    l: ref__789,
    m: ref__42,
  },
  n: ref__511,
};
let ref__1064 = {
  // Shape.interactiveElement.dark.positive.common.default
  k: {
    m: ref__268,
    n: ref__268,
  },
  n: ref__298,
};
let ref__1065 = {
  // Shape.interactiveElement.light.positive.highlighted.default
  k: {
    l: ref__242,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1066 = {
  // Shape.interactiveElement.light.positive.highlighted.hover
  k: {
    l: ref__343,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1067 = {
  // Shape.interactiveElement.light.positive.distinct.default
  k: {
    l: ref__266,
    m: ref__343,
  },
  n: ref__511,
};
let ref__1068 = {
  // Shape.interactiveElement.light.positive.distinct.hover
  k: {
    l: ref__350,
    m: ref__344,
  },
  n: ref__511,
};
let ref__1069 = {
  // Shape.interactiveElement.light.positive.distinct.pressed.colors
  l: ref__352,
  m: ref__344,
};
let ref__1070 = {
  // Shape.interactiveElement.light.positive.distinct.disabled
  k: {
    l: [ref__53, ref__216],
    m: ref__343,
  },
  n: ref__511,
};
let ref__1071 = {
  // Shape.interactiveElement.dark.positive.subdued.default
  k: {
    l: ref__802,
    m: ref__268,
  },
  n: ref__511,
};
let ref__1073 = {
  // Shape.interactiveElement.dark.warning.common.default
  k: {
    m: ref__272,
    n: ref__272,
  },
  n: ref__298,
};
let ref__1074 = {
  // Shape.interactiveElement.light.warning.highlighted.default
  k: {
    l: ref__246,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1075 = {
  // Shape.interactiveElement.light.warning.highlighted.hover
  k: {
    l: ref__360,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1076 = {
  // Shape.interactiveElement.light.warning.distinct.default
  k: {
    l: ref__270,
    m: ref__360,
  },
  n: ref__511,
};
let ref__1077 = {
  // Shape.interactiveElement.light.warning.distinct.hover
  k: {
    l: ref__367,
    m: ref__361,
  },
  n: ref__511,
};
let ref__1078 = {
  // Shape.interactiveElement.light.warning.distinct.pressed.colors
  l: ref__369,
  m: ref__361,
};
let ref__1079 = {
  // Shape.interactiveElement.light.warning.distinct.disabled
  k: {
    l: [ref__61, ref__216],
    m: ref__360,
  },
  n: ref__511,
};
let ref__1080 = {
  // Shape.interactiveElement.dark.warning.subdued.default
  k: {
    l: ref__815,
    m: ref__272,
  },
  n: ref__511,
};
let ref__1082 = {
  // Shape.interactiveElement.dark.negative.common.default
  k: {
    m: ref__276,
    n: ref__276,
  },
  n: ref__298,
};
let ref__1083 = {
  // Shape.interactiveElement.light.negative.highlighted.default
  k: {
    l: ref__250,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1084 = {
  // Shape.interactiveElement.light.negative.highlighted.hover
  k: {
    l: ref__377,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1085 = {
  // Shape.interactiveElement.light.negative.distinct.default
  k: {
    l: ref__274,
    m: ref__377,
  },
  n: ref__511,
};
let ref__1086 = {
  // Shape.interactiveElement.light.negative.distinct.hover
  k: {
    l: ref__384,
    m: ref__378,
  },
  n: ref__511,
};
let ref__1087 = {
  // Shape.interactiveElement.light.negative.distinct.pressed.colors
  l: ref__386,
  m: ref__378,
};
let ref__1088 = {
  // Shape.interactiveElement.light.negative.distinct.disabled
  k: {
    l: [ref__69, ref__216],
    m: ref__377,
  },
  n: ref__511,
};
let ref__1089 = {
  // Shape.interactiveElement.dark.negative.subdued.default
  k: {
    l: ref__828,
    m: ref__276,
  },
  n: ref__511,
};
let ref__1090 = {
  // Shape.interactiveElement.subdued.primary.common.default
  k: {
    m: ref__1016,
    n: ref__258,
  },
  n: ref__298,
};
let ref__1091 = {
  // Shape.interactiveElement.dark.primary.highlighted.default
  k: {
    l: ref__258,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1092 = {
  // Shape.interactiveElement.dark.primary.distinct.pressed
  k: ref__1043,
  n: ref__298,
};
let ref__1093 = {
  // Shape.interactiveElement.subdued.primary.subdued.default
  k: {
    l: ref__411,
    m: ref__1016,
  },
  n: ref__511,
};
let ref__1094 = {
  // Shape.interactiveElement.subdued.secondary.common.default
  k: {
    m: ref__1021,
    n: ref__262,
  },
  n: ref__298,
};
let ref__1095 = {
  // Shape.interactiveElement.dark.secondary.highlighted.default
  k: {
    l: ref__262,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1096 = {
  // Shape.interactiveElement.dark.secondary.distinct.pressed
  k: ref__1052,
  n: ref__298,
};
let ref__1097 = {
  // Shape.interactiveElement.subdued.secondary.subdued.default
  k: {
    l: ref__425,
    m: ref__1021,
  },
  n: ref__511,
};
let ref__1098 = {
  // Shape.interactiveElement.subdued.neutral.common.default
  k: {
    m: ref__43,
    n: ref__42,
  },
  n: ref__298,
};
let ref__1099 = {
  // Shape.interactiveElement.dark.neutral.highlighted.default
  k: {
    l: ref__42,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1100 = {
  // Shape.interactiveElement.dark.neutral.distinct.pressed
  k: ref__1060,
  n: ref__298,
};
let ref__1101 = {
  // Shape.interactiveElement.subdued.neutral.subdued.default
  k: {
    l: ref__789,
    m: ref__43,
  },
  n: ref__511,
};
let ref__1102 = {
  // Shape.interactiveElement.subdued.positive.common.default
  k: {
    m: ref__352,
    n: ref__268,
  },
  n: ref__298,
};
let ref__1103 = {
  // Shape.interactiveElement.dark.positive.highlighted.default
  k: {
    l: ref__268,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1104 = {
  // Shape.interactiveElement.dark.positive.distinct.pressed
  k: ref__1069,
  n: ref__298,
};
let ref__1105 = {
  // Shape.interactiveElement.subdued.positive.subdued.default
  k: {
    l: ref__802,
    m: ref__352,
  },
  n: ref__511,
};
let ref__1106 = {
  // Shape.interactiveElement.subdued.warning.common.default
  k: {
    m: ref__369,
    n: ref__272,
  },
  n: ref__298,
};
let ref__1107 = {
  // Shape.interactiveElement.dark.warning.highlighted.default
  k: {
    l: ref__272,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1108 = {
  // Shape.interactiveElement.dark.warning.distinct.pressed
  k: ref__1078,
  n: ref__298,
};
let ref__1109 = {
  // Shape.interactiveElement.subdued.warning.subdued.default
  k: {
    l: ref__815,
    m: ref__369,
  },
  n: ref__511,
};
let ref__1110 = {
  // Shape.interactiveElement.subdued.negative.common.default
  k: {
    m: ref__386,
    n: ref__276,
  },
  n: ref__298,
};
let ref__1111 = {
  // Shape.interactiveElement.dark.negative.highlighted.default
  k: {
    l: ref__276,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1112 = {
  // Shape.interactiveElement.dark.negative.distinct.pressed
  k: ref__1087,
  n: ref__298,
};
let ref__1113 = {
  // Shape.interactiveElement.subdued.negative.subdued.default
  k: {
    l: ref__828,
    m: ref__386,
  },
  n: ref__511,
};
let ref__1114 = {
  // Shape.interactiveElement.main.primary.common.default
  k: {
    m: ref__222,
    n: ref__222,
  },
  n: ref__298,
};
let ref__1115 = {
  // Shape.interactiveElement.light.primary.subdued.hover
  k: {
    l: ref__228,
    m: ref__679,
  },
  n: ref__511,
};
let ref__1116 = {
  // Shape.interactiveElement.light.primary.subdued.pressed
  k: {
    l: ref__256,
    m: ref__679,
  },
  n: ref__511,
};
let ref__1117 = {
  // Shape.interactiveElement.main.primary.subdued.default
  k: {
    l: ref__411,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1118 = {
  // Shape.interactiveElement.main.primary.common.disabled
  k: {
    m: ref__222,
    n: ref__520,
  },
  n: ref__298,
};
let ref__1119 = {
  // Shape.interactiveElement.light.secondary.subdued.hover
  k: {
    l: ref__233,
    m: ref__691,
  },
  n: ref__511,
};
let ref__1120 = {
  // Shape.interactiveElement.light.secondary.subdued.pressed
  k: {
    l: ref__260,
    m: ref__691,
  },
  n: ref__511,
};
let ref__1121 = {
  // Shape.interactiveElement.main.secondary.subdued.default
  k: {
    l: ref__425,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1122 = {
  // Shape.interactiveElement.light.neutral.subdued.hover
  k: {
    l: ref__237,
    m: ref__41,
  },
  n: ref__511,
};
let ref__1123 = {
  // Shape.interactiveElement.light.neutral.subdued.pressed
  k: {
    l: ref__45,
    m: ref__41,
  },
  n: ref__511,
};
let ref__1124 = {
  // Shape.interactiveElement.main.neutral.subdued.default
  k: {
    l: ref__789,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1125 = {
  // Shape.interactiveElement.light.positive.subdued.hover
  k: {
    l: ref__240,
    m: ref__344,
  },
  n: ref__511,
};
let ref__1126 = {
  // Shape.interactiveElement.light.positive.subdued.pressed
  k: {
    l: ref__266,
    m: ref__344,
  },
  n: ref__511,
};
let ref__1127 = {
  // Shape.interactiveElement.main.positive.subdued.default
  k: {
    l: ref__802,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1128 = {
  // Shape.interactiveElement.light.warning.subdued.hover
  k: {
    l: ref__244,
    m: ref__361,
  },
  n: ref__511,
};
let ref__1129 = {
  // Shape.interactiveElement.light.warning.subdued.pressed
  k: {
    l: ref__270,
    m: ref__361,
  },
  n: ref__511,
};
let ref__1130 = {
  // Shape.interactiveElement.main.warning.subdued.default
  k: {
    l: ref__815,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1131 = {
  // Shape.interactiveElement.light.negative.subdued.hover
  k: {
    l: ref__248,
    m: ref__378,
  },
  n: ref__511,
};
let ref__1132 = {
  // Shape.interactiveElement.light.negative.subdued.pressed
  k: {
    l: ref__274,
    m: ref__378,
  },
  n: ref__511,
};
let ref__1133 = {
  // Shape.interactiveElement.main.negative.subdued.default
  k: {
    l: ref__828,
    m: ref__222,
  },
  n: ref__511,
};
let ref__1134 = {
  // Shape.interactiveElement.light.primary.common.pressed
  k: {
    l: ref__256,
    m: ref__679,
    n: ref__311,
  },
  n: ref__298,
};
let ref__1135 = {
  // Shape.interactiveElement.light.primary.common.disabled
  k: {
    m: ref__311,
    n: [ref__24, ref__216],
  },
  n: ref__298,
};
let ref__1136 = {
  // Shape.interactiveElement.light.primary.highlighted
  b: ref__1039,
  o: ref__1040,
  p: {
    k: {
      l: ref__679,
      m: ref__222,
    },
    n: ref__511,
  },
  s: {
    k: {
      l: ref__1015,
      m: ref__222,
    },
    n: ref__511,
  },
  c: ref__1014,
};
let ref__1137 = {
  // Shape.interactiveElement.light.primary.distinct.pressed
  k: ref__1043,
  n: ref__511,
};
let ref__1138 = {
  // Shape.interactiveElement.light.secondary.common.pressed
  k: {
    l: ref__260,
    m: ref__691,
    n: ref__320,
  },
  n: ref__298,
};
let ref__1139 = {
  // Shape.interactiveElement.light.secondary.common.disabled
  k: {
    m: ref__320,
    n: [ref__32, ref__216],
  },
  n: ref__298,
};
let ref__1140 = {
  // Shape.interactiveElement.light.secondary.highlighted
  b: ref__1048,
  o: ref__1049,
  p: {
    k: {
      l: ref__691,
      m: ref__222,
    },
    n: ref__511,
  },
  s: {
    k: {
      l: ref__1020,
      m: ref__222,
    },
    n: ref__511,
  },
  c: ref__1019,
};
let ref__1141 = {
  // Shape.interactiveElement.light.secondary.distinct.pressed
  k: ref__1052,
  n: ref__511,
};
let ref__1142 = {
  // Shape.interactiveElement.light.neutral.common.pressed
  k: {
    l: ref__45,
    m: ref__41,
    n: ref__40,
  },
  n: ref__298,
};
let ref__1143 = {
  // Shape.interactiveElement.light.neutral.common.disabled
  k: {
    m: ref__40,
    n: ref__1024,
  },
  n: ref__298,
};
let ref__1144 = {
  // Shape.interactiveElement.light.neutral.highlighted
  b: ref__1056,
  o: ref__1057,
  p: {
    k: {
      l: ref__41,
      m: ref__222,
    },
    n: ref__511,
  },
  s: {
    k: {
      l: ref__919,
      m: ref__222,
    },
    n: ref__511,
  },
  c: ref__1025,
};
let ref__1145 = {
  // Shape.interactiveElement.light.neutral.distinct.pressed
  k: ref__1060,
  n: ref__511,
};
let ref__1146 = {
  // Shape.interactiveElement.light.positive.common.pressed
  k: {
    l: ref__266,
    m: ref__344,
    n: ref__343,
  },
  n: ref__298,
};
let ref__1147 = {
  // Shape.interactiveElement.light.positive.common.disabled
  k: {
    m: ref__343,
    n: [ref__48, ref__216],
  },
  n: ref__298,
};
let ref__1148 = {
  // Shape.interactiveElement.light.positive.highlighted
  b: ref__1065,
  o: ref__1066,
  p: {
    k: {
      l: ref__344,
      m: ref__222,
    },
    n: ref__511,
  },
  s: {
    k: {
      l: ref__925,
      m: ref__222,
    },
    n: ref__511,
  },
  c: ref__1028,
};
let ref__1149 = {
  // Shape.interactiveElement.light.positive.distinct.pressed
  k: ref__1069,
  n: ref__511,
};
let ref__1150 = {
  // Shape.interactiveElement.light.warning.common.pressed
  k: {
    l: ref__270,
    m: ref__361,
    n: ref__360,
  },
  n: ref__298,
};
let ref__1151 = {
  // Shape.interactiveElement.light.warning.common.disabled
  k: {
    m: ref__360,
    n: [ref__56, ref__216],
  },
  n: ref__298,
};
let ref__1152 = {
  // Shape.interactiveElement.light.warning.highlighted
  b: ref__1074,
  o: ref__1075,
  p: {
    k: {
      l: ref__361,
      m: ref__222,
    },
    n: ref__511,
  },
  s: {
    k: {
      l: ref__931,
      m: ref__222,
    },
    n: ref__511,
  },
  c: ref__1031,
};
let ref__1153 = {
  // Shape.interactiveElement.light.warning.distinct.pressed
  k: ref__1078,
  n: ref__511,
};
let ref__1154 = {
  // Shape.interactiveElement.light.negative.common.pressed
  k: {
    l: ref__274,
    m: ref__378,
    n: ref__377,
  },
  n: ref__298,
};
let ref__1155 = {
  // Shape.interactiveElement.light.negative.common.disabled
  k: {
    m: ref__377,
    n: [ref__64, ref__216],
  },
  n: ref__298,
};
let ref__1156 = {
  // Shape.interactiveElement.light.negative.highlighted
  b: ref__1083,
  o: ref__1084,
  p: {
    k: {
      l: ref__378,
      m: ref__222,
    },
    n: ref__511,
  },
  s: {
    k: {
      l: ref__937,
      m: ref__222,
    },
    n: ref__511,
  },
  c: ref__1034,
};
let ref__1157 = {
  // Shape.interactiveElement.light.negative.distinct.pressed
  k: ref__1087,
  n: ref__511,
};
let ref__1158 = {
  // Shape.interactiveItem.light.primary.common.default
  k: {
    m: ref__297,
  },
  n: ref__511,
};
let ref__1159 = {
  // Shape.interactiveItem.light.primary.highlighted.hover
  k: {
    l: ref__228,
    m: ref__506,
  },
  n: ref__511,
};
let ref__1160 = {
  // Shape.interactiveItem.light.primary.highlighted.default
  k: {
    m: ref__506,
  },
  n: ref__511,
};
let ref__1161 = 0.9; // Shape.interactiveItem.light.primary.distinct.hover.colors.foreground.0.color.1
let ref__1369 = {
  // Shape.interactiveItem.light.primary.distinct.pressed.colors.foreground.0
  a: ref__679,
};
let ref__1162 = [
  // Shape.interactiveItem.light.primary.distinct.pressed.colors.foreground
  ref__1369,
  ref__1,
];
let ref__1163 = {
  // Shape.interactiveItem.light.primary.distinct.pressed
  k: {
    l: ref__256,
    m: ref__1162,
    n: ref__311,
  },
  n: ref__298,
};
let ref__1164 = {
  // Shape.interactiveItem.light.primary.highlighted.disabled
  k: {
    m: ref__514,
  },
  n: ref__511,
};
let ref__1165 = {
  // Shape.interactiveItem.dark.primary.primary.common.default
  k: {
    m: ref__396,
  },
  n: ref__511,
};
let ref__1166 = {
  // Shape.interactiveItem.dark.primary.primary.common.disabled
  k: {
    m: ref__404,
  },
  n: ref__511,
};
let ref__1168 = [
  // Shape.interactiveItem.dark.primary.primary.highlighted.print.colors.foreground
  ref__259,
  ref__1,
];
let ref__1167 = {
  // Shape.interactiveItem.dark.primary.primary.highlighted.print
  k: {
    m: ref__1168,
  },
  n: ref__511,
};
let ref__1169 = {
  // Shape.interactiveItem.dark.primary.primary.distinct.hover
  k: {
    m: ref__1168,
    n: ref__258,
  },
  n: ref__298,
};
let ref__1170 = {
  // Shape.interactiveItem.dark.primary.primary.distinct.pressed
  k: {
    l: ref__763,
    m: ref__1168,
    n: ref__258,
  },
  n: ref__298,
};
let ref__1171 = {
  // Shape.interactiveItem.subdued.primary.primary.common
  b: ref__1165,
  o: ref__576,
  p: ref__614,
  q: ref__576,
  r: ref__614,
  s: ref__1166,
  t: ref__232,
  c: ref__1165,
};
let ref__1172 = {
  // Shape.input.subdued.secondary.highlighted.print.colors
  l: ref__520,
  m: ref__396,
  n: ref__222,
};
let ref__1173 = {
  // Shape.interactiveItem.subdued.primary.primary.distinct.hover
  k: {
    m: ref__396,
    n: ref__222,
  },
  n: ref__298,
};
let ref__1174 = {
  // Shape.interactiveItem.subdued.primary.primary.distinct.pressed
  k: ref__1172,
  n: ref__298,
};
let ref__1175 = {
  // Shape.interactiveItem.soft.primary.primary.common.hover
  k: {
    l: ref__256,
    m: ref__297,
  },
  n: ref__511,
};
let ref__1176 = {
  // Shape.interactiveItem.light.primary.common.disabled
  k: {
    m: ref__305,
  },
  n: ref__511,
};
let ref__1177 = {
  // Shape.interactiveItem.soft.primary.primary.highlighted.hover
  k: {
    l: ref__256,
    m: ref__1162,
  },
  n: ref__511,
};
let ref__1178 = {
  // Shape.interactiveItem.light.primary.distinct.focused
  k: {
    m: ref__1162,
    n: ref__311,
  },
  n: ref__298,
};
let ref__1179 = {
  // Shape.layout.top
  l: ref__747,
  G: ref__746,
  H: ref__662,
};
let ref__1180 = {
  // Shape.layout.bottom
  l: ref__747,
  G: ref__746,
  H: ref__232,
};
let ref__1181 = {
  // Shape.line.light.building.distinct.default
  a: [ref__17, ref__402],
};
let ref__1182 = {
  // Shape.line.light.building.subdued.default
  a: [ref__17, ref__395],
};
let ref__1183 = {
  // Shape.line.light.primary.distinct.default
  a: [ref__24, ref__402],
};
let ref__1184 = {
  // Shape.line.light.primary.subdued.default
  a: [ref__24, ref__395],
};
let ref__1185 = {
  // Shape.line.dark.building.distinct.default
  a: ref__569,
};
let ref__1186 = {
  // Shape.line.dark.building.subdued.default
  a: ref__408,
};
let ref__1188 = {
  // Shape.line.dark.primary.distinct.default
  a: [ref__26, ref__402],
};
let ref__1189 = {
  // Shape.line.dark.primary.subdued.default
  a: ref__422,
};
let ref__1190 = {
  // Shape.line.dark.primary
  d: ref__1187,
  e: ref__232,
  f: {
    b: ref__1188,
    c: ref__1188,
  },
  g: {
    b: ref__1189,
    c: ref__1189,
  },
};
let ref__1191 = {
  // Shape.line.dark.building
  d: ref__253,
  e: ref__232,
  f: {
    b: ref__1185,
    c: ref__1185,
  },
  g: {
    b: ref__1186,
    c: ref__1186,
  },
};
let ref__1192 = {
  // Shape.line.light.primary
  d: {
    b: ref__507,
    c: ref__507,
  },
  e: ref__232,
  f: {
    b: ref__1183,
    c: ref__1183,
  },
  g: {
    b: ref__1184,
    c: ref__1184,
  },
};
let ref__1193 = {
  // Shape.mask.light.building.common.default.colors
  l: ref__398,
};
let ref__1194 = {
  // Shape.mask.light.building.common.default
  k: ref__1193,
  n: ref__511,
};
let ref__1195 = {
  // Shape.mask.light.building.common.hover
  k: ref__1193,
  n: ref__511,
  F: ref__661,
};
let ref__1196 = {
  // Shape.ground.soft.primary.subdued.selected
  k: {
    l: ref__398,
    n: ref__230,
  },
  n: ref__303,
};
let ref__1197 = {
  // Shape.ground.soft.secondary.subdued.selected
  k: {
    l: ref__398,
    n: ref__235,
  },
  n: ref__303,
};
let ref__1198 = {
  // Shape.ground.soft.neutral.subdued.selected
  k: {
    l: ref__398,
    n: ref__39,
  },
  n: ref__303,
};
let ref__1199 = {
  // Shape.ground.soft.positive.subdued.selected
  k: {
    l: ref__398,
    n: ref__242,
  },
  n: ref__303,
};
let ref__1200 = {
  // Shape.ground.soft.warning.subdued.selected
  k: {
    l: ref__398,
    n: ref__246,
  },
  n: ref__303,
};
let ref__1201 = {
  // Shape.ground.soft.negative.subdued.selected
  k: {
    l: ref__398,
    n: ref__250,
  },
  n: ref__303,
};
let ref__1202 = {
  // Shape.mask.dark.building.common.hover
  k: {
    l: ref__398,
    n: ref__569,
  },
  n: ref__298,
};
let ref__1203 = {
  // Shape.mask.dark.primary.common.default
  k: {
    l: ref__411,
  },
  n: ref__511,
};
let ref__1204 = {
  // Shape.mask.dark.primary.common.hover
  k: {
    l: ref__411,
    n: ref__569,
  },
  n: ref__298,
};
let ref__1205 = {
  // Shape.mask.dark.secondary.common.default
  k: {
    l: ref__425,
  },
  n: ref__511,
};
let ref__1206 = {
  // Shape.mask.dark.secondary.common.hover
  k: {
    l: ref__425,
    n: ref__569,
  },
  n: ref__298,
};
let ref__1207 = {
  // Shape.mask.dark.neutral.common.default
  k: {
    l: ref__789,
  },
  n: ref__511,
};
let ref__1208 = {
  // Shape.mask.dark.neutral.common.hover
  k: {
    l: ref__789,
    n: ref__569,
  },
  n: ref__298,
};
let ref__1209 = {
  // Shape.mask.dark.positive.common.default
  k: {
    l: ref__802,
  },
  n: ref__511,
};
let ref__1210 = {
  // Shape.mask.dark.positive.common.hover
  k: {
    l: ref__802,
    n: ref__569,
  },
  n: ref__298,
};
let ref__1211 = {
  // Shape.mask.dark.warning.common.default
  k: {
    l: ref__815,
  },
  n: ref__511,
};
let ref__1212 = {
  // Shape.mask.dark.warning.common.hover
  k: {
    l: ref__815,
    n: ref__569,
  },
  n: ref__298,
};
let ref__1213 = {
  // Shape.mask.dark.negative.common.default
  k: {
    l: ref__828,
  },
  n: ref__511,
};
let ref__1214 = {
  // Shape.mask.dark.negative.common.hover
  k: {
    l: ref__828,
    n: ref__569,
  },
  n: ref__298,
};
let ref__1215 = {
  // Shape.mask.subdued.primary
  d: {
    b: ref__1194,
    o: ref__1195,
    p: ref__1194,
    q: ref__1195,
    r: ref__753,
    s: ref__232,
    t: ref__232,
    c: ref__1194,
  },
  e: ref__232,
  f: ref__232,
  g: ref__232,
};
let ref__1216 = {
  // Shape.mask.subdued
  u: ref__1215,
  v: ref__1215,
  w: ref__1215,
  x: ref__1215,
  y: ref__1215,
  z: ref__1215,
};
let ref__1217 = {
  // Shape.mask.light.primary
  d: {
    b: ref__1194,
    o: ref__1195,
    p: ref__1194,
    q: ref__1195,
    r: ref__1196,
    s: ref__232,
    t: ref__232,
    c: ref__1194,
  },
  e: ref__232,
  f: ref__232,
  g: ref__232,
};
let ref__1218 = {
  // Shape.mask.light.secondary
  d: {
    b: ref__1194,
    o: ref__1195,
    p: ref__1194,
    q: ref__1195,
    r: ref__1197,
    s: ref__232,
    t: ref__232,
    c: ref__1194,
  },
  e: ref__232,
  f: ref__232,
  g: ref__232,
};
let ref__1219 = {
  // Shape.mask.light.neutral
  d: {
    b: ref__1194,
    o: ref__1195,
    p: ref__1194,
    q: ref__1195,
    r: ref__1198,
    s: ref__232,
    t: ref__232,
    c: ref__1194,
  },
  e: ref__232,
  f: ref__232,
  g: ref__232,
};
let ref__1220 = {
  // Shape.mask.light.positive
  d: {
    b: ref__1194,
    o: ref__1195,
    p: ref__1194,
    q: ref__1195,
    r: ref__1199,
    s: ref__232,
    t: ref__232,
    c: ref__1194,
  },
  e: ref__232,
  f: ref__232,
  g: ref__232,
};
let ref__1221 = {
  // Shape.mask.light.warning
  d: {
    b: ref__1194,
    o: ref__1195,
    p: ref__1194,
    q: ref__1195,
    r: ref__1200,
    s: ref__232,
    t: ref__232,
    c: ref__1194,
  },
  e: ref__232,
  f: ref__232,
  g: ref__232,
};
let ref__1222 = {
  // Shape.mask.light.negative
  d: {
    b: ref__1194,
    o: ref__1195,
    p: ref__1194,
    q: ref__1195,
    r: ref__1201,
    s: ref__232,
    t: ref__232,
    c: ref__1194,
  },
  e: ref__232,
  f: ref__232,
  g: ref__232,
};
let ref__1223 = {
  // ElevationPalette.upperLayer.elevated
  a: ref__219,
  A: ref__213,
  B: ref__1,
  C: ref__217,
  D: 10,
  E: ref__214,
};
let ref__1224 = {
  // ElevationPalette.upperLayer.highlyElevated
  a: ref__219,
  A: ref__213,
  B: ref__217,
  C: ref__215,
  D: ref__221,
  E: ref__217,
};
let ref__1225 = [
  // Shape.overlay.light.building.common.default.elevation
  ref__1223,
  ref__1,
];
let ref__1228 = [
  // Shape.overlay.light.building.common.hover.elevation
  ref__1224,
  ref__1,
];
let ref__1226 = {
  // Shape.overlay.light.building.common.hover
  k: ref__659,
  n: ref__511,
  F: ref__1228,
};
let ref__1227 = {
  // Shape.overlay.light.building.common.default
  k: ref__659,
  n: ref__511,
  F: ref__1225,
};
let ref__1229 = {
  // Shape.ground.light.building.highlighted.pressed.colors
  l: ref__666,
};
let ref__1230 = {
  // Shape.overlay.light.building.highlighted.hover
  k: ref__664,
  n: ref__511,
  F: ref__1228,
};
let ref__1231 = {
  // Shape.ground.light.building.highlighted.selected.colors
  l: ref__224,
  n: ref__222,
};
let ref__1232 = {
  // Shape.overlay.light.building.highlighted.default
  k: ref__664,
  n: ref__511,
  F: ref__1225,
};
let ref__1233 = {
  // Shape.overlay.light.building.common.pressed
  k: ref__669,
  n: ref__511,
  F: ref__1225,
};
let ref__1234 = {
  // Shape.ground.light.building.distinct.selected
  k: {
    l: ref__45,
    n: ref__224,
  },
  n: ref__303,
};
let ref__1235 = {
  // Shape.ground.light.building.subdued.pressed
  k: {
    l: ref__45,
    n: ref__43,
  },
  n: ref__298,
};
let ref__1236 = {
  // Shape.overlay.light.building.subdued.hover
  k: ref__672,
  n: ref__298,
  F: ref__1225,
};
let ref__1237 = {
  // Shape.ground.light.building.subdued.selected
  k: ref__674,
  n: ref__303,
};
let ref__1238 = {
  // Shape.overlay.light.primary.common.hover
  k: ref__676,
  n: ref__511,
  F: ref__1228,
};
let ref__1239 = {
  // Shape.overlay.light.primary.common.default
  k: ref__676,
  n: ref__511,
  F: ref__1225,
};
let ref__1241 = {
  // Shape.overlay.light.primary.highlighted.hover
  k: ref__758,
  n: ref__511,
  F: ref__1228,
};
let ref__1243 = {
  // Shape.overlay.light.primary.highlighted.default
  k: ref__757,
  n: ref__511,
  F: ref__1225,
};
let ref__1244 = {
  // Shape.ground.light.primary.distinct.selected
  k: ref__683,
  n: ref__303,
};
let ref__1245 = {
  // Shape.ground.light.primary.subdued.pressed
  k: {
    l: ref__228,
    n: ref__313,
  },
  n: ref__298,
};
let ref__1246 = {
  // Shape.overlay.light.primary.subdued.hover
  k: ref__685,
  n: ref__298,
  F: ref__1225,
};
let ref__1247 = {
  // Shape.ground.light.primary.subdued.selected
  k: {
    l: ref__222,
    n: ref__230,
  },
  n: ref__303,
};
let ref__1248 = {
  // Shape.overlay.light.secondary.common.hover
  k: ref__688,
  n: ref__511,
  F: ref__1228,
};
let ref__1249 = {
  // Shape.overlay.light.secondary.common.default
  k: ref__688,
  n: ref__511,
  F: ref__1225,
};
let ref__1251 = {
  // Shape.overlay.light.secondary.highlighted.hover
  k: ref__771,
  n: ref__511,
  F: ref__1228,
};
let ref__1253 = {
  // Shape.overlay.light.secondary.highlighted.default
  k: ref__770,
  n: ref__511,
  F: ref__1225,
};
let ref__1254 = {
  // Shape.ground.light.secondary.distinct.selected
  k: ref__695,
  n: ref__303,
};
let ref__1255 = {
  // Shape.ground.light.secondary.subdued.pressed
  k: {
    l: ref__233,
    n: ref__322,
  },
  n: ref__298,
};
let ref__1256 = {
  // Shape.overlay.light.secondary.subdued.hover
  k: ref__697,
  n: ref__298,
  F: ref__1225,
};
let ref__1257 = {
  // Shape.ground.light.secondary.subdued.selected
  k: {
    l: ref__222,
    n: ref__235,
  },
  n: ref__303,
};
let ref__1258 = {
  // Shape.overlay.light.neutral.common.hover
  k: ref__700,
  n: ref__511,
  F: ref__1228,
};
let ref__1259 = {
  // Shape.overlay.light.neutral.common.default
  k: ref__700,
  n: ref__511,
  F: ref__1225,
};
let ref__1261 = {
  // Shape.overlay.light.neutral.highlighted.hover
  k: ref__784,
  n: ref__511,
  F: ref__1228,
};
let ref__1263 = {
  // Shape.overlay.light.neutral.highlighted.default
  k: ref__783,
  n: ref__511,
  F: ref__1225,
};
let ref__1264 = {
  // Shape.ground.light.neutral.distinct.selected
  k: ref__705,
  n: ref__303,
};
let ref__1265 = {
  // Shape.ground.light.neutral.subdued.pressed
  k: {
    l: ref__237,
    n: ref__334,
  },
  n: ref__298,
};
let ref__1266 = {
  // Shape.overlay.light.neutral.subdued.hover
  k: ref__707,
  n: ref__298,
  F: ref__1225,
};
let ref__1267 = {
  // Shape.ground.light.neutral.subdued.selected
  k: {
    l: ref__222,
    n: ref__39,
  },
  n: ref__303,
};
let ref__1268 = {
  // Shape.overlay.light.positive.common.hover
  k: ref__710,
  n: ref__511,
  F: ref__1228,
};
let ref__1269 = {
  // Shape.overlay.light.positive.common.default
  k: ref__710,
  n: ref__511,
  F: ref__1225,
};
let ref__1271 = {
  // Shape.overlay.light.positive.highlighted.hover
  k: ref__797,
  n: ref__511,
  F: ref__1228,
};
let ref__1273 = {
  // Shape.overlay.light.positive.highlighted.default
  k: ref__796,
  n: ref__511,
  F: ref__1225,
};
let ref__1274 = {
  // Shape.ground.light.positive.distinct.selected
  k: ref__716,
  n: ref__303,
};
let ref__1275 = {
  // Shape.ground.light.positive.subdued.pressed
  k: {
    l: ref__240,
    n: ref__350,
  },
  n: ref__298,
};
let ref__1276 = {
  // Shape.overlay.light.positive.subdued.hover
  k: ref__718,
  n: ref__298,
  F: ref__1225,
};
let ref__1277 = {
  // Shape.ground.light.positive.subdued.selected
  k: {
    l: ref__222,
    n: ref__242,
  },
  n: ref__303,
};
let ref__1278 = {
  // Shape.overlay.light.warning.common.hover
  k: ref__721,
  n: ref__511,
  F: ref__1228,
};
let ref__1279 = {
  // Shape.overlay.light.warning.common.default
  k: ref__721,
  n: ref__511,
  F: ref__1225,
};
let ref__1281 = {
  // Shape.overlay.light.warning.highlighted.hover
  k: ref__810,
  n: ref__511,
  F: ref__1228,
};
let ref__1283 = {
  // Shape.overlay.light.warning.highlighted.default
  k: ref__809,
  n: ref__511,
  F: ref__1225,
};
let ref__1284 = {
  // Shape.ground.light.warning.distinct.selected
  k: ref__727,
  n: ref__303,
};
let ref__1285 = {
  // Shape.ground.light.warning.subdued.pressed
  k: {
    l: ref__244,
    n: ref__367,
  },
  n: ref__298,
};
let ref__1286 = {
  // Shape.overlay.light.warning.subdued.hover
  k: ref__729,
  n: ref__298,
  F: ref__1225,
};
let ref__1287 = {
  // Shape.ground.light.warning.subdued.selected
  k: {
    l: ref__222,
    n: ref__246,
  },
  n: ref__303,
};
let ref__1288 = {
  // Shape.overlay.light.negative.common.hover
  k: ref__732,
  n: ref__511,
  F: ref__1228,
};
let ref__1289 = {
  // Shape.overlay.light.negative.common.default
  k: ref__732,
  n: ref__511,
  F: ref__1225,
};
let ref__1291 = {
  // Shape.overlay.light.negative.highlighted.hover
  k: ref__823,
  n: ref__511,
  F: ref__1228,
};
let ref__1293 = {
  // Shape.overlay.light.negative.highlighted.default
  k: ref__822,
  n: ref__511,
  F: ref__1225,
};
let ref__1294 = {
  // Shape.ground.light.negative.distinct.selected
  k: ref__738,
  n: ref__303,
};
let ref__1295 = {
  // Shape.ground.light.negative.subdued.pressed
  k: {
    l: ref__248,
    n: ref__384,
  },
  n: ref__298,
};
let ref__1296 = {
  // Shape.overlay.light.negative.subdued.hover
  k: ref__740,
  n: ref__298,
  F: ref__1225,
};
let ref__1297 = {
  // Shape.ground.light.negative.subdued.selected
  k: {
    l: ref__222,
    n: ref__250,
  },
  n: ref__303,
};
let ref__1298 = {
  // Shape.ground.dark
  I: {
    d: {
      b: ref__745,
      o: ref__743,
      p: ref__748,
      q: ref__743,
      r: ref__753,
      s: ref__232,
      t: ref__232,
      c: ref__745,
    },
    e: {
      b: ref__747,
      o: ref__671,
      p: ref__746,
      q: ref__671,
      r: {
        k: {
          l: ref__222,
          n: ref__40,
        },
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__747,
    },
    f: {
      b: ref__750,
      o: ref__748,
      p: ref__835,
      q: ref__748,
      r: ref__837,
      s: ref__232,
      t: ref__232,
      c: ref__750,
    },
    g: {
      b: ref__751,
      o: ref__752,
      p: ref__751,
      q: ref__752,
      r: ref__753,
      s: ref__232,
      t: ref__232,
      c: ref__751,
    },
  },
  u: {
    d: {
      b: ref__756,
      o: ref__754,
      p: {
        k: {
          l: ref__422,
          n: ref__679,
        },
        n: ref__298,
      },
      q: ref__754,
      r: ref__766,
      s: ref__232,
      t: ref__232,
      c: ref__756,
    },
    e: {
      b: ref__760,
      o: ref__759,
      p: {
        k: ref__758,
        n: ref__511,
      },
      q: ref__759,
      r: {
        k: {
          l: ref__258,
          n: ref__222,
        },
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__760,
    },
    f: {
      b: ref__762,
      o: ref__754,
      p: {
        k: {
          l: ref__417,
          n: ref__679,
        },
        n: ref__298,
      },
      q: ref__754,
      r: {
        k: ref__761,
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__762,
    },
    g: {
      b: ref__764,
      o: ref__765,
      p: ref__764,
      q: ref__765,
      r: ref__766,
      s: ref__232,
      t: ref__232,
      c: ref__764,
    },
  },
  v: {
    d: {
      b: ref__769,
      o: ref__767,
      p: {
        k: {
          l: ref__434,
          n: ref__691,
        },
        n: ref__298,
      },
      q: ref__767,
      r: ref__779,
      s: ref__232,
      t: ref__232,
      c: ref__769,
    },
    e: {
      b: ref__773,
      o: ref__772,
      p: {
        k: ref__771,
        n: ref__511,
      },
      q: ref__772,
      r: {
        k: {
          l: ref__262,
          n: ref__222,
        },
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__773,
    },
    f: {
      b: ref__775,
      o: ref__767,
      p: {
        k: {
          l: ref__429,
          n: ref__691,
        },
        n: ref__298,
      },
      q: ref__767,
      r: {
        k: ref__774,
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__775,
    },
    g: {
      b: ref__777,
      o: ref__778,
      p: ref__777,
      q: ref__778,
      r: ref__779,
      s: ref__232,
      t: ref__232,
      c: ref__777,
    },
  },
  w: {
    d: {
      b: ref__782,
      o: ref__780,
      p: {
        k: {
          l: ref__437,
          n: ref__41,
        },
        n: ref__298,
      },
      q: ref__780,
      r: ref__792,
      s: ref__232,
      t: ref__232,
      c: ref__782,
    },
    e: {
      b: ref__786,
      o: ref__785,
      p: {
        k: ref__784,
        n: ref__511,
      },
      q: ref__785,
      r: {
        k: {
          l: ref__42,
          n: ref__222,
        },
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__786,
    },
    f: {
      b: ref__788,
      o: ref__780,
      p: {
        k: {
          l: ref__447,
          n: ref__41,
        },
        n: ref__298,
      },
      q: ref__780,
      r: {
        k: ref__787,
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__788,
    },
    g: {
      b: ref__790,
      o: ref__791,
      p: ref__790,
      q: ref__791,
      r: ref__792,
      s: ref__232,
      t: ref__232,
      c: ref__790,
    },
  },
  x: {
    d: {
      b: ref__795,
      o: ref__793,
      p: {
        k: {
          l: ref__450,
          n: ref__344,
        },
        n: ref__298,
      },
      q: ref__793,
      r: ref__805,
      s: ref__232,
      t: ref__232,
      c: ref__795,
    },
    e: {
      b: ref__799,
      o: ref__798,
      p: {
        k: ref__797,
        n: ref__511,
      },
      q: ref__798,
      r: {
        k: {
          l: ref__268,
          n: ref__222,
        },
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__799,
    },
    f: {
      b: ref__801,
      o: ref__793,
      p: {
        k: {
          l: ref__459,
          n: ref__344,
        },
        n: ref__298,
      },
      q: ref__793,
      r: {
        k: ref__800,
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__801,
    },
    g: {
      b: ref__803,
      o: ref__804,
      p: ref__803,
      q: ref__804,
      r: ref__805,
      s: ref__232,
      t: ref__232,
      c: ref__803,
    },
  },
  y: {
    d: {
      b: ref__808,
      o: ref__806,
      p: {
        k: {
          l: ref__462,
          n: ref__361,
        },
        n: ref__298,
      },
      q: ref__806,
      r: ref__818,
      s: ref__232,
      t: ref__232,
      c: ref__808,
    },
    e: {
      b: ref__812,
      o: ref__811,
      p: {
        k: ref__810,
        n: ref__511,
      },
      q: ref__811,
      r: {
        k: {
          l: ref__272,
          n: ref__222,
        },
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__812,
    },
    f: {
      b: ref__814,
      o: ref__806,
      p: {
        k: {
          l: ref__471,
          n: ref__361,
        },
        n: ref__298,
      },
      q: ref__806,
      r: {
        k: ref__813,
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__814,
    },
    g: {
      b: ref__816,
      o: ref__817,
      p: ref__816,
      q: ref__817,
      r: ref__818,
      s: ref__232,
      t: ref__232,
      c: ref__816,
    },
  },
  z: {
    d: {
      b: ref__821,
      o: ref__819,
      p: {
        k: {
          l: ref__474,
          n: ref__378,
        },
        n: ref__298,
      },
      q: ref__819,
      r: ref__831,
      s: ref__232,
      t: ref__232,
      c: ref__821,
    },
    e: {
      b: ref__825,
      o: ref__824,
      p: {
        k: ref__823,
        n: ref__511,
      },
      q: ref__824,
      r: {
        k: {
          l: ref__276,
          n: ref__222,
        },
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__825,
    },
    f: {
      b: ref__827,
      o: ref__819,
      p: {
        k: {
          l: ref__483,
          n: ref__378,
        },
        n: ref__298,
      },
      q: ref__819,
      r: {
        k: ref__826,
        n: ref__303,
      },
      s: ref__232,
      t: ref__232,
      c: ref__827,
    },
    g: {
      b: ref__829,
      o: ref__830,
      p: ref__829,
      q: ref__830,
      r: ref__831,
      s: ref__232,
      t: ref__232,
      c: ref__829,
    },
  },
};
let ref__1300 = {
  // Shape.overlay.subdued.primary.common.hover
  k: ref__749,
  n: ref__298,
  F: ref__1225,
};
let ref__1301 = {
  // Shape.overlay.light.primary.common.pressed
  k: ref__682,
  n: ref__511,
  F: ref__1225,
};
let ref__1303 = {
  // Shape.overlay.subdued.primary.distinct.hover
  k: ref__834,
  n: ref__298,
  F: ref__1225,
};
let ref__1304 = {
  // Shape.overlay.subdued.primary.subdued.hover
  k: ref__838,
  n: ref__298,
  F: ref__1225,
};
let ref__1306 = {
  // Shape.overlay.subdued.primary.common
  b: ref__1299,
  o: ref__1300,
  p: ref__748,
  q: ref__1300,
  r: ref__753,
  s: ref__232,
  t: ref__232,
  c: ref__745,
};
let ref__1307 = {
  // Shape.overlay.light.secondary.common.pressed
  k: ref__694,
  n: ref__511,
  F: ref__1225,
};
let ref__1309 = {
  // Shape.overlay.subdued.primary.distinct
  b: ref__750,
  o: ref__1303,
  p: ref__835,
  q: ref__1303,
  r: ref__837,
  s: ref__232,
  t: ref__232,
  c: ref__750,
};
let ref__1310 = {
  // Shape.overlay.subdued.primary.subdued
  b: ref__751,
  o: ref__1304,
  p: ref__752,
  q: ref__1304,
  r: ref__753,
  s: ref__232,
  t: ref__232,
  c: ref__1305,
};
let ref__1312 = {
  // Shape.overlay.light.positive.common.pressed
  k: ref__715,
  n: ref__511,
  F: ref__1225,
};
let ref__1314 = {
  // Shape.overlay.light.warning.common.pressed
  k: ref__726,
  n: ref__511,
  F: ref__1225,
};
let ref__1316 = {
  // Shape.overlay.light.negative.common.pressed
  k: ref__737,
  n: ref__511,
  F: ref__1225,
};
let ref__1318 = {
  // Shape.overlay.subdued
  u: {
    d: ref__1306,
    e: {
      b: ref__1227,
      o: ref__1238,
      p: ref__1301,
      q: ref__1238,
      r: {
        k: ref__1302,
        n: ref__303,
        F: ref__1225,
      },
      s: ref__232,
      t: ref__232,
      c: ref__1227,
    },
    f: ref__1309,
    g: ref__1310,
  },
  v: {
    d: ref__1306,
    e: {
      b: ref__1227,
      o: ref__1248,
      p: ref__1307,
      q: ref__1248,
      r: {
        k: ref__1308,
        n: ref__303,
        F: ref__1225,
      },
      s: ref__232,
      t: ref__232,
      c: ref__1227,
    },
    f: ref__1309,
    g: ref__1310,
  },
  w: {
    d: ref__1306,
    e: {
      b: ref__1227,
      o: ref__1258,
      p: ref__1233,
      q: ref__1258,
      r: {
        k: ref__1311,
        n: ref__303,
        F: ref__1225,
      },
      s: ref__232,
      t: ref__232,
      c: ref__1227,
    },
    f: ref__1309,
    g: ref__1310,
  },
  x: {
    d: ref__1306,
    e: {
      b: ref__1227,
      o: ref__1268,
      p: ref__1312,
      q: ref__1268,
      r: {
        k: ref__1313,
        n: ref__303,
        F: ref__1225,
      },
      s: ref__232,
      t: ref__232,
      c: ref__1227,
    },
    f: ref__1309,
    g: ref__1310,
  },
  y: {
    d: ref__1306,
    e: {
      b: ref__1227,
      o: ref__1278,
      p: ref__1314,
      q: ref__1278,
      r: {
        k: ref__1315,
        n: ref__303,
        F: ref__1225,
      },
      s: ref__232,
      t: ref__232,
      c: ref__1227,
    },
    f: ref__1309,
    g: ref__1310,
  },
  z: {
    d: ref__1306,
    e: {
      b: ref__1227,
      o: ref__1288,
      p: ref__1316,
      q: ref__1288,
      r: {
        k: ref__1317,
        n: ref__303,
        F: ref__1225,
      },
      s: ref__232,
      t: ref__232,
      c: ref__1227,
    },
    f: ref__1309,
    g: ref__1310,
  },
};
let ref__1319 = {
  // Shape.overlay.soft.primary.common.hover
  k: ref__848,
  n: ref__511,
  F: ref__1228,
};
let ref__1320 = {
  // Shape.ground.soft.primary.common.selected.colors
  l: ref__850,
  n: ref__230,
};
let ref__1321 = {
  // Shape.overlay.soft.primary.common.default
  k: ref__848,
  n: ref__511,
  F: ref__1225,
};
let ref__1322 = {
  // Shape.overlay.light.primary.highlighted
  b: ref__1243,
  o: ref__1241,
  p: {
    k: ref__1240,
    n: ref__511,
    F: ref__1225,
  },
  q: ref__1241,
  r: {
    k: ref__1242,
    n: ref__303,
    F: ref__1225,
  },
  s: ref__232,
  t: ref__232,
  c: ref__1243,
};
let ref__1323 = {
  // Shape.ground.soft.primary.distinct.pressed
  k: {
    l: ref__313,
  },
  n: ref__511,
};
let ref__1324 = {
  // Shape.ground.soft.primary.distinct.selected
  k: {
    l: ref__256,
    n: ref__230,
  },
  n: ref__303,
};
let ref__1325 = {
  // Shape.ground.soft.primary.subdued.pressed
  k: {
    l: ref__256,
    n: ref__313,
  },
  n: ref__298,
};
let ref__1326 = {
  // Shape.overlay.soft.primary.subdued.hover
  k: ref__854,
  n: ref__298,
  F: ref__1225,
};
let ref__1327 = {
  // Shape.overlay.soft.secondary.common.hover
  k: ref__857,
  n: ref__511,
  F: ref__1228,
};
let ref__1328 = {
  // Shape.ground.soft.secondary.common.selected.colors
  l: ref__859,
  n: ref__235,
};
let ref__1329 = {
  // Shape.overlay.soft.secondary.common.default
  k: ref__857,
  n: ref__511,
  F: ref__1225,
};
let ref__1330 = {
  // Shape.overlay.light.secondary.highlighted
  b: ref__1253,
  o: ref__1251,
  p: {
    k: ref__1250,
    n: ref__511,
    F: ref__1225,
  },
  q: ref__1251,
  r: {
    k: ref__1252,
    n: ref__303,
    F: ref__1225,
  },
  s: ref__232,
  t: ref__232,
  c: ref__1253,
};
let ref__1331 = {
  // Shape.ground.soft.secondary.distinct.pressed
  k: {
    l: ref__322,
  },
  n: ref__511,
};
let ref__1332 = {
  // Shape.ground.soft.secondary.distinct.selected
  k: {
    l: ref__260,
    n: ref__235,
  },
  n: ref__303,
};
let ref__1333 = {
  // Shape.ground.soft.secondary.subdued.pressed
  k: {
    l: ref__260,
    n: ref__322,
  },
  n: ref__298,
};
let ref__1334 = {
  // Shape.overlay.soft.secondary.subdued.hover
  k: ref__863,
  n: ref__298,
  F: ref__1225,
};
let ref__1335 = {
  // Shape.overlay.soft.neutral.common.hover
  k: ref__866,
  n: ref__511,
  F: ref__1228,
};
let ref__1336 = {
  // Shape.ground.soft.neutral.common.selected.colors
  l: ref__868,
  n: ref__39,
};
let ref__1337 = {
  // Shape.overlay.soft.neutral.common.default
  k: ref__866,
  n: ref__511,
  F: ref__1225,
};
let ref__1338 = {
  // Shape.overlay.light.neutral.highlighted
  b: ref__1263,
  o: ref__1261,
  p: {
    k: ref__1260,
    n: ref__511,
    F: ref__1225,
  },
  q: ref__1261,
  r: {
    k: ref__1262,
    n: ref__303,
    F: ref__1225,
  },
  s: ref__232,
  t: ref__232,
  c: ref__1263,
};
let ref__1339 = {
  // Shape.ground.soft.neutral.distinct.pressed
  k: {
    l: ref__334,
  },
  n: ref__511,
};
let ref__1340 = {
  // Shape.ground.soft.neutral.distinct.selected
  k: {
    l: ref__45,
    n: ref__39,
  },
  n: ref__303,
};
let ref__1341 = {
  // Shape.ground.soft.neutral.subdued.pressed
  k: {
    l: ref__45,
    n: ref__334,
  },
  n: ref__298,
};
let ref__1342 = {
  // Shape.overlay.soft.neutral.subdued.hover
  k: ref__871,
  n: ref__298,
  F: ref__1225,
};
let ref__1343 = {
  // Shape.overlay.soft.positive.common.hover
  k: ref__874,
  n: ref__511,
  F: ref__1228,
};
let ref__1344 = {
  // Shape.ground.soft.positive.common.selected.colors
  l: ref__876,
  n: ref__242,
};
let ref__1345 = {
  // Shape.overlay.soft.positive.common.default
  k: ref__874,
  n: ref__511,
  F: ref__1225,
};
let ref__1346 = {
  // Shape.overlay.light.positive.highlighted
  b: ref__1273,
  o: ref__1271,
  p: {
    k: ref__1270,
    n: ref__511,
    F: ref__1225,
  },
  q: ref__1271,
  r: {
    k: ref__1272,
    n: ref__303,
    F: ref__1225,
  },
  s: ref__232,
  t: ref__232,
  c: ref__1273,
};
let ref__1347 = {
  // Shape.ground.soft.positive.distinct.pressed
  k: {
    l: ref__350,
  },
  n: ref__511,
};
let ref__1348 = {
  // Shape.ground.soft.positive.distinct.selected
  k: {
    l: ref__266,
    n: ref__242,
  },
  n: ref__303,
};
let ref__1349 = {
  // Shape.ground.soft.positive.subdued.pressed
  k: {
    l: ref__266,
    n: ref__350,
  },
  n: ref__298,
};
let ref__1350 = {
  // Shape.overlay.soft.positive.subdued.hover
  k: ref__880,
  n: ref__298,
  F: ref__1225,
};
let ref__1351 = {
  // Shape.overlay.soft.warning.common.hover
  k: ref__883,
  n: ref__511,
  F: ref__1228,
};
let ref__1352 = {
  // Shape.ground.soft.warning.common.selected.colors
  l: ref__885,
  n: ref__246,
};
let ref__1353 = {
  // Shape.overlay.soft.warning.common.default
  k: ref__883,
  n: ref__511,
  F: ref__1225,
};
let ref__1354 = {
  // Shape.overlay.light.warning.highlighted
  b: ref__1283,
  o: ref__1281,
  p: {
    k: ref__1280,
    n: ref__511,
    F: ref__1225,
  },
  q: ref__1281,
  r: {
    k: ref__1282,
    n: ref__303,
    F: ref__1225,
  },
  s: ref__232,
  t: ref__232,
  c: ref__1283,
};
let ref__1355 = {
  // Shape.ground.soft.warning.distinct.pressed
  k: {
    l: ref__367,
  },
  n: ref__511,
};
let ref__1356 = {
  // Shape.ground.soft.warning.distinct.selected
  k: {
    l: ref__270,
    n: ref__246,
  },
  n: ref__303,
};
let ref__1357 = {
  // Shape.ground.soft.warning.subdued.pressed
  k: {
    l: ref__270,
    n: ref__367,
  },
  n: ref__298,
};
let ref__1358 = {
  // Shape.overlay.soft.warning.subdued.hover
  k: ref__889,
  n: ref__298,
  F: ref__1225,
};
let ref__1359 = {
  // Shape.overlay.soft.negative.common.hover
  k: ref__892,
  n: ref__511,
  F: ref__1228,
};
let ref__1360 = {
  // Shape.ground.soft.negative.common.selected.colors
  l: ref__894,
  n: ref__250,
};
let ref__1361 = {
  // Shape.overlay.soft.negative.common.default
  k: ref__892,
  n: ref__511,
  F: ref__1225,
};
let ref__1362 = {
  // Shape.overlay.light.negative.highlighted
  b: ref__1293,
  o: ref__1291,
  p: {
    k: ref__1290,
    n: ref__511,
    F: ref__1225,
  },
  q: ref__1291,
  r: {
    k: ref__1292,
    n: ref__303,
    F: ref__1225,
  },
  s: ref__232,
  t: ref__232,
  c: ref__1293,
};
let ref__1363 = {
  // Shape.ground.soft.negative.distinct.pressed
  k: {
    l: ref__384,
  },
  n: ref__511,
};
let ref__1364 = {
  // Shape.ground.soft.negative.distinct.selected
  k: {
    l: ref__274,
    n: ref__250,
  },
  n: ref__303,
};
let ref__1365 = {
  // Shape.ground.soft.negative.subdued.pressed
  k: {
    l: ref__274,
    n: ref__384,
  },
  n: ref__298,
};
let ref__1366 = {
  // Shape.overlay.soft.negative.subdued.hover
  k: ref__898,
  n: ref__298,
  F: ref__1225,
};
let ref__1367 = 0.7; // Text.light.basic.subdued.hover.color.1
let ref__1368 = 0.8; // Text.light.basic.subdued.pressed.color.1
let ref__1370 = {
  // Text.light.primary.subdued.default
  a: [ref__24, ref__1367],
};
let ref__1371 = {
  // Text.light.secondary.common.hover
  a: ref__691,
};
let ref__1372 = {
  // Text.light.secondary.subdued.default
  a: [ref__32, ref__1367],
};
let ref__1374 = {
  // Text.light.neutral.subdued.default
  a: [ref__20, ref__1367],
};
let ref__1376 = {
  // Text.light.positive.subdued.default
  a: [ref__48, ref__1367],
};
let ref__1378 = {
  // Text.light.warning.subdued.default
  a: [ref__56, ref__1367],
};
let ref__1380 = {
  // Text.light.negative.subdued.default
  a: [ref__64, ref__1367],
};
let ref__1381 = {
  // Text.dark.basic.common.hover
  a: [ref__14, ref__1368],
};
let ref__1382 = {
  // Text.dark.primary.common.pressed
  a: [ref__26, ref__1368],
};
let ref__1383 = {
  // Text.dark.primary.common.hover
  a: [ref__26, ref__1161],
};
let ref__1384 = {
  // Text.dark.primary.subdued.default
  a: [ref__26, ref__1367],
};
let ref__1385 = {
  // Text.dark.secondary.common.pressed
  a: [ref__34, ref__1368],
};
let ref__1386 = {
  // Text.dark.secondary.common.hover
  a: [ref__34, ref__1161],
};
let ref__1387 = {
  // Text.dark.secondary.subdued.default
  a: [ref__34, ref__1367],
};
let ref__1388 = {
  // Text.dark.neutral.common.pressed
  a: [ref__22, ref__1368],
};
let ref__1389 = {
  // Text.dark.neutral.common.hover
  a: [ref__22, ref__1161],
};
let ref__1390 = {
  // Text.dark.neutral.subdued.default
  a: [ref__22, ref__1367],
};
let ref__1391 = {
  // Text.dark.positive.common.pressed
  a: [ref__50, ref__1368],
};
let ref__1392 = {
  // Text.dark.positive.common.hover
  a: [ref__50, ref__1161],
};
let ref__1393 = {
  // Text.dark.positive.subdued.default
  a: [ref__50, ref__1367],
};
let ref__1394 = {
  // Text.dark.warning.common.pressed
  a: [ref__58, ref__1368],
};
let ref__1395 = {
  // Text.dark.warning.common.hover
  a: [ref__58, ref__1161],
};
let ref__1396 = {
  // Text.dark.warning.subdued.default
  a: [ref__58, ref__1367],
};
let ref__1397 = {
  // Text.dark.negative.common.pressed
  a: [ref__66, ref__1368],
};
let ref__1398 = {
  // Text.dark.negative.common.hover
  a: [ref__66, ref__1161],
};
let ref__1399 = {
  // Text.dark.negative.subdued.default
  a: [ref__66, ref__1367],
};
let ref__1400 = {
  // Text.subdued.primary.common.default
  a: ref__1016,
};
let ref__1401 = {
  // Text.subdued.primary.common.pressed
  a: [ref__27, ref__1367],
};
let ref__1402 = {
  // Text.subdued.primary.common.hover
  a: [ref__27, ref__1368],
};
let ref__1403 = {
  // Text.subdued.secondary.common.default
  a: ref__1021,
};
let ref__1404 = {
  // Text.subdued.secondary.common.pressed
  a: [ref__35, ref__1367],
};
let ref__1405 = {
  // Text.subdued.secondary.common.hover
  a: [ref__35, ref__1368],
};
let ref__1406 = {
  // Text.subdued.neutral.common.default
  a: ref__43,
};
let ref__1407 = {
  // Text.subdued.neutral.common.pressed
  a: [ref__16, ref__1367],
};
let ref__1408 = {
  // Text.subdued.neutral.common.hover
  a: [ref__16, ref__1368],
};
let ref__1409 = {
  // Text.subdued.positive.common.default
  a: ref__352,
};
let ref__1410 = {
  // Text.subdued.positive.common.pressed
  a: [ref__51, ref__1367],
};
let ref__1411 = {
  // Text.subdued.positive.common.hover
  a: [ref__51, ref__1368],
};
let ref__1412 = {
  // Text.subdued.warning.common.default
  a: ref__369,
};
let ref__1413 = {
  // Text.subdued.warning.common.pressed
  a: [ref__59, ref__1367],
};
let ref__1414 = {
  // Text.subdued.warning.common.hover
  a: [ref__59, ref__1368],
};
let ref__1415 = {
  // Text.subdued.negative.common.default
  a: ref__386,
};
let ref__1416 = {
  // Text.subdued.negative.common.pressed
  a: [ref__67, ref__1367],
};
let ref__1417 = {
  // Text.subdued.negative.common.hover
  a: [ref__67, ref__1368],
};
let ref__1418 = {
  // Shape.interactiveItem.light.primary.distinct.hover.colors.foreground.0
  a: [ref__14, ref__1161],
};
let ref__1419 = {
  // Text.dark.basic.subdued.hover
  a: [ref__14, ref__1367],
};
let ref__1420 = {
  // Text.main.primary
  d: {
    b: ref__223,
    o: ref__1418,
    p: ref__1381,
    c: ref__223,
  },
  g: {
    b: ref__1419,
    o: ref__1381,
    p: ref__1418,
    c: ref__1419,
  },
};
let ref__1421 = {
  // Text.light.primary
  d: {
    b: ref__507,
    o: ref__1369,
    p: ref__1369,
    c: ref__507,
  },
  g: {
    b: ref__1370,
    o: {
      a: [ref__24, ref__1368],
    },
    p: {
      a: [ref__24, ref__1161],
    },
    c: ref__1370,
  },
};
let ref__1422 = {
  // Text.light.secondary
  d: {
    b: ref__521,
    o: ref__1371,
    p: ref__1371,
    c: ref__521,
  },
  g: {
    b: ref__1372,
    o: {
      a: [ref__32, ref__1368],
    },
    p: {
      a: [ref__32, ref__1161],
    },
    c: ref__1372,
  },
};
let ref__1423 = {
  // Text.light.neutral
  d: {
    b: ref__331,
    o: ref__1373,
    p: ref__1373,
    c: ref__331,
  },
  g: {
    b: ref__1374,
    o: {
      a: [ref__20, ref__1368],
    },
    p: {
      a: [ref__20, ref__1161],
    },
    c: ref__1374,
  },
};
let ref__1424 = {
  // Text.light.positive
  d: {
    b: ref__347,
    o: ref__1375,
    p: ref__1375,
    c: ref__347,
  },
  g: {
    b: ref__1376,
    o: {
      a: [ref__48, ref__1368],
    },
    p: {
      a: [ref__48, ref__1161],
    },
    c: ref__1376,
  },
};
let ref__1425 = {
  // Text.light.warning
  d: {
    b: ref__364,
    o: ref__1377,
    p: ref__1377,
    c: ref__364,
  },
  g: {
    b: ref__1378,
    o: {
      a: [ref__56, ref__1368],
    },
    p: {
      a: [ref__56, ref__1161],
    },
    c: ref__1378,
  },
};
let ref__1426 = {
  // Text.light.negative
  d: {
    b: ref__381,
    o: ref__1379,
    p: ref__1379,
    c: ref__381,
  },
  g: {
    b: ref__1380,
    o: {
      a: [ref__64, ref__1368],
    },
    p: {
      a: [ref__64, ref__1161],
    },
    c: ref__1380,
  },
};
let ref__1428 = "ClearSans"; // Typography.largeScreen.expose.default.hero.fontFamily
let ref__1429 = "bold"; // Typography.largeScreen.expose.default.hero.fontWeight
let ref__1430 = "56px"; // Typography.largeScreen.expose.default.hero.lineHeight
let ref__1432 = "44px"; // Typography.largeScreen.expose.default.lead.lineHeight
let ref__1433 = 28; // Typography.largeScreen.expose.default.broad.fontSize
let ref__1434 = "ClearSans-Medium"; // Typography.largeScreen.expose.default.broad.fontFamily
let ref__1435 = "normal"; // Typography.largeScreen.expose.default.broad.fontWeight
let ref__1436 = "32px"; // Typography.largeScreen.expose.default.broad.lineHeight
let ref__1437 = 20; // Typography.largeScreen.expose.default.notice.fontSize
let ref__1438 = "28px"; // Typography.largeScreen.expose.default.notice.lineHeight
let ref__1439 = 18; // Typography.largeScreen.expose.default.distinct.fontSize
let ref__1440 = "ClearSans-Light"; // Typography.largeScreen.expose.default.distinct.fontFamily
let ref__1441 = "24px"; // Typography.largeScreen.expose.default.distinct.lineHeight
let ref__1442 = 32; // Typography.largeScreen.interface.title.major.fontSize
let ref__1443 = 22; // Typography.largeScreen.interface.title.common.fontSize
let ref__1444 = 16; // Typography.largeScreen.interface.title.minor.fontSize
let ref__1445 = "20px"; // Typography.largeScreen.interface.title.minor.lineHeight
let ref__1446 = 12; // Typography.largeScreen.interface.title.micro.fontSize
let ref__1447 = "16px"; // Typography.largeScreen.interface.title.micro.lineHeight
let ref__1448 = 0.5; // Typography.largeScreen.interface.title.micro.letterSpacing
let ref__1449 = "uppercase"; // Typography.largeScreen.interface.title.micro.textTransform
let ref__1450 = 13; // Typography.largeScreen.interface.content.small.fontSize
let ref__1452 = {
  // Typography.largeScreen.interface.title.micro
  J: ref__1446,
  K: ref__1428,
  L: ref__1435,
  M: ref__1447,
  N: ref__1448,
  O: ref__1449,
};
let ref__1457 = "40px"; // Typography.largeScreen.story.heading.h3.lineHeight
let ref__1459 = 15; // Typography.largeScreen.story.body.common.fontSize
let ref__1460 = {
  // Typography.largeScreen.interface.content.xsmall
  J: ref__1446,
  K: ref__1428,
  L: ref__1435,
  M: ref__1447,
};
let ref__1462 = {
  // Typography.largeScreen.story.heading.h4
  J: 24,
  K: ref__1434,
  L: ref__1435,
  M: ref__1436,
};
let ref__1463 = {
  // Typography.largeScreen.interface.title.minor
  J: ref__1444,
  K: ref__1428,
  L: ref__1429,
  M: ref__1445,
};
let ref__1464 = {
  // Typography.largeScreen.interface.content.large
  J: ref__1444,
  K: ref__1428,
  L: ref__1435,
  M: ref__1445,
};
let ref__1465 = {
  // Typography.largeScreen.story.body.common
  J: ref__1459,
  K: ref__1428,
  L: ref__1435,
  M: ref__1445,
};
let ref__1466 = {
  // Typography.largeScreen.interface.content.small
  J: ref__1450,
  K: ref__1428,
  L: ref__1435,
  M: "18px",
};
let ref__1467 = {
  // Typography.largeScreen.interface.interactive.large
  J: ref__1444,
  K: ref__1434,
  L: ref__1435,
  M: ref__1445,
};
let ref__1468 = {
  // Typography.smallScreen.interface.title.micro
  J: ref__1450,
  K: ref__1428,
  L: ref__1435,
  M: ref__1447,
  N: ref__1448,
  O: ref__1449,
};
let ref__1469 = {
  // Typography.largeScreen.interface.interactive
  P: {
    J: ref__1446,
    K: ref__1434,
    L: ref__1435,
    M: ref__1447,
  },
  Q: {
    J: ref__221,
    K: ref__1434,
    L: ref__1435,
    M: ref__1445,
  },
  R: ref__1467,
};
let ref__1470 = {
  // Typography.largeScreen.story.heading.h3
  J: 30,
  K: ref__1434,
  L: ref__1435,
  M: ref__1457,
};
let ref__1472 = {
  // Typography.smallScreen.interface.title.common
  J: ref__1437,
  K: ref__1434,
  L: ref__1435,
  M: ref__1441,
};
let ref__1473 = 17; // Typography.smallScreen.story.heading.h4.fontSize
let ref__1474 = {
  // Typography.largeScreen.interface.content.medium
  J: ref__221,
  K: ref__1428,
  L: ref__1435,
  M: ref__1445,
};
let json = {
  //
  S: {
    T: {
      U: ref__505,
      V: ref__296,
      W: ref__299,
      X: {
        h: ref__6,
        i: ref__8,
        j: ref__4,
      },
      Y: {
        h: ref__4,
        i: ref__8,
        j: ref__4,
      },
      Z: {
        h: ref__6,
        i: ref__10,
        j: ref__4,
      },
      _: {
        h: ref__4,
        i: ref__10,
        j: ref__4,
      },
    },
    $: {
      U: {
        j: ref__12,
      },
      V: {
        h: ref__6,
        i: ref__5,
        j: ref__12,
      },
      W: {
        h: ref__4,
        i: ref__5,
        j: ref__12,
      },
      X: {
        h: ref__6,
        i: ref__8,
        j: ref__12,
      },
      Y: {
        h: ref__4,
        i: ref__8,
        j: ref__12,
      },
      Z: {
        h: ref__6,
        i: ref__10,
        j: ref__12,
      },
      _: {
        h: ref__4,
        i: ref__10,
        j: ref__12,
      },
    },
  },
  ab: {
    h: {
      bb: ref__2,
      cb: ref__0,
    },
    i: {
      U: "none",
      db: ref__3,
      eb: ref__7,
      fb: ref__9,
    },
    j: {
      T: ref__0,
      $: ref__11,
    },
  },
  gb: {
    hb: {
      ib: {
        b: ref__222,
        jb: ref__45,
        kb: ref__43,
      },
    },
    jb: {
      ib: {
        b: ref__224,
        hb: ref__666,
        lb: ref__41,
      },
    },
    g: {
      ib: {
        b: ref__40,
        hb: ref__39,
        lb: ref__42,
      },
    },
    u: {
      ib: {
        b: ref__230,
        jb: ref__311,
        kb: ref__679,
        hb: ref__258,
        lb: ref__1016,
      },
      mb: {
        b: ref__228,
        jb: ref__256,
        kb: ref__313,
      },
    },
    v: {
      ib: {
        b: ref__235,
        jb: ref__320,
        kb: ref__691,
        hb: ref__262,
        lb: ref__1021,
      },
      mb: {
        b: ref__233,
        jb: ref__260,
        kb: ref__322,
      },
    },
    w: {
      ib: {
        b: ref__39,
        jb: ref__40,
        kb: ref__41,
        hb: ref__42,
        lb: ref__43,
      },
      mb: {
        b: ref__237,
        jb: ref__45,
        kb: ref__334,
      },
    },
    x: {
      ib: {
        b: ref__242,
        jb: ref__343,
        kb: ref__344,
        hb: ref__268,
        lb: ref__352,
      },
      mb: {
        b: ref__240,
        jb: ref__266,
        kb: ref__350,
      },
    },
    y: {
      ib: {
        b: ref__246,
        jb: ref__360,
        kb: ref__361,
        hb: ref__272,
        lb: ref__369,
      },
      mb: {
        b: ref__244,
        jb: ref__270,
        kb: ref__367,
      },
    },
    z: {
      ib: {
        b: ref__250,
        jb: ref__377,
        kb: ref__378,
        hb: ref__276,
        lb: ref__386,
      },
      mb: {
        b: ref__248,
        jb: ref__274,
        kb: ref__384,
      },
    },
  },
  nb: {
    ob: {
      pb: "#E8EAF6",
      qb: "#C5CAE9",
      rb: "#9FA8DA",
      sb: "#7986CB",
      tb: "#5C6BC0",
      ub: "#3F51B5",
      vb: "#3949AB",
      wb: "#303F9F",
      xb: "#283593",
      yb: "#1A237E",
    },
    zb: {
      pb: ref__28,
      qb: ref__29,
      rb: ref__30,
      sb: ref__27,
      tb: ref__26,
      ub: ref__23,
      vb: ref__24,
      wb: ref__25,
      xb: "#1565C0",
      yb: "#0D47A1",
    },
    Ab: {
      pb: "#E1F5FE",
      qb: "#B3E5FC",
      rb: "#81D4FA",
      sb: "#4FC3F7",
      tb: "#29B6F6",
      ub: "#03A9F4",
      vb: "#039BE5",
      wb: "#0288D1",
      xb: "#0277BD",
      yb: "#01579B",
    },
    Bb: {
      pb: ref__36,
      qb: ref__37,
      rb: ref__38,
      sb: ref__35,
      tb: ref__34,
      ub: ref__31,
      vb: ref__32,
      wb: ref__33,
      xb: "#00838F",
      yb: "#006064",
    },
    Cb: {
      pb: "#E0F2F1",
      qb: "#B2DFDB",
      rb: "#80CBC4",
      sb: "#4DB6AC",
      tb: "#26A69A",
      ub: "#009688",
      vb: "#00897B",
      wb: "#00796B",
      xb: "#00695C",
      yb: "#004D40",
    },
    Db: {
      pb: ref__52,
      qb: ref__53,
      rb: ref__54,
      sb: ref__51,
      tb: ref__50,
      ub: ref__47,
      vb: ref__48,
      wb: ref__49,
      xb: "#2E7D32",
      yb: "#1B5E20",
    },
    Eb: {
      pb: "#F1F8E9",
      qb: "#DCEDC8",
      rb: "#C5E1A5",
      sb: "#AED581",
      tb: "#9CCC65",
      ub: "#8BC34A",
      vb: "#7CB342",
      wb: "#689F38",
      xb: "#558B2F",
      yb: "#33691E",
    },
    Fb: {
      pb: "#F9FBE7",
      qb: "#F0F4C3",
      rb: "#E6EE9C",
      sb: "#DCE775",
      tb: "#D4E157",
      ub: "#CDDC39",
      vb: "#C0CA33",
      wb: "#AFB42B",
      xb: "#9E9D24",
      yb: "#827717",
    },
    Gb: {
      pb: "#FFFDE7",
      qb: "#FFF9C4",
      rb: "#FFF59D",
      sb: "#FFF176",
      tb: "#FFEE58",
      ub: "#FFEB3B",
      vb: "#FDD835",
      wb: "#FBC02D",
      xb: "#F9A825",
      yb: "#F57F17",
    },
    Hb: {
      pb: "#FFF8E1",
      qb: "#FFECB3",
      rb: "#FFE082",
      sb: "#FFD54F",
      tb: "#FFCA28",
      ub: "#FFC107",
      vb: "#FFB300",
      wb: "#FFA000",
      xb: "#FF8F00",
      yb: "#FF6F00",
    },
    Ib: {
      pb: ref__60,
      qb: ref__61,
      rb: ref__62,
      sb: ref__59,
      tb: ref__58,
      ub: ref__55,
      vb: ref__56,
      wb: ref__57,
      xb: "#EF6C00",
      yb: "#E65100",
    },
    Jb: {
      pb: "#FBE9E7",
      qb: "#FFCCBC",
      rb: "#FFAB91",
      sb: "#FF8A65",
      tb: "#FF7043",
      ub: "#FF5722",
      vb: "#F4511E",
      wb: "#E64A19",
      xb: "#D84315",
      yb: "#BF360C",
    },
    Kb: {
      pb: ref__68,
      qb: ref__69,
      rb: ref__70,
      sb: ref__67,
      tb: ref__66,
      ub: ref__63,
      vb: ref__64,
      wb: ref__65,
      xb: "#C62828",
      yb: "#B71C1C",
    },
    Lb: {
      pb: "#FCE4EC",
      qb: "#F8BBD0",
      rb: "#F48FB1",
      sb: "#F06292",
      tb: "#EC407A",
      ub: "#E91E63",
      vb: "#D81B60",
      wb: "#C2185B",
      xb: "#AD1457",
      yb: "#880E4F",
    },
    Mb: {
      pb: "#F3E5F5",
      qb: "#E1BEE7",
      rb: "#CE93D8",
      sb: "#BA68C8",
      tb: "#AB47BC",
      ub: "#9C27B0",
      vb: "#8E24AA",
      wb: "#7B1FA2",
      xb: "#6A1B9A",
      yb: "#4A148C",
    },
    Nb: {
      pb: "#EDE7F6",
      qb: "#D1C4E9",
      rb: "#B39DDB",
      sb: "#9575CD",
      tb: "#7E57C2",
      ub: "#673AB7",
      vb: "#5E35B1",
      wb: "#512DA8",
      xb: "#4527A0",
      yb: "#311B92",
    },
    Ob: {
      pb: "#EFEBE9",
      qb: "#D7CCC8",
      rb: "#BCAAA4",
      sb: "#A1887F",
      tb: "#8D6E63",
      ub: "#795548",
      vb: "#6D4C41",
      wb: "#5D4037",
      xb: "#4E342E",
      yb: "#3E2723",
    },
    Pb: {
      pb: ref__44,
      qb: ref__15,
      rb: ref__46,
      sb: ref__16,
      tb: ref__22,
      ub: ref__21,
      vb: ref__20,
      wb: ref__19,
      xb: ref__18,
      yb: ref__17,
    },
    Qb: {
      pb: "#ECEFF1",
      qb: "#CFD8DC",
      rb: "#B0BEC5",
      sb: "#90A4AE",
      tb: "#78909C",
      ub: "#607D8B",
      vb: "#546E7A",
      wb: "#455A64",
      xb: "#37474F",
      yb: "#263238",
    },
    Rb: ref__14,
    Sb: "#000",
  },
  Tb: {
    Ub: {
      Vb: ref__658,
      Wb: ref__660,
    },
    Xb: {
      Vb: ref__1223,
      Wb: ref__1224,
    },
  },
  Yb: {
    l: {
      G: {
        hb: {
          I: {
            d: ref__253,
            e: ref__252,
            f: {
              b: ref__227,
              c: ref__227,
            },
            g: ref__232,
          },
          u: {
            d: {
              b: ref__229,
              c: ref__229,
            },
            e: ref__290,
            f: ref__232,
            g: ref__232,
          },
          v: {
            d: {
              b: ref__234,
              c: ref__234,
            },
            e: ref__291,
            f: ref__232,
            g: ref__232,
          },
          w: {
            d: {
              b: ref__238,
              c: ref__238,
            },
            e: ref__292,
            f: ref__232,
            g: ref__232,
          },
          x: {
            d: {
              b: ref__241,
              c: ref__241,
            },
            e: ref__293,
            f: ref__232,
            g: ref__232,
          },
          y: {
            d: {
              b: ref__245,
              c: ref__245,
            },
            e: ref__294,
            f: ref__232,
            g: ref__232,
          },
          z: {
            d: {
              b: ref__249,
              c: ref__249,
            },
            e: ref__295,
            f: ref__232,
            g: ref__232,
          },
        },
        jb: {
          I: {
            d: ref__252,
            e: ref__253,
            f: {
              b: ref__255,
              c: ref__255,
            },
            g: ref__232,
          },
        },
        u: ref__278,
        v: ref__279,
        w: ref__280,
        x: ref__281,
        y: ref__282,
        z: ref__283,
      },
      g: {
        u: ref__278,
        v: ref__279,
        w: ref__280,
        x: ref__281,
        y: ref__282,
        z: ref__283,
      },
      ib: {
        u: {
          d: ref__284,
          e: ref__253,
          f: ref__232,
          g: ref__232,
        },
        v: {
          d: ref__285,
          e: ref__253,
          f: ref__232,
          g: ref__232,
        },
        w: {
          d: ref__286,
          e: ref__253,
          f: ref__232,
          g: ref__232,
        },
        x: {
          d: ref__287,
          e: ref__253,
          f: ref__232,
          g: ref__232,
        },
        y: {
          d: ref__288,
          e: ref__253,
          f: ref__232,
          g: ref__232,
        },
        z: {
          d: ref__289,
          e: ref__253,
          f: ref__232,
          g: ref__232,
        },
      },
      mb: {
        u: {
          d: ref__253,
          e: ref__290,
          f: ref__232,
          g: ref__232,
        },
        v: {
          d: ref__253,
          e: ref__291,
          f: ref__232,
          g: ref__232,
        },
        w: {
          d: ref__253,
          e: ref__292,
          f: ref__232,
          g: ref__232,
        },
        x: {
          d: ref__253,
          e: ref__293,
          f: ref__232,
          g: ref__232,
        },
        y: {
          d: ref__253,
          e: ref__294,
          f: ref__232,
          g: ref__232,
        },
        z: {
          d: ref__253,
          e: ref__295,
          f: ref__232,
          g: ref__232,
        },
      },
    },
    Zb: {
      hb: {
        I: {
          d: {
            b: ref__302,
            o: ref__308,
            p: ref__300,
            q: ref__300,
            r: ref__300,
            s: ref__301,
            t: ref__301,
            c: ref__302,
          },
          e: {
            b: ref__307,
            o: {
              k: {
                l: ref__42,
                m: ref__297,
                n: ref__43,
              },
              n: ref__298,
            },
            p: ref__304,
            q: ref__304,
            r: ref__304,
            s: ref__306,
            t: ref__306,
            c: ref__307,
          },
          f: {
            b: ref__308,
            o: ref__307,
            p: ref__309,
            q: ref__309,
            r: ref__309,
            s: ref__310,
            t: ref__310,
            c: ref__308,
          },
          g: ref__232,
        },
        u: ref__498,
        v: ref__499,
        w: ref__500,
        x: ref__501,
        y: ref__502,
        z: ref__503,
      },
      jb: {
        I: ref__497,
        u: {
          d: {
            b: ref__414,
            o: ref__421,
            p: ref__412,
            q: ref__412,
            r: ref__412,
            s: ref__413,
            t: ref__413,
            c: ref__414,
          },
          e: {
            b: ref__420,
            o: {
              k: {
                l: ref__763,
                m: ref__396,
                n: ref__397,
              },
              n: ref__298,
            },
            p: ref__418,
            q: ref__418,
            r: ref__418,
            s: ref__419,
            t: ref__419,
            c: ref__420,
          },
          f: {
            b: ref__421,
            o: ref__420,
            p: ref__423,
            q: ref__423,
            r: ref__423,
            s: ref__424,
            t: ref__424,
            c: ref__421,
          },
          g: ref__232,
        },
        v: {
          d: {
            b: ref__428,
            o: ref__433,
            p: ref__426,
            q: ref__426,
            r: ref__426,
            s: ref__427,
            t: ref__427,
            c: ref__428,
          },
          e: {
            b: ref__432,
            o: {
              k: {
                l: ref__776,
                m: ref__396,
                n: ref__397,
              },
              n: ref__298,
            },
            p: ref__430,
            q: ref__430,
            r: ref__430,
            s: ref__431,
            t: ref__431,
            c: ref__432,
          },
          f: {
            b: ref__433,
            o: ref__432,
            p: ref__435,
            q: ref__435,
            r: ref__435,
            s: ref__436,
            t: ref__436,
            c: ref__433,
          },
          g: ref__232,
        },
        w: ref__493,
        x: ref__494,
        y: ref__495,
        z: ref__496,
      },
      g: {
        u: {
          d: {
            b: ref__401,
            o: ref__407,
            p: ref__486,
            q: ref__486,
            r: ref__486,
            s: ref__400,
            t: ref__400,
            c: ref__401,
          },
          e: {
            b: ref__406,
            o: ref__487,
            p: ref__488,
            q: ref__488,
            r: ref__488,
            s: ref__405,
            t: ref__405,
            c: ref__406,
          },
          f: {
            b: ref__407,
            o: ref__406,
            p: ref__489,
            q: ref__489,
            r: ref__489,
            s: ref__410,
            t: ref__410,
            c: ref__407,
          },
          g: ref__232,
        },
        v: {
          d: {
            b: ref__401,
            o: ref__407,
            p: ref__490,
            q: ref__490,
            r: ref__490,
            s: ref__400,
            t: ref__400,
            c: ref__401,
          },
          e: {
            b: ref__406,
            o: ref__487,
            p: ref__491,
            q: ref__491,
            r: ref__491,
            s: ref__405,
            t: ref__405,
            c: ref__406,
          },
          f: {
            b: ref__407,
            o: ref__406,
            p: ref__492,
            q: ref__492,
            r: ref__492,
            s: ref__410,
            t: ref__410,
            c: ref__407,
          },
          g: ref__232,
        },
        w: ref__493,
        x: ref__494,
        y: ref__495,
        z: ref__496,
      },
      ib: {
        u: ref__497,
        v: ref__497,
        w: ref__497,
        x: ref__497,
        y: ref__497,
        z: ref__497,
      },
      mb: {
        u: ref__498,
        v: ref__499,
        w: ref__500,
        x: ref__501,
        y: ref__502,
        z: ref__503,
      },
    },
    _b: {
      hb: {
        u: {
          d: ref__627,
          e: ref__628,
          f: {
            b: ref__513,
            o: ref__513,
            p: ref__509,
            q: ref__510,
            r: ref__232,
            s: ref__515,
            t: ref__515,
            c: ref__513,
          },
          g: ref__632,
        },
        v: {
          d: ref__633,
          e: ref__634,
          f: {
            b: ref__527,
            o: ref__527,
            p: ref__524,
            q: ref__525,
            r: ref__232,
            s: ref__530,
            t: ref__530,
            c: ref__527,
          },
          g: ref__637,
        },
        w: {
          d: ref__638,
          e: ref__639,
          f: {
            b: ref__538,
            o: ref__538,
            p: ref__535,
            q: ref__536,
            r: ref__232,
            s: ref__539,
            t: ref__539,
            c: ref__538,
          },
          g: ref__642,
        },
        x: {
          d: ref__643,
          e: ref__644,
          f: {
            b: ref__547,
            o: ref__547,
            p: ref__544,
            q: ref__545,
            r: ref__232,
            s: ref__548,
            t: ref__548,
            c: ref__547,
          },
          g: ref__647,
        },
        y: {
          d: ref__648,
          e: ref__649,
          f: {
            b: ref__556,
            o: ref__556,
            p: ref__553,
            q: ref__554,
            r: ref__232,
            s: ref__557,
            t: ref__557,
            c: ref__556,
          },
          g: ref__652,
        },
        z: {
          d: ref__653,
          e: ref__654,
          f: {
            b: ref__565,
            o: ref__565,
            p: ref__562,
            q: ref__563,
            r: ref__232,
            s: ref__566,
            t: ref__566,
            c: ref__565,
          },
          g: ref__657,
        },
      },
      jb: ref__613,
      g: ref__613,
      ib: {
        u: {
          d: {
            b: ref__571,
            o: ref__571,
            p: ref__614,
            q: ref__399,
            r: ref__232,
            s: ref__570,
            t: ref__570,
            c: ref__571,
          },
          e: {
            b: ref__614,
            o: ref__614,
            p: ref__614,
            q: ref__399,
            r: ref__232,
            s: ref__615,
            t: ref__615,
            c: ref__614,
          },
          f: {
            b: ref__576,
            o: ref__576,
            p: ref__614,
            q: ref__577,
            r: ref__232,
            s: ref__583,
            t: ref__583,
            c: ref__576,
          },
          g: {
            b: ref__577,
            o: ref__577,
            p: ref__614,
            q: ref__399,
            r: ref__232,
            s: ref__578,
            t: ref__618,
            c: ref__577,
          },
        },
        v: {
          d: {
            b: ref__571,
            o: ref__571,
            p: ref__616,
            q: ref__399,
            r: ref__232,
            s: ref__570,
            t: ref__570,
            c: ref__571,
          },
          e: {
            b: ref__616,
            o: ref__616,
            p: ref__616,
            q: ref__399,
            r: ref__232,
            s: ref__617,
            t: ref__617,
            c: ref__616,
          },
          f: {
            b: ref__576,
            o: ref__576,
            p: ref__616,
            q: ref__577,
            r: ref__232,
            s: ref__583,
            t: ref__583,
            c: ref__576,
          },
          g: {
            b: ref__577,
            o: ref__577,
            p: ref__616,
            q: ref__399,
            r: ref__232,
            s: ref__578,
            t: ref__618,
            c: ref__577,
          },
        },
        w: {
          d: {
            b: ref__571,
            o: ref__571,
            p: ref__619,
            q: ref__399,
            r: ref__232,
            s: ref__570,
            t: ref__570,
            c: ref__571,
          },
          e: {
            b: ref__619,
            o: ref__619,
            p: ref__619,
            q: ref__399,
            r: ref__232,
            s: ref__620,
            t: ref__620,
            c: ref__619,
          },
          f: {
            b: ref__576,
            o: ref__576,
            p: ref__619,
            q: ref__577,
            r: ref__232,
            s: ref__583,
            t: ref__583,
            c: ref__576,
          },
          g: {
            b: ref__577,
            o: ref__577,
            p: ref__619,
            q: ref__399,
            r: ref__232,
            s: ref__578,
            t: ref__618,
            c: ref__577,
          },
        },
        x: {
          d: {
            b: ref__571,
            o: ref__571,
            p: ref__621,
            q: ref__399,
            r: ref__232,
            s: ref__570,
            t: ref__570,
            c: ref__571,
          },
          e: {
            b: ref__621,
            o: ref__621,
            p: ref__621,
            q: ref__399,
            r: ref__232,
            s: ref__622,
            t: ref__622,
            c: ref__621,
          },
          f: {
            b: ref__576,
            o: ref__576,
            p: ref__621,
            q: ref__577,
            r: ref__232,
            s: ref__583,
            t: ref__583,
            c: ref__576,
          },
          g: {
            b: ref__577,
            o: ref__577,
            p: ref__621,
            q: ref__399,
            r: ref__232,
            s: ref__578,
            t: ref__618,
            c: ref__577,
          },
        },
        y: {
          d: {
            b: ref__571,
            o: ref__571,
            p: ref__623,
            q: ref__399,
            r: ref__232,
            s: ref__570,
            t: ref__570,
            c: ref__571,
          },
          e: {
            b: ref__623,
            o: ref__623,
            p: ref__623,
            q: ref__399,
            r: ref__232,
            s: ref__624,
            t: ref__624,
            c: ref__623,
          },
          f: {
            b: ref__576,
            o: ref__576,
            p: ref__623,
            q: ref__577,
            r: ref__232,
            s: ref__583,
            t: ref__583,
            c: ref__576,
          },
          g: {
            b: ref__577,
            o: ref__577,
            p: ref__623,
            q: ref__399,
            r: ref__232,
            s: ref__578,
            t: ref__618,
            c: ref__577,
          },
        },
        z: {
          d: {
            b: ref__571,
            o: ref__571,
            p: ref__625,
            q: ref__399,
            r: ref__232,
            s: ref__570,
            t: ref__570,
            c: ref__571,
          },
          e: {
            b: ref__625,
            o: ref__625,
            p: ref__625,
            q: ref__399,
            r: ref__232,
            s: ref__626,
            t: ref__626,
            c: ref__625,
          },
          f: {
            b: ref__576,
            o: ref__576,
            p: ref__625,
            q: ref__577,
            r: ref__232,
            s: ref__583,
            t: ref__583,
            c: ref__576,
          },
          g: {
            b: ref__577,
            o: ref__577,
            p: ref__625,
            q: ref__399,
            r: ref__232,
            s: ref__578,
            t: ref__618,
            c: ref__577,
          },
        },
      },
      mb: {
        u: {
          d: ref__627,
          e: ref__628,
          f: {
            b: ref__629,
            o: ref__629,
            p: ref__509,
            q: ref__510,
            r: ref__232,
            s: ref__631,
            t: ref__631,
            c: ref__629,
          },
          g: ref__632,
        },
        v: {
          d: ref__633,
          e: ref__634,
          f: {
            b: ref__635,
            o: ref__635,
            p: ref__524,
            q: ref__525,
            r: ref__232,
            s: ref__636,
            t: ref__636,
            c: ref__635,
          },
          g: ref__637,
        },
        w: {
          d: ref__638,
          e: ref__639,
          f: {
            b: ref__640,
            o: ref__640,
            p: ref__535,
            q: ref__536,
            r: ref__232,
            s: ref__641,
            t: ref__641,
            c: ref__640,
          },
          g: ref__642,
        },
        x: {
          d: ref__643,
          e: ref__644,
          f: {
            b: ref__645,
            o: ref__645,
            p: ref__544,
            q: ref__545,
            r: ref__232,
            s: ref__646,
            t: ref__646,
            c: ref__645,
          },
          g: ref__647,
        },
        y: {
          d: ref__648,
          e: ref__649,
          f: {
            b: ref__650,
            o: ref__650,
            p: ref__553,
            q: ref__554,
            r: ref__232,
            s: ref__651,
            t: ref__651,
            c: ref__650,
          },
          g: ref__652,
        },
        z: {
          d: ref__653,
          e: ref__654,
          f: {
            b: ref__655,
            o: ref__655,
            p: ref__562,
            q: ref__563,
            r: ref__232,
            s: ref__656,
            t: ref__656,
            c: ref__655,
          },
          g: ref__657,
        },
      },
    },
    $b: {
      hb: {
        I: {
          d: {
            b: ref__663,
            o: ref__662,
            p: ref__670,
            q: ref__662,
            r: {
              k: ref__674,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__663,
          },
          e: {
            b: ref__668,
            o: ref__667,
            p: {
              k: ref__1229,
              n: ref__511,
              F: ref__661,
            },
            q: ref__667,
            r: {
              k: ref__1231,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__668,
          },
          f: {
            b: ref__671,
            o: ref__670,
            p: ref__746,
            q: ref__670,
            r: ref__1234,
            s: ref__232,
            t: ref__232,
            c: ref__671,
          },
          g: {
            b: ref__675,
            o: ref__673,
            p: ref__1235,
            q: ref__673,
            r: ref__1237,
            s: ref__232,
            t: ref__232,
            c: ref__675,
          },
        },
        u: {
          d: {
            b: ref__678,
            o: ref__677,
            p: ref__833,
            q: ref__677,
            r: {
              k: ref__683,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__678,
          },
          e: ref__852,
          f: {
            b: ref__684,
            o: ref__678,
            p: ref__853,
            q: ref__678,
            r: ref__1244,
            s: ref__232,
            t: ref__232,
            c: ref__684,
          },
          g: {
            b: ref__687,
            o: ref__686,
            p: ref__1245,
            q: ref__686,
            r: ref__1247,
            s: ref__232,
            t: ref__232,
            c: ref__687,
          },
        },
        v: {
          d: {
            b: ref__690,
            o: ref__689,
            p: ref__841,
            q: ref__689,
            r: {
              k: ref__695,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__690,
          },
          e: ref__861,
          f: {
            b: ref__696,
            o: ref__690,
            p: ref__862,
            q: ref__690,
            r: ref__1254,
            s: ref__232,
            t: ref__232,
            c: ref__696,
          },
          g: {
            b: ref__699,
            o: ref__698,
            p: ref__1255,
            q: ref__698,
            r: ref__1257,
            s: ref__232,
            t: ref__232,
            c: ref__699,
          },
        },
        w: {
          d: {
            b: ref__702,
            o: ref__701,
            p: ref__670,
            q: ref__701,
            r: {
              k: ref__705,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__702,
          },
          e: ref__870,
          f: {
            b: ref__706,
            o: ref__702,
            p: ref__671,
            q: ref__702,
            r: ref__1264,
            s: ref__232,
            t: ref__232,
            c: ref__706,
          },
          g: {
            b: ref__709,
            o: ref__708,
            p: ref__1265,
            q: ref__708,
            r: ref__1267,
            s: ref__232,
            t: ref__232,
            c: ref__709,
          },
        },
        x: {
          d: {
            b: ref__712,
            o: ref__711,
            p: ref__844,
            q: ref__711,
            r: {
              k: ref__716,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__712,
          },
          e: ref__878,
          f: {
            b: ref__717,
            o: ref__712,
            p: ref__879,
            q: ref__712,
            r: ref__1274,
            s: ref__232,
            t: ref__232,
            c: ref__717,
          },
          g: {
            b: ref__720,
            o: ref__719,
            p: ref__1275,
            q: ref__719,
            r: ref__1277,
            s: ref__232,
            t: ref__232,
            c: ref__720,
          },
        },
        y: {
          d: {
            b: ref__723,
            o: ref__722,
            p: ref__845,
            q: ref__722,
            r: {
              k: ref__727,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__723,
          },
          e: ref__887,
          f: {
            b: ref__728,
            o: ref__723,
            p: ref__888,
            q: ref__723,
            r: ref__1284,
            s: ref__232,
            t: ref__232,
            c: ref__728,
          },
          g: {
            b: ref__731,
            o: ref__730,
            p: ref__1285,
            q: ref__730,
            r: ref__1287,
            s: ref__232,
            t: ref__232,
            c: ref__731,
          },
        },
        z: {
          d: {
            b: ref__734,
            o: ref__733,
            p: ref__846,
            q: ref__733,
            r: {
              k: ref__738,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__734,
          },
          e: ref__896,
          f: {
            b: ref__739,
            o: ref__734,
            p: ref__897,
            q: ref__734,
            r: ref__1294,
            s: ref__232,
            t: ref__232,
            c: ref__739,
          },
          g: {
            b: ref__742,
            o: ref__741,
            p: ref__1295,
            q: ref__741,
            r: ref__1297,
            s: ref__232,
            t: ref__232,
            c: ref__742,
          },
        },
      },
      jb: ref__1298,
      g: ref__847,
      ib: ref__847,
      mb: {
        u: {
          d: {
            b: ref__851,
            o: ref__849,
            p: ref__833,
            q: ref__849,
            r: {
              k: ref__1320,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__851,
          },
          e: ref__852,
          f: {
            b: ref__853,
            o: ref__833,
            p: ref__1323,
            q: ref__833,
            r: ref__1324,
            s: ref__232,
            t: ref__232,
            c: ref__853,
          },
          g: {
            b: ref__856,
            o: ref__855,
            p: ref__1325,
            q: ref__855,
            r: ref__1196,
            s: ref__232,
            t: ref__232,
            c: ref__856,
          },
        },
        v: {
          d: {
            b: ref__860,
            o: ref__858,
            p: ref__841,
            q: ref__858,
            r: {
              k: ref__1328,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__860,
          },
          e: ref__861,
          f: {
            b: ref__862,
            o: ref__841,
            p: ref__1331,
            q: ref__841,
            r: ref__1332,
            s: ref__232,
            t: ref__232,
            c: ref__862,
          },
          g: {
            b: ref__865,
            o: ref__864,
            p: ref__1333,
            q: ref__864,
            r: ref__1197,
            s: ref__232,
            t: ref__232,
            c: ref__865,
          },
        },
        w: {
          d: {
            b: ref__869,
            o: ref__867,
            p: ref__670,
            q: ref__867,
            r: {
              k: ref__1336,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__869,
          },
          e: ref__870,
          f: {
            b: ref__671,
            o: ref__670,
            p: ref__1339,
            q: ref__670,
            r: ref__1340,
            s: ref__232,
            t: ref__232,
            c: ref__671,
          },
          g: {
            b: ref__873,
            o: ref__872,
            p: ref__1341,
            q: ref__872,
            r: ref__1198,
            s: ref__232,
            t: ref__232,
            c: ref__873,
          },
        },
        x: {
          d: {
            b: ref__877,
            o: ref__875,
            p: ref__844,
            q: ref__875,
            r: {
              k: ref__1344,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__877,
          },
          e: ref__878,
          f: {
            b: ref__879,
            o: ref__844,
            p: ref__1347,
            q: ref__844,
            r: ref__1348,
            s: ref__232,
            t: ref__232,
            c: ref__879,
          },
          g: {
            b: ref__882,
            o: ref__881,
            p: ref__1349,
            q: ref__881,
            r: ref__1199,
            s: ref__232,
            t: ref__232,
            c: ref__882,
          },
        },
        y: {
          d: {
            b: ref__886,
            o: ref__884,
            p: ref__845,
            q: ref__884,
            r: {
              k: ref__1352,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__886,
          },
          e: ref__887,
          f: {
            b: ref__888,
            o: ref__845,
            p: ref__1355,
            q: ref__845,
            r: ref__1356,
            s: ref__232,
            t: ref__232,
            c: ref__888,
          },
          g: {
            b: ref__891,
            o: ref__890,
            p: ref__1357,
            q: ref__890,
            r: ref__1200,
            s: ref__232,
            t: ref__232,
            c: ref__891,
          },
        },
        z: {
          d: {
            b: ref__895,
            o: ref__893,
            p: ref__846,
            q: ref__893,
            r: {
              k: ref__1360,
              n: ref__303,
              F: ref__661,
            },
            s: ref__232,
            t: ref__232,
            c: ref__895,
          },
          e: ref__896,
          f: {
            b: ref__897,
            o: ref__846,
            p: ref__1363,
            q: ref__846,
            r: ref__1364,
            s: ref__232,
            t: ref__232,
            c: ref__897,
          },
          g: {
            b: ref__900,
            o: ref__899,
            p: ref__1365,
            q: ref__899,
            r: ref__1201,
            s: ref__232,
            t: ref__232,
            c: ref__900,
          },
        },
      },
    },
    ac: {
      hb: {
        u: {
          d: ref__997,
          e: ref__998,
          f: {
            b: ref__906,
            o: ref__906,
            p: ref__907,
            q: ref__907,
            r: ref__232,
            s: ref__908,
            t: ref__908,
            c: ref__906,
          },
          g: {
            b: ref__909,
            o: ref__909,
            p: ref__907,
            q: ref__907,
            r: ref__232,
            s: ref__914,
            t: ref__915,
            c: ref__909,
          },
        },
        v: {
          d: ref__1002,
          e: ref__1003,
          f: {
            b: ref__906,
            o: ref__906,
            p: ref__913,
            q: ref__913,
            r: ref__232,
            s: ref__908,
            t: ref__908,
            c: ref__906,
          },
          g: {
            b: ref__909,
            o: ref__909,
            p: ref__913,
            q: ref__913,
            r: ref__232,
            s: ref__914,
            t: ref__915,
            c: ref__909,
          },
        },
        w: {
          d: ref__1006,
          e: ref__1007,
          f: {
            b: ref__538,
            o: ref__538,
            p: ref__921,
            q: ref__921,
            r: ref__232,
            s: ref__539,
            t: ref__539,
            c: ref__538,
          },
          g: {
            b: ref__540,
            o: ref__540,
            p: ref__538,
            q: ref__538,
            r: ref__232,
            s: ref__541,
            t: {
              k: {
                l: ref__910,
                m: ref__337,
              },
              n: ref__511,
            },
            c: ref__540,
          },
        },
        x: {
          d: ref__1008,
          e: ref__1009,
          f: {
            b: ref__547,
            o: ref__547,
            p: ref__927,
            q: ref__927,
            r: ref__232,
            s: ref__548,
            t: ref__548,
            c: ref__547,
          },
          g: {
            b: ref__549,
            o: ref__549,
            p: ref__547,
            q: ref__547,
            r: ref__232,
            s: ref__550,
            t: {
              k: {
                l: ref__910,
                m: ref__354,
              },
              n: ref__511,
            },
            c: ref__549,
          },
        },
        y: {
          d: ref__1010,
          e: ref__1011,
          f: {
            b: ref__556,
            o: ref__556,
            p: ref__933,
            q: ref__933,
            r: ref__232,
            s: ref__557,
            t: ref__557,
            c: ref__556,
          },
          g: {
            b: ref__558,
            o: ref__558,
            p: ref__556,
            q: ref__556,
            r: ref__232,
            s: ref__559,
            t: {
              k: {
                l: ref__910,
                m: ref__371,
              },
              n: ref__511,
            },
            c: ref__558,
          },
        },
        z: {
          d: ref__1012,
          e: ref__1013,
          f: {
            b: ref__565,
            o: ref__565,
            p: ref__939,
            q: ref__939,
            r: ref__232,
            s: ref__566,
            t: ref__566,
            c: ref__565,
          },
          g: {
            b: ref__567,
            o: ref__567,
            p: ref__565,
            q: ref__565,
            r: ref__232,
            s: ref__568,
            t: {
              k: {
                l: ref__910,
                m: ref__388,
              },
              n: ref__511,
            },
            c: ref__567,
          },
        },
      },
      jb: {
        u: ref__984,
        v: {
          d: ref__985,
          e: {
            b: ref__399,
            o: ref__399,
            p: ref__949,
            q: ref__949,
            r: ref__232,
            s: ref__945,
            t: ref__945,
            c: ref__399,
          },
          f: ref__986,
          g: ref__987,
        },
        w: ref__988,
        x: ref__989,
        y: ref__990,
        z: ref__991,
      },
      g: {
        u: ref__984,
        v: {
          d: ref__985,
          e: {
            b: ref__399,
            o: ref__399,
            p: ref__949,
            q: ref__949,
            r: ref__232,
            s: ref__945,
            t: ref__945,
            c: {
              k: ref__1172,
              n: ref__303,
            },
          },
          f: ref__986,
          g: ref__987,
        },
        w: ref__988,
        x: ref__989,
        y: ref__990,
        z: ref__991,
      },
      ib: {
        u: ref__996,
        v: ref__996,
        w: ref__996,
        x: ref__996,
        y: ref__996,
        z: ref__996,
      },
      mb: {
        u: {
          d: ref__997,
          e: ref__998,
          f: ref__1004,
          g: ref__1005,
        },
        v: {
          d: ref__1002,
          e: ref__1003,
          f: ref__1004,
          g: ref__1005,
        },
        w: {
          d: ref__1006,
          e: ref__1007,
          f: {
            b: ref__640,
            o: ref__640,
            p: ref__619,
            q: ref__619,
            r: ref__232,
            s: ref__641,
            t: ref__641,
            c: ref__640,
          },
          g: {
            b: ref__540,
            o: ref__540,
            p: ref__619,
            q: ref__619,
            r: ref__232,
            s: ref__541,
            t: ref__541,
            c: ref__540,
          },
        },
        x: {
          d: ref__1008,
          e: ref__1009,
          f: {
            b: ref__645,
            o: ref__645,
            p: ref__621,
            q: ref__621,
            r: ref__232,
            s: ref__646,
            t: ref__646,
            c: ref__645,
          },
          g: {
            b: ref__549,
            o: ref__549,
            p: ref__621,
            q: ref__621,
            r: ref__232,
            s: ref__550,
            t: ref__550,
            c: ref__549,
          },
        },
        y: {
          d: ref__1010,
          e: ref__1011,
          f: {
            b: ref__650,
            o: ref__650,
            p: ref__623,
            q: ref__623,
            r: ref__232,
            s: ref__651,
            t: ref__651,
            c: ref__650,
          },
          g: {
            b: ref__558,
            o: ref__558,
            p: ref__623,
            q: ref__623,
            r: ref__232,
            s: ref__559,
            t: ref__559,
            c: ref__558,
          },
        },
        z: {
          d: ref__1012,
          e: ref__1013,
          f: {
            b: ref__655,
            o: ref__655,
            p: ref__625,
            q: ref__625,
            r: ref__232,
            s: ref__656,
            t: ref__656,
            c: ref__655,
          },
          g: {
            b: ref__567,
            o: ref__567,
            p: ref__625,
            q: ref__625,
            r: ref__232,
            s: ref__568,
            t: ref__568,
            c: ref__567,
          },
        },
      },
    },
    bc: {
      hb: {
        u: {
          d: {
            b: ref__1014,
            o: {
              k: {
                l: ref__228,
                m: ref__679,
                n: ref__311,
              },
              n: ref__298,
            },
            p: ref__1134,
            s: ref__1135,
            c: ref__1014,
          },
          e: ref__1136,
          f: {
            b: ref__1041,
            o: ref__1042,
            p: ref__1137,
            s: ref__1044,
            c: ref__1018,
          },
          g: {
            b: ref__1017,
            o: ref__1115,
            p: ref__1116,
            s: ref__1017,
            c: ref__1018,
          },
        },
        v: {
          d: {
            b: ref__1019,
            o: {
              k: {
                l: ref__233,
                m: ref__691,
                n: ref__320,
              },
              n: ref__298,
            },
            p: ref__1138,
            s: ref__1139,
            c: ref__1019,
          },
          e: ref__1140,
          f: {
            b: ref__1050,
            o: ref__1051,
            p: ref__1141,
            s: ref__1053,
            c: ref__1023,
          },
          g: {
            b: ref__1022,
            o: ref__1119,
            p: ref__1120,
            s: ref__1022,
            c: ref__1023,
          },
        },
        w: {
          d: {
            b: ref__1025,
            o: {
              k: {
                l: ref__237,
                m: ref__41,
                n: ref__40,
              },
              n: ref__298,
            },
            p: ref__1142,
            s: ref__1143,
            c: ref__1025,
          },
          e: ref__1144,
          f: {
            b: ref__1058,
            o: ref__1059,
            p: ref__1145,
            s: ref__1061,
            c: ref__1027,
          },
          g: {
            b: ref__1026,
            o: ref__1122,
            p: ref__1123,
            s: ref__1026,
            c: ref__1027,
          },
        },
        x: {
          d: {
            b: ref__1028,
            o: {
              k: {
                l: ref__240,
                m: ref__344,
                n: ref__343,
              },
              n: ref__298,
            },
            p: ref__1146,
            s: ref__1147,
            c: ref__1028,
          },
          e: ref__1148,
          f: {
            b: ref__1067,
            o: ref__1068,
            p: ref__1149,
            s: ref__1070,
            c: ref__1030,
          },
          g: {
            b: ref__1029,
            o: ref__1125,
            p: ref__1126,
            s: ref__1029,
            c: ref__1030,
          },
        },
        y: {
          d: {
            b: ref__1031,
            o: {
              k: {
                l: ref__244,
                m: ref__361,
                n: ref__360,
              },
              n: ref__298,
            },
            p: ref__1150,
            s: ref__1151,
            c: ref__1031,
          },
          e: ref__1152,
          f: {
            b: ref__1076,
            o: ref__1077,
            p: ref__1153,
            s: ref__1079,
            c: ref__1033,
          },
          g: {
            b: ref__1032,
            o: ref__1128,
            p: ref__1129,
            s: ref__1032,
            c: ref__1033,
          },
        },
        z: {
          d: {
            b: ref__1034,
            o: {
              k: {
                l: ref__248,
                m: ref__378,
                n: ref__377,
              },
              n: ref__298,
            },
            p: ref__1154,
            s: ref__1155,
            c: ref__1034,
          },
          e: ref__1156,
          f: {
            b: ref__1085,
            o: ref__1086,
            p: ref__1157,
            s: ref__1088,
            c: ref__1036,
          },
          g: {
            b: ref__1035,
            o: ref__1131,
            p: ref__1132,
            s: ref__1035,
            c: ref__1036,
          },
        },
      },
      jb: {
        u: {
          d: {
            b: ref__1038,
            o: {
              k: {
                l: ref__417,
                m: ref__258,
                n: ref__258,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__763,
                m: ref__258,
                n: ref__258,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__1037,
                n: ref__1037,
              },
              n: ref__298,
            },
            c: ref__1038,
          },
          e: {
            b: ref__1091,
            o: ref__1039,
            p: ref__1040,
            s: {
              k: {
                l: ref__1037,
                m: ref__520,
              },
              n: ref__511,
            },
            c: ref__1038,
          },
          f: {
            b: ref__1041,
            o: ref__1042,
            p: ref__1092,
            s: ref__1044,
            c: ref__1038,
          },
          g: {
            b: ref__1045,
            o: {
              k: {
                l: ref__417,
                m: ref__258,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__763,
                m: ref__258,
              },
              n: ref__511,
            },
            s: ref__1045,
            c: {
              k: {
                m: ref__258,
                n: ref__411,
              },
              n: ref__298,
            },
          },
        },
        v: {
          d: {
            b: ref__1047,
            o: {
              k: {
                l: ref__429,
                m: ref__262,
                n: ref__262,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__776,
                m: ref__262,
                n: ref__262,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__1046,
                n: ref__1046,
              },
              n: ref__298,
            },
            c: ref__1047,
          },
          e: {
            b: ref__1095,
            o: ref__1048,
            p: ref__1049,
            s: {
              k: {
                l: ref__1046,
                m: ref__520,
              },
              n: ref__511,
            },
            c: ref__1047,
          },
          f: {
            b: ref__1050,
            o: ref__1051,
            p: ref__1096,
            s: ref__1053,
            c: ref__1047,
          },
          g: {
            b: ref__1054,
            o: {
              k: {
                l: ref__429,
                m: ref__262,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__776,
                m: ref__262,
              },
              n: ref__511,
            },
            s: ref__1054,
            c: {
              k: {
                m: ref__262,
                n: ref__425,
              },
              n: ref__298,
            },
          },
        },
        w: {
          d: {
            b: ref__1055,
            o: {
              k: {
                l: ref__447,
                m: ref__42,
                n: ref__42,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__442,
                m: ref__42,
                n: ref__42,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__522,
                n: ref__522,
              },
              n: ref__298,
            },
            c: ref__1055,
          },
          e: {
            b: ref__1099,
            o: ref__1056,
            p: ref__1057,
            s: {
              k: {
                l: ref__522,
                m: ref__520,
              },
              n: ref__511,
            },
            c: ref__1055,
          },
          f: {
            b: ref__1058,
            o: ref__1059,
            p: ref__1100,
            s: ref__1061,
            c: ref__1055,
          },
          g: {
            b: ref__1062,
            o: {
              k: {
                l: ref__447,
                m: ref__42,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__442,
                m: ref__42,
              },
              n: ref__511,
            },
            s: ref__1062,
            c: {
              k: {
                m: ref__42,
                n: ref__789,
              },
              n: ref__298,
            },
          },
        },
        x: {
          d: {
            b: ref__1064,
            o: {
              k: {
                l: ref__459,
                m: ref__268,
                n: ref__268,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__454,
                m: ref__268,
                n: ref__268,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__1063,
                n: ref__1063,
              },
              n: ref__298,
            },
            c: ref__1064,
          },
          e: {
            b: ref__1103,
            o: ref__1065,
            p: ref__1066,
            s: {
              k: {
                l: ref__1063,
                m: ref__520,
              },
              n: ref__511,
            },
            c: ref__1064,
          },
          f: {
            b: ref__1067,
            o: ref__1068,
            p: ref__1104,
            s: ref__1070,
            c: ref__1064,
          },
          g: {
            b: ref__1071,
            o: {
              k: {
                l: ref__459,
                m: ref__268,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__454,
                m: ref__268,
              },
              n: ref__511,
            },
            s: ref__1071,
            c: {
              k: {
                m: ref__268,
                n: ref__802,
              },
              n: ref__298,
            },
          },
        },
        y: {
          d: {
            b: ref__1073,
            o: {
              k: {
                l: ref__471,
                m: ref__272,
                n: ref__272,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__466,
                m: ref__272,
                n: ref__272,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__1072,
                n: ref__1072,
              },
              n: ref__298,
            },
            c: ref__1073,
          },
          e: {
            b: ref__1107,
            o: ref__1074,
            p: ref__1075,
            s: {
              k: {
                l: ref__1072,
                m: ref__520,
              },
              n: ref__511,
            },
            c: ref__1073,
          },
          f: {
            b: ref__1076,
            o: ref__1077,
            p: ref__1108,
            s: ref__1079,
            c: ref__1073,
          },
          g: {
            b: ref__1080,
            o: {
              k: {
                l: ref__471,
                m: ref__272,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__466,
                m: ref__272,
              },
              n: ref__511,
            },
            s: ref__1080,
            c: {
              k: {
                m: ref__272,
                n: ref__815,
              },
              n: ref__298,
            },
          },
        },
        z: {
          d: {
            b: ref__1082,
            o: {
              k: {
                l: ref__483,
                m: ref__276,
                n: ref__276,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__478,
                m: ref__276,
                n: ref__276,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__1081,
                n: ref__1081,
              },
              n: ref__298,
            },
            c: ref__1082,
          },
          e: {
            b: ref__1111,
            o: ref__1083,
            p: ref__1084,
            s: {
              k: {
                l: ref__1081,
                m: ref__520,
              },
              n: ref__511,
            },
            c: ref__1082,
          },
          f: {
            b: ref__1085,
            o: ref__1086,
            p: ref__1112,
            s: ref__1088,
            c: ref__1082,
          },
          g: {
            b: ref__1089,
            o: {
              k: {
                l: ref__483,
                m: ref__276,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__478,
                m: ref__276,
              },
              n: ref__511,
            },
            s: ref__1089,
            c: {
              k: {
                m: ref__276,
                n: ref__828,
              },
              n: ref__298,
            },
          },
        },
      },
      g: {
        u: {
          d: {
            b: ref__1090,
            o: {
              k: {
                l: ref__417,
                m: ref__1016,
                n: ref__258,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__763,
                m: ref__1016,
                n: ref__258,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__1016,
                n: ref__1037,
              },
              n: ref__298,
            },
            c: ref__1090,
          },
          e: {
            b: ref__1091,
            o: ref__1039,
            p: ref__1040,
            s: {
              k: {
                l: ref__1037,
                m: ref__222,
              },
              n: ref__511,
            },
            c: ref__1090,
          },
          f: {
            b: ref__1041,
            o: ref__1042,
            p: ref__1092,
            s: ref__1044,
            c: ref__1090,
          },
          g: {
            b: ref__1093,
            o: {
              k: {
                l: ref__417,
                m: ref__1016,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__763,
                m: ref__1016,
              },
              n: ref__511,
            },
            s: ref__1093,
            c: {
              k: {
                m: ref__1016,
                n: ref__411,
              },
              n: ref__298,
            },
          },
        },
        v: {
          d: {
            b: ref__1094,
            o: {
              k: {
                l: ref__429,
                m: ref__1021,
                n: ref__262,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__776,
                m: ref__1021,
                n: ref__262,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__1021,
                n: ref__1046,
              },
              n: ref__298,
            },
            c: ref__1094,
          },
          e: {
            b: ref__1095,
            o: ref__1048,
            p: ref__1049,
            s: {
              k: {
                l: ref__1046,
                m: ref__222,
              },
              n: ref__511,
            },
            c: ref__1094,
          },
          f: {
            b: ref__1050,
            o: ref__1051,
            p: ref__1096,
            s: ref__1053,
            c: ref__1094,
          },
          g: {
            b: ref__1097,
            o: {
              k: {
                l: ref__429,
                m: ref__1021,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__776,
                m: ref__1021,
              },
              n: ref__511,
            },
            s: ref__1097,
            c: {
              k: {
                m: ref__1021,
                n: ref__425,
              },
              n: ref__298,
            },
          },
        },
        w: {
          d: {
            b: ref__1098,
            o: {
              k: {
                l: ref__447,
                m: ref__43,
                n: ref__42,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__442,
                m: ref__43,
                n: ref__42,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__43,
                n: ref__522,
              },
              n: ref__298,
            },
            c: ref__1098,
          },
          e: {
            b: ref__1099,
            o: ref__1056,
            p: ref__1057,
            s: {
              k: {
                l: ref__522,
                m: ref__222,
              },
              n: ref__511,
            },
            c: ref__1098,
          },
          f: {
            b: ref__1058,
            o: ref__1059,
            p: ref__1100,
            s: ref__1061,
            c: ref__1098,
          },
          g: {
            b: ref__1101,
            o: {
              k: {
                l: ref__447,
                m: ref__43,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__442,
                m: ref__43,
              },
              n: ref__511,
            },
            s: ref__1101,
            c: {
              k: {
                m: ref__43,
                n: ref__789,
              },
              n: ref__298,
            },
          },
        },
        x: {
          d: {
            b: ref__1102,
            o: {
              k: {
                l: ref__459,
                m: ref__352,
                n: ref__268,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__454,
                m: ref__352,
                n: ref__268,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__352,
                n: ref__1063,
              },
              n: ref__298,
            },
            c: ref__1102,
          },
          e: {
            b: ref__1103,
            o: ref__1065,
            p: ref__1066,
            s: {
              k: {
                l: ref__1063,
                m: ref__222,
              },
              n: ref__511,
            },
            c: ref__1102,
          },
          f: {
            b: ref__1067,
            o: ref__1068,
            p: ref__1104,
            s: ref__1070,
            c: ref__1102,
          },
          g: {
            b: ref__1105,
            o: {
              k: {
                l: ref__459,
                m: ref__352,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__454,
                m: ref__352,
              },
              n: ref__511,
            },
            s: ref__1105,
            c: {
              k: {
                m: ref__352,
                n: ref__802,
              },
              n: ref__298,
            },
          },
        },
        y: {
          d: {
            b: ref__1106,
            o: {
              k: {
                l: ref__471,
                m: ref__369,
                n: ref__272,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__466,
                m: ref__369,
                n: ref__272,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__369,
                n: ref__1072,
              },
              n: ref__298,
            },
            c: ref__1106,
          },
          e: {
            b: ref__1107,
            o: ref__1074,
            p: ref__1075,
            s: {
              k: {
                l: ref__1072,
                m: ref__222,
              },
              n: ref__511,
            },
            c: ref__1106,
          },
          f: {
            b: ref__1076,
            o: ref__1077,
            p: ref__1108,
            s: ref__1079,
            c: ref__1106,
          },
          g: {
            b: ref__1109,
            o: {
              k: {
                l: ref__471,
                m: ref__369,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__466,
                m: ref__369,
              },
              n: ref__511,
            },
            s: ref__1109,
            c: {
              k: {
                m: ref__369,
                n: ref__815,
              },
              n: ref__298,
            },
          },
        },
        z: {
          d: {
            b: ref__1110,
            o: {
              k: {
                l: ref__483,
                m: ref__386,
                n: ref__276,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__478,
                m: ref__386,
                n: ref__276,
              },
              n: ref__298,
            },
            s: {
              k: {
                m: ref__386,
                n: ref__1081,
              },
              n: ref__298,
            },
            c: ref__1110,
          },
          e: {
            b: ref__1111,
            o: ref__1083,
            p: ref__1084,
            s: {
              k: {
                l: ref__1081,
                m: ref__222,
              },
              n: ref__511,
            },
            c: ref__1110,
          },
          f: {
            b: ref__1085,
            o: ref__1086,
            p: ref__1112,
            s: ref__1088,
            c: ref__1110,
          },
          g: {
            b: ref__1113,
            o: {
              k: {
                l: ref__483,
                m: ref__386,
              },
              n: ref__511,
            },
            p: {
              k: {
                l: ref__478,
                m: ref__386,
              },
              n: ref__511,
            },
            s: ref__1113,
            c: {
              k: {
                m: ref__386,
                n: ref__828,
              },
              n: ref__298,
            },
          },
        },
      },
      ib: {
        u: {
          d: {
            b: ref__1114,
            o: {
              k: {
                l: ref__258,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__1016,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            s: ref__1118,
            c: ref__1114,
          },
          e: {
            b: {
              k: {
                l: ref__222,
                m: ref__311,
              },
              n: ref__511,
            },
            o: ref__1115,
            p: ref__1116,
            s: {
              k: {
                l: ref__520,
                m: ref__311,
              },
              n: ref__511,
            },
            c: ref__1114,
          },
          f: {
            b: ref__1041,
            o: ref__1042,
            p: ref__1092,
            s: ref__1044,
            c: ref__1114,
          },
          g: {
            b: ref__1117,
            o: ref__1091,
            p: {
              k: {
                l: ref__1016,
                m: ref__222,
              },
              n: ref__511,
            },
            s: ref__1117,
            c: ref__1117,
          },
        },
        v: {
          d: {
            b: ref__1114,
            o: {
              k: {
                l: ref__262,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__1021,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            s: ref__1118,
            c: ref__1114,
          },
          e: {
            b: {
              k: {
                l: ref__222,
                m: ref__320,
              },
              n: ref__511,
            },
            o: ref__1119,
            p: ref__1120,
            s: {
              k: {
                l: ref__520,
                m: ref__320,
              },
              n: ref__511,
            },
            c: ref__1114,
          },
          f: {
            b: ref__1050,
            o: ref__1051,
            p: ref__1096,
            s: ref__1053,
            c: ref__1114,
          },
          g: {
            b: ref__1121,
            o: ref__1095,
            p: {
              k: {
                l: ref__1021,
                m: ref__222,
              },
              n: ref__511,
            },
            s: ref__1121,
            c: ref__1121,
          },
        },
        w: {
          d: {
            b: ref__1114,
            o: {
              k: {
                l: ref__42,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__43,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            s: ref__1118,
            c: ref__1114,
          },
          e: {
            b: {
              k: {
                l: ref__222,
                m: ref__40,
              },
              n: ref__511,
            },
            o: ref__1122,
            p: ref__1123,
            s: {
              k: {
                l: ref__520,
                m: ref__40,
              },
              n: ref__511,
            },
            c: ref__1114,
          },
          f: {
            b: ref__1058,
            o: ref__1059,
            p: ref__1100,
            s: ref__1061,
            c: ref__1114,
          },
          g: {
            b: ref__1124,
            o: ref__1099,
            p: {
              k: {
                l: ref__43,
                m: ref__222,
              },
              n: ref__511,
            },
            s: ref__1124,
            c: ref__1124,
          },
        },
        x: {
          d: {
            b: ref__1114,
            o: {
              k: {
                l: ref__268,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__352,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            s: ref__1118,
            c: ref__1114,
          },
          e: {
            b: {
              k: {
                l: ref__222,
                m: ref__343,
              },
              n: ref__511,
            },
            o: ref__1125,
            p: ref__1126,
            s: {
              k: {
                l: ref__520,
                m: ref__343,
              },
              n: ref__511,
            },
            c: ref__1114,
          },
          f: {
            b: ref__1067,
            o: ref__1068,
            p: ref__1104,
            s: ref__1070,
            c: ref__1114,
          },
          g: {
            b: ref__1127,
            o: ref__1103,
            p: {
              k: {
                l: ref__352,
                m: ref__222,
              },
              n: ref__511,
            },
            s: ref__1127,
            c: ref__1127,
          },
        },
        y: {
          d: {
            b: ref__1114,
            o: {
              k: {
                l: ref__272,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__369,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            s: ref__1118,
            c: ref__1114,
          },
          e: {
            b: {
              k: {
                l: ref__222,
                m: ref__360,
              },
              n: ref__511,
            },
            o: ref__1128,
            p: ref__1129,
            s: {
              k: {
                l: ref__520,
                m: ref__360,
              },
              n: ref__511,
            },
            c: ref__1114,
          },
          f: {
            b: ref__1076,
            o: ref__1077,
            p: ref__1108,
            s: ref__1079,
            c: ref__1114,
          },
          g: {
            b: ref__1130,
            o: ref__1107,
            p: {
              k: {
                l: ref__369,
                m: ref__222,
              },
              n: ref__511,
            },
            s: ref__1130,
            c: ref__1130,
          },
        },
        z: {
          d: {
            b: ref__1114,
            o: {
              k: {
                l: ref__276,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            p: {
              k: {
                l: ref__386,
                m: ref__222,
                n: ref__222,
              },
              n: ref__298,
            },
            s: ref__1118,
            c: ref__1114,
          },
          e: {
            b: {
              k: {
                l: ref__222,
                m: ref__377,
              },
              n: ref__511,
            },
            o: ref__1131,
            p: ref__1132,
            s: {
              k: {
                l: ref__520,
                m: ref__377,
              },
              n: ref__511,
            },
            c: ref__1114,
          },
          f: {
            b: ref__1085,
            o: ref__1086,
            p: ref__1112,
            s: ref__1088,
            c: ref__1114,
          },
          g: {
            b: ref__1133,
            o: ref__1111,
            p: {
              k: {
                l: ref__386,
                m: ref__222,
              },
              n: ref__511,
            },
            s: ref__1133,
            c: ref__1133,
          },
        },
      },
      mb: {
        u: {
          d: {
            b: ref__1014,
            o: ref__1134,
            p: {
              k: {
                l: ref__1016,
                m: ref__679,
                n: ref__311,
              },
              n: ref__298,
            },
            s: ref__1135,
            c: ref__1014,
          },
          e: ref__1136,
          f: {
            b: ref__1041,
            o: ref__1042,
            p: ref__1137,
            s: ref__1044,
            c: ref__1014,
          },
          g: {
            b: ref__1017,
            o: ref__1115,
            p: ref__1116,
            s: ref__1017,
            c: ref__1014,
          },
        },
        v: {
          d: {
            b: ref__1019,
            o: ref__1138,
            p: {
              k: {
                l: ref__1021,
                m: ref__691,
                n: ref__320,
              },
              n: ref__298,
            },
            s: ref__1139,
            c: ref__1019,
          },
          e: ref__1140,
          f: {
            b: ref__1050,
            o: ref__1051,
            p: ref__1141,
            s: ref__1053,
            c: ref__1019,
          },
          g: {
            b: ref__1022,
            o: ref__1119,
            p: ref__1120,
            s: ref__1022,
            c: ref__1019,
          },
        },
        w: {
          d: {
            b: ref__1025,
            o: ref__1142,
            p: {
              k: {
                l: ref__43,
                m: ref__41,
                n: ref__40,
              },
              n: ref__298,
            },
            s: ref__1143,
            c: ref__1025,
          },
          e: ref__1144,
          f: {
            b: ref__1058,
            o: ref__1059,
            p: ref__1145,
            s: ref__1061,
            c: ref__1025,
          },
          g: {
            b: ref__1026,
            o: ref__1122,
            p: ref__1123,
            s: ref__1026,
            c: ref__1025,
          },
        },
        x: {
          d: {
            b: ref__1028,
            o: ref__1146,
            p: {
              k: {
                l: ref__352,
                m: ref__344,
                n: ref__343,
              },
              n: ref__298,
            },
            s: ref__1147,
            c: ref__1028,
          },
          e: ref__1148,
          f: {
            b: ref__1067,
            o: ref__1068,
            p: ref__1149,
            s: ref__1070,
            c: ref__1028,
          },
          g: {
            b: ref__1029,
            o: ref__1125,
            p: ref__1126,
            s: ref__1029,
            c: ref__1028,
          },
        },
        y: {
          d: {
            b: ref__1031,
            o: ref__1150,
            p: {
              k: {
                l: ref__369,
                m: ref__361,
                n: ref__360,
              },
              n: ref__298,
            },
            s: ref__1151,
            c: ref__1031,
          },
          e: ref__1152,
          f: {
            b: ref__1076,
            o: ref__1077,
            p: ref__1153,
            s: ref__1079,
            c: ref__1031,
          },
          g: {
            b: ref__1032,
            o: ref__1128,
            p: ref__1129,
            s: ref__1032,
            c: ref__1031,
          },
        },
        z: {
          d: {
            b: ref__1034,
            o: ref__1154,
            p: {
              k: {
                l: ref__386,
                m: ref__378,
                n: ref__377,
              },
              n: ref__298,
            },
            s: ref__1155,
            c: ref__1034,
          },
          e: ref__1156,
          f: {
            b: ref__1085,
            o: ref__1086,
            p: ref__1157,
            s: ref__1088,
            c: ref__1034,
          },
          g: {
            b: ref__1035,
            o: ref__1131,
            p: ref__1132,
            s: ref__1035,
            c: ref__1034,
          },
        },
      },
    },
    cc: {
      hb: {
        u: {
          d: {
            b: ref__1158,
            o: ref__907,
            p: ref__509,
            q: ref__907,
            r: ref__509,
            s: ref__1176,
            t: ref__232,
            c: ref__1158,
          },
          e: {
            b: ref__1160,
            o: ref__1159,
            p: ref__509,
            q: ref__1159,
            r: ref__509,
            s: ref__1164,
            t: ref__232,
            c: ref__1160,
          },
          f: {
            b: ref__1160,
            o: {
              k: {
                m: [ref__1418, ref__1],
                n: ref__311,
              },
              n: ref__298,
            },
            p: ref__1163,
            q: ref__1178,
            r: ref__1163,
            s: ref__1164,
            t: ref__232,
            c: ref__1160,
          },
          g: ref__232,
        },
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
      jb: {
        u: {
          u: {
            d: {
              b: ref__1165,
              o: ref__946,
              p: ref__572,
              q: ref__946,
              r: ref__572,
              s: ref__1166,
              t: ref__232,
              c: ref__1165,
            },
            e: {
              b: ref__1165,
              o: ref__946,
              p: ref__572,
              q: ref__946,
              r: ref__572,
              s: ref__1166,
              t: ref__232,
              c: ref__1167,
            },
            f: {
              b: ref__1167,
              o: ref__1169,
              p: ref__1170,
              q: ref__1169,
              r: ref__1170,
              s: {
                k: {
                  m: [ref__259, ref__216],
                },
                n: ref__511,
              },
              t: ref__232,
              c: ref__1167,
            },
            g: ref__232,
          },
          v: ref__232,
          w: ref__232,
          x: ref__232,
          y: ref__232,
          z: ref__232,
        },
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
      g: {
        u: {
          u: {
            d: ref__1171,
            e: ref__1171,
            f: {
              b: ref__1165,
              o: ref__1173,
              p: ref__1174,
              q: ref__1173,
              r: ref__1174,
              s: ref__1166,
              t: ref__232,
              c: ref__1165,
            },
            g: ref__232,
          },
          v: ref__232,
          w: ref__232,
          x: ref__232,
          y: ref__232,
          z: ref__232,
        },
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
      ib: {
        u: {
          u: {
            d: ref__1171,
            e: ref__1171,
            f: {
              b: ref__1165,
              o: ref__1173,
              p: ref__1174,
              q: {
                k: {
                  n: ref__222,
                  m: ref__396,
                },
                n: ref__298,
              },
              r: ref__1174,
              s: ref__1166,
              t: ref__232,
              c: ref__1165,
            },
            g: ref__232,
          },
          v: ref__232,
          w: ref__232,
          x: ref__232,
          y: ref__232,
          z: ref__232,
        },
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
      mb: {
        u: {
          u: {
            d: {
              b: ref__1158,
              o: ref__1175,
              p: ref__509,
              q: ref__1175,
              r: ref__509,
              s: ref__1176,
              t: ref__232,
              c: ref__1158,
            },
            e: {
              b: ref__1160,
              o: ref__1177,
              p: ref__509,
              q: ref__1177,
              r: ref__509,
              s: ref__1164,
              t: ref__232,
              c: ref__1160,
            },
            f: {
              b: ref__1160,
              o: ref__1178,
              p: ref__1163,
              q: ref__1178,
              r: ref__1163,
              s: ref__1164,
              t: ref__232,
              c: ref__1160,
            },
            g: ref__232,
          },
          v: ref__232,
          w: ref__232,
          x: ref__232,
          y: ref__232,
          z: ref__232,
        },
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
    },
    dc: {
      ec: ref__1179,
      fc: ref__1179,
      gc: {
        l: ref__671,
        G: ref__746,
        H: {
          k: ref__669,
          n: ref__511,
          F: ref__665,
        },
      },
      hc: ref__1180,
      ic: ref__1180,
    },
    G: {
      hb: {
        I: {
          d: ref__252,
          e: ref__232,
          f: {
            b: ref__1181,
            c: ref__1181,
          },
          g: {
            b: ref__1182,
            c: ref__1182,
          },
        },
        u: ref__1192,
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
      jb: {
        I: ref__1191,
        u: ref__1190,
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
      g: {
        u: ref__1190,
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
      ib: {
        u: ref__1191,
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
      mb: {
        u: ref__1192,
        v: ref__232,
        w: ref__232,
        x: ref__232,
        y: ref__232,
        z: ref__232,
      },
    },
    jc: {
      hb: {
        I: {
          d: {
            b: ref__1194,
            o: ref__1195,
            p: ref__1194,
            q: ref__1195,
            r: {
              k: {
                l: ref__398,
                n: ref__224,
              },
              n: ref__303,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1194,
          },
          e: ref__232,
          f: ref__232,
          g: ref__232,
        },
        u: ref__1217,
        v: ref__1218,
        w: ref__1219,
        x: ref__1220,
        y: ref__1221,
        z: ref__1222,
      },
      jb: {
        I: {
          d: {
            b: ref__1194,
            o: ref__1202,
            p: ref__1194,
            q: ref__1202,
            r: ref__753,
            s: ref__232,
            t: ref__232,
            c: ref__1194,
          },
          e: ref__232,
          f: ref__232,
          g: ref__232,
        },
        u: {
          d: {
            b: ref__1203,
            o: ref__1204,
            p: ref__1203,
            q: ref__1204,
            r: ref__766,
            s: ref__232,
            t: ref__232,
            c: ref__1203,
          },
          e: ref__232,
          f: ref__232,
          g: ref__232,
        },
        v: {
          d: {
            b: ref__1205,
            o: ref__1206,
            p: ref__1205,
            q: ref__1206,
            r: ref__779,
            s: ref__232,
            t: ref__232,
            c: ref__1205,
          },
          e: ref__232,
          f: ref__232,
          g: ref__232,
        },
        w: {
          d: {
            b: ref__1207,
            o: ref__1208,
            p: ref__1207,
            q: ref__1208,
            r: ref__792,
            s: ref__232,
            t: ref__232,
            c: ref__1207,
          },
          e: ref__232,
          f: ref__232,
          g: ref__232,
        },
        x: {
          d: {
            b: ref__1209,
            o: ref__1210,
            p: ref__1209,
            q: ref__1210,
            r: ref__805,
            s: ref__232,
            t: ref__232,
            c: ref__1209,
          },
          e: ref__232,
          f: ref__232,
          g: ref__232,
        },
        y: {
          d: {
            b: ref__1211,
            o: ref__1212,
            p: ref__1211,
            q: ref__1212,
            r: ref__818,
            s: ref__232,
            t: ref__232,
            c: ref__1211,
          },
          e: ref__232,
          f: ref__232,
          g: ref__232,
        },
        z: {
          d: {
            b: ref__1213,
            o: ref__1214,
            p: ref__1213,
            q: ref__1214,
            r: ref__831,
            s: ref__232,
            t: ref__232,
            c: ref__1213,
          },
          e: ref__232,
          f: ref__232,
          g: ref__232,
        },
      },
      g: ref__1216,
      ib: ref__1216,
      mb: {
        u: ref__1217,
        v: ref__1218,
        w: ref__1219,
        x: ref__1220,
        y: ref__1221,
        z: ref__1222,
      },
    },
    kc: {
      hb: {
        I: {
          d: {
            b: ref__1227,
            o: ref__1226,
            p: ref__1233,
            q: ref__1226,
            r: {
              k: ref__674,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1227,
          },
          e: {
            b: ref__1232,
            o: ref__1230,
            p: {
              k: ref__1229,
              n: ref__511,
              F: ref__1225,
            },
            q: ref__1230,
            r: {
              k: ref__1231,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1232,
          },
          f: {
            b: ref__671,
            o: ref__1233,
            p: ref__746,
            q: ref__1233,
            r: ref__1234,
            s: ref__232,
            t: ref__232,
            c: ref__671,
          },
          g: {
            b: ref__675,
            o: ref__1236,
            p: ref__1235,
            q: ref__1236,
            r: ref__1237,
            s: ref__232,
            t: ref__232,
            c: ref__675,
          },
        },
        u: {
          d: {
            b: ref__1239,
            o: ref__1238,
            p: ref__1301,
            q: ref__1238,
            r: {
              k: ref__683,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1239,
          },
          e: ref__1322,
          f: {
            b: ref__684,
            o: ref__1239,
            p: ref__853,
            q: ref__1239,
            r: ref__1244,
            s: ref__232,
            t: ref__232,
            c: ref__684,
          },
          g: {
            b: ref__687,
            o: ref__1246,
            p: ref__1245,
            q: ref__1246,
            r: ref__1247,
            s: ref__232,
            t: ref__232,
            c: ref__687,
          },
        },
        v: {
          d: {
            b: ref__1249,
            o: ref__1248,
            p: ref__1307,
            q: ref__1248,
            r: {
              k: ref__695,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1249,
          },
          e: ref__1330,
          f: {
            b: ref__696,
            o: ref__1249,
            p: ref__862,
            q: ref__1249,
            r: ref__1254,
            s: ref__232,
            t: ref__232,
            c: ref__696,
          },
          g: {
            b: ref__699,
            o: ref__1256,
            p: ref__1255,
            q: ref__1256,
            r: ref__1257,
            s: ref__232,
            t: ref__232,
            c: ref__699,
          },
        },
        w: {
          d: {
            b: ref__1259,
            o: ref__1258,
            p: ref__1233,
            q: ref__1258,
            r: {
              k: ref__705,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1259,
          },
          e: ref__1338,
          f: {
            b: ref__706,
            o: ref__1259,
            p: ref__671,
            q: ref__1259,
            r: ref__1264,
            s: ref__232,
            t: ref__232,
            c: ref__706,
          },
          g: {
            b: ref__709,
            o: ref__1266,
            p: ref__1265,
            q: ref__1266,
            r: ref__1267,
            s: ref__232,
            t: ref__232,
            c: ref__709,
          },
        },
        x: {
          d: {
            b: ref__1269,
            o: ref__1268,
            p: ref__1312,
            q: ref__1268,
            r: {
              k: ref__716,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1269,
          },
          e: ref__1346,
          f: {
            b: ref__717,
            o: ref__1269,
            p: ref__879,
            q: ref__1269,
            r: ref__1274,
            s: ref__232,
            t: ref__232,
            c: ref__717,
          },
          g: {
            b: ref__720,
            o: ref__1276,
            p: ref__1275,
            q: ref__1276,
            r: ref__1277,
            s: ref__232,
            t: ref__232,
            c: ref__720,
          },
        },
        y: {
          d: {
            b: ref__1279,
            o: ref__1278,
            p: ref__1314,
            q: ref__1278,
            r: {
              k: ref__727,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1279,
          },
          e: ref__1354,
          f: {
            b: ref__728,
            o: ref__1279,
            p: ref__888,
            q: ref__1279,
            r: ref__1284,
            s: ref__232,
            t: ref__232,
            c: ref__728,
          },
          g: {
            b: ref__731,
            o: ref__1286,
            p: ref__1285,
            q: ref__1286,
            r: ref__1287,
            s: ref__232,
            t: ref__232,
            c: ref__731,
          },
        },
        z: {
          d: {
            b: ref__1289,
            o: ref__1288,
            p: ref__1316,
            q: ref__1288,
            r: {
              k: ref__738,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1289,
          },
          e: ref__1362,
          f: {
            b: ref__739,
            o: ref__1289,
            p: ref__897,
            q: ref__1289,
            r: ref__1294,
            s: ref__232,
            t: ref__232,
            c: ref__739,
          },
          g: {
            b: ref__742,
            o: ref__1296,
            p: ref__1295,
            q: ref__1296,
            r: ref__1297,
            s: ref__232,
            t: ref__232,
            c: ref__742,
          },
        },
      },
      jb: ref__1298,
      g: ref__1318,
      ib: ref__1318,
      mb: {
        u: {
          d: {
            b: ref__1321,
            o: ref__1319,
            p: ref__1301,
            q: ref__1319,
            r: {
              k: ref__1320,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1321,
          },
          e: ref__1322,
          f: {
            b: ref__853,
            o: ref__1301,
            p: ref__1323,
            q: ref__1301,
            r: ref__1324,
            s: ref__232,
            t: ref__232,
            c: ref__853,
          },
          g: {
            b: ref__856,
            o: ref__1326,
            p: ref__1325,
            q: ref__1326,
            r: ref__1196,
            s: ref__232,
            t: ref__232,
            c: ref__856,
          },
        },
        v: {
          d: {
            b: ref__1329,
            o: ref__1327,
            p: ref__1307,
            q: ref__1327,
            r: {
              k: ref__1328,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1329,
          },
          e: ref__1330,
          f: {
            b: ref__862,
            o: ref__1307,
            p: ref__1331,
            q: ref__1307,
            r: ref__1332,
            s: ref__232,
            t: ref__232,
            c: ref__862,
          },
          g: {
            b: ref__865,
            o: ref__1334,
            p: ref__1333,
            q: ref__1334,
            r: ref__1197,
            s: ref__232,
            t: ref__232,
            c: ref__865,
          },
        },
        w: {
          d: {
            b: ref__1337,
            o: ref__1335,
            p: ref__1233,
            q: ref__1335,
            r: {
              k: ref__1336,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1337,
          },
          e: ref__1338,
          f: {
            b: ref__671,
            o: ref__1233,
            p: ref__1339,
            q: ref__1233,
            r: ref__1340,
            s: ref__232,
            t: ref__232,
            c: ref__671,
          },
          g: {
            b: ref__873,
            o: ref__1342,
            p: ref__1341,
            q: ref__1342,
            r: ref__1198,
            s: ref__232,
            t: ref__232,
            c: ref__873,
          },
        },
        x: {
          d: {
            b: ref__1345,
            o: ref__1343,
            p: ref__1312,
            q: ref__1343,
            r: {
              k: ref__1344,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1345,
          },
          e: ref__1346,
          f: {
            b: ref__879,
            o: ref__1312,
            p: ref__1347,
            q: ref__1312,
            r: ref__1348,
            s: ref__232,
            t: ref__232,
            c: ref__879,
          },
          g: {
            b: ref__882,
            o: ref__1350,
            p: ref__1349,
            q: ref__1350,
            r: ref__1199,
            s: ref__232,
            t: ref__232,
            c: ref__882,
          },
        },
        y: {
          d: {
            b: ref__1353,
            o: ref__1351,
            p: ref__1314,
            q: ref__1351,
            r: {
              k: ref__1352,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1353,
          },
          e: ref__1354,
          f: {
            b: ref__888,
            o: ref__1314,
            p: ref__1355,
            q: ref__1314,
            r: ref__1356,
            s: ref__232,
            t: ref__232,
            c: ref__888,
          },
          g: {
            b: ref__891,
            o: ref__1358,
            p: ref__1357,
            q: ref__1358,
            r: ref__1200,
            s: ref__232,
            t: ref__232,
            c: ref__891,
          },
        },
        z: {
          d: {
            b: ref__1361,
            o: ref__1359,
            p: ref__1316,
            q: ref__1359,
            r: {
              k: ref__1360,
              n: ref__303,
              F: ref__1225,
            },
            s: ref__232,
            t: ref__232,
            c: ref__1361,
          },
          e: ref__1362,
          f: {
            b: ref__897,
            o: ref__1316,
            p: ref__1363,
            q: ref__1316,
            r: ref__1364,
            s: ref__232,
            t: ref__232,
            c: ref__897,
          },
          g: {
            b: ref__900,
            o: ref__1366,
            p: ref__1365,
            q: ref__1366,
            r: ref__1201,
            s: ref__232,
            t: ref__232,
            c: ref__900,
          },
        },
      },
    },
  },
  lc: {
    hb: {
      T: {
        d: {
          b: ref__225,
          o: ref__225,
          p: ref__225,
          c: ref__225,
        },
        g: {
          b: ref__1181,
          o: {
            a: [ref__17, ref__1367],
          },
          p: {
            a: [ref__17, ref__1368],
          },
          c: ref__1181,
        },
      },
      u: ref__1421,
      v: ref__1422,
      w: ref__1423,
      x: ref__1424,
      y: ref__1425,
      z: ref__1426,
    },
    jb: {
      T: {
        d: {
          b: ref__223,
          o: ref__1381,
          p: ref__1185,
          c: ref__223,
        },
        g: {
          b: ref__1185,
          o: ref__1419,
          p: ref__1381,
          c: ref__1185,
        },
      },
      u: {
        d: {
          b: ref__259,
          o: ref__1383,
          p: ref__1382,
          c: ref__259,
        },
        g: {
          b: ref__1384,
          o: ref__1382,
          p: ref__1383,
          c: ref__1384,
        },
      },
      v: {
        d: {
          b: ref__263,
          o: ref__1386,
          p: ref__1385,
          c: ref__263,
        },
        g: {
          b: ref__1387,
          o: ref__1385,
          p: ref__1386,
          c: ref__1387,
        },
      },
      w: {
        d: {
          b: ref__265,
          o: ref__1389,
          p: ref__1388,
          c: ref__265,
        },
        g: {
          b: ref__1390,
          o: ref__1388,
          p: ref__1389,
          c: ref__1390,
        },
      },
      x: {
        d: {
          b: ref__269,
          o: ref__1392,
          p: ref__1391,
          c: ref__269,
        },
        g: {
          b: ref__1393,
          o: ref__1391,
          p: ref__1392,
          c: ref__1393,
        },
      },
      y: {
        d: {
          b: ref__273,
          o: ref__1395,
          p: ref__1394,
          c: ref__273,
        },
        g: {
          b: ref__1396,
          o: ref__1394,
          p: ref__1395,
          c: ref__1396,
        },
      },
      z: {
        d: {
          b: ref__277,
          o: ref__1398,
          p: ref__1397,
          c: ref__277,
        },
        g: {
          b: ref__1399,
          o: ref__1397,
          p: ref__1398,
          c: ref__1399,
        },
      },
    },
    g: {
      u: {
        d: {
          b: ref__1400,
          o: ref__1402,
          p: ref__1401,
          c: ref__1400,
        },
        g: {
          b: ref__1401,
          o: ref__1402,
          p: {
            a: [ref__27, ref__1161],
          },
          c: ref__1401,
        },
      },
      v: {
        d: {
          b: ref__1403,
          o: ref__1405,
          p: ref__1404,
          c: ref__1403,
        },
        g: {
          b: ref__1404,
          o: ref__1405,
          p: {
            a: [ref__35, ref__1161],
          },
          c: ref__1404,
        },
      },
      w: {
        d: {
          b: ref__1406,
          o: ref__1408,
          p: ref__1407,
          c: ref__1406,
        },
        g: {
          b: ref__1407,
          o: ref__1408,
          p: {
            a: [ref__16, ref__1161],
          },
          c: ref__1407,
        },
      },
      x: {
        d: {
          b: ref__1409,
          o: ref__1411,
          p: ref__1410,
          c: ref__1409,
        },
        g: {
          b: ref__1410,
          o: ref__1411,
          p: {
            a: [ref__51, ref__1161],
          },
          c: ref__1410,
        },
      },
      y: {
        d: {
          b: ref__1412,
          o: ref__1414,
          p: ref__1413,
          c: ref__1412,
        },
        g: {
          b: ref__1413,
          o: ref__1414,
          p: {
            a: [ref__59, ref__1161],
          },
          c: ref__1413,
        },
      },
      z: {
        d: {
          b: ref__1415,
          o: ref__1417,
          p: ref__1416,
          c: ref__1415,
        },
        g: {
          b: ref__1416,
          o: ref__1417,
          p: {
            a: [ref__67, ref__1161],
          },
          c: ref__1416,
        },
      },
    },
    ib: {
      u: ref__1420,
      v: ref__1420,
      w: ref__1420,
      x: ref__1420,
      y: ref__1420,
      z: ref__1420,
    },
    mb: {
      u: ref__1421,
      v: ref__1422,
      w: ref__1423,
      x: ref__1424,
      y: ref__1425,
      z: ref__1426,
    },
  },
  mc: {
    nc: {
      oc: {
        b: {
          pc: {
            J: 44,
            K: ref__1428,
            L: ref__1429,
            M: ref__1430,
          },
          qc: {
            J: 34,
            K: ref__1428,
            L: ref__1429,
            M: ref__1432,
          },
          rc: {
            J: ref__1433,
            K: ref__1434,
            L: ref__1435,
            M: ref__1436,
          },
          sc: {
            J: ref__1437,
            K: ref__1428,
            L: ref__1435,
            M: ref__1438,
          },
          f: {
            J: ref__1439,
            K: ref__1440,
            L: ref__1435,
            M: ref__1441,
          },
        },
      },
      tc: {
        uc: {
          vc: {
            J: ref__1442,
            K: ref__1434,
            L: ref__1435,
            M: ref__1432,
          },
          d: {
            J: ref__1443,
            K: ref__1434,
            L: ref__1435,
            M: ref__1438,
          },
          wc: ref__1463,
          xc: ref__1452,
        },
        ic: {
          R: ref__1464,
          Q: ref__1474,
          P: ref__1466,
          yc: ref__1460,
        },
        zc: {
          vc: {
            J: ref__1439,
            K: ref__1434,
            L: ref__1435,
            M: ref__1445,
          },
          d: {
            J: ref__1446,
            K: ref__1428,
            L: ref__1429,
            M: ref__1447,
            O: ref__1449,
          },
          wc: ref__1452,
        },
        Ac: ref__1469,
      },
      Bc: {
        Cc: {
          Dc: {
            J: 42,
            K: ref__1434,
            L: ref__1435,
            M: ref__1430,
          },
          Ec: {
            J: 36,
            K: ref__1434,
            L: ref__1435,
            M: "48px",
          },
          Fc: ref__1470,
          Gc: ref__1462,
          Hc: {
            J: ref__221,
            K: ref__1434,
            L: ref__1435,
            M: ref__1445,
            N: ref__1,
            O: ref__1449,
          },
        },
        Ic: {
          vc: {
            J: ref__1439,
            K: ref__1428,
            L: ref__1435,
            M: ref__1441,
          },
          d: ref__1465,
          wc: {
            J: ref__1450,
            K: ref__1428,
            L: ref__1435,
            M: ref__1445,
          },
        },
        Jc: {
          Kc: ref__1460,
          Lc: {
            J: ref__221,
            K: "monospace",
            L: ref__1435,
            M: ref__1447,
          },
        },
      },
    },
    Mc: {
      oc: {
        b: {
          pc: {
            J: ref__1442,
            K: ref__1428,
            L: ref__1429,
            M: ref__1432,
          },
          qc: {
            J: ref__1433,
            K: ref__1428,
            L: ref__1429,
            M: ref__1457,
          },
          rc: {
            J: ref__1443,
            K: ref__1434,
            L: ref__1435,
            M: ref__1436,
          },
          sc: {
            J: ref__1439,
            K: ref__1428,
            L: ref__1435,
            M: ref__1438,
          },
          f: {
            J: ref__1444,
            K: ref__1440,
            L: ref__1435,
            M: ref__1441,
            O: ref__1449,
          },
        },
      },
      tc: {
        uc: {
          vc: ref__1462,
          d: ref__1472,
          wc: ref__1463,
          xc: ref__1468,
        },
        ic: {
          R: ref__1464,
          Q: ref__1465,
          P: ref__1466,
          yc: ref__1460,
        },
        zc: {
          vc: ref__1467,
          d: {
            J: ref__1450,
            K: ref__1428,
            L: ref__1429,
            M: ref__1447,
            O: ref__1449,
          },
          wc: ref__1468,
        },
        Ac: ref__1469,
      },
      Bc: {
        Cc: {
          Dc: ref__1470,
          Ec: {
            J: 25,
            K: ref__1434,
            L: ref__1435,
            M: ref__1436,
          },
          Fc: ref__1472,
          Gc: {
            J: ref__1473,
            K: ref__1434,
            L: ref__1435,
            M: ref__1441,
          },
          Hc: {
            J: ref__1450,
            K: ref__1434,
            L: ref__1435,
            M: ref__1447,
            N: ref__1,
            O: ref__1449,
          },
        },
        Ic: {
          vc: {
            J: ref__1473,
            K: ref__1428,
            L: ref__1435,
            M: ref__1441,
          },
          d: ref__1465,
          wc: ref__1474,
        },
        Jc: {
          Kc: {
            J: ref__1450,
            K: ref__1428,
            L: ref__1435,
            M: ref__1447,
          },
          Lc: {
            J: ref__1459,
            K: "SF Mono",
            L: ref__1435,
            M: ref__1445,
          },
        },
      },
    },
  },
};
function unmangle(obj) {
  if (!invertedJsonKeyMap) {
    invertedJsonKeyMap = {};
    for (let k in jsonKeyMap) invertedJsonKeyMap[jsonKeyMap[k]] = k;
  }
  let processed = new Map();
  function unmangle0(obj) {
    let r = Array.isArray(obj) ? [] : {};
    for (let k in obj) {
      let v = obj[k];
      if (v != null && typeof v === "object") {
        let unmangledV = processed.get(v);
        if (!unmangledV) {
          unmangledV = unmangle0(v);
          processed.set(v, unmangledV);
        }
        r[invertedJsonKeyMap[k] || k] = unmangledV;
      } else {
        r[invertedJsonKeyMap[k] || k] = v;
      }
    }
    return r;
  }
  return unmangle0(obj);
}

export default function (keyPath) {
  let mangledKeys = keyPath.map((k) => jsonKeyMap[k] || k);
  let result = json;
  for (let i = 0; result !== undefined && i < mangledKeys.length; i++) {
    result = result !== null ? result[mangledKeys[i]] : undefined;
  }
  if (result != null && typeof result === "object") result = unmangle(result);
  return result;
}
