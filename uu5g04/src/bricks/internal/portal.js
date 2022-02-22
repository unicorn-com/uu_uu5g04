import UU5 from "uu5g04";

const LAYER = { MODAL: "modal", ALERT_BUS: "alert-bus", POPOVER: "popover" };

/**
 * @param {"modal"|"alert-bus"|"popover"} layer Which layer to put the portal to - based on https://uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=spa_page_01
 * @return DOM element to render portal content to.
 */
function getDefaultPortalElement(layer) {
  let result = document.getElementById("uu5-common-portal-" + layer);
  if (!result) {
    result = document.createElement("div");
    result.setAttribute("id", "uu5-common-portal-" + layer);
    if (layer === "alert-bus") result.style.cssText = "z-index: 1100; position: fixed; top: 0; left: 0; right: 0;";
    // layers must be in the order modal -> alert-bus -> popover
    let insertBeforeEl;
    for (let followingLayer of [LAYER.POPOVER, LAYER.ALERT_BUS, LAYER.MODAL]) {
      if (followingLayer === layer) break;
      let el = document.getElementById("uu5-common-portal-" + layer);
      if (el) insertBeforeEl = el;
    }
    document.body.insertBefore(result, insertBeforeEl);
  }
  return result;
}

const RenderIntoPortal = function ({ layer = LAYER.MODAL, portalElement, children }) {
  return UU5.Common.Portal.create(children, portalElement || getDefaultPortalElement(layer));
};

export { LAYER, RenderIntoPortal, getDefaultPortalElement };
