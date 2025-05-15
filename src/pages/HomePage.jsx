import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import CreateOrderModal from '../components/CreateOrderModal'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import ProfileMianBody from '../components/ProfileMianBody'

export default function HomePage() {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)









    return (
        <>

            <div className='luxury-store'>
                {/*Main Navigation*/}
                <NavBar handleShow={handleShow} />
                <Container fluid className='main-content'>
                    <Row className='welcome-section'>
                        <Col>
                            <h1 className="welcome-heading">Welcome to Jiggy Wears</h1>
                            <p className="welcome-subheading">Curated Luxury Apparel</p>
                        </Col>

                    </Row>
                    <Row className="profile-section">
                        <ProfileMianBody />
                        <CreateOrderModal show={show} handleClose={handleClose} />
                    </Row>

                </Container>
                <Footer />

            </div>

        </>
    )
}
