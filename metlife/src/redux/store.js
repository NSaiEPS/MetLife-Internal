import { configureStore } from "@reduxjs/toolkit";

import dashBoardSlice from "./features/dashBoardSlice";
import saveTranslatedDataSlice from "./features/saveSlice";
import createVisualContentSlice from "./features/createVisualSlice";
import scriptSlice from "./features/scriptSlice";


export const store = configureStore({
  reducer: {
    DashBoard: dashBoardSlice,
    SaveTranslatedData: saveTranslatedDataSlice, 
    CreateVisualContent: createVisualContentSlice,
    Script:scriptSlice,
  },
  // middleware: [...getDefaultMiddleware(), thunk],
});
