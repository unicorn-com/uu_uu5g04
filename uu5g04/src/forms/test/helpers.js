//@@viewOn:imports
import UU5, { createVisualComponent } from "uu5g04";
import "uu5g04-bricks";
import "uu5g04-forms";
//@@viewOff:imports

// Used to test component's behavior when being controlled by props and using onChangeFeedback + onValidate
export const OnChangeFeedbackAndOnValidate = createVisualComponent({
  getInitialState() {
    return {
      value: this.props.value || new Date(2019, 7, 2, 0, 0, 0, 0),
      feedback: this.props.feedback,
      message: this.props.message,
    };
  },

  _onChangeFeedback(opt) {
    if (typeof this.props.onChangeFeedback === "function") this.props.onChangeFeedback(opt);
    this.setState({ feedback: opt.feedback, message: opt.message });
  },

  _onValidate(opt) {
    if (typeof this.props.onValidate === "function") this.props.onValidate(opt);
    return {
      feedback: "error",
      message: <UU5.Bricks.Lsi lsi={{ en: "Error" }} />,
      value: opt.value,
    };
  },

  render() {
    let { component, ...restProps } = this.props;
    let Component = component;
    return (
      <Component
        {...restProps}
        value={this.state.value}
        feedback={this.state.feedback}
        message={this.state.message}
        onChangeFeedback={this._onChangeFeedback}
        onValidate={this._onValidate}
      />
    );
  },
});
