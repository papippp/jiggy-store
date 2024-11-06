import { configureStore } from '@reduxjs/toolkit'
import ordersReducer from './features/orders/orderSlice'


export default configureStore({
    reducer: {
        orders: ordersReducer
    }
})