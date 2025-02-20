import { useContext } from "react"
import { AuthContext } from "../features/orders/orderSlice"
import { Navigate } from "react-router-dom"


export default function ValidateLogin({ children }) {
    const currentUser = useContext(AuthContext).currentUser

    if (!currentUser) {
        return <Navigate to='/login' replace />
    }
    return (
        children
    )
}
