import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { ManagePage } from "./manage-page.tsx";
import {
  ConvertedFlightData,
  ConvertedHotelData,
} from "../utils/converted-types.tsx";

type TravelContextType = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  startCityId: string;
  setStartCityId: Dispatch<SetStateAction<string>>;
  endCityId: string;
  setEndCityId: Dispatch<SetStateAction<string>>;
  startDateTime: string | null;
  setStartDateTime: Dispatch<SetStateAction<string | null>>;
  endDateTime: string | null;
  setEndDateTime: Dispatch<SetStateAction<string | null>>;
  convertedHotelsData?: ConvertedHotelData[] | ConvertedHotelData;
  setConvertedHotelsData: Dispatch<
    SetStateAction<ConvertedHotelData[] | ConvertedHotelData | undefined>
  >;
  convertedFlightsData?: ConvertedFlightData[] | ConvertedFlightData;
  setConvertedFlightsData: Dispatch<
    SetStateAction<ConvertedFlightData[] | ConvertedFlightData | undefined>
  >;
  activeFlightId: number;
  setActiveFlightId: Dispatch<SetStateAction<number>>;
  activeHotelId: number;
  setActiveHotelId: Dispatch<SetStateAction<number>>;
};

export const TravelContext = createContext<TravelContextType | null>(null);

export const TravelContextProvider = () => {
  const [step, setStep] = useState(1);
  const [startCityId, setStartCityId] = useState<string>("1");
  const [endCityId, setEndCityId] = useState<string>("2");
  const [startDateTime, setStartDateTime] = useState<string | null>(null);
  const [endDateTime, setEndDateTime] = useState<string | null>(null);
  const [convertedFlightsData, setConvertedFlightsData] = useState<
    ConvertedFlightData | ConvertedFlightData[]
  >();
  const [convertedHotelsData, setConvertedHotelsData] = useState<
    ConvertedHotelData | ConvertedHotelData[]
  >();
  const [activeFlightId, setActiveFlightId] = useState(0);
  const [activeHotelId, setActiveHotelId] = useState(0);

  return (
    <TravelContext.Provider
      value={{
        step,
        setStep,
        startCityId,
        setStartCityId,
        endCityId,
        setEndCityId,
        startDateTime,
        setStartDateTime,
        endDateTime,
        setEndDateTime,
        convertedFlightsData,
        convertedHotelsData,
        setConvertedFlightsData,
        setConvertedHotelsData,
        activeFlightId,
        setActiveFlightId,
        activeHotelId,
        setActiveHotelId,
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
