import UU5 from "uu5g04";

/**
 * @param {boolean} allowCreateElement Whether to allow creating of portal element if it doesn't exist.
 * @param {"modal"|"alert-bus"|"popover"} layer Which layer to put the portal to - based on https://uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=spa_page_01
 * @return DOM element to render portal content to.
 */
export function getPortalElement(allowCreateElement, layer = "modal") {
  let page = UU5.Environment.getPage();
  let result = page && page.getPortalContainer(layer);
  if (!result) result = document.getElementById("uu5-common-portal-" + layer);
  if (!result && allowCreateElement) {
    result = document.createElement("div");
    result.setAttribute("id", "uu5-common-portal-" + layer);
    document.body.appendChild(result);
  }
  return result;
}
