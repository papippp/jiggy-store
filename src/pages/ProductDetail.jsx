import NavBar from '../components/NavBar'
import { useState } from 'react'
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { addToCart } from '../features/orders/orderSlice'
import { ArrowLeft, ShoppingBag } from 'react-feather'
import isNewArrival from '../utils/isNewArrival'
import Footer from '../components/Footer'
import { parseStock, isProductAvailable, isSizeAvailable } from '../utils/stockHelper'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const products = useSelector((state) => state.orders.products)
    const loading = useSelector((state) => state.orders.loading)
    const product = products.find(p => String(p.id) === String(id))

    const [selectedSize, setSelectedSize] = useState('') // ← empty, user must choose
    const [currentImage, setCurrentImage] = useState(0)
    const [addedFeedback, setAddedFeedback] = useState(false)
    const [sizeError, setSizeError] = useState(false)

    if (loading) {
        return (
            <div className='d-flex flex-column min-vh-100'>
                <NavBar />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <Spinner animation='border' variant='dark' />
                </div>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <NavBar />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <div className="text-center py-5">
                        <i className="bi bi-box" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                        <h4 className="text-muted mt-3 mb-2" style={{ fontWeight: 300, letterSpacing: '2px' }}>
                            Product not found
                        </h4>
                        <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>
                            This item may have been removed or is no longer available.
                        </p>
                        <Button variant="dark" onClick={() => navigate('/home')} style={{ borderRadius: 0, letterSpacing: '1px' }}>
                            Back to Shop
                        </Button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    const stock = parseStock(product.stock)
    const fullyUnavailable = !isProductAvailable(stock)
    const images = [product.pic, product.backpic].filter(Boolean)
    const isNew = isNewArrival(product.created_at)

    // Get sizes from stock object keys dynamically
    const sizes = stock ? Object.keys(stock) : []

    function handleAddToCart() {
        if (fullyUnavailable) return
        if (!selectedSize) {
            setSizeError(true)
            setTimeout(() => setSizeError(false), 2000)
            return
        }
        if (!isSizeAvailable(stock, selectedSize)) return
        dispatch(addToCart({ ...product, size: selectedSize }))
        window.dispatchEvent(new CustomEvent('showNotification', {
            detail: { message: `${product.name} (${selectedSize}) added to cart` }
        }))
        setAddedFeedback(true)
        setTimeout(() => setAddedFeedback(false), 2000)
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="flex-grow-1">
                <Container className="py-5">
                    <Button variant="link" className="text-dark p-0 mb-4 d-flex align-items-center"
                        style={{ textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '1px' }}
                        onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} className="me-2" />
                        BACK
                    </Button>

                    <Row className="g-5">
                        {/* ── Images ── */}
                        <Col md={6}>
                            <div style={{ position: 'relative', paddingTop: '125%', backgroundColor: '#f8f8f8', overflow: 'hidden' }}>
                                {images.length > 0 && (
                                    <img src={images[currentImage]} alt={product.name}
                                        onError={e => { e.target.style.display = 'none' }}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }} />
                                )}
                                {isNew && !fullyUnavailable && (
                                    <span style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#000', color: '#fff', fontSize: '0.65rem', letterSpacing: '2px', padding: '5px 10px', fontWeight: 600 }}>
                                        NEW ARRIVAL
                                    </span>
                                )}
                                {fullyUnavailable && (
                                    <span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: 'var(--jw-sold-out)', color: '#fff', fontSize: '0.65rem', letterSpacing: '2px', padding: '5px 10px', fontWeight: 600 }}>
                                        SOLD OUT
                                    </span>
                                )}
                            </div>

                            {images.length > 1 && (
                                <div className="d-flex gap-2 mt-3">
                                    {images.map((img, idx) => (
                                        <div key={idx} onClick={() => setCurrentImage(idx)}
                                            style={{ width: '70px', height: '85px', backgroundImage: `url(${img})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#f8f8f8', cursor: 'pointer', border: currentImage === idx ? '2px solid #000' : '2px solid transparent', opacity: currentImage === idx ? 1 : 0.55, transition: 'all 0.2s ease' }} />
                                    ))}
                                </div>
                            )}
                        </Col>

                        {/* ── Info ── */}
                        <Col md={6} className="d-flex flex-column justify-content-center">
                            {product.category && product.category !== 'other' && (
                                <p style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#888', marginBottom: '8px' }}>
                                    {product.gender === 'male' ? 'Men' : product.gender === 'female' ? 'Women' : 'Unisex'} — {product.category}
                                </p>
                            )}

                            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '2rem', letterSpacing: '1px', marginBottom: '12px' }}>
                                {product.name}
                            </h1>

                            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--jw-gold-dark)', marginBottom: '24px' }}>
                                ₦{Number(product.amount).toLocaleString()}
                            </p>

                            <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '32px', fontSize: '0.95rem' }}>
                                {product.description}
                            </p>

                            {/* ── Dynamic size selector ── */}
                            {sizes.length > 0 && (
                                <div className="mb-4">
                                    <p style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', fontFamily: 'Jost, sans-serif' }}>
                                        SIZE
                                        {selectedSize && <span style={{ color: 'var(--jw-gold-dark)', marginLeft: '8px' }}>— {selectedSize}</span>}
                                    </p>

                                    {sizeError && (
                                        <p style={{ fontSize: '0.72rem', color: '#dc3545', marginBottom: '8px', letterSpacing: '0.5px' }}>
                                            Please select a size before adding to cart
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {sizes.map(size => {
                                            const available = isSizeAvailable(stock, size)
                                            const isSelected = selectedSize === size
                                            return (
                                                <button
                                                    key={size}
                                                    onClick={() => {
                                                        if (available) {
                                                            setSelectedSize(size)
                                                            setSizeError(false)
                                                        }
                                                    }}
                                                    disabled={!available}
                                                    style={{
                                                        minWidth: '52px',
                                                        height: '52px',
                                                        padding: '0 12px',
                                                        border: isSelected && available
                                                            ? '2px solid var(--jw-gold)'
                                                            : sizeError && !selectedSize
                                                                ? '1px solid #dc3545'
                                                                : '1px solid #ccc',
                                                        backgroundColor: !available ? '#f5f5f5'
                                                            : isSelected ? 'var(--jw-gold)' : '#fff',
                                                        color: !available ? '#bbb'
                                                            : isSelected ? '#000' : '#333',
                                                        fontSize: '0.78rem',
                                                        letterSpacing: '1px',
                                                        textTransform: 'uppercase',
                                                        cursor: available ? 'pointer' : 'not-allowed',
                                                        transition: 'all 0.2s ease',
                                                        textDecoration: !available ? 'line-through' : 'none',
                                                        fontFamily: 'Jost, sans-serif',
                                                        fontWeight: isSelected ? 700 : 400,
                                                        borderRadius: 0
                                                    }}
                                                >
                                                    {size}
                                                </button>
                                            )
                                        })}
                                    </div>

                                    {fullyUnavailable && (
                                        <p style={{ fontSize: '0.7rem', color: 'var(--jw-sold-out)', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '8px' }}>
                                            This product is sold out
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Add to cart */}
                            <Button
                                onClick={handleAddToCart}
                                disabled={fullyUnavailable}
                                style={{
                                    backgroundColor: fullyUnavailable ? '#ccc'
                                        : addedFeedback ? 'var(--jw-success)'
                                            : sizeError ? '#dc3545'
                                                : 'var(--jw-gold)',
                                    border: 'none', borderRadius: 0,
                                    padding: '16px 32px', fontSize: '0.85rem',
                                    letterSpacing: '2px', cursor: fullyUnavailable ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.3s ease',
                                    width: '100%', fontFamily: 'Jost, sans-serif'
                                }}>
                                <ShoppingBag size={16} className="me-2" />
                                {fullyUnavailable ? 'SOLD OUT'
                                    : addedFeedback ? 'ADDED ✓'
                                        : sizeError ? 'SELECT A SIZE FIRST'
                                            : selectedSize ? `ADD TO CART — ${selectedSize}`
                                                : 'SELECT A SIZE'}
                            </Button>

                            <div className="mt-4 pt-4" style={{ borderTop: '1px solid #eee', fontSize: '0.8rem', color: '#888', letterSpacing: '0.5px' }}>
                                <p className="mb-1">📦 Lagos delivery: ₦6,000</p>
                                <p className="mb-0">📱 WhatsApp order available at checkout</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer />
        </div>
    )
}