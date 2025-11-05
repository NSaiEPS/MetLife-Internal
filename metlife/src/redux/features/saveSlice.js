import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";

const initialState = {
  saveLoader: false,
  saveTranslatedData: null,
};

const SaveTranslatedPageSlice = createSlice({
  name: "save_translated_data",
  initialState,
  reducers: {
    setSaveLoader(state, action) {
      state.saveLoader = action.payload;
    },
    setSaveTranslatedData(state, action) {
      state.saveTranslatedData = action.payload;
    },
  },
});

export const {
  setSaveLoader,
  setSaveTranslatedData,
  setRegenerated,
  setSaved,
  resetSaveState,
} = SaveTranslatedPageSlice.actions;

export default SaveTranslatedPageSlice.reducer;

export const postTranslatedDataSave = (data) => async (dispatch) => {
  dispatch(setSaveLoader(true));
  try {
    const response = await api.post("mongo/write", data);
    // console.log(response, "check_save_response");
    if (response?.status) {
      dispatch(setSaveTranslatedData(response?.data));
      toast.success("Data Saved Successfully");
      // console.log(response);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  } finally {
    dispatch(setSaveLoader(false));
  }
};
