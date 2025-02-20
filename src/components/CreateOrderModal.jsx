import { useState } from 'react'
import { useDispatch } from "react-redux";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap"
import { createCart } from '../features/orders/orderSlice';


export default function CreateOrderModal({ show, handleClose }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [pic, setPic] = useState('')
    const [invalidurl, setInvalidurl] = useState(false)


    const dispatch = useDispatch()


    const handleSubmit = (e) => {
        e.preventDefault()
        if (name, description, amount, pic) {
            dispatch(createCart({ name, description, amount, pic }))
            setName('')
            setDescription('')
            setAmount('')
            setPic('')
            handleClose()
        }
        else {
            setInvalidurl(true)
        }

    }

    const handleImageError = () => {
        setInvalidurl(true)
    }

    const handleImageLoad = () => {
        setInvalidurl(false)
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>Create new Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Row>
                        <Col sm={7} style={{ margin: '0px' }}>
                            <Image
                                src={pic ? pic : ''}
                                alt='upload content'
                                onError={handleImageError}
                                onLoad={handleImageLoad}
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
                                onChange={(e) => setPic(e.target.value)}
                                className='my-3'
                                placeholder='input product picture'
                            />
                            {invalidurl && (
                                <div className='danger'>
                                    Invalid picture url or failed to load picture

                                </div>
                            )

                            }

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
                            upload
                        </Button>
                    </Row>

                </Modal.Body>

            </Form>

        </Modal>



    )
}
