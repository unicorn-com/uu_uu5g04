//@@viewOn:imports
import UU5 from "uu5g04";
import LazyLoadedLibraries from "./lazy-loaded-libraries";
import ns from "../bricks-editable-ns.js";
import Css from "./css.js";
import Helpers from "./helpers";
//@@viewOff:imports

const { createVisualComponent } = LazyLoadedLibraries["uu5g04-hooks"];

const classNames = {
  main: () => Css.css`
    font-size: 14px;
    font-style: italic;
    padding-top: 6px;
    border-radius: 0.3em;
    color: rgba(0, 0, 0, 0.34);
  `,
};

//@@viewOn:statics
const STATICS = {
  displayName: ns.name("Message"),
};
//@@viewOff:statics

const Message = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    message: UU5.PropTypes.oneOfType([UU5.PropTypes.node, UU5.PropTypes.object]),
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    message: undefined,
  },
  //@@viewOff:defaultProps

  render({ message, ...props }) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <UU5.Bricks.Text
        {...UU5.Common.VisualComponent.getAttrs(props, classNames.main())}
        content={Helpers.getLabel(message)}
      />
    );
    //@@viewOff:render
  },
});

export default Message;
