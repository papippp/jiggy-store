import axios from 'axios'
import { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const BASE_URL = 'https://jiggy-wears-api.onrender.com'

const STATUS_COLORS = {
    'Processing': 'warning',
    'Confirmed': 'info',
    'Shipped': 'primary',
    'Delivered': 'success',
    'Cancelled': 'danger'
}

const STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function AdminDashboard() {
    const navigate = useNavigate()
    const isAdmin = useSelector((state) => state.orders.isAdmin)
    const token = useSelector((state) => state.orders.token)

    // ALL state hooks must be declared before any conditional returns
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [updatingRef, setUpdatingRef] = useState(null)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [filterStatus, setFilterStatus] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')
    const [authChecked, setAuthChecked] = useState(false)

    // Auth check effect — must be before any early returns
    useEffect(() => {
        const timer = setTimeout(() => {
            setAuthChecked(true)
        }, 50)
        return () => clearTimeout(timer)
    }, [])

    // Redirect effect — only fires once authChecked is true
    useEffect(() => {
        if (authChecked && !isAdmin) {
            navigate('/home')
        }
    }, [authChecked, isAdmin, navigate])

    // Fetch orders effect
    useEffect(() => {
        if (authChecked && isAdmin) {
            fetchOrders()
        }
    }, [authChecked, isAdmin])

    // ALL hooks declared — now safe to do conditional renders below

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${BASE_URL}/orders`)
            setOrders(res.data)
        } catch (err) {
            setError('Failed to load orders.')
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (reference, newStatus) => {
        setUpdatingRef(reference)
        try {
            const res = await axios.put(`${BASE_URL}/order/${reference}/status`, { status: newStatus })
            setOrders(prev => prev.map(o => o.reference === reference ? res.data : o))
            if (selectedOrder?.reference === reference) {
                setSelectedOrder(res.data)
            }
            window.dispatchEvent(new CustomEvent('showNotification', {
                detail: { message: `Order updated to ${newStatus}` }
            }))
        } catch {
            window.dispatchEvent(new CustomEvent('showNotification', {
                detail: { message: 'Failed to update status.', type: 'error' }
            }))
        } finally {
            setUpdatingRef(null)
        }
    }

    const filteredOrders = orders
        .filter(o => filterStatus === 'All' || o.status === filterStatus)
        .filter(o =>
            o.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer_phone?.includes(searchTerm)
        )

    const counts = STATUSES.reduce((acc, s) => {
        acc[s] = orders.filter(o => o.status === s).length
        return acc
    }, {})

    // NOW safe to do conditional renders — all hooks already called above
    if (!authChecked) {
        return (
            <div className="d-flex flex-column min-vh-100">
                <NavBar />
                <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                    <Spinner animation="border" variant="dark" />
                </div>
                <Footer />
            </div>
        )
    }

    if (!isAdmin) return null

    return (
        <div className="d-flex flex-column min-vh-100">
            <NavBar />
            <div className="flex-grow-1 py-4" style={{ backgroundColor: '#f8f9fa' }}>
                <Container fluid className="px-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 style={{ fontWeight: 300, letterSpacing: '2px', marginBottom: '4px' }}>
                                ORDER DASHBOARD
                            </h2>
                            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                                {orders.length} total orders
                            </p>
                        </div>
                        <Button
                            variant="outline-dark"
                            size="sm"
                            style={{ borderRadius: 0 }}
                            onClick={fetchOrders}
                        >
                            ↻ Refresh
                        </Button>
                    </div>

                    {/* Summary cards */}
                    <Row className="g-3 mb-4">
                        {[
                            { label: 'Processing', color: '#ffc107', text: '#000' },
                            { label: 'Confirmed', color: '#0dcaf0', text: '#000' },
                            { label: 'Shipped', color: '#0d6efd', text: '#fff' },
                            { label: 'Delivered', color: '#198754', text: '#fff' },
                            { label: 'Cancelled', color: '#dc3545', text: '#fff' },
                        ].map(({ label, color, text }) => (
                            <Col key={label} xs={6} sm={4} md={2}>
                                <Card
                                    style={{
                                        borderRadius: 0,
                                        border: 'none',
                                        backgroundColor: color,
                                        cursor: 'pointer',
                                        opacity: filterStatus === label ? 1 : 0.75
                                    }}
                                    onClick={() => setFilterStatus(filterStatus === label ? 'All' : label)}
                                >
                                    <Card.Body className="text-center py-3">
                                        <div style={{ fontSize: '1.8rem', fontWeight: 700, color: text }}>
                                            {counts[label] || 0}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', letterSpacing: '1px', color: text, textTransform: 'uppercase' }}>
                                            {label}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        <Col xs={6} sm={4} md={2}>
                            <Card style={{ borderRadius: 0, border: 'none', backgroundColor: '#000' }}>
                                <Card.Body className="text-center py-3">
                                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
                                        ₦{orders
                                            .filter(o => o.status === 'Delivered')
                                            .reduce((sum, o) => sum + Number(o.total), 0)
                                            .toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '0.7rem', letterSpacing: '1px', color: '#ccc', textTransform: 'uppercase' }}>
                                        Revenue
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Search + filter */}
                    <div className="d-flex gap-3 mb-4 flex-wrap">
                        <Form.Control
                            type="text"
                            placeholder="Search by reference, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ borderRadius: 0, maxWidth: '400px', border: '1px solid #000' }}
                        />
                        <Form.Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ borderRadius: 0, maxWidth: '180px', border: '1px solid #000' }}
                        >
                            <option value="All">All Statuses</option>
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Form.Select>
                    </div>

                    {error && (
                        <div className="alert" style={{ borderRadius: 0, border: '1px solid #dc3545' }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="dark" />
                        </div>
                    ) : (
                        <Row className="g-3">
                            <Col lg={selectedOrder ? 7 : 12}>
                                <Card style={{ borderRadius: 0, border: '1px solid #dee2e6' }}>
                                    <div style={{ overflowX: 'auto' }}>
                                        <Table hover className="mb-0" style={{ fontSize: '0.85rem' }}>
                                            <thead style={{ backgroundColor: '#000', color: '#fff' }}>
                                                <tr>
                                                    <th style={{ fontWeight: 400, letterSpacing: '1px', padding: '12px 16px' }}>REFERENCE</th>
                                                    <th style={{ fontWeight: 400, letterSpacing: '1px', padding: '12px 16px' }}>CUSTOMER</th>
                                                    <th style={{ fontWeight: 400, letterSpacing: '1px', padding: '12px 16px' }}>DATE</th>
                                                    <th style={{ fontWeight: 400, letterSpacing: '1px', padding: '12px 16px' }}>TOTAL</th>
                                                    <th style={{ fontWeight: 400, letterSpacing: '1px', padding: '12px 16px' }}>STATUS</th>
                                                    <th style={{ fontWeight: 400, letterSpacing: '1px', padding: '12px 16px' }}>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredOrders.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="text-center py-5 text-muted">
                                                            No orders found
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredOrders.map(order => (
                                                        <tr
                                                            key={order.reference}
                                                            style={{
                                                                cursor: 'pointer',
                                                                backgroundColor: selectedOrder?.reference === order.reference ? '#f0f0f0' : 'transparent'
                                                            }}
                                                            onClick={() => setSelectedOrder(
                                                                selectedOrder?.reference === order.reference ? null : order
                                                            )}
                                                        >
                                                            <td style={{ padding: '12px 16px' }}>
                                                                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                                                    ...{order.reference?.slice(-10)}
                                                                </span>
                                                            </td>
                                                            <td style={{ padding: '12px 16px' }}>
                                                                <div>{order.customer_email}</div>
                                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                                    {order.customer_phone}
                                                                </div>
                                                            </td>
                                                            <td style={{ padding: '12px 16px' }}>
                                                                {new Date(order.created_at).toLocaleDateString('en-NG', {
                                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                                })}
                                                            </td>
                                                            <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                                                                ₦{Number(order.total).toLocaleString()}
                                                            </td>
                                                            <td style={{ padding: '12px 16px' }}>
                                                                <Badge
                                                                    bg={STATUS_COLORS[order.status] || 'secondary'}
                                                                    style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}
                                                                >
                                                                    {order.status}
                                                                </Badge>
                                                            </td>
                                                            <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                                                                <Form.Select
                                                                    size="sm"
                                                                    value={order.status}
                                                                    disabled={updatingRef === order.reference}
                                                                    onChange={(e) => updateStatus(order.reference, e.target.value)}
                                                                    style={{ borderRadius: 0, fontSize: '0.75rem', minWidth: '120px' }}
                                                                >
                                                                    {STATUSES.map(s => (
                                                                        <option key={s} value={s}>{s}</option>
                                                                    ))}
                                                                </Form.Select>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card>
                            </Col>

                            {selectedOrder && (
                                <Col lg={5}>
                                    <Card style={{ borderRadius: 0, border: '1px solid #000', position: 'sticky', top: '20px' }}>
                                        <Card.Body className="p-4">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <h6 style={{ letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 0 }}>
                                                    Order Details
                                                </h6>
                                                <button
                                                    onClick={() => setSelectedOrder(null)}
                                                    style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', lineHeight: 1 }}
                                                >
                                                    ×
                                                </button>
                                            </div>

                                            <div className="mb-3" style={{ fontSize: '0.8rem' }}>
                                                <p className="text-muted mb-1" style={{ letterSpacing: '1px' }}>REFERENCE</p>
                                                <p className="mb-0" style={{ fontFamily: 'monospace' }}>{selectedOrder.reference}</p>
                                            </div>

                                            <div className="mb-3" style={{ fontSize: '0.8rem' }}>
                                                <p className="text-muted mb-1" style={{ letterSpacing: '1px' }}>CUSTOMER</p>
                                                <p className="mb-0">{selectedOrder.customer_email}</p>
                                                <p className="mb-0">{selectedOrder.customer_phone}</p>
                                            </div>

                                            <div className="mb-3" style={{ fontSize: '0.8rem' }}>
                                                <p className="text-muted mb-1" style={{ letterSpacing: '1px' }}>DELIVERY ADDRESS</p>
                                                <p className="mb-0">{selectedOrder.delivery_address || '—'}</p>
                                            </div>

                                            <hr />

                                            <p className="text-muted mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>ITEMS</p>
                                            {(typeof selectedOrder.items === 'string'
                                                ? JSON.parse(selectedOrder.items)
                                                : selectedOrder.items
                                            ).map((item, i) => (
                                                <div key={i} className="d-flex align-items-center gap-3 mb-3">
                                                    {item.pic && (
                                                        <div style={{
                                                            width: '50px', height: '50px', flexShrink: 0,
                                                            backgroundImage: `url(${item.pic})`,
                                                            backgroundSize: 'cover', backgroundPosition: 'center'
                                                        }} />
                                                    )}
                                                    <div className="flex-grow-1" style={{ fontSize: '0.82rem' }}>
                                                        <div className="fw-bold">{item.name}</div>
                                                        <div className="text-muted">{item.size} × {item.qty}</div>
                                                    </div>
                                                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                                                        ₦{(item.amount * item.qty).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}

                                            <hr />

                                            <div style={{ fontSize: '0.82rem' }}>
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="text-muted">Subtotal</span>
                                                    <span>₦{Number(selectedOrder.subtotal).toLocaleString()}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-1">
                                                    <span className="text-muted">Shipping</span>
                                                    <span>₦{Number(selectedOrder.shipping_fee).toLocaleString()}</span>
                                                </div>
                                                <div className="d-flex justify-content-between fw-bold mt-2 pt-2" style={{ borderTop: '1px solid #000' }}>
                                                    <span>Total</span>
                                                    <span>₦{Number(selectedOrder.total).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <hr />

                                            <p className="text-muted mb-2" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>UPDATE STATUS</p>
                                            <div className="d-flex flex-wrap gap-2">
                                                {STATUSES.map(s => (
                                                    <Button
                                                        key={s}
                                                        size="sm"
                                                        variant={selectedOrder.status === s ? 'dark' : 'outline-dark'}
                                                        style={{ borderRadius: 0, fontSize: '0.72rem', letterSpacing: '0.5px' }}
                                                        disabled={updatingRef === selectedOrder.reference}
                                                        onClick={() => updateStatus(selectedOrder.reference, s)}
                                                    >
                                                        {s}
                                                    </Button>
                                                ))}
                                            </div>

                                            {selectedOrder.customer_phone && (
                                                <Button
                                                    className="w-100 mt-3"
                                                    style={{ backgroundColor: '#25D366', border: 'none', borderRadius: 0, fontSize: '0.8rem' }}
                                                    onClick={() => {
                                                        const msg = `Hi, this is Jiggy Wears. Your order ${selectedOrder.reference.slice(-8)} is now ${selectedOrder.status}.`
                                                        window.open(`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
                                                    }}
                                                >
                                                    📱 WhatsApp Customer
                                                </Button>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    )}
                </Container>
            </div>
            <Footer />
        </div>
    )
}