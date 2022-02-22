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

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Lsi from "./internal/bricks-editable-lsi.js";

const EditationComponent = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/authenticated-editable.js");
});
//@@viewOff:imports

let editationLazyLoaded = false;

export const Authenticated = UU5.Common.VisualComponent.create({
  displayName: "Authenticated", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [UU5.Common.BaseMixin, UU5.Common.IdentityMixin, UU5.Common.ContentMixin, UU5.Common.EditableMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Authenticated"),
    errors: {
      noPropsGiven:
        "The component will never show any content - you should always set at least one of the props 'pending', 'authenticated', 'notAuthenticated' to true.",
    },
    editMode: {
      name: Lsi.authenticated.name,
      backgroundColor: "rgba(0,0,0,.2)",
      color: "rgba(0,0,0,.87)",
      highlightColor: "#CCCCCC",
      enablePlaceholder: true,
      startMode: "button",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    authenticated: UU5.PropTypes.bool,
    notAuthenticated: UU5.PropTypes.bool,
    pending: UU5.PropTypes.bool,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      authenticated: false,
      notAuthenticated: false,
      pending: false,
      contentEditable: true,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._checkProps(this.props);
    return {
      editationLazyLoaded: false,
    };
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    this._checkProps(nextProps);
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:overriding
  onBeforeForceEndEditation_() {
    return this._editableComponent ? this._editableComponent.getPropsToSave() : undefined;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _registerNull(inst) {
    // unmount of component means that suspense is loaded and component should be rendered
    if (!inst) {
      this.setState((state) => {
        if (state.editationLazyLoaded) return;

        // Edit component is loaded - need to set to static variable because other Edit component does not render fallback component
        // editationLazyLoaded is stored in both state and static variable for cases such as when more edit modes are loaded at the same time
        editationLazyLoaded = true;
        return { editationLazyLoaded: true };
      });
    }
  },

  _isEditationLazyLoaded() {
    return editationLazyLoaded;
  },

  _renderEditationMode() {
    return (
      <UU5.Common.Suspense fallback={<span ref={this._registerNull} />}>
        <EditationComponent component={this} ref_={this._registerEditableComponent} editMode={this.props.editMode} />
      </UU5.Common.Suspense>
    );
  },

  _registerEditableComponent(component) {
    this._editableComponent = component;
  },

  _checkProps(props) {
    if (!props.pending && !props.authenticated && !props.notAuthenticated) {
      this.showError("noPropsGiven");
    }
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let renderContent =
      (this.props.notAuthenticated && this.isNotAuthenticated()) ||
      (this.props.pending && this.isPending()) ||
      (this.props.authenticated && this.isAuthenticated());

    return (
      <>
        {this.state.editation || this.props.editMode ? this._renderEditationMode() : null}
        {renderContent && (!this.state.editation || !this._isEditationLazyLoaded()) && !this.props.editMode
          ? this.getChildren()
          : null}
      </>
    );
  },
  //@@viewOff:render
});

export default Authenticated;
