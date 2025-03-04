import { Button, Col, Container, Row, Modal, Navbar, Nav, Card, ListGroup, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderPageBody from "../components/OrderPageBody";
import { deleteItem, updateOrder } from "../features/orders/orderSlice";
import { useState } from "react";
import { Link } from "react-router-dom";
//import { usePaystackPayment } from "react-paystack";

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

    return (
        <>
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" sticky="top">
                <Container>
                    <Navbar.Brand href="#home">Jiggy Store</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/home">Home</Nav.Link>

                    </Nav>
                </Container>
            </Navbar>

            {/* Main Content */}
            <Container fluid className="vh-100 p-4 bg-light">
                <Row className="h-100">
                    {/* Cart Details Section */}
                    <Col sm={12} md={8} className="mb-5">
                        <h2 className="mb-4">Your Cart</h2>
                        {orders.length > 0 ? (
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <OrderPageBody
                                            key={order.id}
                                            order={order}
                                            handleIncrease={handleIncrease}
                                            handleDecrease={handleDecrease}
                                        />
                                    ))}
                                </tbody>
                            </Table>
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
                        <Button
                            variant="primary"
                            //onClick={() => initializePayment(onSuccess, onClose)}
                            className="w-100"
                        >
                            Pay with Paystack
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
                                    <Link to='/'> home</Link>

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
                    <Button href="https://buy.stripe.com/test_6oE0190xP9K7cBGdQQ" variant="primary" className="w-100">
                        Pay Now
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Footer */}
            <footer className="bg-dark text-white text-center p-3">
                <p className="mb-0">&copy; 2025 Jiggy Store. All rights reserved.</p>
            </footer>
        </>
    );
}