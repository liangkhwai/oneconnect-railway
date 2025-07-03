// components/ProtectedLayout.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AuthenticateRoute = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!isSignedIn) {
    console.log("Not signed in");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AuthenticateRoute;
