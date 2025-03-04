import { Col, Container, Row } from 'react-bootstrap'
import AddOrder from './AddOrder'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchProduct } from '../features/orders/orderSlice'

export default function ProfileMianBody() {
    // const orders = [
    // { id: 1, name: 'jiggy rozay safari', description: 'Pixel Dancers Tee Black ', amount: 100, pic: 'https://res.cloudinary.com/duocpeihb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1730461371/WhatsApp_Image_2024-11-01_at_6.42.05_PM_km4w4b.jpg' },
    //{ id: 2, name: 'Jiggy Viscor Cap', description: 'bbc logo curved ', amount: 70, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/WhatsApp_Image_2024-11-25_at_5.44.07_PM_hdv0pk.jpg' },
    //{ id: 3, name: 'top boy boot ', description: 'Jiggy topboy jean', amount: 200, pic: 'https://res.cloudinary.com/duocpeihb/image/upload/v1730461009/WhatsApp_Image_2024-11-01_at_6.35.54_PM_p9q5rd.jpg' },
    //{ id: 4, name: 'Jiggy hoodie  ', description: 'Jiggy logo neon hoodie', amount: 166, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/WhatsApp_Image_2024-11-25_at_6.44.06_AM_d8sdwv.jpg' },
    //{ id: 5, name: 'Jiggy full suite  ', description: 'up and down toke tile', amount: 390, pic: 'https://res.cloudinary.com/duocpeihb/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1730461373/WhatsApp_Image_2024-11-01_at_6.42.07_PM_s4rcqt.jpg' },
    //{ id: 6, name: 'jiggy rozay safari', description: 'Pixel Dancers Tee Black ', amount: 100, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/WhatsApp_Image_2024-11-30_at_1.20.37_AM_qntyrh.jpg' },
    //{ id: 7, name: 'Jiggy Viscor Cap', description: 'bbc logo curved ', amount: 70, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/WhatsApp_Image_2024-11-25_at_5.44.06_PM_vo9k4e.jpg' },
    //{ id: 8, name: 'top boy boot ', description: 'Jiggy topboy jean', amount: 200, pic: 'https://res.cloudinary.com/dqcztgs4v/image/upload/WhatsApp_Image_2024-11-30_at_1.20.39_AM_h23yhj.jpg' }

    //]
    const orders = useSelector((state) => state.orders.products)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchProduct())

    }, [dispatch]);



    return (
        <Container className="profile-main-container">
            <Row>
                {
                    orders.length === 0 ? (
                        <Col>No orders found </Col>
                    ) :


                        (
                            orders.map((order, index) => (

                                <Col sm={3} key={order.id} className="order-col">

                                    <AddOrder key={index} order={order} />
                                </Col>
                            ))
                        )
                }


            </Row>
        </Container>
    )
}
