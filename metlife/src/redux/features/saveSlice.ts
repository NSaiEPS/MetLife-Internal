import { createSlice,  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { AppDispatch,  } from "../store";// adjust path based on your project
import { toast } from "react-toastify";



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


const initialState: SaveTranslatedPageState = {
  saveLoader: false,
  saveTranslatedData: null,
};


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

export const { setSaveLoader, setSaveTranslatedData } =
  SaveTranslatedPageSlice.actions;


export default SaveTranslatedPageSlice.reducer;

type SuccessCallback = (scriptId: string) => void;

export const postTranslatedDataSave =
  (data: TranslatedData, successfully?: SuccessCallback) =>
  async (dispatch: AppDispatch) => {
    dispatch(setSaveLoader(true));
    try {
      const response = await api.post("mongo/write", data);
      if (response?.status) {
        dispatch(setSaveTranslatedData(response?.data));
        if (successfully) {
          successfully(response.data?.script_id);
        }
        toast.success("Data Saved Successfully");
      }
    } catch (error) {
      console.error(error);
      // toast.error("Data not saved!");
    } finally {
      dispatch(setSaveLoader(false));
    }
  };

  export const postEditSceneForScript =
  (data) =>
  async (dispatch: AppDispatch) => {
    dispatch(setSaveLoader(true));
    try {
      const response = await api.post("mongo/edit", data);
      if (response?.status) {
        // dispatch(setSaveTranslatedData(response.data));
      }
    } catch (error) {
      // console.error(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setSaveLoader(false));
    }
  };
