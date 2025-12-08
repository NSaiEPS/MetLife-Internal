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

interface ScriptState {
  scriptLoader: boolean;
  scriptData: ScriptData;
  characterData: CharacterData[] | null;
}

const initialState: ScriptState = {
  scriptLoader: false,
  scriptData: { scenes: [] },
  characterData: null,
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

    setCharacterData(state, action: PayloadAction<CharacterData[]>) {
      state.characterData = action.payload;
    },
  },
});

export const { setScriptData, setScriptLoader, setCharacterData } =
  ScriptDataSlice.actions;
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

export const postExtractCharacters = (id: any) => async (dispatch) => {
  dispatch(setScriptLoader(true));
  try {
    const res = await api.post(`characters/generate-images?script_id=${id}`);
    console.log(res, "check_character_res");
    dispatch(setCharacterData(res?.data?.characters));
    dispatch(getExtractCharacters(id));
  } catch (error: any) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Something went wrong!");
  } finally {
    dispatch(setScriptLoader(false));
  }
};


export const getExtractCharacters = (id: any) => async (dispatch) => {
  dispatch(setScriptLoader(true));
  try {
    const res = await api.get(`characters/images/${id}`);
    console.log(res, "get_check_character_res");
    dispatch(setCharacterData(res?.data?.characters));
    // dispatch(
    //   setScriptData({
    //     scene_id: data.scene_id,
    //   })
    // );
  } catch (error: any) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Something went wrong!");
  } finally {
    dispatch(setScriptLoader(false));
  }
};
