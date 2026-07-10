import NavBar from '../components/NavBar'
import { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { addToCart } from '../features/orders/orderSlice'
import { ArrowLeft, ShoppingBag } from 'react-feather'
import isNewArrival from '../utils/isNewArrival'
import Footer from '../components/Footer'
import { parseStock,isProductAvailable,isSizeAvailable } from '../utils/stockHelper'

export default function ProductDetail() {
    const {id} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const products = useSelector((state) => state.orders.products)
    const product = products.find(p => String(p.id) === String(id))
    const [selectedSize, setSelectedSize] = useState('medium')
    const [currentImage, setCurrentImage] = useState(0)
    const [addedFeedback, setAddedFeedback] = useState(false)

    const stock = parseStock(product.stock)
    const fullyUnavailable = !isProductAvailable(stock)
    if (!product) {
        return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar/>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                 <div className='text-center py-5'>
                    <h4 className="text-muted mb-3">Product not found</h4>
                    <Button variant="dark" onClick={() => navigate('/home')} style={{ borderRadius: 0 }}>
                            Back to Shop
                    </Button>
                 </div>
            </div>
            <Footer/>
        </div>
        )
    }

    const images = [product.pic, product.backpic].filter(Boolean)
    const isNew = isNewArrival(product.created_at)
    const handleAddToCart = () => {
        dispatch(addToCart({...product, size : selectedSize}))
        window.dispatchEvent(new CustomEvent('showNotification', {
            detail : {message : `${product.name} (${selectedSize}) added to cart`}
        }))
        setAddedFeedback(true)
        setTimeout(() => setAddedFeedback(false), 2000)
    }


  return (
    <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="flex-grow-1">
                <Container className="py-5">
                    {/* Back button */}
                    <Button
                        variant="link"
                        className="text-dark p-0 mb-4 d-flex align-items-center"
                        style={{ textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '1px' }}
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={16} className="me-2" />
                        BACK
                    </Button>

                    <Row className="g-5">
                        {/* Image column */}
                        <Col md={6}>
                            {/* Main image */}
                            <div
                                style={{
                                    position: 'relative',
                                    paddingTop: '100%',
                                    backgroundColor: '#f8f8f8',
                                    overflow: 'hidden'
                                }}
                            >
                                <img
                                    src={images[currentImage]}
                                    alt={product.name}
                                    style={{
                                        position: 'absolute',
                                        top: 0, left: 0,
                                        width: '100%', height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                {isNew && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '15px', left: '15px',
                                            backgroundColor: '#000',
                                            color: '#fff',
                                            fontSize: '0.65rem',
                                            letterSpacing: '2px',
                                            padding: '5px 10px',
                                            fontWeight: '600',
                                        }}
                                    >
                                        NEW ARRIVAL
                                    </span>
                                )}
                            </div>

                            {/* Thumbnail strip — only if there's a backpic */}
                            {images.length > 1 && (
                                <div className="d-flex gap-2 mt-3">
                                    {images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setCurrentImage(idx)}
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                backgroundImage: `url(${img})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                cursor: 'pointer',
                                                border: currentImage === idx ? '2px solid #000' : '2px solid transparent',
                                                opacity: currentImage === idx ? 1 : 0.6,
                                                transition: 'all 0.2s ease'
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </Col>

                        {/* Info column */}
                        <Col md={6} className="d-flex flex-column justify-content-center">
                            {/* Category badge */}
                            {product.category && product.category !== 'other' && (
                                <p
                                    style={{
                                        fontSize: '0.75rem',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        color: '#888',
                                        marginBottom: '8px'
                                    }}
                                >
                                    {product.category}
                                </p>
                            )}

                            <h1
                                style={{
                                    fontFamily: 'Cormorant Garamond, serif',
                                    fontWeight: 300,
                                    fontSize: '2rem',
                                    letterSpacing: '1px',
                                    marginBottom: '12px'
                                }}
                            >
                                {product.name}
                            </h1>

                            <p
                                style={{
                                    fontSize: '1.4rem',
                                    fontWeight: '600',
                                    marginBottom: '24px'
                                }}
                            >
                                ₦{Number(product.amount).toLocaleString()}
                            </p>

                            <p
                                style={{
                                    color: '#555',
                                    lineHeight: '1.8',
                                    marginBottom: '32px',
                                    fontSize: '0.95rem'
                                }}
                            >
                                {product.description}
                            </p>

                            {/* Size selector */}
                            <div className="mb-4">
    <p style={{ fontSize: '0.75rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
        SIZE
    </p>
    <div className="d-flex gap-2">
        {['small', 'medium', 'large'].map(size => {
            const available = isSizeAvailable(stock, size)
            return (
                <button
                    key={size}
                    onClick={() => available && setSelectedSize(size)}
                    disabled={!available}
                    style={{
                        width: '52px',
                        height: '52px',
                        border: selectedSize === size && available ? '2px solid var(--jw-gold)' : '1px solid #ccc',
                        backgroundColor: !available ? '#f5f5f5' : selectedSize === size ? 'var(--jw-gold)' : '#fff',
                        color: !available ? '#bbb' : selectedSize === size ? '#fff' : '#000',
                        fontSize: '0.75rem',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        cursor: available ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        textDecoration: !available ? 'line-through' : 'none',
                        fontFamily: 'Jost, sans-serif'
                    }}
                >
                    {size[0].toUpperCase()}
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

                            {/* Add to cart */}
                            <Button
    onClick={handleAddToCart}
    disabled={fullyUnavailable || !isSizeAvailable(stock, selectedSize)}
   style={{
    backgroundColor: fullyUnavailable ? '#ccc' : addedFeedback ? 'var(--jw-success)' : 'var(--jw-gold)',
    border: 'none',
    borderRadius: 0,
    padding: '16px 32px',
    fontSize: '0.85rem',
    letterSpacing: '2px',
    cursor: fullyUnavailable ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.3s ease',
    width: '100%',        // ← full width always
    maxWidth: '100%',     // ← remove the 320px cap
    fontFamily: 'Jost, sans-serif'
}}
>
    <ShoppingBag size={16} className="me-2" />
    {fullyUnavailable ? 'SOLD OUT' : addedFeedback ? 'ADDED ✓' : 'ADD TO CART'}
</Button>
                            {/* Delivery info */}
                            <div
                                className="mt-4 pt-4"
                                style={{ borderTop: '1px solid #eee', fontSize: '0.8rem', color: '#888', letterSpacing: '0.5px' }}
                            >
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
