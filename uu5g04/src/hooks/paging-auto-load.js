//@@viewOn:imports
import UU5 from "uu5g04";
import { useState, useCallback, createComponent } from "uu5g05";
import TriggerIfAlmostVisible from "./internal/trigger-if-almost-visible";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: "UU5.Hooks.PagingAutoLoad",
  //@@viewOff:statics
};

export const PagingAutoLoad = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    distance: UU5.PropTypes.number,
    data: UU5.PropTypes.array,
    pageSize: UU5.PropTypes.number.isRequired,
    handleLoad: UU5.PropTypes.func,
    error: UU5.PropTypes.oneOfType([UU5.PropTypes.func, UU5.PropTypes.element, UU5.PropTypes.array]),
    children: UU5.PropTypes.oneOfType([UU5.PropTypes.func, UU5.PropTypes.element, UU5.PropTypes.array]),
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    distance: 1000,
    data: undefined,
    pageSize: undefined,
    handleLoad: undefined,
    error: undefined,
  },
  //@@viewOff:defaultProps

  render({ distance, data, pageSize, handleLoad, error, children }) {
    //@@viewOn:hooks
    let [autoLoadError, setAutoLoadError] = useState(null);
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    let totalLoadedCount = data ? data.filter((it) => it != null).length : 0;
    let renderableData = data
      ? data.length === totalLoadedCount
        ? data
        : data.slice(
            0,
            data.findIndex((it) => it == null)
          )
      : [];
    let pageIndex = Math.floor(renderableData.length / pageSize);

    const loadMore = useCallback(() => {
      return handleLoad({ pageInfo: { pageIndex, pageSize } }, true);
    }, [handleLoad, pageIndex, pageSize]);

    const onTrigger = useCallback(async () => {
      try {
        await loadMore();
        setAutoLoadError(null);
      } catch (e) {
        console.error(e);
        setAutoLoadError({ key: totalLoadedCount, error: e });
      }
    }, [loadMore, totalLoadedCount]);
    //@@viewOff:private

    //@@viewOn:render
    function renderError() {
      let result;
      if (error == null) {
        result = <UU5.Common.Error error={autoLoadError} moreInfo />;
      } else if (typeof error === "function") {
        let Component = error;
        result = <Component error={autoLoadError.error} reload={loadMore} />;
      } else {
        result = error;
      }
      return result;
    }
    function renderLoading() {
      let result = children;
      if (typeof children === "function") {
        let Component = children;
        return <Component pageIndex={pageIndex} pageSize={pageSize} />;
      } else {
        result = children !== undefined ? children : null;
      }
      return result;
    }

    return data && data.length !== totalLoadedCount ? (
      <TriggerIfAlmostVisible key={totalLoadedCount} triggerDistance={distance} onTrigger={onTrigger}>
        {autoLoadError && autoLoadError.key === totalLoadedCount ? renderError() : renderLoading()}
      </TriggerIfAlmostVisible>
    ) : null;
    //@@viewOff:render
  },
});
