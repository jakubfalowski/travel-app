import { format } from "date-fns";
import { CITIES } from "./variables.ts";
import { pl } from "date-fns/locale";

export function getCityById(id: string) {
  return CITIES.find((city) => city.id === id);
}

export function formatDateAndHour(date: string) {
  const newDate = new Date(date);
  const formattedDate = format(newDate, "d MMMM yyyy, HH:mm", {
    locale: pl,
  });
  return formattedDate;
}

export const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const calculateTimeDifference = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const differenceInMillis = end.getTime() - start.getTime();
  const differenceInDays = Math.floor(differenceInMillis / (1000 * 3600 * 24));
  const differenceInHours = Math.floor(
    (differenceInMillis % (1000 * 3600 * 24)) / (1000 * 3600)
  );
  const difference = (differenceInDays + differenceInHours / 24).toFixed(2);

  return difference;
};

export const filterDates = (
  departureTimes: { start: string; end: string },
  startDate: string,
  endDate: string
): string[] => {
  const depStart = new Date(departureTimes.start);
  const depEnd = new Date(departureTimes.end);
  const startRange = new Date(startDate);
  const endRange = new Date(endDate);

  const validDates: string[] = [];

  depStart.setHours(0, 0, 0, 0);
  depEnd.setHours(0, 0, 0, 0);
  startRange.setHours(0, 0, 0, 0);
  endRange.setHours(0, 0, 0, 0);

  const currentDate = new Date(depStart);

  while (currentDate <= depEnd) {
    if (currentDate >= startRange && currentDate <= endRange) {
      validDates.push(currentDate.toISOString().split("T")[0]);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return validDates;
};

interface DayForecast {
  maxtemp_c: number;
  maxwind_kph: number;
  daily_chance_of_rain: number;
  daily_chance_of_snow: number;
}

interface Forecast {
  date: string;
  day: DayForecast;
}

interface Averages {
  avgMaxTempC: number;
  avgMaxWindKph: number;
  avgChanceOfRain: number;
  avgChanceOfSnow: number;
}

export const calculateAverages = (forecastData: Forecast[]): Averages => {
  const total = forecastData.reduce(
    (acc, day) => {
      acc.maxtemp_c += day.day.maxtemp_c;
      acc.maxwind_kph += day.day.maxwind_kph;
      acc.daily_chance_of_rain += day.day.daily_chance_of_rain;
      acc.daily_chance_of_snow += day.day.daily_chance_of_snow;
      return acc;
    },
    {
      maxtemp_c: 0,
      maxwind_kph: 0,
      daily_chance_of_rain: 0,
      daily_chance_of_snow: 0,
    }
  );

  const numberOfDays = forecastData.length;

  return {
    avgMaxTempC: total.maxtemp_c / numberOfDays,
    avgMaxWindKph: total.maxwind_kph / numberOfDays,
    avgChanceOfRain: total.daily_chance_of_rain / numberOfDays,
    avgChanceOfSnow: total.daily_chance_of_snow / numberOfDays,
  };
};
