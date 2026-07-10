import axios from "axios"
import { useState } from "react"
import NavBar from "../components/NavBar"
import { Badge, Button, Card, Container, Form } from "react-bootstrap"
import { Search } from "react-feather"
import Footer from "../components/Footer"

const BASE_URL = 'https://jiggy-wears-api.onrender.com'
const STATUS_COLORS = {
    'Processing' : 'warning',
    'Confirmed' : 'info',
    'Shipped' : 'primary',
    'Delivered' : 'success',
    'Cancelled' : 'danger'
}
export default function TrackOrder() {
    const [reference, setReference] = useState('')
    const [order, setOrder] = useState(null)
    const [notFound, setNotFound] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleTrack = async (e) => {
        e.preventDefault()
        if(!reference.trim()) return
        setLoading(true)
        setNotFound(false)
        setOrder(null)
        try {
               const res = await axios.get(`${BASE_URL}/order/${reference.trim()}`)
               setOrder(res.data)
        }
        catch (err) {
            setNotFound(true)
        }
        finally {
            setLoading(false)
        }
    }
  return (
    <div className="d-flex flex-column min-vh-100" >
        <NavBar/>
        <div className="flex-grow-1 py-5">
            <Container style={{maxWidth : '620px'}}>
                <div className="text-center mb-5">
                     <h2 style={{ fontWeight: 300, letterSpacing: '3px', textTransform: 'uppercase' }}>
                            Track Order
                        </h2>
                          <p className="text-muted" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                            Enter your Paystack payment reference
                        </p>
                        <Form onSubmit={handleTrack}>
                            <div className="d-flex gap-2">
                                <Form.Control
                                type="text"
                                placeholder="jiggy_1234567890..."
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                style={{ borderRadius: 0, border: '1px solid #000', padding: '0.75rem' }}
                                required
                                />
                              <Button
                              type="submit"
                              variant="dark"
                              disabled={loading}
                                   style={{ borderRadius: 0, padding: '0 24px', letterSpacing: '1px' }}

                              >
                                     {loading ? '...' : <Search size={18} />}
                              </Button>
                            </div>
                        </Form>

                    {notFound && (
                        <div className="alert mt-4 text-center" style={{ borderRadius: 0, border: '1px solid #dee2e6', backgroundColor: '#f8f9fa' }}>
                            No order found with that reference.
                        </div>
                    )}

                    {order && (
                        <Card className="mt-4" style={{ borderRadius: 0, border: '1px solid #000' }}>
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                     <div>
                                        <p className="mb-0" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: '#888' }}>REFERENCE</p>
                                        <p className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{order.reference}</p>
                                    </div>
                                     <Badge bg={STATUS_COLORS[order.status] || 'secondary'} style={{ letterSpacing: '1px', fontSize: '0.75rem' }}>
                                        {order.status}
                                    </Badge>
                                </div>
                                <hr/>
                                 <div className="mb-3">
                                    <p className="mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: '#888' }}>DATE</p>
                                    <p className="mb-0">{new Date(order.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className="mb-3">
                                 <p className="mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px', color: '#888' }}>ITEMS</p>
                                 {(typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item, i) => (
                                        <div key={i} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <div className="d-flex align-items-center gap-3">
                                                {item.pic && (
                                                    <div style={{
                                                        width: '45px', height: '45px',
                                                        backgroundImage: `url(${item.pic})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        flexShrink: 0
                                                    }} />
                                                )}
                                                <div>
                                                    <p className="mb-0 small fw-bold">{item.name}</p>
                                                    <p className="mb-0 small text-muted">{item.size} × {item.qty}</p>
                                                </div>
                                            </div>
                                            <span className="small">₦{(item.amount * item.qty).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>    
                                    <div className="pt-2">
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="small text-muted">Subtotal</span>
                                        <span className="small">₦{Number(order.subtotal).toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="small text-muted">Shipping</span>
                                        <span className="small">₦{Number(order.shipping_fee).toLocaleString()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold mt-2 pt-2" style={{ borderTop: '1px solid #000' }}>
                                        <span>Total</span>
                                        <span>₦{Number(order.total).toLocaleString()}</span>
                                    </div>
                                </div>         
                                  </Card.Body>
                        </Card>
                    )}
                </div>
            </Container>
        </div>
        <Footer/>
    </div>
  )
}
