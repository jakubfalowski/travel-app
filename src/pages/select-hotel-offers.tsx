import React, { useMemo } from "react";
import { useTravelContext } from "./context.tsx";
import {
  ConvertedFlightData,
  ConvertedHotelData,
} from "../utils/converted-types.tsx";
import {
  calculateAverages,
  calculateTimeDifference,
  filterDates,
  generateRandomString,
  getCityById,
} from "../utils/functions.ts";
import { twMerge } from "tailwind-merge";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";
import L from "leaflet";
import "../index.css";
import { useWeather } from "../data-access-api/weather.ts";
import { formatDateTime } from "../date-picker/functions.tsx";

export function SelectHotelOffers() {
  const {
    startDateTime,
    endDateTime,
    convertedHotelsData,
    endCityId,
    setStep,
    activeHotelId,
    activeFlightId,
    setActiveHotelId,
    convertedFlightsData,
  } = useTravelContext();

  const departureTimes = useMemo(
    () => ({
      start: startDateTime || "",
      end: endDateTime || "",
    }),
    [startDateTime, endDateTime]
  );

  const validDates = useMemo(() => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 14);
    const startDate = formatDateTime(today);
    const endDate = formatDateTime(futureDate);
    return filterDates(departureTimes, startDate, endDate);
  }, [departureTimes]);

  const icon = L.icon({ iconUrl: "/marker.png" });

  const newHotelData =
    (convertedHotelsData as ConvertedHotelData[]).find(
      (hotel) => hotel.id === activeHotelId
    ) || [];

  const newFlightData =
    (convertedFlightsData as ConvertedFlightData[]).find(
      (flight) => flight.id === activeFlightId
    ) || [];

  const { data: weatherData } = useWeather({
    city: (newHotelData as unknown as { cityName: string }).cityName || "",
  });

  const filteredWeatherData = (weatherData?.forecast?.forecastday || []).filter(
    (forecast) => validDates.includes(forecast?.date || "")
  );
  function handlePushData() {
    const storedData = localStorage.getItem("compareObjects")
      ? JSON.parse(localStorage.getItem("compareObjects") || "")
      : [];

    const weather = calculateAverages(filteredWeatherData);

    const newData = [
      {
        hotelData: newHotelData,
        flightData: newFlightData,
        totalCost: Number(
          (
            Number((newHotelData as ConvertedHotelData).price) +
            Number((newFlightData as ConvertedFlightData).price)
          ).toFixed(2)
        ),
        travelTime: Number(
          calculateTimeDifference(
            (newFlightData as ConvertedFlightData)
              .arrivalTime1 as unknown as string,
            (newFlightData as ConvertedFlightData)
              .arrivalTime2 as unknown as string
          )
        ),
        avgTemperature: weather.avgMaxTempC,
        avgWind: weather.avgMaxWindKph,
        avgChanceOfRain: weather.avgChanceOfRain,
        avgChanceOfSnow: weather.avgChanceOfSnow,
        key: generateRandomString(8),
      },
    ];

    storedData.push(...newData);

    localStorage.setItem("compareObjects", JSON.stringify(storedData));
  }

  return (
    <div className="offers-bg">
      <div className="text-lg text-center p-4">
        <p className="font-description my-3" style={{ color: "#ffcc16" }}>
          {startDateTime} - {endDateTime}
        </p>
        <p className="font-header my-8">{getCityById(endCityId)?.name}</p>
        <button
          onClick={() => {
            handlePushData();
            setStep(4);
          }}
          className="font-description border-2 border-white p-3 rounded-lg"
          style={{ color: "#ffcc16" }}
        >
          Zatwierdź oferty
        </button>
      </div>
      <div className="mx-16 my-4">
        {convertedHotelsData &&
          (convertedHotelsData as ConvertedHotelData[]).map((hotelData) => {
            const position = [hotelData.latitude, hotelData.longitude];
            return (
              <button
                key={hotelData.id}
                className={twMerge(
                  "border-x-gray-950 border-4 mb-2 w-full",
                  activeHotelId === hotelData.id &&
                    "border-green-300 border-x-green-300 border-8"
                )}
                onClick={() => setActiveHotelId(hotelData.id)}
              >
                <div className="bg-[#0E3EFC] p-4 font-medium">
                  <p className="font-description">{hotelData.name}</p>
                  <p className="font-description" style={{ fontSize: "14px" }}>
                    {hotelData.description}
                  </p>
                  {activeHotelId === hotelData.id && (
                    <p className="font-description">Wybrana opcja</p>
                  )}
                </div>

                <div className="flex gap-4 bg-[#182FB4] p-4 max-h-80">
                  <div className="w-full">
                    <img
                      src={(hotelData.imageUrl as unknown as string) || ""}
                      alt={(hotelData?.name as unknown as string) || ""}
                      className="max-h-72"
                    />
                  </div>
                  <div className="w-full font-description">
                    <p>
                      Cena:{" "}
                      <span
                        className="font-header"
                        style={{ fontSize: "32px" }}
                      >
                        {Number(hotelData.price).toFixed(2)} zł
                      </span>
                    </p>
                    <p>
                      Ocena:{" "}
                      <span
                        className="font-header"
                        style={{ fontSize: "32px" }}
                      >
                        {hotelData?.reviewScore}
                      </span>
                    </p>
                    <p>
                      Ilość ocen:{" "}
                      <span
                        className="font-header"
                        style={{ fontSize: "32px" }}
                      >
                        {hotelData?.reviewCount}
                      </span>
                    </p>
                  </div>
                  <div className="w-full overflow-hidden">
                    <MapContainer
                      center={position as unknown as LatLngExpression}
                      zoom={13}
                      scrollWheelZoom={false}
                      style={{
                        height: "100vh",
                        transform: "translateY(-33.33%)",
                      }}
                    >
                      <TileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={position as unknown as LatLngExpression}
                        icon={icon}
                      >
                        <Popup>
                          A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
