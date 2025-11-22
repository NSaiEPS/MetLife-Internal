import { toast } from "react-toastify";
import api from "../../api/axios";
// import reducer from "./saveSlice";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scriptLoader: false,
  scriptData: [],
};

const ScriptDataSlice = createSlice({
  name: "script",
  initialState,
  reducers: {
    setScriptLoader(state, action) {
      state.scriptLoader = action.payload;
    },
    setScriptData(state, action) {
      // state.scriptData = action.payload;
      let actualData = [...state.scriptData?.scenes]?.filter(
        (item) => item.scene_id !== action.payload?.scene_id
      );
      let filteredData = { ...state.scriptData };
      filteredData.scenes = actualData;
      state.scriptData = filteredData;
    },
  },
});

export const { setScriptData, setScriptLoader } = ScriptDataSlice.actions;

export default ScriptDataSlice.reducer;

export const postDeleteScene = (data, onClose) => async (dispatch) => {
  dispatch(setScriptLoader(true));
  try {
    const res = await api.post("mongo/delete_scene", data);
    onClose(false);
    dispatch(
      setScriptData({
        scene_id: data?.scene_id,
      })
    );
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong!");
  } finally {
    dispatch(setScriptLoader(false));
  }
};


// save data

