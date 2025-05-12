import { getAuth } from "firebase/auth";
import { useContext, useEffect } from "react";
import { Badge, Button, Container, Nav, Navbar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../features/orders/orderSlice";


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


    return (
        <div>
            <Navbar expand='lg' className='main-navbar'>
                <Container fluid>
                    <Navbar.Brand >
                        <span className='luxury-font'>JIGGY</span> <span className="thin-font" >WEARS</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="main-nav" />
                    <Navbar.Collapse id='main-nav'>
                        <Nav className='mx-auto'>
                            <Nav.Link as={Link} to={'/home'} className="nav-link">Home</Nav.Link>
                            <Nav.Link as={Link} to={'/collections'} className="nav-link">Men</Nav.Link>
                            <Nav.Link as={Link} to={'/about'} className="nav-link">Women</Nav.Link>
                            <Nav.Link as={Link} to={'/client-services'} className="nav-link">Accessories </Nav.Link>

                        </Nav>
                        <Nav className='ms-auto'>
                            {userEmail === allowedEmail && (
                                <Button variant='outline-light' onClick={handleShow} className='me-3'>
                                    <i className='bi bi-upload'></i> + New Product

                                </Button>
                            )}
                            <Nav.Link as={Link} to='/orders' className='cart-icon d-flex align-items-centerr'>
                                <i className='bi bi-bag fs-5'></i>
                                {ordersCount > 0 && (
                                    <Badge pill bg='light' text='dark' className='ms-2 cart-badge' >
                                        {ordersCount}
                                    </Badge>
                                )}

                            </Nav.Link>

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

        </div>
    )
}
