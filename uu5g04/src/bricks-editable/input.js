import * as UU5 from "uu5g04";
import "uu5g04-bricks";

import ns from "./bricks-editable-ns.js";
import Css from "./internal/css.js";
import { withContext } from "./toolbar-context.js";

const NAME = ns.name("Input");

export const Input = withContext(
  UU5.Common.LsiMixin.withContext(
    UU5.Common.VisualComponent.create({
      displayName: NAME,
      //@@viewOn:mixins
      mixins: [UU5.Common.BaseMixin, UU5.Common.ElementaryMixin],
      //@@viewOff:mixins

      //@@viewOn:statics
      statics: {
        tagName: ns.name("Input"),
        classNames: {
          main:
            ns.css("input") +
            " " +
            Css.css(`
            width: 100%;
            font-size: inherit;
            line-height: inherit;
            margin: 0px;
            min-height: 1em;
            height: auto;
            font-weight: inherit;
            color: inherit;
            outline: none;
            background-color: transparent;
            border: solid 2px transparent;
            text-align: inherit;
          `),
          placeholder: Css.css(`
            &::placeholder {
              color: rgba(0,0,0,0.24);
            }
          `)
        }
      },
      //@@viewOff:statics

      //@@viewOn:propTypes
      propTypes: {
        value: UU5.PropTypes.string,
        toolbarItems: UU5.PropTypes.arrayOf(
          UU5.PropTypes.oneOfType([
            UU5.PropTypes.shape({
              type: UU5.PropTypes.oneOfType([UU5.PropTypes.oneOf(["button", "dropdown", "separator"]), UU5.PropTypes.func]),
              props: UU5.PropTypes.oneOfType([UU5.PropTypes.func, UU5.PropTypes.object])
            }),
            UU5.PropTypes.element
          ])
        ),
        placeholder: UU5.PropTypes.oneOfType([UU5.PropTypes.string, UU5.PropTypes.object]),
        readOnly: UU5.PropTypes.bool,
        open: UU5.PropTypes.func,
        close: UU5.PropTypes.func,
        onBlur: UU5.PropTypes.func,
        onChange: UU5.PropTypes.func
      },
      //@@viewOff:propTypes

      //@@viewOn:getDefaultProps
      getDefaultProps() {
        return {
          value: "",
          toolbarItems: undefined,
          placeholder: undefined,
          readOnly: false,
          open: undefined,
          close: undefined,
          onBlur: undefined,
          onChange: undefined
        };
      },
      //@@viewOff:getDefaultProps

      //@@viewOn:reactLifeCycle
      getInitialState() {
        return {
          value: this.props.value,
          readOnly: this.props.readOnly,
          active: false
        };
      },

      componentWillReceiveProps(nextProps) {
        if (this.props.controlled) {
          this.setState({ value: nextProps.value, readOnly: nextProps.readOnly });
        }
      },

      componentWillUnmount() {
        if (this.state.active) {
          typeof this.props.close === "function" && this.props.close();
        }
      },
      //@@viewOff:reactLifeCycle

      //@@viewOn:interface
      focus() {
        this._input && this._input.focus();
      },

      blur() {
        this._input && this._input.blur();
      },

      setValue(value) {
        this.setState({ value });
      },

      getValue() {
        return this.state.value;
      },

      onChangeDefault(opt) {
        this.setState({ value: opt.value });
      },

      setReadOnly(value = true, setStateCallback) {
        this.setState({ readOnly: value }, setStateCallback);
      },
      //@@viewOff:interface

      //@@viewOn:overridingMethods
      //@@viewOff:overridingMethods

      //@@viewOn:private
      _onChange(e) {
        let opt = { component: this, value: e.target.value };

        if (typeof this.props.onChange === "function") {
          this.props.onChange(opt);
        } else {
          this.onChangeDefault(opt);
        }
      },

      _onFocus() {
        this.setState({ active: true }, () => this.props.open(this.props.toolbarItems, this));
      },

      _onBlur() {
        if (this.state.readOnly) return;

        this.setState({ active: false }, this.props.close);

        if (typeof this.props.onBlur === "function") {
          let opt = { component: this, value: this.state.value };
          this.props.onBlur(opt);
        }
      },

      _getProps() {
        let props = this.getMainAttrs();

        props.onChange = this._onChange;
        props.onFocus = this._onFocus;
        props.onBlur = this._onBlur;
        props.value = this.state.value;
        props.ref = input => (this._input = input);
        props.readOnly = this.state.readOnly;

        if (!this.state.value) {
          props.className += ` ${this.getClassName("placeholder")}`;
        }

        return props;
      },
      //@@viewOff:private

      //@@viewOn:render
      render() {
        return (
          <UU5.Bricks.Lsi>
            {({ language }) => {
              return this.props.children({
                children: (
                  <input
                    {...this._getProps()}
                    placeholder={UU5.Common.Tools.getLsiItemByLanguage(this.props.placeholder)}
                  />
                )
              });
            }}
          </UU5.Bricks.Lsi>
        );
      }
      //@@viewOn:render
    })
  )
);

export default Input;
