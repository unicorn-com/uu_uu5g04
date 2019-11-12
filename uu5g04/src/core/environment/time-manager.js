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

export class TimeManager {
  constructor() {
    this._intervals = {};
  }

  setInterval(fce, ms) {
    fce.interval = ms;

    let interval = (this._intervals[ms] = this._intervals[ms] || { fces: [] });
    interval.fces.push(fce);

    if (interval.fces.length === 1) {
      interval.setIntervalFce = setInterval(() => this._eachInterval(ms), ms);
    }

    return fce;
  }

  clearInterval(fce) {
    let ms = fce.interval;
    let interval = this._intervals[ms];

    if (interval && interval.fces) {
      let index = interval.fces.indexOf(fce);
      if (index > -1) {
        interval.fces.splice(index, 1);
        if (interval.fces.length === 0 && interval.setIntervalFce) {
          delete this._intervals[ms];
          clearInterval(interval.setIntervalFce);
        }
      }
    }

    return this;
  }

  _eachInterval(ms) {
    this._intervals[ms].fces.forEach(fce => fce());
  }
}

export default TimeManager;
