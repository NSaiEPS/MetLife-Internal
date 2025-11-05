import { configureStore } from "@reduxjs/toolkit";

import dashBoardSlice from "./features/dashBoardSlice";
import saveTranslatedDataSlice from "./features/saveSlice";
import createVisualContentSlice from "./features/createVisualSlice";

export const store = configureStore({
  reducer: {
    DashBoard: dashBoardSlice,
    SaveTranslatedData: saveTranslatedDataSlice, 
    CreateVisualContent: createVisualContentSlice,
  },
  // middleware: [...getDefaultMiddleware(), thunk],
});
