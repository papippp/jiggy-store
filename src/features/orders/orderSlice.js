import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { createContext } from "react";

//'https://3633cdd5-042a-46a7-b863-99b64ead49e0-00-2pnrudecgoroo.pike.replit.dev'
const BASE_URL = 'https://jiggy-wears-api.onrender.com'


export const fetchProduct = createAsyncThunk(
    'product/fetch',
    async () => {
        try {
            const response = await fetch(`${BASE_URL}/product`)
            return response.json()
        }
        catch (error) {
            console.error(error)
            throw error

        }
    }
)


export const createProduct = createAsyncThunk(
    'product/create',
    async ({ name, description, amount, pic, backpic, gender }) => {
        const data = {
            name: name,
            description: description,
            amount: amount,
            pic: pic,
            backpic: backpic,
            gender: gender
        }

        const response = await axios.post(`${BASE_URL}/product`, data)
        return response.data

    }

)

export const updateProduct = createAsyncThunk(
    'product/update',
    async ({ id, name, description, amount, pic, backpic }) => {
        const data = {
            name: name,
            description: description,
            amount: amount,
            pic: pic,
            backpic: backpic
        }
        const response = await axios.put(`${BASE_URL}/product/${id}`, data)
        return response.data


    }
)

export const deleteProduct = createAsyncThunk(
    'product/delete',
    async (id) => {
        try {
            const response = axios.delete(`${BASE_URL}/product/${id}`)
            return response.data
        }
        catch (error) {
            console.error(error)
        }
    }
)




const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [], products: [], filteredProducts: [], userEmail: null, loading: true
    },
    reducers: {
        setUserEmail: (state, action) => {
            state.userEmail = action.payload

        }

        ,
        filteredProductsByGender: (state, action) => {
            const gender = action.payload
            state.filteredProducts = state.products.filter(product =>
                product.gender === gender || product.gender === 'unisex'
            )
        }
        ,

        addToCart: (state, action) => {
            const itemIndex = state.orders.findIndex((item) => item.id === action.payload.id && item.size === action.payload.size)
            if (itemIndex >= 0) {
                state.orders[itemIndex].qty += 1
            } else {
                const newProduct = { ...action.payload, qty: 1, size: action.payload.size || 'medium' }
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

                state.orders.splice(itemIndex, 1)

            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.products = action.payload
                state.filteredProducts = action.payload
                state.loading = false

            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products = [action.payload, ...state.products]

            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.products.findIndex(product => product.id === action.payload.id)
                if (index !== -1) {
                    state.products[index] = action.payload
                }

            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product.id !== action.payload.id)
            })

    }


})

export const { addToCart, deleteItem, updateOrder, setUserEmail, filteredProductsByGender } = orderSlice.actions
export default orderSlice.reducer
export const AuthContext = createContext()
