import React from "react";
import { useTravelContext } from "./context.tsx";
import { ConvertedFlightData } from "../utils/converted-types.tsx";
import { formatDateAndHour, getCityById } from "../utils/functions.ts";
import { twMerge } from "tailwind-merge";

export function SelectFlightOffers() {
  const {
    startDateTime,
    endDateTime,
    convertedFlightsData,
    startCityId,
    endCityId,
    setStep,
    activeFlightId,
    setActiveFlightId,
  } = useTravelContext();

  return (
    <div>
      <div className="bg-slate-200 text-lg text-center p-4">
        <p>Wybrana przez Ciebie opcja:</p>
        <p>
          {startDateTime} - {endDateTime}
        </p>
        <p>
          {getCityById(startCityId)?.name} - {getCityById(endCityId)?.name}
        </p>
        <button onClick={() => setStep(3)}>Przejdź dalej</button>
      </div>
      <div className="mx-16 my-4">
        {convertedFlightsData &&
          (convertedFlightsData as ConvertedFlightData[]).map((flightData) => {
            return (
              <button
                key={flightData.id}
                className={twMerge(
                  "border-x-gray-950 border-4 mb-2 w-full",
                  activeFlightId === flightData.id && "border-x-green-300"
                )}
                onClick={() => setActiveFlightId(flightData.id)}
              >
                <div className="bg-amber-100 p-4 font-medium">
                  <p>Cena: {flightData.price}</p>
                  <p>
                    Cena z bagażem:{" "}
                    {Number(flightData.price) +
                      Number(flightData.baggagePrice).toFixed(2)}
                  </p>
                  {activeFlightId === flightData.id && <p>Wybrana opcja</p>}
                </div>

                <div className="flex gap-4 bg-amber-50 p-4">
                  <div className="w-full">
                    <p>{flightData.departureAirport1}</p>
                    <p>
                      {formatDateAndHour(
                        flightData.departureTime1 as unknown as string
                      )}
                    </p>
                  </div>
                  <div className="w-full">
                    <p>Czas przelotu:</p>
                    <p>
                      {(() => {
                        const seconds = Number(flightData.flightDuration1);
                        const hours = Math.floor(seconds / 3600);
                        const minutes = Math.floor((seconds % 3600) / 60);
                        return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
                      })()}
                    </p>
                  </div>
                  <div className="w-full">
                    <p>{flightData.arrivalAirport1}</p>
                    <p>
                      {formatDateAndHour(
                        flightData.arrivalTime1 as unknown as string
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4">
                  <div className="w-full">
                    <p>{flightData.departureAirport2}</p>
                    <p>
                      {formatDateAndHour(
                        flightData.departureTime2 as unknown as string
                      )}
                    </p>
                  </div>
                  <div className="w-full">
                    <p>Czas przelotu:</p>
                    <p>
                      {(() => {
                        const seconds = Number(flightData.flightDuration2);
                        const hours = Math.floor(seconds / 3600);
                        const minutes = Math.floor((seconds % 3600) / 60);
                        return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
                      })()}
                    </p>
                  </div>
                  <div className="w-full">
                    <p>{flightData.arrivalAirport2}</p>
                    <p>
                      {formatDateAndHour(
                        flightData.arrivalTime2 as unknown as string
                      )}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
