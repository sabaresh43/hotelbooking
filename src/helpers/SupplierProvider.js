import { createContext, useContext } from 'react';
import { getSupplier } from '../utils/getSupplier';


const SupplierContext = createContext(getSupplier());


export const SupplierProvider = ({ children }) => {
  const supplier = getSupplier();
  return (
    <SupplierContext.Provider value={supplier}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => useContext(SupplierContext);
