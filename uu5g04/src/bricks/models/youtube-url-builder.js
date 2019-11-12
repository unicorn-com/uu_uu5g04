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

class YoutubeUrlBuilder {
  constructor(urlString) {
    this._urlString = urlString;
    let outPut = urlString.match(
      /^((?:https?:)?\/\/)?((?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be)))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(?:[?&](.*))?$/
    );
    if (outPut === null) {
      throw new Error("Invalid youtube url: " + urlString);
    }

    this._protokol = outPut[1];
    this._domain = outPut[2];
    this._path = outPut[3];
    this._videoId = outPut[4];
    let paramsString = outPut[5];
    this._params = {};
    if (paramsString) {
      let params = paramsString.split("&");
      for (let i = 0; i < params.length; i++) {
        params[i] = params[i].replace(/^t=/, "start=");
        params[i] = params[i].replace(/(^start=)(\d+h)?(\d+m)?(\d+s)?/, (...args) => {
          let hours = args[2] !== undefined ? parseInt(args[2]) * 60 * 60 : 0;
          let minutes = args[3] !== undefined ? parseInt(args[3]) * 60 : 0;
          let seconds = args[4] !== undefined ? parseInt(args[4]) : 0;

          return args[1] + (hours + minutes + seconds);
        });
        let parts = params[i].split("=");
        this._params[parts[0]] = parts[1];
      }
    }
  }

  getVideoId = () => {
    return this._videoId;
  };

  setPlayList = playlist => {
    this._params.playlist = playlist;
  };

  getPlayList = () => {
    return this._params.playlist;
  };

  setAutoplay = autoplay => {
    this._params.autoplay = autoplay;
  };

  getAutoplay = () => {
    return this._params.autoplay;
  };

  setControls = disableControls => {
    this._params.controls = disableControls;
  };

  getControls = () => {
    return this._params.controls;
  };

  setLoop = loop => {
    this._params.loop = loop;
  };

  getLoop = () => {
    return this._params.loop;
  };

  setShowInfo = disableInfo => {
    this._params.showinfo = disableInfo;
  };

  getShowInfo = () => {
    return this._params.showinfo;
  };
  //related videos
  setRel = disableRelatedVideos => {
    this._params.rel = disableRelatedVideos;
  };

  getRel = () => {
    return this._params.rel;
  };

  //fullscreen
  setFs = disableFullscreen => {
    this._params.fs = disableFullscreen;
  };

  getFs = () => {
    return this._params.fs;
  };

  setMuted = muted => {
    this._params.mute = muted;
  };

  _buildParams = () => {
    let par = "";
    for (let key in this._params) {
      par += key + "=" + this._params[key] + "&";
    }
    let newPar = par.substring(0, par.length - 1);
    return newPar;
  };

  toString = () => {
    let newPar = this._buildParams();
    return this._protokol + this._domain + this._path + this._videoId + "?" + newPar;
  };

  toEmbedString = () => {
    let newPar = this._buildParams();
    return "https://youtube.com/embed/" + this._videoId + "?" + newPar;
  };
}

export default YoutubeUrlBuilder;
