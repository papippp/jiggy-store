import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderPageBody from "../components/OrderPageBody";
import { deleteItem, updateOrder } from "../features/orders/orderSlice";



export default function OrdersPage() {



    const orderss = useSelector((state) => state.orders.orders)
    let subtotal = 0
    orderss.forEach((order) => {
        subtotal += parseInt(order.amount) * order.qty
    })
    const dispatch = useDispatch()
    const handleIncrease = (id) => {
        dispatch(updateOrder({ id, qty: orderss.find(order => order.id === id).qty + 1 }))
    }
    const handleDecrease = (id) => {
        const orderQty = orderss.find(order => order.id === id).qty
        if (orderQty > 1) {
            dispatch(updateOrder({ id, qty: orderQty - 1 }))
        } else {
            dispatch(deleteItem({ id }))
        }

    }








    return (
        <Row>
            <Col className="mb-3" sm={6}>
                <Container >

                    <h2>Your Cart :</h2>

                    {orderss.length > 0 && orderss.map((order) => (
                        <Col key={order.id}>


                            <OrderPageBody order={order} />

                            <Button className="mx-3" variant="secondary" onClick={() => handleIncrease(order.id)}>
                                <i className="bi bi-plus"></i>
                            </Button>
                            <Button className="mx-3" variant="secondary" onClick={() => handleDecrease(order.id)}>
                                <i className="bi bi-dash"></i>
                            </Button>




                        </Col>
                    ))}


                </Container>

                <h4 style={{ fontSize: '30' }}>Total : NGN{subtotal}</h4>
                <Button href='https://buy.stripe.com/test_6oE0190xP9K7cBGdQQ'>Pay Here</Button>

            </Col>

            <Col sm={6}>






                <Card className="mb-4">
                    <Card.Img
                        variant="top"
                        src="https://res.cloudinary.com/duocpeihb/image/upload/v1730853747/WhatsApp_Image_2024-11-06_at_7.41.51_AM_zkmeqp.jpg"
                        className="img-fluid"
                        style={{ height: '300px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                        <Card.Title>Jiggy Store</Card.Title>
                        <Card.Text>
                            <p>Thanks for your patronage with us</p>
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        <ListGroup.Item>Address: 1 pedro street Lekki </ListGroup.Item>
                        <ListGroup.Item>Contact: jiggy@ppp.com</ListGroup.Item>

                    </ListGroup>
                </Card>
            </Col>


        </Row>
    )
}
