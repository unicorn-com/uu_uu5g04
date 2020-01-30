import * as UU5 from "uu5g04";
import ns from "../bricks-editable-ns.js";

import Css from "./css.js";

//TODO FOR NOW, this component should be from uu5
const POPOVERS_ID = "uu5-popover";
export const Preview = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Preview"),
    classNames: {
      main: () =>
        ns.css("preview") +
        " " +
        Css.css(`
        position: relative;
      `),
      zoomArea: (props, state) => {
        return Css.css(`
          transform: scale(${state.zoomLevel});
          width: ${state.parentWidth}px;
          position: absolute;
          left: 0;
          top: 0;
          transform-origin: left top;
        `);
      },
      popover: () =>
        Css.css(`
        width: 100%;
        height: 100%;

        .uu5-bricks-preview {
          zoom: normal;
        }
      `),
      zoomButton: () =>
        Css.css(`
        position: absolute;
        right: 5px;
        top: 0;
      `)
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    props: UU5.PropTypes.object,
    component: UU5.PropTypes.func,
    itemComponent: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      props: undefined,
      component: undefined,
      itemComponent: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      zoomLevel: "normal",
      parentWidth: undefined
    };
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  expand() {
    this._popover.open();
  },

  redraw() {
    let componentParent = this.props.componentElement.offsetParent;
    if (componentParent) {
      let parentWidth = componentParent.getBoundingClientRect().width;
      let previewWidth = this.findDOMNode().getBoundingClientRect().width;

      if (parentWidth > previewWidth) {
        this.setState({ zoomLevel: previewWidth / parentWidth, parentWidth });
      }
    }
  },
  //@@viewOff:interface

  //@@viewOn:private
  _registerComponent(ref) {
    this._component = ref;
  },

  _registerPopover(ref) {
    this._popover = ref;
  },

  _getPortalElem(allowCreateElement) {
    // create portal in DOM
    let result = document.getElementById(POPOVERS_ID);
    if (!result && allowCreateElement) {
      result = document.createElement("div");
      result.setAttribute("id", POPOVERS_ID);
      document.body.appendChild(result);
    }

    return result;
  },

  _removePortal() {
    // try to remove portal from DOM if does not exists
    if (!this.state.open) {
      const portal = this._getPortalElem();
      if (portal && portal.childNodes.length === 0) {
        portal.parentNode.removeChild(portal);
      }
    }
  },

  _onClosePopover(opt) {
    this._popover.onCloseDefault();
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let componentProps = { ...this.props.props };
    const Component = this.props.component;
    const component = <Component {...componentProps} ref_={this._registerComponent} />;

    return (
      <div {...this.getMainAttrs()}>
        <div className={this.getClassName("zoomArea")}>
          {component}
          {UU5.Common.Portal.create(
            <UU5.Bricks.Popover ref_={this._registerPopover} className={this.getClassName("popover")} forceRender>
              {component}
            </UU5.Bricks.Popover>,
            this._getPortalElem(true)
          )}
        </div>
        <UU5.Bricks.Button
          onClick={this.expand}
          content={<UU5.Bricks.Icon icon="mdi-magnify" />}
          className={this.getClassName("zoomButton")}
        />
      </div>
    );
  }
  //@@viewOff:render
});

export default Preview;
