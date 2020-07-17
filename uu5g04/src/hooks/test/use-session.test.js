import UU5 from "uu5g04";
import { useSession, SessionProvider } from "uu5g04-hooks";

const { mount, initHookRenderer } = UU5.Test.Tools;

function renderHookWithProvider(providerProps, ...initialHookParams) {
  let { HookComponent, ...result } = initHookRenderer(useSession, ...initialHookParams);
  mount(
    <SessionProvider {...providerProps}>
      <HookComponent />
    </SessionProvider>
  );
  return result;
}

describe("[uu5g04-hooks] useSession behaviour", () => {
  it("should return expected result API", () => {
    let { lastResult } = renderHookWithProvider({ session: UU5.Test.Session.instance });
    expect(lastResult()).toMatchObject({
      sessionState: expect.any(String),
      identity: expect.any(Object),
      isExpiring: expect.any(Boolean),
      session: expect.any(Object),
      login: expect.any(Function),
      logout: expect.any(Function)
    });
  });

  it("should react to session changes", async () => {
    await UU5.Test.Session.setPending();

    let { lastResult } = renderHookWithProvider({ session: UU5.Test.Session.instance });
    expect(lastResult()).toMatchObject({
      sessionState: "pending",
      identity: undefined,
      isExpiring: false,
      login: expect.any(Function),
      session: UU5.Test.Session.instance
    });

    await UU5.Test.Session.setIdentity(UU5.Test.Session.TEST_IDENTITY); // NOTE This also marks session initialization as finished.
    expect(lastResult()).toMatchObject({
      sessionState: "authenticated",
      identity: UU5.Test.Session.TEST_IDENTITY,
      isExpiring: false
    });

    await UU5.Test.Session.setExpiring(true);
    expect(lastResult()).toMatchObject({
      sessionState: "authenticated",
      identity: UU5.Test.Session.TEST_IDENTITY,
      isExpiring: true
    });

    await UU5.Test.Session.setExpiring(false);
    expect(lastResult()).toMatchObject({
      sessionState: "authenticated",
      identity: UU5.Test.Session.TEST_IDENTITY,
      isExpiring: false
    });

    await UU5.Test.Session.setIdentity(null);
    expect(lastResult()).toMatchObject({
      sessionState: "notAuthenticated",
      identity: null,
      isExpiring: false
    });
  });
});
