import { Provider } from "react-redux"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import HomePage from "./pages/HomePage"
import OrdersPage from "./pages/OrdersPage"
import store from "./store"
import './App.css'

function App() {





  return (
    <Provider store={store}>
      <BrowserRouter>

        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="*" element={<AuthPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>

      </BrowserRouter>
    </Provider>
  )
}

export default App
