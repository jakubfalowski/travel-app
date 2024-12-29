import React from "react";
import { useTravelContext } from "./context.tsx";
import ChooseOptionPage from "./choose-options.tsx";

export function ManagePage() {
  const { step } = useTravelContext();
  return step === 1 ? <ChooseOptionPage /> : <div>dwaa</div>;
}
