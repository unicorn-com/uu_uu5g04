import * as UU5 from "uu5g04";

function getPropsToSave(props, defaultProps) {
  let result = { ...props };

  for (let [propName, propValue] in Object.entries(defaultProps)) {
    if (result[propName] !== undefined && result[propName] === propValue) {
      result[propName] = undefined;
    }
  }

  return result;
}

export default UU5.Common.VisualComponent.create({
  getInitialState() {
    return {
      text: this.props.props.text
    };
  },

  getPropsToSave() {
    return getPropsToSave(this.state, UU5.Bricks.Component.getDefaultProps());
  },

  _onChange({ value }) {
    this.setState({ text: value });
  },

  render() {
    return (
      <UU5.Forms.TextButton
        value={this.state.text}
        onChange={this._onChange}
        spacing={0}
        buttons={[
          {
            icon: "mdi-check",
            onClick: () => this.props.onClose(this.getPropsToSave())
          }
        ]}
      />
    );
  }
});
