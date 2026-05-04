import { Loader2 } from 'lucide-react'

export function Spinner({ size = 'md', className = '' }) {
  const s = { sm:'w-4 h-4', md:'w-6 h-6', lg:'w-10 h-10' }
  return <div className={`flex items-center justify-center ${className}`}><Loader2 className={`${s[size]} text-primary-600 animate-spin`}/></div>
}
export function PageLoader() {
  return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-center"><Spinner size="lg"/><p className="text-slate-500 text-sm mt-3">Loading...</p></div></div>
}
export function PageHeader({ breadcrumb, title, subtitle }) {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 py-10">
      <div className="page-container">
        {breadcrumb && <p className="text-sm text-slate-500 mb-2">{breadcrumb}</p>}
        <h1 className="section-heading">{title}</h1>
        {subtitle && <p className="section-subheading text-base">{subtitle}</p>}
      </div>
    </div>
  )
}
export function EmptyState({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="text-center py-16">
      {Icon && <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Icon className="w-8 h-8 text-slate-400"/></div>}
      <h3 className="font-display font-semibold text-slate-800 text-lg mb-2">{title}</h3>
      {subtitle && <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">{subtitle}</p>}
      {action}
    </div>
  )
}
export function OrderStatusBadge({ status }) {
  const map = { pending:'badge-warning', confirmed:'badge-info', printing:'badge-primary', quality_check:'badge-info', shipped:'badge-info', delivered:'badge-success', cancelled:'badge-danger' }
  const labels = { pending:'Pending', confirmed:'Confirmed', printing:'Printing', quality_check:'Quality Check', shipped:'Shipped', delivered:'Delivered', cancelled:'Cancelled' }
  return <span className={`badge ${map[status]||'badge-grey'}`}>{labels[status]||status}</span>
}
export function PaymentStatusBadge({ status }) {
  const map = { pending:'badge-warning', processing:'badge-info', paid:'badge-success', failed:'badge-danger', refunded:'badge-grey' }
  return <span className={`badge ${map[status]||'badge-grey'} capitalize`}>{status}</span>
}
