import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";
import dashBoardSlice from "./features/dashBoardSlice";
import saveTranslatedDataSlice from "./features/saveSlice";
import createVisualContentSlice from "./features/createVisualSlice";
import scriptSlice from "./features/scriptSlice";
import generateVisualSlice from "./features/generateVisualSlice";
import audioAnimationSlice from "./features/audioAnimationSlice";
import promptSlice from "./features/promptSlice";
import conversationalSlice from "./features/conversationalSlice";


export const store = configureStore({
  reducer: {
    Auth:authSlice,
    DashBoard: dashBoardSlice,
    SaveTranslatedData: saveTranslatedDataSlice,
    CreateVisualContent: createVisualContentSlice,
    GenerateVisualContent: generateVisualSlice,
    AudioAnimation: audioAnimationSlice,
    Prompts: promptSlice,
    Script: scriptSlice,
    Conversational: conversationalSlice,
  },
});

// ---------- TypeScript Helper Types ----------
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
