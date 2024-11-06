import { useEffect } from 'react'
import { Badge, Button, Container, Nav, Navbar, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import useLocalStorage from 'use-local-storage'
import ProfileMianBody from '../components/ProfileMianBody'

export default function HomePage() {
    const [authToken, setAuthToken] = useLocalStorage('authToken')
    const navigate = useNavigate()
    useEffect(() => {
        if (!authToken) {
            navigate("/login")
        }
    })
    const handleLogout = () => {
        setAuthToken('')
    }

    const orders = useSelector((state) => state.orders.orders)
    const ordersCount = orders.reduce((accumulator, item) => {
        return accumulator + item.qty
    }, 0)

    return (
        <>
            <Navbar bg="light">
                <Container>
                    <Navbar.Brand href="/">
                        <i
                            className="bi bi-house"
                            style={{ fontSize: 30, color: "orange" }}
                        ></i>
                    </Navbar.Brand>
                    <Nav className="justify-content-center align-items-center">
                        <Nav.Link as={Link} to={'/orders'}>
                            <i className='bi bi-cart'></i>
                            <Badge pill variant='primary'>{ordersCount}</Badge>

                        </Nav.Link>
                        <Nav.Link as={Link} to={'https://wa.me/+2349132637858'}>
                            Contact us <i className='bi bi-whatsapp'></i>

                        </Nav.Link>
                    </Nav>

                    <Navbar.Collapse className="justify-content-end">
                        <Button variant="primary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Navbar.Collapse>

                </Container>
            </Navbar>
            <Container>
                <Navbar bg="dark" data-bs-theme="dark" fixed='bottom'>
                    <Container>
                        <Navbar.Brand href="#home"><p><strong>Jiggy wears</strong></p></Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Built by: <a href="#login">$PPP</a>
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

            </Container>

            <Container className="mt-3">
                <h2>Your profile</h2>
            </Container>
            <Row>
                <Container className='my-3'>
                    <ProfileMianBody />
                </Container>
            </Row>



        </>
    )
}
