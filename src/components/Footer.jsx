import { Col, Container, Nav, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";


export default function Footer() {
    return (
        <div>
            <footer className='footer bg-dark text-white py-5'>

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
                    </Row>

                    <Row className='w-100 footer-bottom'>
                        <Col>
                            <hr className="footer-divider" />
                            <p className="footer-copyright">
                                &copy; {new Date().getFullYear()} JIGGY WEARS. All rights reserved.
                                <span className="float-end">Built by: <a href="https://portfolio-papippps-projects.vercel.app/" className="developer-link">$PPP</a></span>
                            </p>
                        </Col>

                    </Row>
                </Container>


            </footer>

        </div>
    )
}
