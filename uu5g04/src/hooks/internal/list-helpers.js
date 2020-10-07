function getByKey(item, key) {
  if (item == null || typeof key !== "string") return null;
  if (key.indexOf(".") === -1) return item[key];
  let result = item;
  let parts = key.split(".");
  for (let i = 0; i < parts.length && result != null; i++) result = result[parts[i]];
  return result;
}

export function constructItemKey(itemIdentifier) {
  let fn = Array.isArray(itemIdentifier)
    ? (item) => {
        let values = itemIdentifier.map((idKey) => getByKey(item, idKey));
        return values.some((v) => v === null) ? null : JSON.stringify(values);
      }
    : (item) => getByKey(item, itemIdentifier);
  return (item) => {
    let result = fn(item);
    if (result == null && item && item.data) result = fn(item.data); // in case that item is wrapper around data (e.g. from useDataList)
    return result;
  };
}
