//@@viewOn:imports
import UU5 from "uu5g04";
import { useRef, useState, useLayoutEffect } from "../react-hooks";
import { createComponent } from "../component";
//@@viewOff:imports

const useWindowRect = () => {
  function getWindowRect() {
    return { left: 0, top: 0, width: innerWidth, height: innerHeight, right: innerWidth, bottom: innerHeight };
  }
  let [rect, setRect] = useState(getWindowRect);

  useLayoutEffect(() => {
    let onResize = e => setRect(getWindowRect());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return rect;
};

const STATICS = {
  //@@viewOn:statics
  displayName: "UU5.Hooks.TriggerIfAlmostVisible"
  //@@viewOff:statics
};

// TODO Add support for any/nearest scroll element. Currently only scrolling on window is supported.
export const TriggerIfAlmostVisible = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ onTrigger, triggerDistance = 1000, children }) {
    //@@viewOn:hooks
    let elementRef = useRef();
    let [triggerred, setTriggerred] = useState(false);

    let scrollElementRect = useWindowRect();
    let [elementRect, setElementRect] = useState();
    useLayoutEffect(() => {
      if (!triggerred) {
        setElementRect(elementRef.current.getBoundingClientRect());

        let onScroll = e => setElementRect(elementRef.current.getBoundingClientRect());
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
      }
    }, [triggerred]);

    useLayoutEffect(() => {
      if (elementRef.current && typeof onTrigger === "function" && !triggerred && scrollElementRect && elementRect) {
        if (scrollElementRect.bottom + triggerDistance > elementRect.top) {
          setTriggerred(true);
          onTrigger();
        }
      }
    }, [scrollElementRect, elementRect, triggerDistance, onTrigger, triggerred]);
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <div ref={elementRef}>{triggerred ? children : null}</div>;
    //@@viewOff:render
  }
});
export default TriggerIfAlmostVisible;
