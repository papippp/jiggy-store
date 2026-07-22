import { useState } from 'react'
import { Carousel, Col, Container, Row } from 'react-bootstrap'
import CreateOrderModal from '../components/CreateOrderModal'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import ProfileMianBody from '../components/ProfileMianBody'
import { useSelector } from 'react-redux'

export default function HomePage() {
    const [show, setShow] = useState(false)
    const handleShow = () => setShow(true)
    const handleClose = () => setShow(false)
    const userEmail = useSelector((state) => state.orders.userEmail)


    return (
        <>

            <div className='luxury-store'>
                {/*Main Navigation*/}
                <NavBar handleShow={handleShow} />
                <Container fluid className='main-content px-0'>
                    <Row className='welcome-section mx-0'>
                        <Col className='px-0'>{
                            userEmail ? (
                                <>
                                    <p
                                        style={{
                                            fontSize: '0.7rem',
                                            letterSpacing: '3px',
                                            textTransform: 'uppercase',
                                            color: 'rgba(255,255,255,0.6)',
                                            marginBottom: '8px',
                                            fontFamily: 'Jost, sans-serif'
                                        }}
                                    >
                                        Welcome Back
                                    </p>
                                    <h1 className='welcome-heading'>{userEmail}</h1>
                                </>
                            ) : (
                                <>
                                    <h1 className="welcome-heading">Welcome to The Jiggy Standard</h1>
                                    <p className="welcome-subheading">Curated Luxury Apparel</p>
                                </>
                            )
                        }

                        </Col>

                    </Row>
                    <div style={{ marginBottom: '0' }}>
                        <Carousel fade interval={5000} pause='hover' controls={true} indicators={true}>
                            {/* Slide 1: Information */}
                            <Carousel.Item>
                                <div className="carousel-image-container">
                                    <img
                                        className="carousel-image"
                                        src="https://res.cloudinary.com/dqcztgs4v/image/upload/v1748829185/photo_6188138139789411362_y_vvoesc.jpg"
                                        alt="About Jiggy Wears"
                                    />
                                </div>

                            </Carousel.Item>

                            {/* Slide 2: Top Seller */}
                            <Carousel.Item>
                                <div className="carousel-image-container">
                                    <img
                                        className="carousel-image"
                                        src="https://res.cloudinary.com/dqcztgs4v/image/upload/v1748829184/photo_6188138139789411360_y_d1d7di.jpg"
                                        alt="Top Seller Products"
                                    />
                                </div>

                            </Carousel.Item>

                            {/* Slide 3: New Product */}


                            {/* Slide 4: Model Wearing Clothes */}
                            <Carousel.Item>
                                <div className="carousel-image-container">
                                    <img
                                        className="carousel-image"
                                        src="https://res.cloudinary.com/dqcztgs4v/image/upload/v1748829184/photo_6188138139789411359_y_r7eaop.jpg"
                                        alt="Model Showcase"
                                    />
                                </div>

                            </Carousel.Item>
                        </Carousel>
                    </div>
                    <Row className="profile-section mx-0">
                        <ProfileMianBody />
                        <CreateOrderModal show={show} handleClose={handleClose} />
                    </Row>

                </Container>
                <Footer />

            </div>

        </>
    )
}
