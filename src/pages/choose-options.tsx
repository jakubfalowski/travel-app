import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { CITIES } from "../utils/variables.ts";
import DateAndTimePicker from "../date-picker/date-picker.tsx";
import { useTravelContext } from "./context.tsx";

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

  return (
    <div className="m-4">
      <div className="flex gap-8">
        <div className="w-32">
          <FormControl fullWidth>
            <InputLabel>Miasto startowe</InputLabel>
            <Select
              value={startCityId}
              label="Miasto startowe"
              onChange={(e) => setStartCityId(e.target.value)}
            >
              {CITIES.map((city, index) => (
                <MenuItem value={city.id} key={index}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="w-32">
          <FormControl fullWidth>
            <InputLabel>Miasto koncowe</InputLabel>
            <Select
              value={endCityId}
              label="Miasto koncowe"
              onChange={(e) => setEndCityId(e.target.value)}
            >
              {CITIES.map((city, index) => (
                <MenuItem value={city.id} key={index}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <FormControl>
        <DateAndTimePicker
          isVisible={true}
          onClose={() => console.log("close")}
          setStartDateTime={setStartDateTime}
          startDateTime={startDateTime}
          setEndDateTime={setEndDateTime}
          endDateTime={endDateTime}
        />
      </FormControl>
      <br />
      <button onClick={() => setStep(2)}>dalej</button>
      <br />
      <button onClick={() => setStep(4)}>Porównaj oferty</button>
    </div>
  );
};

export default ChooseOptionPage;
