import { Button, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/orders/orderSlice";



export default function AddOrder({ order }) {
    const dispatch = useDispatch()



    function addItem() {

        dispatch(addToCart(order))
        alert('added')

    }

    return (

        <Card className="mb-4">
            <Card.Img
                variant="top"
                src={order.pic}
                alt={order.name}
                className="img-fluid"
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <Card.Body>
                <Card.Title>{order.name}</Card.Title>
                <Card.Text>
                    {order.description}
                    <br />
                    price : {order.amount}

                </Card.Text>
                <Button onClick={addItem} variant="primary">Add to cart</Button>
            </Card.Body>
        </Card>

    )
}
