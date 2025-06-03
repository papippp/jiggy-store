import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useContext, useEffect, useState } from "react"
import { Button, Carousel, Col, Container, Form, Image, Modal, Nav, Navbar, Row, Card } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext, setUserEmail } from "../features/orders/orderSlice"
import { useDispatch } from "react-redux"


export default function AuthPage() {
    // Authentication state
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [showSignupModal, setShowSignupModal] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState('')

    // Shopping state
    const [wishlist, setWishlist] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)

    // Sample products data
    const [products] = useState([
        {
            id: 1,
            name: "Premium Denim Jacket",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
            description: "Classic denim jacket with modern fit"
        },
        {
            id: 2,
            name: "Luxury Cashmere Sweater",
            price: 129.99,
            image: "https://images.unsplash.com/photo-1520367445093-50dc08a59d9d",
            description: "Ultra-soft cashmere for ultimate comfort"
        },
        {
            id: 3,
            name: "Signature Leather Pants",
            price: 159.99,
            image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea",
            description: "High-quality leather with perfect fit"
        }
    ])

    const loginImage = 'https://res.cloudinary.com/duocpeihb/image/upload/v1730853747/WhatsApp_Image_2024-11-06_at_7.41.51_AM_zkmeqp.jpg'
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const auth = getAuth()
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (currentUser) navigate('/home')
    }, [currentUser, navigate])

    const handleSignup = async (e) => {
        e.preventDefault()
        setAuthError('')
        try {
            const res = await createUserWithEmailAndPassword(auth, username, password)
            console.log(res.user)
            handleCloseSignup()
        } catch (error) {
            setAuthError(error.message)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setAuthError('')
        try {
            await signInWithEmailAndPassword(auth, username, password)
            dispatch(setUserEmail(auth.currentUser.email))
            handleCloseLogin()
        } catch (error) {
            setAuthError("Invalid email or password")
        }
    }

    const handleCloseLogin = () => setShowLoginModal(false)
    const handleShowLogin = () => setShowLoginModal(true)
    const handleCloseSignup = () => setShowSignupModal(false)
    const handleShowSignup = () => setShowSignupModal(true)

    const toggleWishlist = (productId) => {
        if (wishlist.includes(productId)) {
            setWishlist(wishlist.filter(id => id !== productId))
        } else {
            setWishlist([...wishlist, productId])
        }
    }

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex)
    }

    return (
        <div className="auth-page">
            {/* Premium Navigation Bar */}
            <Navbar expand='lg' className='main-navbar fixed-top'>
                <Container>
                    <Navbar.Brand className="brand-logo">
                        <span className="luxury-font">JIGGY</span> <span className="thin-font">WEARS</span>
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="main-nav" className="border-0">
                        <span className="navbar-toggler-icon"></span>
                    </Navbar.Toggle>

                    <Navbar.Collapse id='main-nav'>
                        <Nav className='mx-auto'>
                            <Nav.Link as={Link} to={'/home'} className="nav-link px-3">Home</Nav.Link>
                            <Nav.Link as={Link} to={'/men'} className="nav-link px-3">Men</Nav.Link>
                            <Nav.Link as={Link} to={'/women'} className="nav-link px-3">Women</Nav.Link>
                            <Nav.Link as={Link} to={'/accessories'} className="nav-link px-3">Accessories</Nav.Link>
                        </Nav>

                        <Nav className='ms-auto align-items-center'>
                            <Button variant="link" className="nav-icon">
                                <i className="bi bi-bag"></i>
                            </Button>
                            {!currentUser && (
                                <Button
                                    variant="outline-dark"
                                    className="ms-3 login-btn"
                                    onClick={handleShowLogin}
                                >
                                    Login
                                </Button>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Hero Section with Split Layout */}
            <section className="hero-section">
                <Container fluid className="h-100">
                    <Row className="h-100 align-items-center">
                        {/* Auth Content */}
                        <Col lg={6} className="auth-content-col">
                            <div className="auth-content-wrapper">
                                <h1 className="display-4 fw-bold mb-4">Elevate Your Style</h1>
                                <p className="lead mb-5">Discover premium fashion curated for the modern individual</p>

                                <div className="auth-cta">
                                    <Button
                                        variant="dark"
                                        size="lg"
                                        className="rounded-pill px-4 me-3"
                                        onClick={handleShowLogin}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        variant="outline-dark"
                                        size="lg"
                                        className="rounded-pill px-4"
                                        onClick={handleShowSignup}
                                    >
                                        Create Account
                                    </Button>
                                </div>

                                <div className="trust-badges mt-5">
                                    <p className="text-muted mb-2">TRUSTED BY FASHION ENTHUSIASTS WORLDWIDE</p>
                                    <div className="d-flex">
                                        <span className="badge me-2">Premium Quality</span>
                                        <span className="badge me-2">Ethically Sourced</span>
                                        <span className="badge">Fast Shipping</span>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Featured Product Carousel */}
                        <Col lg={6} className="product-carousel-col p-0">
                            <Carousel
                                fade
                                activeIndex={activeIndex}
                                onSelect={handleSelect}
                                className="h-100"
                                indicators={false}
                                interval={5000}
                            >
                                {products.map((product, index) => (
                                    <Carousel.Item key={product.id} className="h-100">
                                        <div className="product-slide h-100 position-relative">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fluid
                                                className="h-100 w-100 object-fit-cover"
                                            />
                                            <div className={`product-info ${index === activeIndex ? 'active' : ''}`}>
                                                <h3>{product.name}</h3>
                                                <p className="price">${product.price}</p>
                                                <Button
                                                    variant="outline-light"
                                                    className="mt-3 explore-btn"
                                                    onClick={() => navigate('/shop')}
                                                >
                                                    Explore Collection <i className="bi bi-balloon-heart-fill"></i>
                                                </Button>
                                            </div>
                                            <Button
                                                variant="link"
                                                className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`}
                                                onClick={() => toggleWishlist(product.id)}
                                            >
                                                {wishlist.includes(product.id) ? (
                                                    <i className="bi bi-balloon-heart-fill"></i>
                                                ) : (
                                                    <i className="bi bi-heart"></i>
                                                )}
                                            </Button>
                                        </div>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Featured Collections Section */}
            <section className="featured-collections py-5">
                <Container>
                    <h2 className="section-title text-center mb-5">Our Signature Collections</h2>
                    <Row>
                        {products.map(product => (
                            <Col md={4} key={product.id} className="mb-4">
                                <Card className="collection-card h-100 border-0">
                                    <div className="card-img-container">
                                        <Card.Img
                                            variant="top"
                                            src={product.image}
                                            className="img-fluid"
                                        />
                                        <Button
                                            variant="light"
                                            className="quick-shop-btn"
                                            onClick={handleShowLogin}
                                        >
                                            Quick Shop
                                        </Button>
                                    </div>
                                    <Card.Body className="text-center">
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text className="text-muted">
                                            ${product.price}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Login Modal */}
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
                                type="email"
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
                                type="email"
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

            {/* Premium Footer */}
            <footer className="footer bg-dark text-white py-5">
                <Container>
                    <Row>
                        <Col lg={4} className="mb-4 mb-lg-0">
                            <h5 className="footer-heading">JIGGY WEARS</h5>
                            <p className="footer-text mt-3">
                                Crafting exceptional luxury apparel with meticulous attention to detail and timeless elegance.
                            </p>
                            <div className="social-links mt-4">
                                <Button variant="outline-light" size="sm" className="me-2 rounded-circle">
                                    <i className="bi bi-facebook"></i>
                                </Button>
                                <Button variant="outline-light" size="sm" className="me-2 rounded-circle">
                                    <i className="bi bi-instagram"></i>
                                </Button>
                                <Button variant="outline-light" size="sm" className="me-2 rounded-circle">
                                    <i className="bi bi-twitter"></i>
                                </Button>
                            </div>
                        </Col>
                        <Col lg={2} md={4} className="mb-4 mb-md-0">
                            <h5 className="footer-heading">Shop</h5>
                            <Nav className="flex-column mt-3">
                                <Nav.Link as={Link} to={'/men'} className="footer-link px-0">Men</Nav.Link>
                                <Nav.Link as={Link} to={'/women'} className="footer-link px-0">Women</Nav.Link>
                                <Nav.Link as={Link} to={'/accessories'} className="footer-link px-0">Accessories</Nav.Link>
                                <Nav.Link as={Link} to={'/new-arrivals'} className="footer-link px-0">New Arrivals</Nav.Link>
                            </Nav>
                        </Col>
                        <Col lg={2} md={4} className="mb-4 mb-md-0">
                            <h5 className="footer-heading">Help</h5>
                            <Nav className="flex-column mt-3">
                                <Nav.Link as={Link} to={'/contact'} className="footer-link px-0">Contact Us</Nav.Link>
                                <Nav.Link as={Link} to={'/faq'} className="footer-link px-0">FAQs</Nav.Link>
                                <Nav.Link as={Link} to={'/shipping'} className="footer-link px-0">Shipping</Nav.Link>
                                <Nav.Link as={Link} to={'/returns'} className="footer-link px-0">Returns</Nav.Link>
                            </Nav>
                        </Col>
                        <Col lg={4} md={4}>
                            <h5 className="footer-heading">Contact</h5>
                            <address className="footer-contact mt-3">
                                <p><i className="bi bi-geo-alt me-2"></i> 11 Yaba Road, Lagos</p>
                                <p><i className="bi bi-telephone me-2"></i> +234 (916) 281-7078</p>
                                <p><i className="bi bi-envelope me-2"></i> jiggywears@ppp.com</p>
                            </address>
                        </Col>
                    </Row>
                    <hr className="mt-5 mb-4" />
                    <Row>
                        <Col md={6} className="mb-3 mb-md-0">
                            <p className="mb-0">&copy; {new Date().getFullYear()} JIGGY WEARS. All rights reserved.</p>
                        </Col>
                        <Col md={6} className="text-md-end">
                            <p className="mb-0">Built by: <a href="#" className="text-white">$PPP</a></p>
                        </Col>
                    </Row>
                </Container>
            </footer>

            {/* CSS Styles */}

        </div>
    )
}