import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { toast } from "react-toastify";
import api from "../../api/axios";

export interface ConversationalState {
  stitchedVideoUrl: string | null;
  conversationalLoader: boolean;
}

const initialState: ConversationalState = {
  stitchedVideoUrl: null,
  conversationalLoader: false,
};

const ConversationalClipsSlice = createSlice({
  name: "conversational",
  initialState,
  reducers: {
    setStitchedVideoUrl(state, action: PayloadAction<any[]>) {
      state.stitchedVideoUrl = action.payload;
    },
    setConversationalLoader(state, action: PayloadAction<boolean>) {
      state.conversationalLoader = action.payload;
    },
  },
});

export const { setStitchedVideoUrl, setConversationalLoader } =
  ConversationalClipsSlice.actions;
export default ConversationalClipsSlice.reducer;

export const postStitchAllVideos =
  (script_id: string, setOpenConfirm) => async (dispatch: AppDispatch) => {
    dispatch(setConversationalLoader(true));
    try {
      const body = new URLSearchParams();
      body.append("script_id", script_id);
      const result = await api.post(
        "/upload-clip/stitch-script-ffmpeg",
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (result?.status) {
        dispatch(setStitchedVideoUrl(result?.data?.stitched_video_url));
        toast.success("Video stitching completed successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      dispatch(setConversationalLoader(false));
      dispatch(setOpenConfirm(false));
    }
  };
