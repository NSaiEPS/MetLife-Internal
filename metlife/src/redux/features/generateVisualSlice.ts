import { createSlice  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { navigateTo } from "../../utils/navigate";

// ---------- Types ----------
interface VisualContent {
  id?: string;
  prompt?: string;
  visuals?: any[];
  [key: string]: any;
}

interface GenerateVisualContentState {
  generateVisualLoader: boolean;
  generateVisualContentData: VisualContent;
}

// Async callback type
type CallbackFn = (value: boolean) => void;

// ---------- Initial State ----------
const initialState: GenerateVisualContentState = {
  generateVisualLoader: false,
  generateVisualContentData: {},
};

// ---------- Slice ----------
const GenerateVisualContentSlice = createSlice({
  name: "generate_visual_content",
  initialState,
  reducers: {
    setGenerateVisualLoader(state, action: PayloadAction<boolean>) {
      state.generateVisualLoader = action.payload;
    },
    setGenerateVisualContentData(state, action: PayloadAction<VisualContent>) {
      state.generateVisualContentData = action.payload;
    },
    updateGenerateVisual(state, action: PayloadAction<{ visuals?: any[] }>) {
      const actualVisualData = { ...state.generateVisualContentData };
      actualVisualData.visuals = action.payload.visuals;
      state.generateVisualContentData = actualVisualData;
    },
    // Optionally, you can implement removeDeletedImage if needed
    // removeDeletedImage(state, action: PayloadAction<{ id: string }>) {}
  },
});

export const {
  setGenerateVisualLoader,
  setGenerateVisualContentData,
  updateGenerateVisual,
  // removeDeletedImage,
} = GenerateVisualContentSlice.actions;

export default GenerateVisualContentSlice.reducer;

// ---------- Async Thunks ----------
export const postGenerateVisualContentImage =
  (data: any) => async (dispatch: any) => {
    dispatch(setGenerateVisualLoader(true));
    try {
      const response = await api.post("images/generate-visuals", data);
      if (response?.status) {
        dispatch(setGenerateVisualContentData(response?.data?.visuals));
        navigateTo(`/generate-visual-page/${response?.data?.script_id}`);
        toast.success("Visual Image generated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      dispatch(setGenerateVisualLoader(false));
    }
  };

export const getGenerateVisualContentImage = (id: any) => async (dispatch: any) => {
  dispatch(setGenerateVisualLoader(true));
  try {
    const response = await api.get(`images/${id}`);
    if (response?.status) {
      dispatch(setGenerateVisualContentData(response?.data));
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setGenerateVisualLoader(false));
  }
};

export const postImageUpload =
  (data: any, onClose: CallbackFn) => async (dispatch: any) => {
    dispatch(setGenerateVisualLoader(true));
    try {
      const response = await api.post("images/upload-media", data);
      toast.success(
        response?.data?.message ?? "Image uploaded & scene updated successfully"
      );
      dispatch(updateGenerateVisual({ visuals: response?.data?.visuals }));
      onClose(false);
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setGenerateVisualLoader(false));
    }
  };

export const postEditGenerateVisualContent =
  (data: any, onClose: CallbackFn) => async (dispatch: any) => {
    dispatch(setGenerateVisualLoader(true));
    try {
      const response = await api.post("images/edit-visual", data);
      toast.success(response?.data?.message || "Description updated successfully");
      onClose(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setGenerateVisualLoader(false));
    }
  };

export const deleteGenerateVisualContent =
  (data: any, onClose: CallbackFn) => async (dispatch: any) => {
    dispatch(setGenerateVisualLoader(true));
    try {
      const response = await api.delete("images/delete-image", { data });
      toast.success(response?.data?.message || "Deleted successfully");
      onClose(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setGenerateVisualLoader(false));
    }
  };

export const postRegenerateImage =
  (data: any, onCloseTempData: CallbackFn) => async (dispatch: any) => {
    dispatch(setGenerateVisualLoader(true));
    try {
      const response = await api.post("images/regenerate-visual", data);
      toast.success(response?.data?.message || "Prompt regenerated successfully");
      dispatch(updateGenerateVisual({ visuals: response?.data?.visuals }));
      onCloseTempData(false);
    } catch (error) {
      console.error(error);
      onCloseTempData(true);
    } finally {
      dispatch(setGenerateVisualLoader(false));
    }
  };
