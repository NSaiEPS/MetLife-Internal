import { createSlice } from "@reduxjs/toolkit";
import reducer from "./saveSlice";
import api from "../../api/axios";
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
    updateVisualPromt(state, action) {
      let actualdata = [...state.saveVisualContentData?.prompts]?.map(
        (item) => {
          console.log(item?.scene_id ,action?.payload,'hggggggg')
          let data = { ...item };
          if (item?.scene_id == action?.payload?.scene_id) {
            data.prompt = action?.payload?.new_prompt;
            data.prompt_id = action?.payload?.new_prompt_id;
          }
          return data;
        }
      );
      let actualSaveVisualContentData = { ...state.saveVisualContentData };
      actualSaveVisualContentData.prompts = actualdata;
      state.saveVisualContentData = actualSaveVisualContentData;
    },
    // updateVisualPromtType(state, action) {
    //   let actualdata = [...state.saveVisualContentData?.prompts]?.map(
    //     (item) => {
    //       let data = { ...item };
    //       if (item?.scene_id === action?.payload?.scene_id) {
    //         data.prompt = action?.payload?.clip_prompt;
    //         data.prompt_id = action?.payload?.prompt_id;

    //       }
    //       return data;
    //     }
    //   );
    //   let actualSaveVisualContentData = { ...state.saveVisualContentData };
    //   actualSaveVisualContentData.prompts = actualdata;
    //   state.saveVisualContentData = actualSaveVisualContentData;
    // },
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
    toast.success(response?.data?.message || "Prompt updated successfully");
    onClose(false);
  } catch (error) {
    console.error(error);
    toast.success(error?.response?.data?.message || "Something went wrong!");
  } finally {
    dispatch(setSaveVisualContentLoader(false));
  }
};

// Prompt regenerate
export const postRegenerateVisualContent =
  (data, onClose) => async (dispatch) => {
    dispatch(setSaveVisualContentLoader(true));
    try {
      const response = await api.post(`prompt/regenerate`, data);
      console.log(response, "edit_response");
      toast.success(
        response?.data?.message || "Prompt regenerated successfully"
      );
      onClose(false);
      dispatch(
        updateVisualPromt({
          new_prompt: response?.data?.new_prompt,
          new_prompt_id: response?.data?.new_prompt_id,
          scene_id: response?.data?.scene_id,
        })
      );

      // onClose(false);
      // if (response?.status) {
      //   dispatch(setSaveVisualContentData(response?.data));
      // }
    } catch (error) {
      console.error(error);
      toast.success(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setSaveVisualContentLoader(false));
    }
  };

// Prompt regenerate
export const postVisualTypeUpdate = (data) => async (dispatch) => {
  dispatch(setSaveVisualContentLoader(true));
  try {
    const response = await api.post(`prompt/clip/generate`, data);
    console.log(response, "clip_response");
    toast.success(response?.data?.message || "Clip generated successfully");
    dispatch(
      updateVisualPromt({
        new_prompt: response?.data?.prompt?.clip_prompt,
        prompt_id: response?.data?.prompt?.prompt_id,
        scene_id: response?.data?.prompt?.scene_id,
      })
    );
  } catch (error) {
    console.error(error);
    toast.success(error?.response?.data?.message || "Something went wrong!");
  } finally {
    dispatch(setSaveVisualContentLoader(false));
  }
};
