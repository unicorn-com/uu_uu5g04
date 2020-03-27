//@@viewOn:imports
import React from "react";
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";

const ComponentEditable = UU5.Common.Component.lazy(() => import("./component-editable.js"));
//@@viewOff:imports

export const Component = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.EditableMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Component"),
    nestingLevelList: UU5.Environment.getNestingLevelList("box")
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    text: UU5.PropTypes.string
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      text: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:overriding
  onBeforeForceEndEditation_() {
    return this._editRef ? this._editRef.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:render
  render() {
    return (
      <UU5.Common.Fragment>
        {this.isInlineEdited() && (
          <UU5.Common.Suspense fallback={this.getEditingLoading()}>
            <ComponentEditable
              props={this.props}
              onClose={this.endEditation}
              ref={ref => (this._editRef = ref)}
            />
          </UU5.Common.Suspense>
        )}
        {this.isNotInlineEdited() && <UU5.Common.Div content={this.props.text} />}
      </UU5.Common.Fragment>
    );
  }
  //@@viewOff:render
});

export default Component;
