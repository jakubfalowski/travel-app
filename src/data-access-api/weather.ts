import { client } from "./client.ts";
import { useQuery } from "@tanstack/react-query";

type WeatherType = {
  city: string;
};

export function getWeather({ city }: WeatherType) {
  return client(
    `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${city}&days=14`,
    {
      headers: {
        "x-rapidapi-key": process.env.REACT_APP_WEATHER_API_KEY || "",
        "x-rapidapi-host": "weatherapi-com.p.rapidapi.com",
      },
    }
  );
}

export function useWeather({ city }: WeatherType) {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["weather", city],
    queryFn: () => getWeather({ city }),
  });
  return { data, isLoading, isError, refetch };
}
