import { useState } from 'react'
import { Col, Container, Nav, Navbar, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import CreateOrderModal from '../components/CreateOrderModal'
import NavBar from '../components/NavBar'
import ProfileMianBody from '../components/ProfileMianBody'

export default function HomePage() {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)







    return (
        <>

            <div className='luxury-store'>
                {/*Main Navigation*/}
                <NavBar handleShow={handleShow} />
                <Container fluid className='main-content'>
                    <Row className='welcome-section'>
                        <Col>
                            <h1 className="welcome-heading">Welcome to Jiggy Wears</h1>
                            <p className="welcome-subheading">Curated Luxury Apparel</p>
                        </Col>

                    </Row>
                    <Row className="profile-section">
                        <ProfileMianBody />
                        <CreateOrderModal show={show} handleClose={handleClose} />
                    </Row>

                </Container>
                <Navbar expand='lg' className='footer-navbar'>
                    <Container>
                        <Row>
                            <Col lg={4} className="footer-col">
                                <h5>About Us </h5>
                                <p className="footer-text">
                                    Crafting exceptional luxury apparel with meticulous attention to detail and timeless elegance.
                                </p>
                            </Col>
                            <Col lg={4} className="footer-col">
                                <h5>Quick Links</h5>
                                <Nav className="flex-column">
                                    <Nav.Link as={Link} to={'/home'} className="footer-link">Home</Nav.Link>
                                    <Nav.Link as={Link} to={'/orders'} className="footer-link">Orders</Nav.Link>
                                    <Nav.Link as={Link} to={'/Men'} className="footer-link">Men</Nav.Link>
                                    <Nav.Link as={Link} to={'/Women'} className="footer-link">Women</Nav.Link>
                                </Nav>
                            </Col>
                            <Col lg={4} className='footer-col'>
                                <h5>Contact us</h5>
                                <address className='footer-contact'>
                                    <p><i className="bi bi-geo-alt"></i> 11 Yaba road,Lagos</p>
                                    <p><i className="bi bi-telephone"></i> +234 (916) 281-7078</p>
                                    <p><i className="bi bi-envelope"></i> jiggywears@ppp.com</p>

                                </address>
                            </Col>
                        </Row>
                        <Row className='w-100 footer-bottom'>
                            <Col>
                                <hr className="footer-divider" />
                                <p className="footer-copyright">
                                    &copy; {new Date().getFullYear()} JIGGY WEARS. All rights reserved.
                                    <span className="float-end">Built by: <a href="#login" className="developer-link">$PPP</a></span>
                                </p>
                            </Col>

                        </Row>
                    </Container>

                </Navbar>

            </div>

        </>
    )
}
