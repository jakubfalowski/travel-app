import { client } from "./client.ts";
import { useQuery } from "@tanstack/react-query";

type HotelsProps = {
  startDate: string;
  endDate: string;
  cityId: string;
  person: number;
};

export function getHotels({ startDate, endDate, cityId, person }: HotelsProps) {
  return client(
    `hotels/searchHotels?dest_id=${cityId}&search_type=CITY&arrival_date=${startDate}&departure_date=${endDate}&adults=${person}&room_qty=1&page_number=1&units=metric&temperature_unit=c&languagecode=pl&currency_code=PLN`
  );
}

export function useHotels({ startDate, endDate, cityId, person }: HotelsProps) {
  const { data, isError, isLoading, refetch } = useQuery({
    queryKey: ["hotel", startDate, cityId, endDate, person],
    queryFn: () => getHotels({ startDate, endDate, cityId, person }),
  });

  const hotelsData = data?.data || [];
  return { hotelsData, isLoading, isError, refetch };
}
