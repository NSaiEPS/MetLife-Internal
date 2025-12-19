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

interface ScriptState {
  scriptLoader: boolean;
  scriptData: ScriptData;
  characterData: CharacterData[];
  promptData: PromptData[];
}

const initialState: ScriptState = {
  scriptLoader: false,
  scriptData: { scenes: [] },
  characterData: [],
  promptData: [],
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
        (item) => item.scene_id !== action.payload.scene_id
      );

      state.scriptData = {
        ...state.scriptData,
        scenes: filteredScenes,
      };
    },

    setPromptData(state, action: PayloadAction<PromptData[]>) {
      state.promptData = action.payload;
    },

    setCharacterData(state, action: PayloadAction<CharacterData[]>) {
      state.characterData = action.payload;
    },
  },
});

export const {
  setScriptData,
  setScriptLoader,
  setCharacterData,
  setPromptData,
} = ScriptDataSlice.actions;
export default ScriptDataSlice.reducer;

export const postDeleteScene =
  (
    data: { script_id?: string; scene_id: string | number },
    onClose: (v: boolean) => void
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(setScriptLoader(true));

    try {
      const res = await api.post("mongo/delete_scene", data);

      onClose(false);

      dispatch(
        setScriptData({
          scene_id: data.scene_id,
        })
      );
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
      const res = await api.post(
        `characters/generate-images?script_id=${id}`);
      // console.log(res, "check_character_res");
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
      const res = await api.get(`characters/images?script_id=${id}`);
      // console.log(res, "get_check_character_res");
      if (res.status) {
        dispatch(setCharacterData(res?.data?.characters));
      }
    } catch (error: any) {
      console.error(error);
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
      console.log(res, "check_setup_characters");
      if (res.status) {
        dispatch(setPromptData(res?.data?.prompts));
        // dispatch(getExtractCharacters(id));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setScriptLoader(false));
    }
  };

// Edit Prompt character s
export const patchEditPromp =
  (id: string, name: string, new_prompt: string) =>
  async (dispatch: AppDispatch) => {
    dispatch(setScriptLoader(true));
    try {
      const res = await api.patch(
        `characters/edit-prompt?script_id=${id}&character_name=${name}`,
        {new_prompt}
      );
      console.log(res, "check_edit_characters");
      if (res.status) {
        dispatch(setPromptData(res?.data?.prompts));
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setScriptLoader(false));
    }
  };
