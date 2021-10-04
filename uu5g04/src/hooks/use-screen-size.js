import {
  useScreenSize as useScreenSizeG05,
  ScreenSizeProvider as ScreenSizeProviderG05,
  createComponent,
} from "uu5g05";

const EMPTY_FN = () => {};

function useScreenSize(...hookArgs) {
  let result = useScreenSizeG05(...hookArgs);
  return Array.isArray(result) ? result[0] : result;
}

// g04 Provider is always fully controlled via props.screenSize (even without onChange);
// it also does not have to handle setScreenSize
//   => provide onChange to g05 to make it fully controlled but don't do anything
const ScreenSizeProvider = createComponent({
  uu5Tag: "UU5.Hooks.ScreenSizeProvider",
  propTypes: {
    screenSize: ScreenSizeProviderG05.propTypes.screenSize,
  },
  render(props) {
    return <ScreenSizeProviderG05 {...props} onChange={EMPTY_FN} />;
  },
});

export { useScreenSize, ScreenSizeProvider };
export default useScreenSize;
