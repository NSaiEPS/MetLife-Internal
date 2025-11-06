import { createSlice } from "@reduxjs/toolkit";
import reducer from "./saveSlice";
import { useDispatch } from "react-redux";
import api from "../../api/axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

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
    // console.log(response?.data?.prompts, "check_visual_responnse");
    if (response?.status) {
      dispatch(setSaveVisualContentData(response?.data));
      return response;
    }
  } catch (error) {
    console.log(error);
  } finally {
    dispatch(setSaveVisualContentLoader(false));
  }
};

// VIEW
export const getVisualContent = (id) => async (dispatch) => {
  // if (!id) return;
  dispatch(setSaveVisualContentLoader(true));
  try {
    const response = await api.get(`prompt/get/${id}`);
    // console.log(response, "view_response");
    if (response?.status) {
      dispatch(setSaveVisualContentData(response?.data));
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setSaveVisualContentLoader(false));
  }
};

// Edit Prompt
export const postEditVisualContent = (data, onClose) => async (dispatch) => {
  dispatch(setSaveVisualContentLoader(true));
  try {
    const response = await api.post(`prompt/edit`, data);
    console.log(response, "edit_response");
    toast.success(response?.data?.message || "Prompt updated successfully")
    // if (response?.status) {
    //   dispatch(setSaveVisualContentData(response?.data));
    // }
  } catch (error) {
    console.error(error);
    toast.success(error?.response?.data?.message || "Something went wrong!")
  } finally {
    dispatch(setSaveVisualContentLoader(false));
    onClose(true);
  }
};
