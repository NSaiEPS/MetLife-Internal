import { createSlice,  } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api from "../../api/axios";
import type{ AppDispatch,  } from "../store";
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
}

const initialState: ScriptState = {
  scriptLoader: false,
  scriptData: { scenes: [] },
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
  },
});

export const { setScriptData, setScriptLoader } = ScriptDataSlice.actions;
export default ScriptDataSlice.reducer;

export const postDeleteScene =
  (data: { script_id?: string; scene_id: string | number }, onClose: (v: boolean) => void) =>
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
