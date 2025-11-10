import { configureStore } from "@reduxjs/toolkit";

import dashBoardSlice from "./features/dashBoardSlice";
import saveTranslatedDataSlice from "./features/saveSlice";
import createVisualContentSlice from "./features/createVisualSlice";
import scriptSlice from "./features/scriptSlice";
import generateVisualSlice from "./features/generateVisualSlice";


export const store = configureStore({
  reducer: {
    DashBoard: dashBoardSlice,
    SaveTranslatedData: saveTranslatedDataSlice, 
    CreateVisualContent: createVisualContentSlice,
    GenerateVisualContent: generateVisualSlice,
    Script:scriptSlice,
  },
  // middleware: [...getDefaultMiddleware(), thunk],
});
