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
import { useState, useEffect, useMemo } from "./react-hooks";
import { createComponent } from "./component";
import { createContext } from "./context";

const [SessionContext, useSession] = createContext();
const EMPTY_SESSION = {};

function useIdentity(session = EMPTY_SESSION) {
  let defaultIdentity;
  if (session.initComplete) {
    defaultIdentity = session.getIdentity();
  }

  let [identity, setIdentity] = useState(defaultIdentity);
  let [isExpiring, setExpiring] = useState(session.initComplete ? session.isExpiring() : false);

  useEffect(() => {
    let changeIdentity, expireSession, extendSession;
    let rollbacked;
    const isSession = !!Object.keys(session).length;

    if (isSession) {
      changeIdentity = () => {
        typeof session.getIdentity === "function" && setIdentity(session.getIdentity());
      };

      expireSession = () => {
        setExpiring(true);
      };

      extendSession = () => {
        setExpiring(false);
      };

      if (!session.initComplete) {
        session.initPromise.then(() => {
          if (rollbacked) return;
          changeIdentity();
          setExpiring(session.isExpiring());
          session.addListener("identityChange", changeIdentity);
          session.addListener("sessionExpiring", expireSession);
          session.addListener("sessionExtended", extendSession);
        });
      } else {
        session.addListener("identityChange", changeIdentity);
        session.addListener("sessionExpiring", expireSession);
        session.addListener("sessionExtended", extendSession);
      }
    }

    return () => {
      rollbacked = true;
      if (isSession) {
        session.removeListener("identityChange", changeIdentity);
        session.removeListener("sessionExpiring", expireSession);
        session.removeListener("sessionExtended", extendSession);
      }
    };
  }, [session]);

  return [identity, isExpiring];
}

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
      isExpiring: UU5.PropTypes.func
    }).isRequired
  },

  defaultProps: {
    session: undefined
  },

  render(props) {
    const session = props.session;

    const [identity, isExpiring] = useIdentity(session);

    const value = useMemo(
      () => ({
        identity,
        isExpiring,
        session,
        login: opt => {
          return (session && typeof session.login === "function" && session.login(opt)) || Promise.resolve();
        },
        logout: () => {
          return (
            (session &&
              typeof session.logout === "function" &&
              session.logout().catch(e => {
                // TODO error
                console.error("Error during logout.", e);
              })) ||
            Promise.resolve()
          );
        }
      }),
      [identity, isExpiring, session]
    );

    return <SessionContext.Provider value={value}>{props.children}</SessionContext.Provider>;
  }
});

export { SessionProvider, SessionContext };
export default useSession;
