import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AppDispatch } from "../store";
import { toast } from "react-toastify";
import { apiErrorHandling } from "../../utils";
import api from "../../api/axios";

export interface AuthState {
  userInfo: any[];
  authLoader: boolean;
}

const initialState: AuthState = {
  userInfo: [],
  authLoader: false,
};

const AuthSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginInfo(state, action: PayloadAction<any[]>) {
      state.userInfo = action.payload;
    },
    setAuthLoader(state, action: PayloadAction<boolean>) {
      state.authLoader = action.payload;
    },
  },
});

export const { setLoginInfo, setAuthLoader } = AuthSlice.actions;
export default AuthSlice.reducer;

export const postAuthLogin = (data, permission) => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoader(true));

  try {
    const res = await api.post("login", data);
    console.log(res, 'res__loginn')

    if (res?.status) {
      dispatch(setLoginInfo(res?.data));
      if(permission) {
        permission();
        toast.success("Login Successful")
      }
    } else {
      apiErrorHandling(res);
    }
  } catch (e: any) {
    toast.error(e?.response?.data?.message ?? "Error Try again!!");
  } finally {
    dispatch(setAuthLoader(false));
  }
};
