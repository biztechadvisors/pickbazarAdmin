import { createContext, ReactNode, useContext, useState } from 'react';

interface FormContextType {
  isEqual: boolean;
  setIsEqual: (value: boolean) => void;
  permissionName: string | null;
  setPermissionName: (value: string | null) => void;
}

const initialState: FormContextType = {
  isEqual: true,
  setIsEqual: () => {},
  permissionName: null,
  setPermissionName: () => {}
};

export const FormContext = createContext<FormContextType>(initialState);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [isEqual, setIsEqual] = useState(false);
  const [permissionName, setPermissionName] = useState<string | null>(null);

  return (
    <FormContext.Provider value={{ isEqual, setIsEqual, permissionName, setPermissionName }}>
      {children}
    </FormContext.Provider>
  );
};


// export const useFormValues = () => {
//   const context = useContext(FormContext);
//
//   if (context === undefined) {
//     throw new Error('useFormValues must be used within a FormProvider');
//   }
//
//   return context;
// };
