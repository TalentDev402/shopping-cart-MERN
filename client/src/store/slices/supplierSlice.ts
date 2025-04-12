import { createSlice } from "@reduxjs/toolkit";
import { ISupplier } from "utils/types";

interface IinitialState {
  suppliers: Array<ISupplier>
}

export const initialState: IinitialState = {
  suppliers: []
};

export const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    setSuppliers: (state, action) => {
      state.suppliers = action.payload;
    },
  },
});

export const {
  setSuppliers
} = supplierSlice.actions;

export default supplierSlice.reducer;
