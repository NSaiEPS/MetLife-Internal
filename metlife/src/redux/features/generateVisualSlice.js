import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { setSaveVisualContentLoader } from "./createVisualSlice";
import { toast } from "react-toastify";
import { navigateTo } from "../../utils/navigate";

const initialState = {
  generateVisualLoader: false,
  generateVisualContentData: [],
};

const GenerateVisualContentSlice = createSlice({
  name: "generate_visual_content",
  initialState,
  reducers: {
    setGenerateVisualLoader(state, action) {
      state.generateVisualLoader = action.payload;
    },
    setGenerateVisualContentData(state, action) {
      state.generateVisualContentData = action.payload;
    },
  },
});

export const { setGenerateVisualLoader, setGenerateVisualContentData } =
  GenerateVisualContentSlice.actions;

export default GenerateVisualContentSlice.reducer;

export const postGenerateVisualContentImage = (data) => async (dispatch) => {
  dispatch(setGenerateVisualLoader(true));
  try {
    const response = await api.post("images/generate-images", data);
    console.log(response);
    if (response?.status) {
      dispatch(setGenerateVisualContentData(response?.data?.visuals));
      navigateTo(`/generate-visual-page/${response?.data?.script_id}`);
      toast.success("Visual Image generated successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong!");
  } finally {
    dispatch(setGenerateVisualLoader(false));
  }
};

// View
export const getGenerateVisualContentImage = (id) => async (dispatch) => {
  dispatch(setGenerateVisualLoader(true));
  try {
    const response = await api.get(`images/${id}`);
    if (response?.status) {
      dispatch(setGenerateVisualContentData(response?.data));
    }
    console.log(response);
  } catch (error) {
    console.log(error);
  } finally {
    dispatch(setGenerateVisualLoader(false));
  }
};
