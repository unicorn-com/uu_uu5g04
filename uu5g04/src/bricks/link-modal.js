import UU5, { createVisualComponent } from "uu5g04";
import Link from "./link";
// TODO because PortalModal is new layer and not all of the alertBus or popover working with it
import Modal from "./modal";

export const LinkModal = createVisualComponent({

  displayName: "UU5.Bricks.LinkModal",
  nestingLevel: "inline",

  propTypes: {
    // ...Link.propTypes,

    component: UU5.PropTypes.any.isRequired, // content
    modalProps: UU5.PropTypes.object
  },

  defaultProps: {
    // ...Link.defaultProps,
    target: "_blank",

    component: undefined,
    modalProps: undefined
  },

  getInitialState() {
    this._modalRef = UU5.Common.Reference.create();
    return {};
  },

  _open(...args) {
    this._modalRef.current.open({ header: this.props.children, content: this.props.component });
    typeof this.props.onClick === "function" && this.props.onClick(...args);
  },

  render() {
    const { hidden, children, modalProps, component, ...linkProps } = this.props;

    return !hidden && (
      <UU5.Common.Fragment>
        <Link {...linkProps} content={children} onClick={this._open} />
        <Modal {...modalProps} shown={false} ref_={this._modalRef} />
      </UU5.Common.Fragment>
    )
  }
});

export default LinkModal;
