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
    <div className="offers-bg">
      <div className="text-lg text-center p-4">
        <p className="font-description my-3" style={{ color: "#ffcc16" }}>
          {startDateTime} - {endDateTime}
        </p>
        <p className="font-header my-8">
          {getCityById(startCityId)?.name} - {getCityById(endCityId)?.name}
        </p>
        <button
          onClick={() => setStep(3)}
          className="font-description border-2 border-white p-3 rounded-lg"
          style={{ color: "#ffcc16" }}
        >
          Przejdź dalej
        </button>
      </div>
      <div className="mx-16 my-4">
        {convertedFlightsData &&
          (convertedFlightsData as ConvertedFlightData[]).map((flightData) => {
            return (
              <button
                key={flightData.id}
                className={twMerge(
                  "border-x-gray-950 border-4 mb-2 w-full",
                  activeFlightId === flightData.id &&
                    "border-green-300 border-x-green-300 border-8"
                )}
                onClick={() => setActiveFlightId(flightData.id)}
              >
                <div className="bg-[#0E3EFC] p-4 font-description">
                  <p>Cena: {flightData.price}</p>
                  <p>
                    Cena z bagażem:{" "}
                    {(
                      Number(flightData.price) + Number(flightData.baggagePrice)
                    ).toFixed(2)}
                  </p>
                  {activeFlightId === flightData.id && <p>Wybrana opcja</p>}
                </div>

                <div
                  className="flex gap-4 bg-[#182FB4] p-4 font-description"
                  style={{ fontSize: "16px" }}
                >
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

                <div
                  className="flex gap-4 p-4 bg-[#182FB4] font-description"
                  style={{ fontSize: "16px" }}
                >
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
