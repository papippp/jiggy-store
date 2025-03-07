import { getAuth } from 'firebase/auth'
import { useContext, useEffect, useState } from 'react'
import { Badge, Button, Container, Nav, Navbar, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import CreateOrderModal from '../components/CreateOrderModal'
import ProfileMianBody from '../components/ProfileMianBody'
import { AuthContext } from '../features/orders/orderSlice'

export default function HomePage() {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

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


    const userEmail = useSelector((state) => state.orders.userEmail)
    const allowedEmail = 'lukzy@p.com'

    const orders = useSelector((state) => state.orders.orders)
    const ordersCount = orders.reduce((accumulator, item) => {
        return accumulator + item.qty
    }, 0)



    return (
        <>
            <Navbar bg="light" className="navbar-custom">
                <Button variant="primary" onClick={handleLogout}>
                    Logout
                </Button>
                <Container className='d-flex justify-content-between align items-center'>

                    <Nav className="d-flex justify-content-center align-items-center flex-grow-1">


                        <Nav.Link as={Link} to={'/orders'} className='d-flex align-items-center me-3 nav-link-custom' >
                            <i className='bi bi-cart'></i>
                            <Badge className='ms-2' pill variant='primary'>{ordersCount}</Badge>

                        </Nav.Link>


                    </Nav>
                    <div className='text-center flex-grow-1'>
                        <p className='mb-0'>JIGGY WEARS</p>

                    </div>
                    {userEmail === allowedEmail ? (
                        <Button onClick={handleShow}>
                            upload new product

                        </Button>



                    ) : (
                        null
                    )}


                    <Navbar.Collapse className="justify-content-end">
                        <Nav.Link as={Link} to={'https://wa.me/+2349132637858'} className='d-flex align-items-center nav-link-custom'>
                            Contact us <i className='bi bi-whatsapp'></i>

                        </Nav.Link>


                    </Navbar.Collapse>

                </Container>
            </Navbar>
            <Container>
                <Navbar fixed='bottom' className="footer-navbar">
                    <Container>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Built by: <a href="#login">$PPP</a>
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

            </Container>

            <Container className="mt-3">
                <h2>Welcome !</h2>
            </Container>
            <Row>
                <Container className='my-3'>
                    <ProfileMianBody />
                    <CreateOrderModal show={show} handleClose={handleClose} />
                </Container>
            </Row>



        </>
    )
}
