import UU5 from "uu5g04";

const TEST_IDENTITY = {
  id: "a8c5f13c239f820003dd4aff", // JWT claim "sub"
  name: "Test User",
  type: "uuPerson",
  uuIdentity: "1-9999",
  email: "test.user@example.org", // JWT claim "email"
  levelOfAssurance: 0, // JWT claim "loa"
  loginLevelOfAssurance: 1 // index of "loa" in supported acr values
};

// minimal Session class (copying API of OIDC Session)
class MockSession {
  constructor() {
    this.mockReset();
  }
  async login(opts) {
    await this.initPromise;
    this._triggerEvent("identityChange", this.getIdentity());
    return this;
  }
  async logout() {
    await Promise.resolve();
    this._identity = null;
    this._triggerEvent("identityChange", this.getIdentity());
  }
  isAuthenticated() {
    return this._identity != null;
  }
  isExpiring() {
    return this._expiring;
  }
  getIdentity() {
    return this._identity;
  }
  getCallToken() {
    return { token: "token-for-tests", type: "Bearer" };
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
        type: eventName,
        data: payload
      };
      listeners.forEach(fn => fn(event));
    }
  }

  // extra mock methods for controlling the session state
  mockSetPending() {
    this.initComplete = false;
    this.initPromise = new Promise((resolve, reject) => {
      this._initPromiseResolve = resolve;
      this._initPromiseReject = reject;
    });
    this._identity = null;
    this._expiring = false;
    this._expiresAt = 0;
  }
  async mockSetIdentity(identity) {
    this._identity = identity;
    this._triggerEvent("identityChange", this._identity);
    if (!this.initComplete) {
      this.initComplete = true;
      this._initPromiseResolve(this);
      // have to wait for this because IdentityMixin might be waiting for initPromise and we want
      // such listeners to be finished when we return from this fn
      await this.initPromise;
    }
  }
  mockSetExpiring(expiring) {
    if (!this._identity && expiring) {
      console.warn("Cannot set 'expiring' flag on session - use Session.mockSetIdentity(...) first.");
      return;
    }
    this._expiring = expiring;
    this._expiresAt = expiring ? Date.now() + 5 * 60 * 1000 : Date.now() + 12 * 60 * 60 * 1000;
    if (expiring) this._triggerEvent("sessionExpiring", { expiresAt: this._expiresAt });
    else if (this._identity) this._triggerEvent("sessionExtended", { expiresAt: this._expiresAt });
  }
  mockReset() {
    this.initComplete = false;
    this.initPromise = new Promise((resolve, reject) => {
      this._initPromiseResolve = resolve;
      this._initPromiseReject = reject;
    });

    this._identity = null;
    this._listeners = {};

    this._expiring = false;
    this._expiresAt = 0;
  }
}
MockSession.currentSession = new MockSession();

export const Session = {
  TEST_IDENTITY,
  instance: MockSession.currentSession,

  setPending() {
    return Session.instance.mockSetPending();
  },
  // must be async because we need to wait for Session.initPromise
  async setIdentity(identity) {
    return Session.instance.mockSetIdentity(identity);
  },
  setExpiring(expiring = true) {
    return Session.instance.mockSetExpiring(expiring);
  },
  reset() {
    return Session.instance.mockReset();
  }
};

beforeEach(async () => {
  await Session.setIdentity(Session.TEST_IDENTITY);
  UU5.Environment.session = Session.instance;
});
afterEach(async () => {
  UU5.Environment.session = null;
  Session.reset();
  let { _events } = UU5.Environment.EventListener;
  if (_events) _events.delete(Session.instance);
});
