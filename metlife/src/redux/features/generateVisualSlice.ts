import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { navigateTo } from "../../utils/navigate";
import type {
  SceneDataType,
  SceneType,
  VisualContentType,
} from "../../utils/types";

// ---------- Types ----------

interface GenerateVisualContentState {
  generateVisualLoader: boolean;
  generateVisualContentData: VisualContentType;
  scenesData: SceneDataType;
}

// interface GenerateVisualContentState {
//   generateVisualLoader: boolean;
//   generateVisualContentData: VisualContentType;
// }

// Async callback type
type CallbackFn = (value: boolean) => void;

// ---------- Initial State ----------
const initialState: GenerateVisualContentState = {
  generateVisualLoader: false,
  generateVisualContentData: {},
  scenesData: {
    scene_id: "",
    scene_number: 0,
    upload_url: "",
    title: "",
    scenes: [],
  },
};

// ---------- Slice ----------
const GenerateVisualContentSlice = createSlice({
  name: "generate_visual_content",
  initialState,
  reducers: {
    setGenerateVisualLoader(state, action: PayloadAction<boolean>) {
      state.generateVisualLoader = action.payload;
    },
    setGenerateVisualContentData(
      state,
      action: PayloadAction<VisualContentType>
    ) {
      state.generateVisualContentData = action.payload;
    },
    updateGenerateVisual(state, action: PayloadAction<{ visuals?: any[] }>) {
      const actualVisualData = { ...state.generateVisualContentData };
      actualVisualData.visuals = action.payload.visuals;
      state.generateVisualContentData = actualVisualData;
    },

    setScenesData(state, action: PayloadAction<SceneDataType>) {
      state.scenesData = action.payload;
    },
  },
});

export const {
  setGenerateVisualLoader,
  setGenerateVisualContentData,
  updateGenerateVisual,
  // removeDeletedImage,
  setScenesData,
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

export const getGenerateVisualContentImage =
  (id: any) => async (dispatch: any) => {
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
  (data: any, onClose: CallbackFn, id: string) => async (dispatch: any) => {
    dispatch(setGenerateVisualLoader(true));
    try {
      const response = await api.post("images/edit-visual", data);
      toast.success(
        response?.data?.message || "Description updated successfully"
      );
      onClose(false);
      dispatch(getGenerateVisualContentImage(id));
    } catch (error: any) {
      // console.error(error);
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
      // console.error(error);
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
      toast.success(
        response?.data?.message || "Prompt regenerated successfully"
      );
      dispatch(updateGenerateVisual({ visuals: response?.data?.visuals }));
      onCloseTempData(false);
    } catch (error) {
      // console.error(error);
      onCloseTempData(true);
    } finally {
      dispatch(setGenerateVisualLoader(false));
    }
  };

export const getDownloadAsset =
  (id: any, title: string) => async (dispatch: any) => {
    dispatch(setGenerateVisualLoader(true));
    try {
      const response = await api.get(`download/${id}`, {
        responseType: "blob",
      });

      let fileName = title;

      // Try multiple header patterns
      const disposition = response.headers["content-disposition"];

      if (disposition) {
        const fileNameMatch = disposition.match(/filename="(.+?)"/);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }

        // filename=abc.zip
        const simpleFileName = disposition.match(/filename=(.+)/);
        if (!fileNameMatch && simpleFileName) {
          fileName = simpleFileName[1];
        }

        // RFC 5987 format → filename*=UTF-8''abc.zip
        const utfMatch = disposition.match(/filename\*\=UTF-8''(.+)/);
        if (utfMatch) {
          fileName = decodeURIComponent(utfMatch[1]);
        }
      }

      const blobUrl = window.URL.createObjectURL(response.data);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = title;
      a.click();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      dispatch(setGenerateVisualLoader(false));
    }
  };

export const getClipsData = (id: string) => async (dispatch: any) => {
  dispatch(setGenerateVisualLoader(true));
  try {
    const response = await api.get(
      `upload-clip/get-script-scenes?script_id=${id}`
    );
    // console.log(response, "response__check");
    // dispatch(setScenesData(response?.data?.scenes));
    dispatch(setScenesData(response?.data));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setGenerateVisualLoader(false));
  }
};
