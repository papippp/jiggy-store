import axios from 'axios'
import { useEffect, useState } from 'react'
import { Carousel, Col, Container, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CreateOrderModal from '../components/CreateOrderModal'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import ProfileMianBody from '../components/ProfileMianBody'

const BASE_URL = 'https://jiggy-wears-api.onrender.com'

// Shown only if carousel table is empty
const FALLBACK_SLIDES = [
    {
        pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/v1748829185/photo_6188138139789411362_y_vvoesc.jpg',
        caption: 'New Collection',
        cta_text: 'Shop Now',
        cta_path: '/home'
    },
    {
        pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/v1748829184/photo_6188138139789411360_y_d1d7di.jpg',
        caption: 'For Him',
        cta_text: 'Shop Men',
        cta_path: '/men'
    },
    {
        pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/v1748829184/photo_6188138139789411359_y_r7eaop.jpg',
        caption: 'For Her',
        cta_text: 'Shop Women',
        cta_path: '/women'
    }
]
//homepage
export default function HomePage() {
    const [show, setShow] = useState(false)
    const userEmail = useSelector((state) => state.orders.userEmail)
    const navigate = useNavigate()

    // Fetch carousel slides from backend
    const [slides, setSlides] = useState([])
    const [slidesLoaded, setSlidesLoaded] = useState(false)

    useEffect(() => {
        axios.get(`${BASE_URL}/carousel`)
            .then(res => {
                setSlides(Array.isArray(res.data) ? res.data : [])
            })
            .catch(() => {
                setSlides([]) // falls back to hardcoded on error
            })
            .finally(() => setSlidesLoaded(true))
    }, [])

    // Use live slides if any exist, otherwise fallback
    const activeSlides = slides.length > 0 ? slides : FALLBACK_SLIDES

    return (
        <div style={{ background: 'var(--jw-white)' }}>
            <NavBar handleShow={() => setShow(true)} />

            {/* ── HERO CAROUSEL ── */}
            <div className="carousel-hero">
                <Carousel fade interval={5000} pause="hover" controls indicators>
                    {activeSlides.map((slide, i) => (
                        <Carousel.Item key={slide.id || i}>
                            <div className="carousel-image-container">
                                <img
                                    src={slide.pic}
                                    alt={slide.caption || 'Jiggy Wears'}
                                    className="carousel-image"
                                    onError={e => { e.target.style.opacity = '0' }}
                                />
                                {/* Gradient overlay so text is readable */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 65%)',
                                    pointerEvents: 'none'
                                }} />
                            </div>

                            {/* Caption */}
                            <div className="carousel-caption-custom">
                                {slide.caption && (
                                    <p style={{
                                        fontSize: '0.6rem', letterSpacing: '4px',
                                        textTransform: 'uppercase', color: 'var(--jw-gold)',
                                        marginBottom: '10px', fontFamily: 'Jost, sans-serif'
                                    }}>
                                        {slide.caption}
                                    </p>
                                )}
                                <h2 style={{
                                    fontFamily: 'Cormorant Garamond, serif',
                                    fontWeight: 300,
                                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                                    color: '#fff', letterSpacing: '3px',
                                    lineHeight: 1, marginBottom: '24px'
                                }}>
                                    The Jiggy<br />Standard
                                </h2>
                                {slide.cta_text && (
                                    <button
                                        onClick={() => navigate(slide.cta_path || '/home')}
                                        style={{
                                            background: 'transparent',
                                            border: '1px solid rgba(255,255,255,0.7)',
                                            color: '#fff', padding: '11px 32px',
                                            fontSize: '0.65rem', letterSpacing: '2.5px',
                                            textTransform: 'uppercase', cursor: 'pointer',
                                            fontFamily: 'Jost, sans-serif', transition: 'all 0.25s ease'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'var(--jw-gold)'
                                            e.currentTarget.style.borderColor = 'var(--jw-gold)'
                                            e.currentTarget.style.color = '#000'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'transparent'
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'
                                            e.currentTarget.style.color = '#fff'
                                        }}
                                    >
                                        {slide.cta_text}
                                    </button>
                                )}
                            </div>

                            {/* Brand mark */}
                            <div style={{
                                position: 'absolute', bottom: '20px', right: '28px',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                color: 'rgba(255,255,255,0.3)', fontSize: '0.55rem',
                                letterSpacing: '2px', textTransform: 'uppercase',
                                fontFamily: 'Jost, sans-serif', zIndex: 5
                            }}>
                                <div style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
                                The Jiggy Standard
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            {/* ── MARQUEE ── */}
            <div style={{ background: 'var(--jw-gold)', padding: '0.65rem 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div style={{
                    display: 'inline-block', animation: 'marquee 30s linear infinite',
                    fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase',
                    fontWeight: 700, color: '#000', fontFamily: 'Jost, sans-serif'
                }}>
                    {Array(8).fill('We are building a commuinty  —  New Drops Weekly  —  Shop Men · Shop Women  —  The Jiggy Standard  — ').join('')}
                </div>
            </div>

            {/* ── WELCOME (logged in only) ── */}
            {userEmail && (
                <div style={{ background: 'linear-gradient(135deg, var(--jw-black) 0%, #1a1208 100%)', padding: '2rem 0', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.6rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '6px', fontFamily: 'Jost, sans-serif' }}>
                        Welcome Back
                    </p>
                    <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '1.8rem', color: '#fff', letterSpacing: '2px', marginBottom: 0 }}>
                        {userEmail}
                    </h2>
                </div>
            )}

            {/* ── FEATURED PRODUCTS ── */}
            <div style={{ background: 'var(--jw-white)' }}>
                <Container>
                    <div style={{ textAlign: 'center', padding: '3.5rem 0 2rem' }}>
                        <p style={{ fontSize: '0.58rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--jw-text-muted)', marginBottom: '10px', fontFamily: 'Jost, sans-serif' }}>
                            Curated for You
                        </p>
                        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--jw-text)', letterSpacing: '2px', marginBottom: '14px' }}>
                            Featured Pieces
                        </h2>
                        <div style={{ width: '36px', height: '2px', background: 'var(--jw-gold)', margin: '0 auto' }} />
                    </div>
                </Container>

                <Container fluid className="px-0">
                    <Row className="profile-section mx-0">
                        <ProfileMianBody />
                        <CreateOrderModal show={show} handleClose={() => setShow(false)} />
                    </Row>
                </Container>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '2rem 0 3.5rem', flexWrap: 'wrap' }}>
                    {[
                        { label: 'Shop Men', path: '/men', filled: true },
                        { label: 'Shop Women', path: '/women', filled: false }
                    ].map(btn => (
                        <button key={btn.label} onClick={() => navigate(btn.path)}
                            style={{
                                background: btn.filled ? 'var(--jw-black)' : 'transparent',
                                border: btn.filled ? 'none' : '1px solid var(--jw-text)',
                                color: btn.filled ? '#fff' : 'var(--jw-text)',
                                padding: '13px 40px', fontSize: '0.68rem', letterSpacing: '2.5px',
                                textTransform: 'uppercase', cursor: 'pointer',
                                fontFamily: 'Jost, sans-serif', transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'var(--jw-gold)'
                                e.currentTarget.style.borderColor = 'var(--jw-gold)'
                                e.currentTarget.style.color = '#000'
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = btn.filled ? 'var(--jw-black)' : 'transparent'
                                e.currentTarget.style.borderColor = btn.filled ? 'transparent' : 'var(--jw-text)'
                                e.currentTarget.style.color = btn.filled ? '#fff' : 'var(--jw-text)'
                            }}>
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── BRAND PROMISE ── */}
            <div style={{ background: 'var(--jw-black)', padding: '3rem 0' }}>
                <Container>
                    <Row className="text-center g-4">
                        {[
                            { icon: 'bi-truck', title: 'Lagos Delivery', sub: '₦6,000 · 1–3 days' },
                            { icon: 'bi-shield-check', title: 'Secure Payment', sub: 'Paystack protected' },
                            { icon: 'bi-arrow-counterclockwise', title: '48hr Returns', sub: 'Hassle-free' },
                            { icon: 'bi-whatsapp', title: 'WhatsApp Support', sub: '+234 916 281 7078' }
                        ].map(item => (
                            <Col key={item.title} md={3} sm={6}>
                                <i className={`bi ${item.icon}`} style={{ fontSize: '1.3rem', color: 'var(--jw-gold)', display: 'block', marginBottom: '8px' }}></i>
                                <p style={{ fontSize: '0.68rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#fff', fontFamily: 'Jost, sans-serif', marginBottom: '3px', fontWeight: 500 }}>
                                    {item.title}
                                </p>
                                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'Jost, sans-serif', marginBottom: 0 }}>
                                    {item.sub}
                                </p>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            <Footer />
        </div>
    )
}