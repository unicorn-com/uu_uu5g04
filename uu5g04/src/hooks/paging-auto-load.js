//@@viewOn:imports
import UU5 from "uu5g04";
import { useState, useCallback } from "./react-hooks";
import { createComponent } from "./component";
import TriggerIfAlmostVisible from "./internal/trigger-if-almost-visible";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: "UU5.Hooks.PagingAutoLoad"
  //@@viewOff:statics
};

export const PagingAutoLoad = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ distance, data, pageSize, handleLoad, error, children }) {
    //@@viewOn:hooks
    let [autoLoadError, setAutoLoadError] = useState(null);
    //@@viewOff:hooks

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    let totalLoadedCount = data ? data.filter(it => it != null).length : 0;
    let renderableData = data
      ? data.length === totalLoadedCount
        ? data
        : data.slice(
            0,
            data.findIndex(it => it == null)
          )
      : [];
    let pageIndex = renderableData.length / pageSize;

    const loadMore = useCallback(() => {
      return handleLoad({ pageInfo: { pageIndex, pageSize } }, true);
    }, [handleLoad, pageIndex, pageSize]);

    const onTrigger = useCallback(async () => {
      try {
        await loadMore();
        setAutoLoadError(null);
      } catch (e) {
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
  }
});
