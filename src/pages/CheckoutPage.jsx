import { useState } from "react";
import { Button, Card, Col, Container, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { Truck } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../features/orders/orderSlice";

export default function CheckoutPage() {
    const orders = useSelector((state) => state.orders.orders);
    const generateWhatsAppMessage = () => {
        const message = orders.map(order =>
            `• ${order.name} (Size : ${order.size}) (${order.qty} × ₦${order.amount.toLocaleString()}) = ₦${(order.amount * order.qty).toLocaleString()}`
        ).join('\n');

        const fullMessage = `🛍️ My Jiggy Wears Order:\n${message}\n\nSubtotal: ₦${subtotal.toLocaleString()}\nTotal: ₦${total.toLocaleString()}`;
        window.open(`https://wa.me/2349162817078?text=${encodeURIComponent(fullMessage)}`, '_blank');
    };
    ;
    const [deliveryOption, setDeliveryOption] = useState('lagos');
    const [customerInfo, setCustomerInfo] = useState({
        email: '',
        phone: '',
        address: ''
    });
    const navigate = useNavigate()
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Calculate totals
    const subtotal = orders.reduce((sum, order) => sum + (parseInt(order.amount) * order.qty), 0);
    const shippingFee = deliveryOption === 'lagos' ? 6000 : 0;
    const total = subtotal + shippingFee;
    const [lastReference, setLastReference] = useState('')
    const dispatch = useDispatch()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        // Here you would typically send the order to your backend
        console.log({
            orders,
            customerInfo,
            deliveryOption,
            total
        });
        setShowSuccessModal(true);
    };
    const [paying, setPaying] = useState(false)
    const handlePaystackPayment = () => {
        if (!customerInfo.email) {
            window.dispatchEvent(new CustomEvent('showNotification', {
                detail: { message: 'Please enter your email address first.', type: 'error' }
            }))
            return
        }
        setPaying(true)

        const handler = window.PaystackPop.setup({
            key: "pk_live_d115a4925bdaddc85267c985ed933e68aa820c8d",
            email: customerInfo.email,
            amount: total * 100,
            currency: "NGN",
            ref: `jiggy_order_${new Date().getTime()}`,
            callback: (response) => {
                // No async here — fire and forget the save, don't await it
                setPaying(false)
                axios.post('https://jiggy-wears-api.onrender.com/order', {
                    reference: response.reference,
                    customer_email: customerInfo.email,
                    customer_phone: customerInfo.phone,
                    delivery_address: customerInfo.address,
                    items: orders.map(o => ({
                        name: o.name,
                        size: o.size,
                        qty: o.qty,
                        amount: o.amount,
                        pic: o.pic
                    })),
                    subtotal,
                    shipping_fee: shippingFee,
                    total
                }).catch(err => console.error('Order save failed:', err))

                // These run immediately without waiting for axios
                window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: { message: `Payment successful! Ref: ${response.reference}` }
                }))
                setLastReference(response.reference)
                dispatch(clearCart())
                setShowSuccessModal(true)
            },
            onClose: () => {
                setPaying(false)
                window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: { message: 'Payment cancelled.', type: 'error' }
                }))
            }
        })
        handler.openIframe()
    }
    const [transferModal, setTransferModal] = useState(false)

    return (
        <>
            <div className="d-flex flex-column min-vh-100">
                <NavBar />
                <div className="flex-grow-1 py-4">


                    <Container className="py-5">
                        <Row>
                            <Col lg={8} className="order-2 order-lg-1">
                                <Card className="mb-4">
                                    <Card.Body>
                                        <h4 className="mb-4">Delivery Options</h4>

                                        <div className="mb-4">


                                            <Button

                                                className="w-100 text-start p-3"
                                                onClick={() => setDeliveryOption('lagos')}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <Truck size={20} className="me-3" />
                                                    <div>
                                                        <h5 className="mb-1">Delivery within Lagos</h5>
                                                        <p className="mb-0 text-muted">₦6,000 delivery fee</p>
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>

                                        <h4 className="mb-4">Contact Information</h4>
                                        <Form onSubmit={handleSubmitOrder}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email address (for payment receipt)</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    placeholder="your@email.com"
                                                    value={customerInfo.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Phone number </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="phone"
                                                    placeholder="07076347635"
                                                    value={customerInfo.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Delivery Address </Form.Label>
                                                <Form.Control
                                                    as='textarea'
                                                    rows={3}
                                                    name="address"
                                                    value={customerInfo.address}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>

                                            <div className="d-grid gap-2">
                                                <Button
                                                    onClick={handlePaystackPayment}
                                                    disabled={paying}
                                                    variant="dark"
                                                    style={{
                                                        borderRadius: 0,
                                                        width: '100%',
                                                        padding: '14px',
                                                        fontSize: '0.85rem',
                                                        letterSpacing: '2px',
                                                        backgroundColor: paying ? '#555' : 'var(--jw-gold)',
                                                        border: 'none',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                >
                                                    {paying ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        `Pay ₦${total.toLocaleString()}`
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="dark"
                                                    size="lg"
                                                    type="button"
                                                    onClick={generateWhatsAppMessage}
                                                >
                                                    share order on whatsapp
                                                </Button>

                                                <Button
                                                    variant="dark"
                                                    size="lg"
                                                    type="button"
                                                    onClick={() => setTransferModal(true)}
                                                >
                                                    transfer to us directly
                                                </Button>
                                                <Modal show={transferModal} onHide={() => setTransferModal(false)} centered>
                                                    <Modal.Header className="bg-gray-100 border-b border-gray-200">
                                                        <h5 className="text-lg font-semibold text-gray-800 w-100 text-center">
                                                            Transfer Payment Details
                                                        </h5>
                                                    </Modal.Header>
                                                    <Modal.Body className="p-6 bg-white">
                                                        <div className="space-y-4">
                                                            <h6 className="text-md font-medium text-gray-700">Bank Details</h6>
                                                            <div className="space-y-2">
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-semibold">Account Number:</span> 6989081002
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-semibold">Account Name:</span> Jiggy Official Wears
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-semibold">Bank:</span> Moniepoint MFB
                                                                </p>
                                                            </div>
                                                            <hr className="my-4 border-gray-200" />
                                                            <h6 className="text-md font-medium text-gray-700">Contact Information</h6>
                                                            <div className="space-y-2">
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-semibold">WhatsApp:</span> +234-916-281-7078
                                                                </p>
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-semibold">Email:</span> riddick803@gmail.com
                                                                </p>
                                                                <p className="text-sm text-gray-500 italic">
                                                                    Please share your payment receipt with us via WhatsApp or email.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Modal.Body>
                                                    <Modal.Footer className="bg-gray-100 border-t border-gray-200">
                                                        <button
                                                            onClick={() => setTransferModal(false)}
                                                        >
                                                            Close
                                                        </button>
                                                    </Modal.Footer>
                                                </Modal>

                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col lg={4} className="order-1 order-lg-2 mb-4">
                                <Card>
                                    <Card.Body>
                                        <h4 className="mb-4">Order Summary</h4>

                                        <ListGroup variant="flush">
                                            {orders.map((order) => (
                                                <ListGroup.Item key={order.id} className="px-0">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <div className="d-flex">
                                                            <div
                                                                className="bg-light me-3"
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    backgroundImage: `url(${order.pic || order.image || 'https://placehold.co/150x150'})`,
                                                                    backgroundSize: 'cover',
                                                                    backgroundPosition: 'center'
                                                                }}
                                                            ></div>
                                                            <div>
                                                                <h6 className="mb-1">{order.name}</h6>
                                                                <p className="mb-1 small text-muted">Size: {order.size}</p>
                                                                <div className="d-flex align-items-center">

                                                                    <span className="mx-2">{order.qty}</span>

                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-end">
                                                            <div>₦{(order.amount * order.qty).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>

                                        <div className="mt-4">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Subtotal</span>
                                                <span>₦{subtotal.toLocaleString()}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Shipping</span>
                                                <span>{shippingFee > 0 ? `₦${shippingFee.toLocaleString()}` : 'Free'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between fw-bold mt-3 pt-2 border-top">
                                                <span>Total</span>
                                                <span>₦{total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        {/* Success Modal */}
                        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                            <Modal.Body className="text-center p-5">
                                <div className="mb-4">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#28a745" />
                                    </svg>
                                </div>
                                <h4 className="mb-3">Order Submitted!</h4>
                                <p className="text-muted mb-1" style={{ fontSize: '0.85rem' }}>
                                    Save your reference number to track your order:
                                </p>
                                <p className="fw-bold mb-4" style={{ letterSpacing: '1px', fontSize: '0.9rem' }}>
                                    {lastReference}
                                </p>
                                <div className="d-grid gap-2">
                                    <Button
                                        variant="dark"
                                        style={{ borderRadius: 0 }}
                                        onClick={() => {
                                            setShowSuccessModal(false)
                                            navigate('/track')
                                        }}
                                    >
                                        Track My Order
                                    </Button>
                                    <Button
                                        variant="outline-dark"
                                        style={{ borderRadius: 0 }}
                                        onClick={() => {
                                            setShowSuccessModal(false)
                                            navigate('/home')
                                        }}
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>

                            </Modal.Body>
                        </Modal>
                    </Container>
                </div>
                <Footer />
            </div>

        </>
    );
}