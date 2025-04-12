import { createSlice } from "@reduxjs/toolkit";
import { ICustomer } from "utils/types";

interface IinitialState {
  customers: Array<ICustomer>
}

export const initialState: IinitialState = {
  customers: []
};

export const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
  },
});

export const {
  setCustomers
} = customerSlice.actions;

export default customerSlice.reducer;
