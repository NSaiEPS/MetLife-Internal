import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import type { AppDispatch } from "../store";
import { toast } from "react-toastify";
import api from "../../api/axios.ts";
import { apiErrorHandling } from "../../utils/index.ts";

// ---------- Types ----------
export interface DashboardState {
  dashBoardInfo: any[];
  dashboardLoader: boolean;
  usersList: any[];
  selectedFilter: string;
}

// ---------- Initial State ----------
const initialState: DashboardState = {
  dashBoardInfo: [],
  dashboardLoader: false,
  usersList: [],
  selectedFilter: "ALL",
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
    setUsersList(state, action: PayloadAction<any[]>) {
      state.usersList = action.payload;
    },

    setSelectedFilter(state, action: PayloadAction<string>) {
      state.selectedFilter = action.payload;
    },
  },
});

export const { setDashboardInfo, setDashboardLoader, setUsersList,setSelectedFilter  } =
  DashBoardSlice.actions;
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

export const getUsersList = () => async (dispatch: AppDispatch) => {
  dispatch(setDashboardLoader(true));
  try {
    const res = await api.get("users");
    console.log(res, "checkx");

    if (res?.status) {
      dispatch(setUsersList(res?.data));
    } else {
      apiErrorHandling(res);
    }
  } catch (e: any) {
    toast.error(e?.response?.data?.message ?? "Error Try again!!");
  } finally {
    dispatch(setDashboardLoader(false));
  }
};

export const postShareToUser =
  (data, onClose, successCallback) => async (dispatch: AppDispatch) => {
    dispatch(setDashboardLoader(true));
    try {
      const res = await api.post("transfer-script-ownership", data);
      console.log(res, "checkpost");

      // if (res?.status) {
      //   dispatch(setUsersList(res?.data));
      // } else {
      //   apiErrorHandling(res);
      // }

      if (successCallback) {
        successCallback();
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Error Try again!!");
    } finally {
      dispatch(setDashboardLoader(false));
      onClose(true);
    }
  };
