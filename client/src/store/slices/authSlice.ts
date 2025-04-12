import { createSlice } from "@reduxjs/toolkit";
import { ObjectEncodingOptions } from "fs";
import { ADMIN_AUTH_TOKEN, CUSTOMER_AUTH_TOKEN } from "utils/constants";

interface ICurrentUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  role: string;
  points: number;
  avatar: string | null | undefined;
  address: string;
}

interface IinitialState {
  loading: boolean;
  message: string;
  showMessage: boolean;
  token: string | null;
  currentUser: ICurrentUser | null;
}

export const initialState: IinitialState = {
  loading: false,
  message: "",
  showMessage: false,
  token: window.location.pathname.includes("/admin") ? localStorage.getItem(ADMIN_AUTH_TOKEN) : localStorage.getItem(CUSTOMER_AUTH_TOKEN) || null,
  currentUser: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    showAuthMessage: (state, action) => {
      state.message = action.payload;
      state.showMessage = true;
      state.loading = false;
    },
    hideAuthMessage: (state) => {
      state.message = "";
      state.showMessage = false;
    },
    signOutSuccess: (state) => {
      state.loading = false;
      state.token = null;
      state.currentUser = null;
      if (window.location.pathname.includes("/admin")) {
        localStorage.removeItem(ADMIN_AUTH_TOKEN);
      } else {
        localStorage.removeItem(CUSTOMER_AUTH_TOKEN);
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    signInSuccess: (state, action) => {
      state.token = action.payload;
      if (window.location.pathname.includes("/admin")) {
        localStorage.setItem(ADMIN_AUTH_TOKEN, action.payload);
      } else {
        localStorage.setItem(CUSTOMER_AUTH_TOKEN, action.payload);
      }
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const {
  showAuthMessage,
  hideAuthMessage,
  signOutSuccess,
  setLoading,
  signInSuccess,
  setCurrentUser,
} = authSlice.actions;

export default authSlice.reducer;
