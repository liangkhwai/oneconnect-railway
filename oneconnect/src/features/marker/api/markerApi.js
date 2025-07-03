import { useQuery } from "@tanstack/react-query";

const fetchNamphraeMarkers = async () => {
  const response = await fetch("/api/markers/namphrae"); // Assuming your backend API endpoint for markers is /api/markers
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useNamphraeMarkers = () => {
  return useQuery({
    queryKey: ["markers", "namphrae"],
    queryFn: fetchNamphraeMarkers,
  });
};
