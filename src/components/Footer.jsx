import { useState } from "react";
import { Col, Container, Nav, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
    const [expanded, setExpanded] = useState(false)

    return (
        <footer className='footer bg-dark text-white'>

            {/* TOP SECTION — Brand statement */}
            <div style={{
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                padding: '4rem 0 3rem'
            }}>
                <Container>
                    <Row className="justify-content-center text-center">
                        <Col lg={7} md={9}>
                            <p style={{
                                fontSize: '0.62rem',
                                letterSpacing: '5px',
                                textTransform: 'uppercase',
                                color: 'var(--jw-gold)',
                                marginBottom: '16px',
                                fontFamily: 'Jost, sans-serif'
                            }}>
                                The Jiggy Standard
                            </p>

                            <p style={{
                                fontFamily: 'Cormorant Garamond, serif',
                                fontSize: 'clamp(1.2rem, 3vw, 1.7rem)',
                                fontWeight: 300,
                                fontStyle: 'italic',
                                color: 'rgba(255,255,255,0.9)',
                                lineHeight: 1.5,
                                marginBottom: '16px'
                            }}>
                                Wear the moment. Live the feeling.
                            </p>

                            {/* Collapsible full story */}
                            <div style={{
                                overflow: 'hidden',
                                maxHeight: expanded ? '600px' : '0px',
                                transition: 'max-height 0.45s ease',
                            }}>
                                <p style={{
                                    fontSize: '0.82rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    lineHeight: 1.9,
                                    fontFamily: 'Jost, sans-serif',
                                    fontWeight: 300,
                                    marginBottom: '12px',
                                    marginTop: '16px'
                                }}>
                                    An atelier of unique, eccentric moments immortalized in fabric.
                                    We are a friendly, familiar family of people who believe that life
                                    is meant to be felt, celebrated, and remembered. At the heart of
                                    everything we create is happiness, love, and the freedom to be
                                    unapologetically yourself.
                                </p>
                                <p style={{
                                    fontSize: '0.82rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    lineHeight: 1.9,
                                    fontFamily: 'Jost, sans-serif',
                                    fontWeight: 300,
                                    marginBottom: '12px'
                                }}>
                                    We turn bold ideas, beautiful connections, unforgettable experiences,
                                    and the little moments that make life special into clothing made to last.
                                    With thoughtful design, exceptional quality, and craftsmanship woven
                                    into every piece, we create more than what you wear — we create feelings
                                    you can put on.
                                </p>
                                <p style={{
                                    fontSize: '0.82rem',
                                    color: 'rgba(255,255,255,0.5)',
                                    lineHeight: 1.9,
                                    fontFamily: 'Jost, sans-serif',
                                    fontWeight: 300,
                                    marginBottom: 0
                                }}>
                                    Because to us, true satisfaction comes close to happiness. And when
                                    quality meets expression, every piece becomes a moment worth keeping.
                                </p>
                            </div>

                            <button
                                onClick={() => setExpanded(!expanded)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--jw-gold)',
                                    fontSize: '0.65rem',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    fontFamily: 'Jost, sans-serif',
                                    marginTop: '16px',
                                    padding: 0,
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '3px'
                                }}
                            >
                                {expanded ? 'Read Less ↑' : 'Our Story ↓'}
                            </button>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* BOTTOM SECTION — Links + Contact + Social */}
            <div style={{ padding: '3rem 0 2rem' }}>
                <Container>
                    <Row>
                        {/* Shop */}
                        <Col lg={3} sm={6} className="footer-col mb-4">
                            <h5>Shop</h5>
                            <Nav className="flex-column">
                                <Nav.Link as={Link} to='/home' className="footer-link">Home</Nav.Link>
                                <Nav.Link as={Link} to='/men' className="footer-link">Men</Nav.Link>
                                <Nav.Link as={Link} to='/women' className="footer-link">Women</Nav.Link>
                                <Nav.Link as={Link} to='/track' className="footer-link">Track Order</Nav.Link>
                            </Nav>
                        </Col>

                        {/* Help */}
                        <Col lg={3} sm={6} className="footer-col mb-4">
                            <h5>Help</h5>
                            <Nav className="flex-column">
                                <Nav.Link as={Link} to='/track' className="footer-link">
                                    Track My Order
                                </Nav.Link>
                                <Nav.Link as={Link} to='/checkout' className="footer-link">
                                    My Cart
                                </Nav.Link>
                                <Nav.Link
                                    href="https://wa.me/2349162817078"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="footer-link"
                                >
                                    WhatsApp Us
                                </Nav.Link>
                            </Nav>
                        </Col>

                        {/* Contact */}
                        <Col lg={3} sm={6} className="footer-col mb-4">
                            <h5>Contact</h5>
                            <address className='footer-contact' style={{ fontStyle: 'normal' }}>
                                <p><i className="bi bi-geo-alt me-2"></i>11 Yaba Road, Lagos</p>
                                <p><i className="bi bi-telephone me-2"></i>+234 (916) 281-7078</p>
                                <p><i className="bi bi-envelope me-2"></i>riddick803@gmail.com</p>
                            </address>
                        </Col>

                        {/* Social */}
                        <Col lg={3} sm={6} className="footer-col mb-4">
                            <h5>Follow Us</h5>
                            <p style={{
                                fontSize: '0.78rem',
                                color: 'rgba(255,255,255,0.45)',
                                fontFamily: 'Jost, sans-serif',
                                marginBottom: '16px'
                            }}>
                                Stay updated on new drops and behind-the-scenes moments.
                            </p>

                            <div className="d-flex gap-2">
                                <a
                                    href="https://www.instagram.com/jiggyofficial_ng?igsh=YXRrcGticXNrYm5w"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        width: '38px', height: '38px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.6)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        fontSize: '1rem'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--jw-gold)'
                                        e.currentTarget.style.color = 'var(--jw-gold)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                                    }}
                                >
                                    <i className="bi bi-instagram"></i>
                                </a>

                                <a
                                    href="https://www.tiktok.com/@jiggyofficial._ng?_r=1&_t=ZS-97uPoYmnhHF"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        width: '38px', height: '38px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.6)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        fontSize: '1rem'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = 'var(--jw-gold)'
                                        e.currentTarget.style.color = 'var(--jw-gold)'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                                    }}
                                >
                                    <i className="bi bi-tiktok"></i>
                                </a>

                                <a
                                    href="https://wa.me/2349162817078"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        width: '38px', height: '38px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        display: 'flex', alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.6)',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s ease',
                                        fontSize: '1rem'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = '#25D366'
                                        e.currentTarget.style.color = '#25D366'
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                                    }}
                                >
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            </div>
                        </Col>
                    </Row>

                    {/* Copyright */}
                    <Row>
                        <Col>
                            <hr className="footer-divider" />
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <p className="footer-copyright mb-0">
                                    &copy; {new Date().getFullYear()} The Jiggy Standard. All rights reserved.
                                </p>
                                <p className="footer-copyright mb-0">
                                    Built by:{' '}
                                    <a
                                        href="https://portfolio-papippps-projects.vercel.app/"
                                        className="developer-link"
                                    >
                                        $PPP
                                    </a>
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    )
}