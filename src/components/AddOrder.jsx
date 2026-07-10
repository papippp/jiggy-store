import { Card, Button, Modal } from 'react-bootstrap'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, deleteProduct } from '../features/orders/orderSlice'
import UpdateProduct from './UpdateProduct'
import isNewArrival from '../utils/isNewArrival'
import { useNavigate } from 'react-router-dom'
import { isProductAvailable, isSizeAvailable, parseStock } from '../utils/stockHelper'

export default function AddOrder({ order, className }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAdmin = useSelector((state) => state.orders.isAdmin)
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedSize, setSelectedSize] = useState('medium')
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const stock = parseStock(order.stock)
    const fullyUnavailable = !isProductAvailable(stock)
    
    const handleAddToCart = () => {
        if(!isSizeAvailable(stock,selectedSize)) return
        dispatch(addToCart({ ...order, size: selectedSize }))
        window.dispatchEvent(new CustomEvent('showNotification', {
            detail: { message: `${order.name} (Size : ${selectedSize})added to cart` }
        }))
    }
    
    
    const handleDelete = () => {
        if (isAdmin ) {
            setShowDeleteConfirm(true)
        }
    }
    const confirmDelete = () => {
         dispatch(deleteProduct(order.id))
    window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `${order.name} deleted.`, type: 'error' }
    }))
    setShowDeleteConfirm(false)
    }

    const images = [order.pic, order.backpic].filter(Boolean)
    const isNew = isNewArrival(order.created_at)
    return (
         <Card className={`product-card ${className || ''}`}>
            <div className="product-image-container">
                <Card.Img
                    variant="top"
                    src={images[currentImageIndex]}
                    alt={order.name}
                    className="product-image"
                />
                {isNew && !fullyUnavailable && (
                    <span className="new-badge">New</span>
                )}
                {fullyUnavailable && (
                    <span className="sold-out-badge">Sold Out</span>
                )}
                {images.length > 1 && (
                    <div className="image-indicators">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${currentImageIndex === index ? 'active' : ''}`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Card.Body className="d-flex flex-column">
                <Card.Title
                    className="product-name"
                    onClick={() => navigate(`/product/${order.id}`)}
                    style={{ cursor: 'pointer' }}
                >
                    {order.name}
                </Card.Title>
                <Card.Text className="product-price mb-2">
                    ₦{Number(order.amount).toLocaleString()}
                </Card.Text>
                <Card.Text className="product-description small mb-3">
                    {order.description}
                </Card.Text>

                {/* Size selector */}
                <div className="mb-3">
                    <label className="form-label" style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#555' }}>
                        Size
                    </label>
                    <div className="btn-group w-100" role="group">
                        {['small', 'medium', 'large'].map((size) => {
                            const available = isSizeAvailable(stock, size)
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    disabled={!available}
                                    className={`btn btn-outline-dark ${selectedSize === size && available ? 'active' : ''}`}
                                    style={{
                                        opacity: available ? 1 : 0.35,
                                        cursor: available ? 'pointer' : 'not-allowed',
                                        fontSize: '0.72rem',
                                        letterSpacing: '1px',
                                        textDecoration: !available ? 'line-through' : 'none',
                                        position: 'relative'
                                    }}
                                    onClick={() => available && setSelectedSize(size)}
                                >
                                    {size[0].toUpperCase()}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={handleAddToCart}
                        disabled={fullyUnavailable || !isSizeAvailable(stock, selectedSize)}
                        style={{ fontSize: '0.72rem', letterSpacing: '1px' }}
                    >
                        {fullyUnavailable ? 'Sold Out' : 'Add to Cart'}
                    </Button>

                    {isAdmin && (
                        <div>
                            <Button variant="outline-danger" size="sm" className="me-2" onClick={handleDelete}>
                                Delete
                            </Button>
                            <Button variant="outline-secondary" size="sm" onClick={() => setShowUpdateModal(true)}>
                                Edit
                            </Button>
                        </div>
                    )}
                </div>
            </Card.Body>

            {isAdmin && (
                <UpdateProduct
                    product={order}
                    show={showUpdateModal}
                    handleClose={() => setShowUpdateModal(false)}
                />
            )}

            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered size="sm">
                <Modal.Body className="text-center p-4">
                    <p className="mb-3">Delete <strong>{order.name}</strong>?</p>
                    <Button variant="danger" size="sm" className="me-2" onClick={confirmDelete}>Delete</Button>
                    <Button variant="outline-secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                </Modal.Body>
            </Modal>
        </Card>
    )
}