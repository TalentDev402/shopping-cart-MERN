import { createSlice } from "@reduxjs/toolkit";
import { IRequest } from "utils/types";
import { IOrder } from "utils/types";

interface IinitialState {
    request: IRequest | null,
    requests: Array<IRequest>
}

export const initialState: IinitialState = {
    request: null,
    requests: []
};

export const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers: {
        setRequest: (state, action) => {
            state.request = action.payload;
        },
        setRequests: (state, action) => {
            state.requests = action.payload;
        },
    },
});

export const {
    setRequest, setRequests
} = requestSlice.actions;

export default requestSlice.reducer;
