import { Button, Card, Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useState } from 'react'
import { addToCart, deleteProduct } from "../features/orders/orderSlice";
import UpdateProduct from "./UpdateProduct";



export default function AddOrder({ order }) {
    const dispatch = useDispatch()
    const userEmail = useSelector((state) => state.orders.userEmail)
    const allowedEmail = 'lukzy@p.com'
    const [show, setShow] = useState(false)

    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)


    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    }





    function handleDelete() {
        if (userEmail === allowedEmail) {
            dispatch(deleteProduct(order.id));
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
        <>

            <Card className="product-card shadow-sm rounded mb-4">
                <Carousel activeIndex={index} onSelect={handleSelect} className="product-carousel">
                    <Carousel.Item>

                        <Card.Img
                            variant="top"
                            src={order.pic}
                            alt={order.name}
                            className="img-fluid product-img"

                        />

                    </Carousel.Item>
                    <Carousel.Item>

                        <Card.Img
                            variant="top"
                            src={order.backpic}
                            alt={order.name}
                            className="img-fluid product-img"

                        />

                    </Carousel.Item>

                </Carousel>


                <Card.Body className="p-4">

                    <Card.Title className="product-title">{order.name}</Card.Title>
                    <Card.Text className="product-description">
                        {order.description}
                    </Card.Text>
                    <Card.Text className="product-price">
                        <strong>Price:</strong> #{order.amount}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                        <Button className="btn-custom btn-add-to-cart" onClick={addItem} variant="primary">Add to cart</Button>
                        {userEmail === allowedEmail && (
                            <div className="admin-actions mx-2">
                                <Button className="btn-custom btn-delete" onClick={handleDelete} variant='danger' >
                                    <i className="bi bi-trash"></i> delete
                                </Button>
                                <Button className="btn-custom btn-edit" onClick={handleShow} variant='warning' >
                                    <i className="bi bi-pencil"></i> edit
                                </Button>

                            </div>)}







                    </div>

                </Card.Body>
            </Card>
            {userEmail === allowedEmail && (
                <UpdateProduct product={order} show={show} handleClose={handleClose} />
            )}

        </>

    )
}
