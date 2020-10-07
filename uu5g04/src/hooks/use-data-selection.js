import { createContext } from "./context";

const [DataSelectionContext, useDataSelection] = createContext(null);
const DataSelectionProvider = DataSelectionContext.Provider;

export { DataSelectionProvider, useDataSelection };
export default useDataSelection;
