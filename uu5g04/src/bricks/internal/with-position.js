//@@viewOn:revision
// coded: Filip Janovský, 20.10.2020
// reviewed: 
//@@viewOn:revision

//@@viewOn:imports
import UU5 from "uu5g04";
//@@viewOff:imports

const withPosition = (Component) => {
  return UU5.Common.Component.create({
    //@@viewOn:mixins
    //@@viewOff:mixins

    //@@viewOn:statics
    //@@viewOff:statics

    //@@viewOn:propTypes
    //@@viewOff:propTypes

    //@@viewOn:getDefaultProps
    //@@viewOff:getDefaultProps

    //@@viewOn:reactLifeCycle
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    //@@viewOff:overriding

    //@@viewOn:private
    getInitialState() {
      return {
        position: {},
        isDown: false,
        offsetLeft: 0,
        offsetTop: 0,
        pointerLeft: 0,
        pointerTop: 0,
        contentRef: null,
        marginTop: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
      };
    },

    _onMouseMove(e) {
      e.preventDefault();
      if (this.state.isDown) {
        this.setState((state) => {
          const top = state.offsetTop + e.clientY - state.pointerTop - state.marginTop;
          const left = state.offsetLeft + e.clientX - state.pointerLeft - state.marginLeft;
          const width = state.contentRef.clientWidth;
          const height = state.contentRef.clientHeight;
          const bottom = window.innerHeight - top - height - state.marginBottom - state.marginTop;
          const right = window.innerWidth - left - width - state.marginRight - state.marginLeft;
          const componentWidth = width + state.marginLeft + state.marginRight;
          const componentHeight = height + state.marginTop + state.marginBottom;

          return {
            position: {
              top,
              bottom,
              left,
              right,
              width,
              height,
              componentWidth,
              componentHeight,
            },
          };
        });
      }
    },

    _onMouseUp() {
      document.removeEventListener("mousemove", this._onMouseMove);
      document.removeEventListener("mouseup", this._onMouseUp);
      this.setState({ isDown: false });
    },

    _onMouseDown(e) {
      document.addEventListener("mousemove", this._onMouseMove);
      document.addEventListener("mouseup", this._onMouseUp);

      // compute margins - together with offset posiiton we can get precise position
      const style = getComputedStyle(this.state.contentRef);
      const marginTop = style.marginTop ? parseFloat(style.marginTop) : 0;
      const marginLeft = style.marginLeft ? parseFloat(style.marginLeft) : 0;
      const marginRight = style.marginRight ? parseFloat(style.marginRight) : 0;
      const marginBottom = style.marginBottom ? parseFloat(style.marginBottom) : 0;

      this.setState({
        isDown: true,
        offsetLeft: this.state.contentRef.offsetLeft,
        offsetTop: this.state.contentRef.offsetTop,
        pointerLeft: e.clientX,
        pointerTop: e.clientY,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      });
    },

    _updatePosition(current, mode) {
      const style = getComputedStyle(current);
      const marginTop = style.marginTop ? parseFloat(style.marginTop) : 0;
      const marginLeft = style.marginLeft ? parseFloat(style.marginLeft) : 0;
      const marginRight = style.marginRight ? parseFloat(style.marginRight) : 0;
      const marginBottom = style.marginBottom ? parseFloat(style.marginBottom) : 0;

      const offsetLeft = current.offsetLeft;
      const offsetTop = current.offsetTop;

      const width = current.clientWidth;
      const height = current.clientHeight;
      const componentWidth = width + marginLeft + marginRight;
      const componentHeight = height + marginTop + marginBottom;
      let top = offsetTop - marginTop;
      let left = offsetLeft - marginLeft;
      let bottom = window.innerHeight - top - height - marginBottom - marginTop;
      let right = window.innerWidth - left - width - marginRight - marginLeft;

      if (mode === "center") {
        left = (window.innerWidth - componentWidth) / 2;
        right = left;
      } else if (mode === "optimize" && this.state.position.width) {
        // optimalization is possible only if width was measure once before
        const currentComponentWidth = this.state.position.width + this.state.marginLeft + this.state.marginRight;
        const diff = (currentComponentWidth - componentWidth) / 2;
        left += diff;
        right += diff;
      }

      this.setState({
        contentRef: current,
        position: {
          top,
          left,
          bottom,
          right,
          width,
          height,
          componentWidth,
          componentHeight,
        },
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
      });
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      return (
        <Component
          onMouseDown={this._onMouseDown}
          position={this.state.position}
          updatePosition={this._updatePosition}
          {...this.props}
        />
      );
    },
    //@@viewOff:render
  });
};

export default withPosition;
