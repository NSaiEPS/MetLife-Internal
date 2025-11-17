import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { navigateTo } from "../../utils/navigate";

const initialState = {
  audioAnimationLoader: false,
  audioAnimationData: null,
  audioPreviewData: null,
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
  },
});

export const {
  setAudioAnimationData,
  setAudioAnimationLoader,
  setAudioPreviewData,
} = AudioAnimationSlice.actions;

export default AudioAnimationSlice.reducer;

// Post extract characters
export const postAudioAnimationData = (data) => async (dispatch) => {
  dispatch(setAudioAnimationLoader(true));
  try {
    const res = await api.post(`extract-characters`, data);
    console.log(res, "audioResCheck");
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
