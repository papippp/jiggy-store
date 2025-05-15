import { Button, Col, Form, ListGroup, Offcanvas, Row } from "react-bootstrap";
import { ChevronDown, ChevronUp, CreditCard, MessageSquare, ShoppingBag, X } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem, updateOrder } from "../features/orders/orderSlice";

export default function OrdersPage({ onShow, onClose }) {
    const orders = useSelector((state) => state.orders.orders);
    const dispatch = useDispatch();

    // Calculate totals
    const subtotal = orders.reduce((sum, order) => sum + (parseInt(order.amount) * order.qty), 0);
    const shippingFee = orders.length > 0 ? 1500 : 0; // Free shipping threshold could be added
    const total = subtotal + shippingFee;

    // Quantity handlers
    const handleIncrease = (id) => dispatch(updateOrder({ id, qty: orders.find(order => order.id === id).qty + 1 }));
    const handleDecrease = (id) => {
        const orderQty = orders.find(order => order.id === id).qty;
        orderQty > 1 ? dispatch(updateOrder({ id, qty: orderQty - 1 })) : dispatch(deleteItem({ id }));
    };

    // WhatsApp order sharing
    const generateWhatsAppMessage = () => {
        const message = orders.map(order =>
            `• ${order.name} (${order.qty} × ₦${order.amount.toLocaleString()}) = ₦${(order.amount * order.qty).toLocaleString()}`
        ).join('\n');

        const fullMessage = `🛍️ My Jiggy Wears Order:\n${message}\n\nSubtotal: ₦${subtotal.toLocaleString()}\nShipping: ₦${shippingFee.toLocaleString()}\nTotal: ₦${total.toLocaleString()}`;
        window.open(`https://wa.me/601126219810?text=${encodeURIComponent(fullMessage)}`, '_blank');
    };

    // Paystack payment
    const handlePaystackPayment = () => {
        const handler = window.PaystackPop.setup({
            key: "pk_test_b54ce5e374814df3d936a647db3b50c115092da4",
            email: "customer@example.com",
            amount: total * 100,
            currency: "NGN",
            ref: `jiggy_order_${new Date().getTime()}`,
            callback: (response) => {
                alert(`Payment successful! Reference: ${response.reference}`);
                onClose();
            },
            onClose: () => alert("Payment process was canceled")
        });
        handler.openIframe();
    };

    return (
        <Offcanvas show={onShow} onHide={onClose} placement="end" className="luxury-side-cart">
            <Offcanvas.Header className="border-bottom">
                <div className="d-flex justify-content-between w-100 align-items-center">
                    <h5 className="mb-0">
                        <ShoppingBag size={20} className="me-2" />
                        YOUR CART ({orders.length})
                    </h5>
                    <Button variant="link" onClick={onClose} className="p-0">
                        <X size={24} />
                    </Button>
                </div>
            </Offcanvas.Header>

            <Offcanvas.Body className="d-flex flex-column">
                {orders.length > 0 ? (
                    <>
                        <ListGroup variant="flush" className="flex-grow-1 overflow-auto">
                            {orders.map((order) => (
                                <ListGroup.Item key={order.id} className="border-0 py-3 px-0">
                                    <Row className="align-items-center">
                                        <Col xs={3}>
                                            <div
                                                className="bg-light"
                                                style={{
                                                    height: '80px',
                                                    backgroundImage: `url(${order.image || 'https://via.placeholder.com/150'})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            ></div>
                                        </Col>
                                        <Col xs={6}>
                                            <h6 className="mb-1">{order.name}</h6>
                                            <p className="mb-1">₦{order.amount.toLocaleString()}</p>
                                            <div className="d-flex align-items-center">
                                                <Button
                                                    variant="outline-dark"
                                                    size="sm"
                                                    className="p-1"
                                                    onClick={() => handleDecrease(order.id)}
                                                >
                                                    <ChevronDown size={16} />
                                                </Button>
                                                <span className="mx-2">{order.qty}</span>
                                                <Button
                                                    variant="outline-dark"
                                                    size="sm"
                                                    className="p-1"
                                                    onClick={() => handleIncrease(order.id)}
                                                >
                                                    <ChevronUp size={16} />
                                                </Button>
                                            </div>
                                        </Col>
                                        <Col xs={3} className="text-end">
                                            <Button
                                                variant="link"
                                                className="text-danger p-0"
                                                onClick={() => dispatch(deleteItem({ id: order.id }))}
                                            >
                                                <X size={18} />
                                            </Button>
                                            <div className="mt-2">
                                                ₦{(order.amount * order.qty).toLocaleString()}
                                            </div>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                        <div className="border-top pt-3">
                            <Form.Group className="mb-3">
                                <Form.Control placeholder="Discount Code" className="rounded-0" />
                            </Form.Group>

                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal</span>
                                <span>₦{subtotal.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Shipping</span>
                                <span>₦{shippingFee.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold mb-4">
                                <span>Total</span>
                                <span>₦{total.toLocaleString()}</span>
                            </div>

                            <Button
                                variant="dark"
                                className="w-100 py-3 rounded-0 mb-3"
                                onClick={handlePaystackPayment}
                            >
                                <CreditCard size={18} className="me-2" />
                                PROCEED TO CHECKOUT
                            </Button>

                            <Button
                                variant="outline-dark"
                                className="w-100 py-3 rounded-0"
                                onClick={generateWhatsAppMessage}
                            >
                                <MessageSquare size={18} className="me-2" />
                                SHARE ORDER
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center my-auto py-5">
                        <ShoppingBag size={48} className="mb-4 text-muted" />
                        <h5 className="mb-3">YOUR CART IS EMPTY</h5>
                        <p className="text-muted mb-4">
                            Continue shopping to add items to your cart
                        </p>
                        <Button variant="outline-dark" className="px-5" onClick={onClose}>
                            CONTINUE SHOPPING
                        </Button>
                    </div>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
}