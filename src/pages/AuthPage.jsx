import axios from "axios"
import { useEffect, useState } from "react"
import { Row, Col, Form, Button, Modal, Container, Image } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import useLocalStorage from "use-local-storage"

export default function AuthPage() {

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const loginImage = 'https://res.cloudinary.com/duocpeihb/image/upload/v1730853747/WhatsApp_Image_2024-11-06_at_7.41.51_AM_zkmeqp.jpg'
    const url = 'https://a3041d7d-19a7-4dcb-b062-dfd5ae5b9df5-00-250g6lisrt9.sisko.replit.dev'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [authToken, setAuthToken] = useLocalStorage('authToken', '')
    const navigate = useNavigate()

    useEffect(() => {
        if (authToken) {
            navigate("/home")
        }
    }, [authToken, navigate])




    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${url}/signup`, { username, password })
            console.log(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${url}/login`, { username, password })
            if (res.data && res.data.auth === true && res.data.token) {
                setAuthToken(res.data.token)
                console.log('token saved')
                alert('logged in')
            }

        } catch (error) {
            console.error(error)
        }
    }


    return (
        <Row>
            <Col sm={6}>
                <Container>
                    <Col md={10}>
                        <Image
                            src={loginImage}
                            fluid
                            className="w-100"
                        />
                    </Col>
                </Container>
            </Col>
            <Col sm={6}>

                <Col sm={4}>
                    <Container>
                        <h1 className="my-3">Welcome , Login here</h1>
                        <Form onSubmit={handleLogin}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    placeholder="enter username"
                                    type="text"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    placeholder="enter password"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button className="rounded-pill" variant="outline-danger" type="submit">Login</Button>

                        </Form>
                    </Container>

                </Col>
                <p className="mt-5" style={{ fontWeight: 'bold' }}>
                    Create a new account here
                </p>
                <Button className="rounded-pill" variant="outline-primary" onClick={handleShow}>SignUp</Button>
                <Modal show={show} onHide={handleClose} >
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    placeholder="enter username"
                                    type="text"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    placeholder="enter password"
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleSignup}>Signup</Button>
                            <p style={{ fontSize: '12px' }}>
                                By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use. PPP may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account seceure and personalising our services, including ads. Learn more. Others will be able to find you by email or phone number, when provided, unless you choose otherwise here.
                            </p>
                        </Form>
                    </Modal.Body>
                </Modal>

            </Col>
        </Row>
    )
}
