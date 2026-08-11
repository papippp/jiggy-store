import { Col, Container, Row, Alert } from 'react-bootstrap'
import AddOrder from './AddOrder'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchProduct, filteredProductsByGender, setSearchQuery } from '../features/orders/orderSlice'
import ProductSkeleton from './ProductSkeleton'

export default function ProfileMianBody({ genderFilter, categoryFilter }) {
    const { products, loading, error, filteredProducts, searchQuery } = useSelector((state) => state.orders)
    const dispatch = useDispatch()

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProduct())
        }
    }, [dispatch, products.length])

    useEffect(() => {
        if (genderFilter && products.length > 0) {
            dispatch(filteredProductsByGender(genderFilter))
        }

    }, [genderFilter, products.length, dispatch])

    const displayProducts = (genderFilter ? filteredProducts : products)
        .filter(product => product.name.toLowerCase().includes((searchQuery || '').toLowerCase()))
        .filter(product => !categoryFilter || (product.category || '').toLowerCase() === categoryFilter.toLowerCase())

    return (
        <Container className="profile-container py-5">
            {/* Search bar */}
            <div className="mb-4" style={{ maxWidth: '400px', margin: '0 auto 2rem' }}>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchQuery || ''}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                    style={{ borderRadius: 0, border: '1px solid #000', padding: '0.75rem' }}
                />
            </div>

            {/* Product count */}
            {!loading && (
                <p className="text-muted small mb-4" style={{ letterSpacing: '1px' }}>
                    SHOWING {displayProducts.length} {displayProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
                    {searchQuery && ` FOR "${searchQuery.toUpperCase()}"`}
                </p>
            )}

            {/* Add this after the search bar div, before the skeleton/loading check 
            {!loading && (
                <p className="text-muted small mb-4" style={{ textAlign: 'center', letterSpacing: '1px' }}>
                    Showing {displayProducts.length} of {(genderFilter ? filteredProducts : products).length} product
                </p>
)}
*/}

            {error && (
                <Alert variant="danger" className="text-center">
                    Failed to load products. Please try again later.
                </Alert>
            )}

            <Row className="g-4">
                {/* Skeletons while loading */}
                {loading && (
                    Array.from({ length: 8 }).map((_, i) => (
                        <Col key={i} xs={6} sm={6} md={4} lg={3}>
                            <ProductSkeleton />
                        </Col>
                    ))
                )}

                {/* Real products */}
                {!loading && displayProducts.length > 0 && (
                    displayProducts.map((order) => (
                        <Col key={order.id} xs={6} sm={6} md={4} lg={3}>
                            <AddOrder order={order} className="h-100" />
                        </Col>
                    ))
                )}

                {/* Empty state */}
                {!loading && displayProducts.length === 0 && (
                    <Col className="text-center py-5">
                        <i className="bi bi-search" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                        <h4 className="text-muted mt-3">No products found</h4>
                        <p className="text-muted">
                            {searchQuery
                                ? `No results for "${searchQuery}" — try a different search`
                                : 'Check back later for new arrivals'}
                        </p>
                    </Col>
                )}
            </Row>
        </Container>
    )
} 