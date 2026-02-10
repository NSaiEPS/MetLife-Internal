import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { toast } from "react-toastify";
import api from "../../api/axios";

export interface ConversationalState {
  stitchedVideoUrl: string | null;
  conversationalLoader: boolean;
  uploadSceneClipLoader: Record<string, boolean>;
  uploadSceneClipResponse: {
    scene_id: number;
    url: string;
  } | null;
}

const initialState: ConversationalState = {
  stitchedVideoUrl: null,
  conversationalLoader: false,
  uploadSceneClipLoader: {},
  uploadSceneClipResponse: null,
};

const ConversationalClipsSlice = createSlice({
  name: "conversational",
  initialState,
  reducers: {
    setStitchedVideoUrl(state, action: PayloadAction<string | null>) {
      state.stitchedVideoUrl = action.payload;
    },
    setConversationalLoader(state, action: PayloadAction<boolean>) {
      state.conversationalLoader = action.payload;
    },
    // setUploadSceneClipLoader(state, action: PayloadAction<any>) {
    //   state.uploadSceneClipLoader = action.payload;
    // },

    setUploadSceneClipLoader(
      state,
      action: PayloadAction<{ scene_id: string; loading: boolean }>
    ) {
      state.uploadSceneClipLoader[action.payload.scene_id] =
        action.payload.loading;
    },

    setUploadSceneClipResponse(state, action: PayloadAction<any>) {
      state.uploadSceneClipResponse = action.payload;
    },
  },
});

export const {
  setStitchedVideoUrl,
  setConversationalLoader,
  setUploadSceneClipLoader,
  setUploadSceneClipResponse,
} = ConversationalClipsSlice.actions;
export default ConversationalClipsSlice.reducer;

export const postStitchAllVideos =
  (script_id: string, setOpenConfirm) => async (dispatch: AppDispatch) => {
    dispatch(setConversationalLoader(true));
    try {
      const body = new URLSearchParams();
      body.append("script_id", script_id);
      const result = await api.post("upload-clip/stitch-script-ffmpeg", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (result?.status) {
        dispatch(setStitchedVideoUrl(result?.data?.stitched_video_url));
        toast.success("Video stitching completed successfully!");
      }
    } catch (error) {
      // console.error(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setConversationalLoader(false));
      dispatch(setOpenConfirm(false));
    }
  };

export const uploadSceneClip = (data: any) => async (dispatch: AppDispatch) => {
  // dispatch(setUploadSceneClipLoader(true));
  dispatch(
    setUploadSceneClipLoader({
      scene_id: data.get("scene_id"),
      loading: true,
    })
  );
  try {
    const result = await api.post("upload-clip/upload-scene-clip", data);
    if (result?.status) {
      // dispatch(setUploadSceneClipResponse(result?.data));
      dispatch(
        setUploadSceneClipResponse({
          scene_id: data.get("scene_id"),
          url: result.data.url,
        })
      );

      // toast.success("Video scene uploaded successfully!");
    }
  } catch (error) {
    // console.error(error);
    toast.error("Upload Failed!");
  } finally {
    // dispatch(setUploadSceneClipLoader(false));
    dispatch(
      setUploadSceneClipLoader({
        scene_id: data.get("scene_id"),
        loading: false,
      })
    );
  }
};
