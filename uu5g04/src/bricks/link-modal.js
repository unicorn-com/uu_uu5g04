import UU5, { createVisualComponent } from "uu5g04";
import Link from "./link";
// TODO because PortalModal is new layer and not all of the alertBus or popover working with it
import Modal from "./modal";
import { getHref } from "./link-uve.js";

export const LinkModal = createVisualComponent({
  displayName: "UU5.Bricks.LinkModal",
  nestingLevel: "inline",

  propTypes: {
    // ...Link.propTypes,

    component: UU5.PropTypes.any.isRequired, // content
    modalProps: UU5.PropTypes.object,
    uveProps: UU5.PropTypes.shape({
      componentName: UU5.PropTypes.string.isRequired,
      componentProps: UU5.PropTypes.object.isRequired,
      top: UU5.PropTypes.any, // lsi or string
      languages: UU5.PropTypes.array,
      title: UU5.PropTypes.any, // lsi or string
      publicContent: UU5.PropTypes.bool,
    }),
  },

  defaultProps: {
    // ...Link.defaultProps,
    target: "_blank",

    component: undefined,
    modalProps: undefined,
    uveProps: undefined,
  },

  getInitialState() {
    this._modalRef = UU5.Common.Reference.create();
    return {};
  },

  _open(component, e) {
    e.preventDefault();
    let header = this.props.children;
    if (this.props.modalProps && "header" in this.props.modalProps) header = this.props.modalProps.header;
    this._modalRef.current.open({ header, content: this.props.component });
    typeof this.props.onClick === "function" && this.props.onClick(...component);
  },

  render() {
    const { hidden, children, modalProps, component, uveProps, ...linkProps } = this.props;

    return (
      !hidden && (
        <UU5.Common.Fragment>
          <Link
            {...linkProps}
            href={
              uveProps
                ? getHref(linkProps.href || UU5.Environment.COMPONENT_RENDER_UVE, uveProps)
                : undefined
            }
            content={children}
            onClick={this._open}
            //empty methods are here to call preventDefautl
            onCtrlClick={() => {}}
            onWheelClick={() => {}}
          />
          <Modal location="portal" {...modalProps} shown={false} controlled={false} ref_={this._modalRef} />
        </UU5.Common.Fragment>
      )
    );
  },
});

export default LinkModal;
