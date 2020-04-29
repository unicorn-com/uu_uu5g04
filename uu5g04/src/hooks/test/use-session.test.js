import UU5 from "uu5g04";
import { useSession, SessionProvider } from "uu5g04-hooks";

const { mount, shallow, wait } = UU5.Test.Tools;

// eslint-disable-next-line react/prop-types
function Component({ children, hookArgs }) {
  let result = useSession(...hookArgs);
  // NOTE Using Inner to measure render counts of subtrees (hooks are allowed to change their state during render
  // because it results in re-calling of the Component but not of its subtree - we don't want to measure these
  // shallow re-renders).
  return <Inner result={result}>{children}</Inner>;
}
function Inner({ children, result }) {
  return children(result);
}

function mountHook(...hookArgs) {
  let renderFn = jest.fn(() => <div />);
  let wrapper = mount(<Component hookArgs={hookArgs}>{renderFn}</Component>);
  return {
    lastResult: () => renderFn.mock.calls[renderFn.mock.calls.length - 1][0],
    renderCount: () => renderFn.mock.calls.length,
    changeArgs: (...newArgs) => wrapper.setProps({ hookArgs: newArgs }),
    allResults: () => renderFn.mock.calls.map(cl => cl[0])
  };
}

function mountHookWithProvider(providerProps, ...hookArgs) {
  let renderFn = jest.fn(() => <div />);
  let Comp = props => (
    <SessionProvider {...props.providerProps}>
      <Component hookArgs={props.hookArgs}>{renderFn}</Component>
    </SessionProvider>
  );
  let wrapper = mount(<Comp providerProps={providerProps} hookArgs={hookArgs} />);
  return {
    lastResult: () => renderFn.mock.calls[renderFn.mock.calls.length - 1][0],
    renderCount: () => renderFn.mock.calls.length,
    changeArgs: (...newArgs) => wrapper.setProps({ hookArgs: newArgs }),
    allResults: () => renderFn.mock.calls.map(cl => cl[0]),
    changeProviderProps: newProps => wrapper.setProps({ providerProps: newProps })
  };
}

describe("[uu5g04-hooks] useSession behaviour", () => {
  let lastResult;

  it("should return expected result API", () => {
    ({ lastResult } = mountHookWithProvider({ session: UU5.Test.Session.instance }));
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

    ({ lastResult } = mountHookWithProvider({ session: UU5.Test.Session.instance }));
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
