// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const ProtectedRoute = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  const role = user?.publicMetadata?.role;
  const userPlaceId = user?.publicMetadata?.places;

  if (!isSignedIn) {
    console.log("Not signed in");
    return <Navigate to="/sign-in" replace />;
  }

  // Optional: Role-based access control
  // if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
  //   console.log("Not authorized: ", role);
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // Only SUPER_ADMIN can bypass place requirement
  if (!["SUPER_ADMIN"].includes(role) && !userPlaceId) {
    console.log("No place assigned, redirecting to request-place");
    return <Navigate to="/request-place" replace />;
  }

  console.log("Authorized, rendering outlet");
  return <Outlet />;
};

export default ProtectedRoute;
