import { useSession, SessionProvider } from "uu5g04-hooks";
import { mount, initHookRenderer, Session } from "uu5g05-test";

function renderHookWithProvider(providerProps, ...initialHookParams) {
  let { HookComponent, ...result } = initHookRenderer(useSession, ...initialHookParams);
  mount(
    <SessionProvider {...providerProps}>
      <HookComponent />
    </SessionProvider>
  );
  return result;
}

describe("[uu5g04-hooks] useSession", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHookWithProvider({ session: Session.instance });
    expect(lastResult()).toMatchObject({
      sessionState: expect.any(String),
      identity: expect.any(Object),
      isExpiring: expect.any(Boolean),
      session: expect.any(Object),
      login: expect.any(Function),
      logout: expect.any(Function),
    });
  });

  it("should react to session changes", async () => {
    await Session.setPending();

    let { lastResult } = renderHookWithProvider({ session: Session.instance });
    expect(lastResult()).toMatchObject({
      sessionState: "pending",
      identity: undefined,
      isExpiring: false,
      login: expect.any(Function),
      session: Session.instance,
    });

    await Session.setIdentity(Session.TEST_IDENTITY); // NOTE This also marks session initialization as finished.
    expect(lastResult()).toMatchObject({
      sessionState: "authenticated",
      identity: Session.TEST_IDENTITY,
      isExpiring: false,
    });

    await Session.setExpiring(true);
    expect(lastResult()).toMatchObject({
      sessionState: "authenticated",
      identity: Session.TEST_IDENTITY,
      isExpiring: true,
    });

    await Session.setExpiring(false);
    expect(lastResult()).toMatchObject({
      sessionState: "authenticated",
      identity: Session.TEST_IDENTITY,
      isExpiring: false,
    });

    await Session.setIdentity(null);
    expect(lastResult()).toMatchObject({
      sessionState: "notAuthenticated",
      identity: null,
      isExpiring: false,
    });
  });
});
