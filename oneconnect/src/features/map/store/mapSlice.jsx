import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    selectedMarkerId: null,
  },
  reducers: {
    setSelectedMarkerId: (state, action) => {
      state.selectedMarkerId = action.payload;
    },
  },
});

export const { setSelectedMarkerId } = mapSlice.actions;
export default mapSlice.reducer;
