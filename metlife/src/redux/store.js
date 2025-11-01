import { configureStore } from "@reduxjs/toolkit";

import dashBoardSlice from "./features/dashBoardSlice";

export const store = configureStore({
  reducer: {
    DashBoard: dashBoardSlice,
  },
  // middleware: [...getDefaultMiddleware(), thunk],
});
