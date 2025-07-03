import { useQuery } from "@tanstack/react-query";

const fetchPlaces = async (placeId) => {
  const url =  `/api/places/${placeId}`
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const usePlaces = (placeId) => {
  return useQuery({
    queryKey: ["places", placeId],
    queryFn: () => fetchPlaces(placeId),
    enabled: !!placeId,
  });
};


