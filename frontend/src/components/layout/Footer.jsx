import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-brand-bg-secondary border-t border-brand-border">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="font-display text-xl font-bold text-text-primary">
                            Resume<span className="text-brand-cyan">AI</span>
                        </Link>
                        <p className="text-text-secondary text-sm font-body mt-3 max-w-xs">
                            AI-powered resume intelligence platform. Analyze, generate, and prepare with Gemini AI.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-heading text-sm font-semibold text-text-primary mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-text-secondary text-sm hover:text-brand-cyan transition-colors">Home</Link></li>
                            <li><a href="#features" className="text-text-secondary text-sm hover:text-brand-cyan transition-colors">Features</a></li>
                            <li><a href="#how-it-works" className="text-text-secondary text-sm hover:text-brand-cyan transition-colors">How It Works</a></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-heading text-sm font-semibold text-text-primary mb-4">Connect</h4>
                        <ul className="space-y-2">
                            <li><a href="https://github.com" target="_blank" rel="noopener" className="text-text-secondary text-sm hover:text-brand-cyan transition-colors">GitHub</a></li>
                            <li><a href="mailto:hello@resumeai.dev" className="text-text-secondary text-sm hover:text-brand-cyan transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-brand-border text-center">
                    <p className="text-text-muted text-xs font-body">
                        © {new Date().getFullYear()} ResumeAI. Built with Gemini AI.
                    </p>
                </div>
            </div>
        </footer>
    )
}
