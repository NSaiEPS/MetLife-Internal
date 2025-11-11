import { createSlice } from "@reduxjs/toolkit";
import reducer from "./saveSlice";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { navigateTo } from "../../utils/navigate";

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
      state.saveVisualContentData = action.payload;
    },
    updateVisualPromt(state, action) {
      let actualdata = [...state.saveVisualContentData.prompts]?.map((item) => {
        let data = { ...item };
        if (item?.scene_id == action?.payload?.scene_id) {
          data.prompt = action?.payload?.new_prompt;
          data.prompt_id = action?.payload?.prompt_id;
          if (action?.payload?.visual_type) {
            data.visual_type = action?.payload?.visual_type;
          }
          if (action?.payload?.clip_prompt) {
            // data.clip_prompt = action?.payload?.clip_prompt;
            data.clip_prompt =
              action?.payload?.clip_prompt ?? data.clip_prompt ?? "";
          }
        }
        return data;
      });
      let actualSaveVisualContentData = { ...state.saveVisualContentData };
      actualSaveVisualContentData.prompts = actualdata;
      state.saveVisualContentData = actualSaveVisualContentData;
    },
  },
});

export const {
  setSaveVisualContentData,
  setSaveVisualContentLoader,
  updateVisualPromt,
} = CreateVisualContentPageSlice.actions;

export default CreateVisualContentPageSlice.reducer;

export const postCreateVisualContent = (data) => async (dispatch) => {
  dispatch(setSaveVisualContentLoader(true));
  try {
    const response = await api.post("prompt/generate", data);
    if (response?.status) {
      dispatch(setSaveVisualContentData(response?.data));
      navigateTo(`/create-visual-content/${response?.data?.prompt_batch_id}`);
      // return response;
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
    toast.success(response?.data?.message || "Prompt updated successfully");
    onClose(false);
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Something went wrong!");
  } finally {
    dispatch(setSaveVisualContentLoader(false));
  }
};

// Prompt regenerate
export const postRegenerateVisualContent =
  (data, onCloseTempData) => async (dispatch) => {
    dispatch(setSaveVisualContentLoader(true));
    try {
      const response = await api.post(`prompt/regenerate`, data);
      toast.success(
        response?.data?.message || "Prompt regenerated successfully"
      );
      // onClose(false);
      onCloseTempData(false);
      dispatch(
        updateVisualPromt({
          new_prompt: response?.data?.new_prompt,
          prompt_id: response?.data?.new_prompt_id,
          scene_id: response?.data?.scene_id,
        })
      );
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setSaveVisualContentLoader(false));
      onCloseTempData(true);
    }
  };

// clip regenerate
export const postVisualTypeUpdate = (data) => async (dispatch) => {
  dispatch(setSaveVisualContentLoader(true));
  try {
    const response = await api.post(`prompt/clip/generate`, data);
    toast.success(response?.data?.message || "Clip generated successfully");
    dispatch(
      updateVisualPromt({
        new_prompt: response?.data?.prompt?.prompt,
        prompt_id: response?.data?.prompt?.prompt_id,
        scene_id: response?.data?.prompt?.scene_id,
        visual_type: response?.data?.prompt?.visual_type,
        clip_prompt: response?.data?.prompt?.clip_prompt,
      })
    );
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Something went wrong!");
  } finally {
    dispatch(setSaveVisualContentLoader(false));
  }
};
