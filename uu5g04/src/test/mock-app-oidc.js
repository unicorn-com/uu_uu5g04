import { Session as TestSession } from "./session.js";

// TODO Mocking UuApp Session should be somewhere else (uu_appg01-test?).
try {
  // NOTE Mocking uu_appg01_oidc via jest.doMock can be done only if that module is actually
  // installed. If it is not, Jest resolver will throw an error which has no code so
  // we would have to check the message to identify this scenario (this is the case if the module
  // is re-mapped via moduleNameMapper)
  //   => instead try to resolve the module's package.json which will throw standard error
  // with code MODULE_NOT_FOUND and skip mocking in such case.
  require.resolve("uu_appg01_oidc/package.json");

  jest.doMock("uu_appg01_oidc", () => {
    let Oidc = jest.requireActual("uu_appg01_oidc");

    // INFO
    // 1. MockAuthenticationService uses instance of Session. These store mocked state of authentication.
    // 2. Then there is MockSession which conforms to uu5g04 requirements about session (IdentityMixin, SessionMixin).
    //    From the point of view of uu_appg01_oidc this is "legacyApi" and is forwarded to classes in point 1.
    // 3. Additionally, MockSession has API for managing session state in tests as needed by uu5g04-test.

    class MockAuthenticationService {
      static _listeners = {};
      static _expiresAt = 0;
      static _expiring = false;
      static initComplete = false;
      static initPromise = new Promise((resolve, reject) => {
        MockAuthenticationService._initPromiseResolve = resolve;
        MockAuthenticationService._initPromiseReject = reject;
      });

      static getServiceName() {
        return "oidcg02";
      }
      static restoreSession() {
        return this.initPromise;
      }
      static isRestoringSession() {
        return !this.initComplete;
      }
      static addListener(eventName, listener) {
        if (!this._listeners[eventName]) this._listeners[eventName] = [];
        this._listeners[eventName].push(listener);
        return this.removeListener.bind(this, eventName, listener);
      }
      static removeListener(eventName, listener) {
        let listeners = this._listeners[eventName];
        if (listeners) this._listeners[eventName] = listeners.filter(fn => fn !== listener);
      }
      static async authenticate() {
        await this.initPromise;
        this._triggerEvent("sessionChanged", oidcSession);
        return oidcSession;
      }
      static isAuthenticating() {
        return !this._initComplete;
      }
      static getCurrentSession() {
        return oidcSession;
      }
      static isSessionExpiring() {
        return !!this._expiring;
      }

      static _triggerEvent(eventName, payload) {
        let listeners = this._listeners[eventName];
        if (listeners) {
          let event = {
            type: eventName,
            data: payload
          };
          listeners.forEach(fn => fn(event));
        }
      }
    }
    for (let k of Object.getOwnPropertyNames(Oidc.AuthenticationService)) {
      if (MockAuthenticationService[k] === undefined) {
        let origFn = Oidc.AuthenticationService[k];
        if (typeof origFn !== "function" || k === "constructor") continue;
        MockAuthenticationService[k] = jest.fn();
      }
    }
    // override real method on real AuthnSvc because uu_appg01_oidc automatically performs
    // restoreSession() on its own
    Oidc.AuthenticationService.restoreSession = async () => oidcSession;

    class Session {
      constructor() {
        this._identity = null;
        this._attributes = {};
        this._idToken = "token-for-tests";
      }

      // getId() {}
      // getAuthenticationId() {}
      // getAuthenticationTime() {}
      getAuthenticationLevelOfAssurance() {
        return this._identity ? this._identity.loginLevelOfAssurance : null;
      }
      getIdentity() {
        if (!this._identity) return this._identity;
        return new Identity(this._identity.uuIdentity, this._identity);
      }
      getClientIdentity() {}
      getApplicationIdentity() {}
      isAuthenticated() {
        return !!this._identity;
      }

      getCallTokenScope() {}
      async getCallToken(scope, opts = {}) {
        return (opts && opts.excludeAuthenticationType ? "" : "Bearer ") + this._idToken;
      }
      async close() {
        this._identity = null;
        return MockAuthenticationService._triggerEvent("sessionChanged", this);
      }
      assertTrustiness() {}
      getAttribute(name) {
        if (!this._identity) return;
        let map = {
          email: this._identity.email,
          sub: this._identity.id,
          loa: this._identity.levelOfAssurance
          // loginLevelOfAssurance: supportedAcrValues.indexOf(this._identity.levelOfAssurance),
        };
        return map[name];
      }

      getLogoutUri() {}
      getAuthenticationContext() {}
      getExpiresAt() {
        return MockAuthenticationService._expiresAt;
      }
      getState() {}
    }

    class Identity {
      constructor(uuIdentity, data) {
        this._uuIdentity = uuIdentity;
        if (typeof data === "string") {
          this._name = data;
        } else if (data) {
          this._name = data.name;
          this._type = data.type;
          this._levelOfAssurance = data.levelOfAssurance;
          this._loginLevelOfAssurance = data.loginLevelOfAssurance;
        }
      }

      getUuIdentity() {
        return this._uuIdentity;
      }

      getName() {
        return this._name;
      }

      getType() {
        return this._type;
      }

      getLevelOfAssurance() {
        return this._levelOfAssurance;
      }

      // TODO Only for backward compatibility, drop for "1.0.0" release
      getUUIdentity() {
        return this.getUuIdentity();
      }
    }

    // addLegacyAPI methods (copied from uu_appg01_oidc's oidcg01-session-wrapper.js)
    Object.defineProperty(Session, "currentSession", {
      get() {
        return mockSession;
      }
    });
    Object.defineProperty(Session, "initComplete", {
      get() {
        return !MockAuthenticationService.isRestoringSession();
      }
    });
    Object.defineProperty(Session, "initPromise", {
      get() {
        return MockAuthenticationService.restoreSession().then(() => mockSession);
      }
    });

    function addLegacyApi(session, AuthenticationService) {
      Object.defineProperty(session, "initComplete", {
        get() {
          return !AuthenticationService.isRestoringSession();
        }
      });
      Object.defineProperty(session, "initPromise", {
        get() {
          return AuthenticationService.restoreSession().then(() => session);
        }
      });

      // NOTE In optimal case this wrapper would always use AuthenticationService.getCurrentSession().
      // However that's not possible if we're finishing session restore because the "sessionChanged" event
      // is triggerred sooner than AuthnService._primaryProvider gets updated. So if an app uses
      // e.g. getIdentity() inside of the sessionChanged event handler, we would forward it to AS.getCurrentSession()
      // which would return empty session / session from not-yet-updated _primaryProvider.
      // => during events use the g02 session instance which was sent to the event, otherwise use getCurrentSession()
      let runningG02Session = null;
      const getG02Session = () => runningG02Session || AuthenticationService.getCurrentSession();

      session.getIdentity = function() {
        let g02Session = getG02Session();
        let identity = g02Session.getIdentity();
        if (!identity) return identity;
        identity.id = g02Session.getAttribute("sub");
        identity.name = identity.getName();
        identity.email = g02Session.getAttribute("email");
        identity.uuIdentity = identity.getUuIdentity();
        identity.levelOfAssurance = identity.getLevelOfAssurance();
        identity.loginLevelOfAssurance = g02Session.getAuthenticationLevelOfAssurance();
        return identity;
      };

      session.getClaims = function() {
        return getG02Session()._attributes;
      };

      session.getCallToken = function(scope = null, opts = {}) {
        if (typeof scope === "string" || Array.isArray(scope)) {
          return getG02Session().getCallToken(scope, opts);
        } else {
          // If scope was not defined, return legacy value
          let session = getG02Session();
          return {
            token: session._idToken,
            tokenType: session._idToken ? "Bearer" : null
          };
        }
      };

      session.isExpiring = function() {
        return AuthenticationService.isSessionExpiring();
      };

      session.isAuthenticated = function() {
        return getG02Session().isAuthenticated();
      };

      session.login = function(options) {
        let opts = { ...options };
        let authnSvcOpts = {};
        if (opts.access_token && opts.token_type_hint === "urn:ietf:params:oauth:token-type:jwt-uuos8") {
          authnSvcOpts = { os8Token: opts.access_token };
          delete opts.access_token;
          delete opts.token_type_hint;
        }
        Object.assign(authnSvcOpts, opts);
        return AuthenticationService.authenticate(authnSvcOpts).then(() => session);
      };

      session.logout = function() {
        return getG02Session().close();
      };

      let _legacyListeners = {};
      session.addListener = function(eventType, listenerFn) {
        if (eventType === "identityChange") eventType = "sessionChanged";
        let unregFn = AuthenticationService.addListener(eventType, ({ type, data }) => {
          let origRunningG02Session = runningG02Session;
          if (data instanceof Session) runningG02Session = data;
          try {
            let g01Type = type;
            let g01Data = data instanceof Session ? session : data;
            if (type === "sessionChanged") {
              g01Type = "identityChange";
              g01Data = session.getIdentity();
            }
            let legacyEvent = { type: g01Type, data: g01Data };
            return listenerFn(legacyEvent);
          } finally {
            runningG02Session = origRunningG02Session;
          }
        });
        let map = _legacyListeners[eventType];
        if (!map) map = _legacyListeners[eventType] = new Map();
        map.set(listenerFn, unregFn);
        return unregFn;
      };

      session.removeListener = function(eventType, listenerFn) {
        if (eventType === "identityChange") eventType = "sessionChanged";
        let map = _legacyListeners[eventType];
        let unregFn = map ? map.get(listenerFn) : null;
        if (!unregFn) return false;
        map.delete(listenerFn);
        return unregFn();
      };

      let _legacyIdentityChangeListeners = new Map();
      session.addIdentityChangeListener = function(listenerFn) {
        let unregFn = session.addListener("identityChange", e => listenerFn(e.data));
        _legacyIdentityChangeListeners.set(listenerFn, unregFn);
        return unregFn;
      };
      session.removeIdentityChangeListener = function(listenerFn) {
        let unregFn = _legacyIdentityChangeListeners.get(listenerFn);
        if (!unregFn) return false;
        _legacyIdentityChangeListeners.delete(listenerFn);
        return unregFn();
      };

      session.getAuthenticationContext = function() {
        return getG02Session().getAuthenticationContext();
      };
    }

    // mock Session with extra API for manipulating with session state
    class MockSession extends Session {
      mockSetPending() {
        MockAuthenticationService.initComplete = false;
        MockAuthenticationService.initPromise = new Promise((resolve, reject) => {
          MockAuthenticationService._initPromiseResolve = resolve;
          MockAuthenticationService._initPromiseReject = reject;
        });
        oidcSession._identity = null;
        MockAuthenticationService._expiring = false;
        MockAuthenticationService._expiresAt = 0;
      }
      async mockSetIdentity(identity) {
        oidcSession._identity = identity;
        MockAuthenticationService._triggerEvent("sessionChanged", oidcSession);
        if (!MockAuthenticationService.initComplete) {
          MockAuthenticationService.initComplete = true;
          MockAuthenticationService._initPromiseResolve(this);
          // have to wait for this because IdentityMixin might be waiting for initPromise and we want
          // such listeners to be finished when we return from this fn
          await MockAuthenticationService.initPromise;
        }
      }
      mockSetExpiring(expiring) {
        if (!oidcSession._identity && expiring) {
          console.warn("Cannot set 'expiring' flag on session - use Session.mockSetIdentity(...) first.");
          return;
        }
        MockAuthenticationService._expiring = expiring;
        MockAuthenticationService._expiresAt = expiring ? Date.now() + 5 * 60 * 1000 : Date.now() + 12 * 60 * 60 * 1000;
        if (expiring) {
          MockAuthenticationService._triggerEvent("sessionExpiring", {
            expiresAt: MockAuthenticationService._expiresAt
          });
        } else if (oidcSession._identity) {
          MockAuthenticationService._triggerEvent("sessionExtended", {
            expiresAt: MockAuthenticationService._expiresAt
          });
        }
      }
      mockReset() {
        MockAuthenticationService.initComplete = false;
        MockAuthenticationService.initPromise = new Promise((resolve, reject) => {
          MockAuthenticationService._initPromiseResolve = resolve;
          MockAuthenticationService._initPromiseReject = reject;
        });

        oidcSession._identity = null;
        MockAuthenticationService._listeners = {};

        MockAuthenticationService._expiring = false;
        MockAuthenticationService._expiresAt = 0;
      }
    }

    let oidcSession = new Session();
    let mockSession = new MockSession();
    addLegacyApi(mockSession, MockAuthenticationService);
    TestSession.instance = mockSession;

    return {
      ...Oidc,
      AuthenticationService: MockAuthenticationService,
      Session: Session
    };
  });
} catch (e) {
  if (e.code !== "MODULE_NOT_FOUND") throw e;
}
