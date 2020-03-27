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

import UU5 from "uu5g04";
import { useState, useLayoutEffect, useMemo } from "./react-hooks";
import { createComponent } from "./component";
import { createContext } from "./context";

const [SessionContext, useSession] = createContext();
const EMPTY_SESSION = {};

const SessionProvider = createComponent({
  displayName: "UU5.Hooks.SessionProvider",

  propTypes: {
    session: UU5.PropTypes.shape({
      initComplete: UU5.PropTypes.bool,
      initPromise: UU5.PropTypes.object,
      addListener: UU5.PropTypes.func,
      removeListener: UU5.PropTypes.func,
      getIdentity: UU5.PropTypes.func,
      isAuthenticated: UU5.PropTypes.func,
      isExpiring: UU5.PropTypes.func,
      // TODO login, logout
    }).isRequired
  },

  defaultProps: {
    session: EMPTY_SESSION
  },

  render({ session, children }) {
    let defaultIdentity,
      defaultExpiring = false;
    if (session.initComplete) {
      defaultIdentity = session.getIdentity();
      defaultExpiring = session.isExpiring();
    }

    const [identity, setIdentity] = useState(defaultIdentity);
    const [isExpiring, setExpiring] = useState(defaultExpiring);

    useLayoutEffect(() => {
      const unregister = UU5.Utils.Session.register(session, setIdentity, setExpiring);
      return () => unregister();
    }, [session]);

    const value = useMemo(
      () => {
        let sessionState = "pending";
        if (identity) sessionState = "authenticated";
        else if (identity === null) sessionState = "notAuthenticated";

        return {
          sessionState,
          identity,
          isExpiring,
          session,
          login: (...args) => (typeof session.login === "function" && session.login(...args)) || Promise.resolve(),
          logout: (...args) =>
            (typeof session.logout === "function" &&
              session.logout(...args).catch(e => {
                // TODO error
                console.error(`User ${identity.uuIdentity} is not logged out.`, e);
              })) ||
            Promise.resolve()
        };
      },
      [identity, isExpiring, session]
    );

    return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
  }
});

export { useSession, SessionProvider, SessionContext };
export default useSession;
