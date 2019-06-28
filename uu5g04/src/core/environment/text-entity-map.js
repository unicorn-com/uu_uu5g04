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

const HtmlEntityMap = {
  re: /(&#?[a-z0-9]+;)/g,
  items: {
    '&amp;': '&',
    '&#38;': '&',
    '&apos;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&#34;': '"',
    '&lt;': '<',
    '&#060;': '<',
    '&gt;': '>',
    '&#062;': '>',
    '&hellip;': '…',
    '&#133;': '…',
    '&mdash;': '—',
    '&#8212;': '—',
    '&pi;': 'π',
    '&#8719;': 'π',
    '&reg;': '®',
    '&#174;': '®',
    '&#8730;': '√',
    '&radic;': '√',
    '&#8734;': '∞',
    '&infin;': '∞',
    '&#160;': ' ',
    '&nbsp;': ' ',
    '&#8592;': '←',
    '&larr;': '←',
    '&#8594;': '→',
    '&rarr;': '→',
    '&#8595;': '?',
    '&darr;': '?',
    '&#169;': '©',
    '&copy;': '©',
    '&trade;':'™',
    '&pound;':'£',
    '&euro;':'€',
    '&prod;':'∏',
    '&sum;':'∑',
    '&int;':'∫',
    '&le;':'≤',
    '&ge;':'≥',
    '&#92;': '\\',
    '&sup2;': '²',
    '&sup3;': '³',
  }
};

const AsciiEmojiMap = {
  //:) :D :O :* :( :| :S :Z :$ :P :/   ;-)     :'-(   ,:-(   ,:-)   O:-)       8-) X-)    :-")  :'-)        :,'-(          ";-(   ]:-)   <3
  re:/(:-[)(DOo*|$SsZzP/@]|;-\)|:[',]-\(|,:-\(|,:-\)|[0oO]:-\)|[B8Xx]-\)|:-"\)|:[',]-[)D]|:(?:,'|',)-\(|";-\(|]:-\)|<\/?3)/g,
  items: {
    ":-)": "😃",
    ';-)': "😉",
    ":-(": "😦",
    ":'-(": "😢",
    ":,-(": "😢",
    ":-D": "😄",
    ":-o": "😮",
    ":-O": "😮",
    ":-*": "😘",
    ",:-(": "😓",
    ",:-)": "😅",
    "0:-)": "😇",
    "O:-)": "😇",
    "o:-)": "😇",
    "8-)": "😎",
    "B-)": "😎",
    ':-")': "😊",
    ":-$": "😒",
    ":'-)": "😂",
    ":'-D": "😂",
    ":,-)": "😂",
    ":,-D": "😂",
    ":,'-(": "😭",
    '";-(': "😭",
    ":-/": "😕",
    ":-@": "😡",
    ":-P": "😛",
    ":-S": "😒",
    ":-Z": "😒",
    ":-s": "😒",
    ":-z": "😒",
    ":-|": "😐",
    "]:-)": "😈",
    "X-)": "😆",
    "x-)": "😆",
    '</3': '💔',
    '<3': '💗'
  }
};

const ExtendedEmojiMap = {
  re:/#\(([a-z\-]+)\)/g,
  items: {
    'baby' : '👶',
    'boy' : '👦',
    'girl' : '👧',
    'man' : '👨',
    'woman' : '👩',
    'old-man' : '👴',
    'old-woman' : '👵',
    'cow' : '🐄',
    'horse' : '🐎',
    'tiger' : '🐅',
    'elephant' : '🐘',
    'unicorn-face' : '🦄',
    'pig' : '🐖',
    'pig-face' : '🐷',
    'pig-nose' : '🐽',
    'rat' : '🐀',
    'mouse' : '🐁',
    'hamster-face' : '🐹',
    'bat' : '🦇',
    'chicken' : '🐔',
    'dolphin' : '🐬',
    'fish' : '🐟',
    'crocodile' : '🐊',
    'snake' : '🐍',
    'whale' : '🐋',
    'octopus' : '🐙',
    'spider' : '🕷',
    'panda-face' : '🐼',
    'bear-face' : '🐻',
    'boar' : '🐗',
    'dog' : '🐕',
    'dog-face' : '🐶',
    'cat' : '🐈',
    'cat-face' : '🐱',
    'snail' : '🐌',
    'butterfly' : '🦋',
    'ant' : '🐜',
    'fire' : '🔥',
    'skull-with-crossbones' : '☠',
    'bomb' : '💣',
    'light-bulb' : '💡',
    'hammer' : '🔨',
    'wrench' : '🔧',
    'key' : '🔑',
    'gear' : '⚙',
    'coffin' : '⚰',
    'moai' : '🗿',
    'beer' : '🍺',
    'volcano' : '🌋',
    'pile-of-poo' : '💩',
    'shit' : '💩',
    'broken-heart': '💔',
    'heart': '❤️',
    'love' : '💘',
    'alien':'👽',
    'robot-face':'🤖',
    'skull' : '💀',
    'ghost' : '👻',
    'cloud' : '☁',
    'thumbs-up' : '👍',
    'thumbs-down' : '👎',
    'index-finger' : '☝️',
    'sign-of-the-horns' : '🤘',
    'vulcan-salute' : '🖖',
    'clapping-hands' : '👏',
    'handshake' : '🤝',
    'ok-hand' : '👌',
    'raised-hand' : '✋',
    'five-finger-hand' : '🖐',
    'middle-finger':'🖕',
    'raised-fist' : '✊',
    'victory-hand' : '✌',
    'crossed-fingers' : '🤞',
    'writing-hand' : '✍️',
    'kiss' : '💋',
    'anchor' : '⚓',
    'airplane' : '✈',
    'sailboat' : '⛵',
    'car' : '🚗',
    'truck' : '🚚',
    'train' : '🚆',
    'tractor' : '🚜',
    'ship': '🚢',
    'rocket' : '🚀',
    'helicopter' : '🚁',
    'ball' : '⚽',
    'czechia' : '🇨🇿',
    'united-states' : '🇺🇸',
    'germany' : '🇩🇪',
    'ukraine' : '🇺🇦',
    'slovakia' : '🇸🇰',
    'netherlands' : '🇳🇱',
    'spain' : '🇪🇸',
    'united-kingdom' : '🇬🇧',
    'croatia' : '🇭🇷',
    'skin-light' : '🏻',
    'skin-medium-light' : '🏼',
    'skin-medium' : '🏽',
    'skin-medium-dark' : '🏾',
    'skin-dark' : '🏿'
  }
};

export const TextEntityMap = {
  _re: null,
  _htmlEntity: true,
  get htmlEntity() {return this._htmlEntity},
  set htmlEntity(s) {
    if (s !== this._htmlEntity) {
      this._htmlEntity = s;
      this.recompile();
    }
  },
  _htmlEntityMap : HtmlEntityMap,
  replaceHtmlEntity(text) {
    const reg = new RegExp(`(\\\\)?${this._htmlEntityMap.re.source}`, 'g');
    if (this.htmlEntity) text = text.replace(reg, (m0, m1, m2) => m1 ? m2 : (this._htmlEntityMap.items[m2] || m2));
    return text;
  },

  _asciiEmoji: true,
  get asciiEmoji() {return this._asciiEmoji},
  set asciiEmoji(s) {
    if (s !== this.asciiEmoji) {
      this._asciiEmoji = s;
      this.recompile();
    }
  },
  _asciiEmojiMap : AsciiEmojiMap,
  replaceAsciiEmoji(text) {
    const reg = new RegExp(`(\\\\)?${this._asciiEmojiMap.re.source}`, 'g');
    if (this.asciiEmoji) text = text.replace(reg, (m0, m1, m2) => m1 ? m2 : (this._asciiEmojiMap.items[m2] || m2));
    return text;
  },

  _extendedTextEntity: true,
  get extendedTextEntity() {return this._extendedTextEntity},
  set extendedTextEntity(s) {
    if (s !== this._extendedTextEntity) {
      this._extendedTextEntity = s;
      this.recompile();
    }
  },
  _extendedTextEntityMapList:[ExtendedEmojiMap],
  _textEntityRegexGroups:{},

  replace(text) {
    const eteg = this._textEntityRegexGroups;
    const count = this._reGroupsCount;

    return text.replace(this._re,(match,esc,...groups) => {
      let r = match;
      if (esc)
        r = match.slice(1);
      else
        for (let i = 0; i < count; i++) {
          if (groups[i]) { r = eteg[i].items[groups[i]] || r; break}
        }
      return r;
    });
  },

  addExtendedTextEntityMap(map) {
    if (!this._extendedTextEntityMapList.some( item => item === map )) this._extendedTextEntityMapList.push(map);
  },
  removeExtendedTextEntityMap(map) {
    this._extendedTextEntityMapList = this._extendedTextEntityMapList.filter( item => item !== map)
  },

  get extendedTextEntityMapList() { return this._extendedTextEntityMapList },

  recompile() {
    if (this.htmlEntity || this.asciiEmoji || this.extendedTextEntity) {
      let reA = [];
      let i = 0;
      this._textEntityRegexGroups = {};
      if (this.htmlEntity) {
        reA.push(this._htmlEntityMap.re.source);
        this._textEntityRegexGroups[i] = this._htmlEntityMap;
        i++;
      }
      if (this.asciiEmoji) {
        reA.push(this._asciiEmojiMap.re.source);
        this._textEntityRegexGroups[i] = this._asciiEmojiMap;
        i++;
      }
      if (this.extendedTextEntity) {
        this._extendedTextEntityMapList.forEach(item => {
          reA.push(item.re.source);
          this._textEntityRegexGroups[i] = item;
          i++;
        });
      }
      this._reGroupsCount = i;
      this._re = new RegExp(`(\\\\)?(?:${ reA.join('|') })`,'g');

    } else
      this._re = null;
  }
};

//precompile regex
TextEntityMap.recompile();
