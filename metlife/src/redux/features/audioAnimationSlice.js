import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { toast } from "react-toastify";

const initialState = {
  audioAnimationLoader: false,
  audioAnimationData: null,
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
  },
});

export const { setAudioAnimationData, setAudioAnimationLoader } =
  AudioAnimationSlice.actions;

export default AudioAnimationSlice.reducer;

// generate 
export const postAudioAnimationData = (data) => async (dispatch) => {
    dispatch(setAudioAnimationLoader(false));
    try {
        const res = await api.post(`audio/extract-characters`, data);
        console.log(res, 'audioResCheck')
        if(res.status) {
            dispatch(setAudioAnimationData(res?.data))
            // toast.success("Audio generated successfully");
        }
    } catch (error) {
        console.log(error)
        // toast.error("Something went wrong!");
    } finally {
        dispatch(setAudioAnimationLoader(false));
    }
}
