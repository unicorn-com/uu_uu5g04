import UU5 from "uu5g04";

export const LAYER = { MODAL: "modal", ALERT_BUS: "alert-bus", POPOVER: "popover" };

export const PortalElementContext = UU5.Common.Context.create({
  /**
   * @param {"modal"|"alert-bus"|"popover"} layer Which layer to put the portal to - based on https://uuos9.plus4u.net/uu-dockitg01-main/78462435-ed11ec379073476db0aa295ad6c00178/book/page?code=spa_page_01
   * @return DOM element to render portal content to.
   */
  getPortalElement(layer) {
    let result = document.getElementById("uu5-common-portal-" + layer);
    if (!result) {
      result = document.createElement("div");
      result.setAttribute("id", "uu5-common-portal-" + layer);
      document.body.appendChild(result);
    }
    return result;
  }
});

export const RenderIntoPortal = function({ layer = LAYER.MODAL, children }) {
  return (
    <PortalElementContext.Consumer>
      {({ getPortalElement }) => UU5.Common.Portal.create(children, getPortalElement(layer))}
    </PortalElementContext.Consumer>
  );
};
