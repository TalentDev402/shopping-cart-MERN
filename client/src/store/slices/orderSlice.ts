import { createSlice } from "@reduxjs/toolkit";
import { IOrder } from "utils/types";

interface IinitialState {
    contactInfo: any;
    paymentMethod: string | null;
    shippingAddress: string;
    orders: Array<IOrder>
}

export const initialState: IinitialState = {
    orders: [],
    contactInfo: {
        name: "",
        email: "",
        phone: ""
    },
    shippingAddress: "",
    paymentMethod: null
};

export const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },
        setContactInfo: (state, action) => {
            state.contactInfo = action.payload
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload
        },
        setShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
        }
    },
});

export const {
    setOrders, setContactInfo, setPaymentMethod, setShippingAddress
} = orderSlice.actions;

export default orderSlice.reducer;
