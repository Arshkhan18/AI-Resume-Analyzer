import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const { token } = useAuth()
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Hide navbar on dashboard pages (sidebar handles nav)
    const dashboardPaths = ['/dashboard', '/analyze', '/generate', '/study']
    if (dashboardPaths.some(p => location.pathname.startsWith(p))) return null

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-brand-bg/90 backdrop-blur-[20px] border-b border-brand-border shadow-lg shadow-black/20'
                : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-1 font-display text-xl font-bold text-text-primary">
                    Resume<span className="text-brand-cyan">AI</span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="nav-link font-heading text-sm">Features</a>
                    <a href="#how-it-works" className="nav-link font-heading text-sm">How It Works</a>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {token ? (
                        <Link to="/dashboard" className="btn-primary text-sm">Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn-ghost text-sm">Login</Link>
                            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-text-primary p-2"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {mobileOpen ? (
                            <path d="M6 6l12 12M6 18L18 6" />
                        ) : (
                            <path d="M3 6h18M3 12h18M3 18h18" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-brand-bg-secondary/95 backdrop-blur-[20px] border-t border-brand-border px-6 py-4 space-y-4">
                    <a href="#features" className="block nav-link font-heading text-sm" onClick={() => setMobileOpen(false)}>Features</a>
                    <a href="#how-it-works" className="block nav-link font-heading text-sm" onClick={() => setMobileOpen(false)}>How It Works</a>
                    <div className="flex gap-3 pt-2">
                        {token ? (
                            <Link to="/dashboard" className="btn-primary text-sm w-full text-center" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Login</Link>
                                <Link to="/register" className="btn-primary text-sm flex-1 text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
