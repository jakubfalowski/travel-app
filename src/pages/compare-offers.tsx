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
  console.log(storedData);
  return (
    <div>
      <p>Porównujesz oferty ilość: {storedData?.length || 0}</p>
      {storedData.map((data) => {
        const position = [data.hotelData.latitude, data.hotelData.longitude];
        return (
          <div key={data.key} className="mb-4 bg-slate-200">
            <p>Miasto: {data.hotelData.cityName}</p>
            <p>Cena: {data.totalCost}</p>
            <p>
              Cena dodatkowego bagażu:{" "}
              {Number(data.flightData.baggagePrice) > 0
                ? data.flightData.baggagePrice
                : 0}
            </p>
            <p>Dni w podróży: {data.travelTime}</p>
            <p>
              Cena na dzień: {(data.totalCost / data.travelTime).toFixed(2)}
            </p>
            <p>Ocena hotelu: {data.hotelData.reviewScore}</p>
            <p>Ilośc ocen: {data.hotelData.reviewCount}</p>
            <p>
              Uśredniona dzienna temperatura: {data.avgTemperature.toFixed(2)} C
            </p>
            <p>Uśredniony dzienny wiatr: {data.avgWind.toFixed(2)} km/h</p>
            <p>
              Uśredniona dzienna szansa na deszcz:{" "}
              {data.avgChanceOfRain.toFixed(2)}%
            </p>
            <p>
              Uśredniona dzienna szansa na śnieg:{" "}
              {data.avgChanceOfSnow.toFixed(2)}%
            </p>
            <div className={"border-x-gray-950 border-4 mb-2 w-full"}>
              <div className="bg-amber-100 p-4 font-medium">
                <p className="text-2xl">{data.hotelData.name}</p>
                <p>{data.hotelData.description}</p>
                <p>Cena: {Number(data.hotelData.price).toFixed(2)}</p>
              </div>

              <div className="flex gap-4 bg-amber-50 p-4 max-h-80">
                <div className="w-full">
                  <img
                    src={(data.hotelData.imageUrl as unknown as string) || ""}
                    alt={(data.hotelData?.name as unknown as string) || ""}
                  />
                </div>
                <div className="w-full">
                  <p>Ocena: {data.hotelData?.reviewScore}</p>
                  <p>Ilość ocen: {data.hotelData?.reviewCount}</p>
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
            </div>

            <div className="flex gap-4 p-4">
              <div className="w-full">
                <p>{data.flightData.departureAirport1}</p>
                <p>
                  {formatDateAndHour(
                    data.flightData.departureTime1 as unknown as string
                  )}
                </p>
              </div>
              <div className="w-full">
                <p>Czas przelotu:</p>
                <p>
                  {(() => {
                    const seconds = Number(data.flightData.flightDuration1);
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
                  })()}
                </p>
              </div>
              <div className="w-full">
                <p>{data.flightData.arrivalAirport1}</p>
                <p>
                  {formatDateAndHour(
                    data.flightData.arrivalTime1 as unknown as string
                  )}
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-4">
              <div className="w-full">
                <p>{data.flightData.departureAirport2}</p>
                <p>
                  {formatDateAndHour(
                    data.flightData.departureTime2 as unknown as string
                  )}
                </p>
              </div>
              <div className="w-full">
                <p>Czas przelotu:</p>
                <p>
                  {(() => {
                    const seconds = Number(data.flightData.flightDuration2);
                    const hours = Math.floor(seconds / 3600);
                    const minutes = Math.floor((seconds % 3600) / 60);
                    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
                  })()}
                </p>
              </div>
              <div className="w-full">
                <p>{data.flightData.arrivalAirport2}</p>
                <p>
                  {formatDateAndHour(
                    data.flightData.arrivalTime2 as unknown as string
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
