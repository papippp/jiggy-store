import { Button, Card, Col, Container, ListGroup, Row, Modal, Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderPageBody from "../components/OrderPageBody";

import { deleteItem, updateOrder } from "../features/orders/orderSlice";
import { useState } from "react";

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

    return (
        <>
            <Row>


                <Col sm={6} className="mb-5">
                    {/* Cart Details Section */}
                    <Col sm={12} md={8}>
                        <h2>Your Cart</h2>
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
                        <Button variant="success" onClick={() => setShowModal(true)} className="w-100">
                            Proceed to Checkout
                        </Button>
                    </Col>
                </Col>
                /
                {/* Store Info Section */}
                <Col sm={6} md={4}>
                    <Card border="success" >
                        <Card.Img
                            variant="top"
                            src="https://res.cloudinary.com/duocpeihb/image/upload/v1730853747/WhatsApp_Image_2024-11-06_at_7.41.51_AM_zkmeqp.jpg"
                            className="img-fluid"
                            style={{ height: '250px', objectFit: 'cover' }}
                        />
                        <Card.Body>
                            <Card.Title>Jiggy Store</Card.Title>
                            <Card.Text>Thanks for your patronage with us</Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Address: 1 Pedro Street, Lekki</ListGroup.Item>
                            <ListGroup.Item>Contact: jiggy@ppp.com</ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>


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


                <Navbar expand="lg" className="bg-body-tertiary" fixed="bottom" bg="dark" data-bs-theme="dark">
                    <Container>
                        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </Row>
        </>
    );
}
