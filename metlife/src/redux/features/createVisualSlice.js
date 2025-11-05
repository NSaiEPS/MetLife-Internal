import { createSlice } from "@reduxjs/toolkit";
import reducer from "./saveSlice";
import { useDispatch } from "react-redux";
import api from "../../api/axios";

const initialState = {
  saveVisualContentLoader: false,
  saveVisualContentData: null,
};

const CreateVisualContentPageSlice = createSlice({
  name: "visual_content_data",
  initialState,
  reducers: {
    setSaveVisualContentLoader(state, action) {
      state.saveVisualContentLoader = action.payload;
    },
    setSaveVisualContentData(state, action) {
      console.log(action);
      state.saveVisualContentData = action.payload;
    },
  },
});

export const { setSaveVisualContentData, setSaveVisualContentLoader } =
  CreateVisualContentPageSlice.actions;

export default CreateVisualContentPageSlice.reducer;

export const postCreateVisualContent = (data) => async (dispatch) => {
  dispatch(setSaveVisualContentLoader(true));
  try {
    const response = await api.post("prompt/generate", data);
    console.log(response?.data?.prompts, "check_visual_responnse");
    if (response?.status) {
      dispatch(setSaveVisualContentData(response?.data?.prompts));
    }
  } catch (error) {
    console.log(error);
  } finally {
    dispatch(setSaveVisualContentLoader(false));
  }
};
