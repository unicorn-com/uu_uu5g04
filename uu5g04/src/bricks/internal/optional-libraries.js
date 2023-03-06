import { Utils } from "uu5g05";

let Uu5Elements;
let result = Object.defineProperties(
  {},
  {
    Uu5Elements: {
      get: () => {
        if (typeof SystemJS === "undefined") return undefined;
        if (!Uu5Elements && process.env.NODE_ENV !== "test") Uu5Elements = Utils.Uu5Loader.get("uu5g05-elements");
        return Uu5Elements;
      },
    },
  }
);

export default result;
