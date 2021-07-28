let Uu5Elements;
let result = Object.defineProperties(
  {},
  {
    Uu5Elements: {
      get: () => {
        if (typeof SystemJS === "undefined") return undefined;
        if (!Uu5Elements) Uu5Elements = SystemJS.get(SystemJS.normalizeSync("uu5g05-elements"));
        return Uu5Elements;
      },
    },
  }
);

export default result;
