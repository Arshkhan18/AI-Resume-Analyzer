import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useAuth from '../hooks/useAuth'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, googleLogin } = useAuth()
    const navigate = useNavigate()
    const formRef = useRef(null)
    const googleBtnRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.auth-visual-text', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
            gsap.from('.auth-form-item', { y: 25, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 })
        }, formRef)
        return () => ctx.revert()
    }, [])

    // Google Sign-In handler
    const handleGoogleResponse = useCallback(async (response) => {
        setError('')
        setLoading(true)
        try {
            await googleLogin(response.credential)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Google sign-in failed.')
        } finally {
            setLoading(false)
        }
    }, [googleLogin, navigate])

    // Load Google Identity Services script
    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return
        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => {
            if (window.google && googleBtnRef.current) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleResponse,
                })
                window.google.accounts.id.renderButton(googleBtnRef.current, {
                    theme: 'filled_black',
                    size: 'large',
                    width: googleBtnRef.current.offsetWidth || 380,
                    text: 'signin_with',
                    shape: 'pill',
                })
            }
        }
        document.body.appendChild(script)
        return () => { if (script.parentNode) script.parentNode.removeChild(script) }
    }, [handleGoogleResponse])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div ref={formRef} className="min-h-screen flex">
            {/* Left — Visual Panel */}
            <div className="hidden lg:flex flex-1 mesh-animated dot-grid items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute top-10 right-10 w-80 h-80 bg-brand-purple/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 left-10 w-60 h-60 bg-brand-cyan/15 rounded-full blur-[100px]" />

                <div className="relative z-10 max-w-md">
                    <h2 className="auth-visual-text font-display text-4xl font-bold text-text-primary mb-4">
                        Welcome back to <span className="gradient-text">ResumeAI</span>
                    </h2>
                    <p className="auth-visual-text text-text-secondary font-body text-lg leading-relaxed mb-8">
                        Continue building smarter resumes and preparing for your dream job.
                    </p>

                    {/* Floating stats */}
                    <div className="auth-visual-text glass-card px-5 py-4 inline-flex items-center gap-3 animate-float">
                        <span className="text-2xl">📊</span>
                        <div>
                            <p className="text-text-primary font-mono font-bold text-lg">10,000+</p>
                            <p className="text-text-muted text-xs font-body">Resumes Analyzed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 lg:max-w-xl flex items-center justify-center p-8 bg-brand-bg-secondary">
                <div className="w-full max-w-md">
                    <div className="auth-form-item mb-8">
                        <Link to="/" className="font-display text-2xl font-bold text-text-primary hover:opacity-80 transition-opacity">
                            Resume<span className="text-brand-cyan">AI</span>
                        </Link>
                    </div>

                    <h1 className="auth-form-item font-heading text-2xl font-semibold text-text-primary mb-2">Sign in to your account</h1>
                    <p className="auth-form-item text-text-secondary text-sm font-body mb-8">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-cyan hover:underline">Create one</Link>
                    </p>

                    {error && (
                        <div className="auth-form-item bg-brand-danger/10 border border-brand-danger/30 text-brand-danger text-sm px-4 py-3 rounded-xl mb-6 font-body">
                            {error}
                        </div>
                    )}

                    {/* Google Sign-In Button */}
                    <div className="auth-form-item mb-4">
                        <div ref={googleBtnRef} className="w-full flex justify-center" />
                    </div>

                    {/* Divider */}
                    <div className="auth-form-item flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-text-muted text-xs font-body uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="auth-form-item">
                            <Input
                                label="Email Address"
                                type="email"
                                icon="✉"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                error={error && !email ? 'Email is required' : ''}
                                required
                            />
                        </div>
                        <div className="auth-form-item">
                            <Input
                                label="Password"
                                type="password"
                                icon="🔒"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                error={error && !password ? 'Password is required' : ''}
                                required
                            />
                        </div>
                        <div className="auth-form-item">
                            <Button type="submit" loading={loading} className="w-full py-3.5 text-base">
                                Sign In
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
