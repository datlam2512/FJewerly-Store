// src/Features/goldTransaction/goldTransactionSlice.jsx

import { createSlice } from '@reduxjs/toolkit';

const goldPriceSlice = createSlice({
    name: 'goldPrice',
    initialState: {
        buyPrice: [],
        sellPrice: [],
        isLoading: false,
        isError: false,
    },
    reducers: {
        addBuyPrice: (state, action) => {
            state.buyPrice.push(action.payload);
        },
        addSellPrice: (state, action) => {
            state.sellPrice.push(action.payload);
        },
        resetBuyPrice: (state) => {
            state.buyPrice = [];
        },
        resetSellPrice: (state) => {
            state.sellPrice = [];
        },
       
    },
});

export const { addBuyPrice, addSellPrice, resetBuyPrice, resetSellPrice } = goldPriceSlice.actions;

export default goldPriceSlice.reducer;