import { useQuery } from "@tanstack/react-query";

const fetchNamphraeMarkers = async (category) => {
  const url = new URL("/api/markers/namphrae", window.location.origin);
  if (category) {
    url.searchParams.append("category", category);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchNamphraeCategories = async () => {
  const response = await fetch("/api/markers/namphrae/categories");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useNamphraeMarkers = (category) => {
  return useQuery({
    queryKey: ["markers", "namphrae", category],
    queryFn: () => fetchNamphraeMarkers(category),
  });
};

export const useNamphraeCategories = () => {
  return useQuery({
    queryKey: ["namphraeCategories"],
    queryFn: fetchNamphraeCategories,
  });
};