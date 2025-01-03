import { client } from "./client.ts";
import { useQuery } from "@tanstack/react-query";

type FlightProps = {
  startDate: string;
  endDate: string;
  startAirport: string;
  endAirport: string;
  person: number;
};

export function getFlights({
  startDate,
  endDate,
  startAirport,
  endAirport,
  person,
}: FlightProps) {
  return client(
    `flights/searchFlights?fromId=${startAirport}&toId=${endAirport}&departDate=${startDate}&returnDate=${endDate}&pageNo=1&adults=${person}&sort=BEST&cabinClass=ECONOMY&currency_code=PLN`
  );
}

export function useFlights({
  startDate,
  endDate,
  startAirport,
  endAirport,
  person,
}: FlightProps) {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["flight", startDate, startAirport, endAirport, endDate, person],
    enabled:
      startDate !== "" &&
      endDate !== "" &&
      startAirport !== "" &&
      endDate !== "",
    queryFn: () =>
      getFlights({ startDate, endDate, startAirport, endAirport, person }),
  });
  const flightsData = data?.data || [];
  return { flightsData, isLoading, isError, refetch };
}
