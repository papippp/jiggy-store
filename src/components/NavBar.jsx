import { useEffect, useState } from "react";
import { Button, Container, Form, Modal, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, setToken } from "../features/orders/orderSlice";
import OrdersPage from "../pages/OrdersPage";
import FloatingCart from "./FloatingCart";
import axios from "axios";


export default function NavBar({ handleShow }) {
   
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const isAdmin = useSelector((state) => state.orders.isAdmin)
   const token = useSelector((state) => state.orders.token)  
    const handleLogout = () => {
        dispatch(logout())
    }
    const [showOrder, setShowOrder] = useState(false)
    const handleShowOrder = () => setShowOrder(true)
    const handleCloseOrder = () => setShowOrder(false)

    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showSignupModal, setShowSignupModal] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState('')
    const BASE_URL = 'https://jiggy-wears-api.onrender.com'
    const handleCloseLogin = () => setShowLoginModal(false)
    const handleShowLogin = () => setShowLoginModal(true)
    const handleCloseSignup = () => setShowSignupModal(false)
    const handleShowSignup = () => setShowSignupModal(true)

    

     const handleSignup = async (e) => {
            e.preventDefault()
            setAuthError('')
            try {
                await axios.post(`${BASE_URL}/signup`, {username, password})
                const res = await axios.post(`${BASE_URL}/login`, {username, password})
                if (res.data.auth) {
                    dispatch(setToken({token : res.data.token, username}))
                    handleCloseSignup()
                    navigate('/home')
                }
            } catch (error) {
                setAuthError("Could not create account. Username may already exist.")
            }
        }

        const handleLogin = async (e) => {
                e.preventDefault()
                setAuthError('')
                try {
                   const res = await axios.post(`${BASE_URL}/login`, {username, password})
                   if (res.data.auth) {
                    dispatch(setToken({token : res.data.token, username}))
                    handleCloseLogin()
                    navigate('/home')
                   }
                } catch (error) {
                    setAuthError("Invalid email or password")
                }
            }
    


    return (
        <div>
            <Navbar expand='lg' className='main-navbar'>
                <Container fluid>
                    <Navbar.Brand className="brand-logo" >
                        <Nav.Link as={Link} to={'/home'} >
                        <span className="luxury-font">JIGGY</span> <span className="thin-font">WEARS</span>
                        </Nav.Link>
                    </Navbar.Brand>

                    <Navbar.Toggle  aria-controls="navbar-collapse"
                     style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                     />
                       

                    <Navbar.Collapse id="navbar-collapse" className="navbar-collapse-custom" >
                        <Nav className='mx-auto'>
                            <Nav.Link as={Link} to={'/home'} >Home</Nav.Link>
                            <Nav.Link as={Link} to={'/men'}>Men</Nav.Link>
                            <Nav.Link as={Link} to={'/women'}  >Women</Nav.Link>
                            <Nav.Link as={Link} to={'/track'}>Track Order</Nav.Link>
                            {isAdmin && (
                                <Nav.Link as={Link} to={'/admin'} style={{color: '#ffc107'}}>
                                    Dashboard
                                </Nav.Link>
                            )}
                        </Nav>
                        <Nav className='ms-auto'>
                            {isAdmin && (
                                <Button variant='outline-light' onClick={handleShow} className='me-3'>
                                    <i className='bi bi-upload'></i> + New Product

                                </Button>
                            )}



                           {token ? (<Button
                                variant="link"
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                <i className="bi bi-box-arrow-right fs-5"></i>
                            </Button>) :
                            (<Button
                                variant="outline-light"
                                size="sm"
                                onClick={handleShowLogin}
                                className="logout-btn"
                            >
                                <i className="bi bi-person"></i>
                            </Button>)}
                        </Nav>

                    </Navbar.Collapse>

                </Container>

            </Navbar>
            <Modal show={showLoginModal} onHide={handleCloseLogin} centered>
                            <Modal.Header closeButton className="border-0 pb-0">
                                <Modal.Title className="w-100 text-center">
                                    <h3 className="mb-0">Welcome Back</h3>
                                    <p className="text-muted mt-2">Sign in to your account</p>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="pt-0">
                                <Form onSubmit={handleLogin}>
                                    {authError && <div className="alert alert-danger">{authError}</div>}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your email"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="py-2"
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="py-2"
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="dark"
                                        type="submit"
                                        className="w-100 py-2 rounded-pill"
                                    >
                                        Sign In
                                    </Button>
                                </Form>
                                <div className="text-center mt-4">
                                    <p className="text-muted"> new user? {' '}
                                        <button
                                            className="btn-link border-0 bg-transparent text-primary"
                                            onClick={() => {
                                                handleCloseLogin()
                                                handleShowSignup()
                                            }}
                                        >
                                            Sign up
                                        </button>
                                    </p>
                                </div>
                            </Modal.Body>
                        </Modal>

                         {/* Signup Modal */}
                                    <Modal show={showSignupModal} onHide={handleCloseSignup} centered>
                                        <Modal.Header closeButton className="border-0 pb-0">
                                            <Modal.Title className="w-100 text-center">
                                                <h3 className="mb-0">Create Account</h3>
                                                <p className="text-muted mt-2">Join our fashion community</p>
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="pt-0">
                                            <Form onSubmit={handleSignup}>
                                                {authError && <div className="alert alert-danger">{authError}</div>}
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email Address</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter your email"
                                                        value={username}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                        required
                                                        className="py-2"
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Password</Form.Label>
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Create a password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        required
                                                        className="py-2"
                                                    />
                                                    <Form.Text className="text-muted">
                                                        8+ characters with letters and numbers
                                                    </Form.Text>
                                                </Form.Group>
                                                <Button
                                                    variant="dark"
                                                    type="submit"
                                                    className="w-100 py-2 rounded-pill"
                                                >
                                                    Create Account
                                                </Button>
                                            </Form>
                                            <div className="terms-text mt-3 small text-muted text-center">
                                                By creating an account, you agree to our Terms and Privacy Policy.
                                            </div>
                                            <div className="text-center mt-4">
                                                <p className="text-muted">Already have an account?{' '}
                                                    <button
                                                        className="btn-link border-0 bg-transparent text-primary"
                                                        onClick={() => {
                                                            handleCloseSignup()
                                                            handleShowLogin()
                                                        }}
                                                    >
                                                        Sign in
                                                    </button>
                                                </p>
                                            </div>
                                        </Modal.Body>
                                    </Modal>
            <FloatingCart onClick={handleShowOrder} />
            <OrdersPage onShow={showOrder} onClose={handleCloseOrder} />

        </div>
    )
}
