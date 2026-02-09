import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../api/axios";
import type { AppDispatch } from "../store";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Scene {
  scene_id: string | number;
  [key: string]: any;
}

export interface ScriptData {
  scenes: Scene[];
  [key: string]: any;
}

export interface PromptData {
  character_id: string;
  character_name: string;
  prompt: string;
}

export interface CharacterData {
  character_name: string;
  role: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface UploadVideoData {
  uploadVideoLoader: boolean;
  uploadVideoInfo: any[];
}

export interface LocalizationImageData {
  localizationImageLoader: boolean;
  localizationImageUrl: string;
}

interface ScriptState {
  scriptLoader: boolean;
  scriptData: ScriptData;
  characterData: CharacterData[];
  promptData: PromptData[];
  uploadVideoData: UploadVideoData;
  localizationImageLoader: boolean;
  localizationImageData: any[];
  imageCoordinatesLoader: boolean;
  imageCoordinatesData: {};
}

const initialState: ScriptState = {
  scriptLoader: false,
  scriptData: { scenes: [] },
  characterData: [],
  promptData: [],
  uploadVideoData: {
    uploadVideoLoader: false,
    uploadVideoInfo: [],
  },
  localizationImageLoader: false,
  localizationImageData: [],
  imageCoordinatesLoader: false,
  imageCoordinatesData: {},
};

const ScriptDataSlice = createSlice({
  name: "script",
  initialState,
  reducers: {
    setScriptLoader(state, action: PayloadAction<boolean>) {
      state.scriptLoader = action.payload;
    },

    setScriptData(state, action: PayloadAction<{ scene_id: string | number }>) {
      const filteredScenes = state.scriptData.scenes.filter(
        (item) => item.scene_id !== action.payload.scene_id,
      );

      state.scriptData = {
        ...state.scriptData,
        scenes: filteredScenes,
      };
    },

    setPromptData(state, action: PayloadAction<PromptData[]>) {
      state.promptData = action.payload;
    },

    updateCharacterPrompt(
      state,
      action: PayloadAction<{
        character_id: string;
        prompt: string;
      }>,
    ) {
      const item = state.promptData.find(
        (p) => p.character_id === action.payload.character_id,
      );

      if (item) {
        item.prompt = action.payload.prompt;
      }
    },
    setCharacterData(state, action: PayloadAction<CharacterData[]>) {
      state.characterData = action.payload;
    },
    setUploadVideoLoader(state, action: PayloadAction<boolean>) {
      state.uploadVideoData.uploadVideoLoader = action.payload;
    },

    setUploadVideoInfo(state, action: PayloadAction<any[]>) {
      state.uploadVideoData.uploadVideoInfo = action.payload;
    },

    setLocalizationImageLoader(state, action: PayloadAction<boolean>) {
      state.localizationImageLoader = action.payload;
    },

    setLocalizationImageData(state, action: PayloadAction<any[]>) {
      state.localizationImageData = action.payload;
    },

    setImageCoordinatesLoader(state, action: PayloadAction<boolean>) {
      state.imageCoordinatesLoader = action.payload;
    },

    setImageCoordinatesData(state, action: PayloadAction<any[]>) {
      state.imageCoordinatesData = action.payload;
    },
  },
});

export const {
  setScriptData,
  setScriptLoader,
  setCharacterData,
  setPromptData,
  updateCharacterPrompt,
  setUploadVideoInfo,
  setUploadVideoLoader,
  setLocalizationImageLoader,
  setLocalizationImageData,
  setImageCoordinatesLoader,
  setImageCoordinatesData,
} = ScriptDataSlice.actions;
export default ScriptDataSlice.reducer;

export const postDeleteScene =
  (
    data: { script_id?: string; scene_id: string | number; version?: number },
    setOpenDeletePopup: (v: boolean) => void,
    // successDelete
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setScriptLoader(true));
    try {
      const res = await api.post("mongo/delete_scene", data);
      // console.log(res, "check_delter");
      if (res.status) {
        dispatch(
          setScriptData({
            scene_id: data.scene_id,
          }),
        );
        // successDelete();
      }
    } catch (error: any) {
      // console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setScriptLoader(false));
      setOpenDeletePopup(false);
    }
  };

export const postEditScene =
  (data: FormData, onClose: CallbackFn) => async (dispatch: AppDispatch) => {
    dispatch(setScriptLoader(true));
    try {
      const res = await api.post("mongo/edit", data);
      toast.success(res?.data?.message || "Description updated successfully");
      onClose(false);

      // if (res.status) {
      //   dispatch(
      //     setScriptData({
      //       scene_id: data.scene_id,
      //     }),
      //   );
      // }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setScriptLoader(false));
    }
  };

// generate character images
export const postExtractCharacters =
  (id: string, callback) => async (dispatch: AppDispatch) => {
    dispatch(setScriptLoader(true));
    try {
      const res = await api.post(`characters/generate-images?script_id=${id}`);
      if (res.status) {
        dispatch(setCharacterData(res?.data?.characters));
        if (callback) {
          callback();
        }
        dispatch(getExtractCharacters(id));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setScriptLoader(false));
    }
  };

// get characters
export const getExtractCharacters =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(setScriptLoader(true));
    try {
      const res = await api.get(`characters/images/${id}`);
      // console.log(res, "get_check_character_res");
      if (res.status) {
        dispatch(setCharacterData(res?.data?.characters));
      }
    } catch (error: any) {
      // console.error(error);
      // toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setScriptLoader(false));
    }
  };

//Setup Prompt character s
export const postPromptSetupCharacters =
  (id: string) => async (dispatch: AppDispatch) => {
    dispatch(setScriptLoader(true));
    try {
      const res = await api.post(`characters/setup-prompts?script_id=${id}`);
      if (res.status) {
        dispatch(setPromptData(res?.data?.prompts));
      }
    } catch (error: any) {
      // console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setScriptLoader(false));
    }
  };

// Edit Prompt character s
export const patchEditPromp =
  (id: string, character_id: string, name: string, new_prompt: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setScriptLoader(true));
    try {
      const res = await api.patch(
        `characters/edit-prompt?script_id=${id}&character_name=${name}`,
        { new_prompt },
      );
      if (res.status) {
        // dispatch(setPromptData(res?.data?.prompts));
        dispatch(
          updateCharacterPrompt({
            character_id,
            prompt: new_prompt,
          }),
        );
      }
    } catch (error: any) {
      // console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setScriptLoader(false));
    }
  };

//Upload video
export const postUploadVideo =
  (projectId: string, callback?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(setUploadVideoLoader(true));
    try {
      const res = await api.post(
        `process-vid/localisation/process/${projectId}`,
      );
      console.log(res, "check_res");
      if (res?.status) {
        dispatch(setUploadVideoInfo(res?.data || []));
        toast.success(res?.data?.message || "Processing started successfully");
        if (callback) {
          callback(res?.data);
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Video upload failed!");
    } finally {
      dispatch(setUploadVideoLoader(false));
    }
  };

export const getLocalizationImageUrl =
  (
    projectId: string,
    //  callback?: () => void
    onSuccess?: () => void,
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLocalizationImageLoader(true));
    try {
      const res = await api.get(`process-vid/localisation/${projectId}`);
      console.log(res, "check_final_response");
      if (res?.status) {
        dispatch(setLocalizationImageData(res?.data || []));
        toast.success(res?.data?.message || "Processing started successfully");

        if (onSuccess) {
          onSuccess(res?.data);
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Video upload failed!");
    } finally {
      dispatch(setLocalizationImageLoader(false));
    }
  };

// Post Image coordinates
export const postImageCoordinates =
  (
    projectId: string,
    coordinates: [],
    //  callback?: () => void
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setImageCoordinatesLoader(true));
    try {
      const res = await api.post(`localisation/${projectId}/propagate`, {
        reference_scene_index: 1,
        box: coordinates,
      });
      console.log(res, "image_coordinates");
      if (res?.status) {
        toast.success(res?.data?.message || "Processing started successfully");
        dispatch(setImageCoordinatesData(res?.data || []));
        // if (callback) {
        //   callback();
        // }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Video upload failed!");
    } finally {
      dispatch(setImageCoordinatesLoader(false));
    }
  };
