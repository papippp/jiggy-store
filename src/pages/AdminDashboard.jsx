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
const CTA_PATHS = [
    { label: 'Home', value: '/home' },
    { label: 'Men', value: '/men' },
    { label: 'Women', value: '/women' },
    { label: 'Track Order', value: '/track' },
]
const CLOUDINARY_CLOUD_NAME = 'dqcztgs4v'
const CLOUDINARY_UPLOAD_PRESET = 'jiggy_unsigned'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const isAdmin = useSelector((state) => state.orders.isAdmin)

    // ── Auth ──
    const [authChecked, setAuthChecked] = useState(false)

    // ── Tab ──
    const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'carousel'

    // ── Orders state ──
    const [orders, setOrders] = useState([])
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [ordersError, setOrdersError] = useState(null)
    const [updatingRef, setUpdatingRef] = useState(null)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [filterStatus, setFilterStatus] = useState('All')
    const [searchTerm, setSearchTerm] = useState('')

    // ── Carousel state ──
    const [slides, setSlides] = useState([])
    const [slidesLoading, setSlidesLoading] = useState(false)
    const [slidesError, setSlidesError] = useState(null)
    const [editingSlide, setEditingSlide] = useState(null) // null = new, object = editing
    const [showSlideForm, setShowSlideForm] = useState(false)
    const [slideUploading, setSlideUploading] = useState(false)

    // Slide form fields
    const [slidePic, setSlidePic] = useState('')
    const [slideCaption, setSlideCaption] = useState('')
    const [slideCtaText, setSlideCtaText] = useState('Shop Now')
    const [slideCtaPath, setSlideCtaPath] = useState('/home')
    const [slideOrder, setSlideOrder] = useState(1)
    const [slideFormError, setSlideFormError] = useState('')
    const [slideSubmitting, setSlideSubmitting] = useState(false)

    // ── Effects ──
    useEffect(() => {
        const timer = setTimeout(() => setAuthChecked(true), 50)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (authChecked && !isAdmin) navigate('/home')
    }, [authChecked, isAdmin, navigate])

    useEffect(() => {
        if (authChecked && isAdmin) fetchOrders()
    }, [authChecked, isAdmin])

    useEffect(() => {
        if (authChecked && isAdmin && activeTab === 'carousel') fetchSlides()
    }, [authChecked, isAdmin, activeTab])

    // ── Orders functions ──
    async function fetchOrders() {
        try {
            setOrdersLoading(true)
            const res = await axios.get(`${BASE_URL}/orders`)
            setOrders(res.data)
        } catch {
            setOrdersError('Failed to load orders.')
        } finally {
            setOrdersLoading(false)
        }
    }

    async function updateStatus(reference, newStatus) {
        setUpdatingRef(reference)
        try {
            const res = await axios.put(`${BASE_URL}/order/${reference}/status`, { status: newStatus })
            setOrders(prev => prev.map(o => o.reference === reference ? res.data : o))
            if (selectedOrder?.reference === reference) setSelectedOrder(res.data)
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

    // ── Carousel functions ──
    async function fetchSlides() {
        try {
            setSlidesLoading(true)
            const res = await axios.get(`${BASE_URL}/carousel`)
            setSlides(res.data)
        } catch {
            setSlidesError('Failed to load carousel slides.')
        } finally {
            setSlidesLoading(false)
        }
    }

    async function uploadToCloudinary(file) {
        setSlideUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                { method: 'POST', body: formData }
            )
            const data = await res.json()
            if (data.secure_url) {
                setSlidePic(data.secure_url)
            } else {
                setSlideFormError('Image upload failed.')
            }
        } catch {
            setSlideFormError('Upload failed. Check your connection.')
        } finally {
            setSlideUploading(false)
        }
    }

    function openNewSlideForm() {
        setEditingSlide(null)
        setSlidePic('')
        setSlideCaption('')
        setSlideCtaText('Shop Now')
        setSlideCtaPath('/home')
        setSlideOrder(slides.length + 1)
        setSlideFormError('')
        setShowSlideForm(true)
    }

    function openEditSlideForm(slide) {
        setEditingSlide(slide)
        setSlidePic(slide.pic)
        setSlideCaption(slide.caption || '')
        setSlideCtaText(slide.cta_text || 'Shop Now')
        setSlideCtaPath(slide.cta_path || '/home')
        setSlideOrder(slide.slide_order || 1)
        setSlideFormError('')
        setShowSlideForm(true)
    }

    async function handleSlideSubmit(e) {
        e.preventDefault()
        if (!slidePic) { setSlideFormError('Please upload an image.'); return }
        if (!slideCaption.trim()) { setSlideFormError('Please add a caption.'); return }
        setSlideFormError('')
        setSlideSubmitting(true)
        try {
            const payload = {
                pic: slidePic,
                caption: slideCaption,
                cta_text: slideCtaText,
                cta_path: slideCtaPath,
                slide_order: slideOrder
            }
            if (editingSlide) {
                const res = await axios.put(`${BASE_URL}/carousel/${editingSlide.id}`, payload)
                setSlides(prev => prev.map(s => s.id === editingSlide.id ? res.data : s))
                window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: { message: 'Slide updated.' }
                }))
            } else {
                const res = await axios.post(`${BASE_URL}/carousel`, payload)
                setSlides(prev => [...prev, res.data])
                window.dispatchEvent(new CustomEvent('showNotification', {
                    detail: { message: 'Slide added to carousel.' }
                }))
            }
            setShowSlideForm(false)
        } catch {
            setSlideFormError('Failed to save slide.')
        } finally {
            setSlideSubmitting(false)
        }
    }

    async function handleDeleteSlide(id) {
        if (!window.confirm('Delete this slide?')) return
        try {
            await axios.delete(`${BASE_URL}/carousel/${id}`)
            setSlides(prev => prev.filter(s => s.id !== id))
            window.dispatchEvent(new CustomEvent('showNotification', {
                detail: { message: 'Slide deleted.', type: 'error' }
            }))
        } catch {
            window.dispatchEvent(new CustomEvent('showNotification', {
                detail: { message: 'Failed to delete slide.', type: 'error' }
            }))
        }
    }

    // ── Derived ──
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

                    {/* ── Page header ── */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 style={{ fontWeight: 300, letterSpacing: '2px', marginBottom: 0 }}>
                            ADMIN DASHBOARD
                        </h2>
                        <Button variant="outline-dark" size="sm" style={{ borderRadius: 0 }}
                            onClick={() => activeTab === 'orders' ? fetchOrders() : fetchSlides()}>
                            ↻ Refresh
                        </Button>
                    </div>

                    {/* ── Tabs ── */}
                    <div style={{ display: 'flex', borderBottom: '2px solid #000', marginBottom: '2rem' }}>
                        {['orders', 'carousel'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                style={{
                                    background: 'none', border: 'none',
                                    padding: '0.75rem 2rem',
                                    fontSize: '0.72rem', letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    fontFamily: 'Jost, sans-serif',
                                    cursor: 'pointer',
                                    borderBottom: activeTab === tab ? '2px solid #000' : '2px solid transparent',
                                    marginBottom: '-2px',
                                    fontWeight: activeTab === tab ? 700 : 400,
                                    color: activeTab === tab ? '#000' : '#888'
                                }}>
                                {tab === 'orders' ? `Orders (${orders.length})` : `Carousel (${slides.length})`}
                            </button>
                        ))}
                    </div>

                    {/* ══════════════════════════════════════
                        ORDERS TAB
                    ══════════════════════════════════════ */}
                    {activeTab === 'orders' && (
                        <>
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
                                        <Card style={{ borderRadius: 0, border: 'none', backgroundColor: color, cursor: 'pointer', opacity: filterStatus === label ? 1 : 0.75 }}
                                            onClick={() => setFilterStatus(filterStatus === label ? 'All' : label)}>
                                            <Card.Body className="text-center py-3">
                                                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: text }}>{counts[label] || 0}</div>
                                                <div style={{ fontSize: '0.7rem', letterSpacing: '1px', color: text, textTransform: 'uppercase' }}>{label}</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                                <Col xs={6} sm={4} md={2}>
                                    <Card style={{ borderRadius: 0, border: 'none', backgroundColor: '#000' }}>
                                        <Card.Body className="text-center py-3">
                                            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>
                                                ₦{orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + Number(o.total), 0).toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', letterSpacing: '1px', color: '#ccc', textTransform: 'uppercase' }}>Revenue</div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            {/* Search + filter */}
                            <div className="d-flex gap-3 mb-4 flex-wrap">
                                <Form.Control type="text" placeholder="Search by reference, email or phone..."
                                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                                    style={{ borderRadius: 0, maxWidth: '400px', border: '1px solid #000' }} />
                                <Form.Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                    style={{ borderRadius: 0, maxWidth: '180px', border: '1px solid #000' }}>
                                    <option value="All">All Statuses</option>
                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </Form.Select>
                            </div>

                            {ordersError && (
                                <div className="alert" style={{ borderRadius: 0, border: '1px solid #dc3545' }}>{ordersError}</div>
                            )}

                            {ordersLoading ? (
                                <div className="text-center py-5"><Spinner animation="border" variant="dark" /></div>
                            ) : (
                                <Row className="g-3">
                                    <Col lg={selectedOrder ? 7 : 12}>
                                        <Card style={{ borderRadius: 0, border: '1px solid #dee2e6' }}>
                                            <div style={{ overflowX: 'auto' }}>
                                                <Table hover className="mb-0" style={{ fontSize: '0.85rem' }}>
                                                    <thead style={{ backgroundColor: '#000', color: '#fff' }}>
                                                        <tr>
                                                            {['Reference', 'Customer', 'Date', 'Total', 'Status', 'Action'].map(h => (
                                                                <th key={h} style={{ fontWeight: 400, letterSpacing: '1px', padding: '12px 16px' }}>{h.toUpperCase()}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredOrders.length === 0 ? (
                                                            <tr><td colSpan={6} className="text-center py-5 text-muted">No orders found</td></tr>
                                                        ) : filteredOrders.map(order => (
                                                            <tr key={order.reference}
                                                                style={{ cursor: 'pointer', backgroundColor: selectedOrder?.reference === order.reference ? '#f0f0f0' : 'transparent' }}
                                                                onClick={() => setSelectedOrder(selectedOrder?.reference === order.reference ? null : order)}>
                                                                <td style={{ padding: '12px 16px' }}>
                                                                    <span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>...{order.reference?.slice(-10)}</span>
                                                                </td>
                                                                <td style={{ padding: '12px 16px' }}>
                                                                    <div>{order.customer_email}</div>
                                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{order.customer_phone}</div>
                                                                </td>
                                                                <td style={{ padding: '12px 16px' }}>
                                                                    {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </td>
                                                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>₦{Number(order.total).toLocaleString()}</td>
                                                                <td style={{ padding: '12px 16px' }}>
                                                                    <Badge bg={STATUS_COLORS[order.status] || 'secondary'} style={{ fontSize: '0.7rem' }}>{order.status}</Badge>
                                                                </td>
                                                                <td style={{ padding: '12px 16px' }} onClick={e => e.stopPropagation()}>
                                                                    <Form.Select size="sm" value={order.status}
                                                                        disabled={updatingRef === order.reference}
                                                                        onChange={e => updateStatus(order.reference, e.target.value)}
                                                                        style={{ borderRadius: 0, fontSize: '0.75rem', minWidth: '120px' }}>
                                                                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                                    </Form.Select>
                                                                </td>
                                                            </tr>
                                                        ))}
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
                                                        <h6 style={{ letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 0 }}>Order Details</h6>
                                                        <button onClick={() => setSelectedOrder(null)}
                                                            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
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
                                                    {(typeof selectedOrder.items === 'string' ? JSON.parse(selectedOrder.items) : selectedOrder.items).map((item, i) => (
                                                        <div key={i} className="d-flex align-items-center gap-3 mb-3">
                                                            {item.pic && <div style={{ width: '50px', height: '50px', flexShrink: 0, backgroundImage: `url(${item.pic})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
                                                            <div className="flex-grow-1" style={{ fontSize: '0.82rem' }}>
                                                                <div className="fw-bold">{item.name}</div>
                                                                <div className="text-muted">{item.size} × {item.qty}</div>
                                                            </div>
                                                            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>₦{(item.amount * item.qty).toLocaleString()}</div>
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
                                                            <Button key={s} size="sm"
                                                                variant={selectedOrder.status === s ? 'dark' : 'outline-dark'}
                                                                style={{ borderRadius: 0, fontSize: '0.72rem' }}
                                                                disabled={updatingRef === selectedOrder.reference}
                                                                onClick={() => updateStatus(selectedOrder.reference, s)}>
                                                                {s}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    {selectedOrder.customer_phone && (
                                                        <Button className="w-100 mt-3"
                                                            style={{ backgroundColor: '#25D366', border: 'none', borderRadius: 0, fontSize: '0.8rem' }}
                                                            onClick={() => {
                                                                const msg = `Hi, this is The Jiggy Standard. Your order ${selectedOrder.reference.slice(-8)} is now ${selectedOrder.status}.`
                                                                window.open(`https://wa.me/${selectedOrder.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank')
                                                            }}>
                                                            📱 WhatsApp Customer
                                                        </Button>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}
                                </Row>
                            )}
                        </>
                    )}

                    {/* ══════════════════════════════════════
                        CAROUSEL TAB
                    ══════════════════════════════════════ */}
                    {activeTab === 'carousel' && (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.82rem' }}>
                                        {slides.length} slide{slides.length !== 1 ? 's' : ''} in carousel · sorted by slide order
                                    </p>
                                </div>
                                <Button variant="dark" style={{ borderRadius: 0, letterSpacing: '1px', fontSize: '0.78rem' }}
                                    onClick={openNewSlideForm}>
                                    + Add Slide
                                </Button>
                            </div>

                            {slidesError && (
                                <div className="alert" style={{ borderRadius: 0, border: '1px solid #dc3545' }}>{slidesError}</div>
                            )}

                            {slidesLoading ? (
                                <div className="text-center py-5"><Spinner animation="border" variant="dark" /></div>
                            ) : (
                                <>
                                    {slides.length === 0 ? (
                                        <div className="text-center py-5">
                                            <i className="bi bi-images" style={{ fontSize: '3rem', color: '#ccc', display: 'block', marginBottom: '1rem' }}></i>
                                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>No slides yet. Add your first carousel slide.</p>
                                        </div>
                                    ) : (
                                        <Row className="g-3">
                                            {slides.sort((a, b) => a.slide_order - b.slide_order).map(slide => (
                                                <Col key={slide.id} md={6} lg={4}>
                                                    <Card style={{ borderRadius: 0, border: '1px solid #ddd', overflow: 'hidden' }}>
                                                        {/* Slide preview image */}
                                                        <div style={{ position: 'relative', height: '200px', backgroundColor: '#f0f0f0' }}>
                                                            <img src={slide.pic} alt={slide.caption}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                onError={e => { e.target.style.display = 'none' }} />
                                                            {/* Order badge */}
                                                            <span style={{
                                                                position: 'absolute', top: '8px', left: '8px',
                                                                background: '#000', color: '#fff',
                                                                fontSize: '0.6rem', letterSpacing: '1px',
                                                                padding: '3px 8px', fontFamily: 'Jost, sans-serif'
                                                            }}>
                                                                Slide {slide.slide_order}
                                                            </span>
                                                        </div>
                                                        <Card.Body style={{ padding: '1rem' }}>
                                                            <p style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                                                                {slide.caption || '—'}
                                                            </p>
                                                            <p style={{ fontSize: '0.72rem', color: '#888', marginBottom: '12px' }}>
                                                                Button: {slide.cta_text} → {slide.cta_path}
                                                            </p>
                                                            <div className="d-flex gap-2">
                                                                <Button variant="outline-dark" size="sm"
                                                                    style={{ borderRadius: 0, fontSize: '0.72rem', flex: 1 }}
                                                                    onClick={() => openEditSlideForm(slide)}>
                                                                    Edit
                                                                </Button>
                                                                <Button variant="outline-danger" size="sm"
                                                                    style={{ borderRadius: 0, fontSize: '0.72rem' }}
                                                                    onClick={() => handleDeleteSlide(slide.id)}>
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}

                                    {/* ── Slide form (add/edit) ── */}
                                    {showSlideForm && (
                                        <div style={{
                                            position: 'fixed', inset: 0,
                                            background: 'rgba(0,0,0,0.5)',
                                            zIndex: 2000,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            padding: '1rem'
                                        }}
                                            onClick={e => { if (e.target === e.currentTarget) setShowSlideForm(false) }}>
                                            <div style={{ background: '#fff', width: '100%', maxWidth: '520px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                                                <button onClick={() => setShowSlideForm(false)}
                                                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#888' }}>
                                                    ×
                                                </button>
                                                <h5 style={{ fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                                                    {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                                                </h5>

                                                {slideFormError && (
                                                    <div className="alert alert-danger" style={{ borderRadius: 0, fontSize: '0.82rem', marginBottom: '1rem' }}>
                                                        {slideFormError}
                                                    </div>
                                                )}

                                                <Form onSubmit={handleSlideSubmit}>
                                                    {/* Image upload */}
                                                    <div className="mb-3">
                                                        <label style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '8px' }}>
                                                            Slide Image *
                                                        </label>
                                                        <label style={{
                                                            display: 'block', width: '100%', height: '180px',
                                                            border: `2px dashed ${slidePic ? 'var(--jw-gold)' : '#ccc'}`,
                                                            cursor: 'pointer', position: 'relative',
                                                            overflow: 'hidden', background: slidePic ? 'transparent' : '#fafafa'
                                                        }}>
                                                            <input type="file" accept="image/*" style={{ display: 'none' }}
                                                                onChange={e => { if (e.target.files[0]) uploadToCloudinary(e.target.files[0]) }} />
                                                            {slideUploading ? (
                                                                <div className="d-flex align-items-center justify-content-center h-100">
                                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                                    <span style={{ fontSize: '0.8rem' }}>Uploading...</span>
                                                                </div>
                                                            ) : slidePic ? (
                                                                <img src={slidePic} alt="slide preview"
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            ) : (
                                                                <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                                                                    <i className="bi bi-cloud-upload" style={{ fontSize: '2rem' }}></i>
                                                                    <span style={{ fontSize: '0.75rem', marginTop: '8px' }}>Tap to upload</span>
                                                                </div>
                                                            )}
                                                        </label>
                                                        {slidePic && (
                                                            <button type="button" onClick={() => setSlidePic('')}
                                                                style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#dc3545', cursor: 'pointer', padding: '4px 0' }}>
                                                                × Remove
                                                            </button>
                                                        )}
                                                    </div>

                                                    {/* Caption */}
                                                    <Form.Group className="mb-3">
                                                        <label style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '6px' }}>
                                                            Caption *
                                                        </label>
                                                        <Form.Control value={slideCaption} onChange={e => setSlideCaption(e.target.value)}
                                                            style={{ borderRadius: 0 }} placeholder="e.g. New Collection · Lagos Style" />
                                                    </Form.Group>

                                                    {/* CTA Text */}
                                                    <Form.Group className="mb-3">
                                                        <label style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '6px' }}>
                                                            Button Text
                                                        </label>
                                                        <Form.Control value={slideCtaText} onChange={e => setSlideCtaText(e.target.value)}
                                                            style={{ borderRadius: 0 }} placeholder="e.g. Shop Now" />
                                                    </Form.Group>

                                                    {/* CTA Path */}
                                                    <Form.Group className="mb-3">
                                                        <label style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '6px' }}>
                                                            Button Links To
                                                        </label>
                                                        <Form.Select value={slideCtaPath} onChange={e => setSlideCtaPath(e.target.value)}
                                                            style={{ borderRadius: 0 }}>
                                                            {CTA_PATHS.map(p => (
                                                                <option key={p.value} value={p.value}>{p.label}</option>
                                                            ))}
                                                        </Form.Select>
                                                    </Form.Group>

                                                    {/* Slide order */}
                                                    <Form.Group className="mb-4">
                                                        <label style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '6px' }}>
                                                            Slide Order (1 = first)
                                                        </label>
                                                        <Form.Control type="number" min={1} max={20}
                                                            value={slideOrder} onChange={e => setSlideOrder(Number(e.target.value))}
                                                            style={{ borderRadius: 0, width: '100px' }} />
                                                    </Form.Group>

                                                    <Button type="submit" variant="dark"
                                                        style={{ borderRadius: 0, letterSpacing: '1px', width: '100%', padding: '0.85rem' }}
                                                        disabled={slideSubmitting || slideUploading}>
                                                        {slideSubmitting ? 'Saving...' : editingSlide ? 'Save Changes' : 'Add to Carousel'}
                                                    </Button>
                                                </Form>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </Container>
            </div>
            <Footer />
        </div>
    )
}