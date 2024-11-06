import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { deleteItem } from "../features/orders/orderSlice";


export default function OrderPageBody({ order }) {

    const dispatch = useDispatch()

    function deleteOrder() {
        alert('delete')
        dispatch(deleteItem(order))
    }
    return (
        <Card className="mb-2">
            <Row >
                <Col xs={4} md={2}>
                    <Card.Img
                        variant="top"
                        src={order.pic}
                        alt={order.name}
                        className="img-fluid"
                    />
                </Col>
                <Col xs={8} md={6}>
                    <Card.Title>{order.name}</Card.Title>
                    <Card.Text>{order.name} x {order.qty}</Card.Text>
                    <Card.Text>{order.description}</Card.Text>
                    <Button variant="danger" onClick={deleteOrder}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </Col>
            </Row>

        </Card>
    )
}
