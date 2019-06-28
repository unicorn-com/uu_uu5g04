// uu5-library-1.7.0
// don't show warning about requestAnimationFrame
// NOTE This must be before any other "require" statements.
// https://reactjs.org/blog/2017/09/26/react-v16.0.html#javascript-environment-requirements
global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};

// initialize Enzyme adapter for React
const Enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");
Enzyme.configure({ adapter: new Adapter() });
