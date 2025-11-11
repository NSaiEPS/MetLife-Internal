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
    // updateGenerateVisual(state, action) {
    //   console.log(state.generateVisualContentData, "state_checkl");
    //   let actualData = [...state.generateVisualContentData.visuals]?.map(
    //     (item) => {
    //       console.log(item, action?.payload, "state_checkl");

    //       let data = { ...item };
    //       if (item?.scene_id == action?.payload?.scene_id) {
    //         data.image_uploaded_urls = action.payload?.new_images;
    //         // data.image_uploaded_urls = action.payload.new_images;
    //       }
    //       return data;
    //     }
    //   );

    //   let actualVisualGenerateData = { ...state.generateVisualContentData };
    //   actualVisualGenerateData.visuals = actualData;
    //   state.generateVisualContentData = actualVisualGenerateData;
    // },

    updateGenerateVisual(state, action) {
      let actualVisualGenerateData = { ...state.generateVisualContentData };
      actualVisualGenerateData.visuals = action?.payload?.visuals;
      state.generateVisualContentData = actualVisualGenerateData;
    },
  },
});

export const {
  setGenerateVisualLoader,
  setGenerateVisualContentData,
  updateGenerateVisual,
} = GenerateVisualContentSlice.actions;

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

// Image upload functionality
export const postImageUpload = (data) => async (dispatch) => {
  dispatch(setGenerateVisualLoader(true));
  try {
    const response = await api.post(`images/upload-image`, data);
    const sceneNumber = parseInt(data.get("scene_number"));

    const newImageUrls =
      response?.data?.visuals?.[sceneNumber - 1]?.image_uploaded_urls || [];

    // const newImageObjects =
    //   response?.data?.visuals?.[sceneNumber - 1]?.image_uploaded_urls || [];

    const sceneId = response?.data?.visuals?.[sceneNumber - 1]?.scene_id;
    console.log(response, "check_image_upload_response");
    toast.success(
      response?.data?.message ?? "Image uploaded & scene updated successfully"
    );

    dispatch(
      updateGenerateVisual({
        visuals: response?.data?.visuals,
      })
    );
    // return newImageUrls;
  } catch (error) {
    console.log(error);
  } finally {
    dispatch(setGenerateVisualLoader(false));
  }
};

// Edit Visual Prompt
export const postEditGenerateVisualContent =
  (data, onClose) => async (dispatch) => {
    dispatch(setGenerateVisualLoader(true));
    try {
      const response = await api.post(`images/edit-visual`, data);
      toast.success(
        response?.data?.message || "Description updated successfully"
      );
      onClose(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setGenerateVisualLoader(false));
    }
  };

// delete visual prompt
export const deleteGenerateVisualContent =
  (data, onClose) => async (dispatch) => {
    dispatch(setGenerateVisualLoader(true));
    try {
      const response = await api.delete(`images/delete-image`, { data });
      toast.success(response?.data?.message || "Deleted successfully");
      onClose(false);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setGenerateVisualLoader(false));
    }
  };
