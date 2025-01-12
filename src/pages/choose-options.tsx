import { FormControl } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CITIES } from "../utils/variables.ts";
import DateAndTimePicker from "../date-picker/date-picker.tsx";
import { useTravelContext } from "./context.tsx";
import { IconArrowBottom } from "../utils/icon-arrow-bottom.tsx";
import { twMerge } from "tailwind-merge";
import { IconLeft } from "../utils/icon-left.tsx";
import { IconRight } from "../utils/icon-right.tsx";

const ChooseOptionPage = () => {
  const {
    setStep,
    startCityId,
    setStartCityId,
    endCityId,
    setEndCityId,
    startDateTime,
    setStartDateTime,
    endDateTime,
    setEndDateTime,
  } = useTravelContext();

  const [mainPageStep, setMainPageStep] = useState(0);

  useEffect(() => {
    window.scrollTo({
      top: window.innerHeight * mainPageStep,
      behavior: "smooth",
    });
  }, [mainPageStep]);

  const storedData = localStorage.getItem("compareObjects")
    ? JSON.parse(localStorage.getItem("compareObjects") || "")
    : [];

  return (
    <>
      <div className="main-page px-28 py-20">
        <div className="flex flex-col h-full w-full justify-between">
          <div className="flex justify-end">
            <p className="font-header max-w-96">Twój asystent podróżniczy</p>
          </div>
          <div>
            <p className="font-description">
              Pomożemy Ci znaleźć idealną podróż uwzględniając hotel, loty oraz
              pogodę w wybranym przez Ciebie terminie. Brak zdecydowania? Nasz
              system wybierze najlepszą opcję spośród najbardziej dla Ciebie
              atrakcyjnych
            </p>
            <div className="flex justify-around gap-3">
              <button
                className={twMerge(
                  "h-12 px-6 rounded-lg mt-4 text-white",
                  storedData.length < 2 ? "bg-gray-700" : "bg-[#ff008c]"
                )}
                onClick={() => setStep(4)}
                disabled={storedData.length < 2}
              >
                Porównaj obecne oferty ({storedData.length})
              </button>
              <button
                className={twMerge(
                  "h-12 px-6 rounded-lg mt-4 text-white bg-[#ff008c]"
                )}
                onClick={() => setMainPageStep(1)}
              >
                Znajdź nową oferte
              </button>
            </div>

            <button
              className="m-5 flex justify-center items-center w-full"
              onClick={() => {
                setMainPageStep(1);
              }}
            >
              <IconArrowBottom />
            </button>
          </div>
        </div>
      </div>
      <div
        className={twMerge(
          "choose-place px-28 py-20 flex flex-col justify-between",
          mainPageStep > 0 ? "" : "hidden"
        )}
      >
        <div className="flex flex-col justify-center text-center">
          <p className="font-header text-center">Wybierz miejsce podróży</p>
          <p className="font-description">Przesuń w bok dostępne opcje</p>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-description text-center pt-2">Miasto startowe</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (Number(startCityId) === 1 && Number(endCityId) === 17)
                    setStartCityId("16");
                  else if (
                    Number(startCityId) === 1 ||
                    (Number(endCityId) === 1 && Number(startCityId) === 2)
                  )
                    setStartCityId("17");
                  else if (Number(startCityId) === Number(endCityId) + 1)
                    setStartCityId(String(Number(startCityId) - 2));
                  else setStartCityId(String(Number(startCityId) - 1));
                }}
              >
                <IconLeft />
              </button>
              <div className="bg-white w-60 h-60 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={CITIES.find((city) => city.id === startCityId)?.image}
                  alt={CITIES.find((city) => city.id === startCityId)?.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                onClick={() => {
                  if (Number(startCityId) === 17 && Number(endCityId) === 1)
                    setStartCityId("2");
                  else if (
                    Number(startCityId) === 17 ||
                    (Number(endCityId) === 17 && Number(startCityId) === 16)
                  )
                    setStartCityId("1");
                  else if (Number(startCityId) === Number(endCityId) - 1)
                    setStartCityId(String(Number(startCityId) + 2));
                  else setStartCityId(String(Number(startCityId) + 1));
                }}
              >
                <IconRight />
              </button>
            </div>

            <p className="font-description text-center pt-2">
              {CITIES.find((city) => city.id === startCityId)?.name}
            </p>
          </div>

          <div className="flex flex-col">
            <p className="font-description text-center pt-2">Miasto podróży</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (Number(endCityId) === 1 && Number(startCityId) === 17)
                    setEndCityId("16");
                  else if (
                    Number(endCityId) === 1 ||
                    (Number(startCityId) === 1 && Number(endCityId) === 2)
                  )
                    setEndCityId("17");
                  else if (Number(endCityId) === Number(startCityId) + 1)
                    setEndCityId(String(Number(endCityId) - 2));
                  else setEndCityId(String(Number(endCityId) - 1));
                }}
              >
                <IconLeft />
              </button>
              <div className="bg-white w-60 h-60 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={CITIES.find((city) => city.id === endCityId)?.image}
                  alt={CITIES.find((city) => city.id === endCityId)?.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                onClick={() => {
                  if (Number(endCityId) === 17 && Number(startCityId) === 1)
                    setEndCityId("2");
                  else if (
                    Number(endCityId) === 17 ||
                    (Number(startCityId) === 17 && Number(endCityId) === 16)
                  )
                    setEndCityId("1");
                  else if (Number(endCityId) === Number(startCityId) - 1)
                    setEndCityId(String(Number(endCityId) + 2));
                  else setEndCityId(String(Number(endCityId) + 1));
                }}
              >
                <IconRight />
              </button>
            </div>
            <p className="font-description text-center pt-2">
              {CITIES.find((city) => city.id === endCityId)?.name}
            </p>
          </div>
        </div>
        <button
          className="m-5 flex justify-center items-center w-full font-white"
          onClick={() => {
            setMainPageStep(2);
          }}
        >
          <IconArrowBottom />
        </button>
      </div>
      <div
        className={twMerge(
          "choose-date p-12 flex flex-col justify-between",
          mainPageStep > 1 ? "" : "hidden"
        )}
      >
        <p className="font-header text-center">Szukana oferta</p>
        <div className="flex gap-8 justify-between">
          <div className="bg-black bg-opacity-80 h-full rounded-2xl p-6 max-w-[33%]">
            <p className="font-title">
              {CITIES.find((city) => city.id === startCityId)?.name}
            </p>
            <p className="font-description p-4">
              {CITIES.find((city) => city.id === startCityId)?.description}
            </p>
          </div>
          <div className="bg-black bg-opacity-80 h-full rounded-2xl p-6 max-w-[33%]">
            <p className="font-title">
              {CITIES.find((city) => city.id === endCityId)?.name}
            </p>
            <p className="font-description p-4">
              {CITIES.find((city) => city.id === endCityId)?.description}
            </p>
          </div>
          <FormControl>
            <DateAndTimePicker
              isVisible={true}
              onSave={() => setStep(2)}
              setStartDateTime={setStartDateTime}
              startDateTime={startDateTime}
              setEndDateTime={setEndDateTime}
              endDateTime={endDateTime}
            />
          </FormControl>
        </div>
        <button
          className="flex justify-center items-center w-full font-white"
          onClick={() => {
            setMainPageStep(3);
          }}
        >
          <IconArrowBottom />
        </button>
      </div>
    </>
  );
};

export default ChooseOptionPage;
