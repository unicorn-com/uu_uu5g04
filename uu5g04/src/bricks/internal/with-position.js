//@@viewOn:revision
// coded: Filip Janovský, 20.10.2020
// reviewed:
//@@viewOn:revision

//@@viewOn:imports
import UU5 from "uu5g04";
//@@viewOff:imports

const checkMagneticMiddle = (state, magneticOffset) => {
  const { position } = state;
  let newLeft = position.left;
  let newRight = position.right;
  let isInitialPosition = state.isInitialPosition;

  // center component if it is near to the center of the screen
  const horizontalCenterOffset = (document.body.clientWidth - position.componentWidth) / 2 - magneticOffset;
  if (position.right > horizontalCenterOffset && position.left > horizontalCenterOffset) {
    newRight = (document.body.clientWidth - position.componentWidth) / 2;
    newLeft = newRight;
    isInitialPosition = true;
  }

  return { ...state, position: { ...position, left: newLeft, right: newRight }, isInitialPosition };
};

const withPosition = (Component, magneticMiddleOffset) => {
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
    getInitialState() {
      return {
        position: {},
        isInitialPosition: true,
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

    componentWillReceiveProps(nextProps) {
      if (nextProps.itemList.length === 0) {
        this.setState({ position: {} });
      }
    },
    //@@viewOff:reactLifeCycle

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:overriding
    //@@viewOff:overriding

    //@@viewOn:private
    _onMouseMove(e) {
      e.preventDefault();
      if (this.state.isDown) {
        this.setState((state) => {
          const top = state.offsetTop + e.clientY - state.pointerTop - state.marginTop;
          const left = state.offsetLeft + e.clientX - state.pointerLeft - state.marginLeft;
          const width = state.contentRef.clientWidth;
          const height = state.contentRef.clientHeight;
          const bottom = document.body.clientHeight - top - height - state.marginBottom - state.marginTop;
          const right = document.body.clientWidth - left - width - state.marginRight - state.marginLeft;
          const componentWidth = width + state.marginLeft + state.marginRight;
          const componentHeight = height + state.marginTop + state.marginBottom;
          const marginLeft = state.position?.marginLeft || 0;
          const marginRight = state.position?.marginRight || 0;
          const newState = {
            position: {
              top,
              bottom,
              left,
              right,
              width,
              height,
              componentWidth,
              componentHeight,
              marginLeft,
              marginRight,
            },
            isInitialPosition: false,
          };

          return checkMagneticMiddle(newState, magneticMiddleOffset);
        });
      }
    },

    _onMouseUp() {
      document.removeEventListener("mousemove", this._onMouseMove);
      document.removeEventListener("mouseup", this._onMouseUp);
      this.setState({ isDown: false });
    },

    _onMouseDown(e, current) {
      document.addEventListener("mousemove", this._onMouseMove);
      document.addEventListener("mouseup", this._onMouseUp);

      // compute margins - together with offset posiiton we can get precise position
      current = current || this.state.contentRef;
      const bcr = current.getBoundingClientRect();
      const style = getComputedStyle(current);
      const marginTop = style.marginTop ? parseFloat(style.marginTop) : 0;
      const marginLeft = style.marginLeft ? parseFloat(style.marginLeft) : 0;
      const marginRight = style.marginRight ? parseFloat(style.marginRight) : 0;
      const marginBottom = style.marginBottom ? parseFloat(style.marginBottom) : 0;

      this.setState({
        isDown: true,
        offsetLeft: bcr.left,
        offsetTop: bcr.top,
        pointerLeft: e.clientX,
        pointerTop: e.clientY,
        marginTop,
        marginBottom,
        marginLeft,
        marginRight,
        contentRef: current,
      });
    },

    _updatePosition(current, mode) {
      this.setState((state) => {
        const bcr = current.getBoundingClientRect();
        const style = getComputedStyle(current);
        const marginTop = style.marginTop ? parseFloat(style.marginTop) : 0;
        const marginLeft = style.marginLeft ? parseFloat(style.marginLeft) : 0;
        const marginRight = style.marginRight ? parseFloat(style.marginRight) : 0;
        const marginBottom = style.marginBottom ? parseFloat(style.marginBottom) : 0;

        const offsetLeft = bcr.left;
        const offsetTop = bcr.top;

        const width = current.clientWidth;
        const height = current.clientHeight;
        const componentWidth = width + marginLeft + marginRight;
        const componentHeight = height + marginTop + marginBottom;
        let top = offsetTop - marginTop;
        let left = offsetLeft - marginLeft;
        let bottom = document.body.clientHeight - top - height - marginBottom - marginTop;
        let right = document.body.clientWidth - left - width - marginRight - marginLeft;
        let isInitialPosition = state.isInitialPosition;
        if (mode === "center") {
          left = (document.body.clientWidth - componentWidth) / 2;
          right = left;
          isInitialPosition = true;
        } else if (mode === "optimize" && state.position.width) {
          // optimalization is possible only if width was measured once before
          const currentComponentWidth = state.position.width + state.marginLeft + state.marginRight;
          const diff = (currentComponentWidth - componentWidth) / 2;
          left += diff;
          right += diff;

          if ((right > 0 && right + componentWidth > document.body.clientWidth) || right < 0) {
            right = 0;
          }
        }

        const newState = {
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
            marginLeft,
            marginRight,
          },
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
          isInitialPosition,
        };

        return isInitialPosition ? newState : checkMagneticMiddle(newState, magneticMiddleOffset);
      });
    },
    //@@viewOff:private

    //@@viewOn:render
    render() {
      return (
        <Component
          onMouseDown={this._onMouseDown}
          position={this.state.position}
          isInitialPosition={this.state.isInitialPosition}
          updatePosition={this._updatePosition}
          {...this.props}
        />
      );
    },
    //@@viewOff:render
  });
};

export default withPosition;
