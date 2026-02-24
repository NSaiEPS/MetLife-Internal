import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { navigateTo } from "../../utils/navigate";
import { convertToISTParts } from "../../utils";
import type { AppDispatch } from "../store";

// ---------- Types ----------

export interface FullVideoGenerationState {
  estimated_seconds: number | null;
}

export interface AudioAnimationState {
  audioAnimationLoader: boolean;
  videoAnimationLoader: boolean;
  mediaAPILoader: boolean;
  audioAnimationData: Record<string, unknown> | null;
  audioPreviewData: Record<string, unknown> | null;
  audioAzurePreviewData: Record<string, unknown> | null;
  labels: Record<string, unknown> | null;
  animationLabels: {
    entry_transitions?: string[];
    exit_transitions?: string[];
  } | null;
  videoAnimationData: any[] | null; // list of scenes
  generatedVideoData: Record<string, unknown> | null;
  fullVideoGeneration: FullVideoGenerationState | null;
  sceneData: {
    scenes?: Array<{
      scene_id?: string;
      alternative_scene_id?: string;
    }>;
    video_exists?: boolean;
    [key: string]: any;
  } | null;
}

interface ApiResponse<T = any> {
  status: boolean;
  data: T;
}

// ---------- Initial State ----------
const initialState: AudioAnimationState = {
  audioAnimationLoader: false,
  videoAnimationLoader: false,
  mediaAPILoader: false,
  audioAnimationData: null,
  audioPreviewData: null,
  audioAzurePreviewData: null,
  labels: null,
  animationLabels: null,
  videoAnimationData: null,
  generatedVideoData: null,
  sceneData: null,
  fullVideoGeneration: null,
};

// ---------- Slice ----------
const AudioAnimationSlice = createSlice({
  name: "audio_animation_toolkit",
  initialState,
  reducers: {
    setAudioAnimationLoader: (state, action: PayloadAction<boolean>) => {
      state.audioAnimationLoader = action.payload;
    },
    setVideoAnimationLoader: (state, action: PayloadAction<boolean>) => {
      state.videoAnimationLoader = action.payload;
    },
    setMediaAPILoader: (state, action: PayloadAction<boolean>) => {
      state.mediaAPILoader = action.payload;
    },

    setAudioAnimationData: (
      state,
      action: PayloadAction<Record<string, unknown> | null>,
    ) => {
      state.audioAnimationData = action.payload;
    },

    setAudioPreviewData: (
      state,
      action: PayloadAction<Record<string, unknown> | null>,
    ) => {
      state.audioPreviewData = action.payload;
    },
    setAzureAudioPreviewData: (
      state,
      action: PayloadAction<Record<string, unknown> | null>,
    ) => {
      state.audioAzurePreviewData = action.payload;
    },

    setLabels: (
      state,
      action: PayloadAction<Record<string, unknown> | null>,
    ) => {
      state.labels = action.payload;
    },
    setAnimationLabels: (
      state,
      action: PayloadAction<Record<string, unknown> | null>,
    ) => {
      state.animationLabels = action.payload as any;
    },
    setVideoAnimationData: (state, action: PayloadAction<any[] | null>) => {
      state.videoAnimationData = action.payload;
    },
    setGeneratedVideoData: (
      state,
      action: PayloadAction<Record<string, unknown> | null>,
    ) => {
      state.generatedVideoData = action.payload;
    },
    setSceneData: (
      state,
      action: PayloadAction<AudioAnimationState["sceneData"]>,
    ) => {
      state.sceneData = action.payload;
    },
    setFullVideoGenerationData: (
      state,
      action: PayloadAction<FullVideoGenerationState | null>,
    ) => {
      state.fullVideoGeneration = action.payload;
    },
  },
});

// Export Actions
export const {
  setAudioAnimationData,
  setAudioAnimationLoader,
  setMediaAPILoader,
  setVideoAnimationLoader,
  setAudioPreviewData,
  setAzureAudioPreviewData,
  setLabels,
  setAnimationLabels,
  setVideoAnimationData,
  setGeneratedVideoData,
  setSceneData,
  setFullVideoGenerationData,
} = AudioAnimationSlice.actions;

export default AudioAnimationSlice.reducer;

// ---------- Async Thunks ----------
export const postAudioAnimationData =
  (data: Record<string, unknown>) => async (dispatch: AppDispatch) => {
    dispatch(setAudioAnimationLoader(true));
    try {
      const res: ApiResponse = await api.post("extract-characters", data);
      if (res.status) {
        dispatch(setAudioAnimationData(res.data));
        navigateTo(`/audio-animation-toolkit/${res.data?.script_id}`);
      }
    } catch (error) {
      toast.error("Something went wrong while extracting characters!");
    } finally {
      dispatch(setAudioAnimationLoader(false));
    }
  };

// Preview azure voices
export const postPreviewAzureVoices =
  (data: Record<string, unknown>) => async (dispatch: AppDispatch) => {
    dispatch(setAudioAnimationLoader(true));
    try {
      const res: ApiResponse = await api.post(
        "audio/preview-azure-voice",
        data,
      );
      if (res.status) {
        dispatch(setAzureAudioPreviewData(res.data));
        toast.success("Preview generated successfully");
      }
    } catch (error) {
      toast.error("Preview generation failed!");
    } finally {
      dispatch(setAudioAnimationLoader(false));
    }
  };

export const postGenerateVoiceAndAudio =
  (data: Record<string, unknown>) => async (dispatch: AppDispatch) => {
    dispatch(setAudioAnimationLoader(true));
    try {
      const res: ApiResponse = await api.post(
        "audio/generate-voice-and-audio",
        data,
      );
      if (res.status) {
        dispatch(setAudioAnimationData(res.data));
        toast.success("Audio generated successfully");
      }
    } catch (error) {
      toast.error("Audio generation failed!");
    } finally {
      dispatch(setAudioAnimationLoader(false));
    }
  };

export const getAudioDetails =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(setAudioAnimationLoader(true));
    try {
      const res: ApiResponse = await api.get(`audio/audio/${id}`);
      if (res.status) {
        dispatch(setAudioAnimationData(res.data?.data));
      }
    } catch (error) {
      toast.error("Failed to fetch audio details!");
    } finally {
      dispatch(setAudioAnimationLoader(false));
    }
  };

export const getPreviewVoices = () => async (dispatch: AppDispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res: ApiResponse = await api.get("audio/preview-voices");
    if (res.status) {
      dispatch(setAudioPreviewData(res.data));
    }
  } catch {
    toast.error("Failed to fetch preview voices!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

export const getLabels = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res: ApiResponse = await api.get(`characters/${id}`);
    if (res.status) {
      dispatch(setLabels(res.data?.characters));
    }
  } catch {
    toast.error("Failed to fetch character labels!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

export const getMediaTransitions = () => async (dispatch: AppDispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res: ApiResponse = await api.get("media/transitions");
    if (res.status) {
      dispatch(setAnimationLabels(res.data));
    }
  } catch {
    toast.error("Failed to fetch media transitions!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

export const postGenerateVideoBatch =
  (data: Record<string, unknown>, successCallBack) =>
  async (dispatch: AppDispatch) => {
    dispatch(setVideoAnimationLoader(true));
    try {
      const res: ApiResponse = await api.post(
        "media/generate-video-batch",
        data,
      );
      if (res.status) {
        dispatch(setVideoAnimationData(res.data));
        const seconds = convertToISTParts(res.data.estimated_completion_at);
        toast.success(
          `Please wait your videos are generating in ${Math.ceil(
            seconds / 60,
          )} mins`,
        );
        if (successCallBack) {
          successCallBack();
        }
      }
    } catch {
      toast.error("Failed to generate video batch!");
    } finally {
      dispatch(setVideoAnimationLoader(false));
    }
  };

export const getVideosList = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setVideoAnimationLoader(true));
  dispatch(setMediaAPILoader(true));
  try {
    const res: ApiResponse = await api.get(`media/${id}`);
    if (res.status) {
      dispatch(setVideoAnimationData(res.data?.results || []));
      dispatch(setGeneratedVideoData(res.data || null));
    }
  } catch {
    toast.error("Failed to fetch videos list!");
  } finally {
    dispatch(setVideoAnimationLoader(false));
    dispatch(setMediaAPILoader(false));
  }
};

// final video
export const postGenerateFullVideo =
  (id: string, backgroundMusic: boolean) => async (dispatch: AppDispatch) => {
    dispatch(setAudioAnimationLoader(true));
    try {
      const res: ApiResponse = await api.post(
        `media/generate-video-full/${id}`, null , 
          {
          params: {
            background_music: backgroundMusic === "on" ? true : false,
          },
        }
      );
      // console.log(res, "final_video_response");

      if (res.status) {
        // let data = {
        //   final_video: res.data?.final_video_with_intro || null,
        //   duration_seconds: res.data?.estimated_seconds || null,
        // };
        dispatch(setGeneratedVideoData(res?.data));
      }
    } catch {
      toast.error("Something went wrong while generating full video!");
    } finally {
      dispatch(setAudioAnimationLoader(false));
    }
  };

export const getSceneDetails =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(setVideoAnimationLoader(true));
    try {
      const res: ApiResponse = await api.get(`scripts/${id}`);
      if (res.status) {
        dispatch(setSceneData(res.data));
      }
    } catch (error: any) {
      toast.error(error?.detail || "Failed to fetch scene details!");
    } finally {
      dispatch(setVideoAnimationLoader(false));
    }
  };

// export const downloadVideoWithUrl =
//   (url: string, title: string) => async (dispatch: any) => {
//     try {
//       const response = await api.get(`download/download-file?file_url=${url}`, {
//         responseType: "blob",
//         headers: {
//           Accept: "application/octet-stream",
//         },
//       });

//       let fileName = title;

//       // // Try multiple header patterns
//       // const disposition = response.headers["content-disposition"];

//       // if (disposition) {
//       //   const fileNameMatch = disposition.match(/filename="(.+?)"/);
//       //   if (fileNameMatch) {
//       //     fileName = fileNameMatch[1];
//       //   }

//       //   // filename=abc.zip
//       //   const simpleFileName = disposition.match(/filename=(.+)/);
//       //   if (!fileNameMatch && simpleFileName) {
//       //     fileName = simpleFileName[1];
//       //   }

//       //   // RFC 5987 format → filename*=UTF-8''abc.zip
//       //   const utfMatch = disposition.match(/filename\*\=UTF-8''(.+)/);
//       //   if (utfMatch) {
//       //     fileName = decodeURIComponent(utfMatch[1]);
//       //   }
//       // }

//       const blobUrl = window.URL.createObjectURL(response.data);

//       const a = document.createElement("a");
//       a.href = blobUrl;
//       a.download = title;
//       a.click();

//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       console.error("Download error:", error);
//     } finally {
//     }
//   };

export const downloadVideoWithUrl =
  (fileUrl: string, title: string ) => async (dispatch: any) => {
    try {
      dispatch(setVideoAnimationLoader(true));

      const response = await api.get(
        `download/download-file?file_url=${encodeURIComponent(fileUrl)}`,
        {
          responseType: "blob",
          headers: {
            Accept: "application/octet-stream", 
          },
        },
      );

      // Read filename from header if provided
      let fileName = title || "video.mp4";

      const disposition = response.headers["content-disposition"];
      if (disposition) {
        const match1 = disposition.match(/filename="(.+?)"/);
        if (match1) fileName = match1[1];

        const match2 = disposition.match(/filename=(.+)/);
        if (!match1 && match2) fileName = match2[1];

        const utf = disposition.match(/filename\*=UTF-8''(.+)/);
        if (utf) fileName = decodeURIComponent(utf[1]);
      }

      // Convert blob
      const blob = new Blob([response.data], { type: "video/mp4" });
      const blobUrl = window.URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName; 
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download_error_video", error);
    } finally {
      dispatch(setVideoAnimationLoader(false));
      // handleCloseMenu();
    }
  };

export const downloadAudioWithUrl =
  (fileUrl: string, title: string) => async (dispatch: any) => {
    try {
      dispatch(setAudioAnimationLoader(true));

      const response = await api.get(
        `download/download-file?file_url=${encodeURIComponent(fileUrl)}`,
        {
          responseType: "blob",
          headers: {
            Accept: "audio/mpeg",
          },
        },
      );

      // Default filename
      let fileName = title || "audio.mp3";

      // Read filename from headers
      const disposition = response.headers["content-disposition"];
      if (disposition) {
        const utf = disposition.match(/filename\*=UTF-8''(.+)/);
        if (utf) fileName = decodeURIComponent(utf[1]);

        const quoted = disposition.match(/filename="(.+?)"/);
        if (!utf && quoted) fileName = quoted[1];

        const plain = disposition.match(/filename=(.+)/);
        if (!utf && !quoted && plain) fileName = plain[1];
      }

      // Create blob (audio)
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const blobUrl = window.URL.createObjectURL(blob);

      // Trigger download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Audio download error:", error);
    } finally {
      dispatch(setAudioAnimationLoader(false));
    }
  };
