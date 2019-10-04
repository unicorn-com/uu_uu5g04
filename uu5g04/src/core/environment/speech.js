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

import Tools from "./tools.js";

export class Speech {
  constructor() {
    this._voices = [];
    this._synth = "speechSynthesis" in window ? window.speechSynthesis : undefined;
    this._initialized = false;
  }

  _getChosenVoice(opt) {
    let result;

    if (opt.voice) {
      result = opt.voice;
    } else {
      result = this._voices.find(voice => voice.lang === opt.lang || voice.lang.startsWith(`${opt.lang}-`));

      if (!result) {
        let language = Tools.getLanguage();
        result = this._voices.find(voice => voice.lang === language || voice.lang.startsWith(`${language}-`));
      }

      if (!result) {
        let language = "en";
        result = this._voices.find(voice => voice.lang === language || voice.lang.startsWith(`${language}-`));
      }
    }

    return result;
  }

  getVoices() {
    if (!this._synth) {
      return [];
    }

    return new Promise(resolve => {
      this._voices = this._synth.getVoices();

      if (this._voices.length) {
        resolve(this._voices);
        return;
      }

      this._synth.addEventListener("voiceschanged", () => {
        this._voices = this._synth.getVoices();
        resolve(this._voices);
      });
    });
  }

  async play(text = "", opt = {}) {
    if (!this._synth) {
      return;
    }

    if (!text) {
      this.resume();
      return;
    }

    if (!this._voices.length) await this.getVoices();
    let chosenVoice = this._getChosenVoice({ voice: opt.voice, lang: opt.lang });

    if (chosenVoice) {
      const output = text.replace(/(…|[._]{2,})/, "");
      const utterance = new SpeechSynthesisUtterance(output);

      utterance.addEventListener("error", error => console.error(error));
      utterance.pitch = opt.pitch || 1;
      utterance.rate = opt.rate || 1;
      utterance.volume = opt.volume || 1;
      utterance.lang = chosenVoice.lang;
      utterance.voice = chosenVoice;

      if (this._initialized === false) {
        this._initialized = true;
        this._synth.cancel();
      }
      this._synth.speak(utterance);
    } else {
      console.warn(`Voice localization couldn't be found`);
    }
  }

  resume() {
    if (!this._synth) {
      return;
    }

    this._synth.resume();
  }

  pause() {
    if (!this._synth) {
      return;
    }

    this._synth.pause();
  }

  stop() {
    if (!this._synth) {
      return;
    }

    this._synth.cancel();
  }
}

export default Speech;
