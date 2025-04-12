import { createSlice } from "@reduxjs/toolkit";

interface IinitialState {
    cart: Array<any>;
}

export const initialState: IinitialState = {
    cart: []
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload
        },
    },
});

export const { setCart } = cartSlice.actions;

export default cartSlice.reducer;
