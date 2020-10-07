import { createContext } from "./context";

const [DataFilterContext, useDataFilter] = createContext(null);
const DataFilterProvider = DataFilterContext.Provider;

export { DataFilterProvider, useDataFilter };
export default useDataFilter;
