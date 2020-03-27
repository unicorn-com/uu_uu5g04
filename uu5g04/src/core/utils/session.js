const Session = {
  register(session, setIdentity, setExpiring) {
    let rollback;
    const isSession = !!Object.keys(session).length;

    const changeIdentity = () => typeof session.getIdentity === "function" && setIdentity(session.getIdentity());
    const expireSession = () => setExpiring(true);
    const extendSession = () => setExpiring(false);

    if (isSession) {
      if (session.initComplete) {
        session.addListener("identityChange", changeIdentity);
        session.addListener("sessionExpiring", expireSession);
        session.addListener("sessionExtended", extendSession);
      } else {
        session.initPromise.then(() => {
          if (rollback) return;
          changeIdentity();
          setExpiring(session.isExpiring());
          session.addListener("identityChange", changeIdentity);
          session.addListener("sessionExpiring", expireSession);
          session.addListener("sessionExtended", extendSession);
        });
      }
    }

    return () => {
      rollback = true;
      if (isSession) {
        session.removeListener("identityChange", changeIdentity);
        session.removeListener("sessionExpiring", expireSession);
        session.removeListener("sessionExtended", extendSession);
      }
    }
  }
};

export { Session };
export default Session;
