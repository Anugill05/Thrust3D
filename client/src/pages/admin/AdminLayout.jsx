import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/authSlice'
import { LayoutDashboard, Package, ShoppingBag, Users, MessageSquare, LogOut, Printer, ExternalLink, Menu, X } from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const NAV = [
  { to:'/admin',          icon:LayoutDashboard, label:'Dashboard', end:true },
  { to:'/admin/products', icon:Package,          label:'Products' },
  { to:'/admin/orders',   icon:ShoppingBag,      label:'Orders' },
  { to:'/admin/users',    icon:Users,            label:'Users' },
  { to:'/admin/contacts', icon:MessageSquare,    label:'Contacts' },
]

function SidebarContent({ onClose }) {
  const dispatch = useDispatch(); const navigate = useNavigate()
  const { user } = useSelector(s => s.auth)
  const handleLogout = () => { dispatch(logout()); navigate('/admin/login') }
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"><Printer className="w-5 h-5 text-white"/></div>
          <div><span className="font-display font-bold text-white text-base">Thrust3d</span><p className="text-slate-400 text-xs">Admin Panel</p></div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, icon:Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) => clsx('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', isActive ? 'bg-primary-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200')}>
            <Icon style={{width:17,height:17}}/>{label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-700 space-y-1">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-xl text-sm transition-colors">
          <ExternalLink className="w-4 h-4"/>View Website
        </a>
        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-xl text-sm transition-colors">
          <LogOut className="w-4 h-4"/>Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { user } = useSelector(s => s.auth)
  const [open, setOpen] = useState(false)
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-800 border-r border-slate-700 flex-shrink-0">
        <SidebarContent onClose={null}/>
      </aside>
      {/* Mobile sidebar */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60" onClick={()=>setOpen(false)}/>
          <aside className="relative w-60 bg-slate-800 flex flex-col h-full">
            <button onClick={()=>setOpen(false)} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5"/></button>
            <SidebarContent onClose={()=>setOpen(false)}/>
          </aside>
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-slate-500" onClick={()=>setOpen(true)}><Menu className="w-5 h-5"/></button>
            <h1 className="font-display font-semibold text-slate-800 text-sm hidden sm:block">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-bold text-sm">{user?.name?.[0]}</span>
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.name}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6"><Outlet/></main>
      </div>
    </div>
  )
}
