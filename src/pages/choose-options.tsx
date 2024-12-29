import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useState, useMemo } from "react";
import { CITIES } from "../variables.ts";
import DateAndTimePicker from "../date-picker/date-picker.tsx";
import { useFlights } from "../data-access-api/flights.ts";
import { useHotels } from "../data-access-api/hotels.ts";
import { useTravelContext } from "./context.tsx";

const ChooseOptionPage = () => {
  const [city, setCity] = useState("");
  const [startDateTime, setStartDateTime] = useState<string | null>(null);
  const [endDateTime, setEndDateTime] = useState<string | null>(null);
  const { setStep } = useTravelContext();
  const { flightsData } = useFlights({
    startDate: "2025-01-01",
    endDate: "2025-01-08",
    startAirport: CITIES[0].flight_id,
    endAirport: CITIES[1].flight_id,
    person: 1,
  });

  const { hotelsData } = useHotels({
    startDate: "2025-01-01",
    endDate: "2025-01-08",
    cityId: CITIES[0].hotel_id,
    person: 1,
  });

  const convertedFlightsData = useMemo(() => {
    if (!flightsData?.flightOffers) {
      return [];
    }

    return flightsData.flightOffers.map((flight) => ({
      price: flight.priceBreakDown?.total?.units || [],
      baggagePrice:
        flight.extraProducts?.find((item) => item.type === "checkedInBaggage")
          ?.priceBreakdown?.total?.units || [],
      departureAirport1: flight.segments[0]?.departureAirport?.name || [],
      arrivalAirport1: flight.segments[0]?.arrivalAirport?.name || [],
      departureTime1: flight.segments[0]?.departureTime || [],
      arrivalTime1: flight.segments[0]?.arrivalTime || [],
      flightDuration1: flight.segments[0]?.totalTime || [],
      departureAirport2: flight.segments[1]?.departureAirport?.name || [],
      arrivalAirport2: flight.segments[1]?.arrivalAirport?.name || [],
      departureTime2: flight.segments[1]?.departureTime || [],
      arrivalTime2: flight.segments[1]?.arrivalTime || [],
      flightDuration2: flight.segments[1]?.totalTime || [],
    }));
  }, [flightsData]);

  const convertedHotelsData = useMemo(() => {
    if (!hotelsData?.hotels) {
      return [];
    }

    return hotelsData.hotels.map((hotel) => ({
      description: hotel.accessibilityLabel || [],
      name: hotel.property?.name || [],
      latitude: hotel.property?.latitude || [],
      longitude: hotel.property?.longitude || [],
      reviewCount: hotel.property?.reviewCount || [],
      reviewScore: hotel.property?.reviewScore || [],
      price: hotel.property?.priceBreakdown?.grossPrice?.value || [],
      imageUrl: hotel.property?.photoUrls?.[0] || [],
      cityId: hotel.property?.ufi || [],
      cityName: hotel.property?.wishlistName || [],
    }));
  }, [hotelsData]);

  console.log(convertedFlightsData, convertedHotelsData);
  return (
    <div className="m-4">
      <FormControl fullWidth>
        <InputLabel>Miasto</InputLabel>
        <Select
          value={city}
          label="Miasto"
          onChange={(e) => setCity(e.target.value)}
        >
          {CITIES.map((city, index) => (
            <MenuItem value={`${city.hotel_id} ${city.flight_id}`} key={index}>
              {city.name}
            </MenuItem>
          ))}

          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <DateAndTimePicker
          isVisible={true}
          onClose={() => console.log("close")}
          setStartDateTime={setStartDateTime}
          startDateTime={startDateTime}
          setEndDateTime={setEndDateTime}
          endDateTime={endDateTime}
        />
      </FormControl>
      <button onClick={() => setStep(2)}>dalej</button>
    </div>
  );
};

export default ChooseOptionPage;
