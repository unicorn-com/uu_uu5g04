/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
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
