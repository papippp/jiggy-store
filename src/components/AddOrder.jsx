import { Modal, Button } from 'react-bootstrap'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToCart, deleteProduct } from '../features/orders/orderSlice'
import UpdateProduct from './UpdateProduct'
import isNewArrival from '../utils/isNewArrival'
import { isProductAvailable, isSizeAvailable, parseStock } from '../utils/stockHelper'

export default function AddOrder({ order, className }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAdmin = useSelector((state) => state.orders.isAdmin)

    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedSize, setSelectedSize] = useState('') // ← empty, user must choose
    const [addedFeedback, setAddedFeedback] = useState(false)
    const [imgError, setImgError] = useState(false)
    const [sizeError, setSizeError] = useState(false)

    const stock = parseStock(order.stock)
    const fullyUnavailable = !isProductAvailable(stock)
    const images = [order.pic, order.backpic].filter(Boolean)
    const isNew = isNewArrival(order.created_at)

    // Get sizes from stock object keys — works for any sizes admin entered
    const sizes = stock ? Object.keys(stock) : []

    function handleAddToCart() {
        if (fullyUnavailable) return
        if (!selectedSize) {
            setSizeError(true)
            setTimeout(() => setSizeError(false), 1500)
            return
        }
        if (!isSizeAvailable(stock, selectedSize)) return
        dispatch(addToCart({ ...order, size: selectedSize }))
        window.dispatchEvent(new CustomEvent('showNotification', {
            detail: { message: `${order.name} (${selectedSize}) added to cart` }
        }))
        setAddedFeedback(true)
        setTimeout(() => setAddedFeedback(false), 2000)
    }

    function confirmDelete() {
        dispatch(deleteProduct(order.id))
        window.dispatchEvent(new CustomEvent('showNotification', {
            detail: { message: `${order.name} deleted.`, type: 'error' }
        }))
        setShowDeleteConfirm(false)
    }

    return (
        <>
            <div className={`product-card-wrap ${className || ''}`}>

                {/* ── IMAGE ── */}
                <div className="product-image-container"
                    onClick={() => navigate(`/product/${order.id}`)}>
                    {images.length > 0 && !imgError ? (
                        <img
                            src={images[currentImageIndex]}
                            alt={order.name}
                            className="product-image"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center',
                            height: '100%', color: '#ccc', gap: '6px'
                        }}>
                            <i className="bi bi-image" style={{ fontSize: '2rem' }}></i>
                            <span style={{ fontSize: '0.6rem', letterSpacing: '1px' }}>No image</span>
                        </div>
                    )}

                    {isNew && !fullyUnavailable && <span className="new-badge">New</span>}
                    {fullyUnavailable && <span className="sold-out-badge">Sold Out</span>}

                    {images.length > 1 && (
                        <div className="image-indicators">
                            {images.map((_, i) => (
                                <button key={i}
                                    className={`indicator ${currentImageIndex === i ? 'active' : ''}`}
                                    onClick={e => { e.stopPropagation(); setCurrentImageIndex(i) }}
                                />
                            ))}
                        </div>
                    )}

                    {isAdmin && (
                        <div onClick={e => e.stopPropagation()}
                            style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', zIndex: 3 }}>
                            <button onClick={() => setShowUpdateModal(true)}
                                style={{ width: '26px', height: '26px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                                <i className="bi bi-pencil"></i>
                            </button>
                            <button onClick={() => setShowDeleteConfirm(true)}
                                style={{ width: '26px', height: '26px', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc3545' }}>
                                <i className="bi bi-trash"></i>
                            </button>
                        </div>
                    )}
                </div>

                {/* ── INFO BLOCK ── */}
                <div className="product-info-block">
                    <p className="product-name" onClick={() => navigate(`/product/${order.id}`)}>
                        {order.name}
                    </p>
                    <p className="product-price">
                        ₦{Number(order.amount).toLocaleString()}
                    </p>

                    {/* Dynamic size row — reads from stock keys */}
                    {sizes.length > 0 && (
                        <div className="size-row">
                            {sizes.map(size => {
                                const available = isSizeAvailable(stock, size)
                                const isSelected = selectedSize === size && available
                                return (
                                    <button
                                        key={size}
                                        className={`size-pill ${isSelected ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}
                                        disabled={!available}
                                        onClick={() => {
                                            if (available) {
                                                setSelectedSize(size)
                                                setSizeError(false)
                                            }
                                        }}
                                        style={{
                                            // Highlight in red briefly if user clicks add without selecting
                                            outline: sizeError && !selectedSize ? '1.5px solid #dc3545' : 'none'
                                        }}
                                    >
                                        {size}
                                    </button>
                                )
                            })}
                        </div>
                    )}

                    <button
                        className={`atc-btn ${addedFeedback ? 'added' : ''} ${fullyUnavailable ? 'sold' : ''}`}
                        onClick={handleAddToCart}
                        disabled={fullyUnavailable}
                    >
                        {fullyUnavailable
                            ? 'Sold Out'
                            : addedFeedback
                                ? '✓ Added'
                                : selectedSize
                                    ? `Add to Cart`
                                    : 'Select Size'
                        }
                    </button>
                </div>
            </div>

            {isAdmin && (
                <UpdateProduct
                    product={order}
                    show={showUpdateModal}
                    handleClose={() => setShowUpdateModal(false)}
                />
            )}

            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <i className="bi bi-trash" style={{ fontSize: '1.5rem', color: '#dc3545', display: 'block', marginBottom: '12px' }}></i>
                    <p style={{ fontWeight: 500, marginBottom: '4px' }}>Delete product?</p>
                    <p className="text-muted mb-4" style={{ fontSize: '0.8rem' }}>
                        <strong>{order.name}</strong> will be permanently removed.
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                        <Button variant="danger" size="sm" style={{ borderRadius: 0 }} onClick={confirmDelete}>Delete</Button>
                        <Button variant="outline-secondary" size="sm" style={{ borderRadius: 0 }} onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}