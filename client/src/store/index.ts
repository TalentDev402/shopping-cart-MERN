import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "store/slices/authSlice";
import themeReducer from "store/slices/themeSlice";
import userReducer from "store/slices/userSlice";
import supplerReducer from "store/slices/supplierSlice";
import productReducer from "store/slices/productSlice";
import settingReducer from "store/slices/settingSlice";
import cartReducer from "store/slices/cartSlice";
import customerReducer from "store/slices/customerSlice";
import orderReducer from "store/slices/orderSlice";
import requestReducer from "store/slices/requestSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  theme: themeReducer,
  user: userReducer,
  supplier: supplerReducer,
  product: productReducer,
  setting: settingReducer,
  cart: cartReducer,
  customer: customerReducer,
  order: orderReducer,
  request: requestReducer
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
