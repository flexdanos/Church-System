import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaChurch, FaArrowRight, FaUser, FaLock, FaSpinner } from 'react-icons/fa'
import { supabase } from '../lib/supabaseClient'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            setError(null)

            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
        } catch (error: any) {
            setError(error.error_description || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    width: '100%',
                    maxWidth: '900px',
                    backgroundColor: '#fff',
                    borderRadius: '1rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    overflow: 'hidden',
                    display: 'flex',
                    minHeight: '480px',
                }}
            >
                {/* Left Side - Decorative */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    style={{
                        width: '45%',
                        background: 'linear-gradient(180deg, #9b1c31 0%, #6b1525 100%)',
                        padding: '3rem 2.5rem',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                >
                    <div style={{
                        marginBottom: '1.5rem',
                        padding: '1.25rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <FaChurch style={{ fontSize: '2.5rem' }} />
                    </div>

                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: 700,
                        marginBottom: '1rem',
                        textAlign: 'center',
                    }}>Welcome Back</h2>

                    <p style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                    }}>
                        Sign in to access your account and continue your spiritual journey with us.
                    </p>

                    <div style={{
                        width: '4rem',
                        height: '3px',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '999px',
                        marginBottom: '2rem',
                    }} />

                    <p style={{
                        fontSize: '0.875rem',
                        color: 'rgba(255, 255, 255, 0.75)',
                        textAlign: 'center',
                    }}>Don't have an account?</p>

                    <a
                        href="/signup"
                        style={{
                            marginTop: '0.75rem',
                            padding: '0.5rem 1.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            borderRadius: '999px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'background-color 0.3s',
                            textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
                    >
                        Sign Up <FaArrowRight style={{ fontSize: '0.7rem' }} />
                    </a>
                </motion.div>

                {/* Right Side - Form */}
                <div style={{
                    flex: 1,
                    padding: '3rem 2.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                            <FaChurch style={{ color: '#9b1c31', fontSize: '1.25rem' }} />
                            <h1 style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: '#1f2937',
                                margin: 0,
                                lineHeight: 1.2,
                            }}>Welcome Back</h1>
                        </div>

                        <p style={{
                            color: '#6b7280',
                            fontSize: '0.9rem',
                            marginBottom: '2rem',
                        }}>Sign in to your account to continue</p>

                        {error && (
                            <div style={{
                                marginBottom: '1rem',
                                padding: '0.75rem',
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                color: '#b91c1c',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: '#374151',
                                    marginBottom: '0.5rem',
                                }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '0.85rem',
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'none',
                                    }}>
                                        <FaUser style={{ color: '#9ca3af', fontSize: '0.85rem' }} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 1rem 0.7rem 2.5rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.95rem',
                                            color: '#1f2937',
                                            backgroundColor: '#f9fafb',
                                            outline: 'none',
                                            transition: 'border-color 0.2s, box-shadow 0.2s',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = '#9b1c31'
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(155, 28, 49, 0.1)'
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#d1d5db'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <label style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 500,
                                        color: '#374151',
                                    }}>Password</label>
                                    <a href="/forgot-password" style={{
                                        fontSize: '0.75rem',
                                        color: '#9b1c31',
                                        textDecoration: 'none',
                                        fontWeight: 500,
                                    }}
                                        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '0.85rem',
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'none',
                                    }}>
                                        <FaLock style={{ color: '#9ca3af', fontSize: '0.85rem' }} />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        placeholder="Enter your password"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.7rem 1rem 0.7rem 2.5rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.95rem',
                                            color: '#1f2937',
                                            backgroundColor: loading ? '#f3f4f6' : '#f9fafb',
                                            outline: 'none',
                                            transition: 'border-color 0.2s, box-shadow 0.2s',
                                            boxSizing: 'border-box',
                                        }}
                                        onFocus={(e) => {
                                            e.currentTarget.style.borderColor = '#9b1c31'
                                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(155, 28, 49, 0.1)'
                                        }}
                                        onBlur={(e) => {
                                            e.currentTarget.style.borderColor = '#d1d5db'
                                            e.currentTarget.style.boxShadow = 'none'
                                        }}
                                    />
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '0.85rem 1.5rem',
                                        background: loading
                                            ? 'linear-gradient(90deg, #b0434f 0%, #8a2535 100%)'
                                            : 'linear-gradient(90deg, #b91c1c 0%, #7f1d1d 100%)',
                                        color: '#fff',
                                        borderRadius: '0.5rem',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        border: 'none',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        boxShadow: '0 4px 14px rgba(185, 28, 28, 0.35)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        opacity: loading ? 0.7 : 1,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.transform = 'scale(1.02)'
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(185, 28, 28, 0.45)'
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)'
                                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(185, 28, 28, 0.35)'
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <FaSpinner style={{ fontSize: '0.875rem', animation: 'spin 1s linear infinite' }} />
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In <FaArrowRight style={{ fontSize: '0.8rem' }} />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            style={{ marginTop: '1.75rem', textAlign: 'center' }}
                        >
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                Don't have an account?{' '}
                                <a href="/signup" style={{
                                    color: '#9b1c31',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
                                >
                                    Create account
                                </a>
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Spinner keyframe animation */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}
