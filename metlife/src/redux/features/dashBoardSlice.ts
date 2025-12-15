import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AppDispatch,} from "../store";
import { toast } from "react-toastify";
import api from "../../api/axios.ts";
import { apiErrorHandling } from "../../utils/index.ts";

// ---------- Types ----------
export interface DashboardState {
  dashBoardInfo: any[];
  dashboardLoader: boolean;
}

// ---------- Initial State ----------
const initialState: DashboardState = {
  dashBoardInfo: [],
  dashboardLoader: false,
};

// ---------- Slice ----------
const DashBoardSlice = createSlice({
  name: "dashBoard",
  initialState,
  reducers: {
    setDashboardInfo(state, action: PayloadAction<any[]>) {
      state.dashBoardInfo = action.payload;
    },
    setDashboardLoader(state, action: PayloadAction<boolean>) {
      state.dashboardLoader = action.payload;
    },
  },
});

export const { setDashboardInfo, setDashboardLoader } = DashBoardSlice.actions;
export default DashBoardSlice.reducer;

// ---------- Async Thunk ----------
export const getDashboardInfo = () => async (dispatch: AppDispatch) => {
  dispatch(setDashboardLoader(true));

  try {
    const res = await api.get("scripts");

    if (res?.status) {
      dispatch(setDashboardInfo(res?.data));
    } else {
      apiErrorHandling(res);
    }
  } catch (e: any) {
    toast.error(e?.response?.data?.message ?? "Error Try again!!");
  } finally {
    dispatch(setDashboardLoader(false));
  }
};
