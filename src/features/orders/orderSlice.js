import { createSlice } from "@reduxjs/toolkit";
import { createContext } from "react";






const orderSlice = createSlice({
    name: 'orders',
    initialState: { orders: [] },
    reducers: {
        addToCart: (state, action) => {
            const itemIndex = state.orders.findIndex((item) => item.id === action.payload.id)
            if (itemIndex >= 0) {
                state.orders[itemIndex].qty += 1
            } else {
                const newProduct = { ...action.payload, qty: 1 }
                console.log(newProduct)
                state.orders.push(newProduct)
            }
        },
        updateOrder: (state, action) => {
            const { id, qty } = action.payload
            const itemIndex = state.orders.findIndex((item) => item.id === id)
            if (itemIndex >= 0) {
                if (qty <= 0) {
                    state.orders.splice(itemIndex, 1)
                } else {
                    state.orders[itemIndex].qty = qty
                }
            }
        }
        , deleteItem: (state, action) => {
            const itemIndex = state.orders.findIndex((item) => item.id === action.payload.id)
            if (itemIndex >= 0) {
                if (state.orders[itemIndex].qty > 1) {
                    state.orders[itemIndex].qty -= 1
                } else {
                    state.orders.splice(itemIndex, 1)
                }
            }
        }
    }
})

export const { addToCart, deleteItem, updateOrder } = orderSlice.actions
export default orderSlice.reducer
export const AuthContext = createContext()
