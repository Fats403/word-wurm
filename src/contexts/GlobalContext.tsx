import * as React from "react";

export interface GlobalContextState {
  options: string;
}

interface IGlobalProvider {
  children?: JSX.Element | JSX.Element[];
}

export const GlobalContext = React.createContext<
  GlobalContextState | undefined
>(undefined);

const GlobalProvider = ({ children }: IGlobalProvider) => {
  return (
    <GlobalContext.Provider value={{ options: "" }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalProvider };
