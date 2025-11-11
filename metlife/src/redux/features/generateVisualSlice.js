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
    updateGenerateVisual(state, action) {
      console.log(state.generateVisualContentData, "state_checkl");
      let actualData = [...state.generateVisualContentData.visuals]?.map(
        (item) => {
          console.log(item, action?.payload, "state_checkl");

          let data = { ...item };
          if (item?.scene_id == action?.payload?.scene_id) {
            data.image_uploaded_url = action.payload?.new_image;
          }
          return data;
        }
      );

      let actualVisualGenerateData = { ...state.generateVisualContentData };
      actualVisualGenerateData.visuals = actualData;
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

    const newImageUrl =
      response?.data?.visuals?.[sceneNumber - 1]?.image_uploaded_url;

    const sceneId = response?.data?.visuals?.[sceneNumber - 1]?.scene_id;
    console.log(response, "check_image_upload_response");
    // dispatch(
    //   updateGenerateVisual({
    //     scene_id: response?.data?.visuals?.[data?.scene_number - 1]?.scene_id,
    //     new_image:
    //       response?.data?.visuals?.[data?.scene_number - 1]?.image_uploaded_url,
    //   })
    // );
    dispatch(
      updateGenerateVisual({
        scene_id: sceneId,
        new_image: newImageUrl,
      })
    );
  } catch (error) {
    console.log(error);
  } finally {
    dispatch(setGenerateVisualLoader(false));
  }
};
