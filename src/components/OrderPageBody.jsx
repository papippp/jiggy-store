import { useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { deleteItem } from "../features/orders/orderSlice";

export default function OrderPageBody({ order, handleIncrease, handleDecrease }) {
    const options = [
        { value: 'small', label: 'S' },
        { value: 'medium', label: 'M' },
        { value: 'large', label: 'L' }
    ];

    const [optionPicked, setOptionPicked] = useState('');

    const dispatch = useDispatch();


    const deleteOrder = () => {
        dispatch(deleteItem(order));
    };


    return (
        <Card className="mb-3">
            <Row className="align-items-center">
                <Col xs={4} md={3}>
                    <Card.Img
                        variant="top"
                        src={order.pic}
                        alt={order.name}
                        className="img-fluid"
                        style={{ objectFit: 'cover', height: '100px' }}
                    />
                </Col>
                <Col xs={8} md={6}>
                    <Card.Title>{order.name}</Card.Title>
                    <Card.Text>{order.name} x {order.qty}</Card.Text>
                    <Card.Text>{order.description}</Card.Text>
                    <Select
                        options={options}
                        onChange={(option) => setOptionPicked(option)}
                        value={optionPicked}
                    />
                    <h5>Size: {optionPicked?.label || "Select size"}</h5>
                </Col>
                <Col xs={12} md={3} className="text-center">
                    <Button variant="outline-secondary" onClick={() => handleIncrease(order.id)} className="mx-1">
                        <i className="bi bi-plus"></i>
                    </Button>
                    <Button variant="outline-secondary" onClick={() => handleDecrease(order.id)} className="mx-1">
                        <i className="bi bi-dash"></i>
                    </Button>
                    <Button variant="danger" onClick={deleteOrder} className="mt-2">
                        <i className="bi bi-trash"></i> Remove
                    </Button>




                </Col>
            </Row>
        </Card>
    );
}
