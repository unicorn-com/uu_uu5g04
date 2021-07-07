let Uu5Elements;
let result = Object.defineProperties(
  {},
  {
    Uu5Elements: {
      get: () => Uu5Elements || (Uu5Elements = SystemJS.get(SystemJS.normalizeSync("uu5g05-elements"))),
    },
  }
);

export default result;
