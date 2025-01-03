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
