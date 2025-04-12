import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "utils/types";

interface IinitialState {
  users: Array<IUser>
}

export const initialState: IinitialState = {
  users: []
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const {
  setUsers
} = userSlice.actions;

export default userSlice.reducer;
