import { createSlice } from "@reduxjs/toolkit";

interface IinitialState {
  currency: any;
  companyInfo: any;
  theme: number;
  productDisplay: any;
  pages: any;
}

export const initialState: IinitialState = {
  currency: null,
  companyInfo: null,
  productDisplay: null,
  theme: 0,
  pages: null
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSetting: (state, action) => {
      const { currency, theme, companyInfo, productDisplay, pages } = action.payload;
      state.currency = currency;
      state.theme = theme;
      state.companyInfo = companyInfo;
      state.productDisplay = productDisplay;
      state.pages = pages;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setCompanyInfo: (state, action) => {
      state.companyInfo = action.payload;
    },
    setProductDisplay: (state, action) => {
      state.productDisplay = action.payload;
    },
    setPages: (state, action) => {
      state.pages = action.payload;
    }
  },
});

export const { setSetting, setCurrency, setCompanyInfo, setProductDisplay, setPages } = settingSlice.actions;

export default settingSlice.reducer;
