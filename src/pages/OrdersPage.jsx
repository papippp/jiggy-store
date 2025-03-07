import { useState } from "react";
import { Button, Card, Col, Container, ListGroup, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import OrderPageBody from "../components/OrderPageBody";
import { deleteItem, updateOrder } from "../features/orders/orderSlice";


export default function OrdersPage() {
    const orders = useSelector((state) => state.orders.orders);
    let subtotal = 0;
    orders.forEach((order) => {
        subtotal += parseInt(order.amount) * order.qty;
    });

    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    const handleIncrease = (id) => {
        dispatch(updateOrder({ id, qty: orders.find(order => order.id === id).qty + 1 }));
    };

    const handleDecrease = (id) => {
        const orderQty = orders.find(order => order.id === id).qty;
        if (orderQty > 1) {
            dispatch(updateOrder({ id, qty: orderQty - 1 }));
        } else {
            dispatch(deleteItem({ id }));
        }
    };

    const generateWhatsAppMessage = () => {
        const message = orders.map(order =>
            `${order.name} - Quantity: ${order.qty} - Price: NGN${order.amount * order.qty}`
        ).join('\n');

        const totalMessage = `Total: NGN${subtotal}`;
        const fullMessage = `Here is my order:\n${message}\n${totalMessage}`;

        const encodedMessage = encodeURIComponent(fullMessage);
        const whatsappUrl = `https://wa.me/601126219810?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handlePaystackPayment = () => {
        const handler = window.PaystackPop.setup({
            key: "pk_test_b54ce5e374814df3d936a647db3b50c115092da4", // Replace with your Paystack public key
            email: "customer@example.com", // Replace with the customer's email
            amount: subtotal * 100, // Paystack expects the amount in kobo (100 kobo = 1 NGN)
            currency: "NGN", // Currency to be used for the payment
            ref: `order_${new Date().getTime()}`, // Unique reference for the transaction
            callback: function (response) {
                alert("Payment successful! Reference: " + response.reference);
                // You can make a backend call to save the payment details here
            },
            onClose: function () {
                alert("Payment process was canceled");
            }
        });

        handler.openIframe();
    };


    return (
        <>


            {/* Main Content */}
            <Container fluid className="vh-100 p-4 bg-light">
                <Row className="h-100">
                    {/* Cart Details Section */}
                    <Col sm={12} md={8} className="mb-5">
                        <h2 className="mb-4">Your Cart</h2>
                        {orders.length > 0 ? (

                            orders.map((order) => (
                                <OrderPageBody
                                    key={order.id}
                                    order={order}
                                    handleIncrease={handleIncrease}
                                    handleDecrease={handleDecrease}
                                />
                            ))

                        ) : (
                            <p>Your cart is empty!</p>
                        )}

                        <h4 className="mt-4">Total: NGN{subtotal}</h4>
                        <Button variant="success" onClick={() => setShowModal(true)} className="w-100 mb-3">
                            Proceed to Checkout
                        </Button>
                        <Button variant="info" onClick={generateWhatsAppMessage} className="w-100 mb-3">
                            Send Cart via WhatsApp
                        </Button>

                    </Col>

                    {/* Store Info Section */}
                    <Col sm={12} md={4} className="h-100">
                        <Card className="h-100">
                            <Card.Img
                                variant="top"
                                src="https://res.cloudinary.com/duocpeihb/image/upload/v1730853747/WhatsApp_Image_2024-11-06_at_7.41.51_AM_zkmeqp.jpg"
                                className="img-fluid"
                                style={{ height: '250px', objectFit: 'cover' }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title>Jiggy Store</Card.Title>
                                <Card.Text>Thanks for your patronage with us</Card.Text>
                                <ListGroup className="list-group-flush flex-grow-1">
                                    <ListGroup.Item>Address: 1 Pedro Street, Lekki</ListGroup.Item>
                                    <ListGroup.Item>Contact: jiggy@ppp.com</ListGroup.Item>
                                </ListGroup>
                                <Button variant="outline-success" className="mt-3">
                                    <Link to='/home'></Link>  home page
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Checkout Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please proceed to payment using the button below:</p>
                    <Button
                        variant="primary"
                        onClick={handlePaystackPayment}

                        className="w-100"
                    >
                        Pay with Paystack
                    </Button>
                </Modal.Body>
            </Modal>


        </>
    );
}