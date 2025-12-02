import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { navigateTo } from "../../utils/navigate";

const initialState = {
  audioAnimationLoader: false,
  audioAnimationData: null,
  audioPreviewData: null,
  labels: null,
  animationLabels: null,
  videoAnimationData: null,
  generatedVideoData: null,
};

const AudioAnimationSlice = createSlice({
  name: "audio_animation_toolkit",
  initialState,
  reducers: {
    setAudioAnimationLoader(state, action) {
      state.audioAnimationLoader = action.payload;
    },
    setAudioAnimationData(state, action) {
      state.audioAnimationData = action.payload;
    },
    setAudioPreviewData(state, action) {
      state.audioPreviewData = action.payload;
    },
    setLabels(state, action) {
      state.labels = action.payload;
    },

    setAnimationLabels(state, action) {
      state.animationLabels = action.payload;
    },
    setVideoAnimationData(state, action) {
      state.videoAnimationData = action.payload;
    },
    setGeneratedVideoData(state, action) {
      state.generatedVideoData = action.payload;
    },
  },
});

export const {
  setAudioAnimationData,
  setAudioAnimationLoader,
  setAudioPreviewData,
  setLabels,
  setAnimationLabels,
  setVideoAnimationData,
  setGeneratedVideoData,
} = AudioAnimationSlice.actions;

export default AudioAnimationSlice.reducer;

// Post extract characters
export const postAudioAnimationData = (data) => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.post(`extract-characters`, data);
    // console.log(res, "audioResCheck");
    if (res.status) {
      dispatch(setAudioAnimationData(res?.data));
      navigateTo(`/audio-animation-toolkit/${res?.data?.script_id}`);
      // toast.success("Audio generated successfully");
    }
  } catch (error) {
    console.log(error);
    // toast.error("Something went wrong!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

// Post Generate Voice and Audio
export const postGenerateVoiceAndAudio = (data) => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.post(`audio/generate-voice-and-audio`, data);
    console.log(res, "audioResCheck");
    if (res.status) {
      dispatch(setAudioAnimationData(res?.data));
      toast.success("Audio generated successfully");
    }
  } catch (error) {
    console.log(error);
    // toast.error("Something went wrong!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

// Get Audio Details
export const getAudioDetails = (id) => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.get(`audio/audio/${id}`);
    console.log(res, "getres");
    if (res.status) {
      dispatch(setAudioAnimationData(res?.data?.data));
      // toast.success("Audio generated successfully");
    }
  } catch (error) {
    console.log(error);
    // toast.error("Something went wrong!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

// Get Preview voices
export const getPreviewVoices = () => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.get(`audio/preview-voices`);
    // console.log(res, "check_preview");
    if (res.status) {
      dispatch(setAudioPreviewData(res?.data));
      // toast.success("Audio generated successfully");
    }
  } catch (error) {
    console.log(error);
    // toast.error("Something went wrong!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

// Get labels
export const getLabels = (id) => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.get(`characters/${id}`);
    // console.log(res?.data?.characters, "check_labels");
    if (res.status) {
      dispatch(setLabels(res?.data?.characters));
      // toast.success("Audio generated successfully");
    }
  } catch (error) {
    console.log(error);
    // toast.error("Something went wrong!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

// Get Media Tranistion options for animation
export const getMediaTransitions = () => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.get(`media/transitions`);
    if (res.status) {
      dispatch(setAnimationLabels(res?.data));
    }
  } catch (error) {
    console.log(error);
    // toast.error("Something went wrong!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

// Post Generate Video
export const postGenerateVideoBatch = (data) => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.post(`media/generate-video-batch`, data);
    console.log(res, "audioResCheck");
    if (res.status) {
      dispatch(setVideoAnimationData(res?.data?.results));
      // dispatch(getVideosList(data.script_id));
      // toast.success("Video generated successfully");
    }
  } catch (error) {
    console.log(error);
    // toast.error("Something went wrong!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

// Get Video data
export const getVideosList = (id) => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.get(`media/${id}`);
    console.log(res, "videoResCheck");
    if (res.status) {
      dispatch(setVideoAnimationData(res?.data?.results));
      dispatch(setGeneratedVideoData(res?.data?.final_video));

      // toast.success("Video generated successfully");
    }
  } catch (error) {
    console.log(error);
    // toast.error( "Something went wrong!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

// Post Generate full video
export const postGenerateFullVideo = (id) => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.post(`media/generate-video-full/${id}`);
    console.log(res, "videoResponseCheck");
    if (res.status) {
      dispatch(setGeneratedVideoData(res?.data?.full_video));
      // toast.success("Video generated successfully");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong!");
  } finally {
    dispatch(setAudioAnimationLoader(false));
  }
};

// Get Generate full video
// export const getGeneratedFullVideo = (id) => async (dispatch) => {
//   dispatch(setAudioAnimationLoader(true));
//   try {
//     const res = await api.get(`media/generate-video-full/${id}`);
//     console.log(res, "videoResponseCheck");
//     if (res.status) {
//       dispatch(setGeneratedVideoData(res?.data?.full_video));
//       // toast.success("Video generated successfully");
//     }
//   } catch (error) {
//     console.log(error);
//     toast.error("Something went wrong!");
//   } finally {
//     dispatch(setAudioAnimationLoader(false));
//   }
// };
