import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'
import { selectCartCount } from '../store/cartSlice'
import { Menu, X, ShoppingCart, User, ChevronDown, Package, LogOut, Settings, LayoutDashboard, Printer } from 'lucide-react'
import clsx from 'clsx'

const navLinks = [
  { to: '/products', label: 'Products' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/upload', label: 'Upload Design' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isAuthenticated, user } = useSelector(s => s.auth)
  const cartCount = useSelector(selectCartCount)
  const dispatch = useDispatch(); const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleLogout = () => { dispatch(logout()); setUserMenuOpen(false); navigate('/') }

  return (
    <>
      <div className="bg-slate-900 text-slate-300 text-xs py-2 hidden md:block">
        <div className="page-container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span>📞 +91 98765 43210</span>
            <span>✉️ hello@print3d.com</span>
          </div>
          <div className="flex items-center gap-4">
            <span>🕐 Mon–Sat: 10:00 AM – 7:00 PM</span>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 font-medium">WhatsApp Us</a>
          </div>
        </div>
      </div>
      <header className={clsx('sticky top-0 z-50 transition-all duration-300 bg-white border-b border-slate-100', scrolled && 'shadow-sm')}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-btn group-hover:bg-primary-700 transition-colors">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900">Print<span className="text-primary-600">3D</span></span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} className={({ isActive }) =>
                  clsx('text-sm font-medium transition-colors duration-150 py-1 border-b-2', isActive ? 'text-primary-600 border-primary-600' : 'text-slate-600 border-transparent hover:text-primary-600 hover:border-primary-300')}>
                  {label}
                </NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link to="/cart" className="relative btn-ghost p-2">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold" style={{width:17,height:17}}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(v => !v)} className="flex items-center gap-2 btn-ghost py-1.5 px-3">
                    <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium hidden md:block max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={clsx('w-4 h-4 text-slate-400 transition-transform', userMenuOpen && 'rotate-180')} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 card py-1 z-50 shadow-xl" onMouseLeave={() => setUserMenuOpen(false)}>
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="font-semibold text-slate-800 text-sm">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 font-medium">
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <Package className="w-4 h-4" /> My Orders
                      </Link>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                        <Settings className="w-4 h-4" /> Profile
                      </Link>
                      <hr className="border-slate-100 my-1" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm py-2 px-4 hidden sm:flex">Login</Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
                </div>
              )}
              <button className="lg:hidden btn-ghost p-2" onClick={() => setMobileOpen(v => !v)}>
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white">
            <nav className="page-container py-4 flex flex-col gap-1">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => clsx('px-3 py-2.5 rounded-lg text-sm font-medium transition-colors', isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50')}>
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
