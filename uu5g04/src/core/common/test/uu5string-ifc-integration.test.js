import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import { mount, Session } from "uu5g05-test";

afterEach(() => {
  UU5.Environment.uu5DataMap = {};
});

const DATE1 = 1595233742000; // 2020-07-20T08:29:02.000Z
let origDateNow;
beforeEach(() => {
  origDateNow = Date.now;
  Date.now = () => DATE1;
});
afterEach(() => {
  Date.now = origDateNow;
});
let origTextEntityReplace = UU5.Environment.textEntityReplace;
afterEach(() => {
  UU5.Environment.textEntityReplace = origTextEntityReplace;
});

describe("UU5.Common.UU5String", () => {
  it("toChildren(); should return JSX elements", () => {
    let jsxArray = new UU5.Common.UU5String("<uu5string/><div>abc</div>").toChildren();
    expect(Array.isArray(jsxArray)).toBeTruthy();
    expect(jsxArray.length).toBe(1);
    let jsx = jsxArray[0];
    expect(jsx).toMatchObject({ type: "div" });
    let wrapper = mount(jsx);
    expect(wrapper.text()).toBe("abc");
  });

  it("should recognize extra template expressions - now, userName, userEmail", () => {
    let Component = () => new UU5.Common.UU5String("<uu5string/>${now}").toChildren();
    let wrapper = mount(<Component />);
    expect(wrapper.text()).toBe("20/07/2020, 10:29:02");

    Component = () => new UU5.Common.UU5String("<uu5string/>${userName}").toChildren();
    wrapper = mount(<Component />);
    expect(wrapper.text()).toBe(Session.TEST_IDENTITY.name);

    // NOTE Commented out because we're using Jest setup suitable for uu5g05-test
    // (see uu5g04/test/setup/setup.js), which sets up UU5.Environment.session to use
    // mock Session from uu5g05-test (this mock session returns from getIdentity()
    // only subset of fields compared to uu5g04 - email is not there). Therefore
    // src/core/common/uu5string.js when reading getIdentity().email won't read anything.
    // The fix is to use old jest-setup.js for this test but that's not supported
    // on per-test basis.
    // Component = () => new UU5.Common.UU5String("<uu5string/>${userEmail}").toChildren();
    // wrapper = mount(<Component />);
    // expect(wrapper.text()).toBe(Session.TEST_IDENTITY.claims["email"]);
  });

  it("should use UU5.Environment.uu5DataMap automatically", () => {
    let itemList = UU5.Common.UU5String.parse('<uu5string/><div data="<uu5data/>key" />');

    UU5.Environment.uu5DataMap = { key: "value" };
    let rendered = UU5.Common.UU5String.contentToChildren(itemList);
    expect(rendered).toMatchObject([{ props: { data: "value" } }]);
    rendered = UU5.Common.UU5String.toChildren('<uu5string/><div data="<uu5data/>key" />');
    expect(rendered).toMatchObject([{ props: { data: "value" } }]);
    rendered = new UU5.Common.UU5String('<uu5string/><div data="<uu5data/>key" />').toChildren();
    expect(rendered).toMatchObject([{ props: { data: "value" } }]);
  });

  it("should use UU5.Environment.textEntityReplace setting", () => {
    UU5.Environment.textEntityReplace = true;
    let result = UU5.Common.UU5String.toChildren("<uu5string/>:-)");
    expect(result).toMatchObject(["😃"]);

    UU5.Environment.textEntityReplace = false;
    result = UU5.Common.UU5String.toChildren("<uu5string/>:-)");
    expect(result).toMatchObject([":-)"]);
  });
});
