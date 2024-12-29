import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./styles.css";
import React from "react";

type DateRangePickerProps = {
  onDateChange: (range: [Date, Date] | Date) => void;
  defaultStartDate?: Date | null;
  defaultEndDate?: Date | null;
  setEndDateTime: Dispatch<SetStateAction<Date | null>>;
  setStartDateTime: Dispatch<SetStateAction<Date | null>>;
};

export function DateRangePicker({
  onDateChange,
  defaultStartDate,
  defaultEndDate,
  setEndDateTime,
  setStartDateTime,
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [isDefaultIgnored, setIsDefaultIgnored] = useState(false);

  useEffect(() => {
    if (!isDefaultIgnored) {
      if (defaultStartDate && defaultEndDate) {
        setDateRange([defaultStartDate, defaultEndDate]);
      } else if (defaultStartDate) {
        setDateRange([defaultStartDate, defaultStartDate]);
      }
    }
  }, [defaultStartDate, defaultEndDate, isDefaultIgnored]);

  const handleDateChange = (value: Date | [Date, Date] | null) => {
    setIsDefaultIgnored(true);

    if (value instanceof Date) {
      if (!tempStartDate) {
        setTempStartDate(value);
        setDateRange([value, value]);
        onDateChange(value);
      } else {
        const start = tempStartDate < value ? tempStartDate : value;
        const end = tempStartDate > value ? tempStartDate : value;
        const range: [Date, Date] = [start, end];
        setDateRange(range);
        setTempStartDate(null);
        onDateChange(range);
      }
    } else if (Array.isArray(value) && value.length === 2) {
      const range: [Date, Date] =
        value[0] <= value[1] ? value : [value[1], value[0]];
      setDateRange(range);
      setStartDateTime(value[0]);
      setEndDateTime(value[1]);
      setTempStartDate(null);
      onDateChange(range);
    } else {
      setStartDateTime(null);
      setEndDateTime(null);
      setDateRange(null);
      setTempStartDate(null);
    }
  };

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = `${date
      .toLocaleString("en-US", { month: "short" })
      .toLowerCase()}`;

    return `${day} ${month}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-full">
      <Calendar
        selectRange={false}
        onChange={(value) =>
          handleDateChange(value as Date | [Date, Date] | null)
        }
        value={dateRange || undefined}
        minDate={today}
        tileClassName={({ date }) => {
          if (date < today) {
            return "disabled-day";
          }

          if (date.toDateString() === today.toDateString()) {
            return "today-tile";
          }

          if (dateRange) {
            const [start, end] = dateRange;

            if (start && end) {
              if (date.toDateString() === start.toDateString()) {
                return "highlight-start";
              }
              if (date.toDateString() === end.toDateString()) {
                return "highlight-end";
              }
              if (date > start && date < end) {
                return "highlight";
              }
            }
          }
        }}
      />
      <div className="mt-4">
        {dateRange ? (
          dateRange[0]?.toLocaleDateString() ===
          dateRange[1]?.toLocaleDateString() ? (
            <div className="flex justify-between font-bold">
              <p>eventDate: </p>
              <p>{formatDate(dateRange[0])}</p>
            </div>
          ) : (
            <div className="flex justify-between font-bold">
              <p>eventDate: </p>
              <p>{`${formatDate(dateRange[0])} - ${formatDate(
                dateRange[1]
              )}`}</p>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default DateRangePicker;
