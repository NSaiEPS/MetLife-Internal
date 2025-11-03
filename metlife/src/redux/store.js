import { configureStore } from "@reduxjs/toolkit";

import dashBoardSlice from "./features/dashBoardSlice";
import saveTranslatedDataSlice from "./features/saveSlice";


export const store = configureStore({
  reducer: {
    DashBoard: dashBoardSlice,
    SaveTranslatedData: saveTranslatedDataSlice, 
  },
  // middleware: [...getDefaultMiddleware(), thunk],
});
