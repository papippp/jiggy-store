import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css'
import ToastProvider from "./components/ToastProvider"
import AuthPage from "./pages/AuthPage"
import CheckoutPage from "./pages/CheckoutPage"
import HomePage from "./pages/HomePage"
import Men from "./pages/Men"
import OrdersPage from "./pages/OrdersPage"
import Women from "./pages/Women"
import store from "./store"
import ProductDetail from "./pages/ProductDetail"
import TrackOrder from "./pages/TrackOrder"
import AdminDashboard from "./pages/AdminDashboard"
import LandingPage from "./pages/LandingPage"


function App() {




  return (

    
      <Provider store={store}>
        <BrowserRouter>
        <ToastProvider/>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/product/:id" element={<ProductDetail/>}/>
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/track" element={<TrackOrder/>}/>
            <Route path="*" element={<LandingPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/men" element={<Men />} />
            <Route path="/women" element={<Women />} />
            <Route path='/admin' element={<AdminDashboard/>}/>
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>

        </BrowserRouter>
      </Provider>
    

  )
}

export default App
