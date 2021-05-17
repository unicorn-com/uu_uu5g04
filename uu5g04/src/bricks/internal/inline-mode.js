import * as UU5 from "uu5g04";
import Link from "../link.js";
import Modal from "../modal.js";
import ns from "./bricks-editable-ns.js";

export const InlineMode = UU5.Common.VisualComponent.create({
  //@@viewOn:mixins
  mixins: [],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("InlineMode"),
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    Component: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.func]),
    component: UU5.PropTypes.object,
    editModalHeader: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
    modalHeader: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
    getPropsToSave: UU5.PropTypes.func,
    linkTitle: UU5.PropTypes.oneOfType([UU5.PropTypes.object, UU5.PropTypes.string]),
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      Component: undefined,
      component: undefined,
      editModalHeader: undefined,
      modalHeader: undefined,
      getPropsToSave: undefined,
      linkTitle: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  //@@viewOff:interface

  //@@viewOn:private
  //@@viewOff:private

  //@@viewOn:render
  render() {
    let Component = this.props.Component;
    let renderEditationMode = this.props.renderEditationMode;
    return (
      <>
        {this.props.component.state.editation ? (
          <Modal
            shown
            header={this.props.editModalHeader}
            parent={null}
            nestingLevel="bigBoxCollection"
            onClose={(opt) => {
              this.props.component.endEditation(this.props.getPropsToSave ? this.props.getPropsToSave() : undefined);
              opt.component.close(false);
            }}
            location="portal"
            overflow={true}
          >
            {renderEditationMode(true)}
          </Modal>
        ) : null}

        <>
          <Modal
            ref_={(modal) => (this.props.component._modal = modal)}
            header={this.props.modalHeader || this.props.component.props.header}
            footer={this.props.component.props.footer}
            {...this.props.modalProps}
            location="portal"
          >
            <Component
              {...this.props.component.props}
              header={null}
              footer={null}
              parent={null}
              nestingLevel="bigBoxCollection"
            />
          </Modal>
          <Link
            onClick={() => this.props.component._modal.open()}
            content={this.props.component.header || this.props.linkTitle}
          />
        </>
      </>
    );
  },
  //@@viewOff:render
});

export default InlineMode;
