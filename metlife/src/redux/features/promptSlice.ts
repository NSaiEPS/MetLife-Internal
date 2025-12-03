import { createSlice,  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { AppDispatch,  } from "../store";
import { toast } from "react-toastify";

// ======================
// TYPES
// ======================

export interface PromptItem {
  id?: number;
  prompt?: string;
  is_saved?: boolean;
  message?: string;
  [key: string]: any;
}

export interface PromptState {
  promtLoader: boolean;
  promptData: PromptItem[];
}

const initialState: PromptState = {
  promtLoader: false,
  promptData: [],
};

// ======================
// SLICE
// ======================

const PromptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setPromptLoader(state, action: PayloadAction<boolean>) {
      state.promtLoader = action.payload;
    },
    setPromptData(state, action: PayloadAction<PromptItem[] | any>) {
      state.promptData = action.payload;
    },
  },
});

export const { setPromptLoader, setPromptData } = PromptSlice.actions;

export default PromptSlice.reducer;

// ======================
// ASYNC ACTIONS
// ======================

// SAVE PROMPT
export const postSavePrompt =
  (
    id: string | number,
    data: any,
    closeModal?: () => void,
    setOperations?: (v: boolean) => void
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setPromptLoader(true));

    try {
      const res = await api.post(`scripts/${id}/save-prompt`, data);

      if (res.status) {
        dispatch(setPromptData(res?.data));

        toast.success(res?.data?.message || "Prompt saved successfully");

        if (closeModal) closeModal();
        if (setOperations) setOperations(true);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setPromptLoader(false));
    }
  };

// GET SAVED PROMPTS LIST
export const getPromptsList =
  () => async (dispatch: AppDispatch) => {
    dispatch(setPromptLoader(true));

    try {
      const res = await api.get(`saved-prompts`);

      if (res.status) {
        dispatch(setPromptData(res?.data));
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      dispatch(setPromptLoader(false));
    }
  };
