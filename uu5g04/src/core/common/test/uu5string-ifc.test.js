/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */
import UU5 from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
import { mount, shallow } from "uu5g05-test";

// NOTE These are original "legacy" tests. They were passing before and ensure that UU5.Common.UU5String API remained
// fully working even though we switched the underlying implementation to uu5stringg01 library (which uses slightly
// different API).

let codePreviewOutput = `<uu5string/>
<UU5.Bricks.Button
  name="newCMPname"
  count=69
  tagName="UU5.Bricks.Button"
  id="uu5-id-component"
  className="uu5-my-className-cmp"
  tooltip="Hy, I am tooltip."
  selected
  style="fontSize: 20px; color: red"
  disabled=false
  mainAttrs='<uu5json/>{
    "style": {
      "fontSize": "20px",
      "color": "red"
    }
  }'
/>`;

let basicUU5stringTemplate =
  '<uu5string /><UU5.Bricks.Section content="First section" /><UU5.Bricks.Section content="Second section" />';
let invalidTemplateUu5String =
  '<uu5string /><UU5.Bricks.Section content="First section"><UU5.Bricks.Section content="Second section" />';
let sliderUu5String =
  '<uu5string /><UU5.Bricks.Slider id="root" key="parKey"><UU5.Bricks.Slider.Item value=5 id="child" key="childrenID"/></UU5.Bricks.Slider>';
let formsTextUu5String =
  '<uu5string /><UU5.Forms.Text id="myId" key="parKer" value="John Doe" password="false" patterMessage="Toto není co jsem čekal." pattern="[A-Za-z]{3}"/>';
let newsliderUu5String =
  '<uu5string /><UU5.Bricks.Slider id="root2" key="parKey2"><UU5.Bricks.Slider.Item value=10 min="0" max="10" step="5" id="child" key="childrenID"/></UU5.Bricks.Slider>';
let filterContent =
  '<uu5string /><UU5.Bricks.Paragraph content="Lorem ipsum ..." /><UU5.Bricks.Paragraph /><UU5.Bricks.Paragraph>Lorem ipsum ...</UU5.Bricks.Paragraph>';

const mockData = {
  now: "21.05.2018",
  userName: "Jest",
  userEmail: "jest@facebook.com",
  idHex32: "32-moje-id",
};

describe("UU5.Common.Uu5String - test of interface instance", () => {
  it("new UU5String(uu5string, data = null, init = null)", () => {
    let uu5string = new UU5.Common.UU5String(
      '<uu5string /><UU5.Bricks.Section content="Toto je hlavička sekce">Toto je obsah sekce</UU5.Bricks.Section>'
    );
    expect(() => {
      uu5string;
    }).not.toThrow();
    expect(uu5string).not.toBeNull();
    expect(uu5string).toEqual(expect.any(Object));
    expect(uu5string).toMatchSnapshot();
  });

  it("new(uu5string, mockData, filterfnc)", () => {
    const mockFunc = jest.fn();
    let uu5string = new UU5.Common.UU5String(filterContent, mockData, mockFunc);
    expect(uu5string).toMatchSnapshot();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(3);
  });

  //let newInstance = new UU5.Common.UU5String(sliderUu5String);

  it("instance.toChildren(data = this.data, filter = mock)", () => {
    const mockFunc = jest.fn();
    let newInstance = new UU5.Common.UU5String(filterContent, mockData, mockFunc);
    let calls = newInstance.toChildren(mockData, mockFunc);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(6);
    expect(calls).toMatchSnapshot();
  });

  it("instance.toChildren(data = this.data, filter = null)", () => {
    let newInstance = new UU5.Common.UU5String(sliderUu5String);
    expect(() => {
      newInstance;
    }).not.toThrow();
    expect(() => {
      newInstance.toChildren();
    }).not.toThrow();
    expect(newInstance.toChildren()).not.toBeNull();
    expect(newInstance.toChildren()).toMatchSnapshot();
  });

  it("instance.toChildren(data = null, filter = null, buildChildFn)", () => {
    let newInstance = new UU5.Common.UU5String('<uu5string/><div a="b">A<br/></div><span/>text');
    let builtChildren = newInstance.toChildren(undefined, undefined, (tag, props, children) => {
      return { T: tag, P: props, C: children };
    });
    expect(builtChildren).toMatchObject({
      length: 3,
      0: {
        T: "div",
        P: { a: "b" },
        C: ["A", { T: "br", P: {}, C: null }],
      },
      1: { T: "span", P: {}, C: null },
      2: "text",
    });
  });

  it("instance.toString(data = this.data, filter = null)", () => {
    let newInstance = new UU5.Common.UU5String(sliderUu5String);
    expect(() => {
      newInstance;
    }).not.toThrow();
    expect(() => {
      newInstance.toString();
    }).not.toThrow();
    expect(newInstance.toString()).not.toBeNull();
    expect(newInstance.toString()).toEqual(
      expect.stringContaining(
        '<UU5.Bricks.Slider id="root" key="parKey"><UU5.Bricks.Slider.Item value=5 id="child" key="childrenID"/></UU5.Bricks.Slider>'
      )
    );
    expect(newInstance.toString()).toMatchSnapshot();
  });

  it("instance.toString(data = this.mock_data, filter = mockFunc)", () => {
    const mockFunc = jest.fn();

    let newInstance = new UU5.Common.UU5String(filterContent, mockData, mockFunc);
    let calls = newInstance.toString(mockData, mockFunc);
    expect(mockFunc).toBeCalled();
    //3X calls mock func toString 3x calls mock in new
    expect(mockFunc).toHaveBeenCalledTimes(6);
    expect(calls).toMatchSnapshot();
  });

  it("instance.clone(data = this.data, init = this.init)", () => {
    let newInstance = new UU5.Common.UU5String(sliderUu5String);
    let cloneIfc = newInstance.clone({ text: newsliderUu5String });
    expect(() => {
      newInstance;
    }).not.toThrow();
    expect(() => {
      cloneIfc;
    }).not.toThrow();
    expect(cloneIfc).not.toBeNull();
    expect(cloneIfc).toEqual(
      expect.objectContaining({
        data: expect.objectContaining({ text: newsliderUu5String }),
      })
    );
    expect(cloneIfc).toMatchSnapshot();
  });

  it("instance.clone(data=this.data, init=this.init)", () => {
    const mockFunc = jest.fn();
    let newInstance = new UU5.Common.UU5String(filterContent, mockData, mockFunc);
    let clone_calls = newInstance.clone({ text: newsliderUu5String }, mockFunc);
    expect(mockFunc).toBeCalled();
    //3X calls mock func clone 3x calls mock in new
    expect(mockFunc).toHaveBeenCalledTimes(6);
    expect(clone_calls).toMatchSnapshot();
  });
});

describe("UU5.Common.Uu5.String. - test of interface of class", () => {
  it("isValid() should return true", () => {
    expect(() => {
      UU5.Common.UU5String.isValid(codePreviewOutput);
    }).not.toThrow();
    expect(() => {
      UU5.Common.UU5String.isValid(basicUU5stringTemplate);
    }).not.toThrow();
    expect(UU5.Common.UU5String.isValid(codePreviewOutput)).toBeTruthy();
    expect(UU5.Common.UU5String.isValid(basicUU5stringTemplate)).toBeTruthy();
  });

  it("isValid() should return false", () => {
    expect(() => {
      UU5.Common.UU5String.isValid(invalidTemplateUu5String);
    }).not.toThrow();
    expect(UU5.Common.UU5String.isValid(invalidTemplateUu5String)).toBeFalsy();
  });

  it("parse(uu5string, buildItem = null) should return UU5StringObject", () => {
    expect(() => {
      UU5.Common.UU5String.parse("<uu5string /><UU5.Bricks.Section />");
    }).not.toThrow();
    expect(() => {
      UU5.Common.UU5String.parse(codePreviewOutput);
    }).not.toThrow();
    expect(UU5.Common.UU5String.parse("<uu5string /><UU5.Bricks.Section />")).toMatchSnapshot();
    let codePreviewParse = UU5.Common.UU5String.parse(codePreviewOutput);
    expect(codePreviewParse).toMatchSnapshot();
    expect(codePreviewParse.toString()).toMatchSnapshot();
  });

  it("parse(uu5string, buildItem = mock) should return UU5StringObject", () => {
    const mockFunc = jest.fn();
    UU5.Common.UU5String.parse("<uu5string /><UU5.Bricks.Section />", mockFunc);
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(mockFunc.mock.calls[0][0]).toMatch(/UU5.Bricks.Section/);
    expect(UU5.Common.UU5String.parse("<uu5string /><UU5.Bricks.Section />", mockFunc)).toMatchSnapshot();
  });

  it("parse(invalid_uu5string, buildItem = null) should throw error", () => {
    expect(() => {
      UU5.Common.UU5String.parse(invalidTemplateUu5String);
    }).toThrow();
  });

  it("toChildren(uu5string)", () => {
    expect(() => {
      UU5.Common.UU5String.toChildren(codePreviewOutput);
    }).not.toThrow();
    let toChildrenIfc = UU5.Common.UU5String.toChildren(codePreviewOutput);
    expect(toChildrenIfc).not.toBeNull();
    expect(toChildrenIfc).toMatchSnapshot();
  });

  it("toChildren(uu5string,data,filter)", () => {
    const mockFilter = jest.fn();
    let ifc = UU5.Common.UU5String.toChildren("<uu5string /><UU5.Bricks.Section />", mockData, mockFilter);
    expect(mockFilter).toBeCalled();
    expect(mockFilter).toHaveBeenCalledTimes(1);
    expect(ifc).toMatchSnapshot();
    expect(mockFilter.mock.calls[0][0]).toEqual(
      expect.objectContaining({ tag: "UU5.Bricks.Section", props: { children: [] } })
    );
  });

  it("toChildren(uu5string,data,children,buildChildFn)", () => {
    let builtChildren = UU5.Common.UU5String.toChildren(
      '<uu5string/><div a="b">A<br/></div><span/>text',
      undefined,
      undefined,
      (tag, props, children) => {
        return { T: tag, P: props, C: children };
      }
    );
    expect(builtChildren).toMatchObject({
      length: 3,
      0: {
        T: "div",
        P: { a: "b" },
        C: ["A", { T: "br", P: {}, C: null }],
      },
      1: { T: "span", P: {}, C: null },
      2: "text",
    });
  });

  it("toString(uu5string)", () => {
    expect(() => {
      UU5.Common.UU5String.toString(codePreviewOutput);
    }).not.toThrow();
    //return data is in the snapshot
    expect(UU5.Common.UU5String.toString(codePreviewOutput)).toMatchSnapshot();
    expect(UU5.Common.UU5String.toString(codePreviewOutput)).toMatchSnapshot();
    expect(UU5.Common.UU5String.toString(basicUU5stringTemplate)).toEqual(
      expect.stringContaining(
        "" + '<UU5.Bricks.Section content="First section"/><UU5.Bricks.Section content="Second section"/>'
      )
    );
  });

  it("toString(uu5string,data,filter)", () => {
    const mockFilter = jest.fn();
    let ifc = UU5.Common.UU5String.toString("<uu5string /><UU5.Bricks.Section />", mockData, mockFilter);
    expect(mockFilter).toBeCalled();
    expect(mockFilter).toHaveBeenCalledTimes(1);
    expect(ifc).toMatchSnapshot();
    expect(mockFilter.mock.calls[0][0]).toEqual(
      expect.objectContaining({ tag: "UU5.Bricks.Section", props: { children: [] } })
    );
  });

  it("contentToChildren(uu5stringObjects, data = null, filter = null) should not throw error I", () => {
    expect(() => {
      UU5.Common.UU5String.contentToChildren([sliderUu5String]);
    }).not.toThrow();
    expect(UU5.Common.UU5String.contentToChildren([sliderUu5String])).not.toBeNull();
    expect(UU5.Common.UU5String.contentToChildren([sliderUu5String])).toMatchSnapshot();
    expect(UU5.Common.UU5String.contentToChildren([sliderUu5String])).toEqual(
      expect.arrayContaining([
        '<uu5string /><UU5.Bricks.Slider id="root" key="parKey"><UU5.Bricks.Slider.Item value=5 id="child" key="childrenID"/></UU5.Bricks.Slider>',
      ])
    );
  });

  it("contentToChildren(uu5string,data,filter)", () => {
    let uu5string = new UU5.Common.UU5String(
      "<uu5string /><UU5.Bricks.Button /><UU5.Bricks.Paragraph><UU5.Bricks.Icon /></UU5.Bricks.Paragraph>"
    );
    const mockFilter = jest.fn();
    let ifc = UU5.Common.UU5String.contentToChildren(uu5string.content, mockData, mockFilter);
    expect(mockFilter).toBeCalled();
    expect(mockFilter).toHaveBeenCalledTimes(3);
    expect(ifc).toMatchSnapshot();
  });

  it("contentToChildren(uu5string, { buildChildFn })", () => {
    let builtChildren = UU5.Common.UU5String.contentToChildren(
      new UU5.Common.UU5String('<uu5string/><div a="b">A<br/></div><span/>text').content,
      undefined,
      undefined,
      (tag, props, children) => {
        return { T: tag, P: props, C: children };
      }
    );
    expect(builtChildren).toMatchObject({
      length: 3,
      0: {
        T: "div",
        P: { a: "b" },
        C: ["A", { T: "br", P: {}, C: null }],
      },
      1: { T: "span", P: {}, C: null },
      2: "text",
    });
  });

  it("contentToChildren(uu5stringObjects, data = null, filter = null) should not throw error II", () => {
    expect(() => {
      UU5.Common.UU5String.contentToChildren([formsTextUu5String]);
    }).not.toThrow();
    expect(UU5.Common.UU5String.contentToChildren([formsTextUu5String])).not.toBeNull();
    expect(UU5.Common.UU5String.contentToChildren([formsTextUu5String])).toMatchSnapshot();
    expect(UU5.Common.UU5String.contentToChildren([formsTextUu5String])).toEqual(
      expect.arrayContaining([
        '<uu5string /><UU5.Forms.Text id="myId" key="parKer" value="John Doe" password="false" patterMessage="Toto není co jsem čekal." pattern="[A-Za-z]{3}"/>',
      ])
    );
  });

  it("contentToString(uu5stringObjects, data = null, filter = null)", () => {
    expect(() => {
      UU5.Common.UU5String.contentToString([formsTextUu5String]);
    }).not.toThrow();
    expect(UU5.Common.UU5String.contentToString([formsTextUu5String])).not.toBeNull();
    expect(UU5.Common.UU5String.contentToString([formsTextUu5String])).toMatchSnapshot();
    expect(UU5.Common.UU5String.contentToString([formsTextUu5String])).toEqual(
      expect.stringContaining(
        '<uu5string /><UU5.Forms.Text id="myId" key="parKer" value="John Doe" password="false" patterMessage="Toto není co jsem čekal." pattern="[A-Za-z]{3}"/>'
      )
    );
  });

  it("contentToString(uu5string,data,filter)", () => {
    let uu5string = new UU5.Common.UU5String(
      "<uu5string /><UU5.Bricks.Button /><UU5.Bricks.Paragraph><UU5.Bricks.Icon /></UU5.Bricks.Paragraph>"
    );
    const mockFilter = jest.fn();
    let ifc = UU5.Common.UU5String.contentToString(uu5string.content, mockData, mockFilter);
    expect(mockFilter).toBeCalled();
    expect(mockFilter).toHaveBeenCalledTimes(3);
    expect(ifc).toMatchSnapshot();
  });

  it("filteringEmptyNodes", () => {
    const template =
      '<uu5string /><UU5.Bricks.Paragraph content="Lorem ipsum ..." /><UU5.Bricks.Paragraph /><UU5.Bricks.Paragraph>Lorem ipsum ...</UU5.Bricks.Paragraph>';
    const uu5string = new UU5.Common.UU5String(template);
    const filterFn = ({ tag, props }) => {
      return !props.content && props.children.length === 0 ? false : { tag, props };
    };

    // without filter function
    expect(uu5string.toChildren().length).toBe(3);
    // filter empty paragraph - in result array is null instead of filtered component => it is needed to filter result array of children
    expect(uu5string.toChildren(null, filterFn).filter((item) => item !== null).length).toBe(2);
  });

  it("differentDataTypesInProps", () => {
    const template =
      '<uu5string /><UU5.Bricks.Div booleanTrue=true booleanFalse=false booleanTrue2 number=3 numberZero=0 numberNegative=-5 json=\'<uu5json />{"key": "value", "numberKey": 3, "booleanKey": false}\' uu5string=\'<uu5string /><UU5.Bricks.Span /><UU5.Bricks.Span /><UU5.Bricks.Span />\' />';
    const uu5string = new UU5.Common.UU5String(template);
    const toChildrenMockFn = jest.fn();
    const toStringMockFn = jest.fn();
    const props = uu5string.toChildren(null, toChildrenMockFn)[0].props;

    // test props value
    expect(props.booleanTrue).toBeTruthy();
    expect(props.booleanTrue2).toBeTruthy();
    expect(props.booleanFalse).toBeFalsy();
    expect(props.number).toBe(3);
    expect(props.numberZero).toBe(0);
    expect(props.numberNegative).toBe(-5);

    // test üu5json in props
    let json = props.json;
    expect(json).toBeInstanceOf(Object);
    expect(json).not.toBeNull();
    expect(json.key).toBe("value");
    expect(json.numberKey).toBe(3);
    expect(json.booleanKey).toBeFalsy();

    // test uu5string in props - test if inner components will be parsed into components
    uu5string.toString(null, toStringMockFn);
    expect(toStringMockFn).toHaveBeenCalledTimes(4);
    expect(toChildrenMockFn).toHaveBeenCalledTimes(4);
  });

  it("Dynamic uu5data evaluation", () => {
    const uu5string = UU5.Common.UU5String.parse('<uu5string /><UU5.Bricks.Div data="<uu5data/>dataKey" />');
    const testData = "Test data";
    UU5.Environment.uu5DataMap.dataKey = testData;
    const rendered = UU5.Common.UU5String.contentToChildren(uu5string);
    expect(rendered[0].props.data).toBe(testData);
  });

  it("Dynamic uu5data evaluation #2", () => {
    const uu5string = UU5.Common.UU5String.parse('<uu5string /><UU5.Bricks.Div data="<uu5data/>nested.data.key" />');
    const testData = "Test data";
    let rendered;

    UU5.Environment.uu5DataMap = { nested: { data: { key: testData } } };
    rendered = UU5.Common.UU5String.contentToChildren(uu5string);
    expect(rendered[0].props.data).toBe(testData);

    UU5.Environment.uu5DataMap = { nested: true };
    rendered = UU5.Common.UU5String.contentToChildren(uu5string);
    expect(rendered[0].props.data).toBe(undefined);

    UU5.Environment.uu5DataMap = undefined;
    rendered = UU5.Common.UU5String.contentToChildren(uu5string);
    expect(rendered[0].props.data).toBe(undefined);
  });

  it("Test parsing components", () => {
    const innerComponentsTemp1 =
      "<uu5string /><UU5.Bricks.Section><UU5.Bricks.Paragraph><UU5.Bricks.Span /></UU5.Bricks.Paragraph></UU5.Bricks.Section>";
    const innerComponentsTemp2 =
      "<uu5string /><UU5.Bricks.Section content='<uu5string /><UU5.Bricks.Paragraph><UU5.Bricks.Span /></UU5.Bricks.Paragraph>' />";
    const innerComponentsTemp3 =
      "<uu5string /><UU5.Bricks.Section content='<uu5string /><UU5.Bricks.Paragraph content=\"<uu5string /><UU5.Bricks.Span />\" />' />";

    // check parsing all component
    let mockFn = jest.fn();
    let uu5string = new UU5.Common.UU5String(innerComponentsTemp1, null, mockFn);
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(uu5string.toString()).toMatchSnapshot();

    mockFn = jest.fn();
    uu5string = new UU5.Common.UU5String(innerComponentsTemp2, null, mockFn);
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(uu5string.toString()).toMatchSnapshot();

    mockFn = jest.fn();
    uu5string = new UU5.Common.UU5String(innerComponentsTemp3, null, mockFn);
    expect(mockFn).toHaveBeenCalledTimes(3);
    expect(uu5string.toString()).toMatchSnapshot();

    let text = String.raw`text &lt;notATag0&gt; &amp;lt; ${"$"}{templateText}<UU5.Common.Div attr="quote:\"">&lt;notATag1&gt;</UU5.Common.Div>`;
    uu5string = new UU5.Common.UU5String("<uu5string/>" + text);
    expect(uu5string.toString()).toBe(text);

    text = String.raw`<UuApp.DesignKit.UU5ComponentProps data='<uu5json/>[
  [
    "<uu5string/>Value&lt;"
  ]
]'/>`;
    uu5string = new UU5.Common.UU5String("<uu5string/>" + text);
    expect(uu5string.toString()).toBe(text);

    text = String.raw`<UuApp.DesignKit.UU5ComponentProps data='<uu5json/>[
  [
    "a",
    "b",
    "c",
    "<uu5string/>&quot;&#060;&apos;Value&lt;"
  ]
]'/>`;
    uu5string = new UU5.Common.UU5String("<uu5string/>" + text);
    expect(uu5string.toString()).toBe(text);

    text = String.raw`<UuApp.DesignKit.UU5ComponentProps data='<uu5json/>[
  [
    "<uu5string/>\\"Val\\\\\\\\ue&lt; :-) &#060;"
  ]
]'/>&lt;&#060; :-)`;
    uu5string = new UU5.Common.UU5String("<uu5string/>" + text);
    expect(uu5string.toString()).toBe(text);

    // test displayed text when using toChildren()
    text = String.raw`
<UU5.Common.Div id="d1">&lt;&#060;</UU5.Common.Div>
<UU5.Common.Div id="d2" style='<uu5json/>{"content":"a\\\\b"}' content="<uu5string/>\"Value&lt;&#060;:-)"/>
<UU5.Common.Div
  id="d3"
  content="<uu5string/>
    <UU5.Common.Div id='d3-1' content='<uu5string/>nested div &quot;&amp;quot;&#060; single backslash: \\\\'/>
    <UU5.Common.Div id='d3-2' content='<uu5json/>[\"<uu5string/>:-) &gt; \\\\\\\\ &#060; text\"]' />
  "
/>
`;
    uu5string = new UU5.Common.UU5String("<uu5string/>" + text);
    let wrapper;
    expect(() => {
      wrapper = mount(<UU5.Common.Div>{uu5string.toChildren()}</UU5.Common.Div>);
    }).not.toThrow();
    // NOTE Result of ...render() is HTML in CheerioWrapper (much like jQuery) - https://cheerio.js.org/
    expect(wrapper.find("#d1").first().render().text()).toBe("<<");
    expect(wrapper.find("#d2").first().render().css("content")).toBe("a\\b");
    expect(wrapper.find("#d2").first().render().text()).toBe('"Value<<🙂');
    expect(wrapper.find("#d3-1").first().render().text()).toBe('nested div "&quot;< single backslash: \\');
    expect(wrapper.find("#d3-2").first().render().text()).toBe("🙂 > \\ < text");

    text = String.raw`<b>bold</b> <script>script</script> <scRipt>alert</scRipt> <b>bold</b>`;
    uu5string = new UU5.Common.UU5String("<uu5string/>" + text);
    expect(() => {
      wrapper = mount(<UU5.Common.Div>{uu5string.toChildren()}</UU5.Common.Div>);
    }).not.toThrow();
    expect(wrapper.find("script").length).toBe(0);
    expect(wrapper.find("scRipt").length).toBe(0);
    expect(wrapper.text()).toContain("<script>script</script> <scRipt>alert</scRipt>");
  });

  it("uu5string template", () => {
    const template = '<uu5string /><UU5.Bricks.Div propWithDefault="${temp:default}" prop="${temp}"/>';
    const uu5string = new UU5.Common.UU5String(template);

    // undefined data - used empty object as a defaultData
    let props = uu5string.toChildren()[0].props;
    expect(props.propWithDefault).toEqual("default");
    expect(props.prop).toEqual("${temp}");
    expect(uu5string.toString()).toEqual('<UU5.Bricks.Div propWithDefault="${temp:default}" prop="${temp}"/>');

    // null data - templates does not been evaluated at all
    props = uu5string.toChildren(null)[0].props;
    expect(props.propWithDefault).toBe("${temp:default}");
    expect(props.prop).toBe("${temp}");
    expect(uu5string.toString(null)).toEqual('<UU5.Bricks.Div propWithDefault="${temp:default}" prop="${temp}"/>');

    // empty object data
    props = uu5string.toChildren({})[0].props;
    expect(props.propWithDefault).toEqual("default");
    expect(props.prop).toEqual("${temp}");
    expect(uu5string.toString({})).toEqual('<UU5.Bricks.Div propWithDefault="default" prop="${temp}"/>');

    // data
    props = uu5string.toChildren({ temp: "value" })[0].props;
    expect(props.propWithDefault).toEqual("value");
    expect(props.prop).toEqual("value");
    expect(uu5string.toString({ temp: "value" })).toEqual('<UU5.Bricks.Div propWithDefault="value" prop="value"/>');

    // function in data
    props = uu5string.toChildren({ temp: () => "value" })[0].props;
    expect(props.propWithDefault).toEqual("value");
    expect(props.prop).toEqual("value");
    expect(uu5string.toString({ temp: () => "value" })).toEqual(
      '<UU5.Bricks.Div propWithDefault="value" prop="value"/>'
    );
  });

  it("uu5string props in children", () => {
    const uu5string = `<uu5string />
      <UU5.Bricks.Section>
        <uu5string propName="header">Section Header</uu5string>
      </UU5.Bricks.Section>`;

    let wrapper = shallow(UU5.Common.UU5String.toChildren(uu5string)[1]); // first child is spaces after uu5string
    expect(wrapper.instance().props.header).toBe("Section Header");

    const parsed = UU5.Common.UU5String.parse(uu5string);
    const stringified = "<uu5string />" + UU5.Common.UU5String.contentToString(parsed);
    // expect(stringified).toBe(uu5string);
    expect(stringified).toBe(uu5string);
  });

  it("uu5json props in children", () => {
    const uu5string = `<uu5string />
      <UU5.Bricks.Section>
        <uu5json propName="data">{
  "header": "Section Header"
}</uu5json>
      </UU5.Bricks.Section>`;

    let wrapper = shallow(UU5.Common.UU5String.toChildren(uu5string)[1]); // first child is spaces after uu5string
    expect(wrapper.instance().props.data.header).toBe("Section Header");

    const parsed = UU5.Common.UU5String.parse(uu5string);
    const stringified = "<uu5string />" + UU5.Common.UU5String.contentToString(parsed);
    // expect(stringified).toMatchSnapshot();
    expect(stringified).toBe(uu5string);
  });

  it("test toPlainText method", () => {
    let tests = [
      {
        uu5string: '<uu5string /><div><span className="hello">Hello</span> <span className="world">World</span></div>',
        plainText: "Hello World",
      },
      {
        uu5string: '<uu5string /><div><span content="Hello" /> <span content="World" /></div>',
        plainText: "Hello World",
      },
      {
        uu5string: `<uu5string />
          <UU5.Bricks.Section
            header="<uu5string /><UU5.Bricks.Header>header</UU5.Bricks.Header>"
            footer="<uu5string /><UU5.Bricks.Footer>footer</UU5.Bricks.Footer>"
            content="<uu5string /><UU5.Bricks.P>content</UU5.Bricks.P>">
              children
            </UU5.Bricks.Section>`,
        plainText: "header content footer",
      },
    ];

    tests.forEach(({ uu5string, plainText }) => expect(UU5.Common.UU5String.toPlainText(uu5string)).toBe(plainText));
  });
});
