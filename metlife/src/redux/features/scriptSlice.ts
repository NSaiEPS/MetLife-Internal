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

interface ScriptState {
  scriptLoader: boolean;
  scriptData: ScriptData;
  characterData: CharacterData[];
  promptData: PromptData[];
  uploadVideoData: UploadVideoData;
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
  (
    data: {
      script_id?: string;
      scene_id: string | number;
      version?: number;
      update_description: string;
      update_on_screen_text: string;
    },
    setOpenDeletePopup: (v: boolean) => void,
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setScriptLoader(true));
    try {
      const res = await api.post("mongo/edit", data);

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
  (scriptId: string, payload: FormData, callback?: () => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(setUploadVideoLoader(true));

    try {
      const res = await api.post(
        `videos/upload?script_id=${scriptId}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (res?.status) {
        dispatch(setUploadVideoInfo(res?.data?.videos || []));

        if (callback) {
          callback();
        }
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Video upload failed!");
    } finally {
      dispatch(setUploadVideoLoader(false));
    }
  };
