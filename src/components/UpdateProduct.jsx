import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateProduct } from '../features/orders/orderSlice'
import { Button, Col, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { parseStock } from '../utils/stockHelper'


const CLOUDINARY_CLOUD_NAME = 'dqcztgs4v'
const CLOUDINARY_UPLOAD_PRESET = 'jiggy_unsigned'

export default function UpdateProduct({ product, show, handleClose }) {
    const dispatch = useDispatch()
    const [name, setName] = useState(product.name)
    const [description, setDescription] = useState(product.description)
    const [amount, setAmount] = useState(product.amount)
    const [pic, setPic] = useState(product.pic)
    const [backpic, setBackPic] = useState(product.backpic)
    const [gender, setGender] = useState(product.gender || '')
    const [category, setCategory] = useState(product.category || 'other')
    const [validationError, setValidationError] = useState('')
    const [uploading, setUploading] = useState({ front: false, back: false })

    // Stock — null means no tracking (unlimited), object means tracking per size
    const [trackStock, setTrackStock] = useState(!!product.stock)
    const [stock, setStock] = useState(() => {
        const parsed = parseStock(product.stock)
        return parsed || { small: true, medium: true, large: true }
    })

    useEffect(() => {
        if (product) {
            setName(product.name)
            setDescription(product.description)
            setAmount(product.amount)
            setPic(product.pic)
            setBackPic(product.backpic)
            setGender(product.gender || '')
            setCategory(product.category || 'other')
            const parsed = parseStock(product.stock)
            setTrackStock(!!parsed)
            setStock(parsed || { small: true, medium: true, large: true })
        }
    }, [product])

    const uploadToCloudinary = async (file, side) => {
        setUploading(prev => ({ ...prev, [side]: true }))
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
                if (side === 'front') setPic(data.secure_url)
                else setBackPic(data.secure_url)
            }
        } catch {
            setValidationError('Image upload failed.')
        } finally {
            setUploading(prev => ({ ...prev, [side]: false }))
        }
    }

    const handleFileChange = (e, side) => {
        const file = e.target.files[0]
        if (!file) return
        uploadToCloudinary(file, side)
    }

    const handleUpdate = (e) => {
        e.preventDefault()
        if (!name.trim() || !description.trim() || !amount || !pic || !backpic || !gender) {
            setValidationError('Please fill in every field.')
            return
        }
        setValidationError('')
        dispatch(updateProduct({
            id: product.id,
            name, description, amount, pic, backpic, gender, category,
            stock: trackStock ? stock : null
        }))
        handleClose()
    }

    const ImageUploadBox = ({ label, url, side }) => (
        <div className="mb-3">
            <p style={{ fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', color: '#555' }}>
                {label}
            </p>
            <label style={{
                display: 'block', width: '100%', height: '120px',
                border: `2px dashed ${url ? 'var(--jw-gold)' : '#ddd'}`,
                cursor: 'pointer', position: 'relative',
                overflow: 'hidden', backgroundColor: url ? 'transparent' : 'var(--jw-cream)'
            }}>
                <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, side)} />
                {uploading[side] ? (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <Spinner animation="border" size="sm" className="me-2" />
                        <span style={{ fontSize: '0.8rem' }}>Uploading...</span>
                    </div>
                ) : url ? (
                    <img src={url} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                        <i className="bi bi-cloud-upload" style={{ fontSize: '1.5rem' }}></i>
                        <span style={{ fontSize: '0.7rem', marginTop: '6px' }}>Tap to upload</span>
                    </div>
                )}
            </label>
            {url && (
                <button type="button"
                    onClick={() => side === 'front' ? setPic('') : setBackPic('')}
                    style={{ background: 'none', border: 'none', fontSize: '0.7rem', color: '#dc3545', cursor: 'pointer', padding: '2px 0' }}>
                    × Remove
                </button>
            )}
        </div>
    )

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title style={{ fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '1rem' }}>
                    Edit Product
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleUpdate}>
                <Modal.Body>
                    {validationError && (
                        <div className="alert alert-danger" style={{ borderRadius: 0, fontSize: '0.85rem' }}>
                            {validationError}
                        </div>
                    )}
                    <Row>
                        <Col md={6}>
                            <ImageUploadBox label="Front Photo" url={pic} side="front" />
                            <ImageUploadBox label="Back Photo" url={backpic} side="back" />
                        </Col>
                        <Col md={6}>
                            <Form.Control value={name} onChange={(e) => setName(e.target.value)}
                                className="mb-3" style={{ borderRadius: 0 }} placeholder="Product name" />
                            <Form.Control value={description} onChange={(e) => setDescription(e.target.value)}
                                className="mb-3" as="textarea" rows={2} style={{ borderRadius: 0 }} placeholder="Description" />
                            <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}
                                className="mb-3" style={{ borderRadius: 0 }}>
                                <option value="">Select Gender</option>
                                <option value="male">Men</option>
                                <option value="female">Women</option>
                                <option value="unisex">Unisex</option>
                            </Form.Select>
                            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}
                                className="mb-3" style={{ borderRadius: 0 }}>
                                <option value="other">Select Category</option>
                                <option value="T-shirts">T-shirts</option>
                                <option value="Shirts">Shirts</option>
                                <option value="Shorts">Shorts</option>
                                <option value="Trousers">Trousers</option>
                                <option value="Dresses">Dresses</option>
                                <option value="Tops">Tops</option>
                                <option value="Skirts">Skirts</option>
                                <option value="Accessories">Accessories</option>
                            </Form.Select>
                            <Form.Control value={amount} onChange={(e) => setAmount(e.target.value)}
                                className="mb-3" type="number" style={{ borderRadius: 0 }} placeholder="Price (₦)" />

                            {/* ── STOCK MANAGEMENT ── */}
                            <div style={{ borderTop: '1px solid var(--jw-border)', paddingTop: '16px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <label style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', marginBottom: 0 }}>
                                        Track Stock
                                    </label>
                                    {/* Toggle switch */}
                                    <button type="button" onClick={() => setTrackStock(p => !p)}
                                        style={{
                                            width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                                            backgroundColor: trackStock ? 'var(--jw-gold)' : '#ccc',
                                            position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s ease'
                                        }}>
                                        <span style={{
                                            position: 'absolute', top: '3px',
                                            left: trackStock ? '23px' : '3px',
                                            width: '18px', height: '18px', borderRadius: '50%',
                                            backgroundColor: '#fff', transition: 'left 0.2s ease'
                                        }} />
                                    </button>
                                </div>

                                {trackStock && (
                                    <div>
                                        <p style={{ fontSize: '0.65rem', color: '#888', marginBottom: '10px', fontFamily: 'Jost, sans-serif' }}>
                                            Toggle sizes that are available
                                        </p>
                                        <div className="d-flex gap-2">
                                            {['small', 'medium', 'large'].map(size => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => setStock(prev => ({ ...prev, [size]: !prev[size] }))}
                                                    style={{
                                                        flex: 1,
                                                        padding: '10px 4px',
                                                        border: `2px solid ${stock[size] ? 'var(--jw-gold)' : '#ddd'}`,
                                                        backgroundColor: stock[size] ? 'var(--jw-gold)' : '#f9f9f9',
                                                        color: stock[size] ? '#fff' : '#999',
                                                        fontSize: '0.7rem',
                                                        letterSpacing: '1px',
                                                        textTransform: 'uppercase',
                                                        cursor: 'pointer',
                                                        borderRadius: 0,
                                                        transition: 'all 0.2s ease',
                                                        fontFamily: 'Jost, sans-serif'
                                                    }}
                                                >
                                                    {size[0].toUpperCase()}
                                                    <br />
                                                    <span style={{ fontSize: '0.55rem' }}>
                                                        {stock[size] ? 'In Stock' : 'Sold Out'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid var(--jw-border)' }}>
                    <Button type="submit" variant="dark"
                        style={{ borderRadius: 0, letterSpacing: '1px', paddingLeft: '2rem', paddingRight: '2rem' }}
                        disabled={uploading.front || uploading.back}>
                        {uploading.front || uploading.back ? 'Uploading...' : 'Save Changes'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}