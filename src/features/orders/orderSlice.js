import { createSlice } from "@reduxjs/toolkit";
import { createContext } from "react";








const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [], products: [
            { id: 1, name: 'jiggy rozay safari', description: 'Pixel Dancers Tee Black ', amount: 100, pic: 'https://res.cloudinary.com/duocpeihb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1730461371/WhatsApp_Image_2024-11-01_at_6.42.05_PM_km4w4b.jpg' },
            { id: 2, name: 'Jiggy Viscor Cap', description: 'bbc logo curved ', amount: 70, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/WhatsApp_Image_2024-11-25_at_5.44.07_PM_hdv0pk.jpg' },
            { id: 3, name: 'top boy boot ', description: 'Jiggy topboy jean', amount: 200, pic: 'https://res.cloudinary.com/duocpeihb/image/upload/v1730461009/WhatsApp_Image_2024-11-01_at_6.35.54_PM_p9q5rd.jpg' },
            { id: 4, name: 'Jiggy hoodie  ', description: 'Jiggy logo neon hoodie', amount: 166, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/WhatsApp_Image_2024-11-25_at_6.44.06_AM_d8sdwv.jpg' },
            { id: 5, name: 'Jiggy full suite  ', description: 'up and down toke tile', amount: 390, pic: 'https://res.cloudinary.com/duocpeihb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1730461373/WhatsApp_Image_2024-11-01_at_6.42.07_PM_s4rcqt.jpg' },
            { id: 6, name: 'jiggy rozay safari', description: 'Pixel Dancers Tee Black ', amount: 100, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/WhatsApp_Image_2024-11-30_at_1.20.37_AM_qntyrh.jpg' },
            { id: 7, name: 'Jiggy Viscor Cap', description: 'bbc logo curved ', amount: 70, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/WhatsApp_Image_2024-11-25_at_5.44.06_PM_vo9k4e.jpg' },
            { id: 8, name: 'top boy boot ', description: 'Jiggy topboy jean', amount: 200, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/WhatsApp_Image_2024-11-30_at_1.20.39_AM_h23yhj.jpg' }

        ],
        userEmail: null
    },
    reducers: {
        setUserEmail: (state, action) => {
            state.userEmail = action.payload

        }

        , createCart: (state, action) => {
            const newCart = {
                id: Date.now(),
                name: action.payload.name,
                description: action.payload.description,
                amount: action.payload.amount,
                pic: action.payload.pic,
                userEmail: state.userEmail

            }
            state.products.push(newCart)
        }

        , addToCart: (state, action) => {
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
        },
        deleteProduct: (state, action) => {
            const productIndex = state.products.findIndex((product) => product.id === action.payload.id);
            if (productIndex >= 0) {
                state.products.splice(productIndex, 1);
            }
        }


        , deleteItem: (state, action) => {
            const itemIndex = state.orders.findIndex((item) => item.id === action.payload.id)
            if (itemIndex >= 0) {

                state.orders.splice(itemIndex, 1)

            }
        }
    }
})

export const { createCart, addToCart, deleteItem, updateOrder, setUserEmail, deleteProduct } = orderSlice.actions
export default orderSlice.reducer
export const AuthContext = createContext()
