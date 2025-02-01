import React, { useEffect, useState } from "react";
import { formatDateAndHour } from "../utils/functions.ts";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import OpenAI from "openai";
import { useTravelContext } from "./context.tsx";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export function CompareOffers() {
  const [storedData, setStoredData] = useState(() => {
    const data = localStorage.getItem("compareObjects");
    return data ? JSON.parse(data) : [];
  });
  const { setStep } = useTravelContext();

  const icon = L.icon({ iconUrl: "/marker.png" });

  function removeItemByKey(keyToRemove) {
    const updatedData = storedData.filter((item) => item.key !== keyToRemove);
    localStorage.setItem("compareObjects", JSON.stringify(updatedData));
    setStoredData(updatedData);
  }

  const [gptChoice, setGptChoice] = useState<string>("");
  const fetchGPT = async () => {
    const offers = storedData
      .map((data, i: number) => {
        const cityName = data.hotelData.cityName;
        const totalCost = (data.totalCost || 0).toFixed(2);
        const reviewScore = (data.hotelData.reviewScore || 0).toFixed(2);
        const reviewCount = (data.hotelData.reviewCount || 0).toFixed(2);
        const baggagePrice =
          Number(data.flightData.baggagePrice) > 0
            ? data.flightData.baggagePrice.toFixed(2)
            : 0;
        const travelTime = data.travelTime;
        const avgTemperature = (data.avgTemperature || 0).toFixed(2);
        const avgWind = (data.avgWind || 0).toFixed(2);
        const avgChanceOfRain = (data.avgChanceOfRain || -1).toFixed(2);
        const avgChanceOfSnow = (data.avgChanceOfSnow || -1).toFixed(2);
        const flightDuration1 = (() => {
          const seconds = Number(data?.flightData.flightDuration1);
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
        })();
        const flightDuration2 = (() => {
          const seconds = Number(data?.flightData.flightDuration2);
          const hours = Math.floor(seconds / 3600);
          const minutes = Math.floor((seconds % 3600) / 60);
          return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
        })();

        return `'Oferta nr ${i + 1} to:
      Miasto: ${cityName}, 
      Cena: ${totalCost} zł, 
      Cena bagażu: ${baggagePrice} zł, 
      Dni w podróży: ${travelTime}, 
      Ocena hotelu: ${reviewScore},
      Ilość ocen: ${reviewCount},
      Uśredniona temperatura: ${
        avgTemperature !== 0 ? avgTemperature : "brak info ile"
      } C, 
      Uśredniony wiatr: ${avgWind !== 0 ? avgWind : "brak info ile"} km/h, 
      Uśredniona szansa na deszcz: ${
        avgChanceOfRain > -1 ? avgChanceOfRain : "brak info ile"
      }%, 
      Uśredniona szansa na śnieg: ${
        avgChanceOfSnow > -1 ? avgChanceOfSnow : "brak informacji"
      }%, 
      Czas przelotów: ${flightDuration1}, ${flightDuration2}.'`;
      })
      .join(";\n");

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Poszukiwane jest miejsce na wakacje bądź podróż by pozwiedzać. Jeżeli główną atrakcją tego miasta jest dostęp do morza to ustal bardzo duży priorytet na wysoką temperaturę i niski procent opadów. W przypadkach, gdzie jakość pogody jest podobna wybieraj miejsca posiadające więcej zabytków turystycznych. Jeśli destynacja nie ma dostępu do morza to priorytetem jest przede wszystkim atrakcyjność miasta pod względem zabytków. Oprócz tego ważna jest niska cena i wysoka jakość hotelu. Weź pod uwagę także długość lotu, żeby nie była skrajnie wysoka i preferuj niską prędkość wiatru",
          },
          {
            role: "user",
            content: `Wybierz jedno z tych miejsc na wakacje i uzasadnij dlaczego w maksymalnie 2 zdaniach: "${offers}"`,
          },
        ],
      });
      setGptChoice(completion.choices[0].message.content || "");
    } catch (error) {
      console.error("Error fetching GPT response:", error);
    }
  };

  useEffect(() => {
    if (storedData.length > 0) fetchGPT();
  }, [storedData]);

  console.log(storedData);

  return (
    <div className="bg-[#10249B] pb-8">
      <div className="flex flex-col items-center py-4">
        <div className="flex justify-between font-header w-full px-16">
          <button onClick={() => setStep(1)}>&lt;-</button>
          <p>Nasza podpowiedź</p>
          <p></p>
        </div>
        <p className="font-description mx-60" style={{ fontSize: "16px" }}>
          {gptChoice}
        </p>
      </div>
      {storedData.map((data, i: number) => {
        const position = [data.hotelData.latitude, data.hotelData.longitude];
        return (
          <div
            key={data.key}
            className="mt-4 bg-[#162BA3] font-description border-4 border-black mx-16 rounded-lg"
            style={{ fontSize: "16px" }}
          >
            <div
              style={{ fontSize: "24px" }}
              className="mx-8 py-2 flex justify-between"
            >
              <p>
                {i + 1}. {data.hotelData.cityName}
              </p>
              {storedData.length > 2 && (
                <button
                  onClick={() => {
                    removeItemByKey(data.key);
                  }}
                >
                  X
                </button>
              )}
            </div>

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
                  {data.avgTemperature > 0
                    ? data.avgTemperature.toFixed(2)
                    : "-"}{" "}
                  C
                </p>
                <p>
                  Uśredniony dzienny wiatr:{" "}
                  {data.avgWind > 0 ? data.avgWind.toFixed(2) : "-"} km/h
                </p>
                <p>
                  Uśredniona dzienna szansa na deszcz:{" "}
                  {!data.avgTemperature
                    ? "-"
                    : (data.avgChanceOfRain || 0).toFixed(2)}
                  %
                </p>
                <p>
                  Uśredniona dzienna szansa na śnieg:{" "}
                  {!data.avgTemperature
                    ? "-"
                    : (data.avgChanceOfSnow || 0).toFixed(2)}
                  %
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
              <div
                className="w-full font-description"
                style={{ fontSize: "20px" }}
              >
                <p>
                  Cena hotelu:{" "}
                  <span className="font-header" style={{ fontSize: "20px" }}>
                    {Number(data?.hotelData.price).toFixed(2)} zł
                  </span>
                </p>
                <p>
                  Ocena hotelu:{" "}
                  <span className="font-header" style={{ fontSize: "20px" }}>
                    {data?.hotelData?.reviewScore}
                  </span>
                </p>
                <p>
                  Ilość ocen hotelu:{" "}
                  <span className="font-header" style={{ fontSize: "20px" }}>
                    {data?.hotelData?.reviewCount}
                  </span>
                </p>
              </div>
              <div className="w-full overflow-hidden">
                <MapContainer
                  center={position as unknown as LatLngExpression}
                  zoom={13}
                  scrollWheelZoom={true}
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
