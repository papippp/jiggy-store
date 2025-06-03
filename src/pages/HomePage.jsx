import { useState } from 'react'
import { Carousel, Col, Container, Row } from 'react-bootstrap'
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
                    <div className="mb-5">
                        <Carousel fade interval={5000} pause='hover' className="custom-carousel">
                            {/* Slide 1: Information */}
                            <Carousel.Item>
                                <div className="carousel-image-container">
                                    <img
                                        className="carousel-image"
                                        src="https://res.cloudinary.com/dqcztgs4v/image/upload/v1748829185/photo_6188138139789411362_y_vvoesc.jpg"
                                        alt="About Jiggy Wears"
                                    />
                                </div>
                                <Carousel.Caption className="carousel-caption">
                                    <h3>Premium Fashion Experience</h3>
                                    <p>Discover our story and what makes Jiggy Wears unique</p>
                                    <button className="btn btn-light mt-2">Learn More</button>
                                </Carousel.Caption>
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
                                <Carousel.Caption className="carousel-caption">
                                    <h3>Customer Favorites</h3>
                                    <p>Shop our best-selling items loved by thousands</p>

                                </Carousel.Caption>
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
                                <Carousel.Caption className="carousel-caption">
                                    <h3>Style Inspiration</h3>
                                    <p>See our outfits in action with professional styling</p>

                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </div>
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
