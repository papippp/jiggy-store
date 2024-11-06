import { Button, Card, Col, Container, Row } from "react-bootstrap";
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
                        <Col sm={6} key={order.id}>
                            <Card>
                                <Card.Body style={{ color: 'lightblue' }}>
                                    <OrderPageBody order={order} />
                                    <Button className="mx-3" variant="secondary" onClick={() => handleIncrease(order.id)}>
                                        <i className="bi bi-plus"></i>
                                    </Button>
                                    <Button className="mx-3" variant="secondary" onClick={() => handleDecrease(order.id)}>
                                        <i className="bi bi-dash"></i>
                                    </Button>

                                </Card.Body>

                            </Card>

                        </Col>
                    ))}
                    <br />
                    <Col>
                        <h4 style={{ fontSize: '30' }}>Total : NGN{subtotal}</h4>
                    </Col>





                </Container>
            </Col>
            <Col sm={6}>
                <p>About us</p>
            </Col>
        </Row>
    )
}
