import { useState } from 'react'
import { useDispatch } from "react-redux";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap"
import { createProduct } from '../features/orders/orderSlice';


const CLOUDINARY_CLOUD_NAME= 'dqcztgs4v'
const CLOUDINARY_UPLOAD_PRESET = 'jiggy_unsigned'

export default function CreateOrderModal({ show, handleClose }) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [pic, setPic] = useState('')
    const [backpic, setBackPic] = useState('')
    const [category, setCategory] = useState('other')
    const [gender, setGender] = useState('')
    const [validationError, setValidationError] = useState('')
    const [uploading, setUploading] = useState({front : false, back : false})


    const dispatch = useDispatch()

    const uploadToCloudinary = async (file, side) => {
        setUploading(prev => ({...prev, [side] : true}))

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
            else {
                setValidationError('Upload failed. Check your Cloudinary settings.')
            }
        }
        catch {
            setValidationError('Upload failed. Check your internet connection.')
        }
        finally {
            setUploading(prev => ({...prev, [side] : false}))
        }

    }

    const handleFileChange = (e, side) => {
        const file = e.target.files[0]
        if (!file) return
        if (!file.type.startsWith('image/')) {
            setValidationError('Please select an image file')
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            setValidationError('Imafe must be under 10MB')
            return
        }
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
        setValidationError('')

            dispatch(createProduct({ name, description, amount, pic, backpic, gender, category }))
            setName('')
            setDescription('')
            setAmount('')
            setPic('')
            setBackPic('')
            setCategory('other')
            setGender('')
            handleClose()
       
    }

    const ImageUploadBox = ({label, url, side}) => {
        return( 
       <div className='mb-3'>
            <p style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                {label}
            </p>
            <label
            style={{
                    display: 'block',
                    width: '100%',
                    height: '140px',
                    border: `2px dashed ${url ? '#000' : '#ccc'}`,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: url ? 'transparent' : '#fafafa'
                }}
            >
                <input
                 type='file'
                 accept='image/*'
                 style={{display : 'none'}}
                 onChange={(e) => handleFileChange(e, side)}
                />
                {uploading[side] ? (
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <Spinner animation="border" size="sm" className="me-2" />
                        <span style={{ fontSize: '0.8rem' }}>Uploading...</span>
                    </div>
                ) : url ? (
                    <img
                    src={url}
                    alt={label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}                    
                    />
                ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                        <i className="bi bi-cloud-upload" style={{ fontSize: '2rem' }}></i>
                        <span style={{ fontSize: '0.75rem', marginTop: '8px' }}>Tap to upload</span>
                    </div>
                )}
            </label>
             {url && (
                <button
                    type="button"
                    onClick={() => side === 'front' ? setPic('') : setBackPic('')}
                    style={{
                        background: 'none', border: 'none', fontSize: '0.75rem',
                        color: '#dc3545', cursor: 'pointer', padding: '4px 0'
                    }}
                >
                    × Remove
                </button>
            )}
        </div>
        )

    }
    
    return (
        <Modal show={show} onHide={handleClose} size='lg'>
            <Modal.Header closeButton>
                <Modal.Title style={{ fontWeight: 300, letterSpacing: '2px', textTransform: 'uppercase' }}>Create new Product</Modal.Title>
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
                        {/*Product details */}
                        <Col md={6}>
                            <Form.Control
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='mb-3'
                                style={{ borderRadius: 0 }}
                                placeholder='input product name'
                            />
                            
                            <Form.Control
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className='mb-3'
                                style={{ borderRadius: 0 }}
                                as='textarea'
                                rows={3}
                                placeholder='product description'
                            />
                            <Form.Select
                             value={gender}
                             onChange={(e) => setGender(e.target.value)}
                             className='mb-3'
                             style={{ borderRadius: 0 }}
                            >
                                <option value=''>Select Gender</option>
                                <option value='male'>Men</option>
                                <option value='female'> Women</option>
                                <option value='unisex'> Unisex</option>

                            </Form.Select>
                            <Form.Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='mb-3'
                            style={{ borderRadius: 0 }}
                            >
                                <option value='other'>Select Category</option>
                                <option value='T-shirts'> T-shirts</option>
                                <option value='Shirts'>Shirts</option>
                                <option value='Shorts'>Shorts</option>
                                <option value='Trousers'>Trousers</option>
                                <option value='Dresses'>Dresses</option>
                                <option value='Tops'>Tops</option>
                                <option value='Skirts'>Skirts</option>
                                 <option value='Accessories'>Accessories</option>

                            </Form.Select>
                            <Form.Control
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className='mb-3'
                                type='number'
                                style={{ borderRadius: 0 }}
                                placeholder='price (#)'
                            />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{ borderTop: '1px solid #eee' }}>
                    <Button
                    type='submit'
                    variant="dark"
                    style={{ borderRadius: 0, letterSpacing: '1px', paddingLeft: '2rem', paddingRight: '2rem' }}
                    disabled={uploading.front || uploading.back}
                     >
                            {uploading.front || uploading.back ? 'uploading...' : 'upload product'}
                        </Button>
                </Modal.Footer>

            </Form>

        </Modal>



    )
}
