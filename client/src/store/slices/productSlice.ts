import { createSlice } from "@reduxjs/toolkit";
import { IProduct, ITag } from "utils/types";

interface IinitialState {
  products: Array<IProduct>;
  tags: Array<ITag>;
  categoryList: Array<any>;
}

export const initialState: IinitialState = {
  products: [],
  tags: [],
  categoryList: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    setCategoryList: (state, action) => {
      state.categoryList = action.payload;
    },
  },
});

export const { setProducts, setTags, setCategoryList } = productSlice.actions;

export default productSlice.reducer;
