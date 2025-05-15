import { getAuth } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Badge, Button, Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../features/orders/orderSlice";
import OrdersPage from "../pages/OrdersPage";


export default function NavBar({ handleShow }) {
    const userEmail = useSelector((state) => state.orders.userEmail)
    const allowedEmail = 'lukzy@p.com'
    const orders = useSelector((state) => state.orders.orders)
    const ordersCount = orders.reduce((accumulator, item) => {
        return accumulator + item.qty
    }, 0)

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

                    <Navbar.Toggle aria-controls="main-nav" />
                    <Navbar.Collapse id='main-nav'>
                        <Nav className='mx-auto'>
                            <Nav.Link as={Link} to={'/home'} className="nav-link">Home</Nav.Link>
                            <Nav.Link as={Link} to={'/men'} className="nav-link">Men</Nav.Link>
                            <Nav.Link as={Link} to={'/women'} className="nav-link">Women</Nav.Link>
                            <Nav.Link as={Link} to={'/client-services'} className="nav-link">Accessories </Nav.Link>

                        </Nav>
                        <Nav className='ms-auto'>
                            {userEmail === allowedEmail && (
                                <Button variant='outline-light' onClick={handleShow} className='me-3'>
                                    <i className='bi bi-upload'></i> + New Product

                                </Button>
                            )}
                            <Button onClick={handleShowOrder}>


                                <i className='bi bi-bag fs-5'></i>
                                {ordersCount > 0 && (
                                    <Badge pill bg='light' text='dark' className='ms-2 cart-badge' >
                                        {ordersCount}
                                    </Badge>
                                )}

                            </Button>

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
            <OrdersPage onShow={showOrder} onClose={handleCloseOrder} />

        </div>
    )
}
