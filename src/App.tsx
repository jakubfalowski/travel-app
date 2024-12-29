import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { TravelContextProvider } from "./pages/context.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TravelContextProvider />,
  },
]);

export default function AuthenticatedApp() {
  return <RouterProvider router={router} />;
}
