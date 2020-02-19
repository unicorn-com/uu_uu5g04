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

//@@viewOn:imports
import * as UU5 from "uu5g04";
import "uu5g04-bricks";
import ns from "./forms-ns.js";

import ItemsInput from "./internal/items-input.js";
import Message from "./internal/message.js";

import ChoiceMixin from "./mixins/choice-mixin.js";
import InputMixin from "./mixins/input-mixin.js";
import ClassNames from "../core/common/class-names.js";

import Context from "./form-context.js";

import "./file.less";
//@@viewOff:imports

const Fragment = UU5.Common.Fragment || (props => props.children);

export const File = Context.withContext(
  UU5.Common.VisualComponent.create({
    displayName: "File", // for backward compatibility (test snapshots)
    //@@viewOn:mixins
    mixins: [
      UU5.Common.BaseMixin,
      UU5.Common.PureRenderMixin,
      UU5.Common.ElementaryMixin,
      UU5.Common.ContentMixin,
      UU5.Common.ColorSchemaMixin,
      InputMixin,
      ChoiceMixin
    ],
    //@@viewOff:mixins

    //@@viewOn:statics
    statics: {
      tagName: ns.name("File"),
      classNames: {
        main: ns.css("file"),
        input: ns.css("file-input"),
        inputRow: ns.css("file-input-row"),
        inputInProgress: ns.css("file-input-in-progress"),
        placeholder: ns.css("file-placeholder"),
        icon: ns.css("file-icon"),
        noIcon: ns.css("file-no-icon"),
        closeButton: ns.css("file-close-button"),
        closeIcon: ns.css("file-close-icon"),
        downloadButton: ns.css("file-download-button"),
        downloadIcon: ns.css("file-download-icon"),
        item: ns.css("file-item"),
        itemNoIcon: ns.css("file-item-no-icon"),
        itemIcon: ns.css("file-item-icon"),
        itemName: ns.css("file-item-name"),
        itemSize: ns.css("file-item-size"),
        itemMessage: ns.css("file-item-message"),
        itemMessageIcon: ns.css("file-item-message-icon"),
        itemInProgress: ns.css("file-item-in-progress"),
        progress: ns.css("file-progress"),
        progressCurrent: ns.css("file-progress-current"),
        multiple: ns.css("file-multiple"),
        selected: ns.css("file-selected"), // selected single
        list: ns.css("file-list"),
        noValue: ns.css("file-no-value"),
        indicateDrop: ns.css("file-indicate-drop")
      },
      lsi: () => UU5.Common.Tools.merge({}, UU5.Environment.Lsi.Forms.file, UU5.Environment.Lsi.Forms.message)
    },
    //@@viewOff:statics

    //@@viewOn:propTypes
    propTypes: {
      value: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.arrayOf(UU5.PropTypes.object)]),
      multiple: UU5.PropTypes.bool,
      closeIcon: UU5.PropTypes.string,
      downloadIcon: UU5.PropTypes.string,
      selectedIcon: UU5.PropTypes.string,
      borderRadius: UU5.PropTypes.string,
      bgStyle: UU5.PropTypes.oneOf(["filled", "outline", "transparent", "underline"]),
      elevation: UU5.PropTypes.oneOf(["-1", "0", "1", "2", "3", "4", "5", -1, 0, 1, 2, 3, 4, 5]),
      authenticate: UU5.PropTypes.bool,
      dndAreaPlaceholder: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string])
    },
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    getDefaultProps() {
      return {
        value: null,
        multiple: false,
        icon: "mdi-cloud-upload",
        closeIcon: "mdi-window-close",
        downloadIcon: "mdi-content-save",
        selectedIcon: "mdi-attachment",
        borderRadius: null,
        bgStyle: null,
        elevation: null,
        authenticate: false,
        dndAreaPlaceholder: undefined
      };
    },
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    getInitialState() {
      return {
        indicateDrop: null,
        tokens: {}
      };
    },

    componentWillMount() {
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: this.state.value, event: null, component: this });
      }
    },

    componentDidMount() {
      let dropZone = this._getDropZoneNode();
      if (dropZone) {
        UU5.Environment.EventListener.addEvent(dropZone, "dragover", this.getId(), this._handleDragOver);
        UU5.Environment.EventListener.addEvent(dropZone, "drop", this.getId(), this._handleFileSelect);
      }
      document.documentElement.addEventListener("dragleave", this._handleBodyDragLeave, true);
      document.documentElement.addEventListener("dragover", this._handleBodyDragOver, true);
      document.documentElement.addEventListener("drop", this._handleBodyDrop, true);
      return this;
    },

    componentWillUnmount() {
      this._unmounted = true;
      let dropZone = this._getDropZoneNode();
      if (dropZone) {
        UU5.Environment.EventListener.removeEvent(dropZone, "dragover", this.getId());
        UU5.Environment.EventListener.removeEvent(dropZone, "drop", this.getId());
      }
      document.documentElement.removeEventListener("dragleave", this._handleBodyDragLeave, true);
      document.documentElement.removeEventListener("dragover", this._handleBodyDragOver, true);
      document.documentElement.removeEventListener("drop", this._handleBodyDrop, true);
      if (this._urls) [...this._urls.values()].forEach(url => URL.revokeObjectURL(url));
      clearTimeout(this._dragCancelTimeout);
      return this;
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.controlled) {
        if (this.props.onValidate && typeof this.props.onValidate === "function") {
          this._validateOnChange({ value: nextProps.value, event: null, component: this }, true);
        }
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    addValue(file, setStateCallback) {
      this.setValue(this._buildNewValue(file), setStateCallback);
      return this;
    },

    onChangeDefault(opt, setStateCallback) {
      if (this.props.onValidate && typeof this.props.onValidate === "function") {
        this._validateOnChange({ value: opt.value, event: opt.event, component: this }, false, setStateCallback);
      } else {
        let result = this.getChangeFeedback(opt);
        this.setState(
          {
            feedback: result.feedback,
            message: result.message,
            value: result.value
          },
          setStateCallback
        );
      }

      return this;
    },
    //@@viewOff:interface

    //@@viewOn:overriding
    isValid_() {
      let { value } = this.state;
      let valid = true;
      if (value) {
        let list = Array.isArray(value) ? value : [value];
        valid = !list.some(item => !!item.message);
      }
      return valid;
    },

    setValue_(value, setStateCallback) {
      if (this._checkRequired({ value: value })) {
        if (typeof this.props.onValidate === "function") {
          this._validateOnChange({ value: value, event: null, component: this });
        } else {
          this.setInitial(null, value, setStateCallback);
        }
      }

      return this;
    },

    setFeedback_(feedback, message, value, setStateCallback) {
      if (value === "") {
        value = null;
      }

      this.setState(
        {
          feedback: feedback,
          message: message,
          value: value
        },
        setStateCallback
      );

      return this;
    },

    getValue_() {
      return this._getFileValuesOnly(this.state.value);
    },

    getInputWrapperProps_(...args) {
      let wrapperProps = this._getInputWrapperPropsDefault(...args);
      wrapperProps.ref_ = this._setInputWrapperRef;
      return wrapperProps;
    },
    //@@viewOff:overriding

    //@@viewOn:private
    _getDndAreaPlaceholder() {
      return this.props.dndAreaPlaceholder !== undefined
        ? this.props.dndAreaPlaceholder
        : this.constructor.lsi().dropHere;
    },

    _setInputWrapperRef(ref) {
      this._inputWrapper = ref;
    },

    _getDropZoneNode() {
      return this._inputWrapper ? this._inputWrapper.findDOMNode() : null;
    },

    _getFileValuesOnly(extendedValue) {
      let result = extendedValue;
      if (Array.isArray(result)) result = result.map(it => it.file || it);
      else if (result) result = result.file || result;
      return result;
    },

    _changeValue(value, e) {
      let opt = { value: value, event: e, component: this };

      // prevent keeping enter listener - single file input renders link instead of input, in this case Chrome fires focus event from input but never fires blur event
      if (!this.props.multiple && !this.state.value && opt.value && !Array.isArray(opt.value)) {
        this._onBlur();
      }

      if (typeof this.props.onChange === "function") {
        this.props.onChange(opt);
      } else {
        this.onChangeDefault(opt);
      }
      return this;
    },

    _onChange(e) {
      if (!this.isComputedDisabled() && !this.isReadOnly()) {
        this._changeValue(this._buildNewValue(e.target.files), e);
      }
      return this;
    },

    _buildNewValue(file) {
      let newValue = null;
      if (file && file.length) {
        if (this.props.multiple) {
          let value = this.getValue();
          newValue = Array.isArray(value) ? value.slice() : [];
          let prevValue = newValue.slice();

          for (let i = 0; i < file.length; i++) {
            if (
              !prevValue.some(item => {
                return (
                  file[i].name === item.name && file[i].size === item.size && file[i].lastModified === item.lastModified
                );
              })
            ) {
              newValue.push(file[i]);
            }
          }
        } else {
          newValue = file[0];
        }
      } else {
        newValue = file;
      }
      return newValue;
    },

    _getTextInputAttrs() {
      var props = {};

      if (!this.state.isReadOnly && !this.isComputedDisabled()) {
        props.onClick = () => this._open();
      }

      return props;
    },

    _getMainAttrs() {
      let attrs = this._getInputAttrs();
      if (this.props.multiple) {
        attrs.className += " " + this.getClassName().multiple;
      }
      if (!this.props.multiple && this.state.value) {
        attrs.className += " " + this.getClassName().selected;
      }
      if (this._getIcon() == null) {
        attrs.className += " " + this.getClassName().noIcon;
      }
      if (!this.state.value) {
        attrs.className += " " + this.getClassName().noValue;
      }
      return attrs;
    },

    _validateOnChange(opt, checkValue, setStateCallback) {
      let _callCallback = typeof setStateCallback === "function";

      if (!checkValue || this._hasValueChanged(this.state.value, opt.value)) {
        let result = typeof this.props.onValidate === "function" ? this.props.onValidate(opt) : null;
        if (result) {
          if (typeof result === "object") {
            if (result.feedback) {
              _callCallback = false;
              this.setFeedback(result.feedback, result.message, result.value, setStateCallback);
            } else {
              _callCallback = false;
              this.setState({ value: opt.value }, setStateCallback);
            }
          } else {
            this.showError("validateError", null, {
              context: {
                event: e,
                func: this.props.onValidate,
                result: result
              }
            });
          }
        }
      }

      if (_callCallback) {
        setStateCallback();
      }

      return this;
    },

    _getIcon() {
      return !this.props.multiple && this.state.value ? this.props.selectedIcon : this.props.icon;
    },

    _open() {
      document.getElementById(this.getId() + "-file").click();
      return this;
    },

    _handleFileSelect(e) {
      e.stopPropagation();
      e.preventDefault();

      if (!this.isComputedDisabled() && !this.isReadOnly()) {
        let types = (e.dataTransfer && e.dataTransfer.types) || ["Files"];
        let hasFiles = types.includes("Files");
        if (hasFiles) this._changeValue(this._buildNewValue(e.dataTransfer.files), e);
      }

      return this;
    },

    _handleBodyDragOver(e) {
      if (e.target !== this._lastDragOverTarget) this._updateIndicateDrop(e);
      this._lastDragOverTarget = e.target;

      // if user drags e.g. .zip file over BODY and drops it then we don't get
      // any event about that => if no dragover happens within
      // some time then assume the user is no longer dragging
      clearTimeout(this._dragCancelTimeout);
      Promise.resolve().then(() => {
        this._dragCancelTimeout = setTimeout(() => {
          if (this._unmounted) return;
          this.setState(state => (state.indicateDrop ? { indicateDrop: null } : undefined));
        }, 1000); // bigger timeout
      });
    },
    _handleBodyDragLeave(e) {
      delete this._lastDragOverTarget;
      // if user drags file over BODY but then drops it outside of window then we don't get
      // any event about that (we'll get dragleave but we get it also on mouse move whenever
      // we're changing which element we're hovering over) => if no dragover happens within
      // some time since last dragleave then assume the user is no longer dragging
      clearTimeout(this._dragCancelTimeout);
      Promise.resolve().then(() => {
        this._dragCancelTimeout = setTimeout(() => {
          if (this._unmounted) return;
          this.setState(state => (state.indicateDrop ? { indicateDrop: null } : undefined));
        }, 200); // smaller timeout
      });
    },
    _handleBodyDrop(e) {
      delete this._lastDragOverTarget;
      clearTimeout(this._dragCancelTimeout);
      this.setState(state => (state.indicateDrop ? { indicateDrop: null } : undefined));
    },
    _updateIndicateDrop(e) {
      let types = (e.dataTransfer && e.dataTransfer.types) || ["Files"];
      let hasFiles = types.includes("Files");
      if (hasFiles) {
        let myDropZoneNode = this._getDropZoneNode();
        let node = e.target;
        while (node && node !== myDropZoneNode) node = node.parentNode;
        let newIndicateDrop = node === myDropZoneNode ? "over" : "near";
        this.setState(state =>
          state.indicateDrop !== newIndicateDrop ? { indicateDrop: newIndicateDrop } : undefined
        );
      }
    },

    _handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy"; // Explicitly show this is a copy.
      clearTimeout(this._dragCancelTimeout);
      let newIndicateDrop = "over";
      this.setState(state => (state.indicateDrop !== newIndicateDrop ? { indicateDrop: newIndicateDrop } : undefined));

      return this;
    },

    _getFilesName() {
      let result = "";
      let value = this.state.value;

      if (value) {
        if (Array.isArray(value)) {
          result = value.map((item, i) => {
            let { file, name, size, url, progress, message } = this._normalizeValueItem(item);
            let showError = message && !this.isReadOnly() && !this.isDisabled();
            let itemClassNames = [this.getClassName("item")];
            if (!this.props.selectedIcon && !showError) itemClassNames.push(this.getClassName("itemNoIcon"));

            return (
              <li key={i} className={itemClassNames.join(" ")}>
                {showError ? (
                  this._renderItemError(message)
                ) : (
                  <Fragment key="ok">
                    {this.props.selectedIcon ? (
                      <UU5.Bricks.Icon
                        icon={this.props.selectedIcon}
                        className={
                          this.getClassName("itemIcon") +
                          (progress != null && progress < 1 ? " " + this.getClassName("itemInProgress") : "")
                        }
                      />
                    ) : null}
                    {progress != null && progress < 1 ? (
                      <UU5.Bricks.Text
                        disabled={this.isDisabled()}
                        content={name}
                        className={this.getClassName("itemName") + " " + this.getClassName("itemInProgress")}
                        nestingLevel="inline"
                        colorSchema="custom"
                      />
                    ) : (
                      <UU5.Bricks.Link
                        disabled={this.isDisabled()}
                        content={name}
                        mainAttrs={{ tabIndex: !this.isDisabled() ? "0" : null }}
                        className={this.getClassName("itemName")}
                        {...this._getItemOpenLinkProps({ url, file, name })}
                      />
                    )}
                    {progress != null ? this._renderProgress(progress) : null}
                    {size != null ? this._renderSize(size) : null}
                    {(file || url) && (progress == null || progress >= 1) && this.props.downloadIcon ? (
                      <UU5.Bricks.Link
                        disabled={this.isDisabled()}
                        className={
                          this.getClassName().downloadButton +
                          " uu5-bricks-button uu5-bricks-button-transparent uu5-bricks-button-" +
                          this.props.size
                        }
                        colorSchema={this.getColorSchema()}
                        {...this._getItemDownloadLinkProps({ url, file, name })}
                        onFocus={!this.isReadOnly() && !this.isDisabled() ? () => this._onFocusExit(i) : null}
                        onBlur={!this.isReadOnly() && !this.isDisabled() ? () => this._onBlur() : null}
                      >
                        <UU5.Bricks.Icon className={this.getClassName().downloadIcon} icon={this.props.downloadIcon} />
                      </UU5.Bricks.Link>
                    ) : null}
                  </Fragment>
                )}
                {!this.isReadOnly() ? (
                  <UU5.Bricks.Button
                    disabled={this.isDisabled()}
                    className={this.getClassName().closeButton}
                    bgStyle="transparent"
                    colorSchema={this.getColorSchema()}
                    onClick={(component, e) => {
                      if (!this.isDisabled() && !this.isReadOnly()) {
                        this._resetInputValue();
                        this._changeValue(this._getFileValuesOnly(this.state.value.filter(it => it !== item)), e);
                      }
                    }}
                    onFocus={!this.isReadOnly() && !this.isDisabled() ? () => this._onFocusExit(i) : null}
                    onBlur={!this.isReadOnly() && !this.isDisabled() ? () => this._onBlur() : null}
                  >
                    <UU5.Bricks.Icon
                      className={this.getClassName().closeIcon}
                      icon={this.props.closeIcon || this.constructor.getDefaultProps().closeIcon}
                    />
                  </UU5.Bricks.Button>
                ) : null}
              </li>
            );
          });
        } else {
          let { file, name, url, progress } = this._normalizeValueItem(value);
          result =
            progress != null && progress < 1 ? (
              <UU5.Bricks.Text
                disabled={this.isDisabled()}
                content={name}
                className={this.getClassName("itemName") + " " + this.getClassName("itemInProgress")}
                nestingLevel="inline"
                colorSchema="custom"
              />
            ) : (
              <UU5.Bricks.Link
                disabled={this.isDisabled()}
                content={name}
                mainAttrs={{ tabIndex: !this.isDisabled() ? "0" : null }}
                className={this.getClassName("itemName")}
                {...this._getItemOpenLinkProps({ url, file, name })}
              />
            );
        }
      }

      return result;
    },

    _normalizeValueItem(item) {
      let result;
      if (!item || item.file || item.url) result = item || {};
      else if (item.toString() === "[object File]") result = { file: item, name: item.name, size: item.size };
      else if (typeof item === "object") result = item;
      else result = {};
      return result;
    },
    _getItemDownloadLinkProps(item) {
      let result;
      if (item.file && navigator.msSaveBlob) {
        result = {
          onClick: () => navigator.msSaveBlob(item.file, item.name)
        };
      } else {
        result = {
          target: "_blank", // if server returns "Content-Disposition: inline" then the browser might choose to display the content instead of downloading it => open in new tab so that user doesn't lose form
          download: item.name,
          href: (item.file && this._getCachedFileUrl(item.file)) || this._getUrl(item.url, "attachment") // prefer downloading via local File instance (faster)
        };
      }
      return result;
    },
    _getItemOpenLinkProps(item) {
      let result;
      if (!item.url && item.file && navigator.msSaveOrOpenBlob) {
        result = {
          onClick: () => navigator.msSaveOrOpenBlob(item.file, item.name)
        };
      } else {
        result = {
          target: "_blank",
          href: this._getUrl(item.url, "inline") || (item.file && this._getCachedFileUrl(item.file)) // prefer opening via remote (to have nice URL in address bar)
        };
      }
      return result;
    },
    _getCachedFileUrl(file) {
      if (!this._urls) this._urls = new Map();
      let url = this._urls.get(file);
      if (!url) {
        url = URL.createObjectURL(file);
        this._urls.set(file, url);
      }
      return url;
    },
    _getUrl(url, contentDisposition) {
      let result = url;
      if (url) {
        let parsedUrl = UU5.Common.Url.parse(url);
        let parameters = parsedUrl.parameters;
        let session = UU5.Environment.getSession();
        if (this.props.authenticate && session && session.isAuthenticated() && UU5.Environment.isTrustedDomain(url)) {
          let token = this._getCallToken(url, session);
          parameters["access_token"] = token;
        }
        if (contentDisposition) {
          parameters["contentDisposition"] = contentDisposition;
        }
        parsedUrl.set({ parameters });
        result = parsedUrl.toString();
      }
      return result;
    },

    _getCallToken(url, session) {
      let result = this.state.tokens[url];
      if (!result) {
        UU5.Common.Tools.getCallToken(url, session).then(token => {
          if (this.isRendered()) this.setState(state => ({ tokens: { ...state.tokens, [url]: token } }));
          // TODO Clean unused tokens from state.
        });
      }
      return result;
    },

    _checkRequired(opt) {
      let result = true;
      if (this.props.required && !opt.value && this.shouldValidateRequired()) {
        result = false;
        this.setError(this.props.requiredMessage || this.getLsiComponent("requiredMessage"), opt.value);
      }

      return result;
    },

    _resetInputValue() {
      if (this._inputVal) {
        this._inputVal.value = "";
      }
    },

    _renderProgress(progress) {
      return progress != null && progress >= 0 && progress < 1 ? (
        <span key="progress" className={this.getClassName("progress")}>
          <span className={this.getClassName("progressCurrent")} style={{ width: progress * 100 + "%" }} />
        </span>
      ) : null;
    },

    _renderSize(size) {
      let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
      while (size >= 1000 && sizes.length > 1) {
        size /= 1024;
        sizes.shift();
      }
      return (
        <span key="size" className={this.getClassName("itemSize")}>
          {" (" + Math.round(size * (size >= 100 ? 1 : 10)) / (size >= 100 ? 1 : 10) + " " + sizes[0] + ")"}
        </span>
      );
    },

    _renderItemError(message) {
      return (
        <UU5.Bricks.Text key="error" colorSchema="danger">
          <UU5.Bricks.Icon icon="mdi-alert" className={this.getClassName("itemMessageIcon")} />
          <Message inline className={this.getClassName("itemMessage")} content={message} colorSchema="danger" />
        </UU5.Bricks.Text>
      );
    },

    _getFileInput() {
      return (
        <input
          key="fileinput"
          type="file"
          id={this.getId() + "-file"}
          multiple={this.props.multiple}
          onChange={this._onChange}
          className={this.getClassName().input}
          ref={item => (this._inputVal = item)}
        />
      );
    },

    _getSingleInput(inputId) {
      let inputAttrs = this.props.inputAttrs || {};
      inputAttrs.onFocus = !this.isReadOnly() && !this.isComputedDisabled() ? () => this._onFocus() : null;
      inputAttrs.onBlur = !this.isReadOnly() && !this.isComputedDisabled() ? () => this._onBlur() : null;
      inputAttrs.tabIndex =
        !this.isReadOnly() && !this.isComputedDisabled() && !this.isLoading() && this.state.value === null ? "0" : null;
      inputAttrs.onClick =
        !this.isReadOnly() && !this.isComputedDisabled() && !this.isLoading() && this.state.value === null
          ? () => this._open()
          : null;

      let { url, file, size, name, progress, message } = this._normalizeValueItem(this.state.value);
      let showError = message && !this.isReadOnly() && !this.isDisabled();
      let showIndicateDrop = this.state.indicateDrop && !this.isReadOnly() && !this.isDisabled() && !this.state.value;
      let inputClassNames = [];
      if (progress != null) inputClassNames.push(this.getClassName("inputInProgress"));
      if (showIndicateDrop) {
        inputClassNames.push(this.getClassName("indicateDrop") + "-" + this.state.indicateDrop);
      }
      if (!this.state.value) inputClassNames.push(this.getClassName("placeholder"));

      let inputRowAttrs = {};
      inputRowAttrs.className = this.getClassName("inputRow");
      switch (this.state.feedback) {
        case "success":
          inputRowAttrs.className += " color-schema-" + UU5.Environment.getColorSchema("success");
          break;
        case "warning":
          inputRowAttrs.className += " color-schema-" + UU5.Environment.getColorSchema("warning");
          break;
        case "error":
          inputRowAttrs.className += " color-schema-" + UU5.Environment.getColorSchema("danger");
          break;
      }

      if (this.props.elevation && !this.props.multiple) {
        inputRowAttrs.className += " " + ClassNames.elevation + this.props.elevation;
        inputRowAttrs.style = { borderRadius: this.props.borderRadius };
      }

      return (
        <UU5.Bricks.Div {...inputRowAttrs}>
          {!showError ? (
            <ItemsInput
              id={inputId}
              key={inputId}
              name={this.props.name || inputId}
              value={this._getFilesName()}
              className={inputClassNames.join(" ") || undefined}
              placeholder={showIndicateDrop ? this._getDndAreaPlaceholder() : this.props.placeholder}
              multiple={this.props.multiple}
              mainAttrs={inputAttrs}
              disabled={this.isComputedDisabled()}
              readonly={this.isReadOnly()}
              loading={this.isLoading()}
              onItemClick={opt => {
                this.removeItem(opt);
              }}
              icon={this._getIcon()}
              iconClassName={
                this.state.value
                  ? this.getClassName("itemIcon") +
                    (progress != null && progress < 1 ? +" " + this.getClassName("itemInProgress") : "")
                  : this.getClassName("icon")
              }
              feedback={this.getFeedback()}
              borderRadius={this.props.borderRadius}
              elevation={this.props.multiple ? this.props.elevation : null}
              bgStyle={showIndicateDrop || !this.state.value ? this.props.bgStyle : undefined}
              inputWidth={this._getInputWidth()}
              colorSchema={this.props.colorSchema}
            />
          ) : (
            this._renderItemError(message)
          )}
          {!showError ? this._getFileInput() : null}
          {!showError && progress != null ? this._renderProgress(progress) : null}
          {!showError && size != null ? this._renderSize(size) : null}
          {!showError && (file || url) && (progress == null || progress >= 1) && this.props.downloadIcon ? (
            <UU5.Bricks.Link
              disabled={this.isDisabled()}
              className={
                this.getClassName().downloadButton +
                " uu5-bricks-button uu5-bricks-button-transparent uu5-bricks-button-" +
                this.props.size
              }
              colorSchema={this.getColorSchema()}
              {...this._getItemDownloadLinkProps({ url, file, name })}
              onFocus={!this.isReadOnly() && !this.isDisabled() ? () => this._onFocusExit(i) : null}
              onBlur={!this.isReadOnly() && !this.isDisabled() ? () => this._onBlur() : null}
            >
              <UU5.Bricks.Icon className={this.getClassName().downloadIcon} icon={this.props.downloadIcon} />
            </UU5.Bricks.Link>
          ) : null}
          {!this.isReadOnly() && this.state.value !== null ? (
            <UU5.Bricks.Button
              className={this.getClassName().closeButton}
              bgStyle="transparent"
              colorSchema={this.getColorSchema()}
              disabled={this.isDisabled()}
              onClick={(component, e) => {
                if (!this.isDisabled() && !this.isReadOnly()) {
                  this._resetInputValue();
                  this._changeValue(null, e);
                }
              }}
              mainAttrs={{ tabIndex: !this.isReadOnly() && !this.isComputedDisabled() ? "0" : null }}
              onFocus={!this.isReadOnly() && !this.isComputedDisabled() ? () => this._onFocusExit() : null}
              onBlur={!this.isReadOnly() && !this.isComputedDisabled() ? () => this._onBlur() : null}
            >
              <UU5.Bricks.Icon
                className={this.getClassName().closeIcon}
                icon={this.props.closeIcon || this.constructor.getDefaultProps().closeIcon}
              />
            </UU5.Bricks.Button>
          ) : null}
        </UU5.Bricks.Div>
      );
    },

    _getMultipleInput(inputId) {
      let inputAttrs = this.props.inputAttrs || {};
      inputAttrs.onFocus = !this.isReadOnly() && !this.isComputedDisabled() ? () => this._onFocus() : null;
      inputAttrs.onBlur = !this.isReadOnly() && !this.isComputedDisabled() ? () => this._onBlur() : null;
      inputAttrs.tabIndex = !this.isReadOnly() && !this.isComputedDisabled() ? "0" : null;
      inputAttrs.onClick = !this.isReadOnly() && !this.isComputedDisabled() ? () => this._open() : null;
      let showIndicateDrop = this.state.indicateDrop && !this.isReadOnly() && !this.isDisabled();
      let inputClassNames = [this.getClassName("placeholder")];
      if (showIndicateDrop) {
        inputClassNames.push(this.getClassName("indicateDrop") + "-" + this.state.indicateDrop);
      }

      let inputRowClassName = this.getClassName("inputRow");
      switch (this.state.feedback) {
        case "success":
          inputRowClassName += " color-schema-" + UU5.Environment.getColorSchema("success");
          break;
        case "warning":
          inputRowClassName += " color-schema-" + UU5.Environment.getColorSchema("warning");
          break;
        case "error":
          inputRowClassName += " color-schema-" + UU5.Environment.getColorSchema("danger");
          break;
      }

      if (this.props.elevation && !this.props.multiple) {
        inputRowClassName += " " + ClassNames.elevation + this.props.elevation;
      }

      return (
        <UU5.Bricks.Div className={inputRowClassName}>
          <ItemsInput
            id={inputId}
            key={inputId}
            name={this.props.name || inputId}
            className={inputClassNames.join(" ") || undefined}
            placeholder={showIndicateDrop ? this._getDndAreaPlaceholder() : this.props.placeholder}
            multiple={this.props.multiple}
            mainAttrs={inputAttrs}
            disabled={this.isComputedDisabled()}
            readonly={this.isReadOnly()}
            loading={this.isLoading()}
            onItemClick={opt => {
              this.removeItem(opt);
            }}
            icon={this._getIcon()}
            iconClassName={this.getClassName("icon")}
            feedback={this.getFeedback()}
            borderRadius={this.props.borderRadius}
            elevation={this.props.multiple ? this.props.elevation : null}
            bgStyle={this.props.bgStyle}
            inputWidth={this._getInputWidth()}
            colorSchema={this.props.colorSchema}
          />
          {this.state.value && (!Array.isArray(this.state.value) || this.state.value.length > 0) ? (
            <ul key="list" className={this.getClassName().list}>
              {this._getFilesName()}
            </ul>
          ) : null}
          {this._getFileInput()}
        </UU5.Bricks.Div>
      );
    },

    _onFocus() {
      UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), e => {
        const isEnter = e.which === 13;
        isEnter && !this.isDisabled() && this._inputVal.click();
      });
    },

    _onFocusExit(position) {
      UU5.Environment.EventListener.addWindowEvent("keyup", this.getId(), e => {
        const isEnter = e.which === 13;

        if (isEnter && !this.isDisabled()) {
          if (this.props.multiple) {
            this.setValue(this.state.value.filter(item => item !== this.state.value[position]));
          } else {
            this.setValue(null);
          }
        }
      });
    },

    _onBlur() {
      UU5.Environment.EventListener.removeWindowEvent("keyup", this.getId());
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      let inputId = this.getId() + "-input";
      return (
        <div {...this._getMainAttrs()} id={this.getId()}>
          {this.getLabel(inputId)}
          {this.getInputWrapper(this.props.multiple ? this._getMultipleInput(inputId) : this._getSingleInput(inputId))}
        </div>
      );
    }
    //@@viewOff:render
  })
);

export default File;
