import { createContext } from "./context";

const [DataSorterContext, useDataSorter] = createContext(null);
const DataSorterProvider = DataSorterContext.Provider;

export { DataSorterProvider, useDataSorter };
export default useDataSorter;
