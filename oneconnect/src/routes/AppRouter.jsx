// router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "@/app/layout/DefaultLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { UnauthorizedPage } from "@/features/errors";
import { SignIn } from "@clerk/clerk-react"; // if needed
import { MapView } from "../features/map";
import { RequestPage } from "../features/places";
import AuthenticateRoute from "./AuthenticateRoute";
import NamphraePage from "../features/places/pages/NamphraePage";

export const router = createBrowserRouter([
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/sign-in",
    element: <SignIn routing="path" path="/sign-in" />,
  },
  {
    element: <AuthenticateRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          {
            path: "/request-place",
            element: <RequestPage />,
          },
          {
            path: "/namphrae",
            element: <NamphraePage />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DefaultLayout />,
            children: [
              {
                path: "/",
                element: <MapView />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
