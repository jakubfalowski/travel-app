import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { ManagePage } from "./manage-page.tsx";

type TravelContextType = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
};

export const TravelContext = createContext<TravelContextType | null>(null);

export const TravelContextProvider = () => {
  const [step, setStep] = useState(1);

  return (
    <TravelContext.Provider
      value={{
        step,
        setStep,
      }}
    >
      <ManagePage />
    </TravelContext.Provider>
  );
};

export function useTravelContext() {
  const context = useContext(TravelContext);

  if (!context) {
    throw new Error(
      "useContext must be used within a WebAdminFeatureOrdersManagementContext.Provider"
    );
  }

  return context;
}
