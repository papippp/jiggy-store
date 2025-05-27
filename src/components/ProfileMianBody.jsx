import { Col, Container, Row, Spinner, Alert } from 'react-bootstrap'
import AddOrder from './AddOrder'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchProduct, filteredProductsByGender } from '../features/orders/orderSlice'

export default function ProfileMianBody({ genderFilter }) {
    const { products, loading, error, filteredProducts } = useSelector((state) => state.orders)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchProduct())
    }, [dispatch])

    useEffect(() => {
        if (genderFilter && products.length > 0) {
            dispatch(filteredProductsByGender(genderFilter))
        }

    }, [genderFilter, products, dispatch])

    const displayProdutcs = genderFilter ? filteredProducts : products

    return (
        <Container className="profile-container py-5">

            {/* Loading State */}
            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="dark" className="me-2" />
                    <span>Loading products...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <Alert variant="danger" className="text-center">
                    Failed to load products. Please try again later.
                </Alert>
            )}

            {/* Product Grid */}
            <Row className="g-4">
                {displayProdutcs.length > 0 ? (
                    displayProdutcs.map((order) => (
                        <Col key={order.id} xs={12} sm={6} md={4} lg={3}>
                            <AddOrder order={order} className="h-100" />
                        </Col>
                    ))
                ) : (
                    !loading && (
                        <Col className="text-center py-5">
                            <h4 className="text-muted">No products available</h4>
                            <p>Check back later for new arrivals</p>
                        </Col>
                    )
                )}
            </Row>
        </Container>
    )
} 