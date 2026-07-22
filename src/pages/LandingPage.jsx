const BASE_URL = 'https://jiggy-wears-api.onrender.com'

import axios from 'axios'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../features/orders/orderSlice'

export default function LandingPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const token = useSelector((state) => state.orders.token)
    const userEmail = useSelector((state) => state.orders.userEmail)
    const [showModal, setShowModal] = useState(false)
    const [isSignup, setIsSignup] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState('')
    const [loading, setLoading] = useState(false)
    const openModal = (signupMode = false) => {
        setIsSignup(signupMode)
        setAuthError('')
        setUsername('')
        setPassword('')
        setShowModal(true)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setAuthError('')
        setLoading(true)
        try {
            const res = await axios.post(`${BASE_URL}/login`, { username, password })
            if (res.data.auth) {
                dispatch(setToken({ token: res.data.token, username }))
                setShowModal(false)
                setUsername('')
                setPassword('')
                navigate('/home')
            }
            else {
                setAuthError('Invalid username or password')
            }
        }
        catch {
            setAuthError('Invalid ussername or password')
        }
        finally {
            setLoading(false)
        }
    }

    const handleSignup = async (e) => {
        e.preventDefault()
        setAuthError('')
        setLoading(true)
        try {
            await axios.post(`${BASE_URL}/signup`, { username, password })
            const res = await axios.post(`${BASE_URL}/login`, { username, password })
            if (res.data.auth) {
                dispatch(setToken({ token: res.data.token, username }))
                setShowModal(false)
                setUsername('')
                setPassword('')
                navigate('/home')
            }
        }
        catch {
            setAuthError('username already exists or signup failed')
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* ── LANDING PAGE ── */}
            <div style={{
                height: '100vh',
                width: '100vw',
                position: 'relative',
                overflow: 'hidden',
                backgroundColor: '#0a0a0a'
            }}>
                {/* Background image */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(https://res.cloudinary.com/dqcztgs4v/image/upload/v1748829185/photo_6188138139789411362_y_vvoesc.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    opacity: 0.55,
                }} />

                {/* Gradient overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.8) 100%)'
                }} />

                {/* Top bar */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    padding: '28px 40px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 10
                }}>
                    {/* Brand */}
                    <div style={{
                        color: '#fff',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.1rem',
                        letterSpacing: '6px',
                        fontWeight: 300,
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <img
                            src='https://res.cloudinary.com/dqcztgs4v/image/upload/v1784291469/photo_6255724771660207207_x_elph2s.jpg'
                            alt='Jiggy Wears logo'
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '1px solid rgba(255,255,255,0.3)'
                            }}
                        />
                    </div>

                    {/* Top right — show username if logged in, else login/signup buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {token ? (
                            <span style={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.7rem',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                fontFamily: 'Jost, sans-serif'
                            }}>
                                Welcome, {userEmail}
                            </span>
                        ) : (
                            <>
                                <button
                                    onClick={() => openModal(false)}
                                    style={{
                                        background: 'none',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        color: '#fff',
                                        padding: '7px 18px',
                                        fontSize: '0.65rem',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        fontFamily: 'Jost, sans-serif',
                                        transition: 'all 0.2s ease',
                                        borderRadius: '20px'
                                    }}
                                    onMouseEnter={e => e.target.style.borderColor = '#fff'}
                                    onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.4)'}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => openModal(true)}
                                    style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.4)',
                                        color: '#fff',
                                        padding: '7px 18px',
                                        fontSize: '0.65rem',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        fontFamily: 'Jost, sans-serif',
                                        transition: 'all 0.2s ease',
                                        borderRadius: '20px'
                                    }}
                                    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
                                    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Hero content */}
                <div style={{
                    position: 'absolute',
                    bottom: '12%',
                    left: 0, right: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    zIndex: 10,
                    padding: '0 24px'
                }}>
                    <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.5)', marginBottom: '24px' }} />

                    <p style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.65rem',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        marginBottom: '12px',
                        fontFamily: 'Jost, sans-serif'
                    }}>
                        Lagos · Nigeria
                    </p>

                    <h1 style={{
                        color: '#fff',
                        fontFamily: 'Cormorant Garamond, serif',
                        fontWeight: 300,
                        lineHeight: 1.1,
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                        textAlign: 'center'
                    }}>
                        <span style={{
                            display: 'block',
                            fontSize: 'clamp(0.9rem, 3vw, 1.4rem)',
                            letterSpacing: '6px',
                            color: 'rgba(255,255,255,0.7)',
                            marginBottom: '8px',
                            fontWeight: 300
                        }}>
                            The
                        </span>
                        <span style={{
                            display: 'block',
                            fontSize: 'clamp(3rem, 9vw, 7rem)',
                            letterSpacing: '4px',
                            fontWeight: 300,
                            lineHeight: 1
                        }}>
                            Jiggy
                        </span>
                        <span style={{
                            display: 'block',
                            fontSize: 'clamp(1.8rem, 6vw, 4.5rem)',
                            letterSpacing: '8px',
                            fontWeight: 200,
                            color: 'rgba(255,255,255,0.85)'
                        }}>
                            Standard
                        </span>
                    </h1>

                    <p style={{
                        color: 'rgba(255,255,255,0.55)',
                        fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        marginBottom: '44px',
                        fontFamily: 'Jost, sans-serif',
                        fontWeight: 300
                    }}>
                        Curated Luxury Apparel
                    </p>

                    {/* Shop Now CTA */}
                    <button
                        onClick={() => navigate('/home')}
                        style={{
                            backgroundColor: '#fff',
                            color: '#000',
                            border: 'none',
                            padding: '16px 56px',
                            fontSize: '0.72rem',
                            letterSpacing: '3px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            fontFamily: 'Jost, sans-serif',
                            fontWeight: 500,
                            marginBottom: '28px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => {
                            e.target.style.backgroundColor = '#e8c97e'
                            e.target.style.letterSpacing = '4px'
                        }}
                        onMouseLeave={e => {
                            e.target.style.backgroundColor = '#fff'
                            e.target.style.letterSpacing = '3px'
                        }}
                    >
                        Shop Now
                    </button>

                    {/* Secondary nav links */}
                    <div className="landing-nav-links" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                        {['Men', 'Women', 'Track Order'].map((label, i) => (
                            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.5rem' }}>·</span>}
                                <button
                                    onClick={() => navigate(label === 'Track Order' ? '/track' : `/${label.toLowerCase()}`)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.55)',
                                        fontSize: '0.62rem',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        fontFamily: 'Jost, sans-serif',
                                        padding: 0,
                                        transition: 'color 0.2s ease'
                                    }}
                                    onMouseEnter={e => e.target.style.color = '#fff'}
                                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                                >
                                    {label}
                                </button>
                            </span>
                        ))}
                    </div>

                    <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.25)', marginTop: '36px' }} />
                </div>

                {/* Bottom right label */}
                <div style={{
                    position: 'absolute',
                    bottom: '28px',
                    right: '36px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'rgba(255,255,255,0.35)',
                    fontSize: '0.58rem',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    fontFamily: 'Jost, sans-serif'
                }}>
                    <div style={{ width: '28px', height: '1px', backgroundColor: 'rgba(255,255,255,0.25)' }} />
                    New Collection
                </div>
            </div>

            {/* ── LOGIN / SIGNUP MODAL ── */}
            {showModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px'
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
                >
                    <div style={{
                        backgroundColor: '#fff',
                        width: '100%',
                        maxWidth: '400px',
                        padding: '48px 40px',
                        position: 'relative',
                        animation: 'fadeInUp 0.25s ease'
                    }}>
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '20px',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.4rem',
                                cursor: 'pointer',
                                color: '#888',
                                lineHeight: 1
                            }}
                        >
                            ×
                        </button>

                        {/* Modal header */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <p style={{
                                fontSize: '0.65rem',
                                letterSpacing: '3px',
                                textTransform: 'uppercase',
                                color: '#888',
                                marginBottom: '8px',
                                fontFamily: 'Jost, sans-serif'
                            }}>
                                The Jiggy Standard
                            </p>
                            <h2 style={{
                                fontFamily: 'Cormorant Garamond, serif',
                                fontWeight: 300,
                                fontSize: '1.8rem',
                                letterSpacing: '2px',
                                marginBottom: 0
                            }}>
                                {isSignup ? 'Create Account' : 'Welcome Back'}
                            </h2>
                        </div>

                        {/* Toggle tabs */}
                        <div style={{
                            display: 'flex',
                            borderBottom: '1px solid #eee',
                            marginBottom: '28px'
                        }}>
                            {['Login', 'Sign Up'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setIsSignup(tab === 'Sign Up'); setAuthError('') }}
                                    style={{
                                        flex: 1,
                                        background: 'none',
                                        border: 'none',
                                        borderBottom: (tab === 'Sign Up') === isSignup ? '2px solid #000' : '2px solid transparent',
                                        padding: '10px',
                                        fontSize: '0.7rem',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        fontFamily: 'Jost, sans-serif',
                                        color: (tab === 'Sign Up') === isSignup ? '#000' : '#aaa',
                                        marginBottom: '-1px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Error */}
                        {authError && (
                            <div style={{
                                backgroundColor: '#fff5f5',
                                border: '1px solid #ffcccc',
                                color: '#cc0000',
                                padding: '10px 14px',
                                fontSize: '0.78rem',
                                marginBottom: '20px',
                                fontFamily: 'Jost, sans-serif'
                            }}>
                                {authError}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={isSignup ? handleSignup : handleLogin}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.65rem',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#555',
                                    marginBottom: '8px',
                                    fontFamily: 'Jost, sans-serif'
                                }}>
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        border: '1px solid #ddd',
                                        borderRadius: 0,
                                        padding: '12px 14px',
                                        fontSize: '0.9rem',
                                        fontFamily: 'Jost, sans-serif',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#000'}
                                    onBlur={e => e.target.style.borderColor = '#ddd'}
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.65rem',
                                    letterSpacing: '2px',
                                    textTransform: 'uppercase',
                                    color: '#555',
                                    marginBottom: '8px',
                                    fontFamily: 'Jost, sans-serif'
                                }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        border: '1px solid #ddd',
                                        borderRadius: 0,
                                        padding: '12px 14px',
                                        fontSize: '0.9rem',
                                        fontFamily: 'Jost, sans-serif',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={e => e.target.style.borderColor = '#000'}
                                    onBlur={e => e.target.style.borderColor = '#ddd'}
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    backgroundColor: loading ? '#555' : '#000',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '14px',
                                    fontSize: '0.72rem',
                                    letterSpacing: '3px',
                                    textTransform: 'uppercase',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    fontFamily: 'Jost, sans-serif',
                                    transition: 'background-color 0.2s ease'
                                }}
                            >
                                {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
                            </button>
                        </form>

                        {/* Guest option */}
                        <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <button
                                onClick={() => { setShowModal(false); navigate('/home') }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '0.68rem',
                                    letterSpacing: '1px',
                                    color: '#888',
                                    cursor: 'pointer',
                                    fontFamily: 'Jost, sans-serif',
                                    textDecoration: 'underline',
                                    textUnderlineOffset: '3px'
                                }}
                            >
                                Continue as guest →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>

    )
}
