// import api from '@/app/api/axios';

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "react-toastify";
import api from "../../api/axios";
import { apiErrorHandling } from "../../utils";

const initialState = {
  dashBoardInfo: [],
  dashboardLoader: false,
};

const DashBoardSlice = createSlice({
  name: "dashBoard",
  initialState,
  reducers: {
    setDashboardInfo(state, action) {
      state.dashBoardInfo = action.payload;
    },
    setDashboardLoader(state, action) {
      state.dashboardLoader = action.payload;
    },
  },
});

export const { setDashboardInfo, setDashboardLoader } = DashBoardSlice.actions;

export default DashBoardSlice.reducer;

export const getDashboardInfo = () => async (dispatch) => {
  dispatch(setDashboardLoader(true));

  try {
    const res = await api.get("scripts");

    if (res?.status) {
      dispatch(setDashboardInfo(res?.data));
      console.log(res);
    } else {
      apiErrorHandling(res);
    }
  } catch (e) {
    toast.error(e?.response?.data?.message ?? "Error Try again!!");
  } finally {
    dispatch(setDashboardLoader(false));
  }
};
