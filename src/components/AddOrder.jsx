import { Card, Button } from 'react-bootstrap'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, deleteProduct } from '../features/orders/orderSlice'
import UpdateProduct from './UpdateProduct'

export default function AddOrder({ order, className }) {
    const dispatch = useDispatch()
    const userEmail = useSelector((state) => state.orders.userEmail)
    const allowedEmail = 'lukzy@p.com'
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedSize, setSelectedSize] = useState('medium')
    const handleAddToCart = () => {
        dispatch(addToCart({ ...order, size: selectedSize }))
        window.dispatchEvent(new CustomEvent('showNotification', {
            detail: { message: `${order.name} (Size : ${selectedSize})added to cart` }
        }))
    }

    const handleDelete = () => {
        if (userEmail === allowedEmail && window.confirm('Delete this product?')) {
            dispatch(deleteProduct(order.id))
        }
    }

    const images = [order.pic, order.backpic].filter(Boolean)

    return (
        <Card className={`product-card ${className || ''}`}>
            {/* Product Image */}
            <div className="product-image-container">
                <Card.Img
                    variant="top"
                    src={images[currentImageIndex]}
                    alt={order.name}
                    className="product-image"
                />

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
                <Card.Title className="product-name">{order.name}</Card.Title>
                <Card.Text className="product-price mb-2">
                    ₦{order.amount.toLocaleString()}
                </Card.Text>
                <Card.Text className="product-description small text-muted mb-3">
                    {order.description}
                </Card.Text>

                <div className='mb-3'>
                    <label className='form-label'> size  </label>
                    <div className='btn-group w-100' role='group'>
                        {['small', 'medium', 'large'].map((size) => (
                            <button
                                key={size}
                                type='button'
                                className={`btn btn-outline-dark ${selectedSize === size ? 'active' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            > {size}</button>
                        ))}

                    </div>
                </div>


                <div className="mt-auto d-flex justify-content-between">
                    <Button
                        variant="outline-dark"
                        size="sm"
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>

                    {userEmail === allowedEmail && (
                        <div>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="me-2"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => setShowUpdateModal(true)}
                            >
                                Edit
                            </Button>
                        </div>
                    )}
                </div>
            </Card.Body>

            {userEmail === allowedEmail && (
                <UpdateProduct
                    product={order}
                    show={showUpdateModal}
                    handleClose={() => setShowUpdateModal(false)}
                />
            )}
        </Card>
    )
}