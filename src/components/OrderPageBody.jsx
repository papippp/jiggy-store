import { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteItem, updateOrder } from "../features/orders/orderSlice";

export default function OrderPageBody({ order, handleIncrease, handleDecrease }) {
    const dispatch = useDispatch();

    // Start with the size already in the cart item, not empty
    const [selectedSize, setSelectedSize] = useState(order.size || 'medium');

    const handleSizeChange = (newSize) => {
        setSelectedSize(newSize)
        // This actually updates the cart item in Redux + localStorage
        dispatch(updateOrder({ id: order.id, qty: order.qty, size: newSize }))
    }

    const deleteOrder = () => {
        dispatch(deleteItem(order));
    };

    return (
        <Card className="order-card mb-4 shadow-sm" style={{ borderRadius: 0, border: '1px solid var(--jw-border)' }}>
            <Row className="align-items-center g-0">
                <Col xs={4} md={3}>
                    <img
                        src={order.pic}
                        alt={order.name}
                        style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                    />
                </Col>

                <Col xs={8} md={6} className="px-3 py-2">
                    <p style={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        marginBottom: '4px',
                        fontFamily: 'Jost, sans-serif'
                    }}>
                        {order.name}
                    </p>
                    <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--jw-gold-dark)',
                        fontWeight: 700,
                        marginBottom: '12px'
                    }}>
                        ₦{Number(order.amount).toLocaleString()} × {order.qty}
                    </p>

                    {/* Size selector — now actually updates the cart */}
                    <div>
                        <p style={{
                            fontSize: '0.62rem',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: '#888',
                            marginBottom: '6px',
                            fontFamily: 'Jost, sans-serif'
                        }}>
                            Size
                        </p>
                        <div className="d-flex gap-2">
                            {['small', 'medium', 'large'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => handleSizeChange(size)}
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        border: selectedSize === size
                                            ? '2px solid var(--jw-gold)'
                                            : '1px solid #ddd',
                                        backgroundColor: selectedSize === size
                                            ? 'var(--jw-gold)'
                                            : '#fff',
                                        color: selectedSize === size ? '#fff' : '#555',
                                        fontSize: '0.7rem',
                                        cursor: 'pointer',
                                        borderRadius: 0,
                                        fontFamily: 'Jost, sans-serif',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {size[0].toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </Col>

                <Col xs={12} md={3} className="px-3 py-2 d-flex flex-md-column align-items-center justify-content-between gap-2">
                    {/* Quantity controls */}
                    <div className="d-flex align-items-center gap-2">
                        <button
                            onClick={() => handleDecrease(order.id)}
                            style={{
                                width: '32px', height: '32px',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                borderRadius: 0,
                                fontSize: '1rem'
                            }}
                        >
                            −
                        </button>
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            minWidth: '20px',
                            textAlign: 'center'
                        }}>
                            {order.qty}
                        </span>
                        <button
                            onClick={() => handleIncrease(order.id)}
                            style={{
                                width: '32px', height: '32px',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                borderRadius: 0,
                                fontSize: '1rem'
                            }}
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={deleteOrder}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc3545',
                            fontSize: '0.72rem',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            fontFamily: 'Jost, sans-serif',
                            padding: '4px 0'
                        }}
                    >
                        × Remove
                    </button>
                </Col>
            </Row>
        </Card>
    );
}