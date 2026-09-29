import { useState } from 'react'
import { useDispatch } from "react-redux"
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap"
import { createProduct } from '../features/orders/orderSlice'

const CLOUDINARY_CLOUD_NAME = 'dqcztgs4v'
const CLOUDINARY_UPLOAD_PRESET = 'jiggy_unsigned'

export default function CreateOrderModal({ show, handleClose }) {
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [pic, setPic] = useState('')
    const [backpic, setBackPic] = useState('')
    const [category, setCategory] = useState('other')
    const [gender, setGender] = useState('')
    const [validationError, setValidationError] = useState('')
    const [uploading, setUploading] = useState({ front: false, back: false })

    // ── Size system ──
    // Admin types sizes as comma-separated e.g. "S, M, L, XL, XXL"
    // We convert to a stock object: { S: true, M: true, L: true, XL: true, XXL: true }
    const [sizesInput, setSizesInput] = useState('')
    // Track which sizes are marked out of stock
    const [outOfStock, setOutOfStock] = useState([])

    // Parse the sizes input into an array of clean size strings
    function parseSizes(input) {
        return input
            .split(',')
            .map(s => s.trim())
            .filter(s => s.length > 0)
    }

    // Build stock object from sizes and out-of-stock list
    function buildStock(sizes) {
        if (sizes.length === 0) return null
        const stock = {}
        sizes.forEach(size => {
            stock[size] = !outOfStock.includes(size)
        })
        return stock
    }

    function toggleOutOfStock(size) {
        setOutOfStock(prev =>
            prev.includes(size)
                ? prev.filter(s => s !== size)
                : [...prev, size]
        )
    }

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
            } else {
                setValidationError('Upload failed. Check your Cloudinary settings.')
            }
        } catch {
            setValidationError('Upload failed. Check your internet connection.')
        } finally {
            setUploading(prev => ({ ...prev, [side]: false }))
        }
    }

    const handleFileChange = (e, side) => {
        const file = e.target.files[0]
        if (!file) return
        if (!file.type.startsWith('image/')) { setValidationError('Please select an image file'); return }
        if (file.size > 10 * 1024 * 1024) { setValidationError('Image must be under 10MB'); return }
        setValidationError('')
        uploadToCloudinary(file, side)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name.trim() || !description.trim() || !amount || !pic || !backpic || !gender) {
            setValidationError('Please fill in every field and upload both images.')
            return
        }
        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            setValidationError('Price must be a valid positive number.')
            return
        }
        const sizes = parseSizes(sizesInput)
        if (sizes.length === 0) {
            setValidationError('Please enter at least one size e.g. S, M, L, XL')
            return
        }
        setValidationError('')
        const stock = buildStock(sizes)
        dispatch(createProduct({
            name, description, amount, pic, backpic, gender, category, stock
        }))
        // Reset all fields
        setName(''); setDescription(''); setAmount('')
        setPic(''); setBackPic('')
        setCategory('other'); setGender('')
        setSizesInput(''); setOutOfStock([])
        handleClose()
    }

    const ImageUploadBox = ({ label, url, side }) => (
        <div className='mb-3'>
            <p style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                {label}
            </p>
            <label style={{
                display: 'block', width: '100%', height: '140px',
                border: `2px dashed ${url ? '#000' : '#ccc'}`,
                cursor: 'pointer', position: 'relative',
                overflow: 'hidden', backgroundColor: url ? 'transparent' : '#fafafa'
            }}>
                <input type='file' accept='image/*' style={{ display: 'none' }}
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
                        <i className="bi bi-cloud-upload" style={{ fontSize: '2rem' }}></i>
                        <span style={{ fontSize: '0.75rem', marginTop: '8px' }}>Tap to upload</span>
                    </div>
                )}
            </label>
            {url && (
                <button type="button"
                    onClick={() => side === 'front' ? setPic('') : setBackPic('')}
                    style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: '#dc3545', cursor: 'pointer', padding: '4px 0' }}>
                    × Remove
                </button>
            )}
        </div>
    )

    const sizes = parseSizes(sizesInput)

    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase' }}>
                    Create New Product
                </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
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
                            <Form.Control value={name} onChange={e => setName(e.target.value)}
                                className='mb-3' style={{ borderRadius: 0 }} placeholder='Product name' />
                            <Form.Control value={description} onChange={e => setDescription(e.target.value)}
                                className='mb-3' style={{ borderRadius: 0 }} as='textarea' rows={2}
                                placeholder='Product description' />
                            <Form.Select value={gender} onChange={e => setGender(e.target.value)}
                                className='mb-3' style={{ borderRadius: 0 }}>
                                <option value=''>Select Gender</option>
                                <option value='male'>Men</option>
                                <option value='female'>Women</option>
                                <option value='unisex'>Unisex</option>
                            </Form.Select>
                            <Form.Select value={category} onChange={e => setCategory(e.target.value)}
                                className='mb-3' style={{ borderRadius: 0 }}>
                                <option value='other'>Select Category</option>
                                <option value='T-shirts'>T-shirts</option>
                                <option value='Shirts'>Shirts</option>
                                <option value='Shorts'>Shorts</option>
                                <option value='Trousers'>Trousers</option>
                                <option value='Dresses'>Dresses</option>
                                <option value='Tops'>Tops</option>
                                <option value='Skirts'>Skirts</option>
                                <option value='Accessories'>Accessories</option>
                            </Form.Select>
                            <Form.Control value={amount} onChange={e => setAmount(e.target.value)}
                                className='mb-3' type='number' style={{ borderRadius: 0 }} placeholder='Price (₦)' />

                            {/* ── SIZE SYSTEM ── */}
                            <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
                                <label style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '6px' }}>
                                    Sizes Available
                                </label>
                                <Form.Control
                                    value={sizesInput}
                                    onChange={e => { setSizesInput(e.target.value); setOutOfStock([]) }}
                                    style={{ borderRadius: 0, marginBottom: '8px' }}
                                    placeholder='e.g. S, M, L, XL, XXL  or  28, 30, 32, 34  or  Free Size'
                                />
                                <p style={{ fontSize: '0.65rem', color: '#999', marginBottom: '10px' }}>
                                    Separate sizes with commas. They appear exactly as you type them.
                                </p>

                                {/* Preview — tap to mark out of stock */}
                                {sizes.length > 0 && (
                                    <div>
                                        <p style={{ fontSize: '0.65rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#555', marginBottom: '8px' }}>
                                            Tap a size to mark it out of stock
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {sizes.map(size => {
                                                const oos = outOfStock.includes(size)
                                                return (
                                                    <button
                                                        key={size}
                                                        type="button"
                                                        onClick={() => toggleOutOfStock(size)}
                                                        style={{
                                                            padding: '8px 14px',
                                                            border: `2px solid ${oos ? '#dc3545' : 'var(--jw-gold)'}`,
                                                            background: oos ? '#fff5f5' : 'var(--jw-gold)',
                                                            color: oos ? '#dc3545' : '#000',
                                                            fontSize: '0.72rem',
                                                            fontWeight: 600,
                                                            letterSpacing: '1px',
                                                            cursor: 'pointer',
                                                            borderRadius: 0,
                                                            fontFamily: 'Jost, sans-serif',
                                                            textDecoration: oos ? 'line-through' : 'none',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                    >
                                                        {size}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <p style={{ fontSize: '0.62rem', color: '#999', marginTop: '6px' }}>
                                            Yellow = in stock · Red strikethrough = out of stock
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid #eee' }}>
                    <Button type='submit' variant="dark"
                        style={{ borderRadius: 0, letterSpacing: '1px', paddingLeft: '2rem', paddingRight: '2rem' }}
                        disabled={uploading.front || uploading.back}>
                        {uploading.front || uploading.back ? 'Uploading...' : 'Upload Product'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    )
}