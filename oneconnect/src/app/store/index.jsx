import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "../../features/map/store/mapSlice";
export const store = configureStore({
  reducer: {
    map: mapReducer,
  },
});
