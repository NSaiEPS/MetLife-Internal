import { createSlice,  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { AppDispatch,  } from "../store";// adjust path based on your project
import { toast } from "react-toastify";

// -----------------------------
// TYPES
// -----------------------------

export interface TranslatedData {
  [key: string]: any; // ❗ Replace with actual structure if known
}

export interface SaveTranslatedPageState {
  saveLoader: boolean;
  saveTranslatedData: TranslatedData | null;
}

export interface SaveRequestPayload {
  [key: string]: any; // body to send in POST
}

// -----------------------------
// INITIAL STATE
// -----------------------------

const initialState: SaveTranslatedPageState = {
  saveLoader: false,
  saveTranslatedData: null,
};

// -----------------------------
// SLICE
// -----------------------------

const SaveTranslatedPageSlice = createSlice({
  name: "save_translated_data",
  initialState,
  reducers: {
    setSaveLoader(state, action: PayloadAction<boolean>) {
      state.saveLoader = action.payload;
    },
    setSaveTranslatedData(state, action: PayloadAction<TranslatedData | null>) {
      state.saveTranslatedData = action.payload;
    },
  },
});

// -----------------------------
// EXPORT ACTIONS
// -----------------------------

export const { setSaveLoader, setSaveTranslatedData } =
  SaveTranslatedPageSlice.actions;

// -----------------------------
// REDUCER
// -----------------------------

export default SaveTranslatedPageSlice.reducer;

// -----------------------------
// ASYNC THUNK
// -----------------------------

export const postTranslatedDataSave =
  (data: SaveRequestPayload) => async (dispatch: AppDispatch) => {
    dispatch(setSaveLoader(true));

    try {
      const response = await api.post("mongo/write", data);

      if (response?.status === 200) {
        dispatch(setSaveTranslatedData(response.data));
        toast.success("Data Saved Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setSaveLoader(false));
    }
  };
