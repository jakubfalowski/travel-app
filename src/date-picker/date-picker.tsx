import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { formatDateTime } from "./functions.tsx";
import React from "react";
import DateRangePicker from "./date-range-picker.tsx";
import { twMerge } from "tailwind-merge";

type DateAndTimePickerProps = {
  isVisible: boolean;
  onSave: () => void;
  setStartDateTime: Dispatch<SetStateAction<string | null>>;
  startDateTime: string | null;
  setEndDateTime: Dispatch<SetStateAction<string | null>>;
  endDateTime: string | null;
};

export function DateAndTimePicker({
  isVisible,
  onSave,
  setStartDateTime,
  setEndDateTime,
  startDateTime,
  endDateTime,
}: DateAndTimePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeError, setTimeError] = useState<boolean>(false);

  const handleDateChange = (range: Date | [Date, Date]) => {
    if (range instanceof Date) {
      setStartDate(range);
      setEndDate(null);
    } else {
      setStartDate(range[0]);
      setEndDate(range[1]);
    }
  };

  const handleSave = () => {
    const formattedStartDateTime = startDate ? formatDateTime(startDate) : null;
    let formattedEndDateTime = endDate ? formatDateTime(endDate) : null;
    if (!formattedEndDateTime && startDate) {
      formattedEndDateTime = formatDateTime(startDate);
    }

    setStartDateTime(formattedStartDateTime);
    if (formattedEndDateTime) setEndDateTime(formattedEndDateTime);

    onSave();
  };

  const getUnixTimestamp = (date: Date): number => {
    return date.getTime();
  };

  const validateTimes = () => {
    if (!startDate) {
      setTimeError(false);
      return;
    }

    const now = Date.now();

    if (!endDate || startDate === endDate) {
      const unixStart = getUnixTimestamp(startDate);
      const unixEnd = getUnixTimestamp(startDate);

      if (unixStart < now || unixEnd < now || unixEnd < unixStart) {
        setTimeError(true);
      } else {
        setTimeError(false);
      }
    }
  };

  useEffect(() => {
    validateTimes();
    // eslint-disable-next-line
  }, [startDate, endDate]);

  const isButtonDisabled = timeError || !startDate;

  if (!isVisible) return null;

  return (
    <div className="flex items-center justify-center px-4 border-none">
      <div className="relative flex flex-col items-center bg-white max-w-[380px] w-full px-2 py-5 rounded-lg shadow-lg z-10">
        <div className="flex justify-between w-full">
          <p>Kalendarz</p>
        </div>

        <div className="flex justify-center mt-3 w-full">
          <DateRangePicker
            onDateChange={handleDateChange}
            defaultStartDate={startDateTime ? new Date(startDateTime) : null}
            defaultEndDate={endDateTime ? new Date(endDateTime) : null}
            setStartDateTime={setStartDate}
            setEndDateTime={setEndDate}
          />
        </div>

        {timeError && (
          <p className="text-red-500 text-sm">Niepoprawny format daty</p>
        )}

        <div className="flex justify-end w-full">
          <button
            className={twMerge(
              "h-12 px-6 rounded-lg mt-4 text-white",
              isButtonDisabled ? "bg-zinc-400" : "bg-[#ff008c]"
            )}
            onClick={handleSave}
            disabled={isButtonDisabled}
          >
            Wyszukaj
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateAndTimePicker;
