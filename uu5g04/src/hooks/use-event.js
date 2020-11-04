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
import { useLayoutEffect, useRef } from "./react-hooks";

export function useEvent(eventName, handler, element, opts) {
  const handlerRef = useRef();

  useLayoutEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  let optsStr = opts ? JSON.stringify(opts) : undefined;
  useLayoutEffect(() => {
    let usedElement = element;
    if (usedElement && !(usedElement instanceof Element)) {
      // NOTE Support for ref-s is actually only for cases when React doesn't recognize onXyz prop.
      // For other cases with ref-s developers should just define onXyz on the element with ref instead of using useEvent.
      if (typeof usedElement === "object" && "current" in usedElement) {
        usedElement = usedElement.current;
        if (process.env.NODE_ENV === "development" && usedElement === undefined) {
          UU5.Common.Tools.warning(
            "You have passed element ref to useEvent(name, fn, ref) but the ref remained unset. You either forgot to pass the ref onto a DOM element or you're passing a ref from parent component (this isn't supported due to React's ordering of mount operations)."
          );
        }
      }
      if (!usedElement) return;
      if (typeof usedElement.addEventListener !== "function") {
        if (process.env.NODE_ENV === "development") {
          UU5.Common.Tools.warning(
            `You have passed unsupported element '${element}' to useEvent(name, fn, element). You can use DOM object (e.g. window), React ref or leave element out (for custom events).`
          );
        }
        return;
      }
    }

    const opts = optsStr ? JSON.parse(optsStr) : undefined;
    const eventListener = (...args) => handlerRef.current?.(...args);
    UU5.Utils.EventManager.register(eventName, eventListener, usedElement, opts);
    return () => UU5.Utils.EventManager.unregister(eventName, eventListener, usedElement, opts);
  }, [eventName, element, optsStr]);

  if (!element) {
    return (...args) => UU5.Utils.EventManager.trigger(eventName, ...args);
  }
}

export default useEvent;
