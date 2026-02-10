import { createSlice,  } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { AppDispatch,  } from "../store"; // adjust path according to your project
import { navigateTo } from "../../utils/navigate";


export interface VisualPrompt {
  scene_id: string | number;
  prompt?: string;
  prompt_id?: string | number;
  visual_type?: string;
  clip_visual_type?: string;
  clip_prompt?: string;
}

export interface VisualContentState {
  saveVisualContentLoader: boolean;
  saveVisualContentData: {
    prompts: VisualPrompt[];
    prompt_batch_id?: string | number;
    [key: string]: any;
  } | null;
}

export interface UpdatePromptPayload {
  scene_id: string | number;
  new_prompt?: string;
  prompt_id?: string | number;
  visual_type?: string;
  clip_visual_type?: string;
  clip_prompt?: string;
}

// =====================
// 📌 INITIAL STATE
// =====================

const initialState: VisualContentState = {
  saveVisualContentLoader: false,
  saveVisualContentData: null,
};

// =====================
// 📌 SLICE
// =====================

const CreateVisualContentPageSlice = createSlice({
  name: "visual_content_data",
  initialState,
  reducers: {
    setSaveVisualContentLoader(state, action: PayloadAction<boolean>) {
      state.saveVisualContentLoader = action.payload;
    },

    setSaveVisualContentData(state, action: PayloadAction<any>) {
      state.saveVisualContentData = action.payload;
    },

    updateVisualPromt(state, action: PayloadAction<UpdatePromptPayload>) {
      if (!state.saveVisualContentData) return;

      const updatedPrompts = state.saveVisualContentData.prompts.map((item) => {
        const updated = { ...item };
        if (item.scene_id == action.payload.scene_id) {
          if (action.payload.new_prompt) updated.prompt = action.payload.new_prompt;
          if (action.payload.prompt_id) updated.prompt_id = action.payload.prompt_id;
          if (action.payload.visual_type) updated.visual_type = action.payload.visual_type;
          if (action.payload.clip_visual_type)
            updated.clip_visual_type = action.payload.clip_visual_type;

          if (action.payload.clip_prompt !== undefined) {
            updated.clip_prompt = action.payload.clip_prompt ?? updated.clip_prompt ?? "";
          }
        }
        return updated;
      });

      state.saveVisualContentData = {
        ...state.saveVisualContentData,
        prompts: updatedPrompts,
      };
    },
  },
});

// =====================
// 📌 ACTION EXPORTS
// =====================

export const {
  setSaveVisualContentData,
  setSaveVisualContentLoader,
  updateVisualPromt,
} = CreateVisualContentPageSlice.actions;

export default CreateVisualContentPageSlice.reducer;
export const postCreateVisualContent =
  (data: any, setOpenFlowDialog:any) => async (dispatch: AppDispatch) => {
    dispatch(setSaveVisualContentLoader(true));
    try {
      const response = await api.post("prompt/generate", data);
      if (response?.status) {
        dispatch(setSaveVisualContentData(response.data));
        if(setOpenFlowDialog) {
          setOpenFlowDialog(false);
        }
        navigateTo(`/create-visual-content/${response.data?.prompt_batch_id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setSaveVisualContentLoader(false));
    }
  };

// VIEW
export const getVisualContent =
  (id: string | number) => async (dispatch: AppDispatch) => {
    dispatch(setSaveVisualContentLoader(true));
    try {
      const response = await api.get(`prompt/get/${id}`);
      if (response?.status) {
        dispatch(setSaveVisualContentData(response.data));
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setSaveVisualContentLoader(false));
    }
  };

// EDIT PROMPT
export const postEditVisualContent =
  (data: any, onClose: (value: boolean) => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(setSaveVisualContentLoader(true));
    try {
      const response = await api.post("prompt/edit", data);
      toast.success(response?.data?.message || "Prompt updated successfully");
      onClose(false);
    } catch (error: any) {
      // console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setSaveVisualContentLoader(false));
    }
  };

// REGENERATE PROMPT
export const postRegenerateVisualContent =
  (data: any, onCloseTempData: (v: boolean) => void) =>
  async (dispatch: AppDispatch) => {
    dispatch(setSaveVisualContentLoader(true));
    try {
      const response = await api.post("prompt/regenerate", data);
      toast.success(
        response?.data?.message || "Prompt regenerated successfully"
      );

      onCloseTempData(false);

      dispatch(
        updateVisualPromt({
          new_prompt: response.data?.new_prompt,
          prompt_id: response.data?.new_prompt_id,
          scene_id: response.data?.scene_id,
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setSaveVisualContentLoader(false));
      onCloseTempData(true);
    }
  };

// CLIP REGENERATE
export const postVisualTypeUpdate =
  (data: any) => async (dispatch: AppDispatch) => {
    dispatch(setSaveVisualContentLoader(true));
    try {
      const response = await api.post("prompt/clip/generate", data);
      toast.success(response?.data?.message || "Clip generated successfully");

      const { prompt } = response.data;

      dispatch(
        updateVisualPromt({
          new_prompt: prompt?.prompt,
          prompt_id: prompt?.prompt_id,
          scene_id: prompt?.scene_id,
          visual_type: prompt?.visual_type,
          clip_visual_type: prompt?.clip_visual_type,
          clip_prompt: prompt?.clip_prompt,
        })
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(setSaveVisualContentLoader(false));
    }
  };
