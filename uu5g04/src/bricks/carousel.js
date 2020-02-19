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
import ns from "./bricks-ns.js";

import "./carousel.less";
import CarouselItem from "./carousel-item.js";
import Icon from "./icon.js";
//@@viewOff:imports

export const Carousel = UU5.Common.VisualComponent.create({
  displayName: "Carousel", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.SwipeMixin
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Carousel"),
    classNames: {
      main: ns.css("carousel"),
      controls: ns.css("carousel-controls"),
      indicators: ns.css("carousel-indicators"),
      active: ns.css("carousel-indicators-active"),
      leftArrow: ns.css("carousel-left"),
      rightArrow: ns.css("carousel-right"),
      lastArrow: ns.css("carousel-last")
    },
    defaults: {
      minAngle: 22.5,
      childTagName: "UU5.Bricks.Carousel.Item",
      colorSchema: "default"
    }
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    hideControls: UU5.PropTypes.bool,
    hideIndicators: UU5.PropTypes.bool,
    activeIndex: UU5.PropTypes.number,
    nextIcon: UU5.PropTypes.string,
    prevIcon: UU5.PropTypes.string,
    displayedItems: UU5.PropTypes.number,
    type: UU5.PropTypes.oneOf(["circular", "final", "rewind"]),
    interval: UU5.PropTypes.number,
    stepByOne: UU5.PropTypes.bool,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
    onIndexChange: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      hideControls: false,
      hideIndicators: false,
      activeIndex: 0,
      nextIcon: "mdi-chevron-right",
      prevIcon: "mdi-chevron-left",
      displayedItems: 1,
      type: "final",
      interval: 5000,
      stepByOne: false,
      allowTags: [],
      onIndexChange: undefined
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    return {
      activeIndex: this.props.activeIndex,
      rowHeight: 0,
      renderedChildren: []
    };
  },

  componentWillMount() {
    const children = this.getChildren();
    this.setState({
      children: children,
      tmpChildren: children
    });
  },

  componentDidMount() {
    this._prepareChildren();
    this._delayedNext = [];
    this._delayedPrev = [];
    if (this.props.interval > 0) {
      this._autoChange = true;
      this._startAutoSlide();
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.interval > 0 && !this._autoChange) {
      this._autoChange = true;
      this._startAutoSlide();
    }
  },

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.children) return;

    let newProps = false;
    for (let key in this.props) {
      if (this.props[key] !== prevProps[key] && key !== "mainAttrs") {
        newProps = true;
        break;
      }
    }
    if (newProps || this.state.disabled !== prevState.disabled) {
      if (newProps) {
        this._resetShifts();
        this._newProps = true;
      }

      if (this.props.controlled && newProps) {
        const children = this.getChildren();
        this.setAsyncState(
          {
            activeIndex: this.props.activeIndex,
            children: children,
            tmpChildren: children,
            renderedChildren: []
          },
          () => this._prepareChildren()
        );
      } else {
        this._prepareChildren(this.state.activeIndex);
      }
    } else {
      const indexHasChanged = this.state.activeIndex !== prevState.activeIndex;
      if (this._newProps) {
        this._newProps = false;
      } else if (indexHasChanged) {
        this._swipeRenderedChild();
      } else if (this.state.hadSwiped) {
        this._removeRenderedChild();
      }
    }
  },

  _setDelayed() {
    if (this._delayedNext.length) {
      let list = this._delayedNext;
      this._delayedNext = [];
      list.forEach(setStateCallback => this.setNext(setStateCallback));
    } else if (this._delayedPrev.length) {
      let list = this._delayedPrev;
      this._delayedPrev = [];
      list.forEach(setStateCallback => this.setPrevious(setStateCallback));
    }
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  setActiveIndex(activeIndex, setStateCallback) {
    this._addRenderedChild(activeIndex, setStateCallback);
    return this;
  },

  getActiveIndex() {
    return this.state.activeIndex;
  },

  setNext(setStateCallback) {
    if (this.props.type === "final" && this.getActiveIndex() >= this._getSlidesLength() - 1) return this;

    if (this.state.hadSwiped) {
      this._delayedNext.push(setStateCallback);
    } else {
      let nextIndex = this._getSlidesLength() - 1 < this.getActiveIndex() + 1 ? 0 : this.getActiveIndex() + 1;
      this._addRenderedChild(nextIndex, setStateCallback);
    }

    return this;
  },

  setPrevious(setStateCallback) {
    if (this.props.type === "final" && this.getActiveIndex() <= 0) return this;

    if (this.state.hadSwiped) {
      this._delayedPrev.push(setStateCallback);
    } else {
      let previousIndex = this.getActiveIndex() === 0 ? this._getSlidesLength() - 1 : this.getActiveIndex() - 1;
      this._addRenderedChild(previousIndex, setStateCallback);
    }

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagName = this.getDefault().childTagName;
    let childTagNames = this.props.allowTags.concat(defaultChildTagName);
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagName], {
          mixinName: "UU5.Common.BaseMixin"
        });
      else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
    }
    return result;
  },

  expandChildProps_(child) {
    const newChildProps = { ...child.props };
    newChildProps.style = { ...newChildProps.style };
    newChildProps.style.width = 100 / this.props.displayedItems + "%";
    newChildProps.disabled = newChildProps.disabled ? newChildProps.disabled : this.isDisabled();

    return newChildProps;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getMaxHeight() {
    let maxHeight = 0;
    this.eachRenderedChild(child => {
      if (child) {
        let height = UU5.Common.Tools.getOuterHeight(child, true);
        maxHeight = height > maxHeight ? height : maxHeight;
      }
    });
    return maxHeight;
  },

  _prepareChildren(activeIndex) {
    activeIndex = activeIndex === undefined ? this.props.activeIndex : activeIndex;
    const steps = this.props.stepByOne ? 1 : this.props.displayedItems;
    const properties = {
      index: activeIndex * steps,
      position: 0,
      height: this._getMaxHeight(),
      noOfElements: this.props.displayedItems
    };

    this.setAsyncState({
      activeIndex,
      tmpChildren: [],
      renderedChildren: this._getContent(properties),
      rowHeight: properties.height
    });
  },

  _pauseAutoSlide() {
    UU5.Environment.TimeManager.clearInterval(this._interval);
  },

  _startAutoSlide() {
    this._interval = UU5.Environment.TimeManager.setInterval(() => this.setNext(), this.props.interval);
  },

  _clickHandler(func) {
    let lastSlide = new Date();
    if (!this.lastSlide || lastSlide - this.lastSlide > 750) {
      func && func();
      this.lastSlide = lastSlide;
    }
    return this;
  },

  _addRenderedChild(nextIndex, setStateCallback) {
    const newRenderedChildren = this.state.renderedChildren.slice();
    const prevIndex = this.state.activeIndex;
    let isDirectionRight = nextIndex - prevIndex >= 0;
    const steps = this.props.stepByOne ? 1 : this.props.displayedItems;
    const no = Math.abs(nextIndex - prevIndex) * steps;

    if (this.props.type === "circular" && nextIndex === 0 && prevIndex === this._getSlidesLength() - 1) {
      newRenderedChildren.push(
        ...this._getContent({
          index: this.props.stepByOne ? this.props.displayedItems - 1 : 0,
          position: this.props.displayedItems,
          noOfElements: steps,
          newShift: 1
        })
      );

      isDirectionRight = true;
    } else if (this.props.type === "circular" && prevIndex === 0 && nextIndex === this._getSlidesLength() - 1) {
      newRenderedChildren.unshift(
        ...this._getContent({
          index: nextIndex * steps,
          position: -1 * steps,
          noOfElements: steps,
          newShift: -1
        })
      );

      isDirectionRight = false;
    } else {
      if (isDirectionRight) {
        newRenderedChildren.push(
          ...this._getContent({
            index: (prevIndex + 1) * steps + (this.props.displayedItems - steps),
            position: this.props.displayedItems,
            noOfElements: no
          })
        );
      } else {
        newRenderedChildren.unshift(
          ...this._getContent({
            index: nextIndex * steps,
            position: -1 * no,
            noOfElements: no
          })
        );
      }
    }

    if (typeof this.props.onIndexChange === "function") {
      this.props.onIndexChange({ activeIndex: nextIndex, component: this });
    }

    this.setAsyncState(
      {
        activeIndex: nextIndex,
        renderedChildren: newRenderedChildren,
        isDirectionRight: isDirectionRight,
        hadSwiped: false
      },
      setStateCallback
    );
  },

  _swipeRenderedChild() {
    setTimeout(() => {
      let newRenderedChildren = this.state.renderedChildren.slice();
      const size = this.state.renderedChildren.length;

      newRenderedChildren = newRenderedChildren.map((item, i) => {
        const newPosition = this.state.isDirectionRight ? (i - (size - this.props.displayedItems)) * 100 : i * 100;
        const newProps = {
          style: UU5.Common.Tools.mergeDeep({}, item.props.style, this._getChildrenStyle(newPosition)),
          position: newPosition
        };
        return UU5.Common.Element.clone(item, newProps);
      });

      this.setAsyncState({
        renderedChildren: newRenderedChildren,
        hadSwiped: true
      });
    }, 50);
  },

  _removeRenderedChild() {
    setTimeout(() => {
      let newRenderedChildren = this.state.renderedChildren.filter(item => {
        return item.props.position >= 0 && item.props.position < 100 * this.props.displayedItems;
      });
      this.setAsyncState(
        {
          renderedChildren: newRenderedChildren,
          hadSwiped: false
        },
        this._setDelayed
      );
    }, 500);
  },

  _getSlidesLength() {
    const children = this.state.children ? this.state.children : this.getChildren();
    const length = children ? children.length : 0;

    return this.props.stepByOne && this.props.displayedItems > 1
      ? this.props.type === "circular"
        ? length
        : Math.ceil(length - (this.props.displayedItems - 1))
      : Math.ceil(length / this.props.displayedItems);
  },

  _resetShifts() {
    this._shiftCirc = null;
    this._shiftFin = null;
  },

  _getContent(properties) {
    const displayedItems = this.props.displayedItems;
    const children = this.state.children;
    let noOfElements = properties.noOfElements;
    let startPosition = properties.position;
    this._shiftCirc = this._shiftCirc || 0;
    const rest = Math.ceil(children.length / displayedItems) * displayedItems - children.length;

    if (properties.newShift && !this.props.stepByOne) {
      this._shiftCirc += properties.newShift;
    }

    if (this._shiftFin) {
      if (properties.index === 0) {
        noOfElements -= this._shiftFin;
        startPosition += this._shiftFin;
        this._shiftFin = null;
      } else {
        properties.index -= this._shiftFin;
      }
    }

    const childrenToRender = [];
    for (let i = 0; i < noOfElements; ++i) {
      let index = properties.index + i;
      if (this.props.type === "circular") {
        index += this._shiftCirc * rest;

        if (index >= children.length || index < 0) {
          index = (index + 10000 * children.length) % children.length;
        }
      }

      if (index < children.length) {
        const position = (startPosition + i) * 100;
        const newProps = UU5.Common.Tools.mergeDeep({}, children[index].props);
        newProps.disabled = newProps.disabled ? newProps.disabled : this.isDisabled();
        newProps.position = position;
        newProps.key = this._getKey(children[index].key);
        newProps.style = UU5.Common.Tools.mergeDeep(
          {},
          newProps.style,
          this._getChildrenStyle(position, displayedItems, properties.height)
        );
        childrenToRender.push(UU5.Common.Element.clone(children[index], newProps));
      } else {
        if (this.props.type !== "circular" && !this._shiftFin && !this.props.stepByOne) {
          this._shiftFin = noOfElements - i;
        }
      }
    }

    return childrenToRender;
  },

  _getKey(key) {
    this.state.renderedChildren &&
      this.state.renderedChildren.forEach(item => {
        if (key === item.key) {
          key += "-copy";
        }
      });
    return key;
  },

  _getChildrenStyle(position, displayedItems, height) {
    displayedItems = displayedItems || this.props.displayedItems;
    !height && (height = this.state.rowHeight);

    return {
      width: 100 / displayedItems + "%",
      transform: `translateX(${position}%)`,
      height: height > 0 ? height + "px" : null
    };
  },

  _customTouchEndHandler() {
    let absAngle = Math.abs(this.getAngle());
    let lastSlide = new Date();

    if (this.isSwipedRight() && absAngle <= this.getDefault().minAngle) {
      if (!this.lastSlide || lastSlide - this.lastSlide > 750) {
        this.setPrevious();
        this.lastSlide = lastSlide;
      }
    } else if (this.isSwipedLeft() && absAngle >= 180 - this.getDefault().minAngle) {
      if (!this.lastSlide || lastSlide - this.lastSlide > 750) {
        this.setNext();
        this.lastSlide = lastSlide;
      }
    }
    return this;
  },

  _buildMainAttrs() {
    let mainAttrs = this.getMainAttrs();

    if (!mainAttrs.style.height) {
      mainAttrs.style.height = this.state.rowHeight + "px";
    }

    mainAttrs.onTouchStart = this.swipeOnTouchStart;
    mainAttrs.onTouchMove = this.swipeOnTouchMove;
    mainAttrs.onTouchEnd = () => this.swipeOnTouchEnd(this._customTouchEndHandler);

    if (this.props.interval > 0) {
      mainAttrs.onMouseOver = this._pauseAutoSlide;
      mainAttrs.onMouseLeave = this._startAutoSlide;
    }

    return mainAttrs;
  },

  _buildIndicators() {
    let indicators = [];
    for (let i = 0; i < this._getSlidesLength(); i++) {
      let className = i === this.getActiveIndex() ? this.getClassName("active") : "";
      indicators.push(
        <li key={i} className={className} onClick={() => this._clickHandler(() => this.setActiveIndex(i))} />
      );
    }
    return indicators;
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const colorSchema = this.getColorSchema();
    const colorSchemaClassName = colorSchema ? " color-schema-" + colorSchema : "";

    let classNameLeft = this.getClassName().leftArrow;
    if (this.props.type === "final" && this.getActiveIndex() === 0) {
      classNameLeft += " " + this.getClassName().lastArrow;
    }

    let classNameRight = this.getClassName().rightArrow;
    if (this.props.type === "final" && this.getActiveIndex() === this._getSlidesLength() - 1) {
      classNameRight += " " + this.getClassName().lastArrow;
    }

    return this.props.children ? (
      <div {...this._buildMainAttrs()}>
        {this.state.renderedChildren}
        {this.state.tmpChildren}
        <div className={this.getClassName().controls + colorSchemaClassName}>
          {!this.props.hideControls && (
            <a className={classNameLeft} role="button" onClick={() => this._clickHandler(this.setPrevious)}>
              <Icon icon={this.props.prevIcon} />
            </a>
          )}
          {!this.props.hideIndicators && <ol className={this.getClassName().indicators}>{this._buildIndicators()}</ol>}
          {!this.props.hideControls && (
            <a className={classNameRight} role="button" onClick={() => this._clickHandler(this.setNext)}>
              <Icon icon={this.props.nextIcon} />
            </a>
          )}
        </div>
        {this.getDisabledCover()}
      </div>
    ) : null;
  }
  //@@viewOff:render
});

Carousel.Item = CarouselItem;
export default Carousel;
