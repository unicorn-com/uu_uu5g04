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

const darkText = "rgba(0,0,0,.87)";
const white = "#FFF";

export const Colors = {
  amber: {
    c50: "#FFF8E1",
    c100: "#FFECB3",
    c200: "#FFE082",
    c300: "#FFD54F",
    c400: "#FFCA28",
    c500: "#FFC107",
    c600: "#FFB300",
    c700: "#FFA000",
    c800: "#FF8F00",
    c900: "#FF6F00",
    inverse: darkText
  },
  black: {
    c50: "rgba(255, 255, 255, 0.60)",
    c100: "rgba(255, 255, 255, 0.40)",
    c500: "rgba(255, 255, 255, 0.20)",
    c600: "rgba(0, 0, 0, 0.20)",
    c700: "rgba(0, 0, 0, 0.40)",
    c800: "rgba(0, 0, 0, 0.60)",
    c900: "rgb(0, 0, 0)",
    inverse: white
  },
  "blue-grey": {
    c50: "#ECEFF1",
    c100: "#CFD8DC",
    c200: "#B0BEC5",
    c300: "#90A4AE",
    c400: "#78909C",
    c500: "#607D8B",
    c600: "#546E7A",
    c700: "#455A64",
    c800: "#37474F",
    c900: "#263238",
    inverse: white
  },
  blue: {
    c50: "#E3F2FD",
    c100: "#BBDEFB",
    c200: "#90CAF9",
    c300: "#64B5F6",
    c400: "#42A5F5",
    c500: "#2196F3",
    c600: "#1E88E5",
    c700: "#1976D2",
    c800: "#1565C0",
    c900: "#0D47A1",
    inverse: white
  },
  brown: {
    c50: "#EFEBE9",
    c100: "#D7CCC8",
    c200: "#BCAAA4",
    c300: "#A1887F",
    c400: "#8D6E63",
    c500: "#795548",
    c600: "#6D4C41",
    c700: "#5D4037",
    c800: "#4E342E",
    c900: "#3E2723",
    inverse: white
  },
  cyan: {
    c50: "#E0F7FA",
    c100: "#B2EBF2",
    c200: "#80DEEA",
    c300: "#4DD0E1",
    c400: "#26C6DA",
    c500: "#00BCD4",
    c600: "#00ACC1",
    c700: "#0097A7",
    c800: "#00838F",
    c900: "#006064",
    inverse: darkText
  },
  "deep-orange": {
    c50: "#FBE9E7",
    c100: "#FFCCBC",
    c200: "#FFAB91",
    c300: "#FF8A65",
    c400: "#FF7043",
    c500: "#FF5722",
    c600: "#F4511E",
    c700: "#E64A19",
    c800: "#D84315",
    c900: "#BF360C",
    inverse: white
  },
  "deep-purple": {
    c50: "#EDE7F6",
    c100: "#D1C4E9",
    c200: "#B39DDB",
    c300: "#9575CD",
    c400: "#7E57C2",
    c500: "#673AB7",
    c600: "#5E35B1",
    c700: "#512DA8",
    c800: "#4527A0",
    c900: "#311B92",
    inverse: white
  },
  green: {
    c50: "#E8F5E9",
    c100: "#C8E6C9",
    c200: "#A5D6A7",
    c300: "#81C784",
    c400: "#66BB6A",
    c500: "#4CAF50",
    c600: "#43A047",
    c700: "#388E3C",
    c800: "#2E7D32",
    c900: "#1B5E20",
    inverse: white
  },
  grey: {
    c50: "#FAFAFA",
    c100: "#F5F5F5",
    c200: "#EEEEEE",
    c300: "#E0E0E0",
    c400: "#BDBDBD",
    c500: "#9E9E9E",
    c600: "#757575",
    c700: "#616161",
    c800: "#424242",
    c900: "#212121",
    inverse: white
  },
  indigo: {
    c50: "#E8EAF6",
    c100: "#C5CAE9",
    c200: "#9FA8DA",
    c300: "#7986CB",
    c400: "#5C6BC0",
    c500: "#3F51B5",
    c600: "#3949AB",
    c700: "#303F9F",
    c800: "#283593",
    c900: "#1A237E",
    inverse: white
  },
  "light-blue": {
    c50: "#E1F5FE",
    c100: "#B3E5FC",
    c200: "#81D4FA",
    c300: "#4FC3F7",
    c400: "#29B6F6",
    c500: "#03A9F4",
    c600: "#039BE5",
    c700: "#0288D1",
    c800: "#0277BD",
    c900: "#01579B",
    inverse: white
  },
  "light-green": {
    c50: "#F1F8E9",
    c100: "#DCEDC8",
    c200: "#C5E1A5",
    c300: "#AED581",
    c400: "#9CCC65",
    c500: "#8BC34A",
    c600: "#7CB342",
    c700: "#689F38",
    c800: "#558B2F",
    c900: "#33691E",
    inverse: darkText
  },
  lime: {
    c50: "#F9FBE7",
    c100: "#F0F4C3",
    c200: "#E6EE9C",
    c300: "#DCE775",
    c400: "#D4E157",
    c500: "#CDDC39",
    c600: "#C0CA33",
    c700: "#AFB42B",
    c800: "#9E9D24",
    c900: "#827717",
    inverse: darkText
  },
  orange: {
    c50: "#FFF3E0",
    c100: "#FFE0B2",
    c200: "#FFCC80",
    c300: "#FFB74D",
    c400: "#FFA726",
    c500: "#FF9800",
    c600: "#FB8C00",
    c700: "#F57C00",
    c800: "#EF6C00",
    c900: "#E65100",
    inverse: darkText
  },
  pink: {
    c50: "#FCE4EC",
    c100: "#F8BBD0",
    c200: "#F48FB1",
    c300: "#F06292",
    c400: "#EC407A",
    c500: "#E91E63",
    c600: "#D81B60",
    c700: "#C2185B",
    c800: "#AD1457",
    c900: "#880E4F",
    inverse: white
  },
  purple: {
    c50: "#F3E5F5",
    c100: "#E1BEE7",
    c200: "#CE93D8",
    c300: "#BA68C8",
    c400: "#AB47BC",
    c500: "#9C27B0",
    c600: "#8E24AA",
    c700: "#7B1FA2",
    c800: "#6A1B9A",
    c900: "#4A148C",
    inverse: white
  },
  red: {
    c50: "#FFEBEE",
    c100: "#FFCDD2",
    c200: "#EF9A9A",
    c300: "#E57373",
    c400: "#EF5350",
    c500: "#F44336",
    c600: "#E53935",
    c700: "#D32F2F",
    c800: "#C62828",
    c900: "#B71C1C",
    inverse: white
  },
  teal: {
    c50: "#E0F2F1",
    c100: "#B2DFDB",
    c200: "#80CBC4",
    c300: "#4DB6AC",
    c400: "#26A69A",
    c500: "#009688",
    c600: "#00897B",
    c700: "#00796B",
    c800: "#00695C",
    c900: "#004D40",
    inverse: white
  },
  white: {
    c50: "rgba(0, 0, 0, 0.40)",
    c100: "rgba(0, 0, 0, 0.20)",
    c500: "rgba(255, 255, 255, 0.20)",
    c600: "rgba(255, 255, 255, 0.40)",
    c700: "rgba(255, 255, 255, 0.60)",
    c800: "rgba(255, 255, 255, 0.80)",
    c900: "#FFF",
    inverse: darkText
  },
  yellow: {
    c50: "#FFFDE7",
    c100: "#FFF9C4",
    c200: "#FFF59D",
    c300: "#FFF176",
    c400: "#FFEE58",
    c500: "#FFEB3B",
    c600: "#FDD835",
    c700: "#FBC02D",
    c800: "#F9A825",
    c900: "#F57F17",
    inverse: darkText
  },
  common: {
    darkText,
    darkIcon: "rgba(0, 0, 0, 0.54)",
    white: "#FFF",
    black: "#000"
  }
};

export default Colors;
