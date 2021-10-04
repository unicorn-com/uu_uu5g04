import {
  useUserPreferences as useUserPreferencesG05,
  UserPreferencesProvider as UserPreferencesProviderG05,
  createComponent,
} from "uu5g05";

const EMPTY_FN = () => {};

function useUserPreferences(...hookArgs) {
  let result = useUserPreferencesG05(...hookArgs);
  return Array.isArray(result) ? result[0] : result;
}

// g04 Provider is always fully controlled via props.userPreferences (even without onChange);
// it also does not have to handle setUserPreferences
//   => provide onChange to g05 to make it fully controlled but don't do anything
const UserPreferencesProvider = createComponent({
  uu5Tag: "UU5.Hooks.UserPreferencesProvider",
  render(props) {
    return <UserPreferencesProviderG05 {...props} onChange={EMPTY_FN} />;
  },
});

export { useUserPreferences, UserPreferencesProvider };
export default useUserPreferences;
