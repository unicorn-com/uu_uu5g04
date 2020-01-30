const ns = {
  NAME: "UU5.BricksEditable",
  CSS: "uu5-bricks-editable",
  name(name) {
    return ns.NAME + "." + name;
  },
  css() {
    return Array.prototype.slice
      .call(arguments)
      .map(name => ns.CSS + "-" + name)
      .join(" ");
  }
};

export default ns;
