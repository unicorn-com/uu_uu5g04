import NestingLevel from "./nesting-level";
import ContentMixin from "../common/content-mixin";

let dummyObjWithContentMixin = {
  ...ContentMixin,
  props: {},
  state: {},
  getDefault: key => ContentMixin.statics["UU5.Common.ContentMixin"].defaults[key],
  showError: () => {},
  showWarning: () => {},
  isDynamic: () => false,
  registerRenderedChild: () => {},
  shouldChildRender: () => true,
  expandChildProps: () => {}
};

export const Content = {
  getChildren(children, props, statics) {
    let nl = NestingLevel.getChildNestingLevel(props, statics);
    let childProps = {
      parent: props.parent,
      nestingLevel: nl
    };
    dummyObjWithContentMixin.props = props;
    dummyObjWithContentMixin.__getTextCorrectorProps = function() {
      let result = ContentMixin.__getTextCorrectorProps.call(this);
      result.parent = props.parent;
      return result;
    };
    let builtChildren = dummyObjWithContentMixin.buildChildren(
      { content: children },
      (prevChild, childIndex) => childProps
    );
    return builtChildren;
  }
};

export default Content;
