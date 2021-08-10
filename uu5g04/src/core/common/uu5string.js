import { Utils } from "uu5g05";
import Environment from "../environment/environment";
import Tools from "./tools";

const { Uu5String, Uu5Data, Uu5Json } = Utils;
class UU5Json extends Uu5Json {
  toUU5Json() {
    return this.toJson();
  }
}

const UU5Data = {
  parse(uu5Data) {
    return Uu5Data.parse(uu5Data, Environment.uu5DataMap);
  },
};

const EXTRA_TEMPLATE_DATA = {
  now: () => {
    let date = new Date(Date.now());
    return Tools.toLocaleString(date, Tools.getLanguage());
  },
  userName: () => {
    let session = Environment.getSession();
    return (session?.isAuthenticated?.() !== false ? session?.getIdentity()?.name : null) ?? "";
  },
  userEmail: () => {
    let session = Environment.getSession();
    return (session?.isAuthenticated?.() !== false ? session?.getIdentity()?.email : null) ?? "";
  },
};

const G04_FACTORY = {
  createString(uu5string, opts = {}) {
    return new UU5String(uu5string, opts.templateDataMap, opts.initFn);
  },
  createObject(
    tag,
    propsString,
    { children = [], isPairedTag = true, initFn = null, parent = null, uu5DataMap, allowedTagsRegExp } = {}
  ) {
    return new UU5StringObject(tag, propsString, children, isPairedTag, initFn, parent);
  },
  createProps(propsString, { buildItemFn, uu5DataMap, allowedTagsRegExp } = {}) {
    return new UU5StringProps(
      propsString,
      // buildItemFn uses g05 API; UU5StringProps expects g04 API => convert
      buildItemFn
        ? (tag, propsString, children, isPairedTag, initFn, parent) =>
            buildItemFn(tag, propsString, { children, isPairedTag, initFn, parent })
        : undefined
    );
  },
};

function wrap(obj, methodName, wrapFn) {
  let origFn = obj[methodName];
  obj[methodName] = function (...args) {
    return wrapFn.call(obj, origFn, ...args);
  };
}

function isG05Opts(obj) {
  return (
    obj &&
    typeof obj === "object" &&
    Object.keys(obj).length > 0 &&
    ("uu5DataMap" in obj || "templateDataMap" in obj || "initFn" in obj)
  );
}

function omitUndefineds(obj) {
  for (let k in obj) if (obj[k] === undefined) delete obj[k];
  return obj;
}

function getG05BuildItemFn(buildItemG04, defaultFn) {
  // "buildItemG04" accepts g04 parameters (tag, propsString, children, isParedTag, ...); map it
  // to g05 parameters (tag, propsString, opts)
  let result;
  if (buildItemG04 && buildItemG04._g05) {
    result = buildItemG04;
  } else if (buildItemG04 || defaultFn) {
    result = function (tag, propsString, opts) {
      let fn = buildItemG04 || defaultFn;
      let result = fn(tag, propsString, opts?.children, opts?.isPairedTag, opts?.initFn, opts?.parent);
      return result;
    };
    result._g05 = true;
  } else {
    result = buildItemG04;
  }
  return result;
}

class UU5StringObject extends Uu5String.Object {
  constructor(tag, propsString, children = [], isPairedTag = true, initFn = null, parent = null) {
    super(
      tag,
      propsString,
      omitUndefineds({
        children,
        isPairedTag,
        parent,
        uu5DataMap: Environment.uu5DataMap,
        _factory: G04_FACTORY,
        initFn,
      })
    );
    wrap(this, "toString", function (origFn, data, filterFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]); // was called with g05 API
      return origFn.call(this, omitUndefineds({ templateDataMap: data, filterFn }));
    });
    wrap(this, "toPlainText", function (origFn, data, filterFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]); // was called with g05 API
      return origFn.call(this, omitUndefineds({ templateDataMap: data, filterFn }));
    });
    wrap(this, "toChildren", function (origFn, data, filterFn, buildChildFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]); // was called with g05 API
      return origFn.call(
        this,
        omitUndefineds({
          templateDataMap: data,
          filterFn,
          buildChildFn: typeof buildChildFn === "function" ? buildChildFn : undefined,
        })
      );
    });
    wrap(this, "clone", function (origFn, initFn = this.initFn) {
      if (arguments.length <= 1 || isG05Opts(arguments[1])) return origFn.call(this, arguments[1]); // was called with g05 API
      return origFn.call(this, omitUndefineds({ initFn }));
    });
  }

  static create(tag, propsString, children, isPairedTag, initFn, parent) {
    if (arguments.length <= 3 && isG05Opts(arguments[2])) {
      return Uu5String.Object.create(tag, propsString, { ...arguments[2], _factory: G04_FACTORY });
    }
    return Uu5String.Object.create(
      tag,
      propsString,
      omitUndefineds({
        children,
        isPairedTag,
        initFn,
        parent,
        uu5DataMap: Environment.uu5DataMap,
        _factory: G04_FACTORY,
      })
    );
  }
}

class UU5StringProps extends Uu5String.Props {
  constructor(propsString, buildItem) {
    super(propsString, omitUndefineds({ buildItemFn: getG05BuildItemFn(buildItem), _factory: G04_FACTORY }));
    wrap(this, "toString", function (origFn, data, filterFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]); // was called with g05 API
      return origFn.call(this, omitUndefineds({ templateDataMap: data, filterFn }));
    });
    wrap(this, "toPlainText", function (origFn, data, filterFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]); // was called with g05 API
      return origFn.call(this, omitUndefineds({ templateDataMap: data, filterFn }));
    });
    wrap(this, "toChildren", function (origFn, data, filterFn, buildChildFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]); // was called with g05 API
      return origFn.call(
        this,
        omitUndefineds({
          templateDataMap: data,
          filterFn,
          buildChildFn: typeof buildChildFn === "function" ? buildChildFn : undefined,
        })
      );
    });
    wrap(this, "clone", function (origFn, initFn) {
      if (arguments.length <= 1 || isG05Opts(arguments[1])) return origFn.call(this, arguments[1]); // was called with g05 API
      return origFn.call(this, omitUndefineds({ initFn }));
    });
  }
  static parse(attrsString, buildItem) {
    return Uu5String.Props.parse(
      attrsString,
      omitUndefineds({ buildItemFn: getG05BuildItemFn(buildItem), uu5DataMap: Environment.uu5DataMap })
    );
  }
}

class UU5String extends Uu5String {
  constructor(uu5string, data = undefined, initFn = null) {
    super(
      uu5string,
      omitUndefineds({
        // intentionally ==, not ===
        templateDataMap: data == null ? data : { ...EXTRA_TEMPLATE_DATA, ...data },
        uu5DataMap: Environment.uu5DataMap,
        _factory: G04_FACTORY,
        initFn,
      })
    );
    this.data = this.templateDataMap;
    wrap(this, "toChildren", function (origFn, data = this.templateDataMap || {}, filterFn, buildChildFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]);
      return origFn.call(
        this,
        omitUndefineds({
          templateDataMap: data === null ? data : { ...EXTRA_TEMPLATE_DATA, ...data },
          filterFn,
          buildChildFn: typeof buildChildFn === "function" ? buildChildFn : undefined,
        })
      );
    });
    wrap(this, "toString", function (origFn, data = this.templateDataMap || null, filterFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]);
      return origFn.call(
        this,
        omitUndefineds({ templateDataMap: data === null ? data : { ...EXTRA_TEMPLATE_DATA, ...data }, filterFn })
      );
    });
    wrap(this, "toPlainText", function (origFn, data = this.templateDataMap || {}, filterFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]);
      return origFn.call(
        this,
        omitUndefineds({ templateDataMap: data === null ? data : { ...EXTRA_TEMPLATE_DATA, ...data }, filterFn })
      );
    });
    wrap(this, "clone", function (origFn, data = this.templateDataMap, initFn = this.initFn) {
      if (arguments.length <= 2 && isG05Opts(arguments[1])) return origFn.call(this, arguments[1]);
      return origFn.call(
        this,
        // intentionally ==, not ===
        omitUndefineds({ templateDataMap: data == null ? data : { ...EXTRA_TEMPLATE_DATA, ...data }, initFn })
      );
    });
  }
  static parse(uu5string, buildItem) {
    return Uu5String.parse(
      uu5string,
      omitUndefineds({
        uu5DataMap: Environment.uu5DataMap,
        buildItemFn: getG05BuildItemFn(buildItem, UU5StringObject.create),
        _factory: G04_FACTORY,
      })
    );
  }

  static toChildren(uu5string, data, filterFn, buildChildFn) {
    return Uu5String.toChildren(
      uu5string,
      omitUndefineds({
        templateDataMap: data === null ? null : { ...EXTRA_TEMPLATE_DATA, ...data },
        uu5DataMap: Environment.uu5DataMap,
        filterFn,
        buildChildFn: typeof buildChildFn === "function" ? buildChildFn : undefined,
      })
    );
  }

  static toString(uu5string, data, filterFn) {
    return Uu5String.toString(
      uu5string,
      omitUndefineds({
        // intentionally only ==, not ===
        templateDataMap: data == null ? null : { ...EXTRA_TEMPLATE_DATA, ...data },
        filterFn,
      })
    );
  }

  static toPlainText(uu5string, data, filterFn) {
    return Uu5String.toPlainText(
      uu5string,
      omitUndefineds({
        templateDataMap: data === null ? null : { ...EXTRA_TEMPLATE_DATA, ...data },
        uu5DataMap: Environment.uu5DataMap,
        filterFn,
      })
    );
  }

  static contentToChildren(content, data, filterFn, buildChildFn) {
    return Uu5String.contentToChildren(
      content,
      omitUndefineds({
        templateDataMap: data === null ? null : { ...EXTRA_TEMPLATE_DATA, ...data },
        uu5DataMap: Environment.uu5DataMap,
        filterFn,
        buildChildFn: typeof buildChildFn === "function" ? buildChildFn : undefined,
      })
    );
  }

  static contentToString(content, data, filterFn) {
    return Uu5String.contentToString(
      content,
      omitUndefineds({
        // intentionally only ==, not ===
        templateDataMap: data == null ? data : { ...EXTRA_TEMPLATE_DATA, ...data },
        filterFn,
      })
    );
  }

  static contentToPlainText(content, data, filterFn) {
    return Uu5String.contentToPlainText(
      content,
      omitUndefineds({
        templateDataMap: data === null ? null : { ...EXTRA_TEMPLATE_DATA, ...data },
        uu5DataMap: Environment.uu5DataMap,
        filterFn,
      })
    );
  }
}

UU5String.Props = UU5StringProps;
UU5String.Object = UU5StringObject;

export { UU5String, UU5Data, UU5Json };
export default UU5String;
