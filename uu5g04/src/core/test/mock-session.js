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

import regeneratorRuntime from "regenerator-runtime";

// minimal Session class (copying API of OIDC Session)
class Session {
  constructor(options) {
    this.initComplete = false;
    this.initPromise = Promise.resolve();
    this.identity = null;
    this.expiring = false;
    this._listeners = {};
  }
  login() {
    return Promise.resolve();
  }
  logout() {
    return Promise.resolve();
  }
  isAuthenticated() {
    return this.identity != null;
  }
  isExpiring() {
    return this.expiring;
  }
  getIdentity() {
    return this.identity;
  }
  getCallToken() {
    return { token: "aaaabbbbcccc0000", type: "Bearer" };
  }
  addListener(eventName, listener) {
    if (!this._listeners[eventName]) this._listeners[eventName] = [];
    this._listeners[eventName].push(listener);
  }
  removeListener(eventName, listener) {
    let listeners = this._listeners[eventName];
    if (listeners) this._listeners[eventName] = listeners.filter(fn => fn !== listener);
  }
  _triggerEvent(eventName, payload) {
    let listeners = this._listeners[eventName];
    if (listeners) {
      let event = {
        name: eventName,
        data: payload
      };
      listeners.forEach(fn => fn(event));
    }
  }
}

// mock Session with extra API for manipulating with session state
class MockSession extends Session {
  /**
   * @param {*} options Session options.
   * @param {*} mockOptions Mock options - { identity: {...} }
   */
  static init(options, mockOptions) {
    let session = new MockSession(options);
    let { identity } = mockOptions || {};
    session.setPending();
    if (identity !== undefined) session.setIdentity(identity);
    return session;
  }
  setPending() {
    if (!this._mockPending) {
      this.identity = null;
      this.expiring = false;
      this.initComplete = false;
      this.initPromise = new Promise(resolve => (this._mockInitPromiseResolve = resolve));
      this._mockPending = true;
      this._triggerEvent("identityChange", this.identity);
    }
  }
  /**
   * @param identity Null or object containing: { id, name, uuIdentity, email, levelOfAssurance, loginLevelOfAssurance }
   */
  async setIdentity(identity) {
    this.identity = identity;
    if (!identity) this.expiring = false;
    if (this._mockPending) {
      this._mockPending = false;
      this.initComplete = true;
      this._mockInitPromiseResolve();
      delete this._mockInitPromiseResolve;
      await this.initPromise;
    }
    this._triggerEvent("identityChange", this.identity);
  }
  setExpiring(expiring = true, eventPayload = null) {
    if (expiring && !this.identity) {
      throw new Error("Cannot set 'expiring=true' for a session because - the user must be authenticated first.");
    }
    this.expiring = expiring;
    if (this.identity) {
      if (expiring) this._triggerEvent("sessionExpiring", eventPayload || { expiresAt: Date.now() + 5 * 60 * 1000 });
      else this._triggerEvent("sessionExtended", eventPayload || { expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
    }
  }
}
MockSession.TEST_IDENTITY = {
  id: "a8c5f13c239f820003dd4aff", // sub
  name: "Test User",
  uuIdentity: "4-3-2-1",
  email: "test.user@example.org",
  levelOfAssurance: 0, // loa
  loginLevelOfAssurance: 1 // acr
};

let currentSession;
Object.defineProperty(MockSession, "currentSession", {
  get() {
    if (!currentSession) currentSession = MockSession.init();
    return currentSession;
  },
  set(session) {
    currentSession = session;
  }
});

module.exports = MockSession;
