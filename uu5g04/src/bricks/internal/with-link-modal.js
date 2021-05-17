//@@viewOn:imports
import UU5, { createComponent } from "uu5g04";
//@@viewOff:imports

export function withLinkModal(Component, displayName, nestingLevel, defaultLabel, modalProps) {
  return createComponent({
    //@@viewOn:statics
    displayName: `withLinkModal(${displayName})`,
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {},
    //@@viewOff:propTypes

    //@@viewOn:defaultProps
    defaultProps: {},
    //@@viewOff:defaultProps

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    render() {
      const { nestingLevel: propsNestingLevel, ...restProps } = this.props;
      const label =
        defaultLabel && typeof defaultLabel === "object" ? <UU5.Bricks.Lsi lsi={defaultLabel} /> : defaultLabel;
      const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(this.props, { nestingLevel });
      return currentNestingLevel ? (
        <Component {...this.props} nestingLevel={propsNestingLevel} />
      ) : (
        <UU5.Bricks.LinkModal modalProps={modalProps} component={<Component {...restProps} parent={null} />}>
          {label}
        </UU5.Bricks.LinkModal>
      );
    },
    //@@viewOff:render
  });
  //@@viewOff:render
}

export default withLinkModal;
