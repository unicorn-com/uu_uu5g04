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

import * as UU5 from "uu5g04";
import ns from "../bricks-editable-ns.js";
import Lsi from "../bricks-editable-lsi.js";

export const ConfirmModal = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: "ConfirmModal",
    classNames: {
      main: ns.css("confirm-modal"),
    },
    lsi: () => Lsi.confirmModal,
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    bodyContent: UU5.PropTypes.any,
    headerContent: UU5.PropTypes.any,
    confirmContent: UU5.PropTypes.any,
    cancelContent: UU5.PropTypes.any,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      bodyContent: <UU5.Bricks.Lsi lsi={Lsi.confirmModal.content} />,
      headerContent: <UU5.Bricks.Lsi lsi={Lsi.confirmModal.header} />,
      confirmButtonContent: <UU5.Bricks.Lsi lsi={Lsi.confirmModal.confirm} />,
      refuseButtonContent: <UU5.Bricks.Lsi lsi={Lsi.confirmModal.cancel} />,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overridingMethods
  //@@viewOff:overridingMethods

  //@@viewOn:private
  _onConfirmModalRegister(modal) {
    modal.open();

    if (typeof this.props.ref_ === "function") {
      this.props.ref_(modal);
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    return (
      <UU5.Bricks.ConfirmModal
        {...this.props}
        ref_={this._onConfirmModalRegister}
        onConfirm={this.props.onConfirm}
        onRefuse={this.props.onRefuse}
        content={this.props.bodyContent}
        size="m"
        header={this.props.headerContent}
        confirmButtonProps={{
          content: this.props.confirmButtonContent,
        }}
        refuseButtonProps={{
          content: this.props.refuseButtonContent,
        }}
      />
    );
  },
  //@@viewOff:render
});

export default ConfirmModal;
