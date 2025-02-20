import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { addToCart, deleteProduct } from "../features/orders/orderSlice";



export default function AddOrder({ order }) {
    const dispatch = useDispatch()
    const userEmail = useSelector((state) => state.orders.userEmail)
    const allowedEmail = 'lukzy@p.com'

    function handleDelete() {
        if (userEmail === allowedEmail) {
            dispatch(deleteProduct({ id: order.id }));
            alert('Product deleted');
        } else {
            alert('You are not authorized to delete this product');
        }
    }




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

                {userEmail === allowedEmail ? (<Button onClick={handleDelete} variant='danger' >
                    <i className="bi bi-trash"></i> Remove
                </Button>) : null}



            </Card.Body>
        </Card>

    )
}
