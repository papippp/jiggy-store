import { getAuth } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../features/orders/orderSlice";
import OrdersPage from "../pages/OrdersPage";
import FloatingCart from "./FloatingCart";


export default function NavBar({ handleShow }) {
    const userEmail = useSelector((state) => state.orders.userEmail)
    const allowedEmail = 'lukzy@p.com'


    const auth = getAuth()
    const navigate = useNavigate()
    const { currentUser } = useContext(AuthContext)


    useEffect(() => {
        if (!currentUser) {
            navigate("/login")
        }
    })
    const handleLogout = () => {
        auth.signOut()
    }
    const [showOrder, setShowOrder] = useState(false)
    const handleShowOrder = () => setShowOrder(true)
    const handleCloseOrder = () => setShowOrder(false)


    return (
        <div>
            <Navbar expand='lg' className='main-navbar'>
                <Container fluid>
                    <Navbar.Brand className="brand-logo" >
                        <span className="luxury-font">JIGGY</span> <span className="thin-font">WEARS</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbar-collapse" className="navbar-dark">
                        <i className="bi bi-x-square text-white"></i>
                    </Navbar.Toggle>

                    <Navbar.Collapse id="navbar-collapse" className="navbar-collapse-custom" >
                        <Nav className='mx-auto'>
                            <Nav.Link as={Link} to={'/home'} >Home</Nav.Link>
                            <Nav.Link as={Link} to={'/men'}>Men</Nav.Link>
                            <Nav.Link as={Link} to={'/women'}  >Women</Nav.Link>

                        </Nav>
                        <Nav className='ms-auto'>
                            {userEmail === allowedEmail && (
                                <Button variant='outline-light' onClick={handleShow} className='me-3'>
                                    <i className='bi bi-upload'></i> + New Product

                                </Button>
                            )}



                            <Button
                                variant="link"
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                <i className="bi bi-box-arrow-right fs-5"></i>
                            </Button>
                        </Nav>

                    </Navbar.Collapse>

                </Container>

            </Navbar>
            <FloatingCart onClick={handleShowOrder} />
            <OrdersPage onShow={showOrder} onClose={handleCloseOrder} />

        </div>
    )
}
