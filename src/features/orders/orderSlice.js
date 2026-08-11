import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//'https://3633cdd5-042a-46a7-b863-99b64ead49e0-00-2pnrudecgoroo.pike.replit.dev'
const BASE_URL = 'https://jiggy-wears-api.onrender.com'

function getInitialAuthState() {
    try {
        const token = localStorage.getItem('jiggy_token')
        const username = localStorage.getItem('jiggy_username')
        if (!token || !username) return { token: null, isAdmin: false, userEmail: null }
        return {
            token,
            userEmail: username,
            isAdmin: username === 'lukzy'
        }

    }
    catch {
        return { token: null, isAdmin: false, username: null }
    }
}

const authState = getInitialAuthState()

function saveCart(orders) {
    try {
        localStorage.setItem('jiggy_cart', JSON.stringify(orders))
    }
    catch {
        //localStorage full or unavailable - fall silently
    }
}

function loadCart() {
    try {
        const saved = localStorage.getItem('jiggy_cart')
        return saved ? JSON.parse(saved) : []
    }
    catch {
        return []
    }
}

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
    async ({ name, description, amount, pic, backpic, gender, category, stock }) => {
        const data = {
            name,
            description,
            amount,
            pic,
            backpic,
            gender,
            category,
            stock
        }

        const response = await axios.post(`${BASE_URL}/product`, data)
        return response.data

    }

)

export const updateProduct = createAsyncThunk(
    'product/update',
    async ({ id, name, description, amount, pic, backpic, gender, category, stock }) => {
        const data = {
            name,
            description,
            amount,
            pic,
            backpic,
            gender,
            category,
            stock
        }
        const response = await axios.put(`${BASE_URL}/product/${id}`, data)
        return response.data


    }
)

export const deleteProduct = createAsyncThunk(
    'product/delete',
    async (id) => {
        try {
            axios.delete(`${BASE_URL}/product/${id}`)
            return id
        }
        catch (error) {
            console.error(error)
        }
    }
)




const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: loadCart(),
        products: [],
        filteredProducts: [],
        searchQuery: '',
        userEmail: authState.userEmail,
        error: null,
        token: authState.token,
        isAdmin: authState.isAdmin,
        loading: false
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload.token
            state.userEmail = action.payload.userEmail
            state.isAdmin = action.payload.username === 'lukzy'
            localStorage.setItem('jiggy_token', action.payload.token)
            localStorage.setItem('jiggy_username', action.payload.username)
        }
        ,
        logout: (state) => {
            state.token = null
            state.userEmail = null
            state.isAdmin = false
            localStorage.removeItem('jiggy_token')
            localStorage.removeItem('jiggy_username')
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload
        },

        filteredProductsByGender: (state, action) => {
            const gender = action.payload
            state.filteredProducts = state.products.filter(product =>
                product.gender === gender || product.gender === 'unisex'
            )
        }
        ,

        addToCart: (state, action) => {
            const itemIndex = state.orders.findIndex(
                (item) => item.id === action.payload.id && item.size === action.payload.size)
            if (itemIndex >= 0) {
                state.orders[itemIndex].qty += 1
            } else {
                const newProduct = { ...action.payload, qty: 1, size: action.payload.size || 'medium' }
                console.log(newProduct)
                state.orders.push(newProduct)
            }
            saveCart(state.orders)
        },

        updateOrder: (state, action) => {
            const { id, qty, size } = action.payload
            const itemIndex = state.orders.findIndex(
                (item) => item.id === id)
            if (itemIndex >= 0) {
                if (qty <= 0) {
                    state.orders.splice(itemIndex, 1)
                } else {
                    state.orders[itemIndex].qty = qty
                    if (size) state.orders[itemIndex].size = size
                }
            }
            saveCart(state.orders)
        }


        , deleteItem: (state, action) => {
            const itemIndex = state.orders.findIndex((item) => item.id === action.payload.id)
            if (itemIndex >= 0) {
                state.orders.splice(itemIndex, 1)
            }
            saveCart(state.orders)
        },
        clearCart: (state) => {
            state.orders = []
            saveCart([])
        }

    },
    extraReducers: (builder) => {
        builder

            .addCase(fetchProduct.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.products = Array.isArray(action.payload) ? action.payload : []
                state.filteredProducts = Array.isArray(action.payload) ? action.payload : []
                state.loading = false
                state.error = null

            })
            .addCase(fetchProduct.rejected, (state) => {
                state.loading = false
                state.error = 'Failed to load products'
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                if (action.payload) {
                    state.products = [action.payload, ...state.products]
                    state.filteredProducts = [action.payload, ...state.filteredProducts]
                }
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                if (action.payload) {
                    const index = state.products.findIndex(product => product.id === action.payload.id)
                    if (index !== -1) state.products[index] = action.payload
                    const fi = state.filteredProducts.findIndex(p => p.id === action.payload.id)
                    if (fi !== -1) state.filteredProducts[fi] = action.payload

                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product.id !== action.payload.id)
                state.filteredProducts = state.filteredProducts.filter(p => p.id !== action.payload.id)
            })

    }


})

export const { addToCart, deleteItem, updateOrder, setToken, setSearchQuery, logout, filteredProductsByGender, clearCart } = orderSlice.actions
export default orderSlice.reducer

