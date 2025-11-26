import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { navigateTo } from "../../utils/navigate";

const initialState = {
  promtLoader: false,
  promptData: [],
};

const PromptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    setPromptLoader(state, action) {
      state.promtLoader = action.payload;
    },
    setPromptData(state, action) {
      state.promptData = action.payload;
    },
  },
});

export const { setPromptLoader, setPromptData } = PromptSlice.actions;

export default PromptSlice.reducer;

// Post prompt saving
export const postSavePrompt = (id, data, closeModal, setOperations) => async (dispatch) => {
  dispatch(setPromptLoader(true));
  try {
    const res = await api.post(`scripts/${id}/save-prompt`, data);
    console.log(res, "audioResCheck");
    if (res.status) {
      dispatch(setPromptData(res?.data));
      toast.success(res?.data?.message || "Prompt saved successfully");
      if (closeModal) closeModal();
      setOperations(true);
    }
  } catch (error) {
    console.log(error);
    toast.error(error?.res?.data?.message || "Something went wrong!");
  } finally {
    dispatch(setPromptLoader(false));
  }
};

// // Get Preview voices
export const getPromptsList = () => async (dispatch) => {
  dispatch(setPromptLoader(true));
  try {
    const res = await api.get(`saved-prompts`);
    if (res.status) {
      dispatch(setPromptData(res?.data));
      // toast.success("Audio generated successfully");
    }
  } catch (error) {
    console.log(error);
    // toast.error("Something went wrong!");
  } finally {
    dispatch(setPromptLoader(false));
  }
};
