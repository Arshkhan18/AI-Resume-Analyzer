import { NavLink, Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/analyze', label: 'Analyze', icon: '🔍' },
    { path: '/generate', label: 'Generate', icon: '📝' },
    { path: '/study', label: 'Study', icon: '🎓' },
]

export default function Sidebar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-brand-bg-secondary border-r border-brand-border z-40">
                {/* Logo */}
                <div className="h-16 flex items-center px-6 border-b border-brand-border">
                    <Link to="/" className="font-display text-xl font-bold text-text-primary hover:opacity-80 transition-opacity">
                        Resume<span className="text-brand-cyan">AI</span>
                    </Link>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl font-heading text-sm transition-all duration-200 ${isActive
                                    ? 'sidebar-item-active bg-brand-cyan/8 text-brand-cyan'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5 hover:translate-x-1'
                                }`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-brand-border">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center text-brand-bg font-bold text-sm">
                            {user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-text-primary text-sm font-heading truncate">{user?.email || 'User'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left text-text-muted hover:text-brand-danger text-xs font-body transition-colors duration-200 px-1"
                    >
                        ← Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Tab Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-brand-bg-secondary/95 backdrop-blur-[20px] border-t border-brand-border z-40 flex">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-heading transition-colors duration-200 ${isActive ? 'text-brand-cyan' : 'text-text-muted'
                            }`
                        }
                    >
                        <span className="text-lg">{item.icon}</span>
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </>
    )
}
