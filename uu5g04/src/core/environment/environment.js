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

import mod from "module";
import {TextEntityMap} from './text-entity-map.js';
import IconManager from "./icon-manager.js";
import DocumentManager from "./document-manager.js";
import TimeManager from "./time-manager.js";
import Colors from "./colors.js";

var uri = ((mod ? mod.uri : (document.currentScript || Array.prototype.slice.call(document.getElementsByTagName("script"), -1)[0] || {}).src) || "").toString();
let uu5BaseUrl = uri ? uri.replace(/^(.*\/).*/, "$1") : './';

export const Environment = {
  name: process.env.NAME,
  mode: process.env.NODE_ENV,
  version: process.env.VERSION,
  licence: `uu5g04-${process.env.VERSION} © Unicorn\nTerms of Use: https://unicorn.com/tou/uu5g04`,
  basePath: uu5BaseUrl,
  nestingLevelList: ['spa', 'page', 'container', 'bigBoxCollection', 'bigBox', 'boxCollection', 'box', 'smallBoxCollection', 'smallBox', 'inline'],
  nestingLevelStrict: false,
  showProductionWarning: false,
  colorSchemaMap: {
    default: {
      color: 'default'
    },
    primary: {
      color: 'blue-rich',
      src: uu5BaseUrl + `assets/color-schema/blue-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    success: {
      color: 'green',
      src: uu5BaseUrl + `assets/color-schema/green${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    info: {
      color: 'blue',
      src: uu5BaseUrl + `assets/color-schema/blue${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    warning: {
      color: 'orange',
      src: uu5BaseUrl + `assets/color-schema/orange${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    danger: {
      color: 'red',
      src: uu5BaseUrl + `assets/color-schema/red${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },

    yellow: {
      color: 'yellow',
      src: uu5BaseUrl + `assets/color-schema/yellow${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'yellow-rich': {
      color: 'yellow-rich',
      src: uu5BaseUrl + `assets/color-schema/yellow-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    orange: {
      color: 'orange',
      src: uu5BaseUrl + `assets/color-schema/orange${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'orange-rich': {
      color: 'orange-rich',
      src: uu5BaseUrl + `assets/color-schema/orange-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    pink: {
      color: 'pink',
      src: uu5BaseUrl + `assets/color-schema/pink${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'pink-rich': {
      color: 'pink-rich',
      src: uu5BaseUrl + `assets/color-schema/pink-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    red: {
      color: 'red',
      src: uu5BaseUrl + `assets/color-schema/red${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'red-rich': {
      color: 'red-rich',
      src: uu5BaseUrl + `assets/color-schema/red-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    purple: {
      color: 'purple',
      src: uu5BaseUrl + `assets/color-schema/purple${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'purple-rich': {
      color: 'purple-rich',
      src: uu5BaseUrl + `assets/color-schema/purple-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    cyan: {
      color: 'cyan',
      src: uu5BaseUrl + `assets/color-schema/cyan${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'cyan-rich': {
      color: 'cyan-rich',
      src: uu5BaseUrl + `assets/color-schema/cyan-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    blue: {
      color: 'blue',
      src: uu5BaseUrl + `assets/color-schema/blue${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'blue-rich': {
      color: 'blue-rich',
      src: uu5BaseUrl + `assets/color-schema/blue-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    green: {
      color: 'green',
      src: uu5BaseUrl + `assets/color-schema/green${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'green-rich': {
      color: 'green-rich',
      src: uu5BaseUrl + `assets/color-schema/green-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    brown: {
      color: 'brown',
      src: uu5BaseUrl + `assets/color-schema/brown${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'brown-rich': {
      color: 'brown-rich',
      src: uu5BaseUrl + `assets/color-schema/brown-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    amber: {
      color: 'amber',
      src: uu5BaseUrl + `assets/color-schema/amber${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'amber-rich': {
      color: 'amber-rich',
      src: uu5BaseUrl + `assets/color-schema/amber-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'deep-orange': {
      color: 'deep-orange',
      src: uu5BaseUrl + `assets/color-schema/deep-orange${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'deep-orange-rich': {
      color: 'deep-orange-rich',
      src: uu5BaseUrl + `assets/color-schema/deep-orange-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'deep-purple': {
      color: 'deep-purple',
      src: uu5BaseUrl + `assets/color-schema/deep-purple${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'deep-purple-rich': {
      color: 'deep-purple-rich',
      src: uu5BaseUrl + `assets/color-schema/deep-purple-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    indigo: {
      color: 'indigo',
      src: uu5BaseUrl + `assets/color-schema/indigo${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'indigo-rich': {
      color: 'indigo-rich',
      src: uu5BaseUrl + `assets/color-schema/indigo-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    teal: {
      color: 'teal',
      src: uu5BaseUrl + `assets/color-schema/teal${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'teal-rich': {
      color: 'teal-rich',
      src: uu5BaseUrl + `assets/color-schema/teal-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'light-green': {
      color: 'light-green',
      src: uu5BaseUrl + `assets/color-schema/light-green${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'light-green-rich': {
      color: 'light-green-rich',
      src: uu5BaseUrl + `assets/color-schema/light-green-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'light-blue': {
      color: 'light-blue',
      src: uu5BaseUrl + `assets/color-schema/light-blue${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'light-blue-rich': {
      color: 'light-blue-rich',
      src: uu5BaseUrl + `assets/color-schema/light-blue-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'lime': {
      color: 'lime',
      src: uu5BaseUrl + `assets/color-schema/lime${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'lime-rich': {
      color: 'lime-rich',
      src: uu5BaseUrl + `assets/color-schema/lime-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'blue-grey': {
      color: 'blue-grey',
      src: uu5BaseUrl + `assets/color-schema/blue-grey${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'blue-grey-rich': {
      color: 'blue-grey-rich',
      src: uu5BaseUrl + `assets/color-schema/blue-grey-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    grey: {
      color: 'grey',
      src: uu5BaseUrl + `assets/color-schema/grey${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    'grey-rich': {
      color: 'grey-rich',
      src: uu5BaseUrl + `assets/color-schema/grey-rich${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    black: {
      color: 'black',
      src: uu5BaseUrl + `assets/color-schema/black${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    white: {
      color: 'white',
      src: uu5BaseUrl + `assets/color-schema/white${process.env.NODE_ENV === 'production' ? '.min' : ''}.css`
    },
    custom: {
      color: 'custom'
    }
  },
  colors: Colors,
  // External component calls
  calls: {},
  // External component limits
  limits: {},
  // Central component register (ccr)
  ccr: {
    byKey: {}
  },
  ccrStrict: false,
  CCRKEY_PAGE: 'UU5.Bricks.Page',
  CCRKEY_ROUTER: 'UU5.Common.Router',
  COMPONENT_REGISTRY_URL: 'https://uuos9.plus4u.net/uu-uu5libraryregistryg01-main/85849867896916817-fe96c133c895434bbd4d5b24831483f3/getLibrary', //PROD
  // COMPONENT_REGISTRY_URL: 'https://uuos9.plus4u.net/uu-uu5componentregistryg01-main/84723967990075193-eb48e82fb0ab409b9dd2fe4f956226dc/getLibrary', //DEV
  CDN_URL: 'https://cdn.plus4u.net',
  fontCssUrl: 'https://cdn.plus4u.net/libs/clearsans/2.0.0/fonts/clear-sans.min.css',
  resizeInterval: 150,
  holdTimeout: 500,
  holdDiff: 20,
  uu5DataMap: {},
  languages: [{ language: 'cs', q: 1.0 }, { language: 'sk', q: 0.7 }, { language: 'en', q: 0.4 }],
  languageList: {
    cs: {
      flag: uu5BaseUrl + 'assets/flags/cz.png',
      language: 'Česky'
    },
    nl: {
      flag: uu5BaseUrl + 'assets/flags/nl.png',
      language: 'Nederlands'
    },
    en: {
      flag: uu5BaseUrl + 'assets/flags/gb.png',
      language: 'English'
    },
    'en-gb': {
      flag: uu5BaseUrl + 'assets/flags/gb.png',
      language: 'English GB'
    },
    'en-us': {
      flag: uu5BaseUrl + 'assets/flags/us.png',
      language: 'English US'
    },
    fr: {
      flag: uu5BaseUrl + 'assets/flags/fr.png',
      language: 'Français'
    },
    de: {
      flag: uu5BaseUrl + 'assets/flags/de.png',
      language: 'Deutsch'
    },
    pl: {
      flag: uu5BaseUrl + 'assets/flags/pl.png',
      language: 'Polski'
    },
    ru: {
      flag: uu5BaseUrl + 'assets/flags/ru.png',
      language: 'Pусский'
    },
    sk: {
      flag: uu5BaseUrl + 'assets/flags/sk.png',
      language: 'Slovensky'
    },
    es: {
      flag: uu5BaseUrl + 'assets/flags/es.png',
      language: 'Español'
    },
    uk: {
      // Ukraine
      flag: uu5BaseUrl + 'assets/flags/ua.png',
      language: 'Українська'
    },
    it: {
      // Italian
      flag: uu5BaseUrl + 'assets/flags/it.png',
      language: 'Italiano'
    }
    // "de-be": {
    //   // Belgie
    //   flag: uu5BaseUrl + 'assets/flags/be.png',
    //   language: "Deutsch"
    // },
    // bg: {
    //   // Bulgaria
    //   flag: uu5BaseUrl + 'assets/flags/bg.png',
    //   language: "български"
    // },
    // "de-at": {
    //   // Austria
    //   flag: uu5BaseUrl + 'assets/flags/at.png',
    //   language: "Deutsch"
    // },
    // zh: {
    //   // China
    //   flag: uu5BaseUrl + 'assets/flags/cn.png',
    //   language: "汉语"
    // },
    // dk: {
    //   // Denmark
    //   flag: uu5BaseUrl + 'assets/flags/dk.png',
    //   language: "Dansk"
    // },
    // be: {
    //   // Belarus
    //   flag: uu5BaseUrl + 'assets/flags/by.png',
    //   language: "беларуская"
    // },
    // ee: {
    //   // Estonia
    //   flag: uu5BaseUrl + 'assets/flags/ee.png',
    //   language: "Eesti keel"
    // },
    // fi: {
    //   // Finland
    //   flag: uu5BaseUrl + 'assets/flags/fi.png',
    //   language: "Suomi"
    // },
    // el: {
    //   // Greece
    //   flag: uu5BaseUrl + 'assets/flags/gr.png',
    //   language: "Ελληνική"
    // },
    // hr: {
    //   // Croatia
    //   flag: uu5BaseUrl + 'assets/flags/hr.png',
    //   language: "Hrvatski"
    // },
    // hu: {
    //   // Hungary
    //   flag: uu5BaseUrl + 'assets/flags/hu.png',
    //   language: "Magyar"
    // },
    // "de-ch": {
    //   // Switzerland
    //   flag: uu5BaseUrl + 'assets/flags/ch.png',
    //   language: "Deutsch"
    // },
    // id: {
    //   // Indonesia
    //   flag: uu5BaseUrl + 'assets/flags/id.png',
    //   language: "Indonesia"
    // },
    // is: {
    //   // Iceland
    //   flag: uu5BaseUrl + 'assets/flags/is.png',
    //   language: "Íslenska"
    // },
    // jp: {
    //   // Japan
    //   flag: uu5BaseUrl + 'assets/flags/jp.png',
    //   language: "日本語"
    // },
    // kr: {
    //   // Korea
    //   flag: uu5BaseUrl + 'assets/flags/kr.png',
    //   language: "한국어"
    // },
    // lt: {
    //   // Lithuania
    //   flag: uu5BaseUrl + 'assets/flags/lt.png',
    //   language: "Lietuvių"
    // },
    // lv: {
    //   // Latvia
    //   flag: uu5BaseUrl + 'assets/flags/lv.png',
    //   language: "Latviešu valoda"
    // },
    // no: {
    //   // Norway
    //   flag: uu5BaseUrl + 'assets/flags/no.png',
    //   language: "Norsk"
    // },
    // pt: {
    //   // Portugal
    //   flag: uu5BaseUrl + 'assets/flags/pt.png',
    //   language: "Português"
    // },
    // ro: {
    //   // Romania
    //   flag: uu5BaseUrl + 'assets/flags/ro.png',
    //   language: "Română"
    // },
    // sr: {
    //   // Serbia
    //   flag: uu5BaseUrl + 'assets/flags/rs.png',
    //   language: "Cрпски"
    // },
    // sv: {
    //   // Sweden
    //   flag: uu5BaseUrl + 'assets/flags/se.png',
    //   language: "Svenska"
    // },
    // sl: {
    //   // Slovenia
    //   flag: uu5BaseUrl + 'assets/flags/si.png',
    //   language: "Slovenija"
    // },
    // th: {
    //   // Thailand
    //   flag: uu5BaseUrl + 'assets/flags/th.png',
    //   language: "ภาษาไทย"
    // },
    // tr: {
    //   // Turkish
    //   flag: uu5BaseUrl + 'assets/flags/tr.png',
    //   language: "Türkçe"
    // },
    // vi: {
    //   // 	Viet Nam
    //   flag: uu5BaseUrl + 'assets/flags/vn.png',
    //   language: "Tiếng Việt"
    // }

  },
  defaultLanguage: 'en-gb',
  // URI for log errors
  //logErrorUrl: null, //TODO: deprecated
  // function for log errors
  logErrorFunction: null,
  hardSpace: {
    regExp: '\&nbsp;',
    nbSpace: "\u00a0",
    nbHyphen: "\u2011",
    lsiReplacer: {}
  },

  textCorrector: false,

  textEntityMap: TextEntityMap,
  textEntityReplace: true,

  // {'cs-CZ': {decimalSeparator: ',', thousandSeparator: '.'}}
  numberFormat: {},

  // {'cs-CZ': 'dd.MM.yyyy HH:mm:ss.SSS'}
  dateTimeFormat: {},
  dateTimeZone: -new Date().getTimezoneOffset() / 60,
  //uu5String tags regExp
  uu5StringTagsRegExp: null,

  session: null,
  urlBuilder: null,

  library: {},
  useLibraryRegistry: true,
  runtimeLibraries: {},
  basePathAttrName: "data-uu-app-base",
  trustedDomainRegexp: String.raw`^https://([^./]*[.])?plus4u[.]net(?=[:/]|$)` // it's string so that app can re-configure it via JSON during app deploy
};

// TODO: backward compatibility
Environment.useComponentRegistry = Environment.useLibraryRegistry;

Environment.DocumentManager = DocumentManager;
Environment.TimeManager = new TimeManager();

/********** ICONS start **********/
Environment.iconLibraries = {
  mdi: "https://cdn.plus4u.net/libs/materialdesignicons/3.5.95/css/materialdesignicons.min.css",  
  glyphicon: "https://cdn.plus4u.net/libs/bootstrap/3.3.7/fonts/glyphicons.min.css",
  fa: "https://cdn.plus4u.net/libs/font-awsome/4.7.0/css/font-awesome.min.css",
  uu5: "https://cdn.plus4u.net/uu-uu5g04-icons/1.0.0/uu5g04_icons.min.css",
  plus4u: "https://cdn.plus4u.net/plus4u-iconsg01/1.0.0/plus4u_iconsg01.min.css",
  plus4u5: "https://cdn.plus4u.net/uu-plus4u5g01-icons/1.0.0/uu_plus4u5g01_icons.min.css",
  uubml: "https://cdn.plus4u.net/uu-uubmldrawg03-icons/1.0.0/uubmldrawg03_icons.min.css"
};

Environment.IconManager = new IconManager(Environment.iconLibraries);

Environment.addIconLibrary = (iconsKey, src) => {
  Environment.iconLibraries[iconsKey] = src;
};

Environment.removeIconLibrary = (iconsKey) => {
  delete Environment.iconLibraries[iconsKey];
};

Environment.clearIconLibraries = () => {
  for (let iconsKey in Environment.iconLibraries) delete Environment.iconLibraries[iconsKey];
};
/********** ICONS end **********/

Environment.addLibrary = (libraryName, params) => {
  //TODO check if exist and merge
  Environment.library[libraryName] = params;
  return this;
};

Environment.getLibrary = (libraryName) => {
  let library = Environment.library;
  if (libraryName) {
    library = library[libraryName];
  }
  return library;
};

// library = {name, version}
Environment.addRuntimeLibrary = (library) => {
  library.name && (Environment.runtimeLibraries[library.name] = library);
  return this;
};
Environment.addRuntimeLibrary({ name: Environment.name, version: Environment.version });

Environment.getRuntimeLibraries = () => {
  return Environment.runtimeLibraries;
};

Environment.colorSchema = Object.keys(Environment.colorSchemaMap);

Environment.isDevelopment = function () {
  return Environment.mode === 'development';
};

Environment.isProduction = function () {
  return Environment.mode === 'production';
};

// Version
process.env.NODE_ENV !== "test" && console.log(Environment.licence);

Environment.changeColorSchema = function (key, colorSchema, src) {
  Environment.colorSchemaMap[key] = Environment.colorSchemaMap[key] || {};
  // save original color - only first time to prevent rewrite original value
  if (Environment.colorSchemaMap[key].originalColor === undefined) {
    Environment.colorSchemaMap[key].originalColor = Environment.colorSchemaMap[key].color;
    Environment.colorSchemaMap[key].originalSrc = Environment.colorSchemaMap[key].src;
  }
  Environment.colorSchemaMap[key].color = colorSchema;
  const colorSchemaObj = Environment.colorSchemaMap[colorSchema];
  src = src || ( colorSchemaObj ? colorSchemaObj.originalSrc || colorSchemaObj.src : null);
  src && (Environment.colorSchemaMap[key].src = src);
  Environment.colorSchema = Object.keys(Environment.colorSchemaMap);
  return this;
};

Environment.getColorSchema = function (key) {
  let colorSchema = Environment.colorSchemaMap[key];
  let color = null;

  if (colorSchema) {
    color = colorSchema.color;

    Environment.loadedColors = Environment.loadedColors || {};
    if (colorSchema.src && !Environment.loadedColors[color]) {
      Environment.loadedColors[color] = true;
      Environment.DocumentManager.addUniqueCss(colorSchema.src);
    }
  }

  return color;
};

Environment.search = (searchedTexts) => {
  let el = Environment.EventListener || window.UU5.Environment.EventListener;
  el.triggerHighlight(searchedTexts);
  return this;
};

Environment.setDateTimeFormat = (format) => {
  let el = Environment.EventListener || window.UU5.Environment.EventListener;
  el.triggerDateTime({ format: format });
  return this;
};

Environment.setDateTimeCountry = (country) => {
  let el = Environment.EventListener || window.UU5.Environment.EventListener;
  el.triggerDateTime({ country: country });
  return this;
};

Environment.setDateTimeZone = (timeZone) => {
  let el = Environment.EventListener || window.UU5.Environment.EventListener;
  el.triggerDateTime({ timeZone: timeZone });
  return this;
};

Environment.setDateTimeOptions = (opt) => {
  let el = Environment.EventListener || window.UU5.Environment.EventListener;
  el.triggerDateTime(opt);
  return this;
};

Environment.setNumberCountry = (country) => {
  let el = Environment.EventListener || window.UU5.Environment.EventListener;
  el.triggerNumber({ country: country });
  return this;
};

Environment.setNumberOptions = (opt) => {
  let el = Environment.EventListener || window.UU5.Environment.EventListener;
  el.triggerNumber(opt);
  return this;
};

Environment.getPage = () => Environment.page;
Environment.getRouter = () => Environment.router;

Environment.setRoute = (/*route, params, fragment, ..., setStateCallback*/ ...args) => {
  return Environment.getRouter().setRoute(...args);
};

Environment.hardSpace.lsiReplacer['cs-cz'] = function (text) {

  var newText = text.replace(new RegExp(Environment.hardSpace.regExp, 'g'), Environment.hardSpace.nbSpace);

  var nbSpace = Environment.hardSpace.nbSpace;

  var wordsWithSpace = {
    after: ["s", "k", "v", "z", "a", "i", "o", "u"],
    degreesBefore: ["bc.", "bca.", "ing.", "ing.arch.", "mudr.", "mvdr.", "mga.", "mgr.", "judr.", "phdr.", "rndr.", "pharmdr.", "thlic.", "thdr.", "prof.", "doc.", "paeddr.", "dr.", "phmr."],
    degreesAfter: ["ph.d.", "th.d.", "csc.", "drsc.", "dis."],
    units: ["%", "Kč", "€", "m", "g", "l", "q", "t", "w", "J", "ks", "mm", "cm", "km", "mg", "dkg", "kg", "ml", "cl", "dl", "hl", "m3", "km3", "mm2", "cm2", "dm2", "m2", "km2", "ha", "Pa", "hPa", "kPa", "MPa", "bar", "mbar", "nbar", "atm", "psi", "kW", "MW", "HP", "m/s", "km/h", "m/min", "MPH", "cal", "Wh", "kWh", "kp·m", "°C", "°F", "kB", "dB", "MB", "GB", "kHz", "MHz"]
  };

  var spaceSplitter = newText.split(' ');
  var resultText = '';
  for (var i = 0; i < spaceSplitter.length; i++) {
    var prevPart = spaceSplitter[i];
    var prevPartLowerCase = prevPart.toLowerCase();
    var lastChar = prevPart[prevPart.length - 1];
    var nextPart = spaceSplitter[i + 1];
    var firstChar = nextPart && nextPart[0];

    resultText += prevPart === '' ? ' ' : prevPart;

    if (nextPart) {
      if (
        // it is word with space after
        wordsWithSpace.after.indexOf(prevPartLowerCase) > -1 ||

        // dot and next char is not upper - not end of sentence
        '.' === lastChar && firstChar && firstChar !== firstChar.toUpperCase() && !isFinite(firstChar) && wordsWithSpace.degreesAfter.indexOf(prevPart.toLowerCase()) === -1 && spaceSplitter[i - 3] !== "dr." && spaceSplitter[i - 2] !== "h." && prevPart !== "c."

        // numbers split by space
        || isFinite(prevPart) && isFinite(nextPart)

        // degrees before name
        || wordsWithSpace.degreesBefore.indexOf(prevPartLowerCase) > -1

        // degrees after name
        || wordsWithSpace.degreesAfter.indexOf(nextPart.toLowerCase()) > -1

        // between number and unit
        || prevPart.match(/^\d+$/g) && wordsWithSpace.units.indexOf(nextPart) > -1) {
        resultText += nbSpace;

        // degree dr. h. c.
      } else if (nextPart === "dr." && spaceSplitter[i + 2] === "h." && spaceSplitter[i + 3] === "c." || prevPart === "dr." && nextPart === "h." && spaceSplitter[i + 2] === "c." || spaceSplitter[i - 1] === "dr." && prevPart === "h." && nextPart === "c.") {
        resultText += nbSpace;
      } else {
        resultText += " ";
      }
    }
  }

  // space after dot or comma
  //return resultText.replace(/([,.])([a-zA-Z0-9])/, "$1 $2");
  return resultText;
};

Environment.hardSpace.lsiReplacer['code'] = function (text) {
  var resultText = text;

  resultText = resultText.replace(/ /g, Environment.hardSpace.nbSpace);
  resultText = resultText.replace(/-/g, Environment.hardSpace.nbHyphen);

  return resultText;
};

Environment.setSession = (session) => {
  Environment.session = session.currentSession || session;
};

Environment.getSession = () => {

  let session;

  if (Environment.session) {
    session = Environment.session;
  } else {
    let Oidc = window.UuOidc;
    if (typeof window.SystemJS != "undefined") {
      if (window.SystemJS.has(window.SystemJS.normalizeSync("uu_oidc"))) {
        Oidc = window.SystemJS.get(window.SystemJS.normalizeSync("uu_oidc"));
      } else if (window.SystemJS.has(window.SystemJS.normalizeSync("uu_oidcg01"))) {
        Oidc = window.SystemJS.get(window.SystemJS.normalizeSync("uu_oidcg01"));
      }
    }

    if (Oidc) {
      session = Environment.session = Oidc.Session.currentSession || Oidc.Session;
    }
  }

  return session || null;
};

Environment.App = {
  vucConfig: {
    errorRoute: null
  },
  callConfig: {
    authorizeVuc: () => {
      console.error(`Please add to UU5.Environment.App.callConfig.authorizeVuc your own function as:
        (dtoIn) => {
          $.ajax({
          url: dtoIn.data.name ? '/' + dtoIn.data.name : window.location.href,
          type: 'get',
          cache: false,
          contentType: 'application/json',
          data: { data: dtoIn.data }
          }).done(doneDtoOut => {
            if (typeof dtoIn.done === 'function') {
              dtoIn.done(typeof doneDtoOut == 'string' && doneDtoOut.length ? JSON.parse(doneDtoOut) : doneDtoOut);
            }
          }).fail(failDtoOut => {
            UU5.Common.Tools.error('authorizeVuc error', {dtoIn: dtoIn});
            if (typeof dtoIn.fail === 'function') {
              dtoIn.fail(typeof failDtoOut == 'string' && failDtoOut.length ? JSON.parse(failDtoOut) : failDtoOut);
            }
          });
        }
      `)
    }
  }
};

Environment.Lsi = {};
Environment.Lsi.Forms = {};
Environment.Lsi.Common = {};

Environment.getNestingLevelList = (levelFrom, levelTo) => {
  let begin = Environment.nestingLevelList.indexOf(levelFrom);
  (begin < 0) && (begin = 0);
  let end = Environment.nestingLevelList.indexOf(levelTo) + 1;
  (end <= begin) && (end = Environment.nestingLevelList.length);
  return Environment.nestingLevelList.slice(begin, end);
};

Environment.getUrlBuilder = () => {
  return Environment.urlBuilder;
};

Environment.setUrlBuilder = (urlBuilder) => {
  Environment.urlBuilder = urlBuilder;
};

Environment.tagCalls = {};

Environment.getAppBasePath = () => {
  let baseEl = document.querySelector("base");
  return baseEl ? baseEl.getAttribute(Environment.basePathAttrName) : null;
};

Environment.getScrollBarWidth = () => {
  if (Environment._scrollBarWidth === undefined) {
    let div = document.createElement("div");
    div.style.overflow = "scroll";
    div.style.visibility = "hidden";
    div.style.position = "absolute";
    div.style.width = "100px";
    div.style.height = "100px";

    // temporarily creates a div into DOM
    document.body.appendChild(div);
    try {
      Environment._scrollBarWidth = div.offsetWidth - div.clientWidth;
    } finally {
      document.body.removeChild(div);
    }
  }
  return Environment._scrollBarWidth;
};

let trustedDomainRegexp;
Environment.isTrustedDomain = (url) => {
  if (!trustedDomainRegexp) trustedDomainRegexp = new RegExp(Environment.trustedDomainRegexp, "i");
  let absUrl;
  if (url) {
    // absolutize URL
    let a = document.createElement("a");
    a.href = url; // browser re-normalizes on assignment
    absUrl = a.href;
  }
  let curBase = location.protocol + "//" + location.host + "/";
  // can send token if the target domain matches regexp or if it's current domain
  return absUrl && (absUrl.match(trustedDomainRegexp) || absUrl.substr(0, curBase.length) === curBase);
};

Environment.isPageVisible = () => {
  return !document.hidden;
};

Environment.isPageFocused = () => {
  return document.hasFocus();
};

Environment.getScrollBarWidth = () => {
  if (Environment._scrollBarWidth === undefined) {
    let width = 0;
    let div = document.createElement("div");
    div.style.overflow = "scroll";
    div.style.visibility = "hidden";
    div.style.position = 'absolute';
    div.style.width = '100px';
    div.style.height = '100px';

    // temporarily creates a div into DOM
    document.body.appendChild(div);
    try {
      Environment._scrollBarWidth = div.offsetWidth - div.clientWidth;
    } finally {
      document.body.removeChild(div);
    }
  }
  return Environment._scrollBarWidth;
};

Environment._fixedOffset = 0; // Height of the biggest permanently fixed element (usually Heading)

export default Environment;
