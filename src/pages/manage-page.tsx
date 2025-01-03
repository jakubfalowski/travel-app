import React, { useEffect, useMemo } from "react";
import { useTravelContext } from "./context.tsx";
import ChooseOptionPage from "./choose-options.tsx";
import { useFlights } from "../data-access-api/flights.ts";
import { useHotels } from "../data-access-api/hotels.ts";
import { SelectFlightOffers } from "./select-flight-offers.tsx";
import {
  ConvertedFlightData,
  ConvertedHotelData,
} from "../utils/converted-types.tsx";
import { getCityById } from "../utils/functions.ts";
import { SelectHotelOffers } from "./select-hotel-offers.tsx";

export function ManagePage() {
  const {
    step,
    setConvertedFlightsData,
    setConvertedHotelsData,
    startDateTime,
    endDateTime,
    startCityId,
    endCityId,
  } = useTravelContext();

  const { flightsData } = useFlights({
    startDate: startDateTime || "",
    endDate: endDateTime || "",
    startAirport: getCityById(startCityId)?.flight_id || "",
    endAirport: getCityById(endCityId)?.flight_id || "",
    person: 1,
  });

  const { hotelsData } = useHotels({
    startDate: startDateTime || "",
    endDate: endDateTime || "",
    cityId: getCityById(endCityId)?.hotel_id || "",
    person: 1,
  });

  const tempConvertedFlightsData: ConvertedFlightData[] = useMemo(() => {
    if (!flightsData?.flightOffers) {
      return [];
    }

    return flightsData.flightOffers.map((flight, id) => ({
      id: id,
      price: Number(flight.priceBreakdown?.total?.units).toFixed(2) || 0,
      baggagePrice:
        flight.extraProducts?.find((item) => item.type === "checkedInBaggage")
          ?.priceBreakdown?.total?.units || [],
      departureAirport1: flight.segments[0]?.departureAirport?.name || [],
      arrivalAirport1: flight.segments[0]?.arrivalAirport?.name || [],
      departureTime1: flight.segments[0]?.departureTime || [],
      arrivalTime1: flight.segments[0]?.arrivalTime || "",
      flightDuration1: flight.segments[0]?.totalTime || [],
      departureAirport2: flight.segments[1]?.departureAirport?.name || [],
      arrivalAirport2: flight.segments[1]?.arrivalAirport?.name || [],
      departureTime2: flight.segments[1]?.departureTime || [],
      arrivalTime2: flight.segments[1]?.arrivalTime || "",
      flightDuration2: flight.segments[1]?.totalTime || [],
    }));
  }, [flightsData]);

  const tempConvertedHotelsData: ConvertedHotelData[] = useMemo(() => {
    if (!hotelsData?.hotels) {
      return [];
    }

    return hotelsData.hotels.map((hotel, id) => ({
      id: id,
      description: hotel.accessibilityLabel || [],
      name: hotel.property?.name || [],
      latitude: hotel.property?.latitude || [],
      longitude: hotel.property?.longitude || [],
      reviewCount: hotel.property?.reviewCount || [],
      reviewScore: hotel.property?.reviewScore || [],
      price:
        Number(hotel.property?.priceBreakdown?.grossPrice?.value).toFixed(2) ||
        0,
      imageUrl: hotel.property?.photoUrls?.[0] || [],
      cityId: hotel.property?.ufi || [],
      cityName: hotel.property?.wishlistName || [],
    }));
  }, [hotelsData]);

  useEffect(() => {
    if (tempConvertedFlightsData.length > 0)
      setConvertedFlightsData(tempConvertedFlightsData);
  }, [tempConvertedFlightsData, setConvertedFlightsData]);

  useEffect(() => {
    if (tempConvertedHotelsData.length > 0)
      setConvertedHotelsData(tempConvertedHotelsData);
  }, [tempConvertedHotelsData, setConvertedHotelsData]);

  const storedData = localStorage.getItem("compareObjects")
    ? JSON.parse(localStorage.getItem("compareObjects") || "")
    : [];
  console.log(storedData);

  if (step === 1) return <ChooseOptionPage />;
  if (step === 2) return <SelectFlightOffers />;
  if (step === 3) return <SelectHotelOffers />;
}
