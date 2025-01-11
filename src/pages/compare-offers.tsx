import React from "react";
import { formatDateAndHour } from "../utils/functions.ts";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";

export function CompareOffers() {
  const storedData = localStorage.getItem("compareObjects")
    ? JSON.parse(localStorage.getItem("compareObjects") || "")
    : [];
  const icon = L.icon({ iconUrl: "/marker.png" });
  return (
    <div className="offers-bg">
      <div className="flex flex-col items-center py-4">
        <p className="font-header">Nasza podpowiedź</p>
        <p className="font-description">Wybierz opcje nr 1 bo ...</p>
      </div>
      {storedData.map((data) => {
        const position = [data.hotelData.latitude, data.hotelData.longitude];
        return (
          <div
            key={data.key}
            className="mb-4 bg-[#162BA3] font-description border-4 border-black mx-16 rounded-lg"
            style={{ fontSize: "16px" }}
          >
            <p style={{ fontSize: "24px" }} className="mx-8 py-2">
              {data.hotelData.cityName}
            </p>
            <div className="flex gap-3 justify-between mx-8 pb-1">
              <div>
                <p>Cena: {(data.totalCost || 0).toFixed(2)} zł</p>
                <p>
                  Cena dodatkowego bagażu:{" "}
                  {Number(data.flightData.baggagePrice) > 0
                    ? data.flightData.baggagePrice.toFixed(2)
                    : 0}{" "}
                  zł
                </p>
                <p>Dni w podróży: {data.travelTime}</p>
                <p>
                  Cena na dzień:{" "}
                  {(data.totalCost / data.travelTime || 0).toFixed(2)} zł
                </p>
              </div>
              <div>
                <p>
                  Uśredniona dzienna temperatura:{" "}
                  {(data.avgTemperature || 0).toFixed(2)} C
                </p>
                <p>
                  Uśredniony dzienny wiatr: {(data.avgWind || 0).toFixed(2)}{" "}
                  km/h
                </p>
                <p>
                  Uśredniona dzienna szansa na deszcz:{" "}
                  {(data.avgChanceOfRain || 0).toFixed(2)}%
                </p>
                <p>
                  Uśredniona dzienna szansa na śnieg:{" "}
                  {(data.avgChanceOfSnow || 0).toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-[#182FB4] p-4 max-h-80">
              <div className="w-full">
                <img
                  src={(data?.hotelData.imageUrl as unknown as string) || ""}
                  alt={(data?.hotelData?.name as unknown as string) || ""}
                  className="max-h-72"
                />
              </div>
              <div className="w-full font-description">
                <p>
                  Cena:{" "}
                  <span className="font-header" style={{ fontSize: "32px" }}>
                    {Number(data?.hotelData.price).toFixed(2)} zł
                  </span>
                </p>
                <p>
                  Ocena:{" "}
                  <span className="font-header" style={{ fontSize: "32px" }}>
                    {data?.hotelData?.reviewScore}
                  </span>
                </p>
                <p>
                  Ilość ocen:{" "}
                  <span className="font-header" style={{ fontSize: "32px" }}>
                    {data?.hotelData?.reviewCount}
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

            <div
              className="flex gap-4 bg-[#0E3EFC] p-4 font-description"
              style={{ fontSize: "16px" }}
            >
              <div className="w-full">
                <p>{data?.flightData.departureAirport1}</p>
                <p>
                  {formatDateAndHour(
                    data?.flightData.departureTime1 as unknown as string
                  )}
                </p>
              </div>
              <div className="w-full">
                <p>Czas przelotu:</p>
                <p>
                  {(() => {
                    const seconds = Number(data?.flightData.flightDuration1);
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
                  })()}
                </p>
              </div>
              <div className="w-full">
                <p>{data?.flightData.arrivalAirport1}</p>
                <p>
                  {formatDateAndHour(
                    data?.flightData.arrivalTime1 as unknown as string
                  )}
                </p>
              </div>
            </div>

            <div
              className="flex gap-4 p-4 bg-[#0E3EFC] font-description"
              style={{ fontSize: "16px" }}
            >
              <div className="w-full">
                <p>{data?.flightData.departureAirport2}</p>
                <p>
                  {formatDateAndHour(
                    data?.flightData.departureTime2 as unknown as string
                  )}
                </p>
              </div>
              <div className="w-full">
                <p>Czas przelotu:</p>
                <p>
                  {(() => {
                    const seconds = Number(data?.flightData.flightDuration2);
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
                  })()}
                </p>
              </div>
              <div className="w-full">
                <p>{data?.flightData.arrivalAirport2}</p>
                <p>
                  {formatDateAndHour(
                    data?.flightData.arrivalTime2 as unknown as string
                  )}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
