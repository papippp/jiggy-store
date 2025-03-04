import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateProduct } from '../features/orders/orderSlice'
import { Button, Col, Form, Image, Modal, Row } from 'react-bootstrap'

export default function UpdateProduct({ product, show, handleClose }) {
    const dispatch = useDispatch()
    const [name, setName] = useState(product.name)
    const [description, setDescription] = useState(product.description)
    const [amount, setAmount] = useState(product.amount)
    const [pic, Setpic] = useState(product.pic)
    const [backpic, setBackPic] = useState(product.backpic)

    useEffect(() => {
        if (product) {
            setName(product.name)
            setDescription(product.description)
            setAmount(product.amount)
            Setpic(product.pic)
            setBackPic(product.backpic)
        }
    }, [product])


    const handleUpdate = (e) => {
        e.preventDefault()
        if (name && description && amount && pic && backpic) {
            dispatch(updateProduct({ id: product.id, name, description, amount, pic, backpic }))
            handleClose()
        }
        else {
            handleClose()
        }





    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>update Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleUpdate}>
                <Modal.Body>
                    <Row>
                        <Col sm={7} style={{ margin: '0px' }}>
                            <Image
                                src={pic ? pic : ''}
                                alt='upload content'

                                style={{ width: '32px' }}
                            />
                        </Col>
                        <Col sm={5}>
                            <Form.Control
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='my-3'
                                placeholder='input product name'
                            />

                            <Form.Control
                                value={pic}
                                onChange={(e) => Setpic(e.target.value)}
                                className='my-3'
                                placeholder='input product front view'
                            />

                            <Form.Control
                                value={backpic}
                                onChange={(e) => setBackPic(e.target.value)}
                                className='my-3'
                                placeholder='input product back veiw'
                            />




                            <Form.Control
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className='my-3'
                                as='textarea'
                                rows={3}
                                placeholder='product description'
                            />
                            <Form.Control
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className='my-3'
                                placeholder='product price'
                            />
                        </Col>

                        <Button type='submit' style={{ width: '100' }}>
                            submit
                        </Button>
                    </Row>

                </Modal.Body>

            </Form>

        </Modal>
    )
}
``