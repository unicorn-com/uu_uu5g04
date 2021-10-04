import {
  useTimeZone,
  TimeZoneProvider as TimeZoneProviderG05,
  createComponent,
  useState,
  useUpdateEffect,
  useRef,
  PropTypes,
} from "uu5g05";

// g04 Provider uses different props than g05 (initialTimeZone + onChange with no possibility to force
// different value from parent afterwards)
const TimeZoneProvider = createComponent({
  uu5Tag: "UU5.Hooks.TimeZoneProvider",
  propTypes: {
    initialTimeZone: PropTypes.string,
    onChange: PropTypes.func,
  },
  defaultProps: {
    initialTimeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
    onChange: undefined,
  },
  render(props) {
    const { initialTimeZone, onChange } = props;
    const [timeZoneState, setTimeZoneState] = useState({ timeZone: initialTimeZone });

    const currentValuesRef = useRef();
    currentValuesRef.current = { onChange };
    useUpdateEffect(() => {
      const { onChange } = currentValuesRef.current;
      if (typeof onChange === "function") onChange({ timeZone: timeZoneState.timeZone });
    }, [timeZoneState.timeZone]);

    return (
      <TimeZoneProviderG05 {...timeZoneState} onChange={setTimeZoneState}>
        {props.children}
      </TimeZoneProviderG05>
    );
  },
});

export { useTimeZone, TimeZoneProvider };
export default useTimeZone;
