import UU5 from "uu5g04";

export function createMockFn(fn = () => null) {
  let result = jest.fn(fn);

  Object.defineProperty(result, "lastValues", {
    get: () => result.mock.calls[result.mock.calls.length - 1][0],
  });

  return result;
}

export function getData(length) {
  let data = [];

  for (let i = 0; i < length; i++) {
    data.push({
      id: "data-" + i,
      content: i,
      fontSize: Math.random() * 4 + 1 + "em",
      colorSchema: UU5.Environment.colorSchema[Math.floor(i * 100) % UU5.Environment.colorSchema.length],
      type: Math.random() > 0.5 ? "primary" : "secondary",
    });
  }

  return data;
}

export function sortByType(a, b) {
  a = a.type === "primary" ? 1 : 2;
  b = b.type === "primary" ? 1 : 2;

  return a - b;
}

export function sortByFontSize(a, b) {
  return parseFloat(a.fontSize) - parseFloat(b.fontSize);
}

export function filterByColorSchema(item) {
  let value = "red";
  return item.colorSchema.indexOf(value) > -1;
}

export function filterByType(item) {
  let value = "secondary";
  return item.type.indexOf(value) > -1;
}

export const FILTERS = [
  {
    key: "filterByColorSchema",
    filter: filterByColorSchema,
    // value: "red",
  },
  {
    key: "filterByType",
    filter: filterByType,
    // value: "secondary",
  },
  {
    key: "filterByTypeRequired",
    filter: filterByType,
    // value: "secondary",
  },
];

export const SORTERS = [
  {
    key: "sortByType",
    sort: sortByType,
  },
  {
    key: "sortByFontSize",
    sort: sortByFontSize,
  },
];
