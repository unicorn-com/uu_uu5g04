/**
 * Copyright (C) 2019 Unicorn a.s.
 *
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 *
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import UU5 from "uu5g04";
import { useState, useLayoutEffect, useContext, useMemo } from "./react-hooks";
import { createComponent } from "./component";
import { useParentSize } from "./use-parent-size";

const ScreenSizeContext = UU5.Utils.ScreenSize.Context;
function useScreenSizeContext() {
  return useContext(ScreenSizeContext);
}

const ScreenSizeProvider = createComponent({
  //@@viewOn:statics
  displayName: "UU5.Hooks.ScreenSizeProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    screenSize: UU5.PropTypes.oneOf(Object.keys(UU5.Utils.ScreenSize.SIZE_MAP)),
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    screenSize: undefined,
  },
  //@@viewOff:defaultProps

  render({ screenSize, children }) {
    //@@viewOn:hooks
    const { Resizer, width } = useParentSize();
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    // screenSize prop:
    //   undefined <=> compute from element
    //   null <=> provide null (so that useScreenSize uses screen size)
    //   others <=> as-is
    const usedScreenSize =
      screenSize !== undefined ? screenSize : width != null ? UU5.Utils.ScreenSize.countSize(width) : undefined;
    const value = useMemo(() => (usedScreenSize ? { screenSize: usedScreenSize } : null), [usedScreenSize]);
    //@@viewOff:private

    //@@viewOn:render
    return (
      <>
        <Resizer />
        {usedScreenSize !== undefined ? (
          <ScreenSizeContext.Provider value={value}>{children}</ScreenSizeContext.Provider>
        ) : null}
      </>
    );
    //@@viewOff:render
  },
});

function useScreenSize() {
  let contextValue = useScreenSizeContext();
  const [screenSize, setScreenSize] = useState(() => UU5.Utils.ScreenSize.getSize());
  let usedScreenSize = contextValue != null ? contextValue.screenSize : screenSize;

  useLayoutEffect(() => {
    if (contextValue == null) {
      const changeScreenSize = (e, screenSize) => setScreenSize(screenSize);
      UU5.Utils.ScreenSize.register(changeScreenSize);
      return () => UU5.Utils.ScreenSize.unregister(changeScreenSize);
    }
  }, [contextValue]);

  return usedScreenSize;
}

export { useScreenSize, ScreenSizeProvider };
export default useScreenSize;
