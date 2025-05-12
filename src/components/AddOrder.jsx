import { Button, Card, Carousel, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react'
import { addToCart, deleteProduct } from "../features/orders/orderSlice";
import UpdateProduct from "./UpdateProduct";

export default function AddOrder({ order }) {
    const dispatch = useDispatch()
    const userEmail = useSelector((state) => state.orders.userEmail)
    const allowedEmail = 'lukzy@p.com'
    const [show, setShow] = useState(false)
    const [index, setIndex] = useState(0)

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex)
    }

    function handleDelete() {
        if (userEmail === allowedEmail) {
            if (window.confirm('Are you sure you want to delete this product?')) {
                dispatch(deleteProduct(order.id))
            }
        } else {
            alert('You are not authorized to delete this product')
        }
    }

    function addItem() {
        dispatch(addToCart(order))
        // Subtle notification instead of alert
        const event = new CustomEvent('showNotification', {
            detail: { message: `${order.name} added to cart` }
        })
        window.dispatchEvent(event)
    }

    return (
        <Card className="luxury-product-card">
            {/* Product Image Carousel */}
            <div className="product-image-container">
                <Carousel
                    activeIndex={index}
                    onSelect={handleSelect}
                    fade
                    controls={false}
                    indicators={false}
                    className="product-carousel"
                >
                    <Carousel.Item>
                        <Image
                            src={order.pic}
                            alt={order.name}
                            className="product-image"
                            loading="lazy"
                        />
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image
                            src={order.backpic}
                            alt={order.name}
                            className="product-image"
                            loading="lazy"
                        />
                    </Carousel.Item>
                </Carousel>
                <div className="carousel-indicators">
                    {[0, 1].map((i) => (
                        <button
                            key={i}
                            className={`indicator ${index === i ? 'active' : ''}`}
                            onClick={() => setIndex(i)}
                            aria-label={`View image ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Product Details */}
            <Card.Body className="product-details">
                <div className="product-header">
                    <Card.Title className="product-name">{order.name}</Card.Title>
                    <Card.Text className="product-price">₦{order.amount.toLocaleString()}</Card.Text>
                </div>

                <Card.Text className="product-description">
                    {order.description}
                </Card.Text>

                <div className="product-actions">
                    <Button
                        variant="outline-dark"
                        className="add-to-cart-btn"
                        onClick={addItem}
                    >
                        <i className="bi bi-bag-plus"></i> Add to Cart
                    </Button>

                    {userEmail === allowedEmail && (
                        <div className="admin-actions">
                            <Button
                                variant="outline-danger"
                                className="action-btn"
                                onClick={handleDelete}
                            >
                                <i className="bi bi-trash"></i>
                            </Button>
                            <Button
                                variant="outline-secondary"
                                className="action-btn"
                                onClick={handleShow}
                            >
                                <i className="bi bi-pencil"></i>
                            </Button>
                        </div>
                    )}
                </div>
            </Card.Body>

            {/* Update Product Modal */}
            {userEmail === allowedEmail && (
                <UpdateProduct product={order} show={show} handleClose={handleClose} />
            )}
        </Card>
    )
}